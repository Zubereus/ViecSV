import { useEffect } from "react";

const APP_TITLE = "ViệcSV";

/** Cập nhật tiêu đề trang theo từng màn hình, giữ hậu tố tên ứng dụng. */
export function useDocumentTitle(title?: string): void {
  useEffect(() => {
    document.title = title ? `${title} | ${APP_TITLE}` : `${APP_TITLE} – Việc làm thêm cho sinh viên`;
  }, [title]);
}
