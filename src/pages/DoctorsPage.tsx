import { useEffect, useState } from 'react';
import { Award, Calendar, Star, GraduationCap, Briefcase, Clock } from 'lucide-react';
import { supabase, Doctor } from '../lib/supabase';

type DoctorsPageProps = {
  onNavigate: (page: string) => void;
};

export default function DoctorsPage({ onNavigate }: DoctorsPageProps) {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpecialization, setSelectedSpecialization] = useState('All');

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('doctors')
      .select('*')
      .order('name');

    if (data) {
      setDoctors(data);
    }
    setLoading(false);
  };

  const specializations = ['All', ...new Set(doctors.map(d => d.specialization))];

  const filteredDoctors = selectedSpecialization === 'All'
    ? doctors
    : doctors.filter(d => d.specialization === selectedSpecialization);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Medical Experts</h1>
          <p className="text-xl text-cyan-50 max-w-3xl">
            Meet our team of highly qualified and experienced healthcare professionals dedicated to your well-being
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 flex flex-wrap gap-3">
          {specializations.map((spec) => (
            <button
              key={spec}
              onClick={() => setSelectedSpecialization(spec)}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                selectedSpecialization === spec
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-cyan-500 hover:text-cyan-600'
              }`}
            >
              {spec}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-600"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDoctors.map((doctor) => (
              <div
                key={doctor.id}
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all overflow-hidden border border-gray-100 hover:border-cyan-200 group"
              >
                <div className="relative h-64 bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity"></div>
                  {doctor.image_url ? (
                    <img
                      src={doctor.image_url}
                      alt={doctor.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-32 h-32 bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <Award className="h-16 w-16 text-white" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-semibold text-gray-900">4.9</span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{doctor.name}</h3>
                  <p className="text-cyan-600 font-medium mb-4">{doctor.specialization}</p>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center space-x-3 text-sm text-gray-600">
                      <GraduationCap className="h-4 w-4 text-gray-400" />
                      <span>{doctor.qualifications}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm text-gray-600">
                      <Briefcase className="h-4 w-4 text-gray-400" />
                      <span>{doctor.experience_years} years of experience</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm text-gray-600">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span>Available: {doctor.available_days.slice(0, 3).join(', ')}</span>
                    </div>
                  </div>

                  {doctor.bio && (
                    <p className="text-gray-600 text-sm mb-6 leading-relaxed line-clamp-3">
                      {doctor.bio}
                    </p>
                  )}

                  <div className="flex items-center justify-between mb-6 p-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg border border-cyan-100">
                    <span className="text-sm text-gray-600">Consultation Fee</span>
                    <span className="text-2xl font-bold text-gray-900">${doctor.consultation_fee}</span>
                  </div>

                  <button
                    onClick={() => onNavigate('appointments')}
                    className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all shadow-md font-medium"
                  >
                    <Calendar className="h-5 w-5" />
                    <span>Book Appointment</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredDoctors.length === 0 && !loading && (
          <div className="text-center py-20">
            <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <Award className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No doctors found</h3>
            <p className="text-gray-600">Try selecting a different specialization</p>
          </div>
        )}
      </div>
    </div>
  );
}
