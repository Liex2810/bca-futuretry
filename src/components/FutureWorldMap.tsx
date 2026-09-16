"use client";

import "leaflet/dist/leaflet.css";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Map as LeafletMap, Marker } from "leaflet";
import { Check, ChevronRight, LoaderCircle, LockKeyhole, MapPinned, RotateCcw } from "lucide-react";
import { useJourney } from "./JourneyProvider";
import { progressSummary } from "@/lib/progress";

type MarkerStatus = "available" | "locked" | "completed";
type Coordinates = [number, number];
interface MapLocation { id: string; name: string; area: string; coordinates: Coordinates; displayCoordinates: Coordinates; missionId?: string; program?: "PPTI" | "PPBP"; isStart?: boolean }

const locations: MapLocation[] = [
  { id: "cp-characters", name: "BCA Learning Institute", area: "Sentul City, Bogor", coordinates: [-6.5857, 106.8822], displayCoordinates: [-6.5857, 106.8822], isStart: true },
  { id: "cp-customer", name: "Customer Hall", area: "SCBD, Jakarta Selatan", coordinates: [-6.2259, 106.8095], displayCoordinates: [-6.505, 106.81], missionId: "m-customer", program: "PPBP" },
  { id: "cp-anomaly", name: "Security Operations", area: "Kuningan, Jakarta Selatan", coordinates: [-6.2185, 106.8303], displayCoordinates: [-6.44, 106.9], missionId: "m-anomaly", program: "PPTI" },
  { id: "cp-data", name: "Data Lab", area: "Thamrin, Jakarta Pusat", coordinates: [-6.1967, 106.8225], displayCoordinates: [-6.37, 106.81], missionId: "m-dashboard", program: "PPTI" },
  { id: "cp-strategy", name: "Strategy Room", area: "Cikini, Jakarta Pusat", coordinates: [-6.1901, 106.8394], displayCoordinates: [-6.3, 106.9], missionId: "m-bizcase", program: "PPBP" },
  { id: "cp-ux", name: "Design Studio", area: "Senayan, Jakarta Pusat", coordinates: [-6.2186, 106.8025], displayCoordinates: [-6.23, 106.81], missionId: "m-uxfix", program: "PPTI" },
  { id: "cp-invest", name: "Investment Desk", area: "Kota Tua, Jakarta Barat", coordinates: [-6.1352, 106.8133], displayCoordinates: [-6.15, 106.89], missionId: "m-invest", program: "PPBP" },
];

function markerHtml(location: MapLocation, index: number, status: MarkerStatus) {
  const image = location.isStart ? "/main-logo-white.svg" : location.program === "PPTI" ? "/character-ppti.png" : "/character-ppbp.png";
  const badge = status === "locked" ? "•" : status === "completed" ? "✓" : String(index);
  return `<div class="map-mission-marker is-${status}${location.isStart ? " is-start" : ""}" aria-hidden="true"><span class="map-marker-pulse"></span><span class="map-marker-art"><img src="${image}" alt="" /></span><span class="map-marker-badge">${badge}</span></div>`;
}

export function FutureWorldMap() {
  const mapElementRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const markerRefs = useRef(new Map<string, Marker>());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState("cp-customer");
  const { stateOf, progress, reset } = useJourney();
  const summary = progressSummary(progress);
  const selected = locations.find((item) => item.id === selectedId) ?? locations[1];
  const selectedState = stateOf(selected.id);
  const selectedStatus: MarkerStatus = selected.isStart || selectedState === "current" ? "available" : selectedState;
  const statuses = useMemo(() => locations.map((location) => ({ location, status: (location.isStart || stateOf(location.id) === "current" ? "available" : stateOf(location.id)) as MarkerStatus })), [stateOf]);

  useEffect(() => {
    let cancelled = false;
    import("leaflet").then((leaflet) => {
      if (cancelled || !mapElementRef.current) return;
      mapInstanceRef.current?.remove(); markerRefs.current.clear();
      const map = leaflet.map(mapElementRef.current, { zoomControl: true, scrollWheelZoom: false });
      mapInstanceRef.current = map;
      leaflet.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}", { attribution: "Tiles &copy; Esri", maxZoom: 16 }).addTo(map);
      const route = locations.map((location) => location.displayCoordinates);
      leaflet.polyline(route, { color: "#fff", weight: 7, opacity: 0.9 }).addTo(map);
      leaflet.polyline(route, { color: "#00528c", weight: 5, opacity: 0.95, dashArray: "9 9" }).addTo(map);
      locations.slice(1).forEach((location) => leaflet.polyline([location.coordinates, location.displayCoordinates], { color: "#7c9db5", weight: 1, opacity: 0.55, dashArray: "3 5" }).addTo(map));
      statuses.forEach(({ location, status }, index) => {
        const icon = leaflet.divIcon({ className: "", html: markerHtml(location, index, status), iconSize: [56, 56], iconAnchor: [28, 48] });
        const marker = leaflet.marker(location.displayCoordinates, { icon, title: `${location.name} — ${status}`, zIndexOffset: location.isStart ? 1000 : 0 }).addTo(map);
        marker.on("click", () => setSelectedId(location.id)); markerRefs.current.set(location.id, marker);
      });
      map.fitBounds(leaflet.latLngBounds(route), { padding: [45, 45], maxZoom: 11 });
      setLoading(false);
    }).catch(() => { if (!cancelled) { setError("Peta gagal dimuat. Coba muat ulang halaman."); setLoading(false); } });
    return () => { cancelled = true; mapInstanceRef.current?.remove(); mapInstanceRef.current = null; markerRefs.current.clear(); };
  }, [statuses]);

  const selectMission = (id: string) => { setSelectedId(id); const marker = markerRefs.current.get(id); if (marker && mapInstanceRef.current) mapInstanceRef.current.panTo(marker.getLatLng()); };

  return (
    <main className="min-h-[calc(100vh-68px)] bg-[#f4f6f8] px-4 py-6 sm:px-8 sm:py-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="text-sm font-bold uppercase tracking-[0.18em] text-[#0066ae]">Eksplorasi Misi</p><h1 className="mt-1 text-3xl font-extrabold text-[#063b66] sm:text-4xl">Peta Misi FutureTry</h1><p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">Pilih checkpoint yang tersedia, selesaikan misinya, lalu buka perjalanan berikutnya. Lokasi pada peta digunakan sebagai konteks simulasi.</p></div>
          <div className="min-w-52 rounded-2xl border border-slate-200 bg-white p-4"><div className="flex justify-between text-sm font-bold text-[#063b66]"><span>Progress</span><span>{summary.done}/{summary.total}</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-[#0066ae] transition-all" style={{ width: `${summary.percent}%` }} /></div></div>
        </header>
        <div className="mb-4 flex flex-wrap gap-2 text-xs font-semibold text-slate-600" aria-label="Legenda status checkpoint"><span className="rounded-full bg-sky-50 px-3 py-2 text-[#0066ae]">● Tersedia</span><span className="rounded-full bg-emerald-50 px-3 py-2 text-emerald-700">✓ Selesai</span><span className="rounded-full bg-slate-200 px-3 py-2">● Terkunci</span></div>
        <section className="grid overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_55px_rgba(15,23,42,0.10)] lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="relative h-[55vh] min-h-[440px] bg-slate-100 lg:h-[680px]"><div ref={mapElementRef} className="absolute inset-0 z-0" aria-label="Peta perjalanan misi dari Sentul menuju Jakarta" />{loading && <div className="absolute inset-0 z-20 grid place-items-center bg-slate-100"><LoaderCircle className="animate-spin text-[#0066ae]" /></div>}{error && <div className="absolute inset-0 z-20 grid place-items-center p-6 text-center text-sm text-slate-600">{error}</div>}</div>
          <aside className="border-t border-slate-200 lg:border-l lg:border-t-0" aria-label="Daftar checkpoint">
            <div className="border-b border-slate-200 p-5"><p className="text-xs font-bold uppercase tracking-wider text-[#0066ae]">Checkpoint dipilih</p><h2 className="mt-1 text-xl font-extrabold text-[#063b66]">{selected.name}</h2><p className="mt-1 text-sm text-slate-500">{selected.area}</p>{selected.isStart ? <p className="mt-4 rounded-xl bg-sky-50 p-3 text-sm text-[#063b66]">Titik awal perjalanan FutureTry.</p> : selectedStatus === "locked" ? <p className="mt-4 flex gap-2 rounded-xl bg-slate-100 p-3 text-sm text-slate-600"><LockKeyhole className="mt-0.5 size-4 shrink-0" />Selesaikan checkpoint sebelumnya pada jalur {selected.program}.</p> : <Link href={`/mission/${selected.missionId}`} className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[#0066ae] px-5 py-3 text-sm font-bold text-white hover:bg-[#063b66]">{selectedStatus === "completed" ? "Lihat kembali misi" : "Mulai misi"}<ChevronRight className="size-4" /></Link>}</div>
            <div className="p-3">{statuses.slice(1).map(({ location, status }, index) => <button key={location.id} type="button" onClick={() => selectMission(location.id)} className={`mb-2 flex min-h-14 w-full items-center gap-3 rounded-xl border p-3 text-left transition ${selectedId === location.id ? status === "locked" ? "border-slate-300 bg-slate-100" : "border-[#0066ae] bg-sky-50" : "border-transparent hover:bg-slate-50"}`} aria-label={`${location.name}, ${status === "locked" ? "terkunci" : status === "completed" ? "selesai" : "tersedia"}`}><span className={`grid size-9 shrink-0 place-items-center rounded-full font-bold ${status === "completed" ? "bg-emerald-100 text-emerald-700" : status === "locked" ? "bg-slate-200 text-slate-500" : "bg-[#0066ae] text-white"}`}>{status === "completed" ? <Check className="size-4" /> : status === "locked" ? <LockKeyhole className="size-4" /> : index + 1}</span><span className="min-w-0"><span className="block truncate text-sm font-bold text-[#063b66]">{location.name}</span><span className="text-xs text-slate-500">{location.program} · {location.area}</span></span></button>)}</div>
            {summary.done > 0 && <div className="border-t border-slate-200 p-4"><button type="button" onClick={() => confirm("Reset seluruh progres misi dan refleksi simulasi?") && reset()} className="flex min-h-11 w-full items-center justify-center gap-2 rounded-full text-sm font-semibold text-slate-500 hover:bg-rose-50 hover:text-rose-700"><RotateCcw className="size-4" />Reset progress</button></div>}
          </aside>
        </section>
      </div>
      <style jsx global>{`.leaflet-control-zoom a{width:44px!important;height:44px!important;line-height:44px!important;font-size:22px!important}.map-mission-marker{position:relative;width:56px;height:56px;cursor:pointer}.map-marker-art{position:absolute;left:4px;top:0;display:grid;width:48px;height:48px;place-items:center;overflow:hidden;border:3px solid white;border-radius:16px;background:#e8f7ff;box-shadow:0 8px 20px rgba(15,48,77,.25)}.map-marker-art img{width:44px;height:44px;object-fit:contain;object-position:center top;transform:translateY(4px) scale(1.15)}.map-marker-badge{position:absolute;right:0;top:-5px;z-index:2;display:grid;width:24px;height:24px;place-items:center;border:2px solid white;border-radius:99px;background:#0066ae;color:white;font:700 11px Arial}.map-marker-pulse{position:absolute;left:7px;top:2px;width:50px;height:50px;border:2px solid #00a9d6;border-radius:20px;animation:map-marker-pulse 1.8s ease-out infinite}.is-completed .map-marker-badge{background:#16815d}.is-locked .map-marker-art{filter:grayscale(1);opacity:.68}.is-locked .map-marker-badge{background:#64748b}.is-locked .map-marker-pulse,.is-completed .map-marker-pulse{display:none}.is-start .map-marker-art{border-radius:99px;background:#0066ae}.is-start .map-marker-art img{width:40px;height:40px;transform:none}@keyframes map-marker-pulse{0%{opacity:.75;transform:scale(.9)}100%{opacity:0;transform:scale(1.4)}}@media(prefers-reduced-motion:reduce){.map-marker-pulse{animation:none}}`}</style>
    </main>
  );
}
