import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Department = {
  id: string;
  name: string;
  description: string;
  icon: string;
  image_url?: string;
  created_at: string;
};

export type Doctor = {
  id: string;
  name: string;
  specialization: string;
  department_id?: string;
  qualifications: string;
  experience_years: number;
  image_url?: string;
  bio?: string;
  available_days: string[];
  consultation_fee: number;
  created_at: string;
};

export type Patient = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  date_of_birth?: string;
  blood_group?: string;
  address?: string;
  emergency_contact?: string;
  medical_history?: string;
  created_at: string;
  updated_at: string;
};

export type Appointment = {
  id: string;
  patient_id: string;
  doctor_id: string;
  appointment_date: string;
  appointment_time: string;
  reason: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  created_at: string;
  updated_at: string;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'responded';
  created_at: string;
};
