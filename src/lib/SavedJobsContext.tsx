import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { fetchSaved, saveJob as saveJobApi, unsaveJob as unsaveJobApi } from "../api/saved";
import { useAuth } from "./AuthContext";

interface SavedJobsContextValue {
  savedJobIds: Set<string>;
  savedCount: number;
  isLoading: boolean;
  isSaved: (jobId: string) => boolean;
  toggleSave: (jobId: string) => Promise<void>;
  refreshSavedJobs: () => Promise<void>;
}

const SavedJobsContext = createContext<SavedJobsContextValue | undefined>(undefined);

/** Quản lý danh sách việc làm đã lưu của sinh viên, hỗ trợ cập nhật lạc quan và hoàn tác khi lỗi. */
export function SavedJobsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [savedJobIds, setSavedJobIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  const loadSavedJobs = useCallback(async () => {
    if (!user || user.role !== "student") {
      setSavedJobIds(new Set());
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetchSaved();
      const ids = new Set(response.items.map((job) => String(job.id)));
      setSavedJobIds(ids);
    } catch {
      // Nếu tải thất bại, giữ trạng thái hiện tại để tránh làm gián đoạn trải nghiệm.
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void loadSavedJobs();
  }, [loadSavedJobs]);

  const refreshSavedJobs = useCallback(async () => {
    await loadSavedJobs();
  }, [loadSavedJobs]);

  const isSaved = useCallback((jobId: string) => savedJobIds.has(String(jobId)), [savedJobIds]);

  const toggleSave = useCallback(
    async (jobId: string) => {
      if (!user || user.role !== "student") {
        throw new Error("Chỉ sinh viên mới có thể lưu việc làm.");
      }

      const key = String(jobId);
      const wasSaved = savedJobIds.has(key);

      setSavedJobIds((prev) => {
        const next = new Set(prev);
        if (wasSaved) {
          next.delete(key);
        } else {
          next.add(key);
        }
        return next;
      });

      try {
        if (wasSaved) {
          await unsaveJobApi(key);
        } else {
          await saveJobApi(key);
        }
      } catch (error) {
        // Hoàn tác trạng thái lạc quan nếu API thất bại.
        setSavedJobIds((prev) => {
          const next = new Set(prev);
          if (wasSaved) {
            next.add(key);
          } else {
            next.delete(key);
          }
          return next;
        });
        throw error;
      }
    },
    [savedJobIds, user]
  );

  const value = useMemo<SavedJobsContextValue>(
    () => ({
      savedJobIds,
      savedCount: savedJobIds.size,
      isLoading,
      isSaved,
      toggleSave,
      refreshSavedJobs,
    }),
    [savedJobIds, isLoading, isSaved, toggleSave, refreshSavedJobs]
  );

  return <SavedJobsContext.Provider value={value}>{children}</SavedJobsContext.Provider>;
}

/** Truy cập ngữ cảnh việc làm đã lưu trong cây component. */
export function useSavedJobs(): SavedJobsContextValue {
  const context = useContext(SavedJobsContext);
  if (!context) {
    throw new Error("useSavedJobs phải được sử dụng bên trong SavedJobsProvider");
  }
  return context;
}
