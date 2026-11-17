import { Check, Plus } from 'lucide-react';
import { MARQUEE_SERVICES, formatPkr } from '../data/marqueeData';

interface ServicesBentoProps {
  selectedServiceIds: string[];
  onToggleService: (serviceId: string) => void;
}

export function ServicesBento({ selectedServiceIds, onToggleService }: ServicesBentoProps) {
  const selectedTotal = MARQUEE_SERVICES.filter((s) =>
    selectedServiceIds.includes(s.id)
  ).reduce((sum, s) => sum + s.pricePkr, 0);

  return (
    <section id="services" className="bg-[#141513] text-[#FAF8F5] py-16 lg:py-24">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <p className="text-xs font-medium text-[#C8A86B] tracking-wide mb-2">
              In-House Hospitality & Production
            </p>
            <h2 className="font-editorial text-3xl sm:text-4xl lg:text-[42px] font-semibold leading-tight text-[#FAF8F5]">
              Every technical, culinary, and protocol detail managed under one roof.
            </h2>
          </div>

          <div className="text-sm text-[#FAF8F5]/80 border border-white/15 bg-[#1C1E1B] px-5 py-3.5 rounded-lg shrink-0">
            <span className="text-xs text-[#FAF8F5]/60 block">Selected Production Services</span>
            <span className="font-mono text-base font-medium text-[#C8A86B] tabular-nums">
              {selectedServiceIds.length} active · {formatPkr(selectedTotal)}
            </span>
          </div>
        </div>

        {/* Asymmetric Bento Grid (col-span-2 alongside col-span-1) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {MARQUEE_SERVICES.map((service) => {
            const isSelected = selectedServiceIds.includes(service.id);
            return (
              <div
                key={service.id}
                className={`${
                  service.spanWide ? 'lg:col-span-2' : 'lg:col-span-1'
                } bg-[#1C1E1B] border ${
                  isSelected ? 'border-[#C8A86B]/70' : 'border-white/10'
                } rounded-xl p-6 sm:p-8 flex flex-col justify-between transition-colors duration-150`}
              >
                <div>
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <span className="font-mono text-xs text-[#C8A86B] tabular-nums">
                      {service.index}.
                    </span>
                    <span className="text-xs text-[#FAF8F5]/60 tabular-nums">
                      {formatPkr(service.pricePkr)}
                    </span>
                  </div>

                  <h3 className="font-editorial text-2xl sm:text-[26px] font-semibold text-[#FAF8F5] tracking-normal">
                    {service.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-[#FAF8F5]/75 max-w-[60ch]">
                    {service.summary}
                  </p>
                </div>

                <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs text-[#FAF8F5]/60">{service.deliverable}</span>

                  <button
                    type="button"
                    onClick={() => onToggleService(service.id)}
                    aria-pressed={isSelected}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8A86B] ${
                      isSelected
                        ? 'bg-[#C8A86B] text-[#141513] hover:bg-[#D4B87E]'
                        : 'bg-white/10 text-[#FAF8F5] hover:bg-white/15'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <Check className="w-3.5 h-3.5" aria-hidden="true" />
                        Added to Estimate
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                        Add Service
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
