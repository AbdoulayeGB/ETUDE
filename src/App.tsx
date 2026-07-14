import { useState } from 'react';
import Header from './components/Header';
import Home from './components/Home';
import SubjectPage from './components/SubjectPage';
import CourseDetail from './components/CourseDetail';
import AdminPanel from './components/AdminPanel';
import Footer from './components/Footer';

function App() {
  const urlParams = new URLSearchParams(window.location.search);
  const initialSection = urlParams.get('section') || 'accueil';

  const [activeSection, setActiveSection] = useState(initialSection);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavigate = (section: string) => {
    setActiveSection(section);
    setSelectedCourseId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCourse = (courseId: string) => {
    setSelectedCourseId(courseId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderContent = () => {
    if (selectedCourseId) {
      return (
        <CourseDetail
          courseId={selectedCourseId}
          onBack={() => setSelectedCourseId(null)}
        />
      );
    }

    switch (activeSection) {
      case 'accueil':
        return <Home setActiveSection={handleNavigate} />;
      case 'admin':
        return <AdminPanel />;
      case 'mathematiques':
      case 'sciences':
      case 'langues':
      case 'histoire':
      case 'geographie':
      case 'ressources':
        return (
          <SubjectPage
            subject={activeSection}
            onSelectCourse={handleSelectCourse}
          />
        );
      default:
        return <Home setActiveSection={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header
        activeSection={activeSection}
        setActiveSection={handleNavigate}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />
      <main className="flex-grow">{renderContent()}</main>
      <Footer setActiveSection={handleNavigate} />
    </div>
  );
}

export default App;
