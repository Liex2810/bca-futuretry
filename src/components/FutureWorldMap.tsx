"use client";

import "leaflet/dist/leaflet.css";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Map as LeafletMap, Marker } from "leaflet";
import {
  Check,
  ChevronRight,
  Database,
  Landmark,
  LoaderCircle,
  LockKeyhole,
  MapPin,
  Palette,
  RotateCcw,
  Shield,
  Target,
  TrendingUp,
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
}

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

function getLocationIcon(id: string, className = "size-5") {
  switch (id) {
    case "cp-characters":
      return <Landmark className={className} />;
    case "cp-data":
      return <Database className={className} />;
    case "cp-anomaly":
      return <Shield className={className} />;
    case "cp-ux":
      return <Palette className={className} />;
    case "cp-strategy":
      return <Target className={className} />;
    case "cp-invest":
      return <TrendingUp className={className} />;
    default:
      return <Target className={className} />;
  }
}

function markerArtwork(location: MapLocation) {
  if (location.isStart) {
    return `<img src="/bca-logo.svg" alt="BCA" style="width:28px;height:28px;object-fit:contain;" />`;
  }

  const icons: Record<string, string> = {
    // Data Lab (Cibitung) -> Silinder Database
    "cp-data": `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/></svg>`,
    // Security Operations (Grand Indonesia) -> Perisai Keamanan
    "cp-anomaly": `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>`,
    // Design Studio (Pluit) -> Palet Desain UI/UX
    "cp-ux": `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>`,
    // Strategy Room (Foresta) -> Target / Bullseye Bisnis
    "cp-strategy": `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,
    // Investment Desk (Wisma Asia) -> Grafik Portofolio Pasar
    "cp-invest": `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>`,
  };

  return icons[location.id] ?? icons["cp-strategy"];
}

function markerHtml(location: MapLocation, index: number, status: MarkerStatus) {
  const badge = status === "locked" ? "•" : status === "completed" ? "✓" : String(index);
  const badgeHtml = location.isStart ? "" : `<span class="map-marker-badge">${badge}</span>`;
  return `<div class="map-mission-marker is-${status}${location.isStart ? " is-start" : ""} is-${location.program?.toLowerCase() ?? "bli"}" aria-hidden="true"><span class="map-marker-pulse"></span><span class="map-marker-art">${markerArtwork(location)}</span>${badgeHtml}</div>`;
}

export function FutureWorldMap() {
  const mapElementRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const markerRefs = useRef(new Map<string, Marker>());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState("cp-data");
  const { stateOf, progress, reset } = useJourney();
  const summary = progressSummary(progress);
  const selected = locations.find((item) => item.id === selectedId) ?? locations[1];
  const selectedState = stateOf(selected.id);
  const selectedStatus: MarkerStatus = selected.isStart || selectedState === "current" ? "available" : selectedState;
  const statuses = useMemo(
    () =>
      locations.map((location) => ({
        location,
        status: (location.isStart || stateOf(location.id) === "current" ? "available" : stateOf(location.id)) as MarkerStatus,
      })),
    [stateOf]
  );

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
        leaflet
          .tileLayer(
            "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
            { attribution: "Tiles &copy; Esri", maxZoom: 16 }
          )
          .addTo(map);

        const start = locations[0].displayCoordinates;
        const routes = [
          {
            program: "PPTI",
            color: "#00a9d6",
            points: [start, ...locations.filter((loc) => loc.program === "PPTI").map((loc) => loc.displayCoordinates)],
          },
          {
            program: "PPBP",
            color: "#00528c",
            points: [start, ...locations.filter((loc) => loc.program === "PPBP").map((loc) => loc.displayCoordinates)],
          },
        ];

        routes.forEach((route) => {
          leaflet.polyline(route.points, { color: "#ffffff", weight: 8, opacity: 0.95 }).addTo(map);
          leaflet.polyline(route.points, { color: route.color, weight: 5, opacity: 0.95, dashArray: "9 9" }).addTo(map);
        });

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
    <main className="min-h-[calc(100vh-68px)] bg-[#f4f6f8] px-4 py-6 sm:px-8 sm:py-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#0066ae]">Eksplorasi Misi</p>
            <h1 className="mt-1 text-3xl font-extrabold text-[#063b66] sm:text-4xl">Peta Misi FutureTry</h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
              Mulai dari BCA Learning Institute, lalu jelajahi cabang PPTI atau PPBP. Selesaikan checkpoint secara
              berurutan pada masing-masing jalur.
            </p>
          </div>
          <div className="min-w-52 rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex justify-between text-sm font-bold text-[#063b66]">
              <span>Progress</span>
              <span>
                {summary.done}/{summary.total}
              </span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-[#0066ae] transition-all" style={{ width: `${summary.percent}%` }} />
            </div>
          </div>
        </header>

        <div className="mb-4 flex flex-wrap gap-2 text-xs font-semibold text-slate-600" aria-label="Legenda jalur dan status checkpoint">
          <span className="rounded-full bg-cyan-50 px-3 py-1.5 text-[#008caf] border border-cyan-200">Jalur PPTI</span>
          <span className="rounded-full bg-sky-50 px-3 py-1.5 text-[#00528c] border border-sky-200">Jalur PPBP</span>
          <span className="rounded-full bg-sky-50 px-3 py-1.5 text-[#0066ae] border border-sky-200">● Tersedia</span>
          <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-emerald-700 border border-emerald-200">✓ Selesai</span>
          <span className="rounded-full bg-slate-200 px-3 py-1.5 text-slate-700">● Terkunci</span>
        </div>

        <section className="grid overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_55px_rgba(15,23,42,0.10)] lg:grid-cols-[minmax(0,1fr)_360px]">
          {/* Kolom Peta */}
          <div className="relative h-[50vh] min-h-[320px] bg-slate-100 lg:min-h-0 lg:h-[680px]">
            <div
              ref={mapElementRef}
              className="absolute inset-0 z-0"
              aria-label="Peta dua cabang perjalanan PPTI dan PPBP dari BCA Learning Institute"
            />
            {loading && (
              <div className="absolute inset-0 z-20 grid place-items-center bg-slate-100">
                <LoaderCircle className="animate-spin text-[#0066ae]" />
              </div>
            )}
            {error && (
              <div className="absolute inset-0 z-20 grid place-items-center p-6 text-center text-sm text-slate-600">
                {error}
              </div>
            )}
          </div>

          {/* Aside Checkpoint Panel */}
          <aside className="border-t border-slate-200 bg-[#fbfcfd] lg:border-l lg:border-t-0 flex flex-col justify-between" aria-label="Daftar checkpoint">
            <div>
              {/* Selected Location Card */}
              <div className="border-b border-slate-200 bg-white p-5">
                <div className="flex items-start gap-3.5">
                  <div
                    className={`grid size-12 shrink-0 place-items-center rounded-2xl border-2 shadow-sm ${
                      selected.isStart
                        ? "bg-white border-slate-200 p-2"
                        : selected.program === "PPTI"
                        ? "bg-cyan-50 text-[#008caf] border-cyan-200"
                        : "bg-sky-50 text-[#00528c] border-sky-200"
                    }`}
                  >
                    {getLocationIcon(selected.id, "size-6")}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#0066ae]">
                        {selected.isStart ? "Markas Utama" : `Jalur ${selected.program}`}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          selectedStatus === "completed"
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                            : selectedStatus === "locked"
                            ? "bg-slate-100 text-slate-500 border border-slate-200"
                            : "bg-sky-100 text-[#0066ae] border border-sky-200"
                        }`}
                      >
                        {selectedStatus === "completed"
                          ? "Selesai"
                          : selectedStatus === "locked"
                          ? "Terkunci"
                          : "Tersedia"}
                      </span>
                    </div>
                    <h2 className="mt-1 text-xl font-black text-[#063b66] truncate">{selected.name}</h2>
                    <p className="mt-0.5 text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="size-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{selected.area}</span>
                    </p>
                  </div>
                </div>

                {selected.isStart ? (
                  <p className="mt-4 rounded-xl bg-sky-50 p-3 text-xs leading-relaxed text-[#063b66] border border-sky-100">
                    Titik awal seluruh perjalanan beasiswa BCA. Pilih salah satu checkpoint di bawah untuk memulai misi simulasi.
                  </p>
                ) : selectedStatus === "locked" ? (
                  <p className="mt-4 flex gap-2 rounded-xl bg-slate-100 p-3 text-xs text-slate-600 border border-slate-200">
                    <LockKeyhole className="mt-0.5 size-4 shrink-0 text-slate-400" />
                    <span>
                      Selesaikan checkpoint sebelumnya pada jalur <strong>{selected.program}</strong> untuk membuka misi ini.
                    </span>
                  </p>
                ) : (
                  <Link
                    href={`/mission/${selected.missionId}`}
                    className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#005baa] hover:bg-[#004b8d] px-5 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-sm transition active:scale-[0.99]"
                  >
                    <span>{selectedStatus === "completed" ? "Lihat Kembali Misi" : "Mulai Misi"}</span>
                    <ChevronRight className="size-4" />
                  </Link>
                )}
              </div>

              {/* Checkpoint List with Visual Icons */}
              <div className="p-3 max-h-[440px] overflow-y-auto space-y-1.5">
                <p className="px-2 pt-1 pb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Daftar Titik Lokasi
                </p>
                {statuses.slice(1).map(({ location, status }, index) => {
                  const isSelected = selectedId === location.id;
                  return (
                    <button
                      key={location.id}
                      type="button"
                      onClick={() => selectMission(location.id)}
                      className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${
                        isSelected
                          ? status === "locked"
                            ? "border-slate-300 bg-slate-100 shadow-xs"
                            : "border-[#0066ae] bg-sky-50 shadow-xs font-bold"
                          : "border-transparent bg-white hover:bg-slate-50 hover:border-slate-200"
                      }`}
                      aria-label={`${location.name}, ${
                        status === "locked" ? "terkunci" : status === "completed" ? "selesai" : "tersedia"
                      }`}
                    >
                      {/* Checkpoint Category Icon */}
                      <div
                        className={`grid size-10 shrink-0 place-items-center rounded-xl border transition ${
                          status === "completed"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : status === "locked"
                            ? "bg-slate-100 text-slate-400 border-slate-200"
                            : location.program === "PPTI"
                            ? "bg-cyan-50 text-[#008caf] border-cyan-200"
                            : "bg-sky-50 text-[#00528c] border-sky-200"
                        }`}
                      >
                        {getLocationIcon(location.id, "size-5")}
                      </div>

                      {/* Info & Title */}
                      <div className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-bold text-[#063b66]">{location.name}</span>
                        <span className="text-xs text-slate-500 truncate block">
                          {location.program} · {location.area}
                        </span>
                      </div>

                      {/* Status Indicator */}
                      <span
                        className={`grid size-7 shrink-0 place-items-center rounded-full text-xs font-bold ${
                          status === "completed"
                            ? "bg-emerald-100 text-emerald-700"
                            : status === "locked"
                            ? "bg-slate-200 text-slate-500"
                            : isSelected
                            ? "bg-[#005baa] text-white"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {status === "completed" ? (
                          <Check className="size-3.5 stroke-[3]" />
                        ) : status === "locked" ? (
                          <LockKeyhole className="size-3.5" />
                        ) : (
                          index + 1
                        )}
                      </span>
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
                  className="flex min-h-10 w-full items-center justify-center gap-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-rose-50 hover:text-rose-700 transition"
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
