import { Calendar, Clock, MapPin, Users, Star } from 'lucide-react'
import './EventCard.css'

function EventCard({ event, onSelect, featured }) {
  return (
    <div className={`event-card ${featured ? 'featured' : ''}`}>
      <div className="event-image">
        {featured ? (
          <Star className="event-icon" size={64} />
        ) : (
          <Calendar className="event-icon" size={64} />
        )}
        {event.category && (
          <span className="event-category">{event.category}</span>
        )}
      </div>
      
      <div className="event-content">
        <h3 className="event-title">{event.title}</h3>
        {event.subtitle && (
          <p className="event-subtitle">{event.subtitle}</p>
        )}
        
        <div className="event-details">
          <div className="event-detail">
            <Calendar className="detail-icon" size={18} />
            <span>{event.date}</span>
          </div>
          <div className="event-detail">
            <Clock className="detail-icon" size={18} />
            <span>{event.time}</span>
          </div>
          <div className="event-detail">
            <MapPin className="detail-icon" size={18} />
            <span>{event.location}</span>
          </div>
          {event.maxParticipants && (
            <div className="event-detail">
              <Users className="detail-icon" size={18} />
              <span>{event.maxParticipants} places</span>
            </div>
          )}
        </div>
        
        {event.description && (
          <p className="event-description">
            {event.description.length > 150 
              ? event.description.substring(0, 150) + '...' 
              : event.description}
          </p>
        )}
        
        <button 
          className="event-button"
          onClick={() => onSelect(event)}
        >
          {featured ? 'En savoir plus' : 'Voir détails'}
        </button>
      </div>
    </div>
  )
}

export default EventCard
