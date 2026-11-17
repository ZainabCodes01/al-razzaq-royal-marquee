import { useEffect, useMemo, useState } from 'react';
import {
  BookingRecord,
  DISH_CATALOG,
  EventShowcaseItem,
  INITIAL_OCCUPIED_SLOTS,
  MARQUEE_SERVICES,
  MENU_TIERS,
  VENUE_INFO,
} from './data/marqueeData';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { EventsShowcase } from './components/EventsShowcase';
import { ServicesBento } from './components/ServicesBento';
import { CulinaryMenu } from './components/CulinaryMenu';
import { VenueMapSection } from './components/VenueMapSection';
import { BookingSection } from './components/BookingSection';
import { ReservationsDrawer } from './components/ReservationsDrawer';
import { Footer } from './components/Footer';

const STORAGE_BOOKINGS_KEY = 'al_razzaq_bookings_v1';
const STORAGE_SAVED_KEY = 'al_razzaq_venue_saved_v1';

export default function App() {
  const [quotaExceeded, setQuotaExceeded] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isVenueSaved, setIsVenueSaved] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_SAVED_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [savedBookings, setSavedBookings] = useState<BookingRecord[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_BOOKINGS_KEY);
      return raw ? (JSON.parse(raw) as BookingRecord[]) : [];
    } catch {
      return [];
    }
  });

  const [drawerOpen, setDrawerOpen] = useState(false);

  // Shared configuration synced across Events -> Services -> Menu -> Booking
  const [selectedHallId, setSelectedHallId] = useState<string>('grand-imperial');
  const [guests, setGuests] = useState<number>(500);
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>(() =>
    MARQUEE_SERVICES.filter((s) => s.defaultIncluded).map((s) => s.id)
  );
  const [selectedTierId, setSelectedTierId] = useState<string>('gold-royal');
  const [selectedDishIds, setSelectedDishIds] = useState<string[]>(() => {
    const tier = MENU_TIERS.find((t) => t.id === 'gold-royal');
    return tier ? tier.includedDishIds : [];
  });

  // Listen for Tier 1 & Tier 2 Google Maps Platform quota exhaustion
  useEffect(() => {
    const onQuota = () => setQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', onQuota);
    return () => window.removeEventListener('gmp-quota-exceeded', onQuota);
  }, []);

  const notify = (msg: string) => {
    setToastMessage(msg);
    window.setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3200);
  };

  // Persist saved bookings
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_BOOKINGS_KEY, JSON.stringify(savedBookings));
    } catch {
      // Ignore storage failures
    }
  }, [savedBookings]);

  // Compute occupied date slots by merging initial seasonal calendar + user's saved bookings
  const occupiedSlots = useMemo(() => {
    const merged: Record<string, ('lunch' | 'dinner')[]> = {};
    for (const [date, slots] of Object.entries(INITIAL_OCCUPIED_SLOTS)) {
      merged[date] = [...slots];
    }
    for (const b of savedBookings) {
      if (!merged[b.date]) merged[b.date] = [];
      if (!merged[b.date].includes(b.slot)) {
        merged[b.date].push(b.slot);
      }
    }
    return merged;
  }, [savedBookings]);

  // Calculate live per-head price based on active tier or customized dish delta
  const perHeadPrice = useMemo(() => {
    const matchedTier = MENU_TIERS.find((t) => {
      if (t.includedDishIds.length !== selectedDishIds.length) return false;
      return t.includedDishIds.every((id) => selectedDishIds.includes(id));
    });
    if (matchedTier) return matchedTier.basePerHeadPkr;
    const dishSum = DISH_CATALOG.filter((d) => selectedDishIds.includes(d.id)).reduce(
      (sum, d) => sum + d.perHeadAddonPkr,
      0
    );
    // Base hospitality & beverage service charge + dish selection
    return 450 + dishSum;
  }, [selectedDishIds]);

  const handleSelectTier = (tierId: string) => {
    const tier = MENU_TIERS.find((t) => t.id === tierId);
    if (!tier) return;
    setSelectedTierId(tierId);
    setSelectedDishIds([...tier.includedDishIds]);
    notify(`${tier.name} menu applied (${formatPerHeadNote(tier.basePerHeadPkr)})`);
  };

  const handleToggleDish = (dishId: string) => {
    setSelectedDishIds((prev) => {
      const exists = prev.includes(dishId);
      const next = exists ? prev.filter((id) => id !== dishId) : [...prev, dishId];
      // Check if next still matches a named tier
      const matched = MENU_TIERS.find(
        (t) =>
          t.includedDishIds.length === next.length &&
          t.includedDishIds.every((id) => next.includes(id))
      );
      setSelectedTierId(matched ? matched.id : 'custom');
      return next;
    });
  };

  const handleToggleService = (serviceId: string) => {
    setSelectedServiceIds((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleSelectEventBlueprint = (item: EventShowcaseItem) => {
    setSelectedHallId(item.recommendedHall);
    handleSelectTier(item.recommendedTierId);
    const bookingEl = document.getElementById('booking');
    bookingEl?.scrollIntoView({ behavior: 'smooth' });
    notify(`${item.title} setup loaded into your booking calculator.`);
  };

  const handleToggleSaveVenue = () => {
    setIsVenueSaved((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_SAVED_KEY, String(next));
      } catch {
        // Ignore storage errors
      }
      notify(
        next
          ? 'Al Razzaq Royal Marquee saved to your bookmarks.'
          : 'Removed from saved venues.'
      );
      return next;
    });
  };

  const handleShareVenue = () => {
    const shareUrl = window.location.href;
    const shareText = `${VENUE_INFO.name} — ${VENUE_INFO.address} (${VENUE_INFO.phoneDisplay})`;
    if (navigator.share) {
      navigator.share({ title: VENUE_INFO.name, text: shareText, url: shareUrl }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(`${shareText} · ${shareUrl}`);
      notify('Venue link & phone copied to clipboard.');
    }
  };

  const scrollToBooking = () => {
    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmitBooking = (record: BookingRecord) => {
    setSavedBookings((prev) => [record, ...prev]);
    notify(`Reservation ${record.referenceId} saved!`);
  };

  const handleCancelBooking = (referenceId: string) => {
    setSavedBookings((prev) => prev.filter((b) => b.referenceId !== referenceId));
    notify(`Reservation ${referenceId} removed.`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#141513]">
      {/* Mandatory Demo Key Quota Banner (renders ONLY when quota exceeded) */}
      {quotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}

      <Header
        savedCount={savedBookings.length}
        onOpenBookingsDrawer={() => setDrawerOpen(true)}
      />

      <main className="flex-1">
        <HeroSection
          isSaved={isVenueSaved}
          onToggleSave={handleToggleSaveVenue}
          onShare={handleShareVenue}
          onScrollToBooking={scrollToBooking}
        />

        <EventsShowcase onSelectEventBlueprint={handleSelectEventBlueprint} />

        <ServicesBento
          selectedServiceIds={selectedServiceIds}
          onToggleService={handleToggleService}
        />

        <CulinaryMenu
          selectedTierId={selectedTierId}
          selectedDishIds={selectedDishIds}
          perHeadPrice={perHeadPrice}
          onSelectTier={handleSelectTier}
          onToggleDish={handleToggleDish}
          onProceedToBooking={scrollToBooking}
        />

        <VenueMapSection onNotify={notify} />

        <BookingSection
          selectedHallId={selectedHallId}
          onChangeHall={setSelectedHallId}
          guests={guests}
          onChangeGuests={setGuests}
          selectedMenuTierId={selectedTierId}
          selectedDishIds={selectedDishIds}
          perHeadPrice={perHeadPrice}
          selectedServiceIds={selectedServiceIds}
          occupiedSlots={occupiedSlots}
          onSubmitBooking={handleSubmitBooking}
        />
      </main>

      <Footer />

      <ReservationsDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        bookings={savedBookings}
        onCancelBooking={handleCancelBooking}
      />

      {/* Clean non-intrusive toast feedback */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 bg-[#141513] text-[#FAF8F5] border border-[#C8A86B]/40 px-4 py-3 rounded-lg shadow-lg text-xs sm:text-sm max-w-sm no-print"
        >
          {toastMessage}
        </div>
      )}
    </div>
  );
}

function formatPerHeadNote(amount: number): string {
  return `PKR ${amount.toLocaleString('en-PK')} / head`;
}
