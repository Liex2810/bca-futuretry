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
  Sparkles,
  Swords,
  Trophy,
  Compass,
  Zap,
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
    xpReward: 300,
    difficulty: "Challenging",
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
  if (location.isStart) return '<img src="/character-ppti.png" alt="BLI HQ" style="width: 100%; height: 100%; object-fit: cover;" />';

  const icons: Record<string, string> = {
    "cp-data":
      '<svg viewBox="0 0 32 32" aria-hidden="true"><ellipse cx="16" cy="8" rx="9" ry="4"/><path d="M7 8v8c0 2.2 4 4 9 4s9-1.8 9-4V8M7 16v8c0 2.2 4 4 9 4s9-1.8 9-4v-8"/></svg>',
    "cp-anomaly":
      '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M6 13h20M10 13l3-7h6l3 7"/><path d="M9 18c0 5 3 9 7 9s7-4 7-9"/><circle cx="13" cy="19" r="1.5"/><circle cx="19" cy="19" r="1.5"/><path d="M14 24h4"/></svg>',
    "cp-ux":
      '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="m20 5 7 7-12 12-7 2 2-7L20 5Z"/><path d="m17 8 7 7M8 26c-2 0-3-1-3-3 0-1.8-1-2.8-2-3"/></svg>',
    "cp-strategy":
      '<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="15" cy="17" r="10"/><circle cx="15" cy="17" r="5"/><circle cx="15" cy="17" r="1.5"/><path d="m18 14 9-9M21 5h6v6"/></svg>',
    "cp-invest":
      '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M5 27V7M5 27h23"/><path d="m8 22 6-7 5 4 8-10"/><path d="M21 9h6v6"/></svg>',
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

  // Total XP dihitung dari quest yang completed
  const totalXp = useMemo(() => {
    let xp = 100; // base xp saat mulai
    statuses.forEach(({ location, status }) => {
      if (status === "completed" && location.xpReward) {
        xp += location.xpReward;
      }
    });
    return xp;
  }, [statuses]);

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
            iconAnchor: [40, 92],
          })
        );
      });
    }
  }, [selectedId, hero]);

  useEffect(() => {
    let cancelled = false;
    const markers = markerRefs.current;

    import("leaflet")
      .then((leaflet) => {
        if (cancelled || !mapElementRef.current) return;
        mapInstanceRef.current?.remove();
        markers.clear();

        const map = leaflet.map(mapElementRef.current, { zoomControl: true, scrollWheelZoom: false });
        mapInstanceRef.current = map;

        // Tile layer Esri World Street Map: Peta jernih, kaya warna, bebas watermark & tanpa API key!
        leaflet
          .tileLayer(
            "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
            {
              attribution: "Tiles &copy; Esri",
              maxZoom: 17,
            }
          )
          .addTo(map);

        const start = locations[0].displayCoordinates;
        const routes = [
          {
            program: "PPTI",
            color: "#00c2ff",
            points: [
              start,
              ...locations
                .filter((location) => location.program === "PPTI")
                .map((location) => location.displayCoordinates),
            ],
          },
          {
            program: "PPBP",
            color: "#005baa",
            points: [
              start,
              ...locations
                .filter((location) => location.program === "PPBP")
                .map((location) => location.displayCoordinates),
            ],
          },
        ];

        routes.forEach((route) => {
          // Glow casing border
          leaflet.polyline(route.points, { color: "#ffffff", weight: 9, opacity: 0.85 }).addTo(map);
          // Neon quest path dengan animasi dash
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

        // Quest Checkpoint Markers
        statuses.forEach(({ location, status }) => {
          const branchIndex = location.isStart
            ? 0
            : locations.filter((item) => item.program === location.program).findIndex((item) => item.id === location.id) +
              1;
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

          marker.on("click", () => {
            setSelectedId(location.id);
            if (location.program === "PPTI") setHero("ppti");
            else if (location.program === "PPBP") setHero("ppbp");
          });
          markers.set(location.id, marker);
        });

        // Interactive Player Pawn Marker (Bidak Karakter di atas Peta)
        const initialLoc = locations.find((l) => l.id === selectedId) || locations[1];
        const playerIcon = leaflet.divIcon({
          className: "game-pawn-wrapper",
          html: playerPawnHtml(hero),
          iconSize: [80, 100],
          iconAnchor: [40, 92],
        });
        const playerMarker = leaflet
          .marker(initialLoc.displayCoordinates, {
            icon: playerIcon,
            zIndexOffset: 2500,
            interactive: false,
          })
          .addTo(map);
        playerMarkerRef.current = playerMarker;

        const bounds = locations.map((location) => location.coordinates);
        map.fitBounds(leaflet.latLngBounds(bounds), { padding: [55, 55], maxZoom: 11 });
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) {
          setError("Peta petualangan gagal dimuat. Coba muat ulang halaman.");
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
    const targetLoc = locations.find((l) => l.id === id);
    if (targetLoc?.program === "PPTI") setHero("ppti");
    else if (targetLoc?.program === "PPBP") setHero("ppbp");

    const marker = markerRefs.current.get(id);
    if (marker && mapInstanceRef.current) {
      mapInstanceRef.current.panTo(marker.getLatLng(), { animate: true, duration: 0.8 });
    }
  };

  return (
    <main className="min-h-[calc(100vh-68px)] bg-gradient-to-b from-[#e8f3fb] via-[#f3f7fa] to-[#e4eef6] px-4 py-6 sm:px-8 sm:py-10">
      <div className="mx-auto max-w-7xl">
        {/* Game RPG Header */}
        <header className="mb-6 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#00a9d6]/30 bg-white/90 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#0066ae] shadow-sm backdrop-blur">
              <Compass className="size-3.5 text-[#00a9d6] animate-spin" style={{ animationDuration: "12s" }} />
              <span>World Adventure Map</span>
              <span className="size-1.5 rounded-full bg-emerald-500 animate-ping" />
            </div>
            <h1 className="mt-2 text-3xl font-black text-[#063b66] tracking-tight sm:text-4xl">
              Peta Misi FutureTry
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
              Mulai dari markas utama <strong className="text-[#063b66]">BCA Learning Institute</strong>, lalu jelajahi
              cabang <strong className="text-[#008caf]">PPTI</strong> atau <strong className="text-[#00528c]">PPBP</strong>.
              Gerakkan bidak karaktermu dan taklukkan setiap tantangan!
            </p>
          </div>

          {/* RPG EXP & Quest Stats Bar */}
          <div className="min-w-64 rounded-2xl border border-white/80 bg-white/90 p-4 shadow-lg shadow-sky-900/5 backdrop-blur">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#063b66]">
                <Zap className="size-4 text-amber-500 fill-amber-400" />
                Player EXP
              </span>
              <span className="text-xs font-extrabold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                {totalXp} XP
              </span>
            </div>

            <div className="mt-2.5 flex justify-between text-xs font-bold text-slate-600">
              <span>Quest Selesai</span>
              <span className="text-[#0066ae]">
                {summary.done} / {summary.total} Checkpoint
              </span>
            </div>

            <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-slate-100 p-0.5 border border-slate-200/60">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#00a9d6] via-[#0066ae] to-emerald-500 transition-all duration-700 shadow-sm"
                style={{ width: `${Math.max(summary.percent, 8)}%` }}
              />
            </div>
          </div>
        </header>

        {/* Legend / Status Badges */}
        <div className="mb-4 flex flex-wrap items-center gap-2 text-xs font-bold text-slate-700" aria-label="Legenda">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-100/90 border border-cyan-200 px-3 py-1.5 text-[#007b9e]">
            <span className="size-2 rounded-full bg-[#00c2ff]" /> Jalur PPTI (Tech)
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100/90 border border-blue-200 px-3 py-1.5 text-[#004f86]">
            <span className="size-2 rounded-full bg-[#005baa]" /> Jalur PPBP (Business)
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100/90 border border-emerald-200 px-3 py-1.5 text-emerald-800">
            <Check className="size-3" /> Quest Selesai
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-200/90 border border-slate-300 px-3 py-1.5 text-slate-600">
            <LockKeyhole className="size-3" /> Terkunci
          </span>
        </div>

        {/* Game Map & Quest Board Container */}
        <section className="grid overflow-hidden rounded-3xl border-2 border-white bg-white/95 shadow-[0_24px_60px_rgba(15,35,65,0.12)] backdrop-blur lg:grid-cols-[minmax(0,1fr)_360px]">
          {/* Map View */}
          <div className="relative h-[55vh] min-h-[350px] bg-slate-100 lg:min-h-0 lg:h-[700px]">
            <div
              ref={mapElementRef}
              className="absolute inset-0 z-0"
              aria-label="Peta petualangan dua jalur PPTI dan PPBP"
            />
            {loading && (
              <div className="absolute inset-0 z-20 grid place-items-center bg-slate-100/80 backdrop-blur-sm">
                <div className="flex flex-col items-center gap-3">
                  <LoaderCircle className="size-10 animate-spin text-[#0066ae]" />
                  <p className="text-xs font-bold uppercase tracking-wider text-[#063b66]">
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

            {/* Quick Hero Floating Selector on Map Bottom Left */}
            <div className="absolute bottom-4 left-4 z-10 hidden sm:flex items-center gap-1.5 rounded-2xl bg-white/95 p-1.5 shadow-lg border border-slate-200/80 backdrop-blur">
              <span className="px-2 text-[10px] font-black uppercase text-slate-400">Pawn:</span>
              <button
                type="button"
                onClick={() => setHero("ppti")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold transition ${
                  hero === "ppti"
                    ? "bg-cyan-500 text-white shadow-md shadow-cyan-500/30"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <span>🧑‍💻 PPTI</span>
              </button>
              <button
                type="button"
                onClick={() => setHero("ppbp")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold transition ${
                  hero === "ppbp"
                    ? "bg-[#005baa] text-white shadow-md shadow-blue-800/30"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <span>💼 PPBP</span>
              </button>
            </div>
          </div>

          {/* Quest Log Sidebar */}
          <aside className="border-t border-slate-200 bg-gradient-to-b from-white to-[#f7f9fb] lg:border-l lg:border-t-0 flex flex-col justify-between" aria-label="Quest Log">
            <div>
              {/* Selected Quest Card */}
              <div className="border-b border-slate-200/80 p-5">
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-[#0066ae]">
                    <Swords className="size-3.5 text-[#00a9d6]" />
                    <span>Active Quest Brief</span>
                  </div>
                  {selected.program && (
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
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

                {/* Quest Reward & Info Stats */}
                <div className="mt-3.5 grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-xl border border-slate-200/80 bg-white p-2.5 shadow-sm">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase">Tingkat Quest</span>
                    <span className="font-extrabold text-[#063b66]">{selected.difficulty ?? "Normal"}</span>
                  </div>
                  <div className="rounded-xl border border-slate-200/80 bg-white p-2.5 shadow-sm">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase">Quest Reward</span>
                    <span className="font-extrabold text-amber-600">+{selected.xpReward ?? 200} XP</span>
                  </div>
                </div>

                {selected.isStart ? (
                  <div className="mt-4 rounded-2xl bg-sky-50 p-3.5 text-xs leading-relaxed text-[#063b66] border border-sky-100">
                    👑 <strong>BCA Learning Institute:</strong> Markas utama tempat seluruh perjalanan beasiswa dimulai.
                    Pilih salah satu checkpoint di bawah untuk mulai berpetualang!
                  </div>
                ) : selectedStatus === "locked" ? (
                  <div className="mt-4 flex gap-2.5 rounded-2xl bg-slate-100 p-3.5 text-xs text-slate-600 border border-slate-200">
                    <LockKeyhole className="mt-0.5 size-4 shrink-0 text-slate-400" />
                    <span>
                      Checkpoint ini masih terkunci. Selesaikan checkpoint sebelumnya pada jalur{" "}
                      <strong>{selected.program}</strong> untuk membuka quest ini.
                    </span>
                  </div>
                ) : (
                  <Link
                    href={`/mission/${selected.missionId}`}
                    className="mt-4 group inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#0066ae] to-[#00a9d6] px-5 py-3 text-sm font-black uppercase tracking-wider text-white shadow-lg shadow-sky-500/25 transition-all hover:scale-[1.02] hover:shadow-sky-500/40"
                  >
                    <span>{selectedStatus === "completed" ? "Buka Ulang Misi" : "Mulai Quest Sekarang"}</span>
                    <ChevronRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                )}
              </div>

              {/* Checkpoint / Stage List */}
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
                            ? "border-slate-300 bg-slate-100 shadow-sm"
                            : "border-[#00a9d6] bg-sky-50/90 shadow-md shadow-sky-500/10 scale-[1.01]"
                          : "border-transparent bg-white/60 hover:bg-white hover:border-slate-200"
                      }`}
                      aria-label={`${location.name}, status ${status}`}
                    >
                      <span
                        className={`grid size-9 shrink-0 place-items-center rounded-xl font-black text-xs shadow-sm ${
                          status === "completed"
                            ? "bg-emerald-500 text-white"
                            : status === "locked"
                            ? "bg-slate-200 text-slate-500"
                            : isSelected
                            ? "bg-gradient-to-br from-[#00a9d6] to-[#0066ae] text-white"
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
                        <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-500">
                          <span className={location.program === "PPTI" ? "text-[#008caf]" : "text-[#00528c]"}>
                            {location.program}
                          </span>
                          <span>•</span>
                          <span className="truncate">{location.area}</span>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="size-2 rounded-full bg-[#00a9d6] animate-ping" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Reset Progress Button */}
            {summary.done > 0 && (
              <div className="border-t border-slate-200 p-4">
                <button
                  type="button"
                  onClick={() => confirm("Reset seluruh progres misi dan refleksi simulasi?") && reset()}
                  className="flex min-h-10 w-full items-center justify-center gap-2 rounded-xl text-xs font-bold text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                >
                  <RotateCcw className="size-3.5" />
                  <span>Reset Progres Misi</span>
                </button>
              </div>
            )}
          </aside>
        </section>
      </div>

      {/* Global CSS untuk styling Leaflet Game Map & Player Pawn */}
      <style jsx global>{`
        .leaflet-control-zoom a {
          width: 44px !important;
          height: 44px !important;
          line-height: 44px !important;
          font-size: 20px !important;
          border-radius: 12px !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12) !important;
          font-weight: bold;
        }

        /* Animated Glowing Polyline Routes */
        @keyframes route-dash-flow {
          from {
            stroke-dashoffset: 40;
          }
          to {
            stroke-dashoffset: 0;
          }
        }
        .leaflet-game-route {
          animation: route-dash-flow 1.8s linear infinite;
        }

        /* Checkpoint Markers */
        .map-mission-marker {
          position: relative;
          width: 56px;
          height: 56px;
          cursor: pointer;
          transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .map-mission-marker:hover {
          transform: scale(1.15) translateY(-4px);
        }
        .map-marker-art {
          position: absolute;
          left: 4px;
          top: 0;
          display: grid;
          width: 48px;
          height: 48px;
          place-items: center;
          overflow: hidden;
          border: 3px solid white;
          border-radius: 20px;
          background: #e8f7ff;
          color: #0066ae;
          box-shadow: 0 10px 25px rgba(15, 48, 77, 0.28);
        }
        .map-marker-art svg {
          width: 28px;
          height: 28px;
          fill: none;
          stroke: currentColor;
          stroke-width: 2.2;
          stroke-linecap: round;
          stroke-linejoin: round;
        }
        .is-ppti .map-marker-art {
          background: #e0f9ff;
          color: #008caf;
          border-color: #d1f5ff;
        }
        .is-ppbp .map-marker-art {
          background: #e5eff9;
          color: #00528c;
          border-color: #d8e6f5;
        }
        .map-marker-badge {
          position: absolute;
          right: -2px;
          top: -4px;
          z-index: 2;
          display: grid;
          width: 24px;
          height: 24px;
          place-items: center;
          border: 2px solid white;
          border-radius: 99px;
          background: #0066ae;
          color: white;
          font: 800 11px system-ui, sans-serif;
          box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2);
        }
        .map-marker-pulse {
          position: absolute;
          left: 4px;
          top: 0;
          width: 48px;
          height: 48px;
          border: 2px solid #00c2ff;
          border-radius: 22px;
          animation: map-marker-pulse 1.8s ease-out infinite;
        }
        .is-completed .map-marker-art {
          background: #ecfdf5;
          color: #059669;
          border-color: #a7f3d0;
        }
        .is-completed .map-marker-badge {
          background: #10b981;
        }
        .is-locked .map-marker-art {
          filter: grayscale(1);
          opacity: 0.65;
          background: #f1f5f9;
        }
        .is-locked .map-marker-badge {
          background: #64748b;
        }
        .is-locked .map-marker-pulse,
        .is-completed .map-marker-pulse {
          display: none;
        }
        .is-start .map-marker-art {
          border-radius: 99px;
          background: white;
          border: 3px solid #0066ae;
          box-shadow: 0 10px 30px rgba(0, 102, 174, 0.4);
        }
        .is-start .map-marker-art img {
          width: 36px;
          height: auto;
          object-fit: contain;
        }

        /* ════════════════════════════════════════════════════════════════
           PLAYER PAWN TOKEN (Bidak Karakter di atas Peta)
           ════════════════════════════════════════════════════════════════ */
        .game-pawn-wrapper {
          background: transparent !important;
          border: none !important;
        }
        .game-player-pawn {
          position: relative;
          width: 80px;
          height: 100px;
          display: flex;
          flex-direction: column;
          align-items: center;
          pointer-events: none;
          animation: pawn-bounce 2.4s ease-in-out infinite;
        }
        .player-pawn-tag {
          background: linear-gradient(135deg, #0066ae, #00c2ff);
          color: white;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.04em;
          padding: 2px 9px;
          border-radius: 99px;
          box-shadow: 0 4px 14px rgba(0, 102, 174, 0.45);
          border: 1.5px solid white;
          white-space: nowrap;
          text-transform: uppercase;
          display: inline-flex;
          align-items: center;
          gap: 3px;
        }
        .pawn-star {
          color: #ffde59;
          font-size: 11px;
        }
        .player-pawn-sprite {
          width: 64px;
          height: 68px;
          margin-top: 1px;
          filter: drop-shadow(0 10px 14px rgba(0, 30, 60, 0.38));
        }
        .player-pawn-sprite img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          object-position: bottom;
        }
        .player-pawn-pedestal {
          position: absolute;
          bottom: 2px;
          width: 50px;
          height: 18px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .pawn-shadow {
          width: 40px;
          height: 12px;
          background: rgba(15, 23, 42, 0.35);
          border-radius: 50%;
          filter: blur(2px);
          animation: pawn-shadow-scale 2.4s ease-in-out infinite;
        }
        .pawn-ring-pulse {
          position: absolute;
          width: 48px;
          height: 16px;
          border: 2.5px solid #00c2ff;
          border-radius: 50%;
          box-shadow: 0 0 12px #00c2ff;
          animation: pawn-ring-pulse 2s ease-out infinite;
        }

        @keyframes pawn-bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-12px);
          }
        }
        @keyframes pawn-shadow-scale {
          0%, 100% {
            transform: scale(1);
            opacity: 0.35;
          }
          50% {
            transform: scale(0.72);
            opacity: 0.18;
          }
        }
        @keyframes pawn-ring-pulse {
          0% {
            transform: scale(0.85);
            opacity: 0.95;
          }
          100% {
            transform: scale(1.65);
            opacity: 0;
          }
        }

        @keyframes map-marker-pulse {
          0% {
            opacity: 0.8;
            transform: scale(0.9);
          }
          100% {
            opacity: 0;
            transform: scale(1.45);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .map-marker-pulse,
          .leaflet-game-route,
          .game-player-pawn,
          .pawn-shadow,
          .pawn-ring-pulse {
            animation: none !important;
          }
        }
      `}</style>
    </main>
  );
}
