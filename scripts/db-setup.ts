import dotenv from "dotenv";
dotenv.config();

import { query, getDatabaseUrl } from "../server/db/client.js";
import { CREATE_TABLES_SQL } from "../server/db/schema.js";

async function main() {
  try {
    getDatabaseUrl();
    console.log("[db:setup] Đang thiết lập cấu trúc cơ sở dữ liệu ViệcSV trên Neon PostgreSQL...");
    await query(CREATE_TABLES_SQL);
    console.log("✅ [db:setup] Đã thiết lập xong các bảng dữ liệu và chỉ mục thành công!");
    process.exit(0);
  } catch (err) {
    console.error("❌ [db:setup] Lỗi thiết lập cơ sở dữ liệu:", err instanceof Error ? err.message : err);
    process.exit(1);
  }
}

main();
