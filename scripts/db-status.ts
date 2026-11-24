import dotenv from "dotenv";
dotenv.config();

import { getDatabaseUrl } from "../server/db/client.js";
import { getTableStatusCounts } from "../server/db/queries.js";

async function main() {
  try {
    getDatabaseUrl();
    console.log("🔍 [db:status] Đang kiểm tra trạng thái các bảng dữ liệu trên Neon PostgreSQL...\n");

    const counts = await getTableStatusCounts();

    console.log("┌───────────────────────────────────┬──────────────┐");
    console.log("│ Bảng dữ liệu (Table)              │ Số dòng (Rows)│");
    console.log("├───────────────────────────────────┼──────────────┤");
    console.log(`│ users                             │ ${String(counts.users).padStart(12)} │`);
    console.log(`│ companies                         │ ${String(counts.companies).padStart(12)} │`);
    console.log(`│ jobs                              │ ${String(counts.jobs).padStart(12)} │`);
    console.log(`│ saved_jobs                        │ ${String(counts.saved_jobs).padStart(12)} │`);
    console.log(`│ applications                      │ ${String(counts.applications).padStart(12)} │`);
    console.log("└───────────────────────────────────┴──────────────┘\n");

    console.log("✅ [db:status] Kết nối cơ sở dữ liệu hoạt động bình thường.");
    process.exit(0);
  } catch (err) {
    console.error("❌ [db:status] Lỗi kiểm tra trạng thái cơ sở dữ liệu:", err instanceof Error ? err.message : err);
    process.exit(1);
  }
}

main();
