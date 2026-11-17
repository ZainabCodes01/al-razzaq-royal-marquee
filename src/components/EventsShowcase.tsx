import { useState } from 'react';
import { ArrowUpRight, Check, X } from 'lucide-react';
import {
  EVENT_SHOWCASE_ITEMS,
  EventShowcaseItem,
  formatPkr,
} from '../data/marqueeData';
import { VenueImage } from './VenueImage';

interface EventsShowcaseProps {
  onSelectEventBlueprint: (item: EventShowcaseItem) => void;
}

const FILTERS: { id: 'all' | EventShowcaseItem['category']; label: string }[] = [
  { id: 'all', label: 'All Celebrations' },
  { id: 'baraat', label: 'Baraat & Nikkah' },
  { id: 'walima', label: 'Walima Reception' },
  { id: 'mehndi', label: 'Mehndi & Dholki' },
  { id: 'corporate', label: 'Corporate & Galas' },
];

export function EventsShowcase({ onSelectEventBlueprint }: EventsShowcaseProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | EventShowcaseItem['category']>('all');
  const [activeModalItem, setActiveModalItem] = useState<EventShowcaseItem | null>(null);

  const visibleEvents =
    activeFilter === 'all'
      ? EVENT_SHOWCASE_ITEMS
      : EVENT_SHOWCASE_ITEMS.filter((item) => item.category === activeFilter);

  return (
    <section id="events" className="bg-[#FAF8F5] py-16 lg:py-24 border-b border-[#141513]/10">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8">
        {/* Header Row */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <p className="text-xs font-medium text-[#7A5E28] tracking-wide mb-2">
              2026 Event Portfolio
            </p>
            <h2 className="font-editorial text-3xl sm:text-4xl lg:text-[42px] font-semibold leading-tight text-[#141513]">
              Signature ceremonies staged with architectural precision.
            </h2>
          </div>

          {/* Interactive Filter Controls */}
          <div
            role="tablist"
            aria-label="Filter event setups by ceremony type"
            className="flex flex-wrap items-center gap-1 p-1 bg-[#F2EFE9] rounded-lg border border-[#141513]/8 self-start lg:self-auto"
          >
            {FILTERS.map((tab) => {
              const selected = activeFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setActiveFilter(tab.id)}
                  className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9A7B3E] ${
                    selected
                      ? 'bg-[#FAF8F5] text-[#141513] shadow-xs'
                      : 'text-[#141513]/65 hover:text-[#141513]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Event Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {visibleEvents.map((item) => (
            <article
              key={item.id}
              className="group bg-[#F2EFE9]/65 border border-[#141513]/10 rounded-xl overflow-hidden flex flex-col justify-between transition-colors duration-150 hover:border-[#9A7B3E]/50"
            >
              <div>
                <div className="relative aspect-[4/3] overflow-hidden bg-[#141513]">
                  <VenueImage
                    src={item.image}
                    alt={`${item.title} — ${item.subtitle} at Al Razzaq Royal Marquee Daska`}
                    fallbackTitle={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent"
                  />
                  <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between text-xs text-[#FAF8F5]/90">
                    <span>{item.categoryLabel}</span>
                    <span className="font-mono tabular-nums">{item.capacityRange}</span>
                  </div>
                </div>

                <div className="p-6 sm:p-7">
                  <div className="flex items-center gap-2 text-xs text-[#141513]/60 mb-2">
                    <span>{item.stageDimensions}</span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">Stage decor from {formatPkr(item.startingDecorFee)}</span>
                  </div>

                  <h3 className="font-editorial text-2xl sm:text-[28px] font-semibold text-[#141513] leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#141513]/75 mt-1.5">{item.subtitle}</p>

                  <ul className="mt-4 pt-4 border-t border-[#141513]/10 space-y-2">
                    {item.highlights.slice(0, 3).map((point) => (
                      <li key={point} className="text-xs sm:text-sm text-[#141513]/75 flex items-start gap-2">
                        <span className="text-[#7A5E28] mt-0.5 font-semibold" aria-hidden="true">
                          —
                        </span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="px-6 sm:px-7 pb-6 pt-2 flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => setActiveModalItem(item)}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#141513] hover:text-[#7A5E28] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9A7B3E] rounded"
                >
                  Inspect Blueprint
                  <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                </button>

                <button
                  type="button"
                  onClick={() => onSelectEventBlueprint(item)}
                  className="px-4 py-2 text-xs sm:text-sm font-medium bg-[#141513] text-[#FAF8F5] hover:bg-[#2A2C27] rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9A7B3E]"
                >
                  Configure This Event
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Event Blueprint Detail Modal */}
      {activeModalItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="blueprint-modal-title"
          onClick={() => setActiveModalItem(null)}
        >
          <div
            className="bg-[#FAF8F5] text-[#141513] max-w-2xl w-full rounded-xl overflow-hidden border border-[#141513]/15 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[16/9] bg-[#141513]">
              <VenueImage
                src={activeModalItem.image}
                alt={activeModalItem.title}
                fallbackTitle={activeModalItem.title}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => setActiveModalItem(null)}
                aria-label="Close event blueprint"
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[#141513]/80 text-[#FAF8F5] flex items-center justify-center hover:bg-[#141513] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 sm:p-8 space-y-5">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#7A5E28] font-medium">
                  <span>{activeModalItem.categoryLabel}</span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">{activeModalItem.capacityRange}</span>
                </div>
                <h3 id="blueprint-modal-title" className="font-editorial text-3xl font-semibold mt-1">
                  {activeModalItem.title}
                </h3>
                <p className="text-sm text-[#141513]/75 mt-1">{activeModalItem.subtitle}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 border-y border-[#141513]/10 text-sm">
                <div>
                  <p className="text-xs text-[#141513]/60">Stage Architecture</p>
                  <p className="font-medium mt-0.5">{activeModalItem.stageDimensions}</p>
                </div>
                <div>
                  <p className="text-xs text-[#141513]/60">Lighting Calibration</p>
                  <p className="font-medium mt-0.5">{activeModalItem.lightingSpec}</p>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-[#141513]/70 mb-3">
                  Included Production Elements
                </p>
                <ul className="space-y-2.5">
                  {activeModalItem.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2.5 text-sm text-[#141513]/85">
                      <Check className="w-4 h-4 text-[#7A5E28] shrink-0 mt-0.5" aria-hidden="true" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-[#141513]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-xs text-[#141513]/60">Starting Stage & Decor Package</p>
                  <p className="font-editorial text-2xl font-semibold tabular-nums">
                    {formatPkr(activeModalItem.startingDecorFee)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveModalItem(null)}
                    className="px-4 py-2.5 text-sm font-medium text-[#141513]/75 hover:text-[#141513] cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onSelectEventBlueprint(activeModalItem);
                      setActiveModalItem(null);
                    }}
                    className="px-5 py-2.5 text-sm font-medium bg-[#141513] text-[#FAF8F5] hover:bg-[#2A2C27] rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    Apply Setup to Booking
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
