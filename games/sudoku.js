class Sudoku {    
    constructor() {
        this.board = Array(9).fill().map(() => Array(9).fill(0));
        this.solution = Array(9).fill().map(() => Array(9).fill(0));
        this.selectedCell = null;
        this.startTime = null;
        this.timerInterval = null;
        this.initializeGame();
    }

    initializeGame() {
        this.generateBoard();
        this.setupEventListeners();
        this.startTimer();
    }

    generateBoard() {
        // Generate a solved board
        this.solve(this.solution);
        
        // Create a playable board by removing numbers
        this.board = this.solution.map(row => [...row]);
        this.removeNumbers();
        
        this.renderBoard();
    }

    solve(board) {
        const empty = this.findEmpty(board);
        if (!empty) return true;
        
        const [row, col] = empty;
        const numbers = this.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        
        for (const num of numbers) {
            if (this.isValid(board, row, col, num)) {
                board[row][col] = num;
                if (this.solve(board)) return true;
                board[row][col] = 0;
            }
        }
        return false;
    }

    findEmpty(board) {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (board[row][col] === 0) return [row, col];
            }
        }
        return null;
    }

    isValid(board, row, col, num) {
        // Check row
        for (let x = 0; x < 9; x++) {
            if (board[row][x] === num) return false;
        }
        
        // Check column
        for (let x = 0; x < 9; x++) {
            if (board[x][col] === num) return false;
        }
        
        // Check 3x3 box
        const boxRow = Math.floor(row / 3) * 3;
        const boxCol = Math.floor(col / 3) * 3;
        for (let x = 0; x < 3; x++) {
            for (let y = 0; y < 3; y++) {
                if (board[boxRow + x][boxCol + y] === num) return false;
            }
        }
        
        return true;
    }

    shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    removeNumbers() {
        // Remove numbers to create a puzzle
        let cellsToRemove = 45; // Adjust for difficulty
        while (cellsToRemove > 0) {
            const row = Math.floor(Math.random() * 9);
            const col = Math.floor(Math.random() * 9);
            if (this.board[row][col] !== 0) {
                this.board[row][col] = 0;
                cellsToRemove--;
            }
        }
    }

    renderBoard() {
        const gameBoard = document.getElementById('game-board');
        gameBoard.innerHTML = '';
        
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = row;
                cell.dataset.col = col;
                
                if (this.board[row][col] !== 0) {
                    cell.textContent = this.board[row][col];
                    cell.classList.add('fixed');
                }
                
                cell.addEventListener('click', () => this.selectCell(cell));
                gameBoard.appendChild(cell);
            }
        }
    }

    selectCell(cell) {
        if (cell.classList.contains('fixed')) return;
        
        // Remove selection from previous cell
        if (this.selectedCell) {
            this.selectedCell.classList.remove('selected');
        }
        
        // Select new cell
        this.selectedCell = cell;
        cell.classList.add('selected');
    }

    setupEventListeners() {
        // Number pad buttons
        document.querySelectorAll('.number-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if (!this.selectedCell) return;
                
                const num = parseInt(btn.dataset.number);
                const row = parseInt(this.selectedCell.dataset.row);
                const col = parseInt(this.selectedCell.dataset.col);
                
                this.selectedCell.textContent = num;
                this.board[row][col] = num;
                
                // Check if the number is correct
                if (num !== this.solution[row][col]) {
                    this.selectedCell.classList.add('error');
                } else {
                    this.selectedCell.classList.remove('error');
                }
                
                // Check if the game is complete
                if (this.isComplete()) {
                    this.endGame();
                }
            });
        });
        
        // Clear button
        document.getElementById('clear').addEventListener('click', () => {
            if (!this.selectedCell || this.selectedCell.classList.contains('fixed')) return;
            
            const row = parseInt(this.selectedCell.dataset.row);
            const col = parseInt(this.selectedCell.dataset.col);
            
            this.selectedCell.textContent = '';
            this.selectedCell.classList.remove('error');
            this.board[row][col] = 0;
        });
        
        // New game button
        document.getElementById('new-game').addEventListener('click', () => {
            this.resetGame();
        });
        
        // Solve button
        document.getElementById('solve').addEventListener('click', () => {
            // Fill the board with the solution
            for (let row = 0; row < 9; row++) {
                for (let col = 0; col < 9; col++) {
                    this.board[row][col] = this.solution[row][col];
                    const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
                    if (cell) {
                        cell.textContent = this.solution[row][col];
                        cell.classList.remove('error');
                    }
                }
            }
            this.endGame();
        });
        
        // Window controls
        document.getElementById('minimize').addEventListener('click', () => {
            // Implement minimize functionality
        });
        
        document.getElementById('maximize').addEventListener('click', () => {
            // Implement maximize functionality
        });
        
        document.getElementById('close').addEventListener('click', () => {
            window.close();
        });
    }

    isComplete() {
        // Check if all cells are filled
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (this.board[row][col] === 0) {
                    return false;
                }
            }
        }

        // Check if all numbers are correct
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (this.board[row][col] !== this.solution[row][col]) {
                    return false;
                }
            }
        }
        return true;
    }

    startTimer() {
        this.startTime = Date.now();
        this.timerInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
            const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
            const seconds = (elapsed % 60).toString().padStart(2, '0');
            document.getElementById('timer').textContent = `${minutes}:${seconds}`;
        }, 1000);
    }

    endGame() {
        clearInterval(this.timerInterval);
        this.playWinEffect();
    }

    playWinEffect() {
        const effects = [
            this.colorFlashEffect,
            this.confettiEffect
        ];
        
        // Play a random effect
        const randomEffect = effects[Math.floor(Math.random() * effects.length)];
        randomEffect.call(this);
    }

    colorFlashEffect() {
        const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
        const cells = document.querySelectorAll('.cell');
        let flashCount = 0;
        
        const flash = () => {
            if (flashCount >= 10) {
                cells.forEach(cell => {
                    cell.style.backgroundColor = '#c0c0c0';
                    cell.style.color = '#000000';
                });
                return;
            }
            
            const color = colors[Math.floor(Math.random() * colors.length)];
            cells.forEach(cell => {
                cell.style.backgroundColor = color;
                cell.style.color = '#ffffff';
            });
            
            flashCount++;
            setTimeout(flash, 200);
        };
        
        flash();
    }

    confettiEffect() {
        const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
        const confettiContainer = document.createElement('div');
        confettiContainer.style.position = 'fixed';
        confettiContainer.style.top = '0';
        confettiContainer.style.left = '0';
        confettiContainer.style.width = '100%';
        confettiContainer.style.height = '100%';
        confettiContainer.style.pointerEvents = 'none';
        confettiContainer.style.zIndex = '1000';
        document.body.appendChild(confettiContainer);
        
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'absolute';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.top = '-10px';
            confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
            confettiContainer.appendChild(confetti);
            
            const animation = confetti.animate([
                { top: '-10px', transform: `rotate(${Math.random() * 360}deg)` },
                { top: '100%', transform: `rotate(${Math.random() * 360}deg)` }
            ], {
                duration: 2000 + Math.random() * 3000,
                easing: 'cubic-bezier(0.1, 0.2, 0.3, 1)'
            });
            
            animation.onfinish = () => confetti.remove();
        }
        
        setTimeout(() => confettiContainer.remove(), 5000);
    }

    resetGame() {
        clearInterval(this.timerInterval);
        this.board = Array(9).fill().map(() => Array(9).fill(0));
        this.solution = Array(9).fill().map(() => Array(9).fill(0));
        this.selectedCell = null;
        this.generateBoard();
        this.startTimer();
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new Sudoku();
}); 