import dotenv from "dotenv";
dotenv.config();

import { getDatabaseUrl } from "../server/db/client.js";
import { runSeed } from "../server/seed/seed-runner.js";

async function main() {
  try {
    getDatabaseUrl();
    await runSeed(false);
    process.exit(0);
  } catch (err) {
    console.error("❌ [db:seed] Lỗi gieo dữ liệu hạt giống:", err instanceof Error ? err.message : err);
    process.exit(1);
  }
}

main();
