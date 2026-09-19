export interface TableInfo {
  name: string;
}

export interface ColumnInfo {
  name: string;
  dtype: string;
}

export interface SchemaOut {
  table_name: string;
  columns: ColumnInfo[];
}

export interface SampleRowsOut {
  table_name: string;
  rows: Record<string, unknown>[];
}
