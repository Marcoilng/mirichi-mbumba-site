function Footer() {
  return (
    <footer className="w-full bg-surface-container-lowest py-margin-desktop relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary-container/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-48 h-48 bg-primary-container/5 rounded-full blur-3xl"></div>
      
      <div className="w-full px-margin-desktop md:px-margin-desktop flex flex-col md:flex-row justify-between items-center gap-gutter border-t border-outline-variant pt-margin-desktop relative z-10">
        <div className="text-center md:text-left">
          <p className="font-headline-sm text-headline-sm text-on-surface font-bold">TOUCH UP 2026</p>
          <p className="font-body-md text-body-md text-on-surface-variant">Silikin Village, Kinshasa</p>
        </div>
        <div className="text-center md:text-right">
          <p className="font-label-caps text-label-caps text-secondary font-bold">AUGUST 29, 2026</p>
          <p className="font-body-md text-body-md text-outline italic">L'identité avant la réussite.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
