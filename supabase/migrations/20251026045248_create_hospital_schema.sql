/*
  # Hospital Management System Database Schema

  ## Overview
  Complete database schema for a hospital/healthcare website with appointment booking,
  doctor management, patient records, departments, and contact functionality.

  ## New Tables

  ### 1. departments
  - `id` (uuid, primary key) - Unique department identifier
  - `name` (text) - Department name (e.g., Cardiology, Pediatrics)
  - `description` (text) - Detailed department description
  - `icon` (text) - Icon identifier for UI
  - `image_url` (text) - Department image URL
  - `created_at` (timestamptz) - Record creation timestamp

  ### 2. doctors
  - `id` (uuid, primary key) - Unique doctor identifier
  - `name` (text) - Doctor's full name
  - `specialization` (text) - Medical specialization
  - `department_id` (uuid) - Foreign key to departments
  - `qualifications` (text) - Educational qualifications
  - `experience_years` (integer) - Years of experience
  - `image_url` (text) - Profile photo URL
  - `bio` (text) - Professional biography
  - `available_days` (text array) - Days available for appointments
  - `consultation_fee` (numeric) - Consultation charges
  - `created_at` (timestamptz) - Record creation timestamp

  ### 3. patients
  - `id` (uuid, primary key) - Linked to auth.users
  - `name` (text) - Patient's full name
  - `email` (text) - Patient email
  - `phone` (text) - Contact number
  - `date_of_birth` (date) - Date of birth
  - `blood_group` (text) - Blood type
  - `address` (text) - Residential address
  - `emergency_contact` (text) - Emergency contact number
  - `medical_history` (text) - Medical history notes
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 4. appointments
  - `id` (uuid, primary key) - Unique appointment identifier
  - `patient_id` (uuid) - Foreign key to patients
  - `doctor_id` (uuid) - Foreign key to doctors
  - `appointment_date` (date) - Appointment date
  - `appointment_time` (time) - Appointment time
  - `reason` (text) - Reason for visit
  - `status` (text) - Status: pending, confirmed, completed, cancelled
  - `notes` (text) - Additional notes
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 5. contact_messages
  - `id` (uuid, primary key) - Unique message identifier
  - `name` (text) - Sender's name
  - `email` (text) - Sender's email
  - `phone` (text) - Contact number
  - `subject` (text) - Message subject
  - `message` (text) - Message content
  - `status` (text) - Status: new, read, responded
  - `created_at` (timestamptz) - Record creation timestamp

  ## Security
  - Enable Row Level Security (RLS) on all tables
  - Patients can view and update their own records
  - Patients can create and view their own appointments
  - Doctors and departments are publicly viewable
  - Contact messages can be created by anyone
  - Admin access requires service role

  ## Notes
  - All timestamps use timezone-aware timestamptz
  - UUIDs are auto-generated using gen_random_uuid()
  - Foreign key constraints maintain referential integrity
  - Indexes added for frequently queried columns
*/

-- Create departments table
CREATE TABLE IF NOT EXISTS departments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL,
  image_url text,
  created_at timestamptz DEFAULT now()
);

-- Create doctors table
CREATE TABLE IF NOT EXISTS doctors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  specialization text NOT NULL,
  department_id uuid REFERENCES departments(id) ON DELETE SET NULL,
  qualifications text NOT NULL,
  experience_years integer NOT NULL DEFAULT 0,
  image_url text,
  bio text,
  available_days text[] DEFAULT ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  consultation_fee numeric(10, 2) DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create patients table
CREATE TABLE IF NOT EXISTS patients (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  date_of_birth date,
  blood_group text,
  address text,
  emergency_contact text,
  medical_history text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id uuid REFERENCES doctors(id) ON DELETE CASCADE,
  appointment_date date NOT NULL,
  appointment_time time NOT NULL,
  reason text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create contact_messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  subject text NOT NULL,
  message text NOT NULL,
  status text DEFAULT 'new' CHECK (status IN ('new', 'read', 'responded')),
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for departments (public read)
CREATE POLICY "Departments are viewable by everyone"
  ON departments FOR SELECT
  TO authenticated, anon
  USING (true);

-- RLS Policies for doctors (public read)
CREATE POLICY "Doctors are viewable by everyone"
  ON doctors FOR SELECT
  TO authenticated, anon
  USING (true);

-- RLS Policies for patients
CREATE POLICY "Patients can view own profile"
  ON patients FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Patients can insert own profile"
  ON patients FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Patients can update own profile"
  ON patients FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- RLS Policies for appointments
CREATE POLICY "Patients can view own appointments"
  ON appointments FOR SELECT
  TO authenticated
  USING (patient_id IN (SELECT id FROM patients WHERE id = auth.uid()));

CREATE POLICY "Patients can create own appointments"
  ON appointments FOR INSERT
  TO authenticated
  WITH CHECK (patient_id IN (SELECT id FROM patients WHERE id = auth.uid()));

CREATE POLICY "Patients can update own appointments"
  ON appointments FOR UPDATE
  TO authenticated
  USING (patient_id IN (SELECT id FROM patients WHERE id = auth.uid()))
  WITH CHECK (patient_id IN (SELECT id FROM patients WHERE id = auth.uid()));

-- RLS Policies for contact_messages
CREATE POLICY "Anyone can submit contact messages"
  ON contact_messages FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_doctors_department ON doctors(department_id);
CREATE INDEX IF NOT EXISTS idx_appointments_patient ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor ON appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);

-- Insert sample departments
INSERT INTO departments (name, description, icon) VALUES
  ('Cardiology', 'Specialized care for heart and cardiovascular system conditions', 'heart-pulse'),
  ('Pediatrics', 'Comprehensive healthcare for infants, children, and adolescents', 'baby'),
  ('Orthopedics', 'Treatment of musculoskeletal system disorders and injuries', 'bone'),
  ('Neurology', 'Diagnosis and treatment of nervous system disorders', 'brain'),
  ('Emergency', '24/7 emergency medical care and trauma services', 'ambulance'),
  ('Radiology', 'Medical imaging and diagnostic services', 'scan')
ON CONFLICT DO NOTHING;

-- Insert sample doctors
INSERT INTO doctors (name, specialization, qualifications, experience_years, bio, consultation_fee, department_id)
SELECT 
  'Dr. Sarah Johnson',
  'Cardiologist',
  'MD, FACC, Fellowship in Interventional Cardiology',
  15,
  'Specialized in preventive cardiology and minimally invasive procedures',
  150.00,
  (SELECT id FROM departments WHERE name = 'Cardiology' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM doctors WHERE name = 'Dr. Sarah Johnson');

INSERT INTO doctors (name, specialization, qualifications, experience_years, bio, consultation_fee, department_id)
SELECT 
  'Dr. Michael Chen',
  'Pediatrician',
  'MD, FAAP, Board Certified Pediatrics',
  12,
  'Expert in child development and pediatric infectious diseases',
  120.00,
  (SELECT id FROM departments WHERE name = 'Pediatrics' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM doctors WHERE name = 'Dr. Michael Chen');

INSERT INTO doctors (name, specialization, qualifications, experience_years, bio, consultation_fee, department_id)
SELECT 
  'Dr. Emily Rodriguez',
  'Orthopedic Surgeon',
  'MD, MS Orthopedics, Fellowship in Sports Medicine',
  10,
  'Specialized in sports injuries and joint replacement surgery',
  180.00,
  (SELECT id FROM departments WHERE name = 'Orthopedics' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM doctors WHERE name = 'Dr. Emily Rodriguez');

INSERT INTO doctors (name, specialization, qualifications, experience_years, bio, consultation_fee, department_id)
SELECT 
  'Dr. James Wilson',
  'Neurologist',
  'MD, DM Neurology, FAAN',
  18,
  'Expert in stroke management and neurodegenerative diseases',
  200.00,
  (SELECT id FROM departments WHERE name = 'Neurology' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM doctors WHERE name = 'Dr. James Wilson');

INSERT INTO doctors (name, specialization, qualifications, experience_years, bio, consultation_fee, department_id)
SELECT 
  'Dr. Priya Sharma',
  'Emergency Medicine',
  'MD, FACEP, Advanced Trauma Life Support',
  8,
  'Specialized in emergency care and critical care medicine',
  100.00,
  (SELECT id FROM departments WHERE name = 'Emergency' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM doctors WHERE name = 'Dr. Priya Sharma');

INSERT INTO doctors (name, specialization, qualifications, experience_years, bio, consultation_fee, department_id)
SELECT 
  'Dr. Robert Martinez',
  'Radiologist',
  'MD, FRCR, Fellowship in Interventional Radiology',
  14,
  'Expert in diagnostic imaging and minimally invasive procedures',
  130.00,
  (SELECT id FROM departments WHERE name = 'Radiology' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM doctors WHERE name = 'Dr. Robert Martinez');