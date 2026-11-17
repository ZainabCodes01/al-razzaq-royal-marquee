import { useState } from 'react';
import { Check, Printer } from 'lucide-react';
import {
  DISH_CATALOG,
  DishItem,
  MENU_TIERS,
  VENUE_IMAGES,
  formatPkr,
} from '../data/marqueeData';
import { VenueImage } from './VenueImage';

interface CulinaryMenuProps {
  selectedTierId: string;
  selectedDishIds: string[];
  perHeadPrice: number;
  onSelectTier: (tierId: string) => void;
  onToggleDish: (dishId: string) => void;
  onProceedToBooking: () => void;
}

const COURSE_TABS: { id: 'all' | DishItem['course']; label: string }[] = [
  { id: 'all', label: 'All Courses' },
  { id: 'starters', label: 'Starters & Drinks' },
  { id: 'mains', label: 'Signature Mains' },
  { id: 'bbq', label: 'Live BBQ' },
  { id: 'desserts', label: 'Desserts & Chai' },
];

export function CulinaryMenu({
  selectedTierId,
  selectedDishIds,
  perHeadPrice,
  onSelectTier,
  onToggleDish,
  onProceedToBooking,
}: CulinaryMenuProps) {
  const [activeCourse, setActiveCourse] = useState<'all' | DishItem['course']>('all');

  const activeTier = MENU_TIERS.find((t) => t.id === selectedTierId);
  const filteredDishes =
    activeCourse === 'all'
      ? DISH_CATALOG
      : DISH_CATALOG.filter((d) => d.course === activeCourse);

  return (
    <section id="menu" className="bg-[#FAF8F5] py-16 lg:py-24 border-b border-[#141513]/10">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Sticky Culinary Visual & Live Per-Head Summary */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
            <div>
              <p className="text-xs font-medium text-[#7A5E28] tracking-wide mb-2">
                Royal Dastarkhwan & Live Kitchens
              </p>
              <h2 className="font-editorial text-3xl sm:text-4xl font-semibold leading-tight text-[#141513]">
                Curate your 2026 banquet menu dish by dish.
              </h2>
              <p className="mt-3 text-sm sm:text-base text-[#141513]/75 leading-relaxed">
                Select a heritage package below or customize individual courses. Your per-head
                rate syncs automatically with the date booking calculator.
              </p>
            </div>

            <div className="rounded-xl overflow-hidden border border-[#141513]/10 aspect-[4/3] bg-[#141513]">
              <VenueImage
                src={VENUE_IMAGES.culinary}
                alt="Copper handi saffron mutton biryani, charcoal seekh kababs, sesame naan, and pistachio kheer at Al Razzaq Royal Marquee"
                fallbackTitle="Royal Dastarkhwan"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Live Per-Head Pricing Card */}
            <div className="bg-[#F2EFE9] border border-[#141513]/10 rounded-xl p-6 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs text-[#141513]/60">
                    {activeTier ? `${activeTier.name} Package` : 'Custom Menu Selection'}
                  </p>
                  <p className="font-editorial text-3xl font-semibold text-[#141513] tabular-nums mt-0.5">
                    {formatPkr(perHeadPrice)}
                    <span className="font-sans text-xs font-normal text-[#141513]/65 ml-1.5">
                      per guest
                    </span>
                  </p>
                </div>
                <span className="text-xs font-mono text-[#7A5E28] tabular-nums">
                  {selectedDishIds.length} dishes selected
                </span>
              </div>

              <p className="text-xs text-[#141513]/70">
                {activeTier?.serviceStyle ??
                  'Custom course blend · Includes mineral water, raita, seasonal salad & tandoor service'}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={onProceedToBooking}
                  className="flex-1 py-3 px-5 text-sm font-medium bg-[#141513] text-[#FAF8F5] hover:bg-[#2A2C27] rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Book With This Menu
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center justify-center gap-1.5 py-3 px-4 text-sm font-medium border border-[#141513]/20 text-[#141513] hover:bg-[#FAF8F5] rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Printer className="w-4 h-4" aria-hidden="true" />
                  Print Menu
                </button>
              </div>
            </div>
          </div>

          {/* Right Tier Selector & Interactive Dish Checklist */}
          <div className="lg:col-span-7 space-y-8">
            {/* 3 Tier Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {MENU_TIERS.map((tier) => {
                const isActive = selectedTierId === tier.id;
                return (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => onSelectTier(tier.id)}
                    className={`text-left p-5 rounded-xl border transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9A7B3E] ${
                      isActive
                        ? 'bg-[#141513] text-[#FAF8F5] border-[#141513]'
                        : 'bg-[#F2EFE9]/70 text-[#141513] border-[#141513]/10 hover:border-[#9A7B3E]/50'
                    }`}
                  >
                    <p
                      className={`text-xs font-medium ${
                        isActive ? 'text-[#C8A86B]' : 'text-[#7A5E28]'
                      }`}
                    >
                      {tier.includedDishIds.length} Courses
                    </p>
                    <p className="font-editorial text-2xl font-semibold mt-1">{tier.name}</p>
                    <p className="font-mono text-sm tabular-nums mt-2 font-medium">
                      {formatPkr(tier.basePerHeadPkr)} / head
                    </p>
                    <p
                      className={`text-xs mt-2 leading-relaxed ${
                        isActive ? 'text-[#FAF8F5]/75' : 'text-[#141513]/65'
                      }`}
                    >
                      {tier.tagline}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Course Filter Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#141513]/10 pb-4">
              <div
                role="tablist"
                aria-label="Filter dishes by course"
                className="flex flex-wrap items-center gap-1 p-1 bg-[#F2EFE9] rounded-lg border border-[#141513]/8"
              >
                {COURSE_TABS.map((tab) => {
                  const selected = activeCourse === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      onClick={() => setActiveCourse(tab.id)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
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

            {/* Dish Customization List */}
            <div className="divide-y divide-[#141513]/10 border border-[#141513]/10 rounded-xl bg-white/60 overflow-hidden">
              {filteredDishes.map((dish) => {
                const checked = selectedDishIds.includes(dish.id);
                return (
                  <label
                    key={dish.id}
                    className={`flex items-center justify-between gap-4 p-4 sm:p-5 cursor-pointer transition-colors ${
                      checked ? 'bg-[#FAF8F5]' : 'hover:bg-[#F2EFE9]/50 opacity-80'
                    }`}
                  >
                    <div className="flex items-start gap-3.5 min-w-0">
                      <span
                        className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center border shrink-0 transition-colors ${
                          checked
                            ? 'bg-[#141513] border-[#141513] text-[#FAF8F5]'
                            : 'border-[#141513]/30 bg-white'
                        }`}
                      >
                        {checked && <Check className="w-3.5 h-3.5" aria-hidden="true" />}
                      </span>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => onToggleDish(dish.id)}
                        className="sr-only"
                      />
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2 text-xs text-[#141513]/60 mb-0.5">
                          <span>{dish.courseLabel}</span>
                          {dish.isSignature && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="text-[#7A5E28] font-medium">Chef Signature</span>
                            </>
                          )}
                        </div>
                        <p className="text-sm sm:text-base font-semibold text-[#141513]">
                          {dish.name}
                        </p>
                        <p className="text-xs text-[#141513]/65 mt-0.5">{dish.note}</p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-mono text-xs sm:text-sm font-medium text-[#141513] tabular-nums">
                        +{formatPkr(dish.perHeadAddonPkr)}
                      </span>
                      <span className="block text-[11px] text-[#141513]/55">per head</span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
