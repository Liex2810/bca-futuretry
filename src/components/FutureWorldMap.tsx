"use client";

import { useEffect, useRef, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { useJourney } from "@/components/JourneyProvider";

type Coordinates = [number, number];
type MarkerStatus = "available" | "completed" | "locked";

interface MapLocation {
  id: string;
  name: string;
  area: string;
  coordinates: Coordinates;
  missionId?: string;
  program?: "PPTI" | "PPBP";
  isStart?: boolean;
}

interface LeafletMap {
  fitBounds: (bounds: unknown, options?: { padding?: [number, number]; maxZoom?: number }) => void;
  remove: () => void;
}

interface LeafletLayer {
  addTo: (map: LeafletMap) => LeafletLayer;
  bindPopup: (content: string, options?: { maxWidth?: number }) => LeafletLayer;
  on: (event: string, handler: () => void) => LeafletLayer;
}

interface LeafletApi {
  map: (element: HTMLElement, options?: { zoomControl?: boolean; scrollWheelZoom?: boolean }) => LeafletMap;
  tileLayer: (url: string, options: { attribution: string; maxZoom: number }) => LeafletLayer;
  divIcon: (options: { className: string; html: string; iconSize: [number, number]; iconAnchor: [number, number]; popupAnchor: [number, number] }) => unknown;
  marker: (coordinates: Coordinates, options: { icon: unknown; title: string; zIndexOffset?: number }) => LeafletLayer;
  polyline: (coordinates: Coordinates[], options: { color: string; weight: number; opacity: number; dashArray?: string }) => LeafletLayer;
  latLngBounds: (coordinates: Coordinates[]) => unknown;
}

declare global {
  interface Window { L?: LeafletApi; }
}

const locations: MapLocation[] = [
  { id: "cp-characters", name: "BCA Learning Institute", area: "Sentul City, Bogor", coordinates: [-6.5857007, 106.8822386], isStart: true },
  { id: "cp-customer", name: "Customer Hall", area: "SCBD, Jakarta Selatan", coordinates: [-6.2259, 106.8095], missionId: "m-customer", program: "PPBP" },
  { id: "cp-anomaly", name: "Security Operations", area: "Kuningan, Jakarta Selatan", coordinates: [-6.2185, 106.8303], missionId: "m-anomaly", program: "PPTI" },
  { id: "cp-data", name: "Data Lab", area: "Thamrin, Jakarta Pusat", coordinates: [-6.1967024, 106.8224593], missionId: "m-dashboard", program: "PPTI" },
  { id: "cp-strategy", name: "Strategy Room", area: "Cikini, Jakarta Pusat", coordinates: [-6.1901, 106.8394], missionId: "m-bizcase", program: "PPBP" },
  { id: "cp-ux", name: "Design Studio", area: "Senayan, Jakarta Pusat", coordinates: [-6.2186, 106.8025], missionId: "m-uxfix", program: "PPTI" },
  { id: "cp-invest", name: "Investment Desk", area: "Kota Tua, Jakarta Barat", coordinates: [-6.1352, 106.8133], missionId: "m-invest", program: "PPBP" },
];

const loadLeaflet = () => new Promise<LeafletApi>((resolve, reject) => {
  if (window.L) return resolve(window.L);

  if (!document.querySelector('link[data-leaflet="true"]')) {
    const stylesheet = document.createElement("link");
    stylesheet.rel = "stylesheet";
    stylesheet.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    stylesheet.dataset.leaflet = "true";
    document.head.appendChild(stylesheet);
  }

  const existing = document.querySelector<HTMLScriptElement>('script[data-leaflet="true"]');
  const script = existing ?? document.createElement("script");
  script.addEventListener("load", () => window.L ? resolve(window.L) : reject(new Error("Leaflet tidak tersedia")), { once: true });
  script.addEventListener("error", () => reject(new Error("Gagal memuat Leaflet")), { once: true });
  if (!existing) {
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.dataset.leaflet = "true";
    document.body.appendChild(script);
  }
});

function markerHtml(location: MapLocation, index: number, status: MarkerStatus) {
  const image = location.isStart
    ? "/main-logo-white.svg"
    : location.program === "PPTI"
      ? "/character-ppti.png"
      : "/character-ppbp.png";
  const badge = status === "locked" ? "&#128274;" : status === "completed" ? "&#10003;" : String(index);

  return `<div class="map-mission-marker is-${status}${location.isStart ? " is-start" : ""}">
    <span class="map-marker-pulse"></span>
    <span class="map-marker-art"><img src="${image}" alt="" /></span>
    <span class="map-marker-badge">${badge}</span>
  </div>`;
}

export function FutureWorldMap() {
  const mapElementRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { stateOf } = useJourney();

  useEffect(() => {
    let cancelled = false;
    loadLeaflet().then((leaflet) => {
      if (cancelled || !mapElementRef.current) return;
      mapInstanceRef.current?.remove();
      const map = leaflet.map(mapElementRef.current, { zoomControl: true, scrollWheelZoom: true });
      mapInstanceRef.current = map;

      leaflet.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}", {
        attribution: "Tiles &copy; Esri",
        maxZoom: 16,
      }).addTo(map);

      const route = locations.map((location) => location.coordinates);
      leaflet.polyline(route, { color: "#ffffff", weight: 7, opacity: 0.9 }).addTo(map);
      leaflet.polyline(route, { color: "#0066ae", weight: 4, opacity: 0.85, dashArray: "9 10" }).addTo(map);

      locations.forEach((location, index) => {
        const checkpointStatus = stateOf(location.id);
        const status: MarkerStatus = location.isStart || checkpointStatus === "current" ? "available" : checkpointStatus;
        const icon = leaflet.divIcon({ className: "", html: markerHtml(location, index, status), iconSize: [72, 82], iconAnchor: [36, 70], popupAnchor: [0, -58] });
        const marker = leaflet.marker(location.coordinates, { icon, title: location.name, zIndexOffset: location.isStart ? 1000 : 0 }).addTo(map);

        if (location.missionId && status !== "locked") {
          marker.on("click", () => window.location.assign(`/mission/${location.missionId}`));
        } else if (location.isStart) {
          marker.bindPopup(`<strong>${location.name}</strong><br />${location.area}`, { maxWidth: 240 });
        }
      });

      map.fitBounds(leaflet.latLngBounds(route), { padding: [45, 45], maxZoom: 11 });
      setLoading(false);
    }).catch(() => {
      if (!cancelled) {
        setError("Peta gagal dimuat. Periksa koneksi internet lalu muat ulang halaman.");
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
      mapInstanceRef.current?.remove();
      mapInstanceRef.current = null;
    };
  }, [stateOf]);

  return (
    <main className="grid min-h-[calc(100vh-68px)] place-items-center bg-[#f4f6f8] p-4 sm:p-8">
      <section className="w-full max-w-6xl overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_20px_55px_rgba(15,23,42,0.12)] sm:rounded-3xl sm:p-3">
          <div className="relative h-[70vh] min-h-[480px] max-h-[720px] overflow-hidden rounded-xl bg-slate-100 sm:rounded-2xl">
            <div ref={mapElementRef} className="absolute inset-0 z-0" aria-label="Peta checkpoint dari BCA Learning Institute menuju Jakarta" />
            {loading && <div className="absolute inset-0 z-20 grid place-items-center bg-slate-100"><LoaderCircle size={22} className="animate-spin text-[#0066ae]" /></div>}
            {error && <div className="absolute inset-0 z-20 grid place-items-center bg-slate-100 p-6 text-center text-sm text-slate-600">{error}</div>}
          </div>
      </section>
      <style jsx global>{`
        .map-mission-marker {
          position: relative;
          width: 72px;
          height: 82px;
          cursor: pointer;
        }
        .map-marker-art {
          position: absolute;
          left: 6px;
          top: 0;
          display: grid;
          width: 60px;
          height: 60px;
          place-items: center;
          overflow: hidden;
          border: 3px solid white;
          border-radius: 20px;
          background: linear-gradient(145deg, #ffffff, #dff5ff);
          box-shadow: 0 10px 24px rgba(15, 48, 77, 0.28);
          transition: transform 220ms ease, box-shadow 220ms ease;
        }
        .map-marker-art::after {
          position: absolute;
          bottom: -7px;
          left: 22px;
          width: 14px;
          height: 14px;
          content: "";
          transform: rotate(45deg);
          background: inherit;
        }
        .map-marker-art img {
          width: 54px;
          height: 54px;
          object-fit: contain;
          object-position: center top;
          transform: translateY(5px) scale(1.2);
        }
        .map-marker-badge {
          position: absolute;
          right: 0;
          top: -7px;
          z-index: 2;
          display: grid;
          width: 25px;
          height: 25px;
          place-items: center;
          border: 2px solid white;
          border-radius: 999px;
          background: #0066ae;
          color: white;
          font: 700 11px Arial, sans-serif;
          box-shadow: 0 4px 10px rgba(15, 48, 77, 0.25);
        }
        .map-marker-pulse {
          position: absolute;
          left: 8px;
          top: 2px;
          width: 56px;
          height: 56px;
          border: 2px solid #00a9d6;
          border-radius: 22px;
          animation: map-marker-pulse 1.8s ease-out infinite;
        }
        .map-mission-marker:hover .map-marker-art {
          transform: translateY(-5px) scale(1.06);
          box-shadow: 0 16px 30px rgba(0, 102, 174, 0.35);
        }
        .map-mission-marker.is-completed .map-marker-badge {
          background: #16815d;
        }
        .map-mission-marker.is-completed .map-marker-art {
          border-color: #6ee7b7;
        }
        .map-mission-marker.is-locked {
          cursor: not-allowed;
        }
        .map-mission-marker.is-locked .map-marker-art {
          filter: grayscale(1);
          opacity: 0.72;
        }
        .map-mission-marker.is-locked .map-marker-badge {
          background: #64748b;
          font-size: 12px;
        }
        .map-mission-marker.is-locked .map-marker-pulse,
        .map-mission-marker.is-completed .map-marker-pulse {
          display: none;
        }
        .map-mission-marker.is-start .map-marker-art {
          border-radius: 999px;
          background: #0066ae;
        }
        .map-mission-marker.is-start .map-marker-art img {
          width: 43px;
          height: 43px;
          transform: none;
        }
        @keyframes map-marker-pulse {
          0% { opacity: 0.75; transform: scale(0.9); }
          75%, 100% { opacity: 0; transform: scale(1.45); }
        }
        @media (prefers-reduced-motion: reduce) {
          .map-marker-pulse { animation: none; }
          .map-marker-art { transition: none; }
        }
      `}</style>
    </main>
  );
}
