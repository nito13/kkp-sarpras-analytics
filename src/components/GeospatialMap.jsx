import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  MapPin, 
  Navigation, 
  School, 
  ExternalLink, 
  Search, 
  Compass, 
  Info, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Locate,
  Globe,
  Map as MapIcon,
  Satellite
} from 'lucide-react';
import { SATDIK_LIST } from '../data/kkpData';

// Peta Base Tile Providers (Semua peta asli beresolusi tinggi & gratis diakses)
const TILE_LAYERS = {
  osm: {
    name: 'Peta Standar (OSM)',
    icon: MapIcon,
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> kontributor',
    maxZoom: 19
  },
  satellite: {
    name: 'Satelit Asli (Esri)',
    icon: Satellite,
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Citra Satelit &copy; Esri, Maxar, Earthstar Geographics, USDA, USGS',
    maxZoom: 18
  },
  topo: {
    name: 'Topografi & Pesisir',
    icon: Globe,
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Topografi &copy; Esri, HERE, Garmin, Intermap, USGS, METI/NASA',
    maxZoom: 18
  }
};

// Batas wilayah geospasial Indonesia Sabang s/d Merauke
const INDONESIA_BOUNDS = [
  [-11.2, 94.8], // Barat Daya (Rote / Samudera Hindia)
  [6.2, 141.2]   // Timur Laut (Sabang / Perbatasan Papua)
];

const INDONESIA_CENTER = [-2.2, 118.0];

export default function GeospatialMap({
  satdikBreakdown,
  onSelectSatdikForExplorer
}) {
  const [selectedSatdikId, setSelectedSatdikId] = useState('poltek-aup');
  const [regionFilter, setRegionFilter] = useState('ALL');
  const [jenjangFilter, setJenjangFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLayer, setActiveLayer] = useState('osm'); // 'osm' | 'satellite' | 'topo'
  const [currentZoom, setCurrentZoom] = useState(5);

  const mapContainerRef = useRef(null);
  const leafletMapRef = useRef(null);
  const tileLayerRef = useRef(null);
  const markersLayerRef = useRef(null);
  const markersMapRef = useRef({});
  const onSelectSatdikForExplorerRef = useRef(onSelectSatdikForExplorer);

  useEffect(() => {
    onSelectSatdikForExplorerRef.current = onSelectSatdikForExplorer;
  }, [onSelectSatdikForExplorer]);

  // Satdik yang telah difilter
  const filteredSatdik = useMemo(() => {
    return SATDIK_LIST.filter(item => {
      const matchesRegion = regionFilter === 'ALL' || item.region === regionFilter;
      const matchesJenjang = jenjangFilter === 'ALL' || 
        (jenjangFilter === 'Politeknik' && (item.type === 'Politeknik' || item.type === 'Akademi')) ||
        (jenjangFilter === 'SUPM' && item.type === 'SUPM');
      const matchesSearch = !searchQuery || 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.shortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.kota.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.provinsi.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesRegion && matchesJenjang && matchesSearch;
    });
  }, [regionFilter, jenjangFilter, searchQuery]);

  const selectedSatdik = useMemo(() => {
    return SATDIK_LIST.find(s => s.id === selectedSatdikId) || SATDIK_LIST[0];
  }, [selectedSatdikId]);

  const selectedMetrics = useMemo(() => {
    return satdikBreakdown[selectedSatdik.id] || {
      count: 0,
      valuation: 0,
      avgScore: 0,
      baik: 0,
      rusakRingan: 0,
      rusakBerat: 0,
      totalRepairNeeded: 0,
      assets: []
    };
  }, [satdikBreakdown, selectedSatdik.id]);

  // Helper warna pin
  const getPinColor = (score) => {
    if (score >= 85) return { hex: '#10b981', bg: 'bg-emerald-500', text: 'text-emerald-400', border: 'border-emerald-400' };
    if (score >= 75) return { hex: '#0284c7', bg: 'bg-sky-500', text: 'text-sky-400', border: 'border-sky-400' };
    return { hex: '#f43f5e', bg: 'bg-rose-500', text: 'text-rose-400', border: 'border-rose-400' };
  };

  // Buat Custom HTML DivIcon untuk pin kampus di peta asli
  // CATATAN: Teks pada titik HANYA muncul pada saat titik dipilih (sesuai permintaan user)
  const createMarkerIcon = useCallback((item, isSelected) => {
    const metrics = satdikBreakdown[item.id] || { avgScore: 80 };
    const score = Math.round(metrics.avgScore || 80);
    const color = getPinColor(score);

    // Teks HANYA dirender jika titik ini sedang dipilih
    const labelHtml = isSelected ? `
      <div style="margin-top: 4px; padding: 2.5px 8px; border-radius: 8px; background: rgba(15, 23, 42, 0.95); border: 1.5px solid #38bdf8; color: #f8fafc; font-size: 11px; font-weight: 700; font-family: ui-sans-serif, system-ui, sans-serif; white-space: nowrap; box-shadow: 0 4px 14px rgba(0,0,0,0.8); pointer-events: none; display: flex; align-items: center; gap: 5px;">
        <span>${item.shortName}</span>
        <span style="background: ${color.hex}; color: #ffffff; font-size: 9px; padding: 1px 4.5px; border-radius: 4px; font-weight: 800;">${score}%</span>
      </div>
    ` : '';

    return L.divIcon({
      className: 'custom-satdik-marker',
      html: `
        <div style="display: flex; flex-direction: column; align-items: center; cursor: pointer; transform: ${isSelected ? 'scale(1.15)' : 'scale(1)'}; transition: transform 0.2s ease;">
          <div style="position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center;">
            ${isSelected ? `
              <div style="position: absolute; inset: -6px; border-radius: 50%; background-color: ${color.hex}; opacity: 0.45;" class="animate-ping"></div>
            ` : ''}
            <div style="width: ${isSelected ? '32px' : '26px'}; height: ${isSelected ? '32px' : '26px'}; border-radius: 50%; background: ${color.hex}; border: ${isSelected ? '3px' : '2px'} solid #ffffff; display: flex; align-items: center; justify-content: center; box-shadow: 0 3px 10px rgba(0,0,0,0.5); transition: all 0.2s ease;">
              <svg width="${isSelected ? '15' : '13'}" height="${isSelected ? '15' : '13'}" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
          </div>
          ${labelHtml}
        </div>
      `,
      iconSize: isSelected ? [140, 64] : [34, 34],
      iconAnchor: isSelected ? [70, 17] : [17, 17],
      popupAnchor: isSelected ? [0, -20] : [0, -18]
    });
  }, [satdikBreakdown]);

  // Bangun konten HTML popup interaktif Leaflet
  const createPopupContent = useCallback((item) => {
    const metrics = satdikBreakdown[item.id] || { avgScore: 80, count: 0, baik: 0, rusakRingan: 0, rusakBerat: 0 };
    const score = Math.round(metrics.avgScore || 80);
    const scoreColorHex = score >= 85 ? '#10b981' : score >= 75 ? '#0284c7' : '#f43f5e';
    const gmapsQuery = encodeURIComponent(`${item.name} ${item.kota}`);

    return `
      <div style="font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 14px 16px; min-width: 260px; max-width: 320px;">
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 6px;">
          <span style="font-size: 9.5px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; background: rgba(14, 165, 233, 0.15); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.3); border-radius: 4px; padding: 2px 6px;">
            ${item.jenjang} • ${item.type}
          </span>
          <span style="font-size: 10px; font-weight: 700; color: #10b981; background: rgba(16, 185, 129, 0.12); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 4px; padding: 1px 6px;">
            Akreditasi ${item.akreditasi}
          </span>
        </div>

        <h4 style="font-size: 14px; font-weight: 700; margin: 0 0 5px 0; line-height: 1.3; color: #f8fafc;">
          ${item.name}
        </h4>

        <!-- Alamat Resmi Kampus dari Maps -->
        <div style="font-size: 11px; margin: 0 0 8px 0; color: #cbd5e1; line-height: 1.4; display: flex; align-items: flex-start; gap: 5px; background: rgba(30, 41, 59, 0.6); padding: 6px 8px; border-radius: 8px; border: 1px solid rgba(51, 65, 85, 0.7);">
          <span style="flex-shrink: 0; font-size: 12px; margin-top: 1px;">📍</span>
          <div>
            <div style="font-weight: 600; color: #f1f5f9;">${item.alamat || `${item.kota}, ${item.provinsi}`}</div>
            <a 
              href="https://www.google.com/maps/search/?api=1&query=${gmapsQuery}" 
              target="_blank" 
              rel="noopener noreferrer" 
              style="display: inline-block; margin-top: 3px; font-size: 10px; color: #38bdf8; text-decoration: underline; font-weight: 600;"
            >
              Buka di Google Maps ↗
            </a>
          </div>
        </div>

        <!-- Koordinat GPS Real -->
        <div style="font-size: 10px; font-family: monospace; color: #38bdf8; background: rgba(2, 132, 199, 0.1); border: 1px solid rgba(2, 132, 199, 0.2); border-radius: 6px; padding: 3px 6px; margin-bottom: 10px; display: flex; justify-content: space-between;">
          <span>Lat: ${item.lat.toFixed(4)}°</span>
          <span>Lng: ${item.lng.toFixed(4)}°</span>
        </div>

        <!-- Score Kelayakan BMN -->
        <div style="margin-bottom: 10px;">
          <div style="display: flex; justify-content: space-between; font-size: 11px; font-weight: 600; margin-bottom: 3px;">
            <span style="color: #cbd5e1;">Kelayakan Sarpras:</span>
            <span style="color: ${scoreColorHex}; font-weight: 800;">${score}%</span>
          </div>
          <div style="width: 100%; height: 6px; background: #1e293b; border-radius: 9999px; overflow: hidden;">
            <div style="width: ${score}%; height: 100%; background: ${scoreColorHex}; border-radius: 9999px;"></div>
          </div>
        </div>

        <!-- Kondisi BMN Grid -->
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px; text-align: center; margin-bottom: 12px; font-size: 10px;">
          <div style="background: rgba(30, 41, 59, 0.8); border: 1px solid #334155; border-radius: 6px; padding: 4px 2px;">
            <span style="color: #94a3b8; display: block; font-size: 9px;">Baik</span>
            <strong style="color: #10b981; font-size: 12px;">${metrics.baik}</strong>
          </div>
          <div style="background: rgba(30, 41, 59, 0.8); border: 1px solid #334155; border-radius: 6px; padding: 4px 2px;">
            <span style="color: #94a3b8; display: block; font-size: 9px;">R. Ringan</span>
            <strong style="color: #38bdf8; font-size: 12px;">${metrics.rusakRingan}</strong>
          </div>
          <div style="background: rgba(30, 41, 59, 0.8); border: 1px solid #334155; border-radius: 6px; padding: 4px 2px;">
            <span style="color: #94a3b8; display: block; font-size: 9px;">R. Berat</span>
            <strong style="color: #f43f5e; font-size: 12px;">${metrics.rusakBerat}</strong>
          </div>
        </div>

        <!-- Tombol Aksi di Popup -->
        <div style="display: flex; gap: 6px;">
          <button 
            type="button" 
            data-satdik-focus-id="${item.id}"
            style="flex: 1; padding: 6px 10px; font-size: 11px; font-weight: 600; background: #0284c7; color: #ffffff; border: none; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px;"
          >
            Fokus Panel
          </button>
          <button 
            type="button" 
            data-satdik-explore-id="${item.id}"
            style="padding: 6px 10px; font-size: 11px; font-weight: 600; background: #1e293b; color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.4); border-radius: 8px; cursor: pointer;"
            title="Buka Data Sarpras"
          >
            Daftar Sarpras ↗
          </button>
        </div>
      </div>
    `;
  }, [satdikBreakdown]);

  // Inisialisasi Peta Asli Leaflet
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (leafletMapRef.current) return;

    // Buat objek map Leaflet
    const map = L.map(mapContainerRef.current, {
      center: INDONESIA_CENTER,
      zoom: 5,
      minZoom: 4,
      maxZoom: 18,
      zoomControl: false,
      attributionControl: true
    });

    leafletMapRef.current = map;

    // Pasang Tile Layer Default (Peta Standar OSM)
    const defaultLayerCfg = TILE_LAYERS.osm;
    const tileLayer = L.tileLayer(defaultLayerCfg.url, {
      attribution: defaultLayerCfg.attribution,
      subdomains: defaultLayerCfg.subdomains || 'abc',
      maxZoom: defaultLayerCfg.maxZoom
    }).addTo(map);
    tileLayerRef.current = tileLayer;

    // Pasang Layer Group untuk Marker Kampus
    const markersLayer = L.layerGroup().addTo(map);
    markersLayerRef.current = markersLayer;

    // Dengarkan perubahan zoom
    map.on('zoomend', () => {
      setCurrentZoom(map.getZoom());
    });

    // Delegasi klik tombol di dalam Leaflet Popup
    map.on('popupopen', (e) => {
      const container = e.popup.getElement();
      if (!container) return;

      const focusBtn = container.querySelector('[data-satdik-focus-id]');
      if (focusBtn) {
        focusBtn.onclick = () => {
          const id = focusBtn.getAttribute('data-satdik-focus-id');
          setSelectedSatdikId(id);
        };
      }

      const exploreBtn = container.querySelector('[data-satdik-explore-id]');
      if (exploreBtn) {
        exploreBtn.onclick = () => {
          const id = exploreBtn.getAttribute('data-satdik-explore-id');
          if (onSelectSatdikForExplorerRef.current) {
            onSelectSatdikForExplorerRef.current(id);
          }
        };
      }
    });

    // Invalidate size untuk mencegah rendering abu-abu setelah tab switch
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);

    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    resizeObserver.observe(mapContainerRef.current);

    return () => {
      clearTimeout(timer);
      resizeObserver.disconnect();
      map.remove();
      leafletMapRef.current = null;
    };
  }, []);

  // Update Tile Layer saat user memilih provider peta yang berbeda (Satelit / OSM / Topo)
  useEffect(() => {
    const map = leafletMapRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const cfg = TILE_LAYERS[activeLayer] || TILE_LAYERS.osm;
    const newTileLayer = L.tileLayer(cfg.url, {
      attribution: cfg.attribution,
      subdomains: cfg.subdomains || 'abc',
      maxZoom: cfg.maxZoom
    }).addTo(map);

    tileLayerRef.current = newTileLayer;
  }, [activeLayer]);

  // Update Markers di Peta saat data atau filter berubah
  useEffect(() => {
    const map = leafletMapRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();
    markersMapRef.current = {};

    filteredSatdik.forEach(item => {
      const isSelected = item.id === selectedSatdikId;
      const icon = createMarkerIcon(item, isSelected);

      const marker = L.marker([item.lat, item.lng], { icon });

      // Tambahkan Tooltip nama kampus saat mouse hover
      marker.bindTooltip(
        `${item.shortName} (${item.kota})`,
        { 
          direction: 'top', 
          offset: [0, -22],
          className: 'satdik-map-tooltip'
        }
      );

      // Tambahkan Popup detail
      marker.bindPopup(createPopupContent(item), {
        maxWidth: 320,
        className: 'satdik-leaflet-popup'
      });

      // Event klik marker
      marker.on('click', () => {
        setSelectedSatdikId(item.id);
      });

      marker.addTo(markersLayer);
      markersMapRef.current[item.id] = marker;
    });
  }, [filteredSatdik, selectedSatdikId, createMarkerIcon, createPopupContent]);

  // Navigasi Zoom Peta
  const handleZoomIn = () => {
    if (leafletMapRef.current) {
      leafletMapRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (leafletMapRef.current) {
      leafletMapRef.current.zoomOut();
    }
  };

  // Reset tampilan ke seluruh Nusantara (Sabang s/d Merauke)
  const handleResetZoom = () => {
    if (leafletMapRef.current) {
      leafletMapRef.current.fitBounds(INDONESIA_BOUNDS, {
        padding: [30, 30],
        maxZoom: 6,
        animate: true,
        duration: 1.2
      });
    }
  };

  // Fokus ke Satdik terpilih di peta asli dengan animasi halus flyTo
  const handleFocusSatdik = useCallback((satdik) => {
    if (!satdik || !leafletMapRef.current) return;
    const map = leafletMapRef.current;

    setSelectedSatdikId(satdik.id);

    map.flyTo([satdik.lat, satdik.lng], 12, {
      animate: true,
      duration: 1.2
    });

    setTimeout(() => {
      const marker = markersMapRef.current[satdik.id];
      if (marker) {
        marker.openPopup();
      }
    }, 1250);
  }, []);

  const handleFocusSelectedSatdik = () => {
    handleFocusSatdik(selectedSatdik);
  };

  // Ganti filter wilayah dan sesuaikan bounding box peta asli
  const handleRegionChange = (newRegion) => {
    setRegionFilter(newRegion);
    const map = leafletMapRef.current;
    if (!map) return;

    if (newRegion === 'ALL') {
      handleResetZoom();
      return;
    }

    // Ambil satdik di region tersebut untuk hitung bounding box asli
    const regionSatdiks = SATDIK_LIST.filter(s => s.region === newRegion);
    if (regionSatdiks.length > 0) {
      const bounds = L.latLngBounds(regionSatdiks.map(s => [s.lat, s.lng]));
      map.fitBounds(bounds, {
        padding: [60, 60],
        maxZoom: 9,
        animate: true,
        duration: 1.2
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header dan Kontrol Filter */}
      <div className="bg-slate-800/90 rounded-2xl p-4 sm:p-5 border border-slate-700/70 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Sistem Informasi Geospasial
            </span>
            <span className="text-slate-400 text-xs">• 18 Satdik Sabang s/d Merauke</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1 flex items-center gap-2">
            <Navigation className="w-5 h-5 text-cyan-400" />
            <span>Peta Persebaran Sarpras Satuan Pendidikan KKP</span>
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Peta geografis nyata menampilkan sebaran kampus Politeknik & SUPM KKP dengan citra satelit dan data kelayakan BMN terintegrasi.
          </p>
        </div>

        {/* Filter Wilayah, Jenjang & Pencarian */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-center">
          {/* Input Pencarian Kampus */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Cari kampus / kota..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-900 text-slate-200 border border-slate-700 text-xs rounded-xl pl-8 pr-3 py-2 focus:outline-none focus:border-cyan-500 shadow-sm w-36 sm:w-48 placeholder:text-slate-500"
            />
          </div>

          {/* Dropdown Wilayah */}
          <select
            value={regionFilter}
            onChange={(e) => handleRegionChange(e.target.value)}
            className="bg-slate-900 text-slate-200 border border-slate-700 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-500 shadow-sm"
          >
            <option value="ALL">Semua Wilayah (18 Satdik)</option>
            <option value="Sumatera">Sumatera (4 Satdik)</option>
            <option value="Jawa">Jawa (5 Satdik)</option>
            <option value="Kalimantan">Kalimantan (1 Satdik)</option>
            <option value="Sulawesi">Sulawesi (4 Satdik)</option>
            <option value="Bali-Nusa Tenggara">Bali & NT (2 Satdik)</option>
            <option value="Maluku">Maluku (1 Satdik)</option>
            <option value="Papua">Papua (1 Satdik)</option>
          </select>

          {/* Filter Jenjang */}
          <div className="flex items-center bg-slate-900 rounded-xl p-1 border border-slate-700">
            <button
              onClick={() => setJenjangFilter('ALL')}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                jenjangFilter === 'ALL' ? 'bg-cyan-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setJenjangFilter('Politeknik')}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                jenjangFilter === 'Politeknik' ? 'bg-cyan-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              Poltek (11)
            </button>
            <button
              onClick={() => setJenjangFilter('SUPM')}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                jenjangFilter === 'SUPM' ? 'bg-cyan-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              SUPM (7)
            </button>
          </div>
        </div>
      </div>

      {/* Grid Utama: Peta Geospasial Asli & Inspector Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Kolom Kiri: Peta Geospasial Asli Leaflet (8 Kolom) */}
        <div className="lg:col-span-8 bg-slate-800/90 rounded-2xl p-3.5 sm:p-4 border border-slate-700/70 shadow-md flex flex-col overflow-hidden">
          {/* Header Peta & Pemilih Layer Peta Asli */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-2.5">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                Peta Asli Nusantara (Interaktif)
              </h3>
            </div>

            {/* Pemilih Tipe Peta Asli: Satelit, Peta Jalan (OSM), Topografi */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] text-slate-400 font-medium mr-1 hidden sm:inline">Lapisan:</span>
              <button
                type="button"
                onClick={() => setActiveLayer('satellite')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  activeLayer === 'satellite'
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'bg-slate-900/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
                }`}
                title="Citra Satelit Asli Resolusi Tinggi"
              >
                <Satellite className="w-3.5 h-3.5" />
                <span>Satelit Asli</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveLayer('osm')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  activeLayer === 'osm'
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'bg-slate-900/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
                }`}
                title="Peta Jalan dan Geografi Standar (OSM)"
              >
                <MapIcon className="w-3.5 h-3.5" />
                <span>Peta Jalan</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveLayer('topo')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  activeLayer === 'topo'
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'bg-slate-900/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
                }`}
                title="Peta Topografi & Pesisir"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Topografi</span>
              </button>
            </div>
          </div>

          {/* Legenda Indeks Kelayakan */}
          <div className="flex items-center justify-between text-xs px-2 py-1.5 mb-2 bg-slate-900/60 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
              <Info className="w-3 h-3 text-cyan-400" />
              <span>Status Kelayakan BMN:</span>
            </span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-slate-300 text-[11px]">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"></span>
                <span>&ge;85% (Optimal)</span>
              </span>
              <span className="flex items-center gap-1.5 text-slate-300 text-[11px]">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500 shadow-sm shadow-sky-500/50"></span>
                <span>75-84% (Sedang)</span>
              </span>
              <span className="flex items-center gap-1.5 text-slate-300 text-[11px]">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50"></span>
                <span>&lt;75% (Perhatian)</span>
              </span>
            </div>
          </div>

          {/* Container Leaflet Map Asli */}
          <div className="relative w-full flex-1 min-h-[380px] xs:min-h-[440px] sm:min-h-[500px] rounded-xl border border-slate-700/80 overflow-hidden shadow-inner">
            {/* Div penampung Leaflet */}
            <div 
              ref={mapContainerRef} 
              className="w-full h-full min-h-[380px] xs:min-h-[440px] sm:min-h-[500px]"
            />

            {/* Floating Top-Left Badge: Koordinat & Status */}
            <div className="absolute top-3 left-3 z-10 flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/80 text-[11px] text-cyan-300 font-medium shadow-lg pointer-events-none">
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              <span>Peta Asli Terkalibrasi GPS</span>
              <span className="text-slate-500">•</span>
              <span className="font-mono text-white text-[10px]">WPP-NRI</span>
            </div>

            {/* Floating Zoom & Navigation Controls di Kanan Atas */}
            <div className="absolute top-3 right-3 z-10 flex flex-col items-center bg-slate-900/90 backdrop-blur-md rounded-xl border border-slate-700/80 shadow-2xl p-1 gap-1">
              <button
                type="button"
                onClick={handleZoomIn}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-cyan-600 text-slate-200 hover:text-white flex items-center justify-center transition-all active:scale-90 shadow-sm"
                title="Perbesar Peta (Zoom In)"
                aria-label="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>

              <div 
                className="text-[10px] font-mono font-bold text-cyan-400 py-0.5 select-none text-center min-w-[32px]"
                title="Tingkat Pembesaran Peta Asli"
              >
                {currentZoom}x
              </div>

              <button
                type="button"
                onClick={handleZoomOut}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-cyan-600 text-slate-200 hover:text-white flex items-center justify-center transition-all active:scale-90 shadow-sm"
                title="Perkecil Peta (Zoom Out)"
                aria-label="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>

              <div className="w-full h-px bg-slate-700/80 my-0.5"></div>

              <button
                type="button"
                onClick={handleResetZoom}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-all active:scale-90"
                title="Kembali ke Seluruh Nusantara (Sabang s/d Merauke)"
                aria-label="Reset View"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={handleFocusSelectedSatdik}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-cyan-600 text-cyan-400 hover:text-white flex items-center justify-center transition-all active:scale-90"
                title={`Fokus ke Kampus: ${selectedSatdik.shortName}`}
                aria-label="Fokus Kampus Terpilih"
              >
                <Locate className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick Map Overlay Footer Bar */}
            <div className="absolute bottom-2 left-2 right-2 z-10 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/80 flex items-center justify-between text-[11px] text-slate-300 pointer-events-none">
              <div className="flex items-center gap-1.5 truncate mr-2">
                <Info className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                <span className="truncate">
                  Klik marker pin untuk melihat profil kampus, atau gunakan tombol lapisan di kanan atas.
                </span>
              </div>
              <span className="font-mono text-cyan-400 text-[10px] whitespace-nowrap hidden xs:inline">
                {filteredSatdik.length} Satdik Aktif
              </span>
            </div>
          </div>

          {/* Quick List Strip Satdik di Bagian Bawah Peta */}
          <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-700">
            {filteredSatdik.map((s) => {
              const isSelected = selectedSatdikId === s.id;
              const metrics = satdikBreakdown[s.id] || { avgScore: 80 };
              const colors = getPinColor(metrics.avgScore);

              return (
                <button
                  key={s.id}
                  onClick={() => handleFocusSatdik(s)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs whitespace-nowrap transition-all border ${
                    isSelected
                      ? 'bg-cyan-950/90 border-cyan-500 text-white shadow-xs font-bold scale-[1.02]'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                  title={`${s.name} - Klik untuk memilih dan fokus di peta asli`}
                >
                  <span className={`w-2 h-2 rounded-full ${colors.bg}`}></span>
                  <span className="font-semibold">{s.shortName}</span>
                  <span className={`text-[10px] font-mono ${colors.text}`}>
                    {Math.round(metrics.avgScore)}%
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Kolom Kanan: Detail Satdik Terpilih (4 Kolom) */}
        <div className="lg:col-span-4 bg-slate-800/90 rounded-2xl p-4 sm:p-5 border border-slate-700/70 shadow-md flex flex-col justify-between">
          <div>
            {/* Header Kampus */}
            <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-700/60">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {selectedSatdik.jenjang} • {selectedSatdik.type}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white mt-1.5 leading-snug">
                  {selectedSatdik.name}
                </h3>
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{selectedSatdik.kota}, {selectedSatdik.provinsi} ({selectedSatdik.region})</span>
                </p>

                {/* Tombol Fokus Lokasi di Peta */}
                <button
                  type="button"
                  onClick={handleFocusSelectedSatdik}
                  className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-lg bg-cyan-950/80 hover:bg-cyan-600 text-cyan-300 hover:text-white border border-cyan-700/60 text-[11px] font-semibold transition-all active:scale-95 shadow-2xs"
                  title="Arahkan dan perbesar peta asli ke lokasi kampus ini"
                >
                  <Locate className="w-3 h-3" />
                  <span>Fokus Lokasi di Peta Asli</span>
                </button>
              </div>

              <div className="text-right flex-shrink-0">
                <span className="text-[10px] text-slate-400 block">Akreditasi</span>
                <span className="text-xs font-bold text-emerald-400 px-2 py-0.5 bg-emerald-500/10 rounded border border-emerald-500/30">
                  {selectedSatdik.akreditasi}
                </span>
              </div>
            </div>

            {/* Informasi Alamat Lengkap dari Maps & Koordinat GPS */}
            <div className="my-2.5 p-3 bg-slate-900/70 rounded-xl border border-slate-800 text-xs space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Alamat Resmi Kampus (Maps)</span>
                  <p className="text-slate-200 text-xs mt-0.5 leading-snug font-medium">
                    {selectedSatdik.alamat || `${selectedSatdik.kota}, ${selectedSatdik.provinsi}`}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                <div className="font-mono text-[10px] text-slate-400">
                  <span className="text-cyan-400 font-bold">{selectedSatdik.lat.toFixed(4)}°</span>, <span className="text-cyan-400 font-bold">{selectedSatdik.lng.toFixed(4)}°</span>
                </div>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${selectedSatdik.name} ${selectedSatdik.kota}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 hover:underline"
                  title="Buka rute dan lokasi di Google Maps"
                >
                  <span>Buka di Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Statistik Profil Kampus */}
            <div className="my-2.5 text-xs">
              <div className="bg-slate-900/70 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <School className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Program Studi</span>
                  </div>
                  <div className="text-base font-bold text-white mt-0.5">
                    {selectedSatdik.prodi?.length || 0} <span className="text-[10px] text-slate-400 font-normal">Program Kejuruan</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Tahun Berdiri</span>
                  <span className="text-xs font-bold text-slate-200">{selectedSatdik.establishedYear}</span>
                </div>
              </div>
            </div>

            {/* Kotak Ringkasan Metrik Sarpras */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-4 rounded-xl border border-slate-700/80 mb-3.5 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-300">Ringkasan Sarpras Kampus</span>
                <span className="text-xs font-bold text-cyan-400">
                  {selectedMetrics.count} Sarpras Terdata
                </span>
              </div>

              {/* Progress bar indeks kelayakan */}
              <div className="space-y-1 mb-3">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Indeks Kelayakan Kampus</span>
                  <span className="font-bold text-white">{Math.round(selectedMetrics.avgScore)}%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      selectedMetrics.avgScore >= 85 ? 'bg-emerald-500' : selectedMetrics.avgScore >= 75 ? 'bg-sky-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${selectedMetrics.avgScore}%` }}
                  ></div>
                </div>
              </div>

              {/* Grid Kondisi BMN DJKN */}
              <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                <div className="bg-slate-800/80 p-1.5 rounded-lg border border-slate-700">
                  <span className="text-slate-400 block">Baik</span>
                  <span className="font-bold text-emerald-400 text-xs">{selectedMetrics.baik}</span>
                </div>
                <div className="bg-slate-800/80 p-1.5 rounded-lg border border-slate-700">
                  <span className="text-slate-400 block">R. Ringan</span>
                  <span className="font-bold text-sky-400 text-xs">{selectedMetrics.rusakRingan}</span>
                </div>
                <div className="bg-slate-800/80 p-1.5 rounded-lg border border-slate-700">
                  <span className="text-slate-400 block">R. Berat</span>
                  <span className="font-bold text-rose-400 text-xs">{selectedMetrics.rusakBerat}</span>
                </div>
              </div>
            </div>

            {/* Daftar Fasilitas Unggulan Kampus */}
            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Fasilitas Unggulan Kampus Ini
              </h4>
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-700 text-xs">
                {selectedMetrics.assets.length > 0 ? (
                  selectedMetrics.assets.map((asset) => (
                    <div
                      key={asset.id}
                      className="bg-slate-900/50 p-2 rounded-lg border border-slate-800/80 flex items-center justify-between shadow-2xs"
                    >
                      <div className="truncate mr-2">
                        <span className="font-medium text-white block truncate">{asset.name}</span>
                        <span className="text-[10px] text-slate-400">{asset.subcategory}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap ${
                        asset.condition === 'Baik' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        asset.condition === 'Rusak Ringan' ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20' :
                        'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        {asset.condition}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic">Data aset belum dimasukkan.</p>
                )}
              </div>
            </div>
          </div>

          {/* Tombol Aksi: Masuk ke Explorer dengan filter kampus ini */}
          <div className="mt-4 pt-3 border-t border-slate-700/60">
            <button
              onClick={() => onSelectSatdikForExplorer(selectedSatdik.id)}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-colors shadow-md shadow-cyan-900/30 active:scale-[0.98]"
            >
              <span>Buka Daftar Lengkap Sarpras Kampus Ini</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
