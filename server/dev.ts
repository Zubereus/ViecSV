import dotenv from "dotenv";
import { app } from "./app.js";

// Nạp các biến môi trường từ tệp .env khi chạy máy chủ phát triển cục bộ
dotenv.config();

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;

app.listen(PORT, () => {
  console.log(`[ViệcSV API] Máy chủ cục bộ đang chạy tại http://localhost:${PORT}`);
});
