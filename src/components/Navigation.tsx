import { useState } from "react";
import {
  Menu,
  X,
  User,
  Calendar,
  Phone,
  Home,
  Users,
  Building2,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

type NavigationProps = {
  onNavigate: (page: string) => void;
  currentPage: string;
};

export default function Navigation({
  onNavigate,
  currentPage,
}: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  const menuItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "departments", label: "Departments", icon: Building2 },
    { id: "doctors", label: "Doctors", icon: Users },
    { id: "appointments", label: "Book Appointment", icon: Calendar },
    { id: "contact", label: "Contact", icon: Phone },
  ];

  const handleNavigation = (page: string) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => handleNavigation("home")}
          >
            <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-2 rounded-lg">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-900">
                HealthCare+ Support
              </span>
              <span className="text-xs text-gray-600">Your Health Partner</span>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                  currentPage === item.id
                    ? "bg-cyan-500 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <>
                <button
                  onClick={() => handleNavigation("profile")}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-all"
                >
                  <User className="h-4 w-4" />
                  <span className="font-medium">Profile</span>
                </button>
                <button
                  onClick={signOut}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all font-medium"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => handleNavigation("login")}
                className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all font-medium shadow-md"
              >
                Login / Sign Up
              </button>
            )}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-3 space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-all ${
                  currentPage === item.id
                    ? "bg-cyan-500 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
            <div className="pt-3 border-t border-gray-200">
              {user ? (
                <>
                  <button
                    onClick={() => handleNavigation("profile")}
                    className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-all"
                  >
                    <User className="h-5 w-5" />
                    <span className="font-medium">Profile</span>
                  </button>
                  <button
                    onClick={signOut}
                    className="w-full mt-2 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all font-medium"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleNavigation("login")}
                  className="w-full px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all font-medium"
                >
                  Login / Sign Up
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
