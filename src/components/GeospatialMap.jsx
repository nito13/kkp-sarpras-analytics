import React, { useState, useRef, useEffect } from 'react';
import { 
  MapPin, 
  Navigation, 
  School, 
  Building2, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink, 
  Search,
  Filter,
  Compass,
  Ship,
  Info,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Locate
} from 'lucide-react';
import { SATDIK_LIST } from '../data/kkpData';

export default function GeospatialMap({
  satdikBreakdown,
  onSelectSatdikForExplorer
}) {
  const [selectedSatdikId, setSelectedSatdikId] = useState('poltek-aup');
  const [hoveredSatdikId, setHoveredSatdikId] = useState(null);
  const [regionFilter, setRegionFilter] = useState('ALL'); // 'ALL' | 'Sumatera' | 'Jawa' | 'Kalimantan' | 'Sulawesi' | 'Bali-Nusa Tenggara' | 'Maluku' | 'Papua'
  const [jenjangFilter, setJenjangFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Zoom and Pan State
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [hasDragged, setHasDragged] = useState(false);

  const mapContainerRef = useRef(null);
  const dragStartRef = useRef({ x: 0, y: 0, panX: 0, panY: 0 });
  const touchStartRef = useRef({ dist: 0, zoom: 1, panX: 0, panY: 0, touchX: 0, touchY: 0 });

  // Filtered Satdik list
  const filteredSatdik = SATDIK_LIST.filter(item => {
    const matchesRegion = regionFilter === 'ALL' || item.region === regionFilter;
    const matchesJenjang = jenjangFilter === 'ALL' || 
      (jenjangFilter === 'Politeknik' && (item.type === 'Politeknik' || item.type === 'Akademi')) ||
      (jenjangFilter === 'SUPM' && item.type === 'SUPM');
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.kota.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.provinsi.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRegion && matchesJenjang && matchesSearch;
  });

  const selectedSatdik = SATDIK_LIST.find(s => s.id === selectedSatdikId) || SATDIK_LIST[0];
  const selectedMetrics = satdikBreakdown[selectedSatdik.id] || {
    count: 0,
    valuation: 0,
    avgScore: 0,
    baik: 0,
    rusakRingan: 0,
    rusakBerat: 0,
    totalRepairNeeded: 0,
    assets: []
  };

  // Helper for pin color based on score
  const getPinColor = (score) => {
    if (score >= 85) return { bg: 'bg-emerald-500', text: 'text-emerald-400', border: 'border-emerald-400', ring: 'ring-emerald-500/30' };
    if (score >= 75) return { bg: 'bg-sky-500', text: 'text-sky-400', border: 'border-sky-400', ring: 'ring-sky-500/30' };
    return { bg: 'bg-rose-500', text: 'text-rose-400', border: 'border-rose-400', ring: 'ring-rose-500/30' };
  };

  // Zoom handlers
  const handleZoomIn = () => {
    setZoom((prev) => Math.min(3.5, Number((prev + 0.35).toFixed(2))));
  };

  const handleZoomOut = () => {
    setZoom((prev) => {
      const next = Math.max(0.75, Number((prev - 0.35).toFixed(2)));
      if (next <= 0.85) setPan({ x: 0, y: 0 });
      return next;
    });
  };

  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Center & zoom on a specific satdik pin
  const handleFocusSatdik = (satdik) => {
    if (!satdik) return;
    const container = mapContainerRef.current;
    const width = container ? container.clientWidth : 800;
    const height = container ? container.clientHeight : 460;
    const scale = Math.min(width / 1000, height / 500);

    const targetZoom = 2.4;
    const dx = (500 - satdik.mapX) * scale * (targetZoom / 1.5);
    const dy = (250 - satdik.mapY) * scale * (targetZoom / 1.5);

    setZoom(targetZoom);
    setPan({ x: Math.round(dx), y: Math.round(dy) });
  };

  const handleFocusSelectedSatdik = () => {
    handleFocusSatdik(selectedSatdik);
  };

  // Regional zoom presets
  const handleRegionChange = (newRegion) => {
    setRegionFilter(newRegion);
    if (newRegion === 'ALL') {
      handleResetZoom();
    } else {
      const regionCoords = {
        'Sumatera': { x: 190, y: 190, z: 1.8 },
        'Jawa': { x: 380, y: 360, z: 2.3 },
        'Kalimantan': { x: 420, y: 220, z: 1.9 },
        'Sulawesi': { x: 620, y: 230, z: 1.9 },
        'Bali-Nusa Tenggara': { x: 580, y: 400, z: 2.4 },
        'Maluku': { x: 740, y: 250, z: 2.1 },
        'Papua': { x: 860, y: 260, z: 1.9 },
      };
      const preset = regionCoords[newRegion];
      if (preset) {
        const container = mapContainerRef.current;
        const width = container ? container.clientWidth : 800;
        const height = container ? container.clientHeight : 460;
        const scale = Math.min(width / 1000, height / 500);
        const dx = (500 - preset.x) * scale * (preset.z / 1.5);
        const dy = (250 - preset.y) * scale * (preset.z / 1.5);
        setZoom(preset.z);
        setPan({ x: Math.round(dx), y: Math.round(dy) });
      }
    }
  };

  // Mouse drag handlers
  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setHasDragged(false);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      panX: pan.x,
      panY: pan.y
    };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    if (Math.hypot(dx, dy) > 5) {
      setHasDragged(true);
    }
    setPan({
      x: dragStartRef.current.panX + dx,
      y: dragStartRef.current.panY + dy
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setTimeout(() => setHasDragged(false), 80);
  };

  // Touch drag & pinch handlers
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setHasDragged(false);
      dragStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        panX: pan.x,
        panY: pan.y
      };
    } else if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      touchStartRef.current = {
        dist,
        zoom,
        panX: pan.x,
        panY: pan.y
      };
      setIsDragging(true);
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 1 && isDragging) {
      const dx = e.touches[0].clientX - dragStartRef.current.x;
      const dy = e.touches[0].clientY - dragStartRef.current.y;
      if (Math.hypot(dx, dy) > 6) {
        setHasDragged(true);
      }
      setPan({
        x: dragStartRef.current.panX + dx,
        y: dragStartRef.current.panY + dy
      });
    } else if (e.touches.length === 2 && touchStartRef.current.dist > 0) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const ratio = dist / touchStartRef.current.dist;
      const nextZoom = Math.min(3.5, Math.max(0.75, Number((touchStartRef.current.zoom * ratio).toFixed(2))));
      setZoom(nextZoom);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setTimeout(() => setHasDragged(false), 80);
  };

  // Native non-passive wheel zoom
  useEffect(() => {
    const el = mapContainerRef.current;
    if (!el) return;

    const onWheel = (e) => {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 0.2 : -0.2;
      setZoom((prev) => {
        const next = Math.min(3.5, Math.max(0.75, Number((prev + delta).toFixed(2))));
        if (next <= 0.85) setPan({ x: 0, y: 0 });
        return next;
      });
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header and Filter Controls */}
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
            Sebaran kampus Politeknik, Akademi, dan SUPM beserta indeks kelayakan sarpras maritim di setiap zona wilayah maritim.
          </p>
        </div>

        {/* Region & Type Filters */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-center">
          {/* Region dropdown */}
          <select
            value={regionFilter}
            onChange={(e) => handleRegionChange(e.target.value)}
            className="bg-slate-900 text-slate-200 border border-slate-700 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-500 shadow-sm"
          >
            <option value="ALL">Semua Wilayah</option>
            <option value="Sumatera">Sumatera (4 Satdik)</option>
            <option value="Jawa">Jawa (5 Satdik)</option>
            <option value="Kalimantan">Kalimantan (1 Satdik)</option>
            <option value="Sulawesi">Sulawesi (4 Satdik)</option>
            <option value="Bali-Nusa Tenggara">Bali & NT (2 Satdik)</option>
            <option value="Maluku">Maluku (1 Satdik)</option>
            <option value="Papua">Papua (1 Satdik)</option>
          </select>

          {/* Jenjang filter buttons */}
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

      {/* Main Grid: Interactive Map & Detailed Satdik Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Map Canvas (8 Cols) */}
        <div className="lg:col-span-8 bg-slate-800/90 rounded-2xl p-3.5 sm:p-4 border border-slate-700/70 shadow-md flex flex-col overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-2">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                Peta Nusantara
              </h3>
            </div>
            <div className="flex items-center gap-3 text-xs flex-wrap">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Kelayakan &gt;85%</span>
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
                <span>75-84%</span>
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                <span>&lt;75%</span>
              </span>
            </div>
          </div>

          {/* Interactive SVG / Canvas-Style Map Container with Zoom & Pan */}
          <div 
            ref={mapContainerRef}
            className="geospatial-canvas-container relative w-full flex-1 min-h-[320px] xs:min-h-[380px] sm:min-h-[460px] bg-gradient-to-b from-slate-950 via-slate-900 to-blue-950 rounded-xl border border-slate-800 overflow-hidden shadow-inner flex items-center justify-center select-none touch-none"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{ cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
          >
            {/* Marine Bathymetry & Grid Background Lines */}
            <div className="absolute inset-0 opacity-15 pointer-events-none" style={{
              backgroundImage: 'radial-gradient(circle, #0284c7 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }}></div>

            {/* Latitude Equator Line (Khatulistiwa) */}
            <div className="absolute top-[38%] left-0 right-0 border-b border-cyan-500/20 pointer-events-none flex items-center justify-end px-3">
              <span className="text-[9px] text-cyan-500/50 font-mono">0° Garis Khatulistiwa (Equator)</span>
            </div>

            {/* Floating Top-Left Interactive Badge */}
            <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-700/80 text-[10px] text-cyan-300 font-medium pointer-events-none shadow-md">
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              <span>WPP-NRI • Interaktif</span>
            </div>

            {/* Floating Zoom Controls: Zoom In, Zoom Level, Zoom Out, Reset, Focus */}
            <div className="absolute top-3 right-3 z-20 flex flex-col items-center bg-slate-900/90 backdrop-blur-md rounded-xl border border-slate-700/80 shadow-2xl p-1 gap-1">
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
                title="Tingkat Pembesaran Peta"
              >
                {Math.round(zoom * 100)}%
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
                title="Reset Ukuran Peta (100%)"
                aria-label="Reset Zoom"
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

            {/* Transformable Canvas Layer */}
            <div 
              className="w-full h-full flex items-center justify-center"
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                transformOrigin: 'center center',
                transition: isDragging ? 'none' : 'transform 200ms cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              {/* High-Fidelity Silhouette SVG of Indonesian Archipelago */}
              <svg
                viewBox="0 0 1000 500"
                className="w-full h-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] pointer-events-auto"
              >
                {/* Island Silhouettes (Stylized archipelago geometry) */}
                <g fill="#1e293b" stroke="#334155" strokeWidth="1.5" className="transition-colors">
                  {/* Sumatera */}
                  <path d="M 80 80 L 120 70 L 170 120 L 210 180 L 250 240 L 280 320 L 240 330 L 200 280 L 140 200 L 90 120 Z" />
                  {/* Jawa */}
                  <path d="M 280 340 L 340 340 L 420 355 L 480 375 L 490 390 L 410 380 L 320 365 L 270 355 Z" />
                  {/* Kalimantan */}
                  <path d="M 330 150 L 420 130 L 470 160 L 480 230 L 430 290 L 360 280 L 330 220 Z" />
                  {/* Sulawesi */}
                  <path d="M 580 160 L 640 140 L 680 180 L 650 230 L 640 260 L 660 300 L 620 330 L 590 310 L 570 240 L 610 200 Z" />
                  {/* Bali & Nusa Tenggara */}
                  <path d="M 500 385 L 530 385 L 560 390 L 610 400 L 660 415 L 670 430 L 620 420 L 550 405 Z" />
                  {/* Maluku */}
                  <path d="M 720 220 L 760 210 L 780 250 L 750 290 L 710 280 Z" />
                  {/* Papua */}
                  <path d="M 780 210 L 840 180 L 920 190 L 970 240 L 960 330 L 890 320 L 840 270 L 790 250 Z" />
                </g>

                {/* Ocean Zone Labels */}
                <text x="220" y="140" fill="#475569" fontSize="11" fontFamily="sans-serif" fontStyle="italic">Laut Natuna</text>
                <text x="390" y="325" fill="#475569" fontSize="11" fontFamily="sans-serif" fontStyle="italic">Laut Jawa</text>
                <text x="600" y="270" fill="#475569" fontSize="11" fontFamily="sans-serif" fontStyle="italic">Selat Makassar</text>
                <text x="670" y="340" fill="#475569" fontSize="11" fontFamily="sans-serif" fontStyle="italic">Laut Flores</text>
                <text x="730" y="270" fill="#475569" fontSize="11" fontFamily="sans-serif" fontStyle="italic">Laut Banda</text>
                <text x="830" y="310" fill="#475569" fontSize="11" fontFamily="sans-serif" fontStyle="italic">Laut Arafuru</text>

                {/* Markers for each Satdik with interactive click and rock-solid hover */}
                {SATDIK_LIST.map((item) => {
                  const metrics = satdikBreakdown[item.id] || { avgScore: 80, count: 0 };
                  const isSelected = selectedSatdikId === item.id;
                  const isHovered = hoveredSatdikId === item.id;
                  const isFiltered = filteredSatdik.some(f => f.id === item.id);
                  const score = metrics.avgScore || 80;
                  const pinColor = score >= 85 ? '#10b981' : score >= 75 ? '#0284c7' : '#f43f5e';

                  return (
                    <g
                      key={item.id}
                      className={`cursor-pointer transition-opacity duration-200 ${!isFiltered ? 'opacity-25 pointer-events-none' : 'opacity-100'}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (hasDragged) return;
                        setSelectedSatdikId(item.id);
                      }}
                      onMouseEnter={() => setHoveredSatdikId(item.id)}
                      onMouseLeave={() => setHoveredSatdikId(null)}
                      transform={`translate(${item.mapX}, ${item.mapY})`}
                    >
                      {/* Generous hit target (36px diameter) to keep mouse & touch interaction stable */}
                      <circle
                        r="18"
                        fill="transparent"
                        className="cursor-pointer"
                      />

                      {/* Pulsating ring when selected or hovered */}
                      {(isSelected || isHovered) && (
                        <circle
                          r={isSelected ? "18" : "15"}
                          fill="none"
                          stroke={pinColor}
                          strokeWidth="2"
                          className="animate-ping opacity-60 pointer-events-none"
                        />
                      )}

                      {/* Outer glow ring */}
                      <circle
                        r={isSelected ? "11" : isHovered ? "9.5" : "7.5"}
                        fill={pinColor}
                        opacity={isSelected || isHovered ? "1" : "0.8"}
                        stroke="#ffffff"
                        strokeWidth={isSelected ? "2.5" : isHovered ? "2" : "1.5"}
                        className="pointer-events-none transition-all duration-200"
                      />

                      {/* Inner core */}
                      <circle
                        r={isSelected ? "4.5" : isHovered ? "4" : "2.5"}
                        fill="#ffffff"
                        className="pointer-events-none transition-all duration-200"
                      />

                      {/* Label below or above point */}
                      <text
                        x="0"
                        y={item.mapY > 350 ? "-14" : "18"}
                        textAnchor="middle"
                        fill={isSelected ? '#38bdf8' : isHovered ? '#ffffff' : '#cbd5e1'}
                        fontSize={isSelected ? "10" : isHovered ? "9.5" : "8"}
                        fontWeight={isSelected || isHovered ? "bold" : "normal"}
                        className="pointer-events-none select-none drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] transition-all duration-150"
                      >
                        {item.shortName}
                      </text>
                    </g>
                  );
                })}

                {/* Floating Tooltip Card for hovered pin, rendered as top layer */}
                {(() => {
                  if (!hoveredSatdikId || hoveredSatdikId === selectedSatdikId) return null;
                  const hItem = SATDIK_LIST.find(s => s.id === hoveredSatdikId);
                  if (!hItem) return null;
                  const hMetrics = satdikBreakdown[hItem.id] || { avgScore: 80, count: 0 };
                  const hScore = Math.round(hMetrics.avgScore || 80);
                  const tooltipY = hItem.mapY < 130 ? hItem.mapY + 34 : hItem.mapY - 26;

                  return (
                    <g
                      transform={`translate(${hItem.mapX}, ${tooltipY})`}
                      className="pointer-events-none transition-all duration-150"
                    >
                      <rect
                        x="-70"
                        y="-18"
                        width="140"
                        height="24"
                        rx="6"
                        fill="#0f172a"
                        fillOpacity="0.95"
                        stroke="#38bdf8"
                        strokeWidth="1.2"
                        className="filter drop-shadow-lg"
                      />
                      <text
                        x="0"
                        y="-2.5"
                        textAnchor="middle"
                        fill="#f8fafc"
                        fontSize="9.5"
                        fontWeight="600"
                        className="select-none font-sans"
                      >
                        {hItem.shortName} • {hScore}% Kelayakan
                      </text>
                    </g>
                  );
                })()}
              </svg>
            </div>

            {/* Quick Map Overlay Footer Bar */}
            <div className="absolute bottom-2 left-2 right-2 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/80 flex items-center justify-between text-[11px] text-slate-300">
              <div className="flex items-center gap-1.5 truncate mr-2">
                <Info className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                <span className="truncate">Gunakan tombol (+/-), scroll, atau geser peta untuk navigasi.</span>
              </div>
              <span className="font-mono text-cyan-400 text-[10px] whitespace-nowrap hidden xs:inline">
                {filteredSatdik.length} Satdik
              </span>
            </div>
          </div>

          {/* Quick List Strip of filtered Satdik at bottom of map */}
          <div className="mt-2.5 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-700">
            {filteredSatdik.map((s) => {
              const isSelected = selectedSatdikId === s.id;
              const metrics = satdikBreakdown[s.id] || { avgScore: 80 };
              const colors = getPinColor(metrics.avgScore);

              return (
                <button
                  key={s.id}
                  onClick={() => setSelectedSatdikId(s.id)}
                  onDoubleClick={() => handleFocusSatdik(s)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs whitespace-nowrap transition-all border ${
                    isSelected
                      ? 'bg-cyan-950/80 border-cyan-500 text-white shadow-xs font-bold'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                  title={`${s.name} - Klik untuk memilih, klik ganda untuk fokus di peta`}
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

        {/* Right Column: Selected Satdik Detailed Inspector Card (4 Cols) */}
        <div className="lg:col-span-4 bg-slate-800/90 rounded-2xl p-4 sm:p-5 border border-slate-700/70 shadow-md flex flex-col justify-between">
          <div>
            {/* Campus Header & Badge */}
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
                
                {/* Button to focus this satdik on map */}
                <button
                  type="button"
                  onClick={handleFocusSelectedSatdik}
                  className="inline-flex items-center gap-1 mt-2 px-2.5 py-1 rounded-lg bg-cyan-950/80 hover:bg-cyan-600 text-cyan-300 hover:text-white border border-cyan-700/60 text-[11px] font-semibold transition-all active:scale-95 shadow-2xs"
                  title="Arahkan dan perbesar peta ke lokasi kampus ini"
                >
                  <Locate className="w-3 h-3" />
                  <span>Fokus Lokasi di Peta</span>
                </button>
              </div>

              <div className="text-right flex-shrink-0">
                <span className="text-[10px] text-slate-400 block">Akreditasi</span>
                <span className="text-xs font-bold text-emerald-400 px-2 py-0.5 bg-emerald-500/10 rounded border border-emerald-500/30">
                  {selectedSatdik.akreditasi}
                </span>
              </div>
            </div>

            {/* Campus Profile Stats */}
            <div className="grid grid-cols-2 gap-2 my-3 text-xs">
              <div className="bg-slate-900/70 p-2.5 rounded-xl border border-slate-800">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <School className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Program Studi</span>
                </div>
                <div className="text-base font-bold text-white mt-1">
                  {selectedSatdik.prodi?.length || 0} <span className="text-[10px] text-slate-400 font-normal">Program Kejuruan</span>
                </div>
                <div className="text-[10px] text-slate-400">Berdiri Tahun {selectedSatdik.establishedYear}</div>
              </div>

              <div className="bg-slate-900/70 p-2.5 rounded-xl border border-slate-800">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Luas Kampus</span>
                </div>
                <div className="text-base font-bold text-white mt-1">
                  {selectedSatdik.luasLahanHa} <span className="text-[10px] text-slate-400 font-normal">Hektar</span>
                </div>
                <div className="text-[10px] text-slate-400">{selectedSatdik.luasBangunanM2.toLocaleString()} m² Bangunan</div>
              </div>
            </div>

            {/* Sarpras Metrics Box */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-4 rounded-xl border border-slate-700/80 mb-4 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-300">Ringkasan Sarpras Kampus</span>
                <span className="text-xs font-bold text-cyan-400">
                  {selectedMetrics.count} Sarpras Terdata
                </span>
              </div>

              {/* Progress bar of condition score */}
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

              {/* Condition Grid Counters (BMN DJKN Standard: Baik, Rusak Ringan, Rusak Berat) */}
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

            {/* List of Key Assets in this campus */}
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

          {/* Action Button: Jump to Explorer with this Satdik Filter */}
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
