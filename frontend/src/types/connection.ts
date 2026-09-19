export type ConnectionType = "postgres" | "mysql" | "mongodb" | "csv";

export interface ConnectionOut {
  id: number;
  name: string;
  type: ConnectionType;
  host: string | null;
  port: number | null;
  database: string | null;
  username: string | null;
  file_name: string | null;
  created_at: string;
  updated_at: string;
  last_tested_at: string | null;
  last_test_status: "success" | "error" | null;
}

export interface ConnectionCreate {
  name: string;
  type: Exclude<ConnectionType, "csv">;
  config: Record<string, unknown>;
}

export interface ConnectionUpdate {
  name?: string;
  config?: Record<string, unknown>;
}

export interface ConnectionTestResult {
  success: boolean;
  message: string;
}
