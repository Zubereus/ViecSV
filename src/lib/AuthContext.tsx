import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { AUTH_TOKEN_KEY } from "../api/client";
import { fetchMe, login as loginApi, registerEmployer as registerEmployerApi, registerStudent as registerStudentApi } from "../api/auth";
import type {
  LoginInput,
  PublicUser,
  RegisterEmployerInput,
  RegisterStudentInput,
} from "../../shared/types";

interface AuthContextValue {
  user: PublicUser | null;
  isLoading: boolean;
  login: (payload: LoginInput) => Promise<PublicUser>;
  registerStudent: (payload: RegisterStudentInput) => Promise<PublicUser>;
  registerEmployer: (payload: RegisterEmployerInput) => Promise<PublicUser>;
  logout: () => void;
  updateUser: (user: PublicUser) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/** Kiểm tra thông báo lỗi cho biết phiên đăng nhập đã hết hạn hoặc không hợp lệ. */
function isSessionExpiredMessage(message: string): boolean {
  return message.includes("hết hạn") || message.includes("không hợp lệ") || message.includes("Vui lòng đăng nhập");
}

/** Lưu token xác thực vào localStorage để duy trì phiên đăng nhập. */
function persistToken(token: string): void {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

/** Xóa token xác thực khỏi localStorage khi đăng xuất hoặc phiên hết hạn. */
function clearToken(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

/** Quản lý trạng thái đăng nhập, khôi phục phiên từ token và cung cấp hành động xác thực. */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const bootstrap = async () => {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      if (!token) {
        if (!cancelled) setIsLoading(false);
        return;
      }

      try {
        const response = await fetchMe();
        if (!cancelled) {
          setUser(response.user);
        }
      } catch (error) {
        // Nếu token hết hạn/không hợp lệ, xóa phiên im lặng để người dùng tiếp tục ở trạng thái khách.
        const message = error instanceof Error ? error.message : "";
        if (isSessionExpiredMessage(message) || message.includes("401")) {
          clearToken();
        } else {
          clearToken();
        }
        if (!cancelled) {
          setUser(null);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void bootstrap();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (payload: LoginInput): Promise<PublicUser> => {
    const response = await loginApi(payload);
    persistToken(response.token);
    setUser(response.user);
    return response.user;
  }, []);

  const registerStudent = useCallback(async (payload: RegisterStudentInput): Promise<PublicUser> => {
    const response = await registerStudentApi(payload);
    persistToken(response.token);
    setUser(response.user);
    return response.user;
  }, []);

  const registerEmployer = useCallback(async (payload: RegisterEmployerInput): Promise<PublicUser> => {
    const response = await registerEmployerApi(payload);
    persistToken(response.token);
    setUser(response.user);
    return response.user;
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
  }, []);

  const updateUser = useCallback((nextUser: PublicUser) => {
    setUser(nextUser);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, isLoading, login, registerStudent, registerEmployer, logout, updateUser }),
    [user, isLoading, login, registerStudent, registerEmployer, logout, updateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/** Truy cập ngữ cảnh xác thực trong cây component. */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth phải được sử dụng bên trong AuthProvider");
  }
  return context;
}
