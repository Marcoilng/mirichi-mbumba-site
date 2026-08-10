import { useState, useEffect } from 'react'
import jsPDF from 'jspdf'
import QRCode from 'qrcode'

const STORAGE_KEY = 'event_registrations'
const MAX_PARTICIPANTS = 100
const LOCATION_IMAGE_URL = "https://lh3.googleusercontent.com/aida-public/AB6AXuAsLJRdrQPJ5cx-Aynpzdec7e50lrl5HTxmw_Lc9nQqThAmh6nZf0QABcaPdYUrd_YgkEQccfwEhd_1a-ycamxWvic0cbGrHm2YFumkDc6N6IgzUkR3sxyenAK4MjqZ5RXXCr_t-L4WXzbDjTxRLN58tO8J81FSe_YxVKwcKIHO8TJw62oFscGTQz8EovWB87pkuLB8eN9xhkc7nni-LpxAdGd13gW_b_vUP14ePebmXmsj4o6lvMog"

function TicketingPage({ onPageChange }) {
  const [registrations, setRegistrations] = useState([])
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    motivation: ''
  })
  const [isRegistered, setIsRegistered] = useState(false)
  const [ticketCode, setTicketCode] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [charCount, setCharCount] = useState(0)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const allRegistrations = JSON.parse(stored)
      setRegistrations(allRegistrations)
    }
  }, [])

  const remainingSpots = MAX_PARTICIPANTS - registrations.length
  const isFull = remainingSpots <= 0

  const generateSecureTicketCode = () => {
    const timestamp = Date.now().toString(36)
    const randomPart = Math.random().toString(36).substring(2, 10).toUpperCase()
    const eventPart = '1'.toString(36).toUpperCase()
    return `TKT-${eventPart}-${timestamp}-${randomPart}`.toUpperCase()
  }

  const generateTicketPDF = async () => {
    const doc = new jsPDF()
    
    const qrCodeDataURL = await QRCode.toDataURL(ticketCode || '', {
      width: 100,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    })
    
    // Header
    doc.setFillColor(0, 0, 0)
    doc.rect(0, 0, 210, 40, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(24)
    doc.text('Billet d\'Événement', 105, 25, { align: 'center' })
    
    // Event Title
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(20)
    doc.text('TOUCH UP 2026', 105, 60, { align: 'center' })
    doc.setFontSize(14)
    doc.setTextColor(100, 100, 100)
    doc.text("L'identité avant la réussite", 105, 70, { align: 'center' })
    
    // Event Details
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(12)
    let yPos = 90
    
    doc.setFontSize(14)
    doc.setTextColor(170, 59, 255)
    doc.text('Détails de l\'événement', 20, yPos)
    yPos += 10
    
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(11)
    doc.text(`Date: Samedi 29 Août 2026`, 20, yPos)
    yPos += 8
    doc.text(`Heure: À partir de 13h00`, 20, yPos)
    yPos += 8
    doc.text(`Lieu: Silikin Village, Kinshasa`, 20, yPos)
    yPos += 15
    
    // Participant Info
    doc.setFontSize(14)
    doc.setTextColor(170, 59, 255)
    doc.text('Informations du participant', 20, yPos)
    yPos += 10
    
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(11)
    doc.text(`Nom: ${formData.fullName || ''}`, 20, yPos)
    yPos += 8
    doc.text(`Email: ${formData.email || ''}`, 20, yPos)
    yPos += 8
    doc.text(`Téléphone: ${formData.phone || ''}`, 20, yPos)
    yPos += 20
    
    // QR Code Section
    doc.setFontSize(14)
    doc.setTextColor(170, 59, 255)
    doc.text('Scannez ce code QR à l\'entrée', 105, yPos, { align: 'center' })
    yPos += 10
    
    doc.addImage(qrCodeDataURL, 'PNG', 80, yPos, 50, 50)
    yPos += 60
    
    // Ticket Code Box
    doc.setFillColor(245, 240, 255)
    doc.rect(20, yPos, 170, 30, 'F')
    doc.setDrawColor(170, 59, 255)
    doc.rect(20, yPos, 170, 30, 'S')
    
    doc.setFontSize(10)
    doc.setTextColor(100, 100, 100)
    doc.text('Code Ticket Unique', 105, yPos + 12, { align: 'center' })
    
    doc.setFontSize(14)
    doc.setTextColor(170, 59, 255)
    doc.setFont(undefined, 'bold')
    doc.text(ticketCode || '', 105, yPos + 24, { align: 'center' })
    doc.setFont(undefined, 'normal')
    
    // Footer
    doc.setFontSize(10)
    doc.setTextColor(150, 150, 150)
    doc.text('Présentez ce code ou le QR code à l\'entrée de l\'événement', 105, 280, { align: 'center' })
    doc.text('Ce code est unique et personnel', 105, 285, { align: 'center' })
    
    doc.save(`ticket-touch-up-${formData.fullName?.replace(/\s+/g, '-')}.pdf`)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    if (name === 'motivation') {
      setCharCount(value.length)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (isFull) {
      alert('Désolé, l\'événement est complet!')
      return
    }

    setIsSubmitting(true)

    setTimeout(() => {
      const newTicketCode = generateSecureTicketCode()
      setTicketCode(newTicketCode)

      const newRegistration = {
        id: Date.now(),
        eventId: 1,
        ticketCode: newTicketCode,
        ...formData,
        registeredAt: new Date().toISOString()
      }

      const stored = localStorage.getItem(STORAGE_KEY)
      const allRegistrations = stored ? JSON.parse(stored) : []
      const updatedRegistrations = [...allRegistrations, newRegistration]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRegistrations))
      
      setRegistrations(updatedRegistrations)
      setIsRegistered(true)
      setIsSubmitting(false)
    }, 1500)
  }

  if (isRegistered) {
    return (
      <main className="w-full pt-20 bg-background min-h-screen">
        <div className="w-full flex-grow flex items-center justify-center py-16 px-4 sm:px-8">
          <div className="max-w-[400px] w-full flex flex-col items-center gap-8 relative z-10">
            <div className="text-center mb-4">
              <h1 className="font-display-lg-mobile text-display-lg-mobile text-primary mb-2">
                Your Ticket
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant">
                The journey of becoming starts here.
              </p>
            </div>

            {/* Ticket Card */}
            <div className="w-full relative group">
              <div className="absolute -inset-4 bg-secondary-container/20 blur-2xl rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
              <div className="w-full bg-surface-container-lowest rounded-3xl overflow-hidden shadow-2xl shadow-primary-container/10 transition-transform duration-500 ease-out hover:scale-[1.02] border border-outline-variant/30 flex flex-col relative z-10">
                
                {/* Top section */}
                <div className="h-48 relative overflow-hidden bg-primary-container">
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-container to-transparent"></div>
                  <div className="absolute top-6 left-6 right-6 flex justify-between items-start">
                    <span className="font-headline-sm text-headline-sm text-on-primary uppercase tracking-widest">
                      Touch Up
                    </span>
                    <div className="flex flex-col items-end">
                      <span className="font-label-caps text-label-caps text-secondary-container bg-surface-container-lowest/10 backdrop-blur-md px-3 py-1 rounded-full border border-secondary-container/30">
                        CONFIRMED
                      </span>
                      <span className="font-display-lg-mobile text-display-lg-mobile text-on-primary mt-1">
                        {registrations.length}<span className="text-on-primary/50 text-[24px]">/100</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Middle section */}
                <div className="p-8 pb-4 relative bg-surface-container-lowest flex-grow flex flex-col">
                  <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-background shadow-inner"></div>
                  <div className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-background shadow-inner"></div>
                  <div className="absolute top-0 left-6 right-6 h-[1px] border-t-2 border-dashed border-outline-variant/50"></div>
                  
                  <div className="flex flex-col gap-6">
                    <div>
                      <span className="font-label-caps text-label-caps text-outline mb-1 block">Participant</span>
                      <h2 className="font-headline-md text-headline-md text-on-surface truncate">
                        {formData.fullName}
                      </h2>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="font-label-caps text-label-caps text-outline mb-1 block">Date</span>
                        <p className="font-body-md text-body-md text-on-surface font-semibold">
                          August 29, 2026
                        </p>
                      </div>
                      <div>
                        <span className="font-label-caps text-label-caps text-outline mb-1 block">Location</span>
                        <p className="font-body-md text-body-md text-on-surface font-semibold truncate">
                          Silikin Village
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-center">
                    <div className="p-4 bg-surface rounded-xl border border-outline-variant/50 relative group/qr">
                      <div className="w-24 h-24 bg-primary/10 rounded-lg flex items-center justify-center">
                        <span className="material-symbols-outlined text-4xl text-primary">qr_code</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom section */}
                <div className="bg-primary p-6 flex flex-col items-center justify-center text-center border-t-4 border-secondary-container relative overflow-hidden">
                  <p className="font-headline-sm text-headline-sm text-secondary-container relative z-10 italic">
                    "L'identité avant la réussite."
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="w-full flex flex-col sm:flex-row gap-4 mt-4">
              <button 
                onClick={generateTicketPDF}
                className="flex-1 bg-primary text-on-primary font-label-caps text-label-caps h-14 rounded-full flex items-center justify-center gap-2 hover:bg-secondary-container hover:text-on-secondary-container transition-colors duration-300 shadow-xl shadow-primary/10"
              >
                <span className="material-symbols-outlined text-[20px]">download</span>
                Download PDF
              </button>
              <button 
                onClick={() => onPageChange('home')}
                className="flex-1 bg-surface-container text-on-surface font-label-caps text-label-caps h-14 rounded-full flex items-center justify-center gap-2 hover:bg-surface-variant transition-colors duration-300"
              >
                <span className="material-symbols-outlined text-[20px]">home</span>
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="w-full pt-20 bg-background min-h-screen">
      <div className="flex flex-col w-full relative">
        
        {/* Decorative background */}
        <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0">
          <div className="absolute top-[-10%] right-[-5%] w-1/2 h-[50vh] bg-surface-container-high/40 rounded-full blur-3xl opacity-60"></div>
          <div className="absolute bottom-[20%] left-[-10%] w-1/3 h-[40vh] bg-secondary-container/20 rounded-full blur-3xl opacity-50"></div>
        </div>

        <div className="w-full px-margin-desktop py-margin-desktop md:py-24 max-w-container-max mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          
          {/* Left Column: Context & Remaining Spots */}
          <div className="col-span-1 lg:col-span-5 flex flex-col gap-12">
            <div>
              <h1 className="font-display-lg text-display-lg text-on-background mb-4 text-balance">
                Sécurisez votre <span className="text-secondary relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-secondary">place.</span>
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-md">
                L'identité avant la réussite commence ici. Rejoignez les jeunes acteurs du changement de Kinshasa pour une journée de découverte et de création de valeur.
              </p>
            </div>

            {/* Live Spots Indicator */}
            <div className="bg-surface-container rounded-xl p-8 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
              <div className="absolute top-0 left-0 w-1 h-full bg-secondary"></div>
              
              <div className="flex items-start justify-between mb-6">
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                  Disponibilité
                </span>
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-error"></span>
                  </span>
                  <span className="font-label-caps text-label-caps text-error">
                    {isFull ? 'Complet' : 'Fermeture imminente'}
                  </span>
                </div>
              </div>

              <div className="flex items-baseline gap-4 mb-2">
                <span className="font-display-lg text-display-lg text-on-surface">
                  {remainingSpots}
                </span>
                <span className="font-headline-md text-headline-md text-on-surface-variant">
                  places
                </span>
              </div>

              <div className="w-full bg-surface-variant rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-secondary h-2 rounded-full relative"
                  style={{ width: `${(registrations.length / MAX_PARTICIPANTS) * 100}%` }}
                >
                  <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-r from-transparent to-white/50 animate-pulse"></div>
                </div>
              </div>

              <p className="font-body-md text-body-md text-on-surface-variant mt-4">
                Sur {MAX_PARTICIPANTS} places exclusives disponibles.
              </p>
            </div>

            {/* Visual Element */}
            <div 
              className="h-64 rounded-xl shadow-md overflow-hidden relative"
              style={{ backgroundImage: `url('${LOCATION_IMAGE_URL}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-4 p-4 bg-surface/90 backdrop-blur-md rounded-lg shadow-lg">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>
                    location_on
                  </span>
                  <div>
                    <p className="font-label-caps text-label-caps text-on-surface">Silikin Village</p>
                    <p className="font-body-md text-body-md text-on-surface-variant text-sm">Kinshasa, RDC</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Registration Form & Ticket Preview */}
          <div className="col-span-1 lg:col-span-7 flex flex-col lg:pl-12">
            
            {/* Ticket Preview */}
            <div className="w-full bg-primary-container text-on-primary-container rounded-t-xl p-8 relative overflow-hidden shadow-xl -mb-4 z-20 transition-transform hover:-translate-y-2 duration-300">
              <div className="absolute bottom-[-16px] left-[-16px] w-8 h-8 bg-background rounded-full z-10 shadow-inner"></div>
              <div className="absolute bottom-[-16px] right-[-16px] w-8 h-8 bg-background rounded-full z-10 shadow-inner"></div>
              
              <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
                <svg className="text-on-primary-container" height="200" viewBox="0 0 100 100" width="200">
                  <path d="M0,0 L100,0 L100,100 Z" fill="currentColor"></path>
                </svg>
              </div>

              <div className="flex justify-between items-start mb-12 relative z-10">
                <div>
                  <span className="font-label-caps text-label-caps text-secondary-fixed opacity-80 mb-2 block uppercase">
                    Pass Événement
                  </span>
                  <h3 className="font-headline-md text-headline-md text-on-primary-container">
                    TOUCH UP '26
                  </h3>
                </div>
                <div className="text-right">
                  <span className="font-display-lg-mobile text-display-lg-mobile text-on-primary-container">Gratuit</span>
                  <span className="font-body-md text-body-md opacity-70 block">Standard</span>
                </div>
              </div>

              <div className="flex justify-between items-end relative z-10">
                <div className="flex flex-col gap-1">
                  <span className="font-label-caps text-label-caps opacity-60 uppercase text-[10px]">Date</span>
                  <span className="font-body-md text-body-md text-on-primary-container">29 Août 2026</span>
                </div>
                <div className="flex flex-col gap-1 items-end">
                  <span className="font-label-caps text-label-caps opacity-60 uppercase text-[10px]">Statut</span>
                  <span className="px-3 py-1 bg-secondary-fixed/20 rounded-full font-label-caps text-label-caps text-secondary-fixed text-xs">
                    En attente d'inscription
                  </span>
                </div>
              </div>

              <div className="absolute bottom-0 left-8 right-8 h-px border-b-2 border-dashed border-on-primary-container/20"></div>
            </div>

            {/* Form Container */}
            <div className="bg-surface-container-lowest p-8 md:p-12 rounded-b-xl shadow-lg relative z-10">
              <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex flex-col gap-2 relative group">
                    <label className="font-label-caps text-label-caps text-on-surface-variant" htmlFor="fullName">
                      Nom Complet
                    </label>
                    <input 
                      className="w-full bg-transparent border-b-2 border-outline-variant py-3 text-body-lg text-on-surface focus:outline-none focus:border-primary transition-colors peer" 
                      id="fullName" 
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Jean Dupont" 
                      required 
                      type="text"
                    />
                    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-secondary transition-all duration-300 peer-focus:w-full"></div>
                  </div>
                  
                  <div className="flex flex-col gap-2 relative group">
                    <label className="font-label-caps text-label-caps text-on-surface-variant" htmlFor="email">
                      Adresse Email
                    </label>
                    <input 
                      className="w-full bg-transparent border-b-2 border-outline-variant py-3 text-body-lg text-on-surface focus:outline-none focus:border-primary transition-colors peer" 
                      id="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="jean.dupont@example.com" 
                      required 
                      type="email"
                    />
                    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-secondary transition-all duration-300 peer-focus:w-full"></div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 relative group">
                  <label className="font-label-caps text-label-caps text-on-surface-variant" htmlFor="phone">
                    Numéro de Téléphone
                  </label>
                  <input 
                    className="w-full bg-transparent border-b-2 border-outline-variant py-3 text-body-lg text-on-surface focus:outline-none focus:border-primary transition-colors peer" 
                    id="phone" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+243 000 000 000" 
                    required 
                    type="tel"
                  />
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-secondary transition-all duration-300 peer-focus:w-full"></div>
                </div>

                <div className="flex flex-col gap-2 relative group">
                  <label className="font-label-caps text-label-caps text-on-surface-variant" htmlFor="motivation">
                    Pourquoi voulez-vous participer ?
                  </label>
                  <textarea 
                    className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-4 text-body-md text-on-surface focus:outline-none focus:border-primary transition-colors resize-none mt-2" 
                    id="motivation" 
                    name="motivation"
                    value={formData.motivation}
                    onChange={handleInputChange}
                    placeholder="Partagez votre vision et ce que vous espérez accomplir..." 
                    required 
                    rows="4"
                    maxLength={500}
                  ></textarea>
                  <div className="absolute right-4 bottom-4 text-xs font-label-caps text-outline-variant">
                    <span className={charCount > 500 ? 'text-error' : ''}>{charCount}</span>/500
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-outline-variant mt-4">
                  <div className="flex flex-col">
                    <span className="font-body-md text-body-md text-on-surface-variant">Total à payer</span>
                    <span className="font-headline-sm text-headline-sm text-on-surface">Gratuit</span>
                  </div>
                  <button 
                    type="submit"
                    disabled={isSubmitting || isFull}
                    className="bg-primary text-on-primary font-label-caps text-label-caps uppercase px-8 py-4 rounded-lg shadow-md hover:bg-secondary hover:text-on-secondary transition-all duration-300 flex items-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="material-symbols-outlined animate-spin">progress_activity</span>
                        Traitement...
                      </>
                    ) : (
                      <>
                        <span>S'inscrire</span>
                        <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default TicketingPage
