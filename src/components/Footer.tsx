import { VENUE_INFO } from '../data/marqueeData';

export function Footer() {
  return (
    <footer className="bg-[#141513] text-[#FAF8F5] py-12 border-t border-white/10 no-print">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-white/10">
          <div className="md:col-span-5 space-y-3">
            <p className="font-editorial text-2xl font-semibold text-[#FAF8F5]">
              {VENUE_INFO.name}
            </p>
            <p className="text-sm text-[#FAF8F5]/70 max-w-sm leading-relaxed">
              Daska’s premier 2026 architectural wedding marquee on Pasrur Road — engineered for
              comfort, grand hospitality, and memorable family milestones.
            </p>
          </div>

          <div className="md:col-span-4 space-y-2 text-sm text-[#FAF8F5]/75">
            <p className="text-xs font-semibold text-[#C8A86B]">Venue Address & Contact</p>
            <p>{VENUE_INFO.address}</p>
            <p className="font-mono text-xs text-[#FAF8F5]/60">
              Plus Code: {VENUE_INFO.plusCode}
            </p>
            <p className="font-mono tabular-nums">
              <a
                href={`tel:${VENUE_INFO.phoneDisplay.replace(/\s+/g, '')}`}
                className="hover:text-[#C8A86B] transition-colors"
              >
                {VENUE_INFO.phoneDisplay}
              </a>
            </p>
            <p className="text-xs text-[#FAF8F5]/60">{VENUE_INFO.hoursSummary}</p>
          </div>

          <div className="md:col-span-3 space-y-2 text-sm text-[#FAF8F5]/75">
            <p className="text-xs font-semibold text-[#C8A86B]">Navigate</p>
            <ul className="space-y-1.5">
              <li>
                <a href="#events" className="hover:text-[#FAF8F5] transition-colors">
                  2026 Events
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-[#FAF8F5] transition-colors">
                  Services & Production
                </a>
              </li>
              <li>
                <a href="#menu" className="hover:text-[#FAF8F5] transition-colors">
                  Royal Menu Customizer
                </a>
              </li>
              <li>
                <a href="#directions" className="hover:text-[#FAF8F5] transition-colors">
                  Directions & Map
                </a>
              </li>
              <li>
                <a href="#booking" className="hover:text-[#FAF8F5] transition-colors">
                  Availability & Booking
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-[#FAF8F5]/50">
          <p>© 2026 Al Razzaq Royal Marquee, Daska. All rights reserved.</p>
          <p>
            Interactive mapping powered by Google Maps Platform ·{' '}
            <a
              href="https://maps.google.com/help/terms_maps/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-[#FAF8F5]/80"
            >
              Google Maps Terms
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
