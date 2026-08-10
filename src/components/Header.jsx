import { useState } from 'react'

const LOGO_URL = "https://lh3.googleusercontent.com/aida-public/AB6AXuBTQx4XpqduwRNrkuot8PYRa2nJ2In7xephtTHjxezufGBVjqvql2yJNPcNAz_yp8-YDPjgWELhyi7u-qvjdLUnzihYn3C5DcuwoIIUABppJrpaiI4fAouLEjj_aU4vNbNc0YNwP7BheaQp4yze1knaToO0d3AuMAGBYF7cervDAVIuWfl6qDV10iCQJTRqtkwUaz5ErM-tKIBfT7j9SUg7sCOmwffdgGNTTrcG9qIoDh1EgNt281uA"

function Header({ currentPage, onPageChange }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { path: 'home', label: 'Home', icon: 'home' },
    { path: 'events', label: 'Events', icon: 'event' },
  ]

  return (
    <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-2xl shadow-lg border-b border-outline-variant/20 transition-all duration-300">
      <div className="h-20 w-full px-margin-desktop md:px-margin-desktop flex items-center justify-between">
        <div 
          className="flex items-center gap-4 cursor-pointer group"
          onClick={() => onPageChange('home')}
        >
          <div className="relative">
            <img 
              alt="Logo TOUCH UP" 
              className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-110" 
              src={LOGO_URL} 
            />
            <div className="absolute inset-0 bg-secondary-container/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <span className="font-headline-sm text-headline-sm text-primary uppercase tracking-widest font-bold group-hover:text-secondary transition-colors duration-300">
            Touch Up
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => onPageChange(item.path)}
              className={`relative font-label-caps text-label-caps transition-all duration-300 group py-2 ${
                currentPage === item.path 
                  ? 'text-primary font-bold' 
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                {item.label}
              </span>
              {currentPage === item.path && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-secondary-container rounded-full animate-scale-in"></span>
              )}
              {currentPage !== item.path && (
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-secondary-container rounded-full group-hover:w-full transition-all duration-300"></span>
              )}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button className="relative w-10 h-10 rounded-full bg-primary flex items-center justify-center hover:bg-secondary-container hover:text-on-secondary-container transition-all duration-300 hover:scale-110 hover:shadow-lg group">
            <span className="material-symbols-outlined text-on-primary group-hover:text-on-secondary-container text-[20px]">
              person
            </span>
            <div className="absolute inset-0 bg-secondary-container/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden p-3 rounded-xl hover:bg-surface-container transition-colors duration-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="material-symbols-outlined text-on-surface text-[24px]">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="md:hidden absolute top-20 left-0 right-0 bg-surface-container-lowest shadow-2xl border-t border-outline-variant/20 animate-slide-in-down">
          <div className="flex flex-col p-4 space-y-2">
            {navItems.map((item, index) => (
              <button
                key={item.path}
                onClick={() => {
                  onPageChange(item.path)
                  setMobileMenuOpen(false)
                }}
                className={`font-label-caps text-label-caps py-4 px-6 rounded-xl text-left transition-all duration-300 flex items-center gap-3 ${
                  currentPage === item.path 
                    ? 'bg-primary text-on-primary font-bold shadow-md' 
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        </nav>
      )}
    </header>
  )
}

export default Header
