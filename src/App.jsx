import { useState } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'

function App() {
  const [currentPage, setCurrentPage] = useState('home')

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onPageChange={setCurrentPage} />
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
