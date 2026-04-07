import React, { useState, useEffect } from 'react';
import { BookOpen, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, ArrowUp } from 'lucide-react';

interface FooterProps {
  setActiveSection?: (section: string) => void;
}

const Footer: React.FC<FooterProps> = ({ setActiveSection }) => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Détecter le scroll pour afficher/masquer le bouton "retour en haut"
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigation = (section: string) => {
    if (setActiveSection) {
      setActiveSection(section);
      // Faire défiler la page vers le haut
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  return (
    <>
      {/* Bouton retour en haut */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 z-50"
          aria-label="Retour en haut"
        >
          <ArrowUp className="h-6 w-6" />
        </button>
      )}

      <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Logo et description */}
          <div className="sm:col-span-2 lg:col-span-2">
            <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
              <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400" />
              <h3 className="text-xl sm:text-2xl font-bold">okétudes.sn</h3>
            </div>
            <p className="text-sm sm:text-base text-gray-300 mb-4 sm:mb-6 max-w-md">
              Votre plateforme éducative complète pour apprendre, découvrir et exceller dans toutes les matières. 
              Une approche moderne de l'éducation avec des outils innovants.
            </p>
            <div className="flex space-x-3 sm:space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Facebook className="h-5 w-5 sm:h-6 sm:w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Twitter className="h-5 w-5 sm:h-6 sm:w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Instagram className="h-5 w-5 sm:h-6 sm:w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Linkedin className="h-5 w-5 sm:h-6 sm:w-6" />
              </a>
            </div>
          </div>

          {/* Liens rapides */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Liens rapides</h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => handleNavigation('accueil')}
                  className="text-sm sm:text-base text-gray-300 hover:text-blue-400 transition-colors text-left"
                >
                  Accueil
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('mathematiques')}
                  className="text-sm sm:text-base text-gray-300 hover:text-blue-400 transition-colors text-left"
                >
                  Mathématiques
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('sciences')}
                  className="text-sm sm:text-base text-gray-300 hover:text-blue-400 transition-colors text-left"
                >
                  Sciences
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('langues')}
                  className="text-sm sm:text-base text-gray-300 hover:text-blue-400 transition-colors text-left"
                >
                  Langues
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('histoire')}
                  className="text-sm sm:text-base text-gray-300 hover:text-blue-400 transition-colors text-left"
                >
                  Histoire
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('geographie')}
                  className="text-sm sm:text-base text-gray-300 hover:text-blue-400 transition-colors text-left"
                >
                  Géographie
                </button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Contact</h4>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400" />
                <span className="text-sm sm:text-base text-gray-300">contact@okétudes.sn</span>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400" />
                <span className="text-sm sm:text-base text-gray-300">+221 XX XXX XX XX</span>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400" />
                <span className="text-sm sm:text-base text-gray-300">Dakar, Sénégal</span>
              </div>
            </div>
          </div>
        </div>

        {/* Ligne de séparation */}
        <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-0">
              © 2024 okétudes.sn. Tous droits réservés.
            </div>
            <div className="flex flex-wrap justify-center sm:justify-end gap-3 sm:gap-6 text-xs sm:text-sm">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                Politique de confidentialité
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                Conditions d'utilisation
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                Mentions légales
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
    </>
  );
};

export default Footer;
