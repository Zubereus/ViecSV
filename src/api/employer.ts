import { apiRequest } from "./client";
import type { CreateJobInput, EmployerApplicant, EmployerCompany, EmployerJobListItem, EmployerSummary, Job, ApplicationStatus, UpdateJobInput } from "../../shared/types";

export async function fetchEmployerSummary() { return apiRequest<{ok:boolean;summary:EmployerSummary}>("/api/employer/summary"); }
export async function fetchEmployerCompanies() { return apiRequest<{ok:boolean;items:EmployerCompany[]}>("/api/employer/companies"); }
export async function fetchEmployerJobs() { return apiRequest<{ok:boolean;items:EmployerJobListItem[]}>("/api/employer/jobs"); }
export async function fetchEmployerJob(id:string) { return apiRequest<{ok:boolean;job:Job}>(`/api/employer/jobs/${id}`); }
export async function createEmployerJob(input:CreateJobInput) { return apiRequest<{ok:boolean;job:Job}>("/api/employer/jobs",{method:"POST",body:JSON.stringify(input)}); }
export async function updateEmployerJob(id:string,input:UpdateJobInput) { return apiRequest<{ok:boolean;job:Job}>(`/api/employer/jobs/${id}`,{method:"PATCH",body:JSON.stringify(input)}); }
export async function fetchEmployerApplicants(id:string) { return apiRequest<{ok:boolean;job:Job;items:EmployerApplicant[];total:number}>(`/api/employer/jobs/${id}/applications`); }
export async function updateEmployerApplication(id:string,status:ApplicationStatus) { return apiRequest<{ok:boolean;application:{id:string;status:ApplicationStatus;updatedAt:string}}>(`/api/employer/applications/${id}`,{method:"PATCH",body:JSON.stringify({status})}); }
