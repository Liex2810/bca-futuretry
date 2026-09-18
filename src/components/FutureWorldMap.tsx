"use client";

import "leaflet/dist/leaflet.css";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Map as LeafletMap, Marker } from "leaflet";
import { Check, ChevronRight, LoaderCircle, LockKeyhole, RotateCcw } from "lucide-react";
import { useJourney } from "./JourneyProvider";
import { progressSummary } from "@/lib/progress";

type MarkerStatus = "available" | "locked" | "completed";
type Coordinates = [number, number];
interface MapLocation { id: string; name: string; area: string; coordinates: Coordinates; displayCoordinates: Coordinates; missionId?: string; program?: "PPTI" | "PPBP"; isStart?: boolean }

const locations: MapLocation[] = [
  { id: "cp-characters", name: "BCA Learning Institute", area: "Sentul City, Bogor", coordinates: [-6.5857007, 106.8822386], displayCoordinates: [-6.5857007, 106.8822386], isStart: true },
  { id: "cp-data", name: "Data Lab", area: "Cibitung, Bekasi", coordinates: [-6.2618245, 107.0837982], displayCoordinates: [-6.2618245, 107.0837982], missionId: "m-dashboard", program: "PPTI" },
  { id: "cp-anomaly", name: "Security Operations", area: "Grand Indonesia, Jakarta Pusat", coordinates: [-6.1957601, 106.8214547], displayCoordinates: [-6.1957601, 106.8214547], missionId: "m-anomaly", program: "PPTI" },
  { id: "cp-ux", name: "Design Studio", area: "Landmark Pluit, Jakarta Utara", coordinates: [-6.1244714, 106.7995216], displayCoordinates: [-6.1244714, 106.7995216], missionId: "m-uxfix", program: "PPTI" },
  { id: "cp-strategy", name: "Strategy Room", area: "Foresta, Tangerang Selatan", coordinates: [-6.2882326, 106.6437145], displayCoordinates: [-6.2882326, 106.6437145], missionId: "m-bizcase", program: "PPBP" },
  { id: "cp-invest", name: "Investment Desk", area: "Wisma Asia, Jakarta Barat", coordinates: [-6.1891943, 106.7977565], displayCoordinates: [-6.1891943, 106.7977565], missionId: "m-invest", program: "PPBP" },
];

function markerArtwork(location: MapLocation) {
  if (location.isStart) return '<img src="/bca-logo.svg" alt="" />';

  const icons: Record<string, string> = {
    "cp-data": '<svg viewBox="0 0 32 32" aria-hidden="true"><ellipse cx="16" cy="8" rx="9" ry="4"/><path d="M7 8v8c0 2.2 4 4 9 4s9-1.8 9-4V8M7 16v8c0 2.2 4 4 9 4s9-1.8 9-4v-8"/></svg>',
    "cp-anomaly": '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M6 13h20M10 13l3-7h6l3 7"/><path d="M9 18c0 5 3 9 7 9s7-4 7-9"/><circle cx="13" cy="19" r="1.5"/><circle cx="19" cy="19" r="1.5"/><path d="M14 24h4"/></svg>',
    "cp-ux": '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="m20 5 7 7-12 12-7 2 2-7L20 5Z"/><path d="m17 8 7 7M8 26c-2 0-3-1-3-3 0-1.8-1-2.8-2-3"/></svg>',
    "cp-strategy": '<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="15" cy="17" r="10"/><circle cx="15" cy="17" r="5"/><circle cx="15" cy="17" r="1.5"/><path d="m18 14 9-9M21 5h6v6"/></svg>',
    "cp-invest": '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M5 27V7M5 27h23"/><path d="m8 22 6-7 5 4 8-10"/><path d="M21 9h6v6"/></svg>',
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
  const statuses = useMemo(() => locations.map((location) => ({ location, status: (location.isStart || stateOf(location.id) === "current" ? "available" : stateOf(location.id)) as MarkerStatus })), [stateOf]);

  useEffect(() => {
    let cancelled = false;
    const markers = markerRefs.current;
    import("leaflet").then((leaflet) => {
      if (cancelled || !mapElementRef.current) return;
      mapInstanceRef.current?.remove(); markers.clear();
      const map = leaflet.map(mapElementRef.current, { zoomControl: true, scrollWheelZoom: false });
      mapInstanceRef.current = map;
      leaflet.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}", { attribution: "Tiles &copy; Esri", maxZoom: 16 }).addTo(map);
      const start = locations[0].displayCoordinates;
      const routes = [
        { program: "PPTI", color: "#00a9d6", points: [start, ...locations.filter((location) => location.program === "PPTI").map((location) => location.displayCoordinates)] },
        { program: "PPBP", color: "#00528c", points: [start, ...locations.filter((location) => location.program === "PPBP").map((location) => location.displayCoordinates)] },
      ];
      routes.forEach((route) => {
        leaflet.polyline(route.points, { color: "#fff", weight: 8, opacity: 0.95 }).addTo(map);
        leaflet.polyline(route.points, { color: route.color, weight: 5, opacity: 0.95, dashArray: "9 9" }).addTo(map);
      });
      statuses.forEach(({ location, status }) => {
        const branchIndex = location.isStart ? 0 : locations.filter((item) => item.program === location.program).findIndex((item) => item.id === location.id) + 1;
        const icon = leaflet.divIcon({ className: "", html: markerHtml(location, branchIndex, status), iconSize: [56, 56], iconAnchor: [28, 48] });
        const marker = leaflet.marker(location.displayCoordinates, { icon, title: `${location.name} — ${status}`, zIndexOffset: location.isStart ? 1000 : 0 }).addTo(map);
        marker.on("click", () => setSelectedId(location.id)); markers.set(location.id, marker);
      });
      const bounds = locations.map((location) => location.coordinates);
      map.fitBounds(leaflet.latLngBounds(bounds), { padding: [45, 45], maxZoom: 11 });
      setLoading(false);
    }).catch(() => { if (!cancelled) { setError("Peta gagal dimuat. Coba muat ulang halaman."); setLoading(false); } });
    return () => { cancelled = true; mapInstanceRef.current?.remove(); mapInstanceRef.current = null; markers.clear(); };
  }, [statuses]);

  const selectMission = (id: string) => { setSelectedId(id); const marker = markerRefs.current.get(id); if (marker && mapInstanceRef.current) mapInstanceRef.current.panTo(marker.getLatLng()); };

  return (
    <main className="min-h-[calc(100vh-68px)] bg-[#f4f6f8] px-4 py-6 sm:px-8 sm:py-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="text-sm font-bold uppercase tracking-[0.18em] text-[#0066ae]">Eksplorasi Misi</p><h1 className="mt-1 text-3xl font-extrabold text-[#063b66] sm:text-4xl">Peta Misi FutureTry</h1><p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">Mulai dari BCA Learning Institute, lalu jelajahi cabang PPTI atau PPBP. Selesaikan checkpoint secara berurutan pada masing-masing jalur.</p></div>
          <div className="min-w-52 rounded-2xl border border-slate-200 bg-white p-4"><div className="flex justify-between text-sm font-bold text-[#063b66]"><span>Progress</span><span>{summary.done}/{summary.total}</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-[#0066ae] transition-all" style={{ width: `${summary.percent}%` }} /></div></div>
        </header>
        <div className="mb-4 flex flex-wrap gap-2 text-xs font-semibold text-slate-600" aria-label="Legenda jalur dan status checkpoint"><span className="rounded-full bg-cyan-50 px-3 py-2 text-[#008caf]">PPTI</span><span className="rounded-full bg-sky-50 px-3 py-2 text-[#00528c]">PPBP</span><span className="rounded-full bg-sky-50 px-3 py-2 text-[#0066ae]">● Tersedia</span><span className="rounded-full bg-emerald-50 px-3 py-2 text-emerald-700">✓ Selesai</span><span className="rounded-full bg-slate-200 px-3 py-2">● Terkunci</span></div>
        <section className="grid overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_55px_rgba(15,23,42,0.10)] lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="relative h-[55vh] min-h-[440px] bg-slate-100 lg:h-[680px]"><div ref={mapElementRef} className="absolute inset-0 z-0" aria-label="Peta dua cabang perjalanan PPTI dan PPBP dari BCA Learning Institute" />{loading && <div className="absolute inset-0 z-20 grid place-items-center bg-slate-100"><LoaderCircle className="animate-spin text-[#0066ae]" /></div>}{error && <div className="absolute inset-0 z-20 grid place-items-center p-6 text-center text-sm text-slate-600">{error}</div>}</div>
          <aside className="border-t border-slate-200 lg:border-l lg:border-t-0" aria-label="Daftar checkpoint">
            <div className="border-b border-slate-200 p-5"><p className="text-xs font-bold uppercase tracking-wider text-[#0066ae]">Checkpoint dipilih</p><h2 className="mt-1 text-xl font-extrabold text-[#063b66]">{selected.name}</h2><p className="mt-1 text-sm text-slate-500">{selected.area}</p>{selected.isStart ? <p className="mt-4 rounded-xl bg-sky-50 p-3 text-sm text-[#063b66]">Titik awal perjalanan FutureTry.</p> : selectedStatus === "locked" ? <p className="mt-4 flex gap-2 rounded-xl bg-slate-100 p-3 text-sm text-slate-600"><LockKeyhole className="mt-0.5 size-4 shrink-0" />Selesaikan checkpoint sebelumnya pada jalur {selected.program}.</p> : <Link href={`/mission/${selected.missionId}`} className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[#0066ae] px-5 py-3 text-sm font-bold text-white hover:bg-[#063b66]">{selectedStatus === "completed" ? "Lihat kembali misi" : "Mulai misi"}<ChevronRight className="size-4" /></Link>}</div>
            <div className="p-3">{statuses.slice(1).map(({ location, status }, index) => <button key={location.id} type="button" onClick={() => selectMission(location.id)} className={`mb-2 flex min-h-14 w-full items-center gap-3 rounded-xl border p-3 text-left transition ${selectedId === location.id ? status === "locked" ? "border-slate-300 bg-slate-100" : "border-[#0066ae] bg-sky-50" : "border-transparent hover:bg-slate-50"}`} aria-label={`${location.name}, ${status === "locked" ? "terkunci" : status === "completed" ? "selesai" : "tersedia"}`}><span className={`grid size-9 shrink-0 place-items-center rounded-full font-bold ${status === "completed" ? "bg-emerald-100 text-emerald-700" : status === "locked" ? "bg-slate-200 text-slate-500" : "bg-[#0066ae] text-white"}`}>{status === "completed" ? <Check className="size-4" /> : status === "locked" ? <LockKeyhole className="size-4" /> : index + 1}</span><span className="min-w-0"><span className="block truncate text-sm font-bold text-[#063b66]">{location.name}</span><span className="text-xs text-slate-500">{location.program} · {location.area}</span></span></button>)}</div>
            {summary.done > 0 && <div className="border-t border-slate-200 p-4"><button type="button" onClick={() => confirm("Reset seluruh progres misi dan refleksi simulasi?") && reset()} className="flex min-h-11 w-full items-center justify-center gap-2 rounded-full text-sm font-semibold text-slate-500 hover:bg-rose-50 hover:text-rose-700"><RotateCcw className="size-4" />Reset progress</button></div>}
          </aside>
        </section>
      </div>
      <style jsx global>{`.leaflet-control-zoom a{width:44px!important;height:44px!important;line-height:44px!important;font-size:22px!important}.map-mission-marker{position:relative;width:56px;height:56px;cursor:pointer}.map-marker-art{position:absolute;left:4px;top:0;display:grid;width:48px;height:48px;place-items:center;overflow:hidden;border:3px solid white;border-radius:16px;background:#e8f7ff;color:#0066ae;box-shadow:0 8px 20px rgba(15,48,77,.25)}.map-marker-art svg{width:30px;height:30px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}.is-ppti .map-marker-art{background:#e5faff;color:#008caf}.is-ppbp .map-marker-art{background:#e8f2fb;color:#00528c}.map-marker-badge{position:absolute;right:0;top:-5px;z-index:2;display:grid;width:24px;height:24px;place-items:center;border:2px solid white;border-radius:99px;background:#0066ae;color:white;font:700 11px Arial}.map-marker-pulse{position:absolute;left:7px;top:2px;width:50px;height:50px;border:2px solid #00a9d6;border-radius:20px;animation:map-marker-pulse 1.8s ease-out infinite}.is-completed .map-marker-badge{background:#16815d}.is-locked .map-marker-art{filter:grayscale(1);opacity:.68}.is-locked .map-marker-badge{background:#64748b}.is-locked .map-marker-pulse,.is-completed .map-marker-pulse{display:none}.is-start .map-marker-art{border-radius:99px;background:white}.is-start .map-marker-art img{width:38px;height:auto;object-fit:contain}@keyframes map-marker-pulse{0%{opacity:.75;transform:scale(.9)}100%{opacity:0;transform:scale(1.4)}}@media(prefers-reduced-motion:reduce){.map-marker-pulse{animation:none}}`}</style>
    </main>
  );
}
