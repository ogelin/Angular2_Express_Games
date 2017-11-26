import { dictionary } from "../data/dictionary";
export class Grid {

  public content = [
    ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""/**/, "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
  ];


  addWord(row: number, col: number, position: string, word: string) {
      let i = 0, j = 0;
      if (position === "h") {
        for (j = col; j < col + word.length; j++) {
          this.content[row][j] = word.charAt(i++);
        }
      }
      if (position === "v") {
        for (i = row; i < row + word.length; i++) {
          this.content[i][col] = word.charAt(j++);
        }
      }
  }

  returnLetter(row: number, col: number): string {
    return this.content[row][col];
  }

/* vérifie dans le dictionnaire si le mot est valide */
  validWord(word: string): boolean {
    let valid = false;
    if (dictionary.indexOf(word.toUpperCase()) > -1) {
      valid = true;
    }
    return valid;
  }

  validGridWords(grid: Array<Array<string>>): boolean {
    if (!this.validateRowWords(grid)){
      return false;
    }
    if (!this.validateRowWords(this.matrixTranspose(grid))){
      return false;
    }
    return true;
  }

  validateRowWords(grid: Array<Array<string>>): boolean {
    let word = "";
    for (let row = 0; row < 15; row++) {
      for (let col = 0; col < 15; col++) {
        if (grid[row][col] !== "") {
          //there's a word
          word += grid[row][col];
        }
        //end of word
        else if (grid[row][col] === "" && word.length > 1) { //if word length is one it's OK (single tile)
          //full word  is collected. check if it's valid.
          if (!this.validWord(word.trim().toUpperCase())) {
            return false;
          }
          else {
            word = "";
          }
        }
        else if (grid[row][col] === "" && word.length === 1) { //if word length is one it's OK (single tile)
          word = "";
        }
      }
      word = "";
    }
    return true;
  }

  matrixTranspose(grid: Array<Array<string>>): Array<Array<string>>{
    let copy = new Array<Array<string>>();
      for (let i = 0; i < 15; ++i) {
        copy.push(new Array<string>());
        for (let j = 0; j < 15; ++j) {
        copy[i].push(grid[j][i]);
    }
  }
    return copy;
  }

  copy(): Grid {
    let grid = new Grid();
    for (let i = 0; i < this.content.length; i++) {
      grid.content.push(new Array<string>());
      for (let j = 0; j < this.content[i].length; j++) {
        grid.content[i].push(this.content[i][j]);
      }
    }
    return grid;
  }

  gridIsEmpty(grid: Array<Array<string>>): boolean {
        for (let i = 0; i < 15; i++) {
            for (let j = 0; j < 15; j++) {
                if (grid[i][j] !== undefined && grid[i][j] !== '') {
                    return false;
                }
            }
        }
        return true;
  }

}


