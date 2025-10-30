import { Building2, Phone, Mail, MapPin, Clock, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-2 rounded-lg">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">HealthCare+</span>
            </div>
            <p className="text-gray-400 mb-4">
              Providing exceptional healthcare services with compassion and expertise. Your health is our priority.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-cyan-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-cyan-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-cyan-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-cyan-400 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-cyan-400 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Our Departments</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Find a Doctor</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">News & Events</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Services</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Emergency Care</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Surgery</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Diagnostics</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Pharmacy</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Laboratory</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm">123 Medical Center Drive, Healthcare City, HC 12345</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-cyan-400 flex-shrink-0" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-cyan-400 flex-shrink-0" />
                <span className="text-sm">info@healthcareplus.com</span>
              </li>
              <li className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p>Emergency: 24/7</p>
                  <p>Outpatient: Mon-Sat 8AM-8PM</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} HealthCare+. All rights reserved. | Privacy Policy | Terms of Service</p>
        </div>
      </div>
    </footer>
  );
}
