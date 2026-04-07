import React, { useState } from 'react';
import Header from './components/Header';
import HeaderMock from './components/HeaderMock';
import Home from './components/Home';
import SubjectPage from './components/SubjectPage';
import SubjectPageMock from './components/SubjectPageMock';
import AdminPanel from './components/AdminPanel';
import AdminPanelMock from './components/AdminPanelMock';
import Footer from './components/Footer';

function App() {
  // Récupérer la section depuis l'URL si elle existe
  const urlParams = new URLSearchParams(window.location.search);
  const initialSection = urlParams.get('section') || 'accueil';
  
  const [activeSection, setActiveSection] = useState(initialSection);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderContent = () => {
    switch (activeSection) {
      case 'accueil':
        return <Home setActiveSection={setActiveSection} />;
      case 'admin':
        return <AdminPanelMock />;
      case 'mathematiques':
      case 'sciences':
      case 'langues':
      case 'histoire':
      case 'geographie':
      case 'ressources':
        return <SubjectPageMock subject={activeSection} />;
      default:
        return <Home setActiveSection={setActiveSection} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <HeaderMock
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />
      <main className="flex-grow">
        {renderContent()}
      </main>
      <Footer setActiveSection={setActiveSection} />
    </div>
  );
}

export default App;