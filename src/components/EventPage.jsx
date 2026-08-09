import { useState, useEffect } from 'react'
import jsPDF from 'jspdf'
import QRCode from 'qrcode'
import { Calendar, MapPin, Clock, Users, ArrowLeft, Download, CheckCircle } from 'lucide-react'
import './EventPage.css'

const STORAGE_KEY = 'event_registrations'

function EventPage({ event, onBack }) {
  const [registrations, setRegistrations] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: ''
  })
  const [isRegistered, setIsRegistered] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [ticketCode, setTicketCode] = useState(null)

  const maxParticipants = event?.maxParticipants || 100

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const allRegistrations = JSON.parse(stored)
      const eventRegistrations = allRegistrations.filter(reg => reg.eventId === event?.id)
      setRegistrations(eventRegistrations)
    }
  }, [event?.id])

  const remainingSpots = maxParticipants - registrations.length
  const isFull = remainingSpots <= 0

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const generateSecureTicketCode = () => {
    const timestamp = Date.now().toString(36)
    const randomPart = Math.random().toString(36).substring(2, 10).toUpperCase()
    const eventPart = (event?.id || 1).toString(36).toUpperCase()
    return `TKT-${eventPart}-${timestamp}-${randomPart}`.toUpperCase()
  }

  const generateTicketPDF = async () => {
    const doc = new jsPDF()
    
    // Generate QR Code
    const qrCodeDataURL = await QRCode.toDataURL(ticketCode || '', {
      width: 100,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    })
    
    // Header
    doc.setFillColor(170, 59, 255)
    doc.rect(0, 0, 210, 40, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(24)
    doc.text('Billet d\'Événement', 105, 25, { align: 'center' })
    
    // Event Title
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(20)
    doc.text(event?.title || 'Événement', 105, 60, { align: 'center' })
    
    if (event?.subtitle) {
      doc.setFontSize(14)
      doc.setTextColor(100, 100, 100)
      doc.text(event.subtitle, 105, 70, { align: 'center' })
    }
    
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
    doc.text(`Date: ${event?.date || 'À déterminer'}`, 20, yPos)
    yPos += 8
    doc.text(`Heure: ${event?.time || 'À déterminer'}`, 20, yPos)
    yPos += 8
    doc.text(`Lieu: ${event?.location || 'À déterminer'}`, 20, yPos)
    yPos += 15
    
    // Participant Info
    doc.setFontSize(14)
    doc.setTextColor(170, 59, 255)
    doc.text('Informations du participant', 20, yPos)
    yPos += 10
    
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(11)
    doc.text(`Nom: ${formData.name || ''}`, 20, yPos)
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
    
    // Add QR Code image
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
    
    // Save PDF
    doc.save(`ticket-${event?.title?.replace(/\s+/g, '-')}-${formData.name?.replace(/\s+/g, '-')}.pdf`)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (isFull) {
      alert('Désolé, l\'événement est complet!')
      return
    }

    const newTicketCode = generateSecureTicketCode()
    setTicketCode(newTicketCode)

    const newRegistration = {
      id: Date.now(),
      eventId: event?.id,
      ticketCode: newTicketCode,
      ...formData,
      registeredAt: new Date().toISOString()
    }

    const stored = localStorage.getItem(STORAGE_KEY)
    const allRegistrations = stored ? JSON.parse(stored) : []
    const updatedRegistrations = [...allRegistrations, newRegistration]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRegistrations))
    
    const eventRegistrations = updatedRegistrations.filter(reg => reg.eventId === event?.id)
    setRegistrations(eventRegistrations)
    
    setIsRegistered(true)
    setShowForm(false)
    setFormData({ name: '', email: '', phone: '', age: '' })
  }

  return (
    <div className="event-page">
      <button className="back-button" onClick={onBack}>
        <ArrowLeft size={20} />
        Retour
      </button>
      
      <div className="event-header">
        <h1 className="event-title">{event?.title || 'Événement'}</h1>
        {event?.subtitle && <p className="event-subtitle">{event.subtitle}</p>}
      </div>

      <div className="event-details">
        <div className="detail-item">
          <Calendar className="detail-icon" size={24} />
          <div>
            <strong>Date</strong>
            <p>{event?.date || 'À déterminer'}</p>
          </div>
        </div>
        <div className="detail-item">
          <MapPin className="detail-icon" size={24} />
          <div>
            <strong>Lieu</strong>
            <p>{event?.location || 'À déterminer'}</p>
          </div>
        </div>
        <div className="detail-item">
          <Clock className="detail-icon" size={24} />
          <div>
            <strong>Heure</strong>
            <p>{event?.time || 'À déterminer'}</p>
          </div>
        </div>
        <div className="detail-item">
          <Users className="detail-icon" size={24} />
          <div>
            <strong>Places</strong>
            <p>{registrations.length} / {maxParticipants} participants</p>
            <p className={`spots-remaining ${isFull ? 'full' : ''}`}>
              {isFull ? 'COMPLET' : `${remainingSpots} places restantes`}
            </p>
          </div>
        </div>
      </div>

      {event?.description && (
        <div className="event-mission">
          <h2>À propos</h2>
          <p>{event.description}</p>
        </div>
      )}

      {!isRegistered ? (
        <div className="registration-section">
          {isFull ? (
            <div className="registration-full">
              <h3>⚠️ Inscriptions closes</h3>
              <p>Désolé, toutes les places ont été prises pour cet événement.</p>
            </div>
          ) : (
            <>
              {!showForm ? (
                <button 
                  className="register-button"
                  onClick={() => setShowForm(true)}
                >
                  S'inscrire maintenant
                </button>
              ) : (
                <form className="registration-form" onSubmit={handleSubmit}>
                  <h3>Formulaire d'inscription</h3>
                  <div className="form-group">
                    <label htmlFor="name">Nom complet *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Votre nom complet"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="votre@email.com"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Téléphone *</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      placeholder="+243 XXX XXX XXX"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="age">Âge *</label>
                    <input
                      type="number"
                      id="age"
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      required
                      min="12"
                      max="35"
                      placeholder="Votre âge"
                    />
                  </div>
                  <div className="form-actions">
                    <button type="button" className="cancel-button" onClick={() => setShowForm(false)}>
                      Annuler
                    </button>
                    <button type="submit" className="submit-button">
                      Confirmer l'inscription
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      ) : (
        <div className="registration-success">
          <div className="success-icon">
            <CheckCircle size={60} />
          </div>
          <h3>Inscription réussie!</h3>
          <p>Merci {formData.name || ''}! Votre inscription a été confirmée.</p>
          <div className="ticket-info">
            <p className="ticket-label">Votre code ticket :</p>
            <p className="ticket-code">{ticketCode}</p>
          </div>
          <button className="download-ticket-button" onClick={generateTicketPDF}>
            <Download size={20} />
            Télécharger votre ticket PDF
          </button>
          <p className="ticket-note">Présentez ce code à l'entrée de l'événement</p>
        </div>
      )}
    </div>
  )
}

export default EventPage
