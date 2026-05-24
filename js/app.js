const APP_CONFIG = window.APP_CONFIG || Object.freeze({
    version: '0.0.0-dev',
    exportSchemaVersion: 1
});
const APP_VERSION = APP_CONFIG.version;
const EXPORT_SCHEMA_VERSION = APP_CONFIG.exportSchemaVersion;

const INITIAL_STATE = {
    font: "'Segoe UI', sans-serif",
    fontSize: 14,
    padding: 6,
    cellHeight: 17,
    cells: [
        'Krátký text',
        'Středně dlouhý štítek',
        'Další položka',
        'Tady je velmi dlouhý text, který otestuje zalomení',
        'A zpět krátký'
    ]
};

const MIN_FONT_SIZE = 6;
const MAX_FONT_SIZE = 72;
const MIN_PADDING = 0;
const MAX_PADDING = 50;
const MIN_CELL_HEIGHT = 5;
const MAX_CELL_HEIGHT = 100;
const MAX_CELL_COUNT = 200;
const MAX_CELL_TEXT_LENGTH = 500;
const DEFAULT_NEW_CELL_TEXT = 'Nový štítek';
const PRINT_PAGE_HEIGHT_MM = 277;
const PRINT_OVERFLOW_TOLERANCE_PX = 4;

const grid = document.getElementById('grid');
const root = document.documentElement;
const fontSelect = document.getElementById('font-select');
const sizeDisplay = document.getElementById('size-display');
const paddingDisplay = document.getElementById('padding-display');
const heightDisplay = document.getElementById('height-display');
const stateFileInput = document.getElementById('state-file-input');
const statusMessage = document.getElementById('status-message');
const printWarning = document.getElementById('print-warning');
const appVersion = document.getElementById('app-version');

let currentFontSize = INITIAL_STATE.fontSize;
let currentPadding = INITIAL_STATE.padding;
let currentCellHeight = INITIAL_STATE.cellHeight;

function setStatus(message, state = 'info') {
    statusMessage.textContent = message;
    statusMessage.dataset.state = state;
}

function setPrintWarning(message = '') {
    printWarning.textContent = message;
}

function measureMillimeters(mm) {
    const probe = document.createElement('div');
    probe.style.position = 'absolute';
    probe.style.visibility = 'hidden';
    probe.style.pointerEvents = 'none';
    probe.style.height = mm + 'mm';
    probe.style.width = '1mm';
    document.body.appendChild(probe);
    const pixels = probe.getBoundingClientRect().height;
    probe.remove();
    return pixels;
}

function estimatePrintPages() {
    const pageHeightPx = measureMillimeters(PRINT_PAGE_HEIGHT_MM);
    const contentHeightPx = Math.max(grid.scrollHeight, Math.ceil(grid.getBoundingClientRect().height));

    if (!pageHeightPx) {
        return 1;
    }

    return Math.max(1, Math.ceil((contentHeightPx - PRINT_OVERFLOW_TOLERANCE_PX) / pageHeightPx));
}

function refreshPrintWarning() {
    const estimatedPages = estimatePrintPages();

    if (estimatedPages > 1) {
        const pagesWord = estimatedPages <= 4 ? 'strany' : 'stran';
        setPrintWarning('Odhad tisku: ' + estimatedPages + ' ' + pagesWord + '.');
    } else {
        setPrintWarning('');
    }

    return estimatedPages;
}

function sanitizeFont(font) {
    return Array.from(fontSelect.options).some((option) => option.value === font)
        ? font
        : INITIAL_STATE.font;
}

function extractCellText(cell) {
    const clone = cell.cloneNode(true);
    clone.querySelectorAll('.cell-delete-btn').forEach((btn) => btn.remove());
    return clone.textContent.replace(/\u00A0/g, ' ').trim();
}

function createCell(content = DEFAULT_NEW_CELL_TEXT) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.contentEditable = 'true';
    cell.spellcheck = false;

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'cell-delete-btn';
    deleteBtn.setAttribute('contenteditable', 'false');
    deleteBtn.title = 'Odstranit štítek';
    deleteBtn.setAttribute('aria-label', 'Odstranit štítek');
    deleteBtn.textContent = '×';
    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        deleteCell(cell);
    });

    cell.innerText = content || '\u00A0';
    cell.appendChild(deleteBtn);
    addListenersToCell(cell, deleteBtn);
    return cell;
}

function renderCells(cells) {
    grid.innerHTML = '';
    cells.forEach((content) => {
        grid.appendChild(createCell(content));
    });
    refreshPrintWarning();
}

function getAppState() {
    return {
        schemaVersion: EXPORT_SCHEMA_VERSION,
        appVersion: APP_VERSION,
        font: sanitizeFont(fontSelect.value),
        fontSize: currentFontSize,
        padding: currentPadding,
        cellHeight: currentCellHeight,
        cells: Array.from(grid.querySelectorAll('.cell')).map(extractCellText)
    };
}

function applyFormatting(state) {
    const safeFont = sanitizeFont(state.font);
    currentFontSize = Math.min(MAX_FONT_SIZE, Math.max(MIN_FONT_SIZE, Number(state.fontSize) || INITIAL_STATE.fontSize));
    currentPadding = Math.min(MAX_PADDING, Math.max(MIN_PADDING, Number(state.padding) || INITIAL_STATE.padding));
    currentCellHeight = Math.min(MAX_CELL_HEIGHT, Math.max(MIN_CELL_HEIGHT,
        Number.isFinite(Number(state.cellHeight)) ? Number(state.cellHeight) : currentCellHeight
    ));

    fontSelect.value = safeFont;
    root.style.setProperty('--cell-font', safeFont);
    root.style.setProperty('--cell-font-size', currentFontSize + 'pt');
    root.style.setProperty('--cell-padding', currentPadding + 'mm');
    root.style.setProperty('--cell-height', currentCellHeight + 'mm');
    sizeDisplay.innerText = currentFontSize + ' pt';
    paddingDisplay.innerText = currentPadding + ' mm';
    heightDisplay.innerText = currentCellHeight + ' mm';
}

function normalizeState(rawState) {
    if (!rawState || typeof rawState !== 'object') {
        throw new Error('Soubor neobsahuje platný stav aplikace.');
    }

    if (!Array.isArray(rawState.cells)) {
        throw new Error('V souboru chybí seznam štítků.');
    }

    const schemaVersion = Number.isFinite(Number(rawState.schemaVersion))
        ? Number(rawState.schemaVersion)
        : Number.isFinite(Number(rawState.version))
            ? Number(rawState.version)
            : EXPORT_SCHEMA_VERSION;

    return {
        schemaVersion,
        appVersion: typeof rawState.appVersion === 'string' ? rawState.appVersion : null,
        font: typeof rawState.font === 'string' ? rawState.font : INITIAL_STATE.font,
        fontSize: Number.isFinite(Number(rawState.fontSize)) ? Number(rawState.fontSize) : INITIAL_STATE.fontSize,
        padding: Number.isFinite(Number(rawState.padding)) ? Number(rawState.padding) : INITIAL_STATE.padding,
        cellHeight: Number.isFinite(Number(rawState.cellHeight)) ? Number(rawState.cellHeight) : INITIAL_STATE.cellHeight,
        cells: rawState.cells
            .slice(0, MAX_CELL_COUNT)
            .map((cell) => (typeof cell === 'string' ? cell.slice(0, MAX_CELL_TEXT_LENGTH) : ''))
    };
}

function applyAppState(state, options = {}) {
    applyFormatting(state);
    renderCells(state.cells.length > 0 ? state.cells : INITIAL_STATE.cells);

    if (options.focusFirstCell) {
        const firstCell = grid.querySelector('.cell');
        if (firstCell) {
            firstCell.focus();
        }
    }
}

// --- Správa buněk ---
function addCell() {
    const newCell = createCell();
    grid.appendChild(newCell);
    refreshPrintWarning();
    setStatus('Přidán nový štítek. Nezapomeňte změny uložit.', 'dirty');
    newCell.focus();
}

function removeLastCell() {
    const cells = grid.querySelectorAll('.cell');
    if (cells.length > 1) {
        cells[cells.length - 1].remove();
        const remaining = grid.querySelectorAll('.cell');
        remaining[remaining.length - 1].focus();
        refreshPrintWarning();
        setStatus('Poslední štítek byl odebrán.', 'dirty');
        return;
    }

    setStatus('Musí zůstat alespoň jeden štítek.', 'error');
}

function deleteCell(cell) {
    const cells = grid.querySelectorAll('.cell');
    if (cells.length <= 1) {
        setStatus('Musí zůstat alespoň jeden štítek.', 'error');
        return;
    }
    cell.remove();
    refreshPrintWarning();
    setStatus('Štítek byl odebrán.', 'dirty');
}

function addListenersToCell(cell, deleteBtn) {
    cell.addEventListener('focus', () => {
        setStatus('Upravujete obsah štítku.', 'info');
    });

    cell.addEventListener('input', () => {
        if (deleteBtn && !cell.contains(deleteBtn)) {
            cell.appendChild(deleteBtn);
        }
        refreshPrintWarning();
        setStatus('Máte neuložené změny.', 'dirty');
    });

    cell.addEventListener('blur', () => {
        if (extractCellText(cell) === '') {
            cell.textContent = '';
            cell.appendChild(document.createTextNode('\u00A0'));
            if (deleteBtn) cell.appendChild(deleteBtn);
        }
    });
}

// --- Správa formátování (CSS Proměnné) ---
function updateFont() {
    applyFormatting({
        font: fontSelect.value,
        fontSize: currentFontSize,
        padding: currentPadding
    });
    refreshPrintWarning();
    setStatus('Font byl změněn. Nezapomeňte změny uložit.', 'dirty');
}

function changeFontSize(delta) {
    applyFormatting({
        font: fontSelect.value,
        fontSize: currentFontSize + delta,
        padding: currentPadding
    });
    refreshPrintWarning();
    setStatus('Velikost textu byla upravena.', 'dirty');
}

function changePadding(delta) {
    applyFormatting({
        font: fontSelect.value,
        fontSize: currentFontSize,
        padding: currentPadding + delta
    });
    refreshPrintWarning();
    setStatus('Okraje štítků byly upraveny.', 'dirty');
}

function changeCellHeight(delta) {
    applyFormatting({
        font: fontSelect.value,
        fontSize: currentFontSize,
        padding: currentPadding,
        cellHeight: currentCellHeight + delta
    });
    refreshPrintWarning();
    setStatus('Výška štítků byla upravena.', 'dirty');
}

function triggerPrint() {
    refreshPrintWarning();
    setStatus('Otevírám tiskový náhled.', 'info');
    window.print();
}

function buildFileName() {
    const now = new Date();
    const parts = [
        now.getFullYear(),
        String(now.getMonth() + 1).padStart(2, '0'),
        String(now.getDate()).padStart(2, '0')
    ];
    const time = [
        String(now.getHours()).padStart(2, '0'),
        String(now.getMinutes()).padStart(2, '0'),
        String(now.getSeconds()).padStart(2, '0')
    ];

    return 'flexistitek-' + parts.join('') + '-' + time.join('') + '.json';
}

function saveStateToFile() {
    const blob = new Blob([JSON.stringify(getAppState(), null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');

    downloadLink.href = url;
    downloadLink.download = buildFileName();
    document.body.appendChild(downloadLink);
    downloadLink.click();
    downloadLink.remove();
    URL.revokeObjectURL(url);

    setStatus('Aktuální stav byl uložen do JSON souboru.', 'success');
}

function openStateFilePicker() {
    stateFileInput.value = '';
    stateFileInput.click();
}

function resetApp() {
    if (!window.confirm('Opravdu chcete vrátit aplikaci do výchozího stavu?')) {
        return;
    }

    applyAppState(INITIAL_STATE, { focusFirstCell: true });
    setStatus('Aplikace byla vrácena do výchozího stavu.', 'success');
}

function handleStateFileSelection(event) {
    const [file] = event.target.files;
    if (!file) {
        return;
    }

    const reader = new FileReader();

    reader.onload = () => {
        try {
            const parsedState = JSON.parse(String(reader.result));
            const safeState = normalizeState(parsedState);
            applyAppState(safeState, { focusFirstCell: true });
            const importedVersion = safeState.appVersion ? ' z verze ' + safeState.appVersion : '';
            setStatus('Stav byl načten ze souboru' + importedVersion + ' a aplikován.', 'success');
        } catch (error) {
            setStatus(error.message || 'Soubor se nepodařilo načíst.', 'error');
        }
    };

    reader.onerror = () => {
        setStatus('Soubor se nepodařilo přečíst.', 'error');
    };

    reader.readAsText(file, 'utf-8');
}

function initializeApp() {
    applyAppState(INITIAL_STATE);
    stateFileInput.addEventListener('change', handleStateFileSelection);
    appVersion.textContent = 'Verze ' + APP_VERSION;
    document.title = 'FlexiŠtítek v' + APP_VERSION;
    refreshPrintWarning();
    setStatus('Připraveno k úpravám.', 'info');

    document.getElementById('btn-add').addEventListener('click', addCell);
    document.getElementById('btn-remove').addEventListener('click', removeLastCell);
    document.getElementById('font-select').addEventListener('change', updateFont);
    document.getElementById('btn-size-dec').addEventListener('click', () => changeFontSize(-1));
    document.getElementById('btn-size-inc').addEventListener('click', () => changeFontSize(1));
    document.getElementById('btn-padding-dec').addEventListener('click', () => changePadding(-1));
    document.getElementById('btn-padding-inc').addEventListener('click', () => changePadding(1));
    document.getElementById('btn-height-dec').addEventListener('click', () => changeCellHeight(-1));
    document.getElementById('btn-height-inc').addEventListener('click', () => changeCellHeight(1));
    document.getElementById('btn-save').addEventListener('click', saveStateToFile);
    document.getElementById('btn-load').addEventListener('click', openStateFilePicker);
    document.getElementById('btn-reset').addEventListener('click', resetApp);
    document.getElementById('btn-print').addEventListener('click', triggerPrint);

    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            saveStateToFile();
        }
    });
}

initializeApp();