import { useState, useEffect } from 'react'
import jsPDF from 'jspdf'
import QRCode from 'qrcode'

const STORAGE_KEY = 'event_registrations'

function MyTicketsPage({ onPageChange }) {
  const [registrations, setRegistrations] = useState([])
  const [selectedTicket, setSelectedTicket] = useState(null)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      setRegistrations(JSON.parse(stored))
    }
  }, [])

  const generateTicketPDF = async (registration) => {
    const doc = new jsPDF()
    
    const qrCodeDataURL = await QRCode.toDataURL(registration.ticketCode || '', {
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
    doc.text(`Nom: ${registration.fullName || ''}`, 20, yPos)
    yPos += 8
    doc.text(`Email: ${registration.email || ''}`, 20, yPos)
    yPos += 8
    doc.text(`Téléphone: ${registration.phone || ''}`, 20, yPos)
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
    doc.text(registration.ticketCode || '', 105, yPos + 24, { align: 'center' })
    doc.setFont(undefined, 'normal')
    
    // Footer
    doc.setFontSize(10)
    doc.setTextColor(150, 150, 150)
    doc.text('Présentez ce code ou le QR code à l\'entrée de l\'événement', 105, 280, { align: 'center' })
    doc.text('Ce code est unique et personnel', 105, 285, { align: 'center' })
    
    doc.save(`ticket-touch-up-${registration.fullName?.replace(/\s+/g, '-')}.pdf`)
  }

  if (selectedTicket) {
    return (
      <main className="w-full pt-20 bg-background min-h-screen">
        <div className="w-full flex-grow flex items-center justify-center py-16 px-4 sm:px-8">
          <div className="max-w-[400px] w-full flex flex-col items-center gap-8 relative z-10">
            <button 
              onClick={() => setSelectedTicket(null)}
              className="self-start text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              Back to My Tickets
            </button>

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
                        {registrations.indexOf(selectedTicket) + 1}<span className="text-on-primary/50 text-[24px]">/100</span>
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
                        {selectedTicket.fullName}
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
                onClick={() => generateTicketPDF(selectedTicket)}
                className="flex-1 bg-primary text-on-primary font-label-caps text-label-caps h-14 rounded-full flex items-center justify-center gap-2 hover:bg-secondary-container hover:text-on-secondary-container transition-colors duration-300 shadow-xl shadow-primary/10"
              >
                <span className="material-symbols-outlined text-[20px]">download</span>
                Download PDF
              </button>
              <button 
                onClick={() => setSelectedTicket(null)}
                className="flex-1 bg-surface-container text-on-surface font-label-caps text-label-caps h-14 rounded-full flex items-center justify-center gap-2 hover:bg-surface-variant transition-colors duration-300"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
                Close
              </button>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="w-full pt-20 bg-background min-h-screen">
      <div className="w-full px-margin-desktop py-margin-desktop max-w-container-max mx-auto">
        <div className="mb-12">
          <h1 className="font-display-lg text-display-lg text-on-background mb-4">
            My Tickets
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            Manage your event tickets and access your digital passes.
          </p>
        </div>

        {registrations.length === 0 ? (
          <div className="bg-surface-container-lowest rounded-2xl p-12 text-center">
            <span className="material-symbols-outlined text-6xl text-outline-variant mb-4">confirmation_number</span>
            <h2 className="font-headline-md text-headline-md text-on-surface mb-2">
              No tickets yet
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mb-6">
              You haven't registered for any events yet.
            </p>
            <button 
              onClick={() => onPageChange('ticketing')}
              className="bg-primary text-on-primary font-label-caps text-label-caps px-8 py-4 rounded-full hover:bg-secondary-container hover:text-on-secondary-container transition-all duration-300"
            >
              Browse Events
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {registrations.map((registration) => (
              <div 
                key={registration.id}
                className="bg-surface-container-lowest rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group"
                onClick={() => setSelectedTicket(registration)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="font-label-caps text-label-caps text-secondary uppercase text-xs">
                      Touch Up 2026
                    </span>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface mt-1">
                      {registration.fullName}
                    </h3>
                  </div>
                  <span className="material-symbols-outlined text-primary">confirmation_number</span>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                    <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                    <span>August 29, 2026</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                    <span className="material-symbols-outlined text-[18px]">location_on</span>
                    <span>Silikin Village</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-outline-variant/30">
                  <div className="flex items-center justify-between">
                    <span className="font-label-caps text-label-caps text-outline text-xs">
                      {registration.ticketCode}
                    </span>
                    <span className="material-symbols-outlined text-secondary group-hover:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

export default MyTicketsPage
