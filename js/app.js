        const grid = document.getElementById('grid');
        const root = document.documentElement;

        // --- Správa buněk ---
        function addCell() {
            const newCell = document.createElement('div');
            newCell.className = 'cell';
            newCell.contentEditable = "true";
            newCell.innerText = "Nový štítek";
            grid.appendChild(newCell);
            addListenersToCell(newCell);
        }

        function removeLastCell() {
            const cells = grid.querySelectorAll('.cell');
            if (cells.length > 0) {
                cells[cells.length - 1].remove();
            }
        }

        function addListenersToCell(cell) {
            cell.addEventListener('blur', () => {
                if(cell.innerText.trim() === '') {
                    cell.innerText = '\u00A0';
                }
            });
        }

        document.querySelectorAll('.cell').forEach(addListenersToCell);

        // --- Správa formátování (CSS Proměnné) ---
        let currentFontSize = 14;
        let currentPadding = 6;

        function updateFont() {
            const selectedFont = document.getElementById('font-select').value;
            root.style.setProperty('--cell-font', selectedFont);
        }

        function changeFontSize(delta) {
            currentFontSize += delta;
            if (currentFontSize < 6) currentFontSize = 6; // Ochrana proti příliš malému textu
            
            root.style.setProperty('--cell-font-size', currentFontSize + 'pt');
            document.getElementById('size-display').innerText = currentFontSize + ' pt';
        }

        function changePadding(delta) {
            currentPadding += delta;
            if (currentPadding < 0) currentPadding = 0; // Ochrana proti záporným okrajům
            
            root.style.setProperty('--cell-padding', currentPadding + 'mm');
            document.getElementById('padding-display').innerText = currentPadding + ' mm';
        }