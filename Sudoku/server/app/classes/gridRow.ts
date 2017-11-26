export class GridRow {
  rowValue: Array<RowValue> = [];

  constructor(rowValue: Array<RowValue>) {
    this.rowValue = rowValue;
  }

  createGrid(puzzle: number[]): Array<GridRow> {
    let index = 0;
    let grid = new Array<GridRow>();
    for (let row = 0; row < 9; row++) {
      grid.push(new GridRow([]));
      for (let col = 0; col < 9; col++) {
        grid[row].rowValue.push(new RowValue(puzzle[index]));
        index++;
      }
    }

    return grid;
  }
}

export class RowValue {
  value: number;
  isReadOnly: boolean;

  constructor(value: number, isReadOnly?: boolean) {
    this.value = value;
    this.isReadOnly = (isReadOnly === undefined) ? true : isReadOnly;
  }

}
