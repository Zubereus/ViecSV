export function Footer() {
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
            <span>&copy; {new Date().getFullYear()} ViệcSV</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
