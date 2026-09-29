import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Layers, 
  Building2, 
  Ship, 
  Fish, 
  Boxes, 
  Anchor, 
  Factory, 
  Briefcase,
  Compass,
  CheckCircle2, 
  AlertTriangle, 
  ArrowUpDown, 
  LayoutGrid, 
  List, 
  RotateCcw,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Download
} from 'lucide-react';
import { SATDIK_LIST, SARPRAS_CATEGORIES } from '../data/kkpData';
import { exportAssetsToExcel } from '../utils/excelExport';
import AssetDetailModal from './AssetDetailModal';

export default function AssetExplorer({
  assets,
  initialSatdikFilter = 'ALL',
  initialCategoryFilter = 'ALL',
  onUpdateAsset,
  onUpdateAssetCondition,
  currentUser
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSatdik, setSelectedSatdik] = useState(initialSatdikFilter);
  const [selectedCategory, setSelectedCategory] = useState(initialCategoryFilter);
  const [selectedCondition, setSelectedCondition] = useState('ALL');
  const [selectedUrgency, setSelectedUrgency] = useState('ALL');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'
  
  // Sorting state
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc'); // 'asc' | 'desc'

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Selected asset for modal (tracked reactively)
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const activeModalAsset = useMemo(() => {
    if (!selectedAsset) return null;
    return assets.find(a => a.id === selectedAsset.id) || selectedAsset;
  }, [assets, selectedAsset]);

  // Sync if props change
  React.useEffect(() => {
    if (initialSatdikFilter) setSelectedSatdik(initialSatdikFilter);
  }, [initialSatdikFilter]);

  React.useEffect(() => {
    if (initialCategoryFilter) setSelectedCategory(initialCategoryFilter);
  }, [initialCategoryFilter]);

  // Filter and sort logic
  const filteredAssets = useMemo(() => {
    return assets.filter(item => {
      const matchSearch = searchQuery === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.bmnCode && item.bmnCode.toLowerCase().includes(searchQuery.toLowerCase())) ||
        item.satdikName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.specs && item.specs.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchSatdik = selectedSatdik === 'ALL' || item.satdikId === selectedSatdik;
      const matchCat = selectedCategory === 'ALL' || item.category === selectedCategory;
      const matchCond = selectedCondition === 'ALL' || item.condition === selectedCondition;
      const matchUrg = selectedUrgency === 'ALL' || item.maintenanceUrgency === selectedUrgency;

      return matchSearch && matchSatdik && matchCat && matchCond && matchUrg;
    }).sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (sortField === 'valuation' || sortField === 'conditionScore' || sortField === 'utilizationRate' || sortField === 'acquisitionYear') {
        valA = Number(valA) || 0;
        valB = Number(valB) || 0;
      } else if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = (valB || '').toLowerCase();
      }

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [assets, searchQuery, selectedSatdik, selectedCategory, selectedCondition, selectedUrgency, sortField, sortDirection]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredAssets.length / itemsPerPage) || 1;
  const paginatedAssets = filteredAssets.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedSatdik('ALL');
    setSelectedCategory('ALL');
    setSelectedCondition('ALL');
    setSelectedUrgency('ALL');
    setCurrentPage(1);
  };

  const handleExportFilteredExcel = () => {
    const satdikObj = SATDIK_LIST.find(s => s.id === selectedSatdik);
    const catObj = SARPRAS_CATEGORIES.find(c => c.id === selectedCategory);

    exportAssetsToExcel(filteredAssets, {
      currentUser,
      filterSatdikName: selectedSatdik === 'ALL' ? 'Semua Satdik (18 Kampus)' : (satdikObj?.name || selectedSatdik),
      filterCategoryName: selectedCategory === 'ALL' ? 'Semua Bidang' : (catObj?.name || selectedCategory),
      filenamePrefix: `SARPRAS_KKP_${selectedSatdik !== 'ALL' ? selectedSatdik : 'Inventaris'}`
    });
  };

  const openDetail = (asset) => {
    setSelectedAsset(asset);
    setIsModalOpen(true);
  };

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'penangkapan_mesin': return Ship;
      case 'budidaya_perikanan': return Fish;
      case 'pengolahan_hasil': return Boxes;
      case 'agribisnis_penyuluhan': return Factory;
      case 'konservasi_pariwisata': return Compass;
      case 'maritim_kapal': return Ship;
      case 'akuakultur': return Fish;
      case 'pengolahan_upi': return Boxes;
      case 'alat_tangkap': return Ship;
      case 'tefa': return Factory;
      case 'administrasi_umum': return Briefcase;
      default: return Building2;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-slate-800/90 rounded-2xl p-5 border border-slate-700/70 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Katalog Inventaris Sarana & Prasarana
            </span>
            <span className="text-slate-400 text-xs">• Database SARPRAS KKP</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1 flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <span>Eksplorasi & Inventaris Sarana Prasarana</span>
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Pencarian cerdas dan pemfilteran multidimensi seluruh aset fisik, kapal latih, laboratorium, dan TEFA vokasi.
          </p>
        </div>

        {/* View mode toggle & reset */}
        <div className="flex items-center gap-2 self-start md:self-center">
          <div className="flex items-center bg-slate-900 rounded-xl p-1 border border-slate-700">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                viewMode === 'table' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Tampilan Tabel Data"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                viewMode === 'grid' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Tampilan Kartu Grid"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleResetFilters}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs transition-colors"
            title="Reset semua filter ke kondisi awal"
          >
            <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Multi-Dimensional Filter Toolbar */}
      <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/70 shadow-md space-y-3">
        {/* Row 1: Search & Primary Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="lg:col-span-4 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama sarpras atau spesifikasi..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full pl-9 pr-4 py-2 bg-slate-900 text-slate-100 placeholder-slate-400 text-xs rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Satuan Pendidikan */}
          <div className="lg:col-span-3">
            <select
              value={selectedSatdik}
              onChange={(e) => { setSelectedSatdik(e.target.value); setCurrentPage(1); }}
              className="w-full py-2 px-3 bg-slate-900 text-slate-200 text-xs rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-500 truncate"
            >
              <option value="ALL">Semua Satdik (18 Kampus)</option>
              {SATDIK_LIST.map(s => (
                <option key={s.id} value={s.id}>{s.shortName} ({s.kota})</option>
              ))}
            </select>
          </div>

          {/* Bidang Sarpras */}
          <div className="lg:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
              className="w-full py-2 px-3 bg-slate-900 text-slate-200 text-xs rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-500 truncate"
            >
              <option value="ALL">Semua Bidang Sarpras</option>
              {SARPRAS_CATEGORIES.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Kondisi Fisik */}
          <div className="lg:col-span-2">
            <select
              value={selectedCondition}
              onChange={(e) => { setSelectedCondition(e.target.value); setCurrentPage(1); }}
              className="w-full py-2 px-3 bg-slate-900 text-slate-200 text-xs rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">Semua Kondisi</option>
              <option value="Baik">Baik (Layak Penuh)</option>
              <option value="Rusak Ringan">Rusak Ringan</option>
              <option value="Rusak Berat">Rusak Berat (Kritis)</option>
            </select>
          </div>
        </div>

        {/* Row 2: Secondary Quick Filter Chips */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-700/60 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-400 text-[11px] flex items-center gap-1">
              <Filter className="w-3 h-3 text-cyan-400" />
              <span>Filter Cepat:</span>
            </span>

            {/* Urgensi Filter */}
            <button
              onClick={() => { setSelectedUrgency(selectedUrgency === 'Kritis / Segera' ? 'ALL' : 'Kritis / Segera'); setCurrentPage(1); }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-colors ${
                selectedUrgency === 'Kritis / Segera'
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              ⚠ Urgensi Kritis ({assets.filter(a => a.maintenanceUrgency === 'Kritis / Segera').length})
            </button>

            {/* Penangkapan & Permesinan Only */}
            <button
              onClick={() => { setSelectedCategory(selectedCategory === 'penangkapan_mesin' ? 'ALL' : 'penangkapan_mesin'); setCurrentPage(1); }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-colors ${
                selectedCategory === 'penangkapan_mesin'
                  ? 'bg-sky-500/20 text-sky-300 border-sky-500/50'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              ⚓ Penangkapan & Permesinan ({assets.filter(a => a.category === 'penangkapan_mesin').length})
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-slate-400 text-xs hidden sm:inline">
              Menampilkan <span className="font-bold text-white">{filteredAssets.length}</span> dari {assets.length} Aset
            </span>

            <button
              onClick={handleExportFilteredExcel}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 text-emerald-200 border border-emerald-700/60 text-xs font-semibold shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
              title="Ekspor tabel aset yang tersaring saat ini ke Microsoft Excel (.xls) dengan format resmi & rapi"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Ekspor Excel ({filteredAssets.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area: Table View or Grid View */}
      {viewMode === 'table' ? (
        <div className="bg-slate-800/90 rounded-2xl border border-slate-700/70 shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900/90 text-slate-300 border-b border-slate-700/80 font-semibold uppercase tracking-wider text-[11px]">
                  <th 
                    onClick={() => handleSort('name')} 
                    className="p-3.5 cursor-pointer hover:text-cyan-400 transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Nama Sarana & Prasarana</span>
                      <ArrowUpDown className="w-3.5 h-3.5 opacity-60" />
                    </div>
                  </th>
                  <th 
                    onClick={() => handleSort('satdikName')} 
                    className="p-3.5 cursor-pointer hover:text-cyan-400 transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Satuan Pendidikan</span>
                      <ArrowUpDown className="w-3.5 h-3.5 opacity-60" />
                    </div>
                  </th>
                  <th 
                    onClick={() => handleSort('category')} 
                    className="p-3.5 cursor-pointer hover:text-cyan-400 transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Bidang</span>
                      <ArrowUpDown className="w-3.5 h-3.5 opacity-60" />
                    </div>
                  </th>
                  <th 
                    onClick={() => handleSort('conditionScore')} 
                    className="p-3.5 cursor-pointer hover:text-cyan-400 transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Kondisi & Skor</span>
                      <ArrowUpDown className="w-3.5 h-3.5 opacity-60" />
                    </div>
                  </th>
                  <th 
                    onClick={() => handleSort('utilizationRate')} 
                    className="p-3.5 cursor-pointer hover:text-cyan-400 transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Utilisasi</span>
                      <ArrowUpDown className="w-3.5 h-3.5 opacity-60" />
                    </div>
                  </th>
                  <th className="p-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {paginatedAssets.length > 0 ? (
                  paginatedAssets.map((asset) => {
                    const CategoryIcon = getCategoryIcon(asset.category);
                    return (
                      <tr 
                        key={asset.id} 
                        className="hover:bg-slate-700/40 transition-colors cursor-pointer"
                        onClick={() => openDetail(asset)}
                      >
                        {/* Name & BMN Code */}
                        <td className="p-3.5">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center flex-shrink-0">
                              <CategoryIcon className="w-4 h-4" />
                            </div>
                            <div className="max-w-[260px] truncate">
                              <span className="font-bold text-white block truncate" title={asset.name}>
                                {asset.name}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Satdik */}
                        <td className="p-3.5 text-slate-300">
                          <span className="font-medium block max-w-[200px] truncate" title={asset.satdikName}>
                            {asset.satdikName}
                          </span>
                          <span className="text-[10px] text-slate-400">Thn Perolehan: {asset.acquisitionYear}</span>
                        </td>

                        {/* Category */}
                        <td className="p-3.5">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-900 border border-slate-700 text-slate-300">
                            {asset.subcategory || asset.category}
                          </span>
                        </td>

                        {/* Condition & Score */}
                        <td className="p-3.5">
                          <div className="space-y-1 max-w-[130px]">
                            <div className="flex items-center justify-between">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                asset.condition === 'Baik' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' :
                                asset.condition === 'Rusak Ringan' ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30' :
                                'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                              }`}>
                                {asset.condition}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">{asset.conditionScore}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  asset.conditionScore >= 85 ? 'bg-emerald-500' :
                                  asset.conditionScore >= 75 ? 'bg-sky-500' :
                                  asset.conditionScore >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                                }`}
                                style={{ width: `${asset.conditionScore}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>

                        {/* Utilization */}
                        <td className="p-3.5">
                          <div className="space-y-1 max-w-[100px]">
                            <span className="font-semibold text-slate-200">{asset.utilizationRate}%</span>
                            <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-cyan-500 rounded-full" 
                                style={{ width: `${asset.utilizationRate}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>

                        {/* Action */}
                        <td className="p-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => openDetail(asset)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 text-[11px] font-medium transition-colors"
                          >
                            <span>Detail</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-slate-400">
                      Tidak ada aset sarpras yang cocok dengan kriteria filter yang dipilih.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid Card View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedAssets.length > 0 ? (
            paginatedAssets.map((asset) => {
              const CategoryIcon = getCategoryIcon(asset.category);
              return (
                <div
                  key={asset.id}
                  onClick={() => openDetail(asset)}
                  className="bg-slate-800/90 hover:bg-slate-800 rounded-2xl p-4 border border-slate-700/70 hover:border-cyan-500/50 shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    {/* Top Row: Category Icon & Condition Pill */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                          <CategoryIcon className="w-4 h-4" />
                        </div>
                      </div>

                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        asset.condition === 'Baik' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' :
                        asset.condition === 'Rusak Ringan' ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30' :
                        'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                      }`}>
                        {asset.condition}
                      </span>
                    </div>

                    <h4 className="font-bold text-white text-sm mt-3 group-hover:text-cyan-300 transition-colors line-clamp-1">
                      {asset.name}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                      {asset.satdikName}
                    </p>

                    <p className="text-xs text-slate-300 mt-2 line-clamp-2 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                      {asset.specs || asset.capacityDesc}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Tahun Perolehan</span>
                      <span className="font-bold text-slate-200">{asset.acquisitionYear}</span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">Utilisasi</span>
                      <span className="font-bold text-cyan-400">{asset.utilizationRate}%</span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full p-8 text-center text-slate-400 bg-slate-800/40 rounded-2xl border border-slate-700">
              Tidak ada aset sarpras yang ditemukan.
            </div>
          )}
        </div>
      )}

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-slate-800/80 px-4 py-3 rounded-2xl border border-slate-700/70 text-xs text-slate-300">
          <div>
            Halaman <span className="font-bold text-white">{currentPage}</span> dari {totalPages}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-900 text-slate-200 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-7 h-7 rounded-lg text-xs font-semibold transition-colors ${
                  currentPage === i + 1
                    ? 'bg-cyan-600 text-white'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-900 text-slate-200 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Modal Inspector for details */}
      <AssetDetailModal
        asset={activeModalAsset}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedAsset(null);
        }}
        onUpdateAsset={onUpdateAsset || onUpdateAssetCondition}
        onUpdateCondition={onUpdateAsset || onUpdateAssetCondition}
        currentUser={currentUser}
      />
    </div>
  );
}
