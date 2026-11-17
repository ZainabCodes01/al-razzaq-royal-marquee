/// <reference types="google.maps" />
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  APIProvider,
  APILoadingStatus,
  AdvancedMarker,
  InfoWindow,
  Map as GoogleMap,
  Pin,
  useAdvancedMarkerRef,
  useApiLoadingStatus,
  useMap,
  useMapsLibrary,
} from '@vis.gl/react-google-maps';
import {
  Check,
  Clock,
  Copy,
  ExternalLink,
  LocateFixed,
  MapPin,
  Navigation,
  Phone,
  Search,
  Star,
} from 'lucide-react';
import { VENUE_INFO } from '../data/marqueeData';

type TravelModeOption = 'DRIVING' | 'TWO_WHEELER' | 'WALKING';

interface ResolvedVenue {
  displayName: string;
  formattedAddress: string;
  location: google.maps.LatLngLiteral;
  rating?: number | null;
  userRatingCount?: number | null;
  googleMapsURI?: string | null;
}

interface RouteSummary {
  originLabel: string;
  distanceKm: string;
  durationMinutes: number;
}

interface VenueMapSectionProps {
  onNotify: (msg: string) => void;
}

const QUICK_ORIGINS = [
  'Daska City',
  'Sialkot Cantt',
  'Gujranwala',
  'Pasrur',
  'Sambrial',
];

function isQuotaError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err ?? '');
  return (
    msg.includes('OVER_QUERY_LIMIT') ||
    msg.includes('RESOURCE_EXHAUSTED') ||
    msg.includes('OverQuotaMapError') ||
    msg.includes('429')
  );
}

function VenueMapContent({ onNotify }: VenueMapSectionProps) {
  const map = useMap();
  const status = useApiLoadingStatus();
  const placesLib = useMapsLibrary('places');
  const routesLib = useMapsLibrary('routes');
  const [markerRef, marker] = useAdvancedMarkerRef();

  const [venue, setVenue] = useState<ResolvedVenue | null>(null);
  const [venueLoading, setVenueLoading] = useState(true);
  const [venueError, setVenueError] = useState<string | null>(null);
  const [infoOpen, setInfoOpen] = useState(true);

  const [originQuery, setOriginQuery] = useState('');
  const [suggestions, setSuggestions] = useState<google.maps.places.AutocompleteSuggestion[]>([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const sessionTokenRef = useRef<google.maps.places.AutocompleteSessionToken | null>(null);

  const [originLocation, setOriginLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [originLabel, setOriginLabel] = useState<string>('');
  const [travelMode, setTravelMode] = useState<TravelModeOption>('DRIVING');
  const [routeSummary, setRouteSummary] = useState<RouteSummary | null>(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [routeError, setRouteError] = useState<string | null>(null);
  const [copiedPlusCode, setCopiedPlusCode] = useState(false);

  const polylinesRef = useRef<google.maps.Polyline[]>([]);

  // 1. Dynamically resolve Al Razzaq Royal Marquee via Places API (New) Place.searchByText
  useEffect(() => {
    if (!placesLib) return;
    let cancelled = false;

    async function lookupVenue() {
      setVenueLoading(true);
      setVenueError(null);
      try {
        const { places } = await placesLib!.Place.searchByText({
          textQuery: VENUE_INFO.mapsSearchQuery,
          fields: [
            'id',
            'displayName',
            'formattedAddress',
            'location',
            'rating',
            'userRatingCount',
            'googleMapsURI',
          ],
          region: 'pk',
          language: 'en',
          maxResultCount: 1,
        });

        if (cancelled) return;

        const match = places?.[0];
        if (match?.location) {
          const coords = {
            lat: match.location.lat(),
            lng: match.location.lng(),
          };
          setVenue({
            displayName: match.displayName || VENUE_INFO.name,
            formattedAddress: match.formattedAddress || VENUE_INFO.address,
            location: coords,
            rating: match.rating ?? VENUE_INFO.rating,
            userRatingCount: match.userRatingCount ?? VENUE_INFO.reviewCount,
            googleMapsURI: match.googleMapsURI ?? VENUE_INFO.mapsPlaceUrl,
          });
          if (map) {
            map.panTo(coords);
            map.setZoom(15);
          }
        } else {
          setVenueError('Unable to pin live venue coordinates. Use Google Maps link below.');
        }
      } catch (err) {
        if (cancelled) return;
        if (isQuotaError(err)) {
          window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
        }
        setVenueError('Unable to load live venue details right now.');
      } finally {
        if (!cancelled) setVenueLoading(false);
      }
    }

    void lookupVenue();
    return () => {
      cancelled = true;
    };
  }, [placesLib, map]);

  // 2. Programmatic Place Autocomplete (New) with AutocompleteSessionToken
  useEffect(() => {
    if (!placesLib || originQuery.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    let cancelled = false;
    const timer = window.setTimeout(async () => {
      try {
        const { AutocompleteSessionToken, AutocompleteSuggestion } = placesLib;
        if (!sessionTokenRef.current) {
          sessionTokenRef.current = new AutocompleteSessionToken();
        }
        setSuggestionsLoading(true);
        const res = await AutocompleteSuggestion.fetchAutocompleteSuggestions({
          input: originQuery.trim(),
          sessionToken: sessionTokenRef.current,
          includedRegionCodes: ['pk'],
          language: 'en',
          locationBias: venue?.location
            ? { center: venue.location, radius: 50000 }
            : undefined,
        });
        if (!cancelled) {
          setSuggestions(res.suggestions ?? []);
        }
      } catch (err) {
        if (isQuotaError(err)) {
          window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
        }
        if (!cancelled) setSuggestions([]);
      } finally {
        if (!cancelled) setSuggestionsLoading(false);
      }
    }, 250);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [placesLib, originQuery, venue?.location]);

  // 3. Select suggestion -> Place.fetchFields -> resetSession
  const handleSuggestionSelect = useCallback(
    async (suggestion: google.maps.places.AutocompleteSuggestion) => {
      if (!placesLib || !suggestion.placePrediction) return;
      try {
        const place = suggestion.placePrediction.toPlace();
        await place.fetchFields({
          fields: ['location', 'displayName', 'formattedAddress'],
        });
        sessionTokenRef.current = null;
        setSuggestions([]);
        if (place.location) {
          const label =
            place.displayName ||
            suggestion.placePrediction.text.text ||
            'Selected Origin';
          setOriginQuery(label);
          setOriginLabel(label);
          setOriginLocation({
            lat: place.location.lat(),
            lng: place.location.lng(),
          });
        }
      } catch (err) {
        if (isQuotaError(err)) {
          window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
        }
        setRouteError('Could not load origin coordinates. Please pick another location.');
      }
    },
    [placesLib]
  );

  // 4. Quick origin city lookup via Place.searchByText (zero hardcoded coordinates)
  const handleQuickOrigin = useCallback(
    async (cityName: string) => {
      if (!placesLib) return;
      setRouteLoading(true);
      setRouteError(null);
      setSuggestions([]);
      try {
        const { places } = await placesLib.Place.searchByText({
          textQuery: `${cityName}, Punjab, Pakistan`,
          fields: ['location', 'displayName'],
          region: 'pk',
          maxResultCount: 1,
        });
        const found = places?.[0];
        if (found?.location) {
          setOriginQuery(cityName);
          setOriginLabel(found.displayName || cityName);
          setOriginLocation({
            lat: found.location.lat(),
            lng: found.location.lng(),
          });
        } else {
          setRouteError(`Could not find coordinates for ${cityName}.`);
          setRouteLoading(false);
        }
      } catch (err) {
        if (isQuotaError(err)) {
          window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
        }
        setRouteError('Unable to resolve starting city right now.');
        setRouteLoading(false);
      }
    },
    [placesLib]
  );

  // 5. Device GPS location
  const handleUseMyLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setRouteError('Geolocation is not supported by your browser.');
      return;
    }
    setRouteLoading(true);
    setRouteError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setOriginLabel('Your Current Location');
        setOriginQuery('Your Current Location');
        setOriginLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => {
        setRouteLoading(false);
        setRouteError('Location permission denied. Select a city or type an address.');
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, []);

  // 6. Compute route with modern Routes API (Route.computeRoutes)
  useEffect(() => {
    if (!routesLib || !map || !venue?.location || !originLocation) return;

    let cancelled = false;

    // Clean up existing polylines
    polylinesRef.current.forEach((p) => p.setMap(null));
    polylinesRef.current = [];
    setRouteLoading(true);
    setRouteError(null);

    const request = {
      origin: originLocation,
      destination: venue.location,
      travelMode,
      fields: ['path', 'distanceMeters', 'durationMillis', 'viewport'],
    };

    const routeClass = routesLib.Route as unknown as {
      computeRoutes?: (req: unknown) => Promise<{ routes?: any[] }>;
      new (): { computeRoutes: (req: unknown) => Promise<{ routes?: any[] }> };
    };

    const promise =
      typeof routeClass.computeRoutes === 'function'
        ? routeClass.computeRoutes(request)
        : new routeClass().computeRoutes(request);

    promise
      .then((response) => {
        if (cancelled) return;
        const primaryRoute = response?.routes?.[0];
        if (!primaryRoute) {
          setRouteError('No driving route available between these points.');
          setRouteSummary(null);
          setRouteLoading(false);
          return;
        }

        if (typeof primaryRoute.createPolylines === 'function') {
          const newPolylines: google.maps.Polyline[] = primaryRoute.createPolylines();
          newPolylines.forEach((polyline) => {
            polyline.setOptions({
              strokeColor: '#9A7B3E',
              strokeWeight: 5,
              strokeOpacity: 0.92,
            });
            polyline.setMap(map);
          });
          polylinesRef.current = newPolylines;
        } else if (primaryRoute.path) {
          const fallbackPoly = new google.maps.Polyline({
            path: primaryRoute.path,
            strokeColor: '#9A7B3E',
            strokeWeight: 5,
            strokeOpacity: 0.92,
            map,
          });
          polylinesRef.current = [fallbackPoly];
        }

        if (primaryRoute.viewport) {
          map.fitBounds(primaryRoute.viewport);
        }

        const meters = primaryRoute.distanceMeters ?? 0;
        const millis = primaryRoute.durationMillis ?? 0;
        setRouteSummary({
          originLabel: originLabel || 'Selected Origin',
          distanceKm: (meters / 1000).toFixed(1),
          durationMinutes: Math.max(1, Math.round(millis / 60000)),
        });
        setRouteLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        if (isQuotaError(err)) {
          window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
        }
        setRouteError('Unable to calculate route right now. Try opening Google Maps directly.');
        setRouteLoading(false);
      });

    return () => {
      cancelled = true;
      polylinesRef.current.forEach((p) => p.setMap(null));
      polylinesRef.current = [];
    };
  }, [routesLib, map, venue?.location, originLocation, originLabel, travelMode]);

  const handleCopyPlusCode = () => {
    navigator.clipboard?.writeText(VENUE_INFO.plusCode);
    setCopiedPlusCode(true);
    onNotify('Plus Code copied: 89FG+QV Daska, Pakistan');
    window.setTimeout(() => setCopiedPlusCode(false), 2200);
  };

  const handleSendToPhone = () => {
    const text = `Al Razzaq Royal Marquee\n${VENUE_INFO.address}\nPlus Code: ${VENUE_INFO.plusCode}\nPhone: ${VENUE_INFO.phoneDisplay}\nMap: ${venue?.googleMapsURI || VENUE_INFO.mapsPlaceUrl}`;
    if (navigator.share) {
      navigator
        .share({
          title: VENUE_INFO.name,
          text,
          url: venue?.googleMapsURI || VENUE_INFO.mapsPlaceUrl,
        })
        .catch(() => {});
    } else {
      navigator.clipboard?.writeText(text);
      onNotify('Venue directions & phone copied to clipboard.');
    }
  };

  const apiFailed =
    status === APILoadingStatus.FAILED || status === APILoadingStatus.AUTH_FAILURE;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
      {/* Left Interactive Route Planner & Venue Card */}
      <div className="lg:col-span-5 bg-[#FAF8F5] border border-[#141513]/10 rounded-xl p-6 sm:p-8 flex flex-col justify-between space-y-6">
        <div className="space-y-5">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#7A5E28] font-medium mb-1">
              <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Pasrur Rd, Daska, Pakistan</span>
            </div>
            <h3 className="font-editorial text-2xl sm:text-3xl font-semibold text-[#141513]">
              {venue?.displayName || VENUE_INFO.name}
            </h3>
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#141513]/70 mt-1.5">
              <span className="inline-flex items-center gap-1 font-semibold text-[#141513] tabular-nums">
                <Star className="w-3.5 h-3.5 fill-[#9A7B3E] text-[#9A7B3E]" aria-hidden="true" />
                {venue?.rating ?? VENUE_INFO.rating}
              </span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">
                {venue?.userRatingCount ?? VENUE_INFO.reviewCount} reviews
              </span>
              <span aria-hidden="true">·</span>
              <span>{VENUE_INFO.hoursSummary}</span>
            </div>
          </div>

          {/* Plus Code & Direct Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-[#141513]/10 text-xs">
            <button
              type="button"
              onClick={handleCopyPlusCode}
              className="flex items-center justify-between gap-2 p-3 rounded-lg bg-[#F2EFE9] hover:bg-[#EAE5DC] transition-colors text-left cursor-pointer"
            >
              <div>
                <span className="text-[#141513]/60 block">Google Plus Code</span>
                <span className="font-mono font-medium text-[#141513]">89FG+QV Daska</span>
              </div>
              {copiedPlusCode ? (
                <Check className="w-4 h-4 text-[#7A5E28] shrink-0" />
              ) : (
                <Copy className="w-4 h-4 text-[#141513]/60 shrink-0" />
              )}
            </button>

            <a
              href={`tel:${VENUE_INFO.phoneDisplay.replace(/\s+/g, '')}`}
              className="flex items-center justify-between gap-2 p-3 rounded-lg bg-[#F2EFE9] hover:bg-[#EAE5DC] transition-colors"
            >
              <div>
                <span className="text-[#141513]/60 block">Booking Desk</span>
                <span className="font-mono font-medium text-[#141513] tabular-nums">
                  {VENUE_INFO.phoneDisplay}
                </span>
              </div>
              <Phone className="w-4 h-4 text-[#7A5E28] shrink-0" />
            </a>
          </div>

          {/* Live Route Calculator */}
          <div className="pt-4 border-t border-[#141513]/10 space-y-3">
            <div className="flex items-center justify-between">
              <label
                htmlFor="origin-autocomplete"
                className="text-xs font-semibold text-[#141513]"
              >
                Check Guest Drive Time & Route
              </label>
              <button
                type="button"
                onClick={handleUseMyLocation}
                className="inline-flex items-center gap-1 text-xs font-medium text-[#7A5E28] hover:text-[#141513] cursor-pointer"
              >
                <LocateFixed className="w-3.5 h-3.5" aria-hidden="true" />
                Use GPS
              </button>
            </div>

            <div className="relative">
              <Search
                className="w-4 h-4 text-[#141513]/45 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                id="origin-autocomplete"
                type="text"
                value={originQuery}
                onChange={(e) => setOriginQuery(e.target.value)}
                placeholder="Type starting city or landmark (e.g. Sialkot)"
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-[#141513]/15 rounded-lg focus:outline-none focus:border-[#9A7B3E] text-[#141513]"
              />
              {suggestionsLoading && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-[#141513]/50">
                  Searching…
                </span>
              )}

              {suggestions.length > 0 && (
                <ul className="absolute z-20 left-0 right-0 mt-1 bg-white border border-[#141513]/15 rounded-lg shadow-lg max-h-56 overflow-y-auto divide-y divide-[#141513]/8">
                  {suggestions.map((sug, idx) => (
                    <li key={idx}>
                      <button
                        type="button"
                        onClick={() => void handleSuggestionSelect(sug)}
                        className="w-full text-left px-4 py-2.5 text-xs sm:text-sm text-[#141513] hover:bg-[#F2EFE9] transition-colors cursor-pointer"
                      >
                        {sug.placePrediction?.text.text}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Quick origin buttons */}
            <div className="flex flex-wrap gap-1.5">
              {QUICK_ORIGINS.map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => void handleQuickOrigin(city)}
                  className={`px-2.5 py-1.5 text-xs font-medium rounded-md border transition-colors cursor-pointer ${
                    originQuery === city
                      ? 'bg-[#141513] text-[#FAF8F5] border-[#141513]'
                      : 'bg-[#F2EFE9] text-[#141513]/80 border-transparent hover:border-[#141513]/20'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>

            {/* Travel Mode Switch */}
            <div className="flex items-center gap-1 p-1 bg-[#F2EFE9] rounded-lg">
              {(
                [
                  { id: 'DRIVING', label: 'Car / Baraat' },
                  { id: 'TWO_WHEELER', label: 'Bike' },
                  { id: 'WALKING', label: 'Walk' },
                ] as { id: TravelModeOption; label: string }[]
              ).map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setTravelMode(m.id)}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                    travelMode === m.id
                      ? 'bg-[#FAF8F5] text-[#141513] shadow-xs'
                      : 'text-[#141513]/65 hover:text-[#141513]'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* Route Output */}
            {routeLoading && (
              <div className="p-3.5 rounded-lg bg-[#F2EFE9] text-xs text-[#141513]/70">
                Calculating live route to Pasrur Road, Daska…
              </div>
            )}

            {routeError && (
              <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900">
                {routeError}
              </div>
            )}

            {routeSummary && !routeLoading && (
              <div className="p-4 rounded-lg bg-[#141513] text-[#FAF8F5] flex items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] text-[#C8A86B]">
                    From {routeSummary.originLabel}
                  </p>
                  <p className="font-editorial text-2xl font-semibold tabular-nums mt-0.5">
                    {routeSummary.durationMinutes} min · {routeSummary.distanceKm} km
                  </p>
                </div>
                <Clock className="w-5 h-5 text-[#C8A86B] shrink-0" aria-hidden="true" />
              </div>
            )}
          </div>
        </div>

        {/* Bottom Map Actions */}
        <div className="pt-4 border-t border-[#141513]/10 flex flex-wrap gap-3">
          <a
            href={VENUE_INFO.mapsDirectionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 text-xs sm:text-sm font-medium bg-[#141513] text-[#FAF8F5] hover:bg-[#2A2C27] rounded-md transition-colors whitespace-nowrap shrink-0"
          >
            <Navigation className="w-4 h-4" aria-hidden="true" />
            Google Maps Directions
          </a>
          <button
            type="button"
            onClick={handleSendToPhone}
            className="inline-flex items-center justify-center gap-1.5 py-3 px-4 text-xs sm:text-sm font-medium border border-[#141513]/20 text-[#141513] hover:bg-[#F2EFE9] rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <ExternalLink className="w-4 h-4" aria-hidden="true" />
            Send to Phone
          </button>
        </div>
      </div>

      {/* Right Live Google Map Container (explicit height to avoid 0x0 collapse) */}
      <div className="lg:col-span-7 relative min-h-[420px] lg:min-h-[560px] rounded-xl overflow-hidden border border-[#141513]/15 bg-[#EAE5DC]">
        {apiFailed || venueError ? (
          <div className="h-full min-h-[420px] flex flex-col items-center justify-center p-8 text-center bg-[#F2EFE9]">
            <MapPin className="w-8 h-8 text-[#7A5E28] mb-3" aria-hidden="true" />
            <h4 className="font-editorial text-2xl font-semibold text-[#141513]">
              Al Razzaq Royal Marquee
            </h4>
            <p className="text-sm text-[#141513]/75 mt-1">
              Pasrur Rd, Daska, Pakistan · Plus Code: 89FG+QV Daska
            </p>
            {venueError && (
              <p className="text-xs text-[#141513]/60 mt-2 max-w-md">{venueError}</p>
            )}
            <a
              href={VENUE_INFO.mapsPlaceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-[#141513] text-[#FAF8F5] rounded-md hover:bg-[#2A2C27] transition-colors"
            >
              Open Location in Google Maps
              <ExternalLink className="w-4 h-4" aria-hidden="true" />
            </a>
          </div>
        ) : (
          <>
            {venueLoading && (
              <div className="absolute top-4 left-4 z-10 bg-[#FAF8F5]/95 px-3.5 py-2 rounded-md border border-[#141513]/10 text-xs font-medium text-[#141513]">
                Locating Al Razzaq Royal Marquee on Pasrur Rd…
              </div>
            )}
            <GoogleMap
              mapId="DEMO_MAP_ID"
              defaultCenter={{ lat: 32.327, lng: 74.35 }}
              defaultZoom={13}
              gestureHandling="greedy"
              mapTypeControl={true}
              streetViewControl={true}
              fullscreenControl={true}
              internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
              style={{ width: '100%', height: '100%', minHeight: '420px' }}
            >
              {venue && (
                <>
                  <AdvancedMarker
                    ref={markerRef}
                    position={venue.location}
                    title={venue.displayName}
                    onClick={() => setInfoOpen((prev) => !prev)}
                  >
                    <Pin
                      background="#141513"
                      borderColor="#9A7B3E"
                      glyphColor="#FAF8F5"
                      scale={1.25}
                    />
                  </AdvancedMarker>

                  {infoOpen && marker && (
                    <InfoWindow anchor={marker} onCloseClick={() => setInfoOpen(false)} maxWidth={260}>
                      <div className="p-1 text-[#141513]">
                        <p className="font-semibold text-sm">{venue.displayName}</p>
                        <p className="text-xs text-[#141513]/70 mt-0.5">
                          {venue.formattedAddress}
                        </p>
                        <p className="text-xs font-medium mt-1.5 tabular-nums">
                          ★ {venue.rating ?? VENUE_INFO.rating} ({venue.userRatingCount ?? VENUE_INFO.reviewCount} reviews)
                        </p>
                        {venue.googleMapsURI && (
                          <a
                            href={venue.googleMapsURI}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block mt-2 text-xs font-semibold text-[#7A5E28] underline"
                          >
                            View on Google Maps
                          </a>
                        )}
                      </div>
                    </InfoWindow>
                  )}
                </>
              )}

              {originLocation && (
                <AdvancedMarker position={originLocation} title={originLabel || 'Origin'}>
                  <Pin background="#9A7B3E" borderColor="#141513" glyphColor="#FAF8F5" scale={1} />
                </AdvancedMarker>
              )}
            </GoogleMap>
          </>
        )}
      </div>
    </div>
  );
}

export function VenueMapSection({ onNotify }: VenueMapSectionProps) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;

  return (
    <section id="directions" className="bg-[#F2EFE9] py-16 lg:py-24 border-b border-[#141513]/10">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8">
        <div className="max-w-2xl mb-10">
          <p className="text-xs font-medium text-[#7A5E28] tracking-wide mb-2">
            Location & Guest Navigation
          </p>
          <h2 className="font-editorial text-3xl sm:text-4xl lg:text-[42px] font-semibold leading-tight text-[#141513]">
            Direct access on Pasrur Road, minutes from Daska & Sialkot.
          </h2>
        </div>

        {apiKey ? (
          <APIProvider
            apiKey={apiKey}
            language="en"
            region="PK"
            libraries={['places', 'routes', 'marker']}
          >
            <VenueMapContent onNotify={onNotify} />
          </APIProvider>
        ) : (
          <div className="bg-[#FAF8F5] border border-[#141513]/10 rounded-xl p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h3 className="font-editorial text-2xl font-semibold text-[#141513]">
                {VENUE_INFO.name}
              </h3>
              <p className="text-sm text-[#141513]/75 mt-1">
                {VENUE_INFO.address} · Plus Code: {VENUE_INFO.plusCode} · {VENUE_INFO.phoneDisplay}
              </p>
            </div>
            <a
              href={VENUE_INFO.mapsDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 text-sm font-medium bg-[#141513] text-[#FAF8F5] rounded-md hover:bg-[#2A2C27] transition-colors shrink-0"
            >
              <Navigation className="w-4 h-4" aria-hidden="true" />
              Get Google Maps Directions
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
