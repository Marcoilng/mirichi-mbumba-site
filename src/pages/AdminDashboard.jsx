import { useState, useEffect } from 'react'

const STORAGE_KEY = 'event_registrations'
const MAX_PARTICIPANTS = 100

function AdminDashboard({ onPageChange }) {
  const [registrations, setRegistrations] = useState([])
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      setRegistrations(JSON.parse(stored))
    }
  }, [])

  const filteredRegistrations = registrations.filter(reg => 
    reg.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    reg.email?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const confirmedCount = registrations.length
  const revenue = confirmedCount * 0 // Free event
  const daysUntilEvent = Math.ceil((new Date('2026-08-29') - new Date()) / (1000 * 60 * 60 * 24))

  return (
    <main className="w-full pt-20 bg-background min-h-screen">
      <div className="flex">
        
        {/* Sidebar */}
        <aside className="fixed left-0 top-0 h-full w-72 bg-surface-container-lowest z-50 flex flex-col shadow-[0_0_20px_rgba(0,0,0,0.05)]">
          <div className="p-8 flex items-center gap-3 border-b border-outline-variant/10">
            <img 
              alt="Logo" 
              className="h-8 w-auto" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBTQx4XpqduwRNrkuot8PYRa2nJ2In7xephtTHjxezufGBVjqvql2yJNPcNAz_yp8-YDPjgWELhyi7u-qvjdLUnzihYn3C5DcuwoIIUABppJrpaiI4fAouLEjj_aU4vNbNc0YNwP7BheaQp4yze1knaToO0d3AuMAGBYF7cervDAVIuWfl6qDV10iCQJTRqtkwUaz5ErM-tKIBfT7j9SUg7sCOmwffdgGNTTrcG9qIoDh1EgNt281uA" 
            />
            <span className="font-headline-sm text-headline-sm text-primary uppercase">Touch Up</span>
          </div>
          
          <nav className="flex-1 p-6 space-y-2">
            <a className="flex items-center px-4 py-3 rounded-xl transition-all group bg-primary-container text-on-primary-container font-bold">
              <span className="material-symbols-outlined mr-4">dashboard</span>
              <span className="font-label-caps">Overview</span>
            </a>
            <a className="flex items-center px-4 py-3 rounded-xl text-on-surface-variant hover:bg-surface-container-high transition-all group">
              <span className="material-symbols-outlined mr-4">groups</span>
              <span className="font-label-caps">Participants</span>
            </a>
            <a className="flex items-center px-4 py-3 rounded-xl text-on-surface-variant hover:bg-surface-container-high transition-all group">
              <span className="material-symbols-outlined mr-4">confirmation_number</span>
              <span className="font-label-caps">Ticketing</span>
            </a>
          </nav>
          
          <div className="p-6 border-t border-outline-variant/10">
            <a 
              onClick={() => onPageChange('home')}
              className="flex items-center px-4 py-3 text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined mr-4">logout</span>
              <span className="font-label-caps">Logout</span>
            </a>
          </div>
        </aside>

        {/* Main Content */}
        <div className="ml-72 flex-1">
          
          {/* Hero Header Structure with Depth */}
          <div className="px-margin-desktop py-12 relative w-full mb-8">
            <div className="absolute inset-0 bg-surface-container-low -z-10 rounded-br-[120px] shadow-sm"></div>
            <div className="max-w-container-max mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative z-10">
              <div className="flex flex-col max-w-2xl">
                <span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest mb-4">
                  Event Overview
                </span>
                <h1 className="font-display-lg text-display-lg text-on-surface mb-2 leading-tight">
                  TOUCH UP: Future Leaders
                </h1>
                <p className="font-body-lg text-body-lg text-on-surface-variant">
                  Kinshasa, DRC • Aug 29, 2026
                </p>
              </div>
              <div className="flex gap-4">
                <button className="bg-surface-container-highest hover:bg-inverse-primary text-on-surface px-6 py-3 rounded-full flex items-center gap-2 transition-all shadow-sm">
                  <span className="material-symbols-outlined text-[20px]">download</span>
                  <span className="font-label-caps text-label-caps">Exporter</span>
                </button>
                <button className="bg-primary hover:bg-secondary text-on-primary px-6 py-3 rounded-full flex items-center gap-2 transition-all shadow-md">
                  <span className="material-symbols-outlined text-[20px]">campaign</span>
                  <span className="font-label-caps text-label-caps">Rappel</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Container */}
          <div className="max-w-container-max mx-auto w-full px-margin-desktop flex flex-col gap-12">
            
            {/* Stat Cards: Fluid Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full relative z-20 -mt-16">
              
              {/* Card 1: Registration */}
              <div className="bg-surface p-8 rounded-xl shadow-lg relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary-fixed/20 rounded-full blur-2xl"></div>
                <div className="flex justify-between items-start mb-6 relative z-10">
                  <span className="font-headline-sm text-headline-sm text-on-surface">Registered</span>
                  <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center">
                    <span className="material-symbols-outlined">group</span>
                  </div>
                </div>
                <div className="flex items-end gap-3 mb-4">
                  <span className="font-display-lg text-display-lg text-on-surface leading-none">
                    {confirmedCount}
                  </span>
                  <span className="font-headline-sm text-headline-sm text-on-surface-variant pb-1">
                    / {MAX_PARTICIPANTS}
                  </span>
                </div>
                <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden mt-4">
                  <div 
                    className="bg-secondary-container h-full rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${(confirmedCount / MAX_PARTICIPANTS) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Card 2: Revenue */}
              <div className="bg-surface p-8 rounded-xl shadow-lg relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                <div className="absolute -left-6 -bottom-6 w-32 h-32 bg-secondary-fixed/20 rounded-full blur-3xl"></div>
                <div className="flex justify-between items-start mb-6 relative z-10">
                  <span className="font-headline-sm text-headline-sm text-on-surface">Revenue</span>
                  <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center">
                    <span className="material-symbols-outlined">payments</span>
                  </div>
                </div>
                <div className="flex items-end gap-2 mb-2">
                  <span className="font-display-lg text-display-lg text-on-surface leading-none">
                    ${revenue.toLocaleString()}
                  </span>
                </div>
                <span className="font-label-caps text-label-caps text-secondary block mt-2">
                  Free Event
                </span>
              </div>

              {/* Card 3: Countdown */}
              <div className="bg-primary p-8 rounded-xl shadow-xl relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                <svg className="absolute inset-0 w-full h-full opacity-10" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <path className="text-on-primary" d="M0,100 L100,0 L100,100 Z" fill="currentColor"></path>
                </svg>
                <div className="flex justify-between items-start mb-6 relative z-10">
                  <span className="font-headline-sm text-headline-sm text-on-primary">Countdown</span>
                  <div className="w-10 h-10 rounded-full bg-on-primary/20 text-on-primary flex items-center justify-center backdrop-blur-md">
                    <span className="material-symbols-outlined">timer</span>
                  </div>
                </div>
                <div className="flex items-end gap-3 mb-2 relative z-10">
                  <span className="font-display-lg text-display-lg text-secondary-fixed leading-none">
                    {daysUntilEvent}
                  </span>
                  <span className="font-headline-sm text-headline-sm text-on-primary/70 pb-1">
                    Days
                  </span>
                </div>
                <div className="mt-4 flex gap-2 relative z-10">
                  <span className="font-label-caps text-label-caps px-3 py-1 bg-on-primary/10 text-on-primary rounded-full backdrop-blur-sm">
                    Action Required
                  </span>
                </div>
              </div>
            </div>

            {/* Participant List Section */}
            <div className="flex flex-col w-full bg-surface rounded-2xl shadow-sm p-8">
              
              {/* Toolbar */}
              <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
                <h2 className="font-headline-md text-headline-md text-on-surface">Participants</h2>
                <div className="flex w-full md:w-auto gap-4">
                  
                  {/* Search */}
                  <div className="relative flex-1 md:w-64">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
                      search
                    </span>
                    <input 
                      className="w-full bg-surface-container pl-12 pr-4 py-3 rounded-xl font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/70 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface transition-all"
                      placeholder="Search name or email..."
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  {/* Filter */}
                  <button className="bg-surface-container px-4 py-3 rounded-xl flex items-center gap-2 hover:bg-surface-container-high transition-colors">
                    <span className="material-symbols-outlined text-on-surface">filter_list</span>
                    <span className="font-label-caps text-label-caps text-on-surface hidden md:inline">
                      Filter
                    </span>
                  </button>
                </div>
              </div>

              {/* Table Header */}
              <div className="grid grid-cols-[3fr_2fr_1fr_1fr] gap-4 px-6 py-4 bg-surface-container-low rounded-t-xl mb-2">
                <span className="font-label-caps text-label-caps text-on-surface-variant">Participant Info</span>
                <span className="font-label-caps text-label-caps text-on-surface-variant">Ticket Type</span>
                <span className="font-label-caps text-label-caps text-on-surface-variant">Status</span>
                <span className="font-label-caps text-label-caps text-on-surface-variant text-right">Actions</span>
              </div>

              {/* List Items */}
              <div className="flex flex-col gap-2">
                {filteredRegistrations.length === 0 ? (
                  <div className="text-center py-12 text-on-surface-variant">
                    <span className="material-symbols-outlined text-4xl mb-2">search_off</span>
                    <p>No participants found</p>
                  </div>
                ) : (
                  filteredRegistrations.map((registration) => (
                    <div 
                      key={registration.id}
                      className="grid grid-cols-[3fr_2fr_1fr_1fr] gap-4 items-center px-6 py-4 bg-surface rounded-xl hover:bg-surface-container-lowest transition-colors shadow-sm group"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center shrink-0">
                          <span className="font-headline-sm text-headline-sm text-on-surface-variant">
                            {registration.fullName?.charAt(0)?.toUpperCase() || 'U'}
                          </span>
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-headline-sm text-headline-sm text-on-surface truncate text-[18px]">
                            {registration.fullName}
                          </span>
                          <span className="font-body-md text-body-md text-on-surface-variant truncate">
                            {registration.email}
                          </span>
                        </div>
                      </div>
                      <div>
                        <span className="font-body-md text-body-md text-on-surface">General Admission</span>
                      </div>
                      <div>
                        <span className="inline-flex px-3 py-1 bg-primary/10 text-primary font-label-caps text-[12px] rounded-full items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                          Confirmed
                        </span>
                      </div>
                      <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-on-surface-variant hover:text-primary rounded-full hover:bg-surface-container">
                          <span className="material-symbols-outlined">more_vert</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Pagination Footer */}
              <div className="flex justify-between items-center mt-8 pt-6 border-t border-surface-container-high">
                <span className="font-body-md text-body-md text-on-surface-variant">
                  Showing 1-{filteredRegistrations.length} of {registrations.length}
                </span>
                <div className="flex gap-2">
                  <button className="w-10 h-10 rounded-full flex items-center justify-center bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-colors">
                    <span className="material-symbols-outlined">chevron_left</span>
                  </button>
                  <button className="w-10 h-10 rounded-full flex items-center justify-center bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-colors">
                    <span className="material-symbols-outlined">chevron_right</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default AdminDashboard
