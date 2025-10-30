import { useEffect, useState } from 'react';
import { Heart, Users, Award, Phone, ArrowRight } from 'lucide-react';
import { supabase, Department } from '../lib/supabase';

type DepartmentsPageProps = {
  onNavigate: (page: string) => void;
};

export default function DepartmentsPage({ onNavigate }: DepartmentsPageProps) {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('departments')
      .select('*')
      .order('name');

    if (data) {
      setDepartments(data);
    }
    setLoading(false);
  };

  const getIconForDepartment = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      'heart-pulse': Heart,
      'baby': Users,
      'bone': Award,
      'brain': Award,
      'ambulance': Phone,
      'scan': Heart,
    };
    return iconMap[iconName] || Heart;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Departments</h1>
          <p className="text-xl text-cyan-50 max-w-3xl">
            Comprehensive medical care across multiple specialties with state-of-the-art facilities and expert healthcare professionals
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-600"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {departments.map((dept) => {
              const Icon = getIconForDepartment(dept.icon);
              return (
                <div
                  key={dept.id}
                  className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all overflow-hidden border border-gray-100 hover:border-cyan-200"
                >
                  <div className="relative h-48 bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity"></div>
                    <div className="relative bg-white bg-opacity-20 backdrop-blur-sm p-6 rounded-2xl group-hover:scale-110 transition-transform">
                      <Icon className="h-16 w-16 text-white" />
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{dept.name}</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">{dept.description}</p>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Facilities</span>
                        <span className="font-medium text-gray-900">Advanced Equipment</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Availability</span>
                        <span className="font-medium text-gray-900">24/7 Service</span>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-100 flex space-x-3">
                      <button
                        onClick={() => onNavigate('doctors')}
                        className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-3 rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all font-medium"
                      >
                        <span>View Doctors</span>
                        <ArrowRight className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onNavigate('appointments')}
                        className="flex-1 bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-cyan-50 hover:text-cyan-600 transition-all font-medium"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-16 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-8 md:p-12 border border-cyan-100">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Need Help Choosing a Department?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Our healthcare coordinators are available to help you find the right specialist for your needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => onNavigate('contact')}
                className="flex items-center justify-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-4 rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg font-medium"
              >
                <Phone className="h-5 w-5" />
                <span>Contact Us</span>
              </button>
              <button
                onClick={() => onNavigate('appointments')}
                className="flex items-center justify-center space-x-2 bg-white text-gray-700 px-8 py-4 rounded-lg border-2 border-gray-200 hover:border-cyan-500 hover:text-cyan-600 transition-all font-medium"
              >
                <span>Book Appointment</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
