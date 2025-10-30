import { useEffect, useState } from 'react';
import { Heart, Users, Award, Clock, ArrowRight, Phone, Calendar, Shield, Stethoscope } from 'lucide-react';
import { supabase, Department } from '../lib/supabase';

type HomePageProps = {
  onNavigate: (page: string) => void;
};

export default function HomePage({ onNavigate }: HomePageProps) {
  const [departments, setDepartments] = useState<Department[]>([]);

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    const { data } = await supabase
      .from('departments')
      .select('*')
      .limit(6);

    if (data) {
      setDepartments(data);
    }
  };

  const stats = [
    { icon: Users, label: 'Patients Served', value: '50,000+', color: 'from-cyan-500 to-blue-600' },
    { icon: Heart, label: 'Successful Surgeries', value: '25,000+', color: 'from-emerald-500 to-teal-600' },
    { icon: Award, label: 'Expert Doctors', value: '200+', color: 'from-orange-500 to-red-600' },
    { icon: Clock, label: 'Years of Service', value: '25+', color: 'from-purple-500 to-pink-600' },
  ];

  const features = [
    {
      icon: Stethoscope,
      title: 'Expert Medical Team',
      description: 'Board-certified physicians with extensive experience',
      color: 'bg-cyan-500',
    },
    {
      icon: Clock,
      title: '24/7 Emergency Care',
      description: 'Round-the-clock emergency services available',
      color: 'bg-emerald-500',
    },
    {
      icon: Shield,
      title: 'Advanced Technology',
      description: 'State-of-the-art medical equipment and facilities',
      color: 'bg-blue-500',
    },
    {
      icon: Heart,
      title: 'Compassionate Care',
      description: 'Patient-centered approach with personalized treatment',
      color: 'bg-rose-500',
    },
  ];

  const getIconForDepartment = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      'heart-pulse': Heart,
      'baby': Users,
      'bone': Shield,
      'brain': Award,
      'ambulance': Phone,
      'scan': Stethoscope,
    };
    return iconMap[iconName] || Heart;
  };

  return (
    <div className="min-h-screen">
      <section className="relative bg-gradient-to-br from-cyan-50 via-blue-50 to-white pt-16 pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center space-x-2 bg-cyan-100 text-cyan-700 px-4 py-2 rounded-full text-sm font-medium">
                <Shield className="h-4 w-4" />
                <span>Trusted Healthcare Provider Since 1999</span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                Your Health, Our
                <span className="block bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
                  Priority
                </span>
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed">
                Experience world-class healthcare with compassionate doctors, advanced technology,
                and personalized treatment plans tailored to your needs.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => onNavigate('appointments')}
                  className="group flex items-center justify-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-4 rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl font-medium"
                >
                  <Calendar className="h-5 w-5" />
                  <span>Book Appointment</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => onNavigate('contact')}
                  className="flex items-center justify-center space-x-2 bg-white text-gray-700 px-8 py-4 rounded-lg border-2 border-gray-200 hover:border-cyan-500 hover:text-cyan-600 transition-all font-medium"
                >
                  <Phone className="h-5 w-5" />
                  <span>Emergency: (555) 123-4567</span>
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="relative bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl shadow-2xl p-8 transform hover:scale-105 transition-transform">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -ml-12 -mb-12"></div>

                <div className="relative bg-white rounded-xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Quick Access</h3>
                    <Heart className="h-6 w-6 text-red-500" />
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={() => onNavigate('doctors')}
                      className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-cyan-50 rounded-lg transition-colors group"
                    >
                      <span className="font-medium text-gray-700 group-hover:text-cyan-600">Find a Doctor</span>
                      <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-cyan-600 group-hover:translate-x-1 transition-all" />
                    </button>

                    <button
                      onClick={() => onNavigate('departments')}
                      className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-cyan-50 rounded-lg transition-colors group"
                    >
                      <span className="font-medium text-gray-700 group-hover:text-cyan-600">Our Departments</span>
                      <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-cyan-600 group-hover:translate-x-1 transition-all" />
                    </button>

                    <button
                      onClick={() => onNavigate('appointments')}
                      className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all group"
                    >
                      <span className="font-medium">Book Now</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border border-gray-100 hover:border-cyan-200 hover:shadow-lg transition-all"
              >
                <div className={`bg-gradient-to-r ${stat.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Us</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We provide comprehensive healthcare services with a commitment to excellence
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl border border-gray-100 hover:border-cyan-200 hover:shadow-xl transition-all group"
              >
                <div className={`${feature.color} w-14 h-14 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Departments</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive medical services across multiple specialties
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((dept) => {
              const Icon = getIconForDepartment(dept.icon);
              return (
                <div
                  key={dept.id}
                  className="group bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border border-gray-100 hover:border-cyan-200 hover:shadow-xl transition-all cursor-pointer"
                  onClick={() => onNavigate('departments')}
                >
                  <div className="bg-gradient-to-r from-cyan-500 to-blue-600 w-14 h-14 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{dept.name}</h3>
                  <p className="text-gray-600 mb-4">{dept.description}</p>
                  <div className="flex items-center text-cyan-600 font-medium group-hover:translate-x-2 transition-transform">
                    <span>Learn More</span>
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-10">
            <button
              onClick={() => onNavigate('departments')}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-4 rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg font-medium"
            >
              <span>View All Departments</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-cyan-500 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Take Control of Your Health?
          </h2>
          <p className="text-xl text-cyan-50 mb-8">
            Book an appointment with our expert doctors today and experience quality healthcare
          </p>
          <button
            onClick={() => onNavigate('appointments')}
            className="inline-flex items-center space-x-2 bg-white text-cyan-600 px-8 py-4 rounded-lg hover:bg-gray-50 transition-all shadow-lg font-medium"
          >
            <Calendar className="h-5 w-5" />
            <span>Schedule Your Appointment</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </section>
    </div>
  );
}
