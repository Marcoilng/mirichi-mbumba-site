const HERO_BG_URL = "https://lh3.googleusercontent.com/aida-public/AB6AXuAclY35KbO-4CKSfMmB2d2TNqjUNO-b9kOZqrrKAFs3gRsVycOaxqumf6s8v-1zIW_WqGYclqTc63-xMA9b3wYkg13yKgKc0W-jNmX4AFQ36TOJFB1M7EY6koKYtdDjd-F3UK4GJ95H92iwoCeVhJuMC3WK4sBUeekmJdR4Bav8NRQymmbzB6uES5EYXCqHLALBo6edfFYr5VBc1rCXEUSzNQZZvy8HxWEsczSdlznw6oBcq-uuRUKq"

function HomePage({ onPageChange }) {
  return (
    <main className="w-full pt-20 bg-background min-h-screen">
      <div className="flex flex-col w-full font-body-md text-on-background">
        
        {/* Hero Section */}
        <section className="relative w-full min-h-[90vh] flex items-center justify-center -mt-20 pt-20 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              alt="Hero Background" 
              className="w-full h-full object-cover object-center filter brightness-40 scale-105 animate-slow-zoom" 
              src={HERO_BG_URL} 
            />
          </div>
          
          {/* Animated Gradient Overlay */}
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-primary via-primary/60 to-transparent animate-gradient-shift"></div>
          
          {/* Floating Particles */}
          <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-secondary-container/30 rounded-full animate-float-1"></div>
            <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-secondary-container/20 rounded-full animate-float-2"></div>
            <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-secondary-container/25 rounded-full animate-float-3"></div>
          </div>
          
          <div className="relative z-20 w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex flex-col items-start justify-end h-full pb-20 md:pb-40">
            
            {/* Animated Decorative Accent */}
            <div className="w-16 h-1 bg-gradient-to-r from-secondary-container to-transparent mb-8 animate-pulse-slow"></div>
            
            <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-primary mb-6 max-w-4xl tracking-tight leading-tight animate-fade-in-up">
              L'identité avant <br/> la réussite.
            </h1>
            
            <p className="font-body-lg text-body-lg text-surface-container-high max-w-2xl mb-12 opacity-95 leading-relaxed animate-fade-in-up-delay-1">
              Une journée d'immersion pour redéfinir le succès. Touchez à l'essentiel, forgez votre caractère, et préparez-vous à impacter Kinshasa.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center animate-fade-in-up-delay-2">
              <div className="flex items-center gap-3 mt-4 sm:mt-0 sm:ml-8 text-on-primary/90 bg-surface-container-lowest/20 backdrop-blur-md px-6 py-3 rounded-full border border-white/10">
                <span className="material-symbols-outlined text-[24px] text-secondary-container animate-pulse">stars</span>
                <span className="font-label-caps text-label-caps uppercase tracking-wider text-sm">
                  Coming Soon
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* About & Philosophy Section */}
        <section className="w-full py-24 md:py-32 bg-background relative overflow-hidden">
          {/* Subtle Background Elements */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-surface-container-high/40 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 opacity-50"></div>
          
          <div className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-gutter">
              
              {/* Left: Signature Quote Block */}
              <div className="col-span-1 lg:col-span-5 flex flex-col justify-center border-l-4 border-secondary-container pl-8 md:pl-12 py-4">
                <p className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest mb-6">
                  Notre Vision
                </p>
                <h2 className="font-headline-md text-headline-md text-on-background leading-snug">
                  Nous voulons contribuer à une génération de jeunes qui ne cherchent pas seulement à avoir, mais qui travaillent d'abord à <span className="text-secondary">devenir</span>.
                </h2>
              </div>

              {/* Right: Elaboration */}
              <div className="col-span-1 lg:col-span-6 lg:col-start-7 flex flex-col justify-center space-y-6">
                <p className="font-body-lg text-body-lg text-on-surface-variant">
                  Le leadership véritable ne naît pas des titres ou des possessions. Il émerge d'une compréhension profonde de qui l'on est, de ses valeurs fondamentales et de sa capacité à rester ancré face à l'adversité.
                </p>
                <p className="font-body-md text-body-md text-on-surface-variant/80">
                  TOUCH UP n'est pas une simple conférence. C'est un espace exclusif conçu pour les esprits ambitieux de Kinshasa. À travers des ateliers, des partages d'expériences intenses et des moments d'introspection, nous vous invitons à bâtir des fondations solides avant d'ériger les murs de votre succès.
                </p>
                
                <div className="pt-8 flex items-center gap-6">
                  <div className="flex flex-col">
                    <span className="font-display-lg-mobile text-display-lg-mobile text-primary leading-none">01</span>
                    <span className="font-label-caps text-label-caps text-outline uppercase tracking-wider text-[10px] mt-2">Édition</span>
                  </div>
                  <div className="w-px h-12 bg-outline-variant"></div>
                  <div className="flex flex-col">
                    <span className="font-display-lg-mobile text-display-lg-mobile text-primary leading-none">100</span>
                    <span className="font-label-caps text-label-caps text-outline uppercase tracking-wider text-[10px] mt-2">Leaders</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Event Details / Logistics */}
        <section className="w-full py-24 md:py-32 bg-surface">
          <div className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
              <div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface uppercase tracking-widest mb-2">
                  Les Détails
                </h3>
                <p className="font-body-lg text-body-lg text-on-surface-variant">
                  Tout ce que vous devez savoir pour nous rejoindre.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              
              {/* Detail Card 1: Date */}
              <div className="bg-surface-container-lowest p-8 md:p-10 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-transparent group-hover:bg-secondary-container transition-colors duration-300"></div>
                <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center mb-8 group-hover:bg-secondary-container/10 transition-colors">
                  <span className="material-symbols-outlined text-[24px] text-primary group-hover:text-secondary-container transition-colors">
                    calendar_today
                  </span>
                </div>
                <h4 className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider mb-3">
                  La Date
                </h4>
                <p className="font-headline-sm text-headline-sm text-on-background mb-1">
                  Samedi 29 Août 2026
                </p>
                <p className="font-body-md text-body-md text-outline">
                  À partir de 13h00
                </p>
              </div>

              {/* Detail Card 2: Location */}
              <div className="bg-surface-container-lowest p-8 md:p-10 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-transparent group-hover:bg-secondary-container transition-colors duration-300"></div>
                <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center mb-8 group-hover:bg-secondary-container/10 transition-colors">
                  <span className="material-symbols-outlined text-[24px] text-primary group-hover:text-secondary-container transition-colors">
                    location_on
                  </span>
                </div>
                <h4 className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider mb-3">
                  Le Lieu
                </h4>
                <p className="font-headline-sm text-headline-sm text-on-background mb-1">
                  Silikin Village
                </p>
                <p className="font-body-md text-body-md text-outline">
                  Kinshasa, RDC
                </p>
              </div>

              {/* Detail Card 3: Exclusivity */}
              <div className="bg-primary p-8 md:p-10 shadow-xl shadow-primary/10 relative overflow-hidden">
                {/* Geometric Pattern */}
                <svg className="absolute bottom-0 right-0 w-32 h-32 text-on-primary/5 transform translate-x-4 translate-y-4" fill="currentColor" viewBox="0 0 100 100">
                  <path d="M0 100 V0 L100 100 Z"></path>
                </svg>
                
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-full bg-on-primary/10 flex items-center justify-center mb-8">
                    <span className="material-symbols-outlined text-[24px] text-secondary-container">
                      group
                    </span>
                  </div>
                  <h4 className="font-label-caps text-label-caps text-inverse-primary uppercase tracking-wider mb-3">
                    Participation
                  </h4>
                  <p className="font-headline-sm text-headline-sm text-on-primary mb-1">
                    100 Participants
                  </p>
                  <p className="font-body-md text-body-md text-inverse-primary/70">
                    Uniquement. Une sélection rigoureuse pour des échanges de qualité.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Registration CTA Section */}
        <section className="w-full py-32 bg-background relative border-t border-outline-variant/30" id="register">
          <div className="w-full max-w-4xl mx-auto px-margin-mobile md:px-margin-desktop text-center">
            <div className="inline-flex items-center justify-center px-4 py-2 bg-secondary-container/10 rounded-full mb-8">
              <span className="w-2 h-2 rounded-full bg-secondary-container animate-pulse mr-3"></span>
              <span className="font-label-caps text-label-caps text-secondary-container uppercase tracking-wider">
                Inscriptions Ouvertes
              </span>
            </div>
            
            <h2 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-background mb-6 leading-tight">
              Prêt à sculpter votre identité ?
            </h2>
            
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto mb-12">
              Rejoignez-nous le 29 août 2026. Réservez votre place dès maintenant avant que l'événement ne soit complet.
            </p>
            
            <button 
              onClick={() => onPageChange('ticketing')}
              className="inline-flex items-center justify-center px-10 py-5 bg-primary text-on-primary font-label-caps text-label-caps tracking-widest uppercase hover:bg-secondary-container hover:text-tertiary transition-all duration-300 shadow-xl shadow-primary/20"
            >
              Réserver ma place
              <span className="material-symbols-outlined ml-3 text-[20px]">arrow_forward</span>
            </button>
          </div>
        </section>
      </div>
    </main>
  )
}

export default HomePage
