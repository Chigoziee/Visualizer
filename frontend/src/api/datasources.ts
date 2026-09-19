import { apiGet } from "./client";
import type { SampleRowsOut, SchemaOut, TableInfo } from "../types/datasource";

export function listTables(connectionId: number) {
  return apiGet<TableInfo[]>(`/connections/${connectionId}/tables`);
}

export function getSchema(connectionId: number, tableName: string) {
  return apiGet<SchemaOut>(`/connections/${connectionId}/tables/${encodeURIComponent(tableName)}/schema`);
}

export function getSample(connectionId: number, tableName: string) {
  return apiGet<SampleRowsOut>(`/connections/${connectionId}/tables/${encodeURIComponent(tableName)}/sample`);
}
