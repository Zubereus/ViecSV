// Định nghĩa cấu trúc bảng PostgreSQL (DDL) cho ViệcSV

export const CREATE_TABLES_SQL = `
-- Bảng tài khoản người dùng
CREATE TABLE IF NOT EXISTS users (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('student', 'employer')),
  full_name TEXT NOT NULL,
  date_of_birth DATE,
  sex TEXT CHECK (sex IS NULL OR sex IN ('nam', 'nu', 'khac')),
  phone TEXT NOT NULL,
  university TEXT,
  student_id TEXT,
  major TEXT,
  year_of_study INTEGER CHECK (year_of_study IS NULL OR (year_of_study >= 1 AND year_of_study <= 6)),
  district TEXT,
  cccd_hash TEXT UNIQUE,
  cccd_last4 TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Bảng thông tin doanh nghiệp / đơn vị tuyển dụng
CREATE TABLE IF NOT EXISTS companies (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL,
  industry TEXT NOT NULL,
  description TEXT NOT NULL,
  owner_user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  color_hex TEXT NOT NULL
);

-- Bảng bài đăng việc làm
CREATE TABLE IF NOT EXISTS jobs (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  company_id BIGINT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  district TEXT NOT NULL,
  address TEXT NOT NULL,
  work_type TEXT NOT NULL CHECK (work_type IN ('tai-cho', 'tu-xa', 'linh-hoat')),
  wage_per_hour INTEGER NOT NULL CHECK (wage_per_hour > 0),
  wage_note TEXT NOT NULL DEFAULT '',
  days TEXT[] NOT NULL,
  shifts TEXT[] NOT NULL,
  hours_per_week INTEGER NOT NULL DEFAULT 0,
  description TEXT NOT NULL,
  responsibilities JSONB NOT NULL DEFAULT '[]'::jsonb,
  requirements JSONB NOT NULL DEFAULT '[]'::jsonb,
  benefits JSONB NOT NULL DEFAULT '[]'::jsonb,
  experience_required BOOLEAN NOT NULL DEFAULT FALSE,
  is_urgent BOOLEAN NOT NULL DEFAULT FALSE,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed')),
  posted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  search_text TEXT NOT NULL
);

-- Bảng việc làm đã lưu của sinh viên
CREATE TABLE IF NOT EXISTS saved_jobs (
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  job_id BIGINT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  saved_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, job_id)
);

-- Bảng hồ sơ ứng tuyển
CREATE TABLE IF NOT EXISTS applications (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  job_id BIGINT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  university TEXT NOT NULL,
  intro TEXT NOT NULL,
  available_time TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'moi' CHECK (status IN ('moi', 'da-xem', 'hen-phong-van', 'da-nhan', 'tu-choi')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (job_id, user_id)
);

-- Các chỉ mục hỗ trợ truy vấn nhanh và lọc theo điều kiện
CREATE INDEX IF NOT EXISTS idx_jobs_category ON jobs(category);
CREATE INDEX IF NOT EXISTS idx_jobs_district ON jobs(district);
CREATE INDEX IF NOT EXISTS idx_jobs_wage ON jobs(wage_per_hour);
CREATE INDEX IF NOT EXISTS idx_jobs_posted_at ON jobs(posted_at DESC);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_days ON jobs USING GIN (days);
CREATE INDEX IF NOT EXISTS idx_jobs_shifts ON jobs USING GIN (shifts);
CREATE INDEX IF NOT EXISTS idx_jobs_company_id ON jobs(company_id);
CREATE INDEX IF NOT EXISTS idx_applications_user ON applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_job ON applications(job_id);
`;

export const DROP_TABLES_SQL = `
DROP TABLE IF EXISTS applications CASCADE;
DROP TABLE IF EXISTS saved_jobs CASCADE;
DROP TABLE IF EXISTS jobs CASCADE;
DROP TABLE IF EXISTS companies CASCADE;
DROP TABLE IF EXISTS users CASCADE;
`;
