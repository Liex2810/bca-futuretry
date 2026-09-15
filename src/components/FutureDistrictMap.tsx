"use client";

import { useEffect, useRef } from "react";
import * as maplibregl from "maplibre-gl";
import type { Checkpoint, CheckpointState } from "@/types";

interface Props {
  checkpoints: Checkpoint[];
  stateOf: (id: string) => CheckpointState;
  onSelect: (checkpoint: Checkpoint) => void;
}

const projectY = (y: number) => (y - 50) * 0.6;
const toLngLat = (cp: Checkpoint): [number, number] => [cp.x, projectY(100 - cp.y)];
const projectCoordinates = (value: unknown): unknown => {
  if (Array.isArray(value) && typeof value[0] === "number") return [value[0], projectY(value[1] as number)];
  if (Array.isArray(value)) return value.map(projectCoordinates);
  return value;
};
const feature = (geometry: GeoJSON.Geometry, properties: GeoJSON.GeoJsonProperties = {}): GeoJSON.Feature => {
  const projected = "coordinates" in geometry
    ? { ...geometry, coordinates: projectCoordinates(geometry.coordinates) }
    : geometry;
  return { type: "Feature", geometry: projected as GeoJSON.Geometry, properties };
};

const districtData: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: [
    feature({ type: "Polygon", coordinates: [[[5,28],[9,86],[46,88],[48,32],[34,19],[5,28]]] }, { fill: "#d9f1e5" }),
    feature({ type: "Polygon", coordinates: [[[52,32],[54,88],[92,86],[96,28],[67,19],[52,32]]] }, { fill: "#dbeef8" }),
    feature({ type: "Polygon", coordinates: [[[0,0],[0,18],[18,23],[37,15],[51,22],[70,13],[84,21],[100,16],[100,0],[0,0]]] }, { fill: "#74c4d2" }),
  ],
};

const districtSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="760" viewBox="0 0 1200 760">
<rect width="1200" height="760" fill="#cfe7d8"/><path d="M0 590Q180 520 340 590T680 570T1000 585T1200 550V760H0Z" fill="#74c4d2"/>
<path d="M45 95Q260 30 535 100L565 500Q330 560 70 485Z" fill="#d9f1e5" stroke="#7cbba2" stroke-width="5"/><path d="M645 95Q925 35 1150 115L1125 490Q860 555 620 490Z" fill="#dbeef8" stroke="#78aac8" stroke-width="5"/>
<g fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M600 615Q480 530 330 470T230 250M600 615Q720 530 870 470T970 250M330 470Q460 400 600 410T870 470M600 615Q350 600 130 625M600 615Q850 600 1070 625" stroke="#82999e" stroke-width="42"/><path d="M600 615Q480 530 330 470T230 250M600 615Q720 530 870 470T970 250M330 470Q460 400 600 410T870 470M600 615Q350 600 130 625M600 615Q850 600 1070 625" stroke="#fbf6e9" stroke-width="31"/><path d="M600 615Q480 530 330 470T230 250M600 615Q720 530 870 470T970 250M330 470Q460 400 600 410T870 470" stroke="#d4c59a" stroke-width="3" stroke-dasharray="14 15"/></g>
<g stroke="#53788a" stroke-width="4"><path d="M120 150h150v100H120z" fill="#9ddfe4"/><path d="M330 125h145v110H330z" fill="#83cbd6"/><path d="M105 330h145v100H105z" fill="#fff"/><path d="M355 300h150v105H355z" fill="#b9e9e4"/><path d="M720 135h150v105H720z" fill="#8ebbd8"/><path d="M930 150h150v105H930z" fill="#a6cee4"/><path d="M700 315h150v100H700z" fill="#fff"/><path d="M950 325h145v105H950z" fill="#bad7e8"/></g>
<g fill="#3c936e"><circle cx="550" cy="180" r="28"/><circle cx="590" cy="220" r="22"/><circle cx="560" cy="300" r="25"/><circle cx="80" cy="280" r="24"/><circle cx="1120" cy="290" r="28"/></g>
<text x="285" y="70" text-anchor="middle" font-family="Arial" font-weight="700" font-size="28" fill="#063b66">PPTI TECH PARK</text><text x="910" y="70" text-anchor="middle" font-family="Arial" font-weight="700" font-size="28" fill="#063b66">PPBP BUSINESS PARK</text></svg>`;
const districtImage = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(districtSvg)}`;

const roads: [number, number][][] = [
  [[50,21],[43,27],[35,33],[27,33],[25,42],[27,51],[27,69]],
  [[50,21],[57,27],[65,33],[73,33],[75,42],[73,51],[73,69]],
  [[50,21],[35,19],[20,22],[12,23]],
  [[50,21],[65,19],[80,22],[88,23]],
  [[13,57],[27,51],[42,46],[58,46],[73,51],[88,57]],
];

const roadData: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: roads.map((coordinates, index) => feature({ type: "LineString", coordinates }, { index })),
};

const buildings: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: [
    [12,73,23,84],[30,72,41,84],[13,47,23,57],[31,45,42,57],
    [59,72,70,84],[77,72,88,84],[58,45,69,57],[76,46,88,58],
    [42,24,58,36],[5,12,18,22],[82,12,95,22],
  ].map(([x1,y1,x2,y2], index) => feature({ type: "Polygon", coordinates: [[[x1,y1],[x2,y1],[x2,y2],[x1,y2],[x1,y1]]] }, { index })),
};

export function FutureDistrictMap({ checkpoints, stateOf, onSelect }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const selectRef = useRef(onSelect);
  const stateRef = useRef(stateOf);
  selectRef.current = onSelect;
  stateRef.current = stateOf;
  const stateKey = checkpoints.map((cp) => `${cp.id}:${stateOf(cp.id)}`).join("|");

  useEffect(() => {
    if (!containerRef.current) return;
    let disposed = false;
    let map: maplibregl.Map | undefined;
    const markers: maplibregl.Marker[] = [];

    {
      if (!containerRef.current) return;
      const mapInstance = new maplibregl.Map({
        container: containerRef.current,
        style: { version: 8, sources: {}, layers: [{ id: "background", type: "background", paint: { "background-color": "#cfe7d8" } }] },
        center: [50, 0], zoom: 2.45, minZoom: 1.8, maxZoom: 5,
        maxBounds: [[-8,-38],[108,38]], attributionControl: false,
        dragRotate: false, pitchWithRotate: false,
      });
      map = mapInstance;
      mapInstance.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
      mapInstance.on("load", () => {
        if (!map) return;
        const image = new Image();
        image.onload = () => {
          if (!map || disposed) return;
          const canvas = document.createElement("canvas");
          canvas.width = 1200; canvas.height = 760;
          canvas.getContext("2d")?.drawImage(image, 0, 0);
          map.addSource("district-art", { type: "image", url: canvas.toDataURL("image/png"), coordinates: [[0,30],[100,30],[100,-30],[0,-30]] });
          map.addLayer({ id: "district-art", type: "raster", source: "district-art", paint: { "raster-opacity": 1 } });
        };
        image.src = districtImage;
        map.addSource("districts", { type: "geojson", data: districtData });
        map.addLayer({ id: "districts", type: "fill", source: "districts", paint: { "fill-color": ["get","fill"], "fill-outline-color": "#74a899" } });
        map.addSource("roads", { type: "geojson", data: roadData });
        map.addLayer({ id: "road-border", type: "line", source: "roads", layout: { "line-cap": "round", "line-join": "round" }, paint: { "line-color": "#8fa3a3", "line-width": 17 } });
        map.addLayer({ id: "road", type: "line", source: "roads", layout: { "line-cap": "round", "line-join": "round" }, paint: { "line-color": "#faf6e9", "line-width": 13 } });
        map.addLayer({ id: "road-center", type: "line", source: "roads", paint: { "line-color": "#d6cba9", "line-width": 1.5, "line-dasharray": [3,4] } });
        map.addSource("buildings", { type: "geojson", data: buildings });
        map.addLayer({ id: "building-shadow", type: "fill", source: "buildings", paint: { "fill-color": "#496b7b", "fill-translate": [3,4], "fill-opacity": .25 } });
        map.addLayer({ id: "buildings", type: "fill", source: "buildings", paint: { "fill-color": ["case", ["<", ["get","index"], 4], "#9ddfe4", ["<", ["get","index"], 8], "#8ebbd8", "#ffffff"], "fill-outline-color": "#53788a" } });

        checkpoints.forEach((cp) => {
          const state = stateRef.current(cp.id);
          const el = document.createElement("button");
          el.type = "button";
          el.className = `future-map-marker future-map-marker--${state}`;
          el.disabled = state === "locked";
          el.setAttribute("aria-label", `${cp.label}, ${state === "completed" ? "selesai" : state === "locked" ? "terkunci" : "bisa dimulai"}`);
          el.innerHTML = `<span class="future-map-pin">${state === "locked" ? "<svg viewBox='0 0 24 24' aria-hidden='true'><rect x='5' y='10' width='14' height='10' rx='2'/><path d='M8 10V7a4 4 0 0 1 8 0v3'/></svg>" : state === "completed" ? "<svg viewBox='0 0 24 24' aria-hidden='true'><path d='m5 12 4 4L19 6'/></svg>" : "<svg viewBox='0 0 24 24' aria-hidden='true'><path d='m9 6 8 6-8 6Z'/></svg>"}</span><span class="future-map-label">${cp.label}</span>`;
          el.addEventListener("click", () => selectRef.current(cp));
          markers.push(new maplibregl.Marker({ element: el, anchor: "bottom" }).setLngLat(toLngLat(cp)).addTo(map!));
        });
      });
    }
    return () => { disposed = true; markers.forEach(marker => marker.remove()); map?.remove(); };
  }, [checkpoints, stateKey]);

  return <div ref={containerRef} className="future-map-canvas" data-testid="future-map" />;
}
