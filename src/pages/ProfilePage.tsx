import { useEffect, useState } from 'react';
import { User, Calendar, Clock, FileText, Edit2, Save, X, AlertCircle } from 'lucide-react';
import { supabase, Patient, Appointment, Doctor } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

type ProfilePageProps = {
  onNavigate: (page: string) => void;
};

export default function ProfilePage({ onNavigate }: ProfilePageProps) {
  const { user } = useAuth();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [appointments, setAppointments] = useState<(Appointment & { doctor?: Doctor })[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    phone: '',
    date_of_birth: '',
    blood_group: '',
    address: '',
    emergency_contact: '',
  });

  useEffect(() => {
    if (user) {
      loadPatientData();
      loadAppointments();
    }
  }, [user]);

  const loadPatientData = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('patients')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (data) {
      setPatient(data);
      setEditData({
        name: data.name || '',
        phone: data.phone || '',
        date_of_birth: data.date_of_birth || '',
        blood_group: data.blood_group || '',
        address: data.address || '',
        emergency_contact: data.emergency_contact || '',
      });
    }
    setLoading(false);
  };

  const loadAppointments = async () => {
    if (!user) return;

    const { data: appointmentsData } = await supabase
      .from('appointments')
      .select('*')
      .eq('patient_id', user.id)
      .order('appointment_date', { ascending: false });

    if (appointmentsData) {
      const appointmentsWithDoctors = await Promise.all(
        appointmentsData.map(async (appointment) => {
          const { data: doctorData } = await supabase
            .from('doctors')
            .select('*')
            .eq('id', appointment.doctor_id)
            .maybeSingle();

          return { ...appointment, doctor: doctorData || undefined };
        })
      );

      setAppointments(appointmentsWithDoctors);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);

    const { error } = await supabase
      .from('patients')
      .update({
        name: editData.name,
        phone: editData.phone,
        date_of_birth: editData.date_of_birth,
        blood_group: editData.blood_group,
        address: editData.address,
        emergency_contact: editData.emergency_contact,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    setSaving(false);

    if (!error) {
      setEditing(false);
      loadPatientData();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Please Login</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to view your profile</p>
          <button
            onClick={() => onNavigate('login')}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-3 rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all font-medium"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">My Profile</h1>
          <p className="text-xl text-cyan-50">Manage your health information and appointments</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-cyan-50 to-blue-50 px-6 py-4 border-b border-cyan-100 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
                {!editing ? (
                  <button
                    onClick={() => setEditing(true)}
                    className="flex items-center space-x-1 text-cyan-600 hover:text-cyan-700 transition-colors"
                  >
                    <Edit2 className="h-4 w-4" />
                    <span className="text-sm font-medium">Edit</span>
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center space-x-1 text-green-600 hover:text-green-700 transition-colors"
                    >
                      <Save className="h-4 w-4" />
                      <span className="text-sm font-medium">Save</span>
                    </button>
                    <button
                      onClick={() => {
                        setEditing(false);
                        loadPatientData();
                      }}
                      className="flex items-center space-x-1 text-red-600 hover:text-red-700 transition-colors"
                    >
                      <X className="h-4 w-4" />
                      <span className="text-sm font-medium">Cancel</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-center justify-center mb-6">
                  <div className="bg-gradient-to-r from-cyan-500 to-blue-600 w-24 h-24 rounded-full flex items-center justify-center">
                    <User className="h-12 w-12 text-white" />
                  </div>
                </div>

                {editing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        value={editData.name}
                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input
                        type="tel"
                        value={editData.phone}
                        onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                      <input
                        type="date"
                        value={editData.date_of_birth}
                        onChange={(e) => setEditData({ ...editData, date_of_birth: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                      <select
                        value={editData.blood_group}
                        onChange={(e) => setEditData({ ...editData, blood_group: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      >
                        <option value="">Select</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                      <textarea
                        value={editData.address}
                        onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact</label>
                      <input
                        type="tel"
                        value={editData.emergency_contact}
                        onChange={(e) => setEditData({ ...editData, emergency_contact: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="font-medium text-gray-900">{patient?.name || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium text-gray-900">{patient?.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium text-gray-900">{patient?.phone || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Date of Birth</p>
                      <p className="font-medium text-gray-900">{patient?.date_of_birth || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Blood Group</p>
                      <p className="font-medium text-gray-900">{patient?.blood_group || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Address</p>
                      <p className="font-medium text-gray-900">{patient?.address || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Emergency Contact</p>
                      <p className="font-medium text-gray-900">{patient?.emergency_contact || 'Not provided'}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-cyan-50 to-blue-50 px-6 py-4 border-b border-cyan-100">
                <h2 className="text-xl font-semibold text-gray-900">My Appointments</h2>
              </div>

              <div className="p-6">
                {appointments.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Appointments</h3>
                    <p className="text-gray-600 mb-6">You haven't booked any appointments yet</p>
                    <button
                      onClick={() => onNavigate('appointments')}
                      className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all font-medium"
                    >
                      Book Appointment
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {appointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        className="border border-gray-200 rounded-lg p-6 hover:border-cyan-200 hover:shadow-md transition-all"
                      >
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {appointment.doctor?.name || 'Doctor'}
                              </h3>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(appointment.status)}`}>
                                {appointment.status}
                              </span>
                            </div>
                            <p className="text-cyan-600 text-sm font-medium mb-1">
                              {appointment.doctor?.specialization}
                            </p>
                          </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center space-x-3 text-sm">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">
                              {new Date(appointment.appointment_date).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </span>
                          </div>
                          <div className="flex items-center space-x-3 text-sm">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">{appointment.appointment_time}</span>
                          </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-start space-x-2">
                            <FileText className="h-4 w-4 text-gray-400 mt-0.5" />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-700 mb-1">Reason for Visit</p>
                              <p className="text-sm text-gray-600">{appointment.reason}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
