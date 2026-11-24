import { Pool, type PoolClient } from "@neondatabase/serverless";
import dotenv from "dotenv";

dotenv.config();

/**
 * Lấy chuỗi kết nối DATABASE_URL và kiểm tra tính hợp lệ
 */
export function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) {
    console.error("\n❌ [LỖI CẤU HÌNH] DATABASE_URL chưa được thiết lập!");
    console.error("Vui lòng cấu hình chuỗi kết nối Neon PostgreSQL trong tệp .env cục bộ:");
    console.error("DATABASE_URL=postgresql://<user>:<password>@<host>/<database>?sslmode=require\n");
    throw new Error(
      "DATABASE_URL chưa được cấu hình. Hệ thống không sử dụng database thay thế cục bộ theo quy tắc bảo đảm tính tương thích Vercel."
    );
  }
  return url;
}

// Khởi tạo Pool dùng chung cho toàn bộ ứng dụng
let poolInstance: Pool | null = null;

export function getPool(): Pool {
  if (!poolInstance) {
    const connectionString = getDatabaseUrl();
    poolInstance = new Pool({ connectionString });
  }
  return poolInstance;
}

export const pool = {
  query: (text: string, params?: unknown[]) => getPool().query(text, params),
  connect: () => getPool().connect(),
  end: () => poolInstance?.end(),
};

/**
 * Thực thi truy vấn SQL với tham số an toàn (parameterized query)
 */
export async function query<T = unknown>(
  sql: string,
  params: unknown[] = []
): Promise<T[]> {
  const res = await getPool().query(sql, params);
  return res.rows as T[];
}

/**
 * Thực thi một tập hợp câu lệnh bên trong một Database Transaction
 */
export async function withTransaction<T>(
  callback: (client: PoolClient) => Promise<T>
): Promise<T> {
  const client = await getPool().connect();
  try {
    await client.query("BEGIN");
    const result = await callback(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
