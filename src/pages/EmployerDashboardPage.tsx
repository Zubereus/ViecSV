import { useCallback, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BriefcaseBusiness, Plus, Users, Clock3, CalendarDays, Pencil, Eye, RotateCcw, X } from "lucide-react";
import { fetchEmployerJobs, fetchEmployerSummary, updateEmployerJob } from "../api/employer";
import type { EmployerJobListItem, EmployerSummary } from "../../shared/types";
import { useDocumentTitle } from "../lib/useDocumentTitle";

const emptySummary: EmployerSummary = {openJobs:0,closedJobs:0,newApplications:0,interviewApplications:0,totalApplications:0};

/** Bảng điều khiển giúp nhà tuyển dụng quét tin và hồ sơ cần xử lý. */
export function EmployerDashboardPage() {
  useDocumentTitle("Bảng điều khiển nhà tuyển dụng");
  const [jobs,setJobs]=useState<EmployerJobListItem[]>([]);
  const [summary,setSummary]=useState(emptySummary);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState("");
  const [busyId,setBusyId]=useState("");
  const [toast,setToast]=useState("");
  const location=useLocation();
  const load=useCallback(async()=>{setLoading(true);setError("");try{const [jobResult,summaryResult]=await Promise.all([fetchEmployerJobs(),fetchEmployerSummary()]);setJobs(jobResult.items);setSummary(summaryResult.summary);}catch(e){setError(e instanceof Error?e.message:"Không tải được dữ liệu. Vui lòng thử lại.");}finally{setLoading(false);}},[]);
  useEffect(()=>{void load();},[load]);
  useEffect(()=>{if(location.state?.saved){setToast(location.state.saved);window.history.replaceState({},"");const timer=window.setTimeout(()=>setToast(""),4000);return()=>window.clearTimeout(timer);}},[location.state]);

  const toggleStatus=async(job:EmployerJobListItem)=>{
    if(job.status==="open"&&!window.confirm(`Đóng tin “${job.title}”? Tin sẽ không còn xuất hiện trong kết quả tìm kiếm.`))return;
    const status=job.status==="open"?"closed":"open";setBusyId(job.id);setError("");
    try{await updateEmployerJob(job.id,{status});setJobs((items)=>items.map((item)=>item.id===job.id?{...item,status}:item));setSummary((current)=>({...current,openJobs:current.openJobs+(status==="open"?1:-1),closedJobs:current.closedJobs+(status==="closed"?1:-1)}));setToast(status==="closed"?"Đã đóng tin tuyển dụng":"Đã mở lại tin tuyển dụng");window.setTimeout(()=>setToast(""),3000);}catch(e){setError(e instanceof Error?e.message:"Không cập nhật được trạng thái tin.");}finally{setBusyId("");}
  };

  const metrics=[{label:"Tin đang tuyển",value:summary.openJobs,icon:BriefcaseBusiness},{label:"Đơn mới",value:summary.newApplications,icon:Users},{label:"Hẹn phỏng vấn",value:summary.interviewApplications,icon:Clock3},{label:"Tổng đơn ứng tuyển",value:summary.totalApplications,icon:CalendarDays}];
  return <section className="max-w-6xl mx-auto space-y-6">
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"><div><h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">Bảng điều khiển</h1><p className="text-sm text-slate-600 mt-1">Theo dõi tin tuyển dụng và xử lý hồ sơ ứng viên.</p></div><Link to="/employer/jobs/new" className="inline-flex items-center justify-center gap-2 rounded-md bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-600"><Plus className="w-4 h-4"/>Đăng tin mới</Link></div>
    {toast&&<p role="status" className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">{toast}</p>}
    <div className="grid grid-cols-2 xl:grid-cols-4 border-y border-slate-200 bg-white">{metrics.map(({label,value,icon:Icon})=><div key={label} className="flex items-center gap-3 px-4 py-4 sm:px-5 border-b xl:border-b-0 border-r last:border-r-0 border-slate-100"><span className="hidden sm:flex w-9 h-9 items-center justify-center rounded-md bg-brand-50 text-brand-700"><Icon className="w-4 h-4"/></span><div><p className="text-xs text-slate-600">{label}</p><p className="text-xl font-semibold tabular-nums text-slate-900">{value}</p></div></div>)}</div>
    <div className="flex items-center justify-between gap-3"><h2 className="font-display text-lg font-semibold text-slate-900">Tin tuyển dụng <span className="text-sm font-normal text-slate-500">({jobs.length})</span></h2><button type="button" onClick={()=>void load()} className="inline-flex items-center gap-1.5 text-sm text-brand-700 hover:underline"><RotateCcw className="w-3.5 h-3.5"/>Làm mới</button></div>
    {error&&<div role="alert" className="flex items-center justify-between gap-4 border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800 rounded-md"><span>{error}</span><button onClick={()=>void load()} className="font-semibold underline">Thử lại</button></div>}
    {loading?<div className="space-y-3" aria-label="Đang tải tin tuyển dụng">{[0,1,2].map((n)=><div key={n} className="h-24 animate-pulse rounded-md bg-slate-200/70"/>)}</div>:jobs.length===0?<div className="border border-dashed border-slate-300 rounded-lg bg-white px-5 py-14 text-center"><BriefcaseBusiness className="mx-auto w-8 h-8 text-slate-400"/><h3 className="mt-3 font-semibold text-slate-900">Chưa có tin tuyển dụng</h3><p className="mt-1 text-sm text-slate-600">Đăng tin đầu tiên để sinh viên có thể tìm thấy công việc của bạn.</p><Link to="/employer/jobs/new" className="mt-4 inline-flex text-sm font-semibold text-brand-700 hover:underline">Đăng tin mới</Link></div>:<div className="divide-y divide-slate-200 border-y border-slate-200 bg-white">{jobs.map((job)=><article key={job.id} className="grid grid-cols-1 gap-3 px-4 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:px-5"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h3 className="font-semibold text-slate-900 truncate">{job.title}</h3><span className={`rounded border px-2 py-0.5 text-xs font-medium ${job.status==="open"?"bg-emerald-50 text-emerald-800 border-emerald-200":"bg-slate-100 text-slate-700 border-slate-300"}`}>{job.status==="open"?"Đang tuyển":"Đã đóng"}</span></div><p className="mt-1 text-sm text-slate-600">{job.company_name} · {job.district} · Đăng {new Date(job.posted_at).toLocaleDateString("vi-VN")}</p><p className="mt-2 text-sm text-slate-600"><strong className="text-slate-900">{job.applicant_count}</strong> ứng viên <span className="mx-1 text-slate-300">·</span><strong className="text-amber-800">{job.new_applicant_count} đơn mới</strong></p></div><div className="flex flex-wrap items-center gap-2"><Link to={`/employer/jobs/${job.id}/applicants`} className="inline-flex items-center gap-1.5 rounded border border-slate-300 px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50"><Eye className="w-4 h-4"/>Xem ứng viên</Link><Link to={`/employer/jobs/${job.id}/edit`} className="inline-flex items-center gap-1.5 rounded border border-slate-300 px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50"><Pencil className="w-4 h-4"/>Sửa</Link><button disabled={busyId===job.id} onClick={()=>void toggleStatus(job)} className="inline-flex items-center gap-1.5 rounded border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50">{job.status==="open"?<><X className="w-4 h-4"/>Đóng tin</>:<><RotateCcw className="w-4 h-4"/>Mở lại tin</>}</button></div></article>)}</div>}
  </section>;
}
