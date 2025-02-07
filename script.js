const N = 9;
const gridElement = document.getElementById("sudoku-grid");

// Dynamically create the Sudoku grid
for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
        const cell = document.createElement("input");
        cell.type = "number";
        cell.min = "1";
        cell.max = "9";
        cell.classList.add("cell");
        cell.id = `cell-${i}-${j}`;
        gridElement.appendChild(cell);
    }
}

// Helper function to check if num is safe to place in grid[row][col]
function isSafe(grid, row, col, num) {
    for (let x = 0; x < N; x++) {
        if (grid[row][x] === num || grid[x][col] === num) 
        return false;
    }

    const startRow = row - (row % 3);
    const startCol = col - (col % 3);

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (grid[i + startRow][j + startCol] === num) 
                return false;
        }
    }

    return true;
}

// Recursive function to solve the Sudoku
function solve(grid, row, col) {
    if (row === N - 1 && col === N) return true;

    if (col === N) {
        row++;
        col = 0;
    }

    if (grid[row][col] > 0) return solve(grid, row, col + 1);

    for (let num = 1; num <= N; num++) {
        if (isSafe(grid, row, col, num)) {
            grid[row][col] = num;

            if (solve(grid, row, col + 1)) return true;

            grid[row][col] = 0;
        }
    }

    return false;
}

// Get the grid values from the input fields
function getInputGrid() {
    const inputGrid = Array.from({ length: N }, () => Array(N).fill(0));

    for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
            const value = document.getElementById(`cell-${i}-${j}`).value;
            inputGrid[i][j] = value ? parseInt(value) : 0;
        }
    }

    return inputGrid;
}

// Display the solved grid in the input fields
function displayGrid(solvedGrid) {
    for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
            const cell = document.getElementById(`cell-${i}-${j}`);
           if (!cell.value) {
                // If the cell was empty (filled by solver), make it normal font
                cell.classList.add("output");
                cell.classList.remove("input");
            } else {
                // If the cell was pre-filled by the user, keep it bold
                cell.classList.remove("output");
                cell.classList.add("input");
            }
            cell.value = solvedGrid[i][j];
        }
    }
}

// Validate the input Sudoku grid
function isValidGrid(grid) {
    const hasDuplicates = (arr) => {
        const seen = new Set();
        for (let num of arr) {
            if (num > 0) {
                if (seen.has(num)) return true;
                seen.add(num);
            }
        }
        return false;
    };

    // Check rows
    for (let i = 0; i < N; i++) {
        const row = grid[i];
        if (hasDuplicates(row)) return false;
    }

    // Check columns
    for (let j = 0; j < N; j++) {
        const col = grid.map((row) => row[j]);
        if (hasDuplicates(col)) return false;
    }

    // Check 3x3 sub-grids
    for (let startRow = 0; startRow < N; startRow += 3) {
        for (let startCol = 0; startCol < N; startCol += 3) {
            const subGrid = [];
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    subGrid.push(grid[startRow + i][startCol + j]);
                }
            }
            if (hasDuplicates(subGrid)) return false;
        }
    }

    return true;
}

// Solve the Sudoku and display the result
function solveSudoku() {
    const inputGrid = getInputGrid();

    // Check if the grid is completely empty
    const isEmpty = inputGrid.every((row) => row.every((cell) => cell === 0));
    if (isEmpty) {
        alert("No numbers filled! Please fill in some numbers before solving.");
        return;
    }

    // Validate the grid
    if (!isValidGrid(inputGrid)) {
        alert("Invalid Sudoku grid! Check for duplicate numbers in rows, columns, or sub-grids.");
        return;
    }

    // Solve the Sudoku
    if (solve(inputGrid, 0, 0)) {
        displayGrid(inputGrid);
    } else {
        alert("No solution exists.");
    }
}

// Reset the grid to empty
function resetGrid() {
    for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
            const cell = document.getElementById(`cell-${i}-${j}`);
            cell.value = "";
            cell.classList.remove("output"); // Remove output style on reset
        }
    }
}