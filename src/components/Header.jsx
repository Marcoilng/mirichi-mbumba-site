import { useState } from 'react'

const LOGO_URL = "https://lh3.googleusercontent.com/aida-public/AB6AXuBTQx4XpqduwRNrkuot8PYRa2nJ2In7xephtTHjxezufGBVjqvql2yJNPcNAz_yp8-YDPjgWELhyi7u-qvjdLUnzihYn3C5DcuwoIIUABppJrpaiI4fAouLEjj_aU4vNbNc0YNwP7BheaQp4yze1knaToO0d3AuMAGBYF7cervDAVIuWfl6qDV10iCQJTRqtkwUaz5ErM-tKIBfT7j9SUg7sCOmwffdgGNTTrcG9qIoDh1EgNt281uA"

function Header({ currentPage, onPageChange }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { path: 'home', label: 'Home' },
    { path: 'ticketing', label: 'Ticketing' },
    { path: 'my-tickets', label: 'My Tickets' },
    { path: 'admin-dashboard', label: 'Admin' },
  ]

  return (
    <header className="fixed top-0 w-full z-50 bg-surface/70 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-20 w-full px-margin-desktop md:px-margin-desktop flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img 
            alt="Logo TOUCH UP" 
            className="h-8 w-auto object-contain" 
            src={LOGO_URL} 
          />
          <span className="font-headline-sm text-headline-sm text-primary uppercase tracking-widest">
            Touch Up
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-gutter">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => onPageChange(item.path)}
              className={`font-label-caps text-label-caps transition-colors ${
                currentPage === item.path 
                  ? 'text-primary font-bold' 
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-on-primary text-[18px]">
              person
            </span>
          </div>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="material-symbols-outlined text-on-surface">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="md:hidden absolute top-20 left-0 right-0 bg-surface-container-lowest shadow-lg border-t border-outline-variant/10">
          <div className="flex flex-col p-4">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  onPageChange(item.path)
                  setMobileMenuOpen(false)
                }}
                className={`font-label-caps text-label-caps py-3 text-left transition-colors ${
                  currentPage === item.path 
                    ? 'text-primary font-bold' 
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
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
