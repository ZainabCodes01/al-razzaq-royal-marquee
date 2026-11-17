import { useState } from 'react';
import { Menu, X } from 'lucide-react';

interface HeaderProps {
  onOpenBookingsDrawer: () => void;
  savedCount: number;
}

const NAV_LINKS = [
  { label: 'Events', href: '#events' },
  { label: 'Services', href: '#services' },
  { label: 'Menu', href: '#menu' },
  { label: 'Directions', href: '#directions' },
  { label: 'Booking', href: '#booking' },
];

export function Header({ onOpenBookingsDrawer, savedCount }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/92 backdrop-blur-md border-b border-[#141513]/10 no-print">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#top"
          className="font-editorial text-xl sm:text-2xl font-semibold tracking-tight text-[#141513] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9A7B3E] rounded"
        >
          Al Razzaq Royal Marquee
        </a>

        {/* Zone 2: 5 concise single-line text links */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-[#141513]/75"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-[#141513] transition-colors duration-150 whitespace-nowrap shrink-0 relative py-1 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[1.5px] after:bg-[#9A7B3E] hover:after:w-full after:transition-all after:duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9A7B3E] rounded"
            >
              {link.label}
            </a>
          ))}
          {savedCount > 0 && (
            <button
              type="button"
              onClick={onOpenBookingsDrawer}
              className="text-[#7A5E28] hover:text-[#141513] transition-colors whitespace-nowrap shrink-0 font-medium cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9A7B3E] rounded tabular-nums"
            >
              My Reservations ({savedCount})
            </button>
          )}
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#booking"
            className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 text-xs sm:text-sm font-medium text-[#FAF8F5] bg-[#141513] hover:bg-[#2A2C27] transition-colors duration-150 rounded-md whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9A7B3E]"
          >
            Reserve Date
          </a>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 text-[#141513] hover:bg-[#141513]/5 rounded-md transition-colors cursor-pointer"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#141513]/10 bg-[#FAF8F5] px-4 py-4 space-y-1">
          {NAV_LINKS.map((link) => (
            <button
              key={link.href}
              type="button"
              onClick={() => handleNavClick(link.href)}
              className="block w-full text-left px-3 py-3 text-base font-medium text-[#141513] hover:bg-[#F2EFE9] rounded-md transition-colors cursor-pointer"
            >
              {link.label}
            </button>
          ))}
          {savedCount > 0 && (
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                onOpenBookingsDrawer();
              }}
              className="block w-full text-left px-3 py-3 text-base font-medium text-[#7A5E28] hover:bg-[#F2EFE9] rounded-md transition-colors cursor-pointer tabular-nums"
            >
              My Reservations ({savedCount})
            </button>
          )}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => handleNavClick('#booking')}
              className="w-full py-3 px-4 text-sm font-medium text-[#FAF8F5] bg-[#141513] rounded-md cursor-pointer"
            >
              Reserve Date
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
