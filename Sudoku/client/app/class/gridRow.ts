export class GridRow {
  rowValue: Array<RowValue>;

  constructor(rowValue: Array<RowValue>) {
    this.rowValue = rowValue;
  }
}

export class RowValue {
  value: number;
  isReadOnly: boolean;

  constructor(value: number, isReadOnly: boolean) {
    this.value = value;
    this.isReadOnly = isReadOnly;
  }
}
