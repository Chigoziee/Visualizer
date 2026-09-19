import { useQuery } from "@tanstack/react-query";

import * as datasourcesApi from "../api/datasources";

export function useTables(connectionId: number | undefined) {
  return useQuery({
    queryKey: ["tables", connectionId],
    queryFn: () => datasourcesApi.listTables(connectionId!),
    enabled: connectionId !== undefined,
  });
}

export function useSchema(connectionId: number | undefined, tableName: string | undefined) {
  return useQuery({
    queryKey: ["schema", connectionId, tableName],
    queryFn: () => datasourcesApi.getSchema(connectionId!, tableName!),
    enabled: connectionId !== undefined && tableName !== undefined,
  });
}

export function useSample(connectionId: number | undefined, tableName: string | undefined) {
  return useQuery({
    queryKey: ["sample", connectionId, tableName],
    queryFn: () => datasourcesApi.getSample(connectionId!, tableName!),
    enabled: connectionId !== undefined && tableName !== undefined,
  });
}
