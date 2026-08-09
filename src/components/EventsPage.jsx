import { useState, useEffect } from 'react'
import { ArrowLeft, Calendar } from 'lucide-react'
import EventCard from './EventCard'
import './EventsPage.css'

function EventsPage({ onBack, onSelectEvent }) {
  const [events, setEvents] = useState([])

  useEffect(() => {
    // Load events from localStorage or use default events
    const storedEvents = localStorage.getItem('events')
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents))
    } else {
      // Default events including TOUCH UP
      const defaultEvents = [
        {
          id: 1,
          title: 'TOUCH UP',
          subtitle: "L'identité avant la réussite",
          date: 'Samedi 29 août 2026',
          time: 'À partir de 13h00',
          location: 'Silikin Village, Kinshasa',
          maxParticipants: 100,
          description: 'Nous voulons contribuer à une génération de jeunes qui ne cherchent pas seulement à avoir, mais qui travaillent d\'abord à devenir. Des jeunes capables de connaître leur valeur, de développer leurs talents, de créer des solutions et, ensuite, de construire des entreprises et des projets qui ont un impact.',
          image: '🎯',
          category: 'Développement Personnel',
          featured: true
        }
      ]
      setEvents(defaultEvents)
      localStorage.setItem('events', JSON.stringify(defaultEvents))
    }
  }, [])

  const featuredEvents = events.filter(event => event.featured)
  const regularEvents = events.filter(event => !event.featured)

  return (
    <div className="events-page">
      <button className="back-button" onClick={onBack}>
        <ArrowLeft size={20} />
        Retour
      </button>
      
      <div className="events-header">
        <Calendar className="header-icon" size={48} />
        <h1>Nos Événements</h1>
        <p>Découvrez et participez à nos événements qui transforment des vies</p>
      </div>

      {featuredEvents.length > 0 && (
        <section className="featured-events">
          <h2>Événement à la une</h2>
          <div className="featured-grid">
            {featuredEvents.map(event => (
              <EventCard 
                key={event.id} 
                event={event} 
                onSelect={() => onSelectEvent(event)}
                featured
              />
            ))}
          </div>
        </section>
      )}

      {regularEvents.length > 0 && (
        <section className="regular-events">
          <h2>Tous les événements</h2>
          <div className="events-grid">
            {regularEvents.map(event => (
              <EventCard 
                key={event.id} 
                event={event} 
                onSelect={() => onSelectEvent(event)}
              />
            ))}
          </div>
        </section>
      )}

      {events.length === 0 && (
        <div className="no-events">
          <p>Aucun événement programmé pour le moment.</p>
          <p>Revenez bientôt pour découvrir nos nouvelles activités!</p>
        </div>
      )}
    </div>
  )
}

export default EventsPage
