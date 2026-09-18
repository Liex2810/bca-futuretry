"use client";

import "leaflet/dist/leaflet.css";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Map as LeafletMap, Marker } from "leaflet";
import { Check, ChevronRight, LoaderCircle, LockKeyhole, RotateCcw, MapPin, Compass } from "lucide-react";
import { useJourney } from "./JourneyProvider";
import { progressSummary } from "@/lib/progress";

type MarkerStatus = "available" | "completed" | "locked";

type MapLocation = {
  id: string;
  name: string;
  area: string;
  coordinates: [number, number];
  displayCoordinates: [number, number];
  missionId?: string;
  program?: "PPTI" | "PPBP";
  isStart?: boolean;
};

const locations: MapLocation[] = [
  {
    id: "cp-characters",
    name: "BCA Learning Institute",
    area: "Sentul City, Bogor",
    coordinates: [-6.5857007, 106.8822386],
    displayCoordinates: [-6.5857007, 106.8822386],
    isStart: true,
  },
  {
    id: "cp-data",
    name: "Data Lab",
    area: "Cibitung, Bekasi",
    coordinates: [-6.2618245, 107.0837982],
    displayCoordinates: [-6.2618245, 107.0837982],
    missionId: "m-dashboard",
    program: "PPTI",
  },
  {
    id: "cp-anomaly",
    name: "Security Operations",
    area: "Grand Indonesia, Jakarta Pusat",
    coordinates: [-6.1957601, 106.8214547],
    displayCoordinates: [-6.1957601, 106.8214547],
    missionId: "m-anomaly",
    program: "PPTI",
  },
  {
    id: "cp-ux",
    name: "Design Studio",
    area: "Landmark Pluit, Jakarta Utara",
    coordinates: [-6.1244714, 106.7995216],
    displayCoordinates: [-6.1244714, 106.7995216],
    missionId: "m-uxfix",
    program: "PPTI",
  },
  {
    id: "cp-strategy",
    name: "Strategy Room",
    area: "Foresta, Tangerang Selatan",
    coordinates: [-6.2882326, 106.6437145],
    displayCoordinates: [-6.2882326, 106.6437145],
    missionId: "m-bizcase",
    program: "PPBP",
  },
  {
    id: "cp-invest",
    name: "Investment Desk",
    area: "Wisma Asia, Jakarta Barat",
    coordinates: [-6.1891943, 106.7977565],
    displayCoordinates: [-6.1891943, 106.7977565],
    missionId: "m-invest",
    program: "PPBP",
  },
];

function markerHtml(location: MapLocation, index: number, status: MarkerStatus, isSelected: boolean) {
  const content = location.isStart
    ? "HQ"
    : status === "completed"
    ? "✓"
    : status === "locked"
    ? "•"
    : String(index);

  return `
    <div class="simple-map-marker is-${status} ${isSelected ? "is-selected" : ""} ${location.isStart ? "is-start" : ""}">
      <span class="marker-bubble">${content}</span>
    </div>
  `;
}

function playerPawnHtml(hero: "ppti" | "ppbp") {
  const imgSrc = hero === "ppti" ? "/character-ppti.png" : "/character-ppbp.png";
  return `
    <div class="simple-player-pawn">
      <div class="simple-pawn-tag">Kamu di sini</div>
      <div class="simple-pawn-sprite">
        <img src="${imgSrc}" alt="Karakter" />
      </div>
      <div class="simple-pawn-dot"></div>
    </div>
  `;
}

export function FutureWorldMap() {
  const mapElementRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const markerRefs = useRef(new Map<string, Marker>());
  const playerMarkerRef = useRef<Marker | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState("cp-data");
  const [hero, setHero] = useState<"ppti" | "ppbp">("ppti");

  const { stateOf, progress, reset } = useJourney();
  const summary = progressSummary(progress);

  const selected = locations.find((item) => item.id === selectedId) ?? locations[1];
  const selectedState = stateOf(selected.id);
  const selectedStatus: MarkerStatus = selected.isStart || selectedState === "current" ? "available" : selectedState;

  const statuses = useMemo(() => {
    return locations.map((location) => {
      const state = stateOf(location.id);
      const status: MarkerStatus = location.isStart || state === "current" ? "available" : state;
      return { location, status };
    });
  }, [stateOf]);

  const selectMission = (id: string) => {
    setSelectedId(id);
    const loc = locations.find((item) => item.id === id);
    if (!loc) return;

    if (loc.program === "PPBP") setHero("ppbp");
    else if (loc.program === "PPTI") setHero("ppti");

    if (mapInstanceRef.current) {
      mapInstanceRef.current.panTo(loc.displayCoordinates, { animate: true, duration: 0.6 });
    }
  };

  // Update pawn position when selectedId or hero changes
  useEffect(() => {
    if (playerMarkerRef.current && mapInstanceRef.current) {
      const targetLoc = locations.find((l) => l.id === selectedId) || locations[1];
      playerMarkerRef.current.setLatLng(targetLoc.displayCoordinates);
      import("leaflet").then((leaflet) => {
        playerMarkerRef.current?.setIcon(
          leaflet.divIcon({
            className: "simple-pawn-wrapper",
            html: playerPawnHtml(hero),
            iconSize: [54, 70],
            iconAnchor: [27, 68],
          })
        );
      });
    }
  }, [selectedId, hero]);

  // Update marker selection classes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    import("leaflet").then((leaflet) => {
      statuses.forEach(({ location, status }) => {
        const marker = markerRefs.current.get(location.id);
        if (marker) {
          const branchIndex = location.isStart
            ? 0
            : locations.filter((item) => item.program === location.program).findIndex((item) => item.id === location.id) + 1;
          marker.setIcon(
            leaflet.divIcon({
              className: "",
              html: markerHtml(location, branchIndex, status, location.id === selectedId),
              iconSize: [36, 36],
              iconAnchor: [18, 18],
            })
          );
        }
      });
    });
  }, [selectedId, statuses]);

  useEffect(() => {
    let cancelled = false;
    const markers = markerRefs.current;

    import("leaflet")
      .then((leaflet) => {
        if (cancelled || !mapElementRef.current) return;

        const map = leaflet.map(mapElementRef.current, { zoomControl: true, scrollWheelZoom: false });
        mapInstanceRef.current = map;

        // Tile layer Esri World Light Gray Base: Simpel, bersih, putih abu-abu, bebas watermark & tanpa API key!
        leaflet
          .tileLayer(
            "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
            {
              attribution: "Tiles &copy; Esri",
              maxZoom: 16,
            }
          )
          .addTo(map);

        const start = locations[0].displayCoordinates;
        const routes = [
          {
            program: "PPTI",
            points: [
              start,
              ...locations
                .filter((location) => location.program === "PPTI")
                .map((location) => location.displayCoordinates),
            ],
          },
          {
            program: "PPBP",
            points: [
              start,
              ...locations
                .filter((location) => location.program === "PPBP")
                .map((location) => location.displayCoordinates),
            ],
          },
        ];

        routes.forEach((route) => {
          // Garis penghubung simpel abu-abu
          leaflet
            .polyline(route.points, {
              color: "#94a3b8",
              weight: 2.5,
              opacity: 0.7,
              dashArray: "5 5",
            })
            .addTo(map);
        });

        // Markers
        statuses.forEach(({ location, status }) => {
          const branchIndex = location.isStart
            ? 0
            : locations.filter((item) => item.program === location.program).findIndex((item) => item.id === location.id) + 1;
          const icon = leaflet.divIcon({
            className: "",
            html: markerHtml(location, branchIndex, status, location.id === selectedId),
            iconSize: [36, 36],
            iconAnchor: [18, 18],
          });
          const marker = leaflet
            .marker(location.displayCoordinates, {
              icon,
              title: `${location.name} — ${status}`,
            })
            .addTo(map)
            .on("click", () => selectMission(location.id));

          markers.set(location.id, marker);
        });

        // Player Pawn Marker
        const initialLoc = locations.find((l) => l.id === selectedId) || locations[1];
        const playerIcon = leaflet.divIcon({
          className: "simple-pawn-wrapper",
          html: playerPawnHtml(hero),
          iconSize: [54, 70],
          iconAnchor: [27, 68],
        });
        const playerMarker = leaflet
          .marker(initialLoc.displayCoordinates, {
            icon: playerIcon,
            zIndexOffset: 1500,
            interactive: false,
          })
          .addTo(map);
        playerMarkerRef.current = playerMarker;

        const bounds = leaflet.latLngBounds(locations.map((item) => item.displayCoordinates));
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 12 });
        setLoading(false);
      })
      .catch((err) => {
        if (!cancelled) {
          setError("Gagal memuat peta. Silakan muat ulang halaman.");
          setLoading(false);
          console.error("Leaflet load error:", err);
        }
      });

    return () => {
      cancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      markers.clear();
      playerMarkerRef.current = null;
    };
  }, []);

  const currentAction = useMemo(() => {
    if (selected.isStart) {
      return {
        label: "Pilih Misi di Bawah",
        href: "#checkpoint-list",
        disabled: false,
        locked: false,
      };
    }
    const href = selected.missionId ? `/mission/${selected.missionId}` : "/world";
    if (selectedStatus === "completed") {
      return { label: "Buka Ulang Misi", href, disabled: false, locked: false };
    }
    if (selectedStatus === "locked") {
      return { label: "Misi Terkunci", href: "#", disabled: true, locked: true };
    }
    return { label: "Mulai Misi", href, disabled: false, locked: false };
  }, [selected, selectedStatus]);

  return (
    <main className="min-h-[calc(100vh-68px)] bg-[#f8fafc] px-4 py-6 sm:px-8 sm:py-8">
      <div className="mx-auto max-w-6xl">
        {/* Header Sederhana */}
        <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-black text-[#063b66]">Peta Eksplorasi Misi</h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Pilih lokasi untuk melihat detail dan menjalankan simulasi peran BCA.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-[#063b66] bg-white border border-slate-200 px-3.5 py-1.5 rounded-full shadow-xs">
              Progres: {summary.done}/{summary.total} Selesai
            </span>
          </div>
        </header>

        {/* Layout Utama: Peta & Detail */}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] items-start">
          {/* Kolom Peta (Putih Abu-abu Bersih) */}
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
            <div
              ref={mapElementRef}
              className="h-[440px] sm:h-[520px] w-full"
              aria-label="Peta Eksplorasi Lokasi BCA"
            />

            {loading && (
              <div className="absolute inset-0 z-500 flex flex-col items-center justify-center bg-white/80 backdrop-blur-xs">
                <LoaderCircle className="size-6 animate-spin text-[#005baa]" />
                <p className="mt-2 text-xs font-bold text-slate-600">Memuat peta…</p>
              </div>
            )}

            {error && (
              <div className="absolute inset-0 z-500 flex flex-col items-center justify-center bg-white p-6 text-center">
                <p className="text-xs font-bold text-rose-600">{error}</p>
              </div>
            )}
          </div>

          {/* Kolom Detail Checkpoint (Layout Sederhana) */}
          <aside className="space-y-4" aria-label="Detail Checkpoint">
            {/* Kartu Lokasi Terpilih */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#005baa]">
                  {selected.isStart ? "Markas Awal" : `Jalur ${selected.program}`}
                </span>
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                    selectedStatus === "completed"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : selectedStatus === "locked"
                      ? "bg-slate-100 text-slate-500 border border-slate-200"
                      : "bg-sky-50 text-[#005baa] border border-sky-200"
                  }`}
                >
                  {selectedStatus === "completed"
                    ? "Selesai"
                    : selectedStatus === "locked"
                    ? "Terkunci"
                    : "Tersedia"}
                </span>
              </div>

              <h2 className="mt-2 text-xl font-bold text-[#063b66]">{selected.name}</h2>
              <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                <MapPin size={13} className="text-slate-400" />
                {selected.area}
              </p>

              {selected.isStart ? (
                <div className="mt-4 rounded-xl bg-slate-50 p-3.5 text-xs leading-relaxed text-slate-600 border border-slate-200">
                  Tempat seluruh perjalanan beasiswa BCA dimulai. Pilih salah satu checkpoint di bawah untuk mulai menjalankan misi.
                </div>
              ) : selectedStatus === "locked" ? (
                <div className="mt-4 flex gap-2 rounded-xl bg-slate-50 p-3.5 text-xs text-slate-600 border border-slate-200">
                  <LockKeyhole className="mt-0.5 size-4 shrink-0 text-slate-400" />
                  <span>
                    Selesaikan misi sebelumnya di jalur <strong>{selected.program}</strong> untuk membuka checkpoint ini.
                  </span>
                </div>
              ) : (
                <div className="mt-4">
                  <Link
                    href={currentAction.href}
                    className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#005baa] hover:bg-[#004b8d] px-5 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-xs transition active:scale-[0.99]"
                  >
                    <span>{currentAction.label}</span>
                    <ChevronRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              )}
            </div>

            {/* Daftar Checkpoint */}
            <div id="checkpoint-list" className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-1">
                Daftar Lokasi Misi
              </p>
              <div className="space-y-1.5">
                {statuses.slice(1).map(({ location, status }) => {
                  const isCurrent = location.id === selectedId;
                  return (
                    <button
                      key={location.id}
                      type="button"
                      onClick={() => selectMission(location.id)}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-xs transition ${
                        isCurrent
                          ? "bg-sky-50 text-[#005baa] border border-sky-200 font-bold"
                          : "text-slate-700 hover:bg-slate-50 border border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className={`grid size-6 shrink-0 place-items-center rounded-lg text-[10px] font-bold ${
                            status === "completed"
                              ? "bg-emerald-500 text-white"
                              : isCurrent
                              ? "bg-[#005baa] text-white"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {status === "completed" ? "✓" : location.program === "PPTI" ? "IT" : "BZ"}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-semibold">{location.name}</p>
                          <p className="text-[10px] text-slate-400 truncate">{location.area}</p>
                        </div>
                      </div>

                      <span className="text-[10px] text-slate-400 shrink-0 ml-2">
                        {status === "completed" ? "Selesai" : status === "locked" ? "Terkunci" : "Tersedia"}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Reset Progres (Minimalis) */}
              <div className="mt-3 pt-3 border-t border-slate-100 text-center">
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm("Ulangi seluruh progres peta dari awal?")) reset();
                  }}
                  className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 hover:text-rose-600 transition"
                >
                  <RotateCcw size={11} />
                  <span>Reset Progres Peta</span>
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <style jsx global>{`
        /* Monokromatik & Bersih untuk Tile Map */
        .leaflet-tile-pane {
          filter: grayscale(100%) contrast(92%) brightness(102%);
        }
        .leaflet-container {
          background-color: #f8fafc !important;
          font-family: inherit;
        }
        .leaflet-control-zoom {
          border: 1px solid #e2e8f0 !important;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05) !important;
          border-radius: 8px !important;
          overflow: hidden;
        }
        .leaflet-control-zoom a {
          background-color: #ffffff !important;
          color: #0f172a !important;
          border-bottom: 1px solid #e2e8f0 !important;
          width: 32px !important;
          height: 32px !important;
          line-height: 32px !important;
          font-size: 14px !important;
        }

        /* Marker Simpel */
        .simple-map-marker {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .marker-bubble {
          width: 28px;
          height: 28px;
          border-radius: 9999px;
          background: #ffffff;
          border: 2px solid #94a3b8;
          color: #334155;
          font-size: 11px;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
          transition: all 0.2s ease;
        }
        .simple-map-marker.is-available .marker-bubble {
          border-color: #005baa;
          color: #005baa;
        }
        .simple-map-marker.is-completed .marker-bubble {
          background: #10b981;
          border-color: #10b981;
          color: #ffffff;
        }
        .simple-map-marker.is-start .marker-bubble {
          background: #063b66;
          border-color: #063b66;
          color: #ffffff;
          font-size: 9px;
        }
        .simple-map-marker.is-selected .marker-bubble {
          transform: scale(1.15);
          border-color: #005baa;
          box-shadow: 0 0 0 3px rgba(0, 91, 170, 0.2);
        }

        /* Player Pawn Simpel */
        .simple-pawn-wrapper {
          pointer-events: none;
        }
        .simple-player-pawn {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
        }
        .simple-pawn-tag {
          background: #063b66;
          color: #ffffff;
          font-size: 9px;
          font-weight: 700;
          padding: 1px 6px;
          border-radius: 9999px;
          white-space: nowrap;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
          margin-bottom: 2px;
        }
        .simple-pawn-sprite {
          width: 36px;
          height: 44px;
        }
        .simple-pawn-sprite img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          object-position: bottom;
          filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.2));
        }
        .simple-pawn-dot {
          width: 8px;
          height: 3px;
          background: rgba(0, 0, 0, 0.25);
          border-radius: 50%;
        }
      `}</style>
    </main>
  );
}
