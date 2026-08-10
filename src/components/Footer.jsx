function Footer() {
  return (
    <footer className="w-full bg-surface-container-lowest py-margin-desktop">
      <div className="w-full px-margin-desktop md:px-margin-desktop flex flex-col md:flex-row justify-between items-center gap-gutter border-t border-outline-variant pt-margin-desktop">
        <div className="text-center md:text-left">
          <p className="font-headline-sm text-headline-sm text-on-surface">TOUCH UP 2026</p>
          <p className="font-body-md text-body-md text-on-surface-variant">Silikin Village, Kinshasa</p>
        </div>
        <div className="text-center md:text-right">
          <p className="font-label-caps text-label-caps text-secondary">AUGUST 29, 2026</p>
          <p className="font-body-md text-body-md text-outline">L'identité avant la réussite.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
