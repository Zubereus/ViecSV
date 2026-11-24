// Wrapper gọi API chuẩn hóa cho client ViệcSV

export const AUTH_TOKEN_KEY = "viecsv_token";

export interface ApiRequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

/**
 * Thực hiện gọi API với tiền tố /api
 * Tự động gắn JWT token từ localStorage nếu có, chuẩn hóa thông báo lỗi tiếng Việt
 */
export async function apiRequest<T>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const { params, headers, ...restOptions } = options;

  let url = endpoint.startsWith("/api") ? endpoint : `/api${endpoint}`;

  if (params) {
    const searchParams = new URLSearchParams();
    for (const [key, val] of Object.entries(params)) {
      if (val !== undefined && val !== null && val !== "") {
        searchParams.append(key, String(val));
      }
    }
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes("?") ? "&" : "?") + queryString;
    }
  }

  // Tự động gắn token xác thực nếu có trong localStorage
  const token = typeof window !== "undefined" ? localStorage.getItem(AUTH_TOKEN_KEY) : null;
  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(headers as Record<string, string>),
  };

  try {
    const response = await fetch(url, {
      headers: requestHeaders,
      ...restOptions,
    });

    if (!response.ok) {
      let errorMessage = `Yêu cầu thất bại (${response.status})`;
      let field: string | undefined;
      try {
        const errData = await response.json();
        if (errData && errData.message) {
          errorMessage = errData.message;
        }
        if (errData && typeof errData.field === "string") field = errData.field;
      } catch {
        // Giữ nguyên thông báo mặc định nếu phản hồi không phải JSON
      }

      // Nếu phiên đăng nhập hết hạn trong lúc sử dụng, xóa token và chuyển về trang đăng nhập.
      if (response.status === 401 && typeof window !== "undefined") {
        const expired =
          errorMessage.includes("hết hạn") ||
          errorMessage.includes("không hợp lệ") ||
          errorMessage.includes("Vui lòng đăng nhập");
        if (expired) {
          localStorage.removeItem(AUTH_TOKEN_KEY);
          sessionStorage.setItem("viecsv_auth_message", "Phiên đăng nhập đã hết hạn");
          if (!window.location.pathname.startsWith("/login")) {
            window.location.assign("/login");
          }
        }
      }

      const apiError = new Error(errorMessage) as Error & { field?: string };
      apiError.field = field;
      throw apiError;
    }

    return (await response.json()) as T;
  } catch (err) {
    if (err instanceof Error) {
      // Bắt lỗi mất kết nối mạng
      if (err.name === "TypeError" && err.message.includes("fetch")) {
        throw new Error("Không kết nối được máy chủ. Vui lòng thử lại.");
      }
      throw err;
    }
    throw new Error("Đã xảy ra lỗi không xác định. Vui lòng thử lại.");
  }
}
