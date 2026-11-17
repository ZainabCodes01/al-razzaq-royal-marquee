import { FormEvent, useMemo, useState } from 'react';
import { CalendarDays, Check, ChevronLeft, ChevronRight, MessageSquare, Printer } from 'lucide-react';
import {
  BookingRecord,
  DISH_CATALOG,
  HALL_ZONES,
  MARQUEE_SERVICES,
  MENU_TIERS,
  VENUE_INFO,
  formatPkr,
} from '../data/marqueeData';

interface BookingSectionProps {
  selectedHallId: string;
  onChangeHall: (hallId: string) => void;
  guests: number;
  onChangeGuests: (guests: number) => void;
  selectedMenuTierId: string;
  selectedDishIds: string[];
  perHeadPrice: number;
  selectedServiceIds: string[];
  occupiedSlots: Record<string, ('lunch' | 'dinner')[]>;
  onSubmitBooking: (record: BookingRecord) => void;
}

const MONTHS = [
  { year: 2026, monthIndex: 10, label: 'November 2026' },
  { year: 2026, monthIndex: 11, label: 'December 2026' },
  { year: 2027, monthIndex: 0, label: 'January 2027' },
  { year: 2027, monthIndex: 1, label: 'February 2027' },
];

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function toDateKey(year: number, monthIndex: number, day: number): string {
  const m = String(monthIndex + 1).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${year}-${m}-${d}`;
}

export function BookingSection({
  selectedHallId,
  onChangeHall,
  guests,
  onChangeGuests,
  selectedMenuTierId,
  selectedDishIds,
  perHeadPrice,
  selectedServiceIds,
  occupiedSlots,
  onSubmitBooking,
}: BookingSectionProps) {
  const [monthCursor, setMonthCursor] = useState(0);
  const [selectedDate, setSelectedDate] = useState<string>('2026-11-27');
  const [selectedSlot, setSelectedSlot] = useState<'lunch' | 'dinner'>('dinner');
  const [eventType, setEventType] = useState<string>('Baraat Ceremony');
  const [clientName, setClientName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmedRecord, setConfirmedRecord] = useState<BookingRecord | null>(null);

  const activeMonth = MONTHS[monthCursor];
  const activeHall = HALL_ZONES.find((h) => h.id === selectedHallId) ?? HALL_ZONES[0];
  const activeTier = MENU_TIERS.find((t) => t.id === selectedMenuTierId);

  const calendarCells = useMemo(() => {
    const firstDay = new Date(activeMonth.year, activeMonth.monthIndex, 1);
    const daysInMonth = new Date(activeMonth.year, activeMonth.monthIndex + 1, 0).getDate();
    // Monday-first offset
    const startOffset = (firstDay.getDay() + 6) % 7;
    const cells: (number | null)[] = Array(startOffset).fill(null);
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push(d);
    }
    return cells;
  }, [activeMonth]);

  const dateBookedSlots = occupiedSlots[selectedDate] ?? [];
  const isLunchTaken = dateBookedSlots.includes('lunch');
  const isDinnerTaken = dateBookedSlots.includes('dinner');

  const cateringTotal = guests * perHeadPrice;
  const servicesTotal = MARQUEE_SERVICES.filter((s) =>
    selectedServiceIds.includes(s.id)
  ).reduce((sum, s) => sum + s.pricePkr, 0);
  const grandTotal = activeHall.hallRentalPkr + cateringTotal + servicesTotal;
  const advanceAmount = Math.round(grandTotal * 0.25);

  const handleDateClick = (dateKey: string) => {
    const taken = occupiedSlots[dateKey] ?? [];
    if (taken.includes('lunch') && taken.includes('dinner')) return;
    setSelectedDate(dateKey);
    if (taken.includes(selectedSlot)) {
      setSelectedSlot(taken.includes('dinner') ? 'lunch' : 'dinner');
    }
  };

  const validate = (): boolean => {
    const nextErrors: Record<string, string> = {};
    if (clientName.trim().length < 2) {
      nextErrors.clientName = 'Please enter your full name.';
    }
    const cleanPhone = phone.replace(/[\s-]/g, '');
    if (!/^(\+92|0)?3\d{9}$/.test(cleanPhone)) {
      nextErrors.phone = 'Enter a valid Pakistani mobile number (e.g. 0334 9400000 or +92 334 9400000).';
    }
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = 'Please enter a valid email address.';
    }
    if (dateBookedSlots.includes(selectedSlot)) {
      nextErrors.slot = 'Selected time slot is already booked. Choose the other slot or another date.';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const refNum = `ARQ-${selectedDate.slice(0, 4)}-${Math.floor(1000 + Math.random() * 9000)}`;
    const record: BookingRecord = {
      referenceId: refNum,
      date: selectedDate,
      slot: selectedSlot,
      eventType,
      hallId: activeHall.id,
      guests,
      menuTierId: selectedMenuTierId,
      selectedDishIds,
      selectedServiceIds,
      clientName: clientName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      notes: notes.trim(),
      totalEstimatedPkr: grandTotal,
      advancePkr: advanceAmount,
      createdAt: new Date().toISOString(),
    };

    onSubmitBooking(record);
    setConfirmedRecord(record);
    setClientName('');
    setPhone('');
    setEmail('');
    setNotes('');
  };

  const buildWhatsAppLink = (record: BookingRecord) => {
    const hallName = HALL_ZONES.find((h) => h.id === record.hallId)?.name || record.hallId;
    const msg = [
      `Assalam-o-Alaikum Al Razzaq Royal Marquee,`,
      `Booking Reference: ${record.referenceId}`,
      `Event: ${record.eventType}`,
      `Date & Slot: ${record.date} (${record.slot === 'dinner' ? 'Evening Dinner' : 'Afternoon Lunch'})`,
      `Hall: ${hallName} · ${record.guests} Guests`,
      `Estimated Total: ${formatPkr(record.totalEstimatedPkr)}`,
      `Client: ${record.clientName} (${record.phone})`,
    ].join('\n');
    return `https://wa.me/${VENUE_INFO.phoneRaw}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <section id="booking" className="bg-[#FAF8F5] py-16 lg:py-24">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8">
        <div className="max-w-2xl mb-10">
          <p className="text-xs font-medium text-[#7A5E28] tracking-wide mb-2">
            2026 Instant Availability & Booking
          </p>
          <h2 className="font-editorial text-3xl sm:text-4xl lg:text-[42px] font-semibold leading-tight text-[#141513]">
            Check seasonal dates and lock your royal estimate.
          </h2>
        </div>

        {confirmedRecord ? (
          <div className="bg-[#F2EFE9] border border-[#9A7B3E]/40 rounded-xl p-6 sm:p-10 max-w-3xl">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#141513]/10">
              <div>
                <p className="text-xs font-semibold text-[#7A5E28]">
                  Reservation Request Confirmed
                </p>
                <h3 className="font-editorial text-3xl font-semibold text-[#141513] mt-1">
                  {confirmedRecord.clientName} · {confirmedRecord.eventType}
                </h3>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-xs text-[#141513]/60 block">Reference ID</span>
                <span className="font-mono text-base font-semibold text-[#141513] tabular-nums">
                  {confirmedRecord.referenceId}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 py-6 border-b border-[#141513]/10 text-sm">
              <div>
                <span className="text-xs text-[#141513]/60 block">Event Date</span>
                <span className="font-semibold font-mono tabular-nums">
                  {confirmedRecord.date}
                </span>
              </div>
              <div>
                <span className="text-xs text-[#141513]/60 block">Time Slot</span>
                <span className="font-semibold">
                  {confirmedRecord.slot === 'dinner' ? 'Evening Dinner' : 'Afternoon Lunch'}
                </span>
              </div>
              <div>
                <span className="text-xs text-[#141513]/60 block">Guest Count</span>
                <span className="font-semibold font-mono tabular-nums">
                  {confirmedRecord.guests} Guests
                </span>
              </div>
              <div>
                <span className="text-xs text-[#141513]/60 block">Estimated Total</span>
                <span className="font-semibold font-mono tabular-nums text-[#7A5E28]">
                  {formatPkr(confirmedRecord.totalEstimatedPkr)}
                </span>
              </div>
            </div>

            <p className="text-sm text-[#141513]/75 mt-5">
              Your date slot has been provisionally held on this device and marked in the calendar.
              Send this pass directly to our Daska booking desk via WhatsApp or call{' '}
              <span className="font-mono font-medium text-[#141513]">
                {VENUE_INFO.phoneDisplay}
              </span>{' '}
              to finalize your 25% advance ({formatPkr(confirmedRecord.advancePkr)}).
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href={buildWhatsAppLink(confirmedRecord)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 text-sm font-medium bg-[#141513] text-[#FAF8F5] hover:bg-[#2A2C27] rounded-md transition-colors"
              >
                <MessageSquare className="w-4 h-4" aria-hidden="true" />
                Send Pass on WhatsApp
              </a>
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 px-5 py-3 text-sm font-medium border border-[#141513]/20 text-[#141513] hover:bg-[#FAF8F5] rounded-md transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4" aria-hidden="true" />
                Print Confirmation
              </button>
              <button
                type="button"
                onClick={() => setConfirmedRecord(null)}
                className="px-4 py-3 text-sm font-medium text-[#7A5E28] hover:text-[#141513] cursor-pointer"
              >
                Make Another Booking
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* Left Column: Calendar, Hall & Guest Configurator */}
            <div className="lg:col-span-7 space-y-6">
              {/* Calendar Card */}
              <div className="bg-[#F2EFE9]/70 border border-[#141513]/10 rounded-xl p-6">
                <div className="flex items-center justify-between gap-4 mb-5">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-[#7A5E28]" aria-hidden="true" />
                    <h3 className="font-editorial text-2xl font-semibold text-[#141513]">
                      {activeMonth.label}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={monthCursor === 0}
                      onClick={() => setMonthCursor((c) => Math.max(0, c - 1))}
                      aria-label="Previous month"
                      className="w-9 h-9 rounded-md border border-[#141513]/15 flex items-center justify-center disabled:opacity-35 hover:bg-white transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      disabled={monthCursor === MONTHS.length - 1}
                      onClick={() => setMonthCursor((c) => Math.min(MONTHS.length - 1, c + 1))}
                      aria-label="Next month"
                      className="w-9 h-9 rounded-md border border-[#141513]/15 flex items-center justify-center disabled:opacity-35 hover:bg-white transition-colors cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Weekday Headers */}
                <div className="grid grid-cols-7 gap-1.5 text-center text-[11px] font-semibold text-[#141513]/55 mb-2">
                  {WEEKDAYS.map((wd) => (
                    <div key={wd} className="py-1">
                      {wd}
                    </div>
                  ))}
                </div>

                {/* Day Grid */}
                <div className="grid grid-cols-7 gap-1.5">
                  {calendarCells.map((day, i) => {
                    if (!day) {
                      return <div key={`empty-${i}`} className="h-11" />;
                    }
                    const key = toDateKey(activeMonth.year, activeMonth.monthIndex, day);
                    const taken = occupiedSlots[key] ?? [];
                    const fullyBooked = taken.includes('lunch') && taken.includes('dinner');
                    const partiallyBooked = taken.length === 1;
                    const isSelected = selectedDate === key;

                    return (
                      <button
                        key={key}
                        type="button"
                        disabled={fullyBooked}
                        onClick={() => handleDateClick(key)}
                        aria-label={`${key} ${fullyBooked ? 'Fully booked' : partiallyBooked ? '1 slot remaining' : 'Available'}`}
                        className={`h-11 rounded-lg text-xs sm:text-sm font-mono tabular-nums flex flex-col items-center justify-center border transition-colors ${
                          fullyBooked
                            ? 'bg-[#141513]/5 text-[#141513]/30 border-transparent line-through cursor-not-allowed'
                            : isSelected
                            ? 'bg-[#141513] text-[#FAF8F5] border-[#141513] font-semibold cursor-pointer'
                            : partiallyBooked
                            ? 'bg-amber-50/90 text-[#141513] border-amber-300/70 hover:border-[#9A7B3E] cursor-pointer'
                            : 'bg-white text-[#141513] border-[#141513]/10 hover:border-[#9A7B3E] cursor-pointer'
                        }`}
                      >
                        <span>{day}</span>
                        {!fullyBooked && partiallyBooked && (
                          <span
                            className={`text-[9px] font-sans leading-none ${
                              isSelected ? 'text-[#C8A86B]' : 'text-[#9A7B3E]'
                            }`}
                          >
                            1 slot
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Clean Text Legend */}
                <div className="mt-4 pt-4 border-t border-[#141513]/10 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[#141513]/65">
                  <span>White: Open (Lunch & Dinner)</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-amber-800">Amber: 1 Slot Remaining</span>
                  <span aria-hidden="true">·</span>
                  <span>Strikethrough: Sold Out</span>
                </div>

                {/* Time Slot Selector */}
                <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    disabled={isLunchTaken}
                    onClick={() => setSelectedSlot('lunch')}
                    className={`p-3.5 rounded-lg border text-left transition-colors ${
                      isLunchTaken
                        ? 'opacity-45 bg-[#141513]/5 border-transparent cursor-not-allowed'
                        : selectedSlot === 'lunch'
                        ? 'bg-[#141513] text-[#FAF8F5] border-[#141513] cursor-pointer'
                        : 'bg-white text-[#141513] border-[#141513]/15 hover:border-[#9A7B3E] cursor-pointer'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span>Afternoon / Lunch</span>
                      <span>{isLunchTaken ? 'Booked' : '1:00 PM – 5:00 PM'}</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    disabled={isDinnerTaken}
                    onClick={() => setSelectedSlot('dinner')}
                    className={`p-3.5 rounded-lg border text-left transition-colors ${
                      isDinnerTaken
                        ? 'opacity-45 bg-[#141513]/5 border-transparent cursor-not-allowed'
                        : selectedSlot === 'dinner'
                        ? 'bg-[#141513] text-[#FAF8F5] border-[#141513] cursor-pointer'
                        : 'bg-white text-[#141513] border-[#141513]/15 hover:border-[#9A7B3E] cursor-pointer'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span>Evening / Dinner</span>
                      <span>{isDinnerTaken ? 'Booked' : '7:00 PM – 11:30 PM'}</span>
                    </div>
                  </button>
                </div>
                {errors.slot && <p className="text-xs text-red-700 mt-2">{errors.slot}</p>}
              </div>

              {/* Hall Zone & Guest Count */}
              <div className="bg-[#F2EFE9]/70 border border-[#141513]/10 rounded-xl p-6 space-y-6">
                <div>
                  <label className="text-xs font-semibold text-[#141513] block mb-3">
                    Select Hall / Venue Zone
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {HALL_ZONES.map((hall) => {
                      const active = hall.id === activeHall.id;
                      return (
                        <button
                          key={hall.id}
                          type="button"
                          onClick={() => {
                            onChangeHall(hall.id);
                            if (guests < hall.capacityMin) onChangeGuests(hall.capacityMin);
                            if (guests > hall.capacityMax) onChangeGuests(hall.capacityMax);
                          }}
                          className={`p-4 rounded-lg border text-left transition-colors cursor-pointer ${
                            active
                              ? 'bg-[#141513] text-[#FAF8F5] border-[#141513]'
                              : 'bg-white text-[#141513] border-[#141513]/10 hover:border-[#9A7B3E]'
                          }`}
                        >
                          <p className="text-sm font-semibold">{hall.name}</p>
                          <p
                            className={`text-xs font-mono tabular-nums mt-1 ${
                              active ? 'text-[#C8A86B]' : 'text-[#7A5E28]'
                            }`}
                          >
                            {hall.capacityMin}–{hall.capacityMax} Guests
                          </p>
                          <p
                            className={`text-xs font-mono tabular-nums mt-1 ${
                              active ? 'text-[#FAF8F5]/75' : 'text-[#141513]/65'
                            }`}
                          >
                            {formatPkr(hall.hallRentalPkr)}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="guest-slider" className="text-xs font-semibold text-[#141513]">
                      Estimated Guest Count
                    </label>
                    <span className="font-mono text-base font-semibold text-[#141513] tabular-nums">
                      {guests} Guests
                    </span>
                  </div>
                  <input
                    id="guest-slider"
                    type="range"
                    min={activeHall.capacityMin}
                    max={activeHall.capacityMax}
                    step={25}
                    value={guests}
                    onChange={(e) => onChangeGuests(Number(e.target.value))}
                    className="w-full accent-[#9A7B3E] cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] font-mono text-[#141513]/55 mt-1 tabular-nums">
                    <span>{activeHall.capacityMin} min</span>
                    <span>{activeHall.dimensions}</span>
                    <span>{activeHall.capacityMax} max</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Live Estimate Summary & Reservation Form */}
            <div className="lg:col-span-5 bg-[#141513] text-[#FAF8F5] rounded-xl p-6 sm:p-8 space-y-6">
              <div>
                <p className="text-xs text-[#C8A86B] font-medium">Live 2026 Estimate Summary</p>
                <div className="mt-3 space-y-2.5 text-sm border-b border-white/15 pb-4">
                  <div className="flex justify-between gap-4">
                    <span className="text-[#FAF8F5]/75">{activeHall.name}</span>
                    <span className="font-mono tabular-nums">{formatPkr(activeHall.hallRentalPkr)}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-[#FAF8F5]/75">
                      Catering ({activeTier?.name || 'Custom'} · {guests} × {formatPkr(perHeadPrice)})
                    </span>
                    <span className="font-mono tabular-nums">{formatPkr(cateringTotal)}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-[#FAF8F5]/75">
                      Production & Decor ({selectedServiceIds.length} services)
                    </span>
                    <span className="font-mono tabular-nums">{formatPkr(servicesTotal)}</span>
                  </div>
                </div>

                <div className="pt-4 flex items-baseline justify-between gap-4">
                  <div>
                    <span className="text-xs text-[#FAF8F5]/65 block">Estimated Event Total</span>
                    <span className="text-[11px] text-[#C8A86B] tabular-nums">
                      25% Advance Hold: {formatPkr(advanceAmount)}
                    </span>
                  </div>
                  <span className="font-editorial text-3xl font-semibold text-[#FAF8F5] tabular-nums">
                    {formatPkr(grandTotal)}
                  </span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 pt-2 border-t border-white/15" noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="booking-date-read" className="text-xs text-[#FAF8F5]/70 block mb-1">
                      Selected Date & Slot
                    </label>
                    <div
                      id="booking-date-read"
                      className="px-3 py-2.5 rounded-md bg-white/10 text-xs font-mono text-[#FAF8F5] tabular-nums"
                    >
                      {selectedDate} · {selectedSlot === 'dinner' ? 'Dinner' : 'Lunch'}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="event-type" className="text-xs text-[#FAF8F5]/70 block mb-1">
                      Ceremony Type
                    </label>
                    <select
                      id="event-type"
                      value={eventType}
                      onChange={(e) => setEventType(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-md bg-[#1C1E1B] border border-white/20 text-xs text-[#FAF8F5] focus:outline-none focus:border-[#C8A86B]"
                    >
                      <option value="Baraat Ceremony">Baraat Ceremony</option>
                      <option value="Walima Reception">Walima Reception</option>
                      <option value="Nikkah Gathering">Nikkah Gathering</option>
                      <option value="Mehndi & Dholki">Mehndi & Dholki</option>
                      <option value="Corporate / Gala">Corporate / Gala</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="client-name" className="text-xs text-[#FAF8F5]/70 block mb-1">
                    Full Name *
                  </label>
                  <input
                    id="client-name"
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Hamza Tariq"
                    className="w-full px-3.5 py-2.5 rounded-md bg-[#1C1E1B] border border-white/20 text-sm text-[#FAF8F5] placeholder:text-[#FAF8F5]/35 focus:outline-none focus:border-[#C8A86B]"
                  />
                  {errors.clientName && (
                    <p className="text-xs text-amber-300 mt-1">{errors.clientName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="client-phone" className="text-xs text-[#FAF8F5]/70 block mb-1">
                    Mobile / WhatsApp Number *
                  </label>
                  <input
                    id="client-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0334 9400000"
                    className="w-full px-3.5 py-2.5 rounded-md bg-[#1C1E1B] border border-white/20 text-sm text-[#FAF8F5] placeholder:text-[#FAF8F5]/35 focus:outline-none focus:border-[#C8A86B]"
                  />
                  {errors.phone && (
                    <p className="text-xs text-amber-300 mt-1">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="client-email" className="text-xs text-[#FAF8F5]/70 block mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    id="client-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="family@example.com"
                    className="w-full px-3.5 py-2.5 rounded-md bg-[#1C1E1B] border border-white/20 text-sm text-[#FAF8F5] placeholder:text-[#FAF8F5]/35 focus:outline-none focus:border-[#C8A86B]"
                  />
                  {errors.email && (
                    <p className="text-xs text-amber-300 mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="client-notes" className="text-xs text-[#FAF8F5]/70 block mb-1">
                    Stage Palette or Special Requests
                  </label>
                  <textarea
                    id="client-notes"
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Separate family parda partition, floral color theme, or valet notes…"
                    className="w-full px-3.5 py-2 rounded-md bg-[#1C1E1B] border border-white/20 text-sm text-[#FAF8F5] placeholder:text-[#FAF8F5]/35 focus:outline-none focus:border-[#C8A86B]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-5 text-sm font-semibold bg-[#C8A86B] text-[#141513] hover:bg-[#D5B982] rounded-md transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" aria-hidden="true" />
                  Confirm Provisional Reservation
                </button>
                <p className="text-[11px] text-[#FAF8F5]/55 text-center">
                  Selected dishes ({selectedDishIds.length}) & services ({selectedServiceIds.length}) are attached automatically.
                </p>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
