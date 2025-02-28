
export class Map {
    constructor(cellsX, cellsY) {
        this.grid = this.createGrid(cellsX, cellsY);
    }
    
    createGrid(cellsX, cellsY) {
        const grid = new Array(cellsX);
        for (let i = 0; i < cellsX; i++) {
            grid[i] = new Array(cellsY);
            for (let j = 0; j < cellsY; j++) {
                grid[i][j] = {
                    floor: null,
                    occupant: null,
                }
            }
        }
        return grid;
    }

}
