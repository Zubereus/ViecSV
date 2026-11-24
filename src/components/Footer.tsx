import { useEffect, useState } from "react";
import { getApiHealth } from "../api/health";
import type { ApiHealthResponse } from "../../shared/types";

export function Footer() {
  const [health, setHealth] = useState<ApiHealthResponse | null>(null);

  useEffect(() => {
    getApiHealth()
      .then((data) => setHealth(data))
      .catch(() => {});
  }, []);

  return (
    <footer className="mt-auto border-t border-slate-200/80 bg-white text-slate-600 text-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-slate-800 tracking-tight">
              Việc<span className="text-brand-700">SV</span>
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-xs text-slate-500">
              Nền tảng việc làm thêm cho sinh viên TP.HCM
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500">
            {health && (
              <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                API Trực tuyến ({health.jobs ?? 0} việc làm mở)
              </span>
            )}
            <span>&copy; {new Date().getFullYear()} ViệcSV</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
