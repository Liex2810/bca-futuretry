"use client";

import "leaflet/dist/leaflet.css";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Map as LeafletMap, Marker } from "leaflet";
import {
  Check,
  ChevronRight,
  LoaderCircle,
  LockKeyhole,
  RotateCcw,
  Swords,
} from "lucide-react";
import { useJourney } from "./JourneyProvider";
import { progressSummary } from "@/lib/progress";

type MarkerStatus = "available" | "locked" | "completed";
type Coordinates = [number, number];

interface MapLocation {
  id: string;
  name: string;
  area: string;
  coordinates: Coordinates;
  displayCoordinates: Coordinates;
  missionId?: string;
  program?: "PPTI" | "PPBP";
  isStart?: boolean;
  xpReward?: number;
  difficulty?: string;
}

const locations: MapLocation[] = [
  {
    id: "cp-characters",
    name: "BCA Learning Institute",
    area: "Sentul City, Bogor",
    coordinates: [-6.5857007, 106.8822386],
    displayCoordinates: [-6.5857007, 106.8822386],
    isStart: true,
    xpReward: 100,
    difficulty: "Tutorial",
  },
  {
    id: "cp-data",
    name: "Data Lab",
    area: "Cibitung, Bekasi",
    coordinates: [-6.2618245, 107.0837982],
    displayCoordinates: [-6.2618245, 107.0837982],
    missionId: "m-dashboard",
    program: "PPTI",
    xpReward: 250,
    difficulty: "Normal",
  },
  {
    id: "cp-anomaly",
    name: "Security Operations",
    area: "Grand Indonesia, Jakarta Pusat",
    coordinates: [-6.1957601, 106.8214547],
    displayCoordinates: [-6.1957601, 106.8214547],
    missionId: "m-anomaly",
    program: "PPTI",
    xpReward: 250,
    difficulty: "Normal",
  },
  {
    id: "cp-ux",
    name: "Design Studio",
    area: "Landmark Pluit, Jakarta Utara",
    coordinates: [-6.1244714, 106.7995216],
    displayCoordinates: [-6.1244714, 106.7995216],
    missionId: "m-uxfix",
    program: "PPTI",
    xpReward: 250,
    difficulty: "Normal",
  },
  {
    id: "cp-strategy",
    name: "Strategy Room",
    area: "Foresta, Tangerang Selatan",
    coordinates: [-6.2882326, 106.6437145],
    displayCoordinates: [-6.2882326, 106.6437145],
    missionId: "m-bizcase",
    program: "PPBP",
    xpReward: 250,
    difficulty: "Normal",
  },
  {
    id: "cp-invest",
    name: "Investment Desk",
    area: "Wisma Asia, Jakarta Barat",
    coordinates: [-6.1891943, 106.7977565],
    displayCoordinates: [-6.1891943, 106.7977565],
    missionId: "m-invest",
    program: "PPBP",
    xpReward: 300,
    difficulty: "Challenging",
  },
];

function markerArtwork(location: MapLocation) {
  if (location.isStart) {
    return '<img src="/bca-logo.svg" alt="BLI HQ" style="width: 28px; height: 28px; object-fit: contain;" />';
  }

  const icons: Record<string, string> = {
    "cp-data":
      '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/></svg>',
    "cp-anomaly":
      '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>',
    "cp-ux":
      '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>',
    "cp-strategy":
      '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',
    "cp-invest":
      '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>',
  };

  return icons[location.id] ?? icons["cp-strategy"];
}

function markerHtml(location: MapLocation, index: number, status: MarkerStatus) {
  const badge = status === "locked" ? "•" : status === "completed" ? "✓" : String(index);
  const badgeHtml = location.isStart ? "" : `<span class="map-marker-badge">${badge}</span>`;
  return `<div class="map-mission-marker is-${status}${location.isStart ? " is-start" : ""} is-${
    location.program?.toLowerCase() ?? "bli"
  }" aria-hidden="true"><span class="map-marker-pulse"></span><span class="map-marker-art">${markerArtwork(
    location
  )}</span>${badgeHtml}</div>`;
}

function playerPawnHtml(hero: "ppti" | "ppbp") {
  const imgSrc = hero === "ppti" ? "/character-ppti.png" : "/character-ppbp.png";
  const heroName = hero === "ppti" ? "PPTI Explorer" : "PPBP Strategist";
  return `
    <div class="game-player-pawn">
      <div class="player-pawn-tag">
        <span class="pawn-star">★</span> ${heroName}
      </div>
      <div class="player-pawn-sprite">
        <img src="${imgSrc}" alt="${heroName}" />
      </div>
      <div class="player-pawn-pedestal">
        <span class="pawn-ring-pulse"></span>
        <span class="pawn-shadow"></span>
      </div>
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

  const statuses = useMemo(
    () =>
      locations.map((location) => ({
        location,
        status: (location.isStart || stateOf(location.id) === "current"
          ? "available"
          : stateOf(location.id)) as MarkerStatus,
      })),
    [stateOf]
  );

  // Sync Hero Pawn jika player marker sudah terpasang
  useEffect(() => {
    if (playerMarkerRef.current && mapInstanceRef.current) {
      const targetLoc = locations.find((l) => l.id === selectedId) || locations[1];
      playerMarkerRef.current.setLatLng(targetLoc.displayCoordinates);
      import("leaflet").then((leaflet) => {
        playerMarkerRef.current?.setIcon(
          leaflet.divIcon({
            className: "game-pawn-wrapper",
            html: playerPawnHtml(hero),
            iconSize: [80, 100],
            iconAnchor: [40, 85],
          })
        );
      });
    }
  }, [hero, selectedId]);

  useEffect(() => {
    let cancelled = false;
    const markers = markerRefs.current;

    import("leaflet")
      .then((leaflet) => {
        if (cancelled || !mapElementRef.current) return;
        mapInstanceRef.current?.remove();
        markers.clear();

        // attributionControl: false -> MENGHILANGKAN WATERMARK LEAFLET / ESRI TOTAL!
        const map = leaflet.map(mapElementRef.current, {
          zoomControl: true,
          scrollWheelZoom: false,
          attributionControl: false,
        });
        mapInstanceRef.current = map;

        // Tile layer Esri World Street Map: Peta topografi jernih, bebas watermark & tanpa butuh API key!
        leaflet
          .tileLayer(
            "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
            {
              attribution: "",
              maxZoom: 17,
            }
          )
          .addTo(map);

        const start = locations[0].displayCoordinates;
        const routes = [
          {
            program: "PPTI",
            color: "#00c2ff",
            points: [start, ...locations.filter((loc) => loc.program === "PPTI").map((loc) => loc.displayCoordinates)],
          },
          {
            program: "PPBP",
            color: "#0066ae",
            points: [start, ...locations.filter((loc) => loc.program === "PPBP").map((loc) => loc.displayCoordinates)],
          },
        ];

        routes.forEach((route) => {
          // White halo casing line
          leaflet.polyline(route.points, { color: "#ffffff", weight: 8, opacity: 0.95 }).addTo(map);
          // Animated glowing route
          leaflet
            .polyline(route.points, {
              color: route.color,
              weight: 5,
              opacity: 0.95,
              dashArray: "10 10",
              className: "leaflet-game-route",
            })
            .addTo(map);
        });

        // Add Checkpoint Markers
        statuses.forEach(({ location, status }) => {
          const branchIndex = location.isStart
            ? 0
            : locations.filter((item) => item.program === location.program).findIndex((item) => item.id === location.id) + 1;
          const icon = leaflet.divIcon({
            className: "",
            html: markerHtml(location, branchIndex, status),
            iconSize: [56, 56],
            iconAnchor: [28, 48],
          });
          const marker = leaflet
            .marker(location.displayCoordinates, {
              icon,
              title: `${location.name} — ${status}`,
              zIndexOffset: location.isStart ? 1000 : 0,
            })
            .addTo(map);
          marker.on("click", () => setSelectedId(location.id));
          markers.set(location.id, marker);
        });

        // Add 3D Player Character Pawn Marker
        const initialLoc = locations.find((l) => l.id === selectedId) || locations[1];
        const playerIcon = leaflet.divIcon({
          className: "game-pawn-wrapper",
          html: playerPawnHtml(hero),
          iconSize: [80, 100],
          iconAnchor: [40, 85],
        });
        const playerMarker = leaflet
          .marker(initialLoc.displayCoordinates, {
            icon: playerIcon,
            zIndexOffset: 2000,
          })
          .addTo(map);
        playerMarkerRef.current = playerMarker;

        const bounds = locations.map((location) => location.coordinates);
        map.fitBounds(leaflet.latLngBounds(bounds), { padding: [45, 45], maxZoom: 11 });
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) {
          setError("Peta gagal dimuat. Coba muat ulang halaman.");
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
      mapInstanceRef.current?.remove();
      mapInstanceRef.current = null;
      markers.clear();
      playerMarkerRef.current = null;
    };
  }, [statuses]);

  const selectMission = (id: string) => {
    setSelectedId(id);
    const marker = markerRefs.current.get(id);
    if (marker && mapInstanceRef.current) {
      mapInstanceRef.current.panTo(marker.getLatLng());
    }
  };

  return (
    <main className="min-h-[calc(100vh-68px)] bg-[#f4f6f8] px-4 py-6 sm:px-8 sm:py-8">
      <div className="mx-auto max-w-7xl">
        {/* Category & Status Filter Bar (seperti di screenshot) */}
        <div className="mb-4 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-600">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-50 px-3 py-1.5 text-[#008caf] border border-cyan-200 shadow-xs">
            <span className="size-2 rounded-full bg-[#00c2ff]" />
            <span>Jalur PPTI (Tech)</span>
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-[#00528c] border border-blue-200 shadow-xs">
            <span className="size-2 rounded-full bg-[#005baa]" />
            <span>Jalur PPBP (Business)</span>
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-emerald-800 border border-emerald-200 shadow-xs">
            <Check className="size-3.5 text-emerald-600 stroke-[3]" />
            <span>Quest Selesai</span>
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-slate-600 border border-slate-200 shadow-xs">
            <LockKeyhole className="size-3.5 text-slate-500" />
            <span>Terkunci</span>
          </span>
        </div>

        {/* Section Peta & Sidebar */}
        <section className="grid overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-xl shadow-slate-900/5 lg:grid-cols-[minmax(0,1fr)_360px]">
          {/* Map View Area */}
          <div className="relative h-[55vh] min-h-[380px] bg-slate-100 lg:min-h-0 lg:h-[680px]">
            <div
              ref={mapElementRef}
              className="absolute inset-0 z-0"
              aria-label="Peta interaktif eksplorasi misi BCA FutureTry"
            />

            {loading && (
              <div className="absolute inset-0 z-20 grid place-items-center bg-slate-100/90 backdrop-blur-xs">
                <div className="flex flex-col items-center gap-3">
                  <LoaderCircle className="size-10 animate-spin text-[#0066ae]" />
                  <p className="text-xs font-extrabold uppercase tracking-wider text-[#063b66]">
                    Menyiapkan Medan Petualangan…
                  </p>
                </div>
              </div>
            )}

            {error && (
              <div className="absolute inset-0 z-20 grid place-items-center p-6 text-center text-sm font-semibold text-rose-600 bg-rose-50/90">
                {error}
              </div>
            )}

            {/* Quick Hero Floating Selector on Map Bottom Left (sesuai screenshot) */}
            <div className="absolute bottom-4 left-4 z-10 flex items-center gap-1.5 rounded-2xl bg-white/95 p-1.5 shadow-lg border border-slate-200/90 backdrop-blur-xs">
              <span className="px-2 text-[10px] font-black uppercase tracking-wider text-slate-400">Pawn:</span>
              <button
                type="button"
                onClick={() => setHero("ppti")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                  hero === "ppti"
                    ? "bg-[#00c2ff] text-white shadow-md shadow-cyan-500/30"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <span>🧑‍💻 PPTI</span>
              </button>
              <button
                type="button"
                onClick={() => setHero("ppbp")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                  hero === "ppbp"
                    ? "bg-[#005baa] text-white shadow-md shadow-blue-800/30"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <span>💼 PPBP</span>
              </button>
            </div>
          </div>

          {/* Quest Log Sidebar (persis seperti di screenshot) */}
          <aside className="border-t border-slate-200 bg-white lg:border-l lg:border-t-0 flex flex-col justify-between" aria-label="Quest Log">
            <div>
              {/* Selected Quest Card */}
              <div className="border-b border-slate-200 p-5">
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-[#0066ae]">
                    <Swords className="size-3.5 text-[#00a9d6]" />
                    <span>Active Quest Brief</span>
                  </div>
                  {selected.program && (
                    <span
                      className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                        selected.program === "PPTI"
                          ? "bg-cyan-100 text-cyan-800 border border-cyan-200"
                          : "bg-blue-100 text-blue-800 border border-blue-200"
                      }`}
                    >
                      Jalur {selected.program}
                    </span>
                  )}
                </div>

                <h2 className="mt-2 text-2xl font-black text-[#063b66] tracking-tight">{selected.name}</h2>
                <p className="text-xs font-semibold text-slate-500">{selected.area}</p>

                {/* Quest Reward & Info Stats (2 Columns Box seperti screenshot) */}
                <div className="mt-3.5 grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 shadow-2xs">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase">Tingkat Quest</span>
                    <span className="font-extrabold text-[#063b66]">{selected.difficulty ?? "Normal"}</span>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 shadow-2xs">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase">Quest Reward</span>
                    <span className="font-extrabold text-amber-600">+{selected.xpReward ?? 250} XP</span>
                  </div>
                </div>

                {selected.isStart ? (
                  <div className="mt-4 rounded-xl bg-sky-50 p-3.5 text-xs leading-relaxed text-[#063b66] border border-sky-100">
                    👑 <strong>BCA Learning Institute:</strong> Markas utama tempat seluruh perjalanan beasiswa dimulai.
                    Pilih salah satu checkpoint di bawah untuk mulai berpetualang!
                  </div>
                ) : selectedStatus === "locked" ? (
                  <div className="mt-4 flex gap-2.5 rounded-xl bg-slate-100 p-3.5 text-xs text-slate-600 border border-slate-200">
                    <LockKeyhole className="mt-0.5 size-4 shrink-0 text-slate-400" />
                    <span>
                      Checkpoint ini masih terkunci. Selesaikan checkpoint sebelumnya pada jalur{" "}
                      <strong>{selected.program}</strong> untuk membuka quest ini.
                    </span>
                  </div>
                ) : (
                  <Link
                    href={`/mission/${selected.missionId}`}
                    className="mt-4 group inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#005baa] hover:bg-[#004b8d] px-5 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-sm transition active:scale-[0.99]"
                  >
                    <span>{selectedStatus === "completed" ? "Buka Ulang Misi" : "Mulai Quest Sekarang"}</span>
                    <ChevronRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                )}
              </div>

              {/* Checkpoint / Stage List (Daftar Checkpoint Petualangan) */}
              <div className="p-3 max-h-[380px] overflow-y-auto space-y-2">
                <p className="px-2 pt-1 text-[11px] font-black uppercase tracking-wider text-slate-400">
                  Daftar Checkpoint Petualangan
                </p>
                {statuses.slice(1).map(({ location, status }, index) => {
                  const isSelected = selectedId === location.id;
                  return (
                    <button
                      key={location.id}
                      type="button"
                      onClick={() => selectMission(location.id)}
                      className={`flex min-h-14 w-full items-center gap-3 rounded-2xl border p-3 text-left transition-all ${
                        isSelected
                          ? status === "locked"
                            ? "border-slate-300 bg-slate-100 shadow-xs"
                            : "border-[#00c2ff] bg-sky-50 shadow-xs scale-[1.01]"
                          : "border-transparent bg-white hover:bg-slate-50 hover:border-slate-200"
                      }`}
                      aria-label={`${location.name}, status ${status}`}
                    >
                      <span
                        className={`grid size-9 shrink-0 place-items-center rounded-xl font-black text-xs shadow-xs ${
                          status === "completed"
                            ? "bg-emerald-500 text-white"
                            : status === "locked"
                            ? "bg-slate-200 text-slate-500"
                            : isSelected
                            ? "bg-[#005baa] text-white"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {status === "completed" ? (
                          <Check className="size-4 stroke-[3]" />
                        ) : status === "locked" ? (
                          <LockKeyhole className="size-4" />
                        ) : (
                          index + 1
                        )}
                      </span>

                      <div className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-extrabold text-[#063b66]">
                          {location.name}
                        </span>
                        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
                          <span className={location.program === "PPTI" ? "text-[#008caf]" : "text-[#00528c]"}>
                            {location.program}
                          </span>
                          <span>•</span>
                          <span className="truncate">{location.area}</span>
                        </div>
                      </div>

                      {status === "completed" && (
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          Selesai
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Reset Progress Footer */}
            {summary.done > 0 && (
              <div className="border-t border-slate-200 bg-white p-3.5">
                <button
                  type="button"
                  onClick={() => confirm("Reset seluruh progres misi dan refleksi simulasi?") && reset()}
                  className="flex min-h-10 w-full items-center justify-center gap-2 rounded-xl text-xs font-bold text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                >
                  <RotateCcw className="size-3.5" />
                  <span>Reset Seluruh Progres</span>
                </button>
              </div>
            )}
          </aside>
        </section>
      </div>
    </main>
  );
}
