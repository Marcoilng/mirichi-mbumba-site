import { useState, useEffect } from 'react'

const HERO_BG_URL = "https://lh3.googleusercontent.com/aida-public/AB6AXuAclY35KbO-4CKSfMmB2d2TNqjUNO-b9kOZqrrKAFs3gRsVycOaxqumf6s8v-1zIW_WqGYclqTc63-xMA9b3wYkg13yKgKc0W-jNmX4AFQ36TOJFB1M7EY6koKYtdDjd-F3UK4GJ95H92iwoCeVhJuMC3WK4sBUeekmJdR4Bav8NRQymmbzB6uES5EYXCqHLALBo6edfFYr5VBc1rCXEUSzNQZZvy8HxWEsczSdlznw6oBcq-uuRUKq"

function EventsPage({ onPageChange }) {
  const [events, setEvents] = useState([])

  useEffect(() => {
    // Sample events data for Mirichi
    const mirichiEvents = [
      {
        id: 1,
        title: 'TOUCH UP',
        subtitle: 'L\'identité avant la réussite',
        date: 'Samedi 29 août 2026',
        time: 'À partir de 13h00',
        location: 'Silikin Village, Kinshasa',
        category: 'Développement Personnel',
        featured: true,
        description: 'Une journée d\'immersion pour redéfinir le succès. Touchez à l\'essentiel, forgez votre caractère, et préparez-vous à impacter Kinshasa.',
        image: HERO_BG_URL,
        status: 'upcoming'
      },
      {
        id: 2,
        title: 'Business Summit',
        subtitle: 'Entrepreneurs de Demain',
        date: 'Samedi 15 novembre 2026',
        time: 'À partir de 09h00',
        location: 'Grand Hôtel, Kinshasa',
        category: 'Business',
        featured: false,
        description: 'Rassemblement des entrepreneurs congolais pour partager expériences et opportunités.',
        image: HERO_BG_URL,
        status: 'upcoming'
      },
      {
        id: 3,
        title: 'Tech Innovation',
        subtitle: 'L\'avenir de la technologie',
        date: 'Samedi 20 décembre 2026',
        time: 'À partir de 10h00',
        location: 'Digital Hub, Kinshasa',
        category: 'Technologie',
        featured: false,
        description: 'Découverte des dernières innovations technologiques et networking.',
        image: HERO_BG_URL,
        status: 'upcoming'
      }
    ]
    setEvents(mirichiEvents)
  }, [])

  const featuredEvents = events.filter(event => event.featured)
  const regularEvents = events.filter(event => !event.featured)

  return (
    <main className="w-full pt-20 bg-background min-h-screen">
      
      {/* Hero Section */}
      <section className="relative w-full min-h-[60vh] flex items-center justify-center -mt-20 pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            alt="Events Background" 
            className="w-full h-full object-cover object-center filter brightness-40 scale-105 animate-slow-zoom" 
            src={HERO_BG_URL} 
          />
        </div>
        
        {/* Animated Gradient Overlay */}
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-primary via-primary/70 to-transparent animate-gradient-shift"></div>
        
        {/* Floating Particles */}
        <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-secondary-container/30 rounded-full animate-float-1"></div>
          <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-secondary-container/20 rounded-full animate-float-2"></div>
          <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-secondary-container/25 rounded-full animate-float-3"></div>
        </div>
        
        <div className="relative z-20 w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex flex-col items-center justify-center h-full pb-16 md:pb-24 text-center">
          
          <div className="w-16 h-1 bg-gradient-to-r from-secondary-container to-transparent mb-8 animate-pulse-slow"></div>
          
          <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-primary mb-6 max-w-4xl tracking-tight leading-tight animate-fade-in-up">
            Événements Mirichi
          </h1>
          
          <p className="font-body-lg text-body-lg text-surface-container-high max-w-2xl mb-10 opacity-95 leading-relaxed animate-fade-in-up-delay-1">
            Découvrez les événements organisés par Mirichi pour inspirer et transformer
          </p>
        </div>
      </section>

      <div className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-24">
        
        {/* Featured Events */}
        {featuredEvents.length > 0 && (
          <section className="mb-24">
            <div className="flex items-center gap-4 mb-12 animate-slide-in-left">
              <span className="material-symbols-outlined text-3xl text-secondary-container">star</span>
              <h2 className="font-headline-md text-headline-md text-on-surface uppercase tracking-widest">
                Événement à la une
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-8">
              {featuredEvents.map((event, index) => (
                <div 
                  key={event.id}
                  className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 group cursor-pointer animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div className="relative h-72 lg:h-auto overflow-hidden">
                      <img 
                        alt={event.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        src={event.image || HERO_BG_URL}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent"></div>
                      <div className="absolute top-6 right-6">
                        <span className="bg-secondary-container text-on-secondary-container px-6 py-3 rounded-full font-label-caps text-label-caps text-sm uppercase shadow-lg animate-glow">
                          {event.category}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-10 lg:p-14 flex flex-col justify-center relative">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-secondary-container/10 rounded-full blur-3xl"></div>
                      
                      <h3 className="font-display-lg-mobile text-display-lg-mobile text-primary mb-3 relative z-10">
                        {event.title}
                      </h3>
                      {event.subtitle && (
                        <p className="font-body-lg text-body-lg text-secondary mb-8 italic relative z-10">
                          {event.subtitle}
                        </p>
                      )}
                      
                      <div className="space-y-5 mb-8 relative z-10">
                        <div className="flex items-center gap-4 p-3 bg-surface-container rounded-xl hover:bg-surface-container-high transition-colors">
                          <span className="material-symbols-outlined text-secondary-container text-[24px]">calendar_today</span>
                          <span className="font-body-md text-body-md text-on-surface">{event.date}</span>
                        </div>
                        <div className="flex items-center gap-4 p-3 bg-surface-container rounded-xl hover:bg-surface-container-high transition-colors">
                          <span className="material-symbols-outlined text-secondary-container text-[24px]">schedule</span>
                          <span className="font-body-md text-body-md text-on-surface">{event.time}</span>
                        </div>
                        <div className="flex items-center gap-4 p-3 bg-surface-container rounded-xl hover:bg-surface-container-high transition-colors">
                          <span className="material-symbols-outlined text-secondary-container text-[24px]">location_on</span>
                          <span className="font-body-md text-body-md text-on-surface">{event.location}</span>
                        </div>
                      </div>
                      
                      {event.description && (
                        <p className="font-body-md text-body-md text-on-surface-variant mb-8 line-clamp-3 leading-relaxed relative z-10">
                          {event.description}
                        </p>
                      )}
                      
                      <div className="inline-flex items-center gap-2 bg-secondary-container/10 px-4 py-2 rounded-full relative z-10">
                        <span className="w-2 h-2 rounded-full bg-secondary-container animate-pulse"></span>
                        <span className="font-label-caps text-label-caps text-secondary-container text-xs uppercase">
                          À venir
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Regular Events */}
        {regularEvents.length > 0 && (
          <section>
            <div className="flex items-center gap-4 mb-12 animate-slide-in-right">
              <span className="material-symbols-outlined text-3xl text-primary">event</span>
              <h2 className="font-headline-md text-headline-md text-on-surface uppercase tracking-widest">
                Tous les événements
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularEvents.map((event, index) => (
                <div 
                  key={event.id}
                  className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group cursor-pointer animate-scale-in hover:-translate-y-2"
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  <div className="h-56 relative overflow-hidden">
                    <img 
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      src={event.image || HERO_BG_URL}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent"></div>
                    {event.category && (
                      <div className="absolute top-4 right-4">
                        <span className="bg-surface/90 backdrop-blur-md text-on-surface px-4 py-2 rounded-full font-label-caps text-label-caps text-xs uppercase shadow-md">
                          {event.category}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2 group-hover:text-secondary transition-colors">
                      {event.title}
                    </h3>
                    {event.subtitle && (
                      <p className="font-body-md text-body-md text-secondary mb-4 text-sm">
                        {event.subtitle}
                      </p>
                    )}
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3 text-sm text-on-surface-variant">
                        <span className="material-symbols-outlined text-[20px] text-primary">calendar_today</span>
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-on-surface-variant">
                        <span className="material-symbols-outlined text-[20px] text-primary">location_on</span>
                        <span className="truncate">{event.location}</span>
                      </div>
                    </div>
                    
                    <div className="inline-flex items-center gap-2 bg-secondary-container/10 px-3 py-1 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary-container animate-pulse"></span>
                      <span className="font-label-caps text-label-caps text-secondary-container text-[10px] uppercase">
                        À venir
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* No Events State */}
        {events.length === 0 && (
          <div className="text-center py-32 animate-fade-in-up">
            <div className="relative inline-block mb-6">
              <span className="material-symbols-outlined text-8xl text-outline-variant">event_busy</span>
              <div className="absolute inset-0 bg-secondary-container/20 rounded-full blur-2xl"></div>
            </div>
            <h2 className="font-headline-md text-headline-md text-on-surface mb-4">
              Aucun événement disponible
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mb-8 max-w-md mx-auto">
              Revenez bientôt pour découvrir nos nouvelles activités!
            </p>
            <button 
              onClick={() => onPageChange('home')}
              className="inline-flex items-center gap-2 bg-primary text-on-primary font-label-caps text-label-caps px-8 py-4 rounded-full hover:bg-secondary-container hover:text-on-secondary-container transition-all duration-300"
            >
              <span>Retour à l'accueil</span>
              <span className="material-symbols-outlined">home</span>
            </button>
          </div>
        )}
      </div>
    </main>
  )
}

export default EventsPage
