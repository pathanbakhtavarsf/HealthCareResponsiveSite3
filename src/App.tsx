import { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import DepartmentsPage from './pages/DepartmentsPage';
import DoctorsPage from './pages/DoctorsPage';
import AppointmentsPage from './pages/AppointmentsPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} />;
      case 'departments':
        return <DepartmentsPage onNavigate={setCurrentPage} />;
      case 'doctors':
        return <DoctorsPage onNavigate={setCurrentPage} />;
      case 'appointments':
        return <AppointmentsPage onNavigate={setCurrentPage} />;
      case 'contact':
        return <ContactPage />;
      case 'login':
        return <LoginPage onNavigate={setCurrentPage} />;
      case 'profile':
        return <ProfilePage onNavigate={setCurrentPage} />;
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen">
        <Navigation onNavigate={setCurrentPage} currentPage={currentPage} />
        <main className="flex-grow">
          {renderPage()}
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
