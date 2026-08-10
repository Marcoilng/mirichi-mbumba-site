import { useState } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import TicketingPage from './pages/TicketingPage'
import MyTicketsPage from './pages/MyTicketsPage'
import AdminDashboard from './pages/AdminDashboard'

function App() {
  const [currentPage, setCurrentPage] = useState('home')

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onPageChange={setCurrentPage} />
      case 'ticketing':
        return <TicketingPage onPageChange={setCurrentPage} />
      case 'my-tickets':
        return <MyTicketsPage onPageChange={setCurrentPage} />
      case 'admin-dashboard':
        return <AdminDashboard onPageChange={setCurrentPage} />
      default:
        return <HomePage onPageChange={setCurrentPage} />
    }
  }

  return (
    <>
      <Header currentPage={currentPage} onPageChange={setCurrentPage} />
      {renderPage()}
      <Footer />
    </>
  )
}

export default App
