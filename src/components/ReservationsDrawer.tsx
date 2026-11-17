import { Trash2, X, MessageSquare } from 'lucide-react';
import { BookingRecord, HALL_ZONES, VENUE_INFO, formatPkr } from '../data/marqueeData';

interface ReservationsDrawerProps {
  open: boolean;
  onClose: () => void;
  bookings: BookingRecord[];
  onCancelBooking: (referenceId: string) => void;
}

export function ReservationsDrawer({
  open,
  onClose,
  bookings,
  onCancelBooking,
}: ReservationsDrawerProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs no-print"
      role="dialog"
      aria-modal="true"
      aria-label="Saved event reservations"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-[#FAF8F5] text-[#141513] h-full overflow-y-auto p-6 sm:p-8 border-l border-[#141513]/15 flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-[#141513]/10">
            <div>
              <p className="text-xs text-[#7A5E28] font-medium">Saved Locally</p>
              <h2 className="font-editorial text-2xl font-semibold">My Reservations</h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close reservations drawer"
              className="w-10 h-10 rounded-full hover:bg-[#141513]/8 flex items-center justify-center cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {bookings.length === 0 ? (
            <p className="text-sm text-[#141513]/65 mt-8">
              You have no provisional reservations saved yet. Select an available date in the
              booking calendar to generate your booking pass.
            </p>
          ) : (
            <div className="mt-6 space-y-4">
              {bookings.map((b) => {
                const hallName =
                  HALL_ZONES.find((h) => h.id === b.hallId)?.name ?? b.hallId;
                const waText = `Assalam-o-Alaikum, confirming reservation ${b.referenceId} on ${b.date} (${b.slot}) for ${b.guests} guests (${b.clientName}).`;
                return (
                  <div
                    key={b.referenceId}
                    className="p-4 rounded-xl bg-[#F2EFE9] border border-[#141513]/10 space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-mono text-xs text-[#7A5E28] font-medium tabular-nums">
                          {b.referenceId}
                        </span>
                        <h3 className="font-semibold text-sm text-[#141513]">{b.eventType}</h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => onCancelBooking(b.referenceId)}
                        aria-label={`Cancel reservation ${b.referenceId}`}
                        className="p-2 text-[#141513]/50 hover:text-red-700 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="text-xs text-[#141513]/75 space-y-1">
                      <p className="font-mono tabular-nums">
                        {b.date} · {b.slot === 'dinner' ? 'Evening Dinner' : 'Afternoon Lunch'}
                      </p>
                      <p>
                        {hallName} · {b.guests} Guests
                      </p>
                      <p className="font-mono font-semibold text-[#141513] tabular-nums">
                        Estimate: {formatPkr(b.totalEstimatedPkr)}
                      </p>
                    </div>

                    <a
                      href={`https://wa.me/${VENUE_INFO.phoneRaw}?text=${encodeURIComponent(waText)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7A5E28] hover:text-[#141513] pt-1"
                    >
                      <MessageSquare className="w-3.5 h-3.5" aria-hidden="true" />
                      Confirm via WhatsApp
                    </a>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <p className="text-xs text-[#141513]/55 pt-6 border-t border-[#141513]/10 mt-8">
          For urgent schedule changes, call Al Razzaq Royal Marquee directly at{' '}
          <span className="font-mono">{VENUE_INFO.phoneDisplay}</span>.
        </p>
      </div>
    </div>
  );
}
