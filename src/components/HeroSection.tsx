import { ArrowUpRight, Bookmark, Check, Phone, Share2, Star } from 'lucide-react';
import { VENUE_IMAGES, VENUE_INFO } from '../data/marqueeData';
import { VenueImage } from './VenueImage';

interface HeroSectionProps {
  isSaved: boolean;
  onToggleSave: () => void;
  onShare: () => void;
  onScrollToBooking: () => void;
}

const SPEC_STRIP = [
  { metric: '1,500+', label: 'Estate Guest Capacity', sub: 'Pillar-Free Imperial Hall & Lawn' },
  { metric: '450+', label: 'Valet Parking Bays', sub: 'Direct Pasrur Rd Entrance' },
  { metric: '4.3 / 5', label: '360 Guest Reviews', sub: 'Verified Google Rating' },
  { metric: '100%', label: 'Dual Backup & HVAC', sub: 'Climate-Controlled All Year' },
];

export function HeroSection({
  isSaved,
  onToggleSave,
  onShare,
  onScrollToBooking,
}: HeroSectionProps) {
  return (
    <section id="top" className="bg-[#FAF8F5] border-b border-[#141513]/10">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 pt-8 pb-10 lg:pt-12 lg:pb-14">
        {/* Two-column editorial split with equal stretch */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          <div className="lg:col-span-5 flex flex-col justify-between py-2">
            <div>
              {/* Clean unboxed metadata line */}
              <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-[#141513]/70 mb-5">
                <span className="inline-flex items-center gap-1 font-semibold text-[#141513] tabular-nums">
                  <Star className="w-3.5 h-3.5 fill-[#9A7B3E] text-[#9A7B3E]" aria-hidden="true" />
                  {VENUE_INFO.rating}
                </span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">{VENUE_INFO.reviewCount} Google Reviews</span>
                <span aria-hidden="true">·</span>
                <span>{VENUE_INFO.address}</span>
              </div>

              <h1 className="font-editorial text-[clamp(2.35rem,4.1vw,3.75rem)] leading-[1.06] tracking-tight font-semibold text-[#141513]">
                Architectural grandeur for Daska’s defining celebrations.
              </h1>

              <p className="mt-5 text-base sm:text-[17px] leading-relaxed text-[#141513]/75 max-w-[60ch]">
                Set on Pasrur Road, Al Razzaq Royal Marquee pairs soaring chandelier halls,
                2026 sculptural floral staging, and live royal dastarkhwan catering for Baraat,
                Walima, Mehndi, and executive galas.
              </p>
            </div>

            <div className="mt-8 space-y-6">
              {/* Primary CTA + clean secondary links */}
              <div className="flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={onScrollToBooking}
                  className="px-6 py-3.5 text-sm font-medium bg-[#141513] text-[#FAF8F5] hover:bg-[#2A2C27] transition-colors duration-150 rounded-md whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9A7B3E]"
                >
                  Reserve Event Date
                </button>
                <a
                  href="#events"
                  className="inline-flex items-center gap-1.5 px-4 py-3 text-sm font-medium text-[#141513] hover:text-[#7A5E28] transition-colors whitespace-nowrap shrink-0"
                >
                  Explore 2026 Setups
                  <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                </a>
              </div>

              {/* Real listing actions: Call, Directions, Save, Share */}
              <div className="pt-5 border-t border-[#141513]/10 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs sm:text-sm text-[#141513]/75">
                <a
                  href={`tel:${VENUE_INFO.phoneDisplay.replace(/\s+/g, '')}`}
                  className="inline-flex items-center gap-1.5 hover:text-[#141513] transition-colors font-medium tabular-nums"
                >
                  <Phone className="w-3.5 h-3.5 text-[#7A5E28]" aria-hidden="true" />
                  {VENUE_INFO.phoneDisplay}
                </a>

                <a
                  href="#directions"
                  className="inline-flex items-center gap-1.5 hover:text-[#141513] transition-colors font-medium"
                >
                  Live Map & Route
                </a>

                <button
                  type="button"
                  onClick={onToggleSave}
                  className="inline-flex items-center gap-1.5 hover:text-[#141513] transition-colors font-medium cursor-pointer"
                >
                  {isSaved ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#7A5E28]" aria-hidden="true" />
                      Saved Venue
                    </>
                  ) : (
                    <>
                      <Bookmark className="w-3.5 h-3.5 text-[#7A5E28]" aria-hidden="true" />
                      Save Venue
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={onShare}
                  className="inline-flex items-center gap-1.5 hover:text-[#141513] transition-colors font-medium cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5 text-[#7A5E28]" aria-hidden="true" />
                  Share
                </button>
              </div>
            </div>
          </div>

          {/* Right visual frame */}
          <div className="lg:col-span-7">
            <div className="relative h-full min-h-[320px] sm:min-h-[420px] lg:min-h-[500px] rounded-xl overflow-hidden border border-[#141513]/10 bg-[#141513]">
              <VenueImage
                src={VENUE_IMAGES.hero}
                alt="Al Razzaq Royal Marquee grand chandelier hall configured for a 2026 evening wedding reception in Daska"
                fallbackTitle="Grand Imperial Hall"
                className="w-full h-full object-cover"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none"
              />
              <div className="absolute bottom-0 inset-x-0 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-[#FAF8F5]">
                <div>
                  <p className="text-xs text-[#C8A86B] font-medium tracking-wide">
                    2026 Signature Interior · Grand Imperial Hall
                  </p>
                  <p className="font-editorial text-xl sm:text-2xl mt-1">
                    Soaring Coffered Chandeliers & Ivory Orchid Columns
                  </p>
                </div>
                <p className="text-xs text-[#FAF8F5]/80 font-mono tabular-nums shrink-0">
                  Plus Code · 89FG+QV Daska
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Full-width 4-column Architectural Spec Strip */}
        <div className="mt-10 pt-8 border-t border-[#141513]/10 grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {SPEC_STRIP.map((item) => (
            <div key={item.label} className="space-y-1">
              <p className="font-editorial text-3xl sm:text-4xl font-semibold text-[#141513] tabular-nums">
                {item.metric}
              </p>
              <p className="text-sm font-semibold text-[#141513]">{item.label}</p>
              <p className="text-xs text-[#141513]/65">{item.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
