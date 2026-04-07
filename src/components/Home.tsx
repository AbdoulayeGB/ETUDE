import React from 'react';
import { Calculator, Microscope, Languages, Clock, Globe, BookOpen, ArrowRight, Users, Award, TrendingUp } from 'lucide-react';

interface HomeProps {
  setActiveSection: (section: string) => void;
}

const Home: React.FC<HomeProps> = ({ setActiveSection }) => {
  const subjects = [
    {
      id: 'mathematiques',
      title: 'Mathématiques',
      description: 'Algèbre, géométrie, statistiques et plus encore',
      icon: Calculator,
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      id: 'sciences',
      title: 'Sciences',
      description: 'Physique, chimie, biologie et sciences de la terre',
      icon: Microscope,
      color: 'bg-green-600 hover:bg-green-700'
    },
    {
      id: 'langues',
      title: 'Langues',
      description: 'Français, anglais, espagnol et autres langues',
      icon: Languages,
      color: 'bg-purple-600 hover:bg-purple-700'
    },
    {
      id: 'histoire',
      title: 'Histoire',
      description: 'Histoire de France et du monde, civilisations',
      icon: Clock,
      color: 'bg-orange-600 hover:bg-orange-700'
    },
    {
      id: 'geographie',
      title: 'Géographie',
      description: 'Géographie physique et humaine, cartographie',
      icon: Globe,
      color: 'bg-teal-600 hover:bg-teal-700'
    },
    {
      id: 'ressources',
      title: 'Ressources',
      description: 'Outils pédagogiques, exercices et supports',
      icon: BookOpen,
      color: 'bg-indigo-600 hover:bg-indigo-700'
    }
  ];

  const stats = [
    { label: 'Élèves actifs', value: '2,500+', icon: Users },
    { label: 'Cours disponibles', value: '150+', icon: BookOpen },
    { label: 'Taux de réussite', value: '95%', icon: Award },
    { label: 'Progression moyenne', value: '+40%', icon: TrendingUp }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6">
            Bienvenue sur{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              okétudes.sn
            </span>
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-8 sm:mb-12 max-w-4xl mx-auto px-4">
            Votre plateforme éducative complète pour apprendre, découvrir et exceller dans toutes les matières
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-12 sm:mb-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg mb-3 sm:mb-4">
                  <stat.icon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                </div>
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">{stat.value}</div>
                <div className="text-sm sm:text-base text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subjects Grid */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-3 sm:mb-4">
            Explorez nos rubriques éducatives
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 text-center mb-8 sm:mb-12 max-w-3xl mx-auto px-4">
            Découvrez un contenu riche et varié adapté à tous les niveaux scolaires
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {subjects.map((subject) => (
              <div
                key={subject.id}
                onClick={() => setActiveSection(subject.id)}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-100 overflow-hidden transform hover:-translate-y-1"
              >
                <div className="p-6 sm:p-8">
                  <div className={`inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 ${subject.color} rounded-2xl mb-4 sm:mb-6 transition-colors duration-300`}>
                    <subject.icon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">{subject.title}</h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">{subject.description}</p>
                  <div className="flex items-center text-blue-600 font-semibold group-hover:text-blue-700">
                    <span>Découvrir</span>
                    <ArrowRight className="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Pourquoi choisir okétudes.sn ?
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Une approche moderne de l'éducation avec des outils innovants
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center p-6 sm:p-8 bg-white rounded-2xl shadow-lg">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Contenu de qualité</h3>
              <p className="text-sm sm:text-base text-gray-600">
                Des cours conçus par des enseignants expérimentés et régulièrement mis à jour
              </p>
            </div>
            
            <div className="text-center p-6 sm:p-8 bg-white rounded-2xl shadow-lg">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Apprentissage collaboratif</h3>
              <p className="text-sm sm:text-base text-gray-600">
                Échangez avec d'autres élèves et bénéficiez d'un accompagnement personnalisé
              </p>
            </div>
            
            <div className="text-center p-6 sm:p-8 bg-white rounded-2xl shadow-lg sm:col-span-2 lg:col-span-1">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Suivi de progression</h3>
              <p className="text-sm sm:text-base text-gray-600">
                Suivez vos progrès en temps réel et identifiez vos points forts et axes d'amélioration
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;