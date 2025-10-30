import { useEffect, useState } from 'react';
import { Calendar, Clock, User, FileText, Check, AlertCircle } from 'lucide-react';
import { supabase, Doctor } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

type AppointmentsPageProps = {
  onNavigate: (page: string) => void;
};

export default function AppointmentsPage({ onNavigate }: AppointmentsPageProps) {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    doctor_id: '',
    appointment_date: '',
    appointment_time: '',
    reason: '',
  });

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    const { data } = await supabase
      .from('doctors')
      .select('*')
      .order('name');

    if (data) {
      setDoctors(data);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!user) {
      setError('Please login to book an appointment');
      onNavigate('login');
      return;
    }

    if (!formData.doctor_id || !formData.appointment_date || !formData.appointment_time || !formData.reason) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);

    const { data: patientData } = await supabase
      .from('patients')
      .select('id')
      .eq('id', user.id)
      .maybeSingle();

    if (!patientData) {
      const { error: patientError } = await supabase
        .from('patients')
        .insert({
          id: user.id,
          name: user.email?.split('@')[0] || 'Patient',
          email: user.email || '',
        });

      if (patientError) {
        setError('Error creating patient profile. Please try again.');
        setLoading(false);
        return;
      }
    }

    const { error: appointmentError } = await supabase
      .from('appointments')
      .insert({
        patient_id: user.id,
        doctor_id: formData.doctor_id,
        appointment_date: formData.appointment_date,
        appointment_time: formData.appointment_time,
        reason: formData.reason,
        status: 'pending',
      });

    setLoading(false);

    if (appointmentError) {
      setError('Failed to book appointment. Please try again.');
    } else {
      setSuccess(true);
      setFormData({
        doctor_id: '',
        appointment_date: '',
        appointment_time: '',
        reason: '',
      });
    }
  };

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
  ];

  const minDate = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Book an Appointment</h1>
          <p className="text-xl text-cyan-50 max-w-3xl">
            Schedule a consultation with our expert doctors at your convenience
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {!user && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8 flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-yellow-800 font-medium">Login Required</p>
              <p className="text-yellow-700 text-sm mt-1">
                You need to be logged in to book an appointment.{' '}
                <button
                  onClick={() => onNavigate('login')}
                  className="underline font-medium hover:text-yellow-900"
                >
                  Login here
                </button>
              </p>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8 flex items-start space-x-3">
            <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-green-800 font-medium">Appointment Booked Successfully!</p>
              <p className="text-green-700 text-sm mt-1">
                We'll send you a confirmation email shortly. You can view your appointments in your profile.
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-800 font-medium">Error</p>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-cyan-50 to-blue-50 px-6 py-4 border-b border-cyan-100">
            <h2 className="text-xl font-semibold text-gray-900">Appointment Details</h2>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <User className="h-4 w-4 text-gray-400" />
                <span>Select Doctor *</span>
              </label>
              <select
                value={formData.doctor_id}
                onChange={(e) => setFormData({ ...formData, doctor_id: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                required
              >
                <option value="">Choose a doctor</option>
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.name} - {doctor.specialization} (${doctor.consultation_fee})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span>Appointment Date *</span>
                </label>
                <input
                  type="date"
                  value={formData.appointment_date}
                  onChange={(e) => setFormData({ ...formData, appointment_date: e.target.value })}
                  min={minDate}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span>Appointment Time *</span>
                </label>
                <select
                  value={formData.appointment_time}
                  onChange={(e) => setFormData({ ...formData, appointment_time: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  required
                >
                  <option value="">Select time</option>
                  {timeSlots.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <FileText className="h-4 w-4 text-gray-400" />
                <span>Reason for Visit *</span>
              </label>
              <textarea
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all resize-none"
                placeholder="Please describe your symptoms or reason for consultation..."
                required
              />
            </div>

            <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg p-4 border border-cyan-100">
              <h3 className="font-medium text-gray-900 mb-2">Important Notes:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Please arrive 15 minutes before your scheduled time</li>
                <li>• Bring your ID and insurance card</li>
                <li>• Cancellations must be made 24 hours in advance</li>
                <li>• You'll receive a confirmation email after booking</li>
              </ul>
            </div>

            <button
              type="submit"
              disabled={loading || !user}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-4 rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Booking...</span>
                </>
              ) : (
                <>
                  <Calendar className="h-5 w-5" />
                  <span>Confirm Appointment</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
