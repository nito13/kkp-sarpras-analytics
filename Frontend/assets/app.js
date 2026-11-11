/**
 * assets/js/app.js
 * Komponen Utama Antarmuka Web Sarana dan Prasarana Satuan Pendidikan KP (Tampilan Asli Utuh)
 * Mudah dipantau dan diubah langsung tanpa perlu proses build ulang.
 */
(function () {
  'use strict';
  const React = window.__VENDOR__.React;
// ============================================================================
// MODULE: src/context/ThemeContext.jsx
// ============================================================================
(() => {
	// src/context/ThemeContext.jsx
	const { createContext, useContext, useState, useEffect } = React;
	const ThemeContext = createContext();
	const THEME_STORAGE_KEY = "kkp_theme_mode";
	window.__ThemeProvider = function ThemeProvider({ children }) {
		const [theme, setTheme] = useState(() => {
			try {
				const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
				if (savedTheme === "light" || savedTheme === "dark") {
					return savedTheme;
				}
			} catch {}
			// Default to dark theme for official operations room aesthetic
			return "dark";
		});
		useEffect(() => {
			const root = document.documentElement;
			if (theme === "light") {
				root.classList.remove("dark");
				root.classList.add("light");
			} else {
				root.classList.remove("light");
				root.classList.add("dark");
			}
			try {
				localStorage.setItem(THEME_STORAGE_KEY, theme);
			} catch (e) {
				console.warn("Failed to save theme to localStorage", e);
			}
		}, [theme]);
		const toggleTheme = () => {
			setTheme((prev) => prev === "dark" ? "light" : "dark");
		};
		return /* @__PURE__ */ React.createElement(ThemeContext.Provider, { value: {
			theme,
			setTheme,
			toggleTheme,
			isDark: theme === "dark"
		} }, children);
	};
	window.__useTheme = function useTheme() {
		const context = useContext(ThemeContext);
		if (!context) {
			throw new Error("useTheme must be used within a ThemeProvider");
		}
		return context;
	};
})();
const ThemeProvider = window.__ThemeProvider;
const useTheme = window.__useTheme;
// ============================================================================
// MODULE: src/components/Navbar.jsx
// ============================================================================
(() => {
	const { Anchor, BarChart3, MapPin, Layers, Bed, GraduationCap, Fish, AlertTriangle, PlusCircle, Download, Ship, Sparkles, Activity, User, LogOut, Sun, Moon, ChevronRight, X } = window.__VENDOR__.Lucide;
	const logoKkp = window.__LOGO_KKP || "Frontend/assets/logo-kkp.png";

	const NAV_MENU_ITEMS = [
		{
			id: "dashboard",
			label: "Ringkasan Eksekutif",
			shortLabel: "Beranda",
			section: "main",
			icon: BarChart3
		},
		{
			id: "map",
			label: "Peta Sebaran Geospasial",
			shortLabel: "Peta GIS",
			section: "main",
			icon: MapPin
		},
		{
			id: "asrama",
			label: "Kapasitas Asrama",
			shortLabel: "Asrama",
			section: "vokasi",
			icon: Bed
		},
		{
			id: "tambak",
			label: "Tambak & Kolam",
			shortLabel: "Tambak",
			section: "vokasi",
			icon: Fish
		},
		{
			id: "standar",
			label: "Standar Sarpras Prodi",
			shortLabel: "Standar",
			section: "vokasi",
			icon: GraduationCap
		},
		{
			id: "maintenance",
			label: "Early Warning & Perbaikan",
			shortLabel: "Perbaikan",
			section: "vokasi",
			icon: AlertTriangle,
			hasBadge: true
		}
	];

	// Ikon Hamburger 3-Garis khas YouTube
	function YouTubeHamburgerIcon({ className = "w-5 h-5" }) {
		return /* @__PURE__ */ React.createElement("svg", {
			className,
			viewBox: "0 0 24 24",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "2",
			strokeLinecap: "round",
			strokeLinejoin: "round"
		},
			/* @__PURE__ */ React.createElement("line", { x1: "3", y1: "6", x2: "21", y2: "6" }),
			/* @__PURE__ */ React.createElement("line", { x1: "3", y1: "12", x2: "21", y2: "12" }),
			/* @__PURE__ */ React.createElement("line", { x1: "3", y1: "18", x2: "21", y2: "18" })
		);
	}

	window.__Navbar = function Navbar({
		activeTab,
		setActiveTab,
		totalAssets,
		criticalCount,
		onOpenAddModal,
		onExportCSV,
		onExportExcel,
		currentUser,
		onOpenProfile,
		onLogout,
		dbStatus,
		onToggleSidebar,
		isSidebarOpen,
		showTopNav = false // Disembunyikan saat mode navigasi YouTube aktif; siap dikembalikan kapan saja bila diperlukan
	}) {
		const { isDark, toggleTheme } = useTheme();
		const navItems = NAV_MENU_ITEMS.map((item) => ({
			...item,
			badge: item.hasBadge && criticalCount > 0 ? criticalCount : null,
			badgeColor: "bg-rose-500 text-white animate-pulse"
		}));
		const activeItemObj = navItems.find((i) => i.id === activeTab) || navItems[0];

		return /* @__PURE__ */ React.createElement("header", {
			className: "app-top-navbar sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-xl transition-colors duration-200",
			style: { position: "sticky", top: 0, zIndex: 40, width: "100%", flexShrink: 0 }
		}, /* @__PURE__ */ React.createElement("div", { className: "w-full px-3 sm:px-5" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between h-14 sm:h-16" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center space-x-2 sm:space-x-3 min-w-0" }, /* @__PURE__ */ React.createElement("button", {
			type: "button",
			onClick: onToggleSidebar,
			className: "w-10 h-10 rounded-full hover:bg-slate-800 active:bg-slate-700 text-slate-200 flex items-center justify-center transition-colors flex-shrink-0 focus:outline-none",
			title: isSidebarOpen ? "Kecilkan Menu Samping (Mode Mini YouTube)" : "Buka Menu Navigasi Samping",
			"aria-label": "Toggle Navigasi Samping"
		}, /* @__PURE__ */ React.createElement(YouTubeHamburgerIcon, { className: "w-5 h-5" })), /* @__PURE__ */ React.createElement("div", {
			className: "flex items-center space-x-2 sm:space-x-3 cursor-pointer min-w-0",
			onClick: () => setActiveTab("dashboard")
		}, /* @__PURE__ */ React.createElement("div", { className: `header-logo-container w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white p-1 flex items-center justify-center shadow-lg hover:scale-105 transition-transform flex-shrink-0 border ${isDark ? "border-cyan-400/50 shadow-cyan-500/20" : "border-black shadow-slate-400/20"}` }, /* @__PURE__ */ React.createElement("img", {
			src: logoKkp,
			alt: "Logo Resmi Kementerian Kelautan dan Perikanan",
			className: "w-full h-full object-contain"
		})), /* @__PURE__ */ React.createElement("div", { className: "min-w-0" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement("h1", { className: "text-sm sm:text-lg font-bold text-white tracking-tight leading-tight truncate" }, "Sarana dan Prasarana ", /* @__PURE__ */ React.createElement("span", { className: "text-cyan-400 font-extrabold" }, "Satuan Pendidikan KP")), /* @__PURE__ */ React.createElement("span", { className: "hidden lg:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-800 text-cyan-300 border border-slate-700" }, /* @__PURE__ */ React.createElement(activeItemObj.icon, { className: "w-3.5 h-3.5 text-cyan-400" }), /* @__PURE__ */ React.createElement("span", null, activeItemObj.label))), /* @__PURE__ */ React.createElement("p", { className: "text-[11px] text-slate-400 hidden sm:block truncate" }, "Dashboard Analitik Sarana & Prasarana Vokasi Kelautan & Perikanan")))), /* @__PURE__ */ React.createElement("div", { className: "flex items-center space-x-1.5 sm:space-x-2" }, currentUser?.permissions?.includes("edit_all") || currentUser?.permissions?.includes("edit_own") ? /* @__PURE__ */ React.createElement("button", {
			onClick: () => onOpenAddModal && onOpenAddModal(activeTab),
			className: "hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs shadow-md shadow-cyan-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]",
			title: "Input data aset BMN, gedung asrama, atau item standar prodi baru"
		}, /* @__PURE__ */ React.createElement(PlusCircle, { className: "w-4 h-4" }), /* @__PURE__ */ React.createElement("span", null, "Tambah Sarpras")) : null, /* @__PURE__ */ React.createElement("button", {
			onClick: onExportExcel || onExportCSV,
			className: "hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-emerald-200 border border-emerald-700/60 text-xs font-semibold shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]",
			title: "Ekspor laporan komprehensif seluruh data (BMN, Asrama, & Standar Prodi) ke Microsoft Excel (.xlsx)"
		}, /* @__PURE__ */ React.createElement(Download, { className: "w-4 h-4 text-emerald-400" }), /* @__PURE__ */ React.createElement("span", null, "Ekspor Excel (Lengkap)")), /* @__PURE__ */ React.createElement("button", {
			onClick: toggleTheme,
			className: "p-1.5 sm:p-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all hover:scale-105 active:scale-95 flex items-center justify-center shadow-sm flex-shrink-0",
			title: isDark ? "Beralih ke Mode Terang (Light Mode)" : "Beralih ke Mode Gelap (Dark Mode)",
			"aria-label": "Toggle Theme Mode"
		}, isDark ? /* @__PURE__ */ React.createElement(Sun, { className: "w-4 h-4 text-amber-400 animate-pulse" }) : /* @__PURE__ */ React.createElement(Moon, { className: "w-4 h-4 text-sky-500" })), /* @__PURE__ */ React.createElement("div", { className: "flex items-center space-x-1 sm:space-x-1.5 pl-1 sm:pl-2 border-l border-slate-700/80" }, /* @__PURE__ */ React.createElement("button", {
			onClick: onOpenProfile,
			className: "flex items-center gap-1.5 p-1 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-left transition-colors flex-shrink-0",
			title: "Klik untuk melihat profil & hak akses akun"
		}, /* @__PURE__ */ React.createElement("div", { className: "w-7 h-7 rounded-lg bg-cyan-600/30 border border-cyan-400/50 flex items-center justify-center text-cyan-300 font-bold text-xs" }, currentUser?.name ? currentUser.name.charAt(0) : "U"), /* @__PURE__ */ React.createElement("div", { className: "hidden xl:block max-w-[120px] truncate pr-1" }, /* @__PURE__ */ React.createElement("span", { className: "text-[11px] font-bold text-white block truncate leading-tight" }, currentUser?.name?.split(",")[0] || "Pengguna"), /* @__PURE__ */ React.createElement("span", { className: "text-[9px] text-cyan-400 block truncate" }, currentUser?.roleLabel || "Operator"))), /* @__PURE__ */ React.createElement("button", {
			onClick: onLogout,
			className: "flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-600 text-rose-600 dark:text-rose-300 hover:text-white dark:hover:text-white border border-rose-300 dark:border-rose-500/40 hover:border-rose-600 text-xs font-bold transition-all shadow-sm flex-shrink-0 active:scale-95 group",
			title: "Keluar dari sesi",
			"aria-label": "Logout"
		}, /* @__PURE__ */ React.createElement(LogOut, { className: "w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-500 dark:text-rose-400 group-hover:text-white transition-colors" }), /* @__PURE__ */ React.createElement("span", { className: "text-[11px] sm:text-xs font-bold tracking-tight" }, "Keluar"))))), showTopNav && /* @__PURE__ */ React.createElement("div", { className: "hidden md:flex items-center space-x-1 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-slate-700" }, navItems.map((tab) => {
			const Icon = tab.icon;
			const isActive = activeTab === tab.id;
			return /* @__PURE__ */ React.createElement("button", {
				key: tab.id,
				onClick: () => setActiveTab(tab.id),
				className: `relative flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-all duration-200 ${isActive ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-900/50" : "text-slate-300 hover:text-white hover:bg-slate-800/70"}`
			}, /* @__PURE__ */ React.createElement(Icon, { className: `w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}` }), /* @__PURE__ */ React.createElement("span", null, tab.label), tab.badge && /* @__PURE__ */ React.createElement("span", { className: `px-1.5 py-0.2 text-[10px] font-bold rounded-full ${tab.badgeColor}` }, tab.badge), isActive && /* @__PURE__ */ React.createElement("span", { className: "absolute bottom-0 left-2 right-2 h-0.5 bg-cyan-300 rounded-full" }));
		}))));
	};

	// Navigasi Samping Gaya YouTube (Expanded Guide + Mini Rail + Mobile Drawer)
	window.__YouTubeSidebar = function YouTubeSidebar({
		activeTab,
		setActiveTab,
		isOpen,
		isMobileOpen,
		onCloseMobile,
		criticalCount,
		onOpenAddModal,
		onExportExcel,
		currentUser,
		dbStatus
	}) {
		const { isDark } = useTheme();
		const canEdit = currentUser?.permissions?.includes("edit_all") || currentUser?.permissions?.includes("edit_own");
		const items = NAV_MENU_ITEMS.map((item) => ({
			...item,
			badge: item.hasBadge && criticalCount > 0 ? criticalCount : null
		}));
		const mainItems = items.filter((i) => i.section === "main");
		const vokasiItems = items.filter((i) => i.section === "vokasi");

		const renderExpandedItem = (tab) => {
			const Icon = tab.icon;
			const isActive = activeTab === tab.id;
			return /* @__PURE__ */ React.createElement("button", {
				key: tab.id,
				type: "button",
				onClick: () => setActiveTab(tab.id),
				className: `w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all duration-150 group ${
					isActive
						? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold shadow-md shadow-cyan-950/50"
						: "text-slate-300 hover:bg-slate-800/80 hover:text-white font-medium"
				}`
			},
				/* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3.5 min-w-0" },
					/* @__PURE__ */ React.createElement(Icon, { className: `w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-105 ${isActive ? "text-white" : "text-slate-400 group-hover:text-cyan-400"}` }),
					/* @__PURE__ */ React.createElement("span", { className: "truncate text-left" }, tab.label)
				),
				tab.badge && /* @__PURE__ */ React.createElement("span", {
					className: `ml-2 px-1.5 py-0.5 text-[10px] font-bold rounded-full flex-shrink-0 ${
						isActive ? "bg-white text-rose-600" : "bg-rose-500 text-white animate-pulse"
					}`
				}, tab.badge)
			);
		};

		const renderMiniRailItem = (tab) => {
			const Icon = tab.icon;
			const isActive = activeTab === tab.id;
			return /* @__PURE__ */ React.createElement("button", {
				key: tab.id,
				type: "button",
				onClick: () => setActiveTab(tab.id),
				title: tab.label,
				className: `relative w-full py-2.5 px-1 rounded-xl flex flex-col items-center justify-center gap-1 transition-all duration-150 group ${
					isActive
						? "bg-gradient-to-b from-cyan-600 to-blue-600 text-white font-bold shadow-md shadow-cyan-950/40"
						: "text-slate-400 hover:bg-slate-800/80 hover:text-white font-medium"
				}`
			},
				/* @__PURE__ */ React.createElement("div", { className: "relative" },
					/* @__PURE__ */ React.createElement(Icon, { className: `w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? "text-white" : "text-slate-400 group-hover:text-cyan-400"}` }),
					tab.badge && /* @__PURE__ */ React.createElement("span", {
						className: "absolute -top-1.5 -right-2.5 px-1 min-w-[15px] h-[15px] text-[9px] font-bold bg-rose-500 text-white rounded-full flex items-center justify-center"
					}, tab.badge)
				),
				/* @__PURE__ */ React.createElement("span", { className: "text-[10px] leading-tight text-center truncate w-full px-0.5" }, tab.shortLabel)
			);
		};

		const sidebarWidth = isOpen ? "240px" : "78px";

		return /* @__PURE__ */ React.createElement(React.Fragment, null,
			/* DESKTOP SIDEBAR (YOUTUBE GUIDE / MINI RAIL - STICKY IN-FLOW AGAR TIDAK MENUMPUK KONTEN) */
			/* @__PURE__ */ React.createElement("aside", {
				className: `app-sidebar hidden md:flex flex-col flex-shrink-0 sticky bg-slate-900/95 backdrop-blur-md border-r border-slate-800/90 transition-all duration-200 select-none z-30 ${
					isOpen ? "w-60" : "w-[78px]"
				}`,
				style: {
					position: "sticky",
					top: "4rem",
					height: "calc(100vh - 4rem)",
					maxHeight: "calc(100vh - 4rem)",
					width: sidebarWidth,
					minWidth: sidebarWidth,
					alignSelf: "flex-start",
					flexShrink: 0,
					zIndex: 30
				}
			},
				isOpen
					? /* @__PURE__ */ React.createElement("div", { className: "flex-1 overflow-y-auto px-3 py-3 space-y-1 scrollbar-thin scrollbar-thumb-slate-700" },
						/* Bagian 1: Navigasi Utama */
						mainItems.map(renderExpandedItem),
						/* Garis Pemisah */
						/* @__PURE__ */ React.createElement("div", { className: "my-2.5 border-t border-slate-800/80" }),
						/* Bagian 2: Fasilitas & Standar Vokasi */
						/* @__PURE__ */ React.createElement("div", { className: "px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400" }, "Fasilitas & Standar"),
						vokasiItems.map(renderExpandedItem),
						/* Garis Pemisah */
						/* @__PURE__ */ React.createElement("div", { className: "my-2.5 border-t border-slate-800/80" }),
						/* Bagian 3: Pintasan Aksi */
						/* @__PURE__ */ React.createElement("div", { className: "px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400" }, "Pintasan Cepat"),
						canEdit && /* @__PURE__ */ React.createElement("button", {
							type: "button",
							onClick: () => onOpenAddModal && onOpenAddModal(activeTab),
							className: "w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-medium text-cyan-400 hover:bg-slate-800/80 transition-colors"
						},
							/* @__PURE__ */ React.createElement(PlusCircle, { className: "w-5 h-5 flex-shrink-0" }),
							/* @__PURE__ */ React.createElement("span", { className: "truncate" }, "Tambah Data Sarpras")
						),
						/* @__PURE__ */ React.createElement("button", {
							type: "button",
							onClick: onExportExcel,
							className: "w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-medium text-emerald-400 hover:bg-slate-800/80 transition-colors"
						},
							/* @__PURE__ */ React.createElement(Download, { className: "w-5 h-5 flex-shrink-0" }),
							/* @__PURE__ */ React.createElement("span", { className: "truncate" }, "Ekspor Excel Lengkap")
						)
					)
					: /* @__PURE__ */ React.createElement("div", { className: "flex-1 overflow-y-auto px-1.5 py-2.5 space-y-1 flex flex-col items-center scrollbar-thin scrollbar-thumb-slate-700" },
						items.map(renderMiniRailItem)
					),
				/* Footer Sidebar (Saat Diperluas) */
				isOpen && /* @__PURE__ */ React.createElement("div", { className: "p-3.5 border-t border-slate-800/80 text-[11px] text-slate-400 space-y-1" },
					/* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" },
						/* @__PURE__ */ React.createElement("span", { className: `w-2 h-2 rounded-full ${dbStatus?.connected ? "bg-emerald-400" : "bg-amber-400"}` }),
						/* @__PURE__ */ React.createElement("span", { className: "font-semibold text-slate-300 truncate" }, dbStatus?.connected ? "Database MySQL Aktif" : "Mode Data Lokal")
					),
					/* @__PURE__ */ React.createElement("p", { className: "text-[10px] text-slate-500 leading-relaxed" }, "Pusdik KP · BPPSDM KP — 18 Satuan Pendidikan Vokasi")
				)
			),

			/* MOBILE DRAWER OVERLAY (YOUTUBE SLIDE-OUT DRAWER) */
			isMobileOpen && /* @__PURE__ */ React.createElement("div", { className: "fixed inset-0 z-50 md:hidden flex" },
				/* Backdrop */
				/* @__PURE__ */ React.createElement("div", {
					className: "fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity",
					style: { backgroundColor: "rgba(0, 0, 0, 0.65)", backdropFilter: "blur(3px)" },
					onClick: onCloseMobile
				}),
				/* Drawer Panel */
				/* @__PURE__ */ React.createElement("aside", {
					className: "relative w-64 max-w-[82vw] bg-slate-900 border-r border-slate-800 h-full flex flex-col shadow-2xl z-10",
					style: { width: "256px", maxWidth: "82vw" }
				},
					/* Drawer Header */
					/* @__PURE__ */ React.createElement("div", { className: "h-14 px-3 flex items-center justify-between border-b border-slate-800" },
						/* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2.5" },
							/* @__PURE__ */ React.createElement("button", {
								type: "button",
								onClick: onCloseMobile,
								className: "w-9 h-9 rounded-full hover:bg-slate-800 text-slate-200 flex items-center justify-center"
							}, /* @__PURE__ */ React.createElement(YouTubeHamburgerIcon, { className: "w-5 h-5" })),
							/* @__PURE__ */ React.createElement("div", { className: `w-8 h-8 rounded-lg bg-white p-1 flex items-center justify-center border ${isDark ? "border-cyan-400/50" : "border-black"}` },
								/* @__PURE__ */ React.createElement("img", { src: logoKkp, alt: "Logo KKP", className: "w-full h-full object-contain" })
							),
							/* @__PURE__ */ React.createElement("span", { className: "text-sm font-bold text-white" }, "Sarana dan Prasarana ", /* @__PURE__ */ React.createElement("span", { className: "text-cyan-400" }, "Satuan Pendidikan KP"))
						),
						/* @__PURE__ */ React.createElement("button", {
							type: "button",
							onClick: onCloseMobile,
							className: "p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
						}, /* @__PURE__ */ React.createElement(X, { className: "w-4 h-4" }))
					),
					/* Drawer Menu List */
					/* @__PURE__ */ React.createElement("div", { className: "flex-1 overflow-y-auto px-3 py-3 space-y-1" },
						mainItems.map(renderExpandedItem),
						/* @__PURE__ */ React.createElement("div", { className: "my-2.5 border-t border-slate-800/80" }),
						/* @__PURE__ */ React.createElement("div", { className: "px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400" }, "Fasilitas & Standar"),
						vokasiItems.map(renderExpandedItem),
						/* @__PURE__ */ React.createElement("div", { className: "my-2.5 border-t border-slate-800/80" }),
						/* @__PURE__ */ React.createElement("div", { className: "px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400" }, "Pintasan Cepat"),
						canEdit && /* @__PURE__ */ React.createElement("button", {
							type: "button",
							onClick: () => {
								onCloseMobile();
								onOpenAddModal && onOpenAddModal(activeTab);
							},
							className: "w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-medium text-cyan-400 hover:bg-slate-800/80 transition-colors"
						},
							/* @__PURE__ */ React.createElement(PlusCircle, { className: "w-5 h-5 flex-shrink-0" }),
							/* @__PURE__ */ React.createElement("span", { className: "truncate" }, "Tambah Data Sarpras")
						),
						/* @__PURE__ */ React.createElement("button", {
							type: "button",
							onClick: () => {
								onCloseMobile();
								onExportExcel && onExportExcel();
							},
							className: "w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-medium text-emerald-400 hover:bg-slate-800/80 transition-colors"
						},
							/* @__PURE__ */ React.createElement(Download, { className: "w-5 h-5 flex-shrink-0" }),
							/* @__PURE__ */ React.createElement("span", { className: "truncate" }, "Ekspor Excel Lengkap")
						)
					)
				)
			)
		);
	};
})();
const Navbar = window.__Navbar;
const YouTubeSidebar = window.__YouTubeSidebar;
// ============================================================================
// MODULE: src/components/MobileBottomNav.jsx
// ============================================================================
(() => {
	// src/components/MobileBottomNav.jsx
	const { BarChart3, MapPin, Layers, Bed, Fish, GraduationCap, AlertTriangle, PlusCircle } = window.__VENDOR__.Lucide;
	window.__MobileBottomNav = function MobileBottomNav({ activeTab, setActiveTab, criticalCount, onOpenAddModal, canAddAsset }) {
		const tabs = [
			{
				id: "dashboard",
				label: "Ringkasan",
				icon: BarChart3
			},
			{
				id: "map",
				label: "Peta",
				icon: MapPin
			},
			{
				id: "asrama",
				label: "Asrama",
				icon: Bed
			},
			{
				id: "tambak",
				label: "Tambak",
				icon: Fish
			},
			{
				id: "standar",
				label: "Standar",
				icon: GraduationCap
			},
			{
				id: "maintenance",
				label: "Perbaikan",
				icon: AlertTriangle,
				badge: criticalCount > 0 ? criticalCount : null
			}
		];
		return /* @__PURE__ */ React.createElement("nav", { className: "fixed bottom-0 left-0 right-0 z-40 md:hidden bg-slate-900/95 dark:bg-slate-900/95 border-t border-slate-800 dark:border-slate-800 backdrop-blur-lg px-2 py-1.5 shadow-[0_-4px_16px_rgba(0,0,0,0.2)] select-none" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-around max-w-lg mx-auto" }, tabs.map((tab) => {
			const Icon = tab.icon;
			const isActive = activeTab === tab.id;
			return /* @__PURE__ */ React.createElement("button", {
				key: tab.id,
				onClick: () => setActiveTab(tab.id),
				className: `relative flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all ${isActive ? "text-cyan-400 font-bold" : "text-slate-400 hover:text-slate-200 font-medium"}`
			}, /* @__PURE__ */ React.createElement("div", { className: "relative" }, /* @__PURE__ */ React.createElement(Icon, { className: `w-5 h-5 transition-transform ${isActive ? "scale-110 text-cyan-400" : "text-slate-400"}` }), tab.badge && /* @__PURE__ */ React.createElement("span", { className: "absolute -top-1 -right-2 px-1 text-[9px] font-bold bg-rose-500 text-white rounded-full min-w-[14px] h-[14px] flex items-center justify-center" }, tab.badge)), /* @__PURE__ */ React.createElement("span", { className: `text-[10px] mt-0.5 tracking-tight ${isActive ? "font-bold text-cyan-400" : "text-slate-400"}` }, tab.label), isActive && /* @__PURE__ */ React.createElement("span", { className: "w-4 h-0.5 bg-cyan-400 rounded-full mt-0.5" }));
		}), canAddAsset && /* @__PURE__ */ React.createElement("button", {
			onClick: () => onOpenAddModal && onOpenAddModal(activeTab),
			className: "flex flex-col items-center justify-center py-1 px-1 text-cyan-400 hover:text-cyan-300",
			title: "Tambah Data Sarpras Baru"
		}, /* @__PURE__ */ React.createElement(PlusCircle, { className: "w-5 h-5 text-cyan-400" }), /* @__PURE__ */ React.createElement("span", { className: "text-[10px] mt-0.5 tracking-tight font-medium text-cyan-400" }, "+Tambah"))));
	};
})();
const MobileBottomNav = window.__MobileBottomNav;
// ============================================================================
// MODULE: src/components/LoginScreen.jsx
// ============================================================================
(() => {
	const { useState } = React;
	const { Lock, Mail, Eye, EyeOff, AlertCircle, KeyRound, Shield, Sun, Moon } = window.__VENDOR__.Lucide;
	const { authenticateUser } = window.SARPRAS_AUTH;
	const { apiLogin } = window.SARPRAS_API;
	const logoKkp = window.__LOGO_KKP || "Frontend/assets/logo-kkp.png";
	window.__LoginScreen = function LoginScreen({ onLogin }) {
		const { isDark, toggleTheme } = useTheme();
		const [identifier, setIdentifier] = useState("");
		const [password, setPassword] = useState("");
		const [showPassword, setShowPassword] = useState(false);
		const [rememberMe, setRememberMe] = useState(true);
		const [errorMessage, setErrorMessage] = useState("");
		const [isLoading, setIsLoading] = useState(false);

		const handleSubmit = async (e) => {
			e.preventDefault();
			setErrorMessage("");
			setIsLoading(true);
			try {
				const res = await apiLogin(identifier, password);
				if (res.success && res.user) {
					onLogin(res.user, rememberMe);
					return;
				}
				const localUser = authenticateUser(identifier, password);
				if (localUser) {
					onLogin(localUser, rememberMe);
					return;
				}
				setErrorMessage(res.message || "Email atau kata sandi tidak cocok. Silakan periksa kembali kredensial Anda.");
			} catch {
				const localUser = authenticateUser(identifier, password);
				if (localUser) {
					onLogin(localUser, rememberMe);
				} else {
					setErrorMessage("Email atau kata sandi tidak cocok. Silakan periksa kembali kredensial Anda.");
				}
			} finally {
				setIsLoading(false);
			}
		};

		return /* @__PURE__ */ React.createElement("div", { className: "min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 flex flex-col justify-between p-4 sm:p-6 text-slate-100 relative overflow-hidden font-sans selection:bg-cyan-500 selection:text-white" },
			/* @__PURE__ */ React.createElement("div", {
				className: "absolute inset-0 opacity-10 pointer-events-none",
				style: {
					backgroundImage: "radial-gradient(circle, #0284c7 1px, transparent 1px)",
					backgroundSize: "28px 28px"
				}
			}),
			/* @__PURE__ */ React.createElement("div", { className: "absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-600/10 blur-[120px] pointer-events-none" }),
			/* @__PURE__ */ React.createElement("div", { className: "absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" }),

			/* TOP BAR THEME TOGGLE */
			/* @__PURE__ */ React.createElement("div", { className: "max-w-4xl mx-auto w-full flex items-center justify-end text-xs py-2 text-slate-400 relative z-10" },
				/* @__PURE__ */ React.createElement("button", {
					type: "button",
					onClick: toggleTheme,
					className: "p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center justify-center",
					title: isDark ? "Beralih ke Mode Terang (Light Mode)" : "Beralih ke Mode Gelap (Dark Mode)",
					"aria-label": "Toggle Theme"
				}, isDark
					? /* @__PURE__ */ React.createElement(Sun, { className: "w-3.5 h-3.5 text-amber-400" })
					: /* @__PURE__ */ React.createElement(Moon, { className: "w-3.5 h-3.5 text-sky-400" })
				)
			),

			/* LOGIN CARD */
			/* @__PURE__ */ React.createElement("div", { className: "max-w-md mx-auto w-full my-auto py-6 relative z-10" },
				/* @__PURE__ */ React.createElement("div", { className: "bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-cyan-950/40 relative" },
					/* @__PURE__ */ React.createElement("div", { className: "text-center space-y-3 pb-6 border-b border-slate-800" },
						/* @__PURE__ */ React.createElement("div", { className: `login-logo-container w-20 h-20 mx-auto rounded-2xl bg-white p-2 shadow-xl flex items-center justify-center transform hover:scale-105 transition-transform duration-300 border-2 ${isDark ? "border-cyan-400/60 shadow-cyan-500/20" : "border-black shadow-slate-400/20"}` },
							/* @__PURE__ */ React.createElement("img", {
								src: logoKkp,
								alt: "Logo Kementerian Kelautan dan Perikanan",
								className: "w-full h-full object-contain"
							})
						),
						/* @__PURE__ */ React.createElement("div", null,
							/* @__PURE__ */ React.createElement("span", { className: "text-[11px] font-bold text-cyan-400 uppercase tracking-widest block" }, "Kementerian Kelautan dan Perikanan Republik Indonesia"),
							/* @__PURE__ */ React.createElement("h1", { className: "text-lg sm:text-2xl font-black text-white tracking-tight mt-1" }, "Sarana dan Prasarana ", /* @__PURE__ */ React.createElement("span", { className: "text-cyan-400" }, "Satuan Pendidikan KP")),
							/* @__PURE__ */ React.createElement("p", { className: "text-xs text-slate-400 mt-1 max-w-sm mx-auto" }, "Sistem Informasi & Analitik Sarana Prasarana Satuan Pendidikan Vokasi Kelautan dan Perikanan (BPPSDM KP)")
						)
					),

					errorMessage && /* @__PURE__ */ React.createElement("div", { className: "mt-5 p-3.5 bg-rose-950/80 border border-rose-500/50 rounded-xl text-xs text-rose-300 flex items-start gap-2.5 animate-shake" },
						/* @__PURE__ */ React.createElement(AlertCircle, { className: "w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" }),
						/* @__PURE__ */ React.createElement("span", null, errorMessage)
					),

					/* @__PURE__ */ React.createElement("form", {
						onSubmit: handleSubmit,
						className: "mt-6 space-y-4"
					},
						/* @__PURE__ */ React.createElement("div", null,
							/* @__PURE__ */ React.createElement("label", { className: "text-xs font-semibold text-slate-300 block mb-1.5" }, "Email Kedinasan"),
							/* @__PURE__ */ React.createElement("div", { className: "relative" },
								/* @__PURE__ */ React.createElement(Mail, { className: "w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" }),
								/* @__PURE__ */ React.createElement("input", {
									type: "text",
									required: true,
									autoComplete: "username",
									placeholder: "admin.pusdik@kkp.go.id",
									value: identifier,
									onChange: (e) => setIdentifier(e.target.value),
									className: "w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
								})
							)
						),
						/* @__PURE__ */ React.createElement("div", null,
							/* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between mb-1.5" },
								/* @__PURE__ */ React.createElement("label", { className: "text-xs font-semibold text-slate-300" }, "Kata Sandi (Password)")
							),
							/* @__PURE__ */ React.createElement("div", { className: "relative" },
								/* @__PURE__ */ React.createElement(Lock, { className: "w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" }),
								/* @__PURE__ */ React.createElement("input", {
									type: showPassword ? "text" : "password",
									required: true,
									autoComplete: "current-password",
									placeholder: "Masukkan kata sandi",
									value: password,
									onChange: (e) => setPassword(e.target.value),
									className: "w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
								}),
								/* @__PURE__ */ React.createElement("button", {
									type: "button",
									onClick: () => setShowPassword(!showPassword),
									className: "absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
								}, showPassword
									? /* @__PURE__ */ React.createElement(EyeOff, { className: "w-4 h-4" })
									: /* @__PURE__ */ React.createElement(Eye, { className: "w-4 h-4" })
								)
							)
						),
						/* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between text-xs pt-1" },
							/* @__PURE__ */ React.createElement("label", { className: "flex items-center space-x-2 cursor-pointer text-slate-400 hover:text-slate-300" },
								/* @__PURE__ */ React.createElement("input", {
									type: "checkbox",
									checked: rememberMe,
									onChange: (e) => setRememberMe(e.target.checked),
									className: "rounded bg-slate-950 border-slate-700 text-cyan-600 focus:ring-cyan-500 w-3.5 h-3.5"
								}),
								/* @__PURE__ */ React.createElement("span", null, "Ingat sesi login pada perangkat ini")
							),
							/* @__PURE__ */ React.createElement("span", { className: "text-[10px] text-emerald-400 font-medium flex items-center gap-1" },
								/* @__PURE__ */ React.createElement(Shield, { className: "w-3 h-3" }),
								/* @__PURE__ */ React.createElement("span", null, "Terenkripsi")
							)
						),
						/* @__PURE__ */ React.createElement("button", {
							type: "submit",
							disabled: isLoading,
							className: "w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 text-white font-bold text-xs tracking-wide shadow-lg shadow-cyan-900/40 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
						}, isLoading
							? /* @__PURE__ */ React.createElement("div", { className: "w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" })
							: /* @__PURE__ */ React.createElement(React.Fragment, null,
								/* @__PURE__ */ React.createElement(KeyRound, { className: "w-4 h-4" }),
								/* @__PURE__ */ React.createElement("span", null, "Masuk ke Sistem")
							)
						)
					)
				)
			),

			/* FOOTER */
			/* @__PURE__ */ React.createElement("div", { className: "text-center text-[11px] text-slate-500 py-2 relative z-10" },
				"© Pusat Pendidikan Kelautan dan Perikanan (Pusdik KP) — BPPSDM KP"
			)
		);
	};
})();
const LoginScreen = window.__LoginScreen;
// ============================================================================
// MODULE: src/components/ExecutiveDashboard.jsx
// ============================================================================
(() => {
	const { useState, useMemo } = React;
	const { Building2, CheckCircle2, AlertTriangle, Users, ArrowUpRight, TrendingUp, Ship, Fish, Boxes, Compass, Factory, Briefcase, Wrench, ShieldAlert, ChevronRight, Filter, Bed, GraduationCap, Layers } = window.__VENDOR__.Lucide;
	const { Doughnut, Bar, Radar } = window.__VENDOR__.ReactChartJS2;
	const { NATIONAL_SARPRAS_TARGETS, SARPRAS_CATEGORIES, SATDIK_LIST: DEFAULT_SATDIK_LIST, calculateSarprasKPIs } = window.SARPRAS_DATA;
	const logoKkp = window.__LOGO_KKP || "Frontend/assets/logo-kkp.png";
	window.__ExecutiveDashboard = function ExecutiveDashboard({ kpis, assets, asramaData, standarData, tambakData, satdikList, currentUser, onNavigateTab, onFilterCategory, onSelectSatdik }) {
		const { isDark } = useTheme();
		const [jenjangFilter, setJenjangFilter] = useState("ALL");
		if (!kpis) return null;

		const masterSatdik = satdikList || DEFAULT_SATDIK_LIST || [];
		const lockedSatdik = currentUser?.accessibleSatdik && currentUser.accessibleSatdik !== "ALL"
			? currentUser.accessibleSatdik
			: null;

		const scopedSatdikList = useMemo(() => {
			return masterSatdik.filter((s) => {
				if (lockedSatdik && s.id !== lockedSatdik) return false;
				if (!lockedSatdik && jenjangFilter === "Politeknik") return s.type === "Politeknik" || s.type === "Akademi";
				if (!lockedSatdik && jenjangFilter === "SUPM") return s.type === "SUPM";
				return true;
			});
		}, [masterSatdik, lockedSatdik, jenjangFilter]);

		const scopedSatdikIds = useMemo(() => new Set(scopedSatdikList.map((s) => s.id)), [scopedSatdikList]);

		const activeKpis = useMemo(() => {
			if (!lockedSatdik && jenjangFilter === "ALL") return kpis;
			const scopedAssets = Array.isArray(assets) ? assets.filter((a) => scopedSatdikIds.has(a.satdikId)) : [];
			if (scopedAssets.length > 0 && typeof calculateSarprasKPIs === "function") {
				return calculateSarprasKPIs(scopedAssets, scopedSatdikList, { asramaData, tambakData, standarData });
			}
			return {
				...kpis,
				totalAssets: 0,
				avgConditionScore: 0,
				avgUtilization: 0,
				conditionCounts: { "Baik": 0, "Rusak Ringan": 0, "Rusak Berat": 0 },
				conditionPercentages: { baik: 0, rusakRingan: 0, rusakBerat: 0 },
				urgentAssets: []
			};
		}, [kpis, assets, lockedSatdik, jenjangFilter, scopedSatdikIds, scopedSatdikList, asramaData, tambakData, standarData]);

		const tarunaSummary = useMemo(() => {
			let ptCount = 0, supmCount = 0, ptTaruna = 0, supmTaruna = 0;
			scopedSatdikList.forEach((s) => {
				const t = Number(s.tarunaCount) || 0;
				if (s.type === "SUPM") {
					supmCount++;
					supmTaruna += t;
				} else {
					ptCount++;
					ptTaruna += t;
				}
			});
			return {
				totalSatdik: scopedSatdikList.length,
				ptCount,
				supmCount,
				ptTaruna,
				supmTaruna,
				totalTaruna: ptTaruna + supmTaruna
			};
		}, [scopedSatdikList]);

		const asramaSummaryStats = useMemo(() => {
			const satdikMap = {};
			masterSatdik.forEach((s) => { satdikMap[s.id] = s; });
			const rawSummary = asramaData?.summary || [];
			const rawBuildings = asramaData?.buildings || [];
			const surveyedIds = new Set();

			let totalGedung = 0, digunakanCount = 0, renovCount = 0, kosongCount = 0;
			let totalKamar = 0, totalLuas = 0, kapasitasTotal = 0, kapasitasAktif = 0, tarunaTerdata = 0;
			let memadaiCount = 0, defisitCount = 0;

			const rows = rawSummary
				.filter((r) => scopedSatdikIds.has(r.satdikId))
				.map((r) => {
					surveyedIds.add(r.satdikId);
					const sat = satdikMap[r.satdikId] || {};
					const bList = rawBuildings.filter((b) => b.satdikId === r.satdikId);
					const gedung = bList.length > 0 ? bList.length : (Number(r.jumlahAsrama) || 0);
					const renov = bList.length > 0
						? bList.filter((b) => b.status === "Perlu Renovasi").length
						: (Number(r.jumlahPerluRenovasi) || 0);
					const kosong = bList.length > 0
						? bList.filter((b) => b.status === "Tidak Digunakan" || b.status === "Tidak Dipakai").length
						: (Number(r.jumlahTidakDipakai) || 0);
					const digunakan = bList.length > 0
						? bList.filter((b) => b.status === "Digunakan").length
						: Math.max(0, gedung - renov - kosong);
					const kamar = Number(r.jumlahKamar) || 0;
					const luas = Number(r.luasM2) || 0;
					const kapTot = Math.round(Number(r.kapasitas) || 0);
					const kapAkt = bList.length > 0
						? Math.round(bList.filter((b) => b.status === "Digunakan").reduce((acc, b) => acc + (Number(b.kapasitas) || 0), 0))
						: Math.round(Number(r.kapasitasAktif ?? r.kapasitas) || 0);
					const taruna = Number(sat.tarunaCount) || 0;
					const ratio = taruna > 0 ? Math.round((kapAkt / taruna) * 1000) / 10 : 0;
					const selisih = kapAkt - taruna;

					totalGedung += gedung;
					digunakanCount += digunakan;
					renovCount += renov;
					kosongCount += kosong;
					totalKamar += kamar;
					totalLuas += luas;
					kapasitasTotal += kapTot;
					kapasitasAktif += kapAkt;
					tarunaTerdata += taruna;
					if (ratio >= 100) memadaiCount++;
					else defisitCount++;

					return {
						satdikId: r.satdikId,
						shortName: sat.shortName || r.namaExcel || r.satdikId,
						gedung,
						kamar,
						kapAkt,
						taruna,
						ratio,
						selisih
					};
				})
				.sort((a, b) => a.ratio - b.ratio);

			const unsurveyedList = scopedSatdikList.filter((s) => !surveyedIds.has(s.id));
			const ratio = tarunaTerdata > 0 ? Math.round((kapasitasAktif / tarunaTerdata) * 1000) / 10 : 0;
			const selisih = kapasitasAktif - tarunaTerdata;

			return {
				satdikTerdata: rows.length,
				totalGedung,
				digunakanCount,
				renovCount,
				kosongCount,
				totalKamar,
				totalLuas,
				kapasitasTotal,
				kapasitasAktif,
				tarunaTerdata,
				ratio,
				selisih,
				memadaiCount,
				defisitCount,
				priorityRows: rows.slice(0, 6),
				unsurveyedList
			};
		}, [asramaData, masterSatdik, scopedSatdikIds, scopedSatdikList]);

		const standarSummaryStats = useMemo(() => {
			const rawBidang = standarData?.bidang || [];
			const rawRekap = standarData?.rekap || [];
			const scopedRekap = rawRekap.filter((r) => scopedSatdikIds.has(r.satdikId));
			const scopedBidang = (!lockedSatdik && jenjangFilter === "ALL")
				? rawBidang
				: rawBidang.filter((b) => Array.isArray(b.satdikIds) && b.satdikIds.some((sid) => scopedSatdikIds.has(sid)));

			const stdItemsCount = scopedBidang.reduce((acc, b) => acc + (Number(b.totalItems) || 0), 0);
			const stdPrasaranaCount = scopedBidang.reduce((acc, b) => acc + (Number(b.prasaranaCount) || 0), 0);
			const stdSaranaCount = scopedBidang.reduce((acc, b) => acc + (Number(b.saranaCount) || 0), 0);

			let pTot = 0, pFull = 0, pPart = 0, pZero = 0, pW = 0;
			let sTot = 0, sFull = 0, sPart = 0, sZero = 0, sW = 0;
			let memadai = 0, penguatan = 0, defisit = 0;
			const satSet = new Set();

			scopedRekap.forEach((r) => {
				satSet.add(r.satdikId);
				const pt = Number(r.prasaranaTotal) || 0;
				const st = Number(r.saranaTotal) || 0;
				pTot += pt;
				pFull += Number(r.prasaranaTerpenuhi) || 0;
				pPart += Number(r.prasaranaSebagian) || 0;
				pZero += Number(r.prasaranaKosong) || 0;
				pW += ((Number(r.persenPrasarana) || 0) / 100) * pt;

				sTot += st;
				sFull += Number(r.saranaTerpenuhi) || 0;
				sPart += Number(r.saranaSebagian) || 0;
				sZero += Number(r.saranaKosong) || 0;
				sW += ((Number(r.persenSarana) || 0) / 100) * st;

				const pTotalRow = Number(r.persenTotal) || 0;
				if (pTotalRow >= 70) memadai++;
				else if (pTotalRow >= 40) penguatan++;
				else defisit++;
			});

			const allTot = pTot + sTot;
			const allFull = pFull + sFull;
			const allPart = pPart + sPart;
			const allZero = pZero + sZero;
			const pctPrasarana = pTot > 0 ? Math.round((pW / pTot) * 1000) / 10 : 0;
			const pctSarana = sTot > 0 ? Math.round((sW / sTot) * 1000) / 10 : 0;
			const pctTotal = allTot > 0 ? Math.round(((pW + sW) / allTot) * 1000) / 10 : 0;

			const rumpunRows = scopedBidang
				.map((b) => {
					const bRekap = scopedRekap.filter((r) => r.bidangId === b.id);
					let bTot = 0, bW = 0;
					bRekap.forEach((r) => {
						const t = (Number(r.prasaranaTotal) || 0) + (Number(r.saranaTotal) || 0);
						bTot += t;
						bW += ((Number(r.persenTotal) || 0) / 100) * t;
					});
					return {
						id: b.id,
						code: b.code || "",
						nama: b.nama,
						totalItems: Number(b.totalItems) || 0,
						satdikCount: bRekap.length,
						pct: bTot > 0 ? Math.round((bW / bTot) * 1000) / 10 : 0
					};
				})
				.sort((a, b) => b.totalItems - a.totalItems);

			return {
				hasData: scopedRekap.length > 0,
				bidangCount: scopedBidang.length,
				satdikCount: satSet.size,
				rekapCount: scopedRekap.length,
				stdItemsCount,
				stdPrasaranaCount,
				stdSaranaCount,
				allTot,
				allFull,
				allPart,
				allZero,
				pctFullPoint: allTot > 0 ? Math.round((allFull / allTot) * 1000) / 10 : 0,
				pctPartPoint: allTot > 0 ? Math.round((allPart / allTot) * 1000) / 10 : 0,
				pctZeroPoint: allTot > 0 ? Math.round((allZero / allTot) * 1000) / 10 : 0,
				pctPrasarana,
				pctSarana,
				pctTotal,
				memadai,
				penguatan,
				defisit,
				rumpunRows: rumpunRows.slice(0, 4)
			};
		}, [standarData, scopedSatdikIds, lockedSatdik, jenjangFilter]);

		const tambakSummaryStats = useMemo(() => {
			const fallbackTambak = window.SARPRAS_TAMBAK || { summary: [], units: [] };
			const rawUnits = Array.isArray(tambakData?.units) && tambakData.units.length > 0 ? tambakData.units : (fallbackTambak.units || []);
			const scopedUnits = rawUnits.filter((u) => scopedSatdikIds.has(u.satdikId));

			let totalUnit = scopedUnits.length;
			let totalLuasM2 = 0, luasTambakM2 = 0, luasKolamM2 = 0, luasLainnyaM2 = 0;
			let jumlahTambak = 0, jumlahKolam = 0, jumlahTandon = 0, jumlahBak = 0, jumlahLainnya = 0;
			let kondisiBaik = 0, kondisiRR = 0, kondisiRB = 0;
			const bySatdik = {};

			scopedUnits.forEach((u) => {
				const luas = Number(u.luasM2) || 0;
				const jenis = u.jenis || u.kategoriUtama || "Kolam";
				const kond = u.kondisi || "Baik";

				totalLuasM2 += luas;

				if (jenis === "Tambak") {
					jumlahTambak++;
					luasTambakM2 += luas;
				} else if (jenis === "Kolam") {
					jumlahKolam++;
					luasKolamM2 += luas;
				} else if (jenis === "Tandon") {
					jumlahTandon++;
					luasLainnyaM2 += luas;
				} else {
					jumlahBak++;
					luasLainnyaM2 += luas;
				}

				if (kond === "Baik") kondisiBaik++;
				else if (kond === "Rusak Ringan") kondisiRR++;
				else kondisiRB++;

				if (!bySatdik[u.satdikId]) {
					bySatdik[u.satdikId] = {
						satdikId: u.satdikId,
						shortName: u.shortName || u.namaSatdik || u.satdikName || u.satdikId,
						unitCount: 0,
						luasM2: 0,
						tambakCount: 0,
						kolamCount: 0,
						lainnyaCount: 0,
						baikCount: 0
					};
				}
				bySatdik[u.satdikId].unitCount++;
				bySatdik[u.satdikId].luasM2 += luas;
				if (jenis === "Tambak") bySatdik[u.satdikId].tambakCount++;
				else if (jenis === "Kolam") bySatdik[u.satdikId].kolamCount++;
				else bySatdik[u.satdikId].lainnyaCount++;
				if (kond === "Baik") bySatdik[u.satdikId].baikCount++;
			});

			jumlahLainnya = jumlahTandon + jumlahBak;

			const topSatdikRows = Object.values(bySatdik)
				.map((s) => ({
					...s,
					luasHa: Math.round((s.luasM2 / 10000) * 100) / 100,
					pctBaik: s.unitCount > 0 ? Math.round((s.baikCount / s.unitCount) * 1000) / 10 : 0
				}))
				.sort((a, b) => b.luasM2 - a.luasM2)
				.slice(0, 5);

			return {
				satdikCount: Object.keys(bySatdik).length,
				totalUnit,
				totalLuasM2: Math.round(totalLuasM2 * 100) / 100,
				totalLuasHa: Math.round((totalLuasM2 / 10000) * 100) / 100,
				luasTambakHa: Math.round((luasTambakM2 / 10000) * 100) / 100,
				luasKolamHa: Math.round((luasKolamM2 / 10000) * 100) / 100,
				luasLainnyaHa: Math.round((luasLainnyaM2 / 10000) * 100) / 100,
				jumlahTambak,
				jumlahKolam,
				jumlahTandon,
				jumlahBak,
				jumlahLainnya,
				kondisiBaik,
				kondisiRR,
				kondisiRB,
				pctBaik: totalUnit > 0 ? Math.round((kondisiBaik / totalUnit) * 1000) / 10 : 0,
				topSatdikRows
			};
		}, [tambakData, scopedSatdikIds]);

		// Dynamic theme colors for Chart.js based on Light / Dark Mode
		const textColor = isDark ? "#cbd5e1" : "#090d16";
		const textMuted = isDark ? "#94a3b8" : "#1e293b";
		const textBold = isDark ? "#e2e8f0" : "#000000";
		const gridColor = isDark ? "rgba(51, 65, 85, 0.4)" : "#cbd5e1";
		// Extract condition counts and percentages
		const { totalAssets, avgConditionScore, avgUtilization, conditionCounts, conditionPercentages, categoryBreakdown, satdikBreakdown, urgentAssets } = activeKpis;
		// Donut Chart: Komposisi Kondisi Sarpras (Standar BMN Kemenkeu: Baik, Rusak Ringan, Rusak Berat)
		const donutData = {
			labels: [
				"Baik (Layak Operasi Penuh)",
				"Rusak Ringan (Operasi Terbatas)",
				"Rusak Berat (Tidak Layak / Stop)"
			],
			datasets: [{
				data: [
					conditionCounts["Baik"],
					conditionCounts["Rusak Ringan"],
					conditionCounts["Rusak Berat"]
				],
				backgroundColor: isDark ? [
					"rgba(16, 185, 129, 0.85)",
					"rgba(14, 165, 233, 0.85)",
					"rgba(244, 63, 94, 0.85)"
				] : [
					"#10b981",
					"#0ea5e9",
					"#f43f5e"
				],
				borderColor: [
					"#10b981",
					"#0ea5e9",
					"#f43f5e"
				],
				borderWidth: 2,
				hoverOffset: 6
			}]
		};
		const donutOptions = {
			responsive: true,
			maintainAspectRatio: false,
			plugins: {
				legend: {
					position: "bottom",
					labels: {
						color: textColor,
						font: {
							size: 11,
							family: "Inter, system-ui",
							weight: "600"
						},
						boxWidth: 12,
						padding: 12
					}
				},
				tooltip: { callbacks: { label: (context) => {
					const value = context.raw || 0;
					const idx = context.dataIndex;
					const pct = idx === 0 ? conditionPercentages.baik : (idx === 1 ? conditionPercentages.rusakRingan : conditionPercentages.rusakBerat);
					return ` ${context.label}: ${value} Unit (${pct}%)`;
				} } }
			},
			cutout: "68%"
		};
		// Bar Chart: Satuan Pendidikan dengan Skor Kelayakan Tertinggi (Top 10 pada Semua, 11 pada Politeknik, 7 pada SUPM)
		const satdikEntries = Object.values(satdikBreakdown).filter((s) => {
			if (jenjangFilter === "Politeknik") return s.satdik.type === "Politeknik" || s.satdik.type === "Akademi";
			if (jenjangFilter === "SUPM") return s.satdik.type === "SUPM";
			return true;
		}).sort((a, b) => b.avgScore - a.avgScore);
		const maxBarCount = jenjangFilter === "Politeknik" ? 11 : (jenjangFilter === "SUPM" ? 7 : 10);
		const displayedSatdik = satdikEntries.slice(0, maxBarCount);
		const barData = {
			labels: displayedSatdik.map((s) => s.satdik.shortName),
			datasets: [{
				label: "Indeks Kelayakan Sarpras (%)",
				data: displayedSatdik.map((s) => Math.round(s.avgScore)),
				backgroundColor: displayedSatdik.map((s) => {
					if (!isDark) {
						return s.avgScore >= 85 ? "#10b981" : s.avgScore >= 75 ? "#0ea5e9" : "#f59e0b";
					}
					return s.avgScore >= 85 ? "rgba(16, 185, 129, 0.75)" : s.avgScore >= 75 ? "rgba(14, 165, 233, 0.75)" : "rgba(245, 158, 11, 0.75)";
				}),
				borderColor: displayedSatdik.map((s) => s.avgScore >= 85 ? "#10b981" : s.avgScore >= 75 ? "#0ea5e9" : "#f59e0b"),
				borderWidth: 1.5,
				borderRadius: 6
			}]
		};
		const barOptions = {
			indexAxis: "y",
			responsive: true,
			maintainAspectRatio: false,
			plugins: {
				legend: { display: false },
				tooltip: { callbacks: { label: (ctx) => ` Indeks Kelayakan: ${ctx.raw}%` } }
			},
			scales: {
				x: {
					min: 0,
					max: 100,
					grid: { color: gridColor },
					ticks: {
						color: textMuted,
						callback: (v) => `${v}%`
					}
				},
				y: {
					grid: { display: false },
					ticks: {
						color: textBold,
						font: {
							size: 11,
							weight: "600"
						}
					}
				}
			}
		};
		// Multi-line helper to prevent radar labels clipping on mobile screens
		const formatRadarLabel = (name) => {
			const manualWrap = {
				"Penangkapan Ikan": ["Penangkapan", "Ikan"],
				"Permesinan dan Mekanisasi": ["Permesinan &", "Mekanisasi"],
				"Budidaya Perikanan": ["Budidaya", "Perikanan"],
				"Pengolahan Hasil Perikanan/Laut": ["Pengolahan Hasil", "Perikanan/Laut"],
				"Pengolahan Hasil Perikanan": ["Pengolahan Hasil", "Perikanan"],
				"Agribisnis Perikanan": ["Agribisnis", "Perikanan"],
				"Kelautan, Konservasi, dan Pengolahan Lingkungan": ["Kelautan, Konservasi", "& Pengolahan Lingk."],
				"Sosial & Pemberdayaan Masyarakat": ["Sosial &", "Pemberdayaan Masy."],
				"Administrasi & Umum": ["Administrasi", "& Umum"],
				"Administasi & Umum": ["Administasi", "& Umum"],
				"Penangkapan Ikan dan Permesinan Kapal": ["Penangkapan Ikan", "& Permesinan Kapal"],
				"Agribisnis, Pengolahan dan Penyuluhan": ["Agribisnis, Pengolahan", "& Penyuluhan"],
				"Konservasi dan Pariwisata": ["Konservasi &", "Pariwisata"]
			};
			if (manualWrap[name]) return manualWrap[name];
			if (name.length <= 14) return name;
			const words = name.split(" ");
			const mid = Math.ceil(words.length / 2);
			return [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
		};
		// Radar Chart: Kematangan per Bidang Sarpras
		const categoryKeys = Object.keys(categoryBreakdown);
		const radarLabels = categoryKeys.map((k) => formatRadarLabel(categoryBreakdown[k].name));
		const radarScores = categoryKeys.map((k) => Math.round(categoryBreakdown[k].avgScore || 0));
		const radarData = {
			labels: radarLabels,
			datasets: [{
				label: "Kondisi Realistis Saat Ini (%)",
				data: radarScores,
				backgroundColor: "rgba(6, 182, 212, 0.25)",
				borderColor: "#06b6d4",
				pointBackgroundColor: "#06b6d4",
				pointBorderColor: "#fff",
				pointHoverBackgroundColor: "#fff",
				pointHoverBorderColor: "#06b6d4",
				borderWidth: 2
			}, {
				label: "Target Standar Vokasi KKP (%)",
				data: categoryKeys.map(() => NATIONAL_SARPRAS_TARGETS.targetIndeksKelayakan),
				backgroundColor: "rgba(16, 185, 129, 0.08)",
				borderColor: "rgba(16, 185, 129, 0.6)",
				borderDash: [5, 5],
				pointRadius: 0,
				borderWidth: 1.5
			}]
		};
		const radarOptions = {
			responsive: true,
			maintainAspectRatio: false,
			layout: { padding: {
				top: 6,
				bottom: 6,
				left: 10,
				right: 10
			} },
			plugins: {
				legend: {
					position: "bottom",
					labels: {
						color: textColor,
						font: {
							size: 10,
							weight: "600"
						},
						boxWidth: 12,
						padding: 10
					}
				},
				tooltip: { callbacks: {
					title: (tooltipItems) => {
						if (!tooltipItems.length) return "";
						const item = tooltipItems[0];
						const rawLabel = item.label;
						return Array.isArray(rawLabel) ? rawLabel.join(" ") : rawLabel || "";
					},
					label: (context) => ` ${context.dataset.label}: ${context.raw}%`
				} }
			},
			scales: { r: {
				angleLines: { color: gridColor },
				grid: { color: gridColor },
				pointLabels: {
					color: textColor,
					font: {
						size: typeof window !== "undefined" && window.innerWidth < 640 ? 9 : 10,
						weight: "600"
					},
					padding: 4
				},
				ticks: {
					backdropColor: "transparent",
					color: textMuted,
					stepSize: 20,
					showLabelBackdrop: false
				},
				suggestedMin: 30,
				suggestedMax: 100
			} }
		};
		// Determine readiness status badge
		const isTargetAchieved = avgConditionScore >= NATIONAL_SARPRAS_TARGETS.targetIndeksKelayakan;
		return /* @__PURE__ */ React.createElement("div", { className: "space-y-6" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-800/90 via-slate-800/70 to-slate-900/90 p-4 sm:p-5 rounded-2xl border border-slate-700/80 shadow-lg relative overflow-hidden" }, /* @__PURE__ */ React.createElement("div", { className: "absolute right-0 top-0 bottom-0 opacity-5 pointer-events-none flex items-center pr-6" }, /* @__PURE__ */ React.createElement("img", {
			src: logoKkp,
			alt: "KKP Watermark",
			className: "w-56 h-56 object-contain"
		})), /* @__PURE__ */ React.createElement("div", { className: "flex flex-col sm:flex-row items-center sm:items-center text-center sm:text-left gap-3.5 sm:gap-4 relative z-10 w-full sm:w-auto" }, /* @__PURE__ */ React.createElement("div", { className: "w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white p-1.5 shadow-md border border-cyan-500/30 flex items-center justify-center flex-shrink-0" }, /* @__PURE__ */ React.createElement("img", {
			src: logoKkp,
			alt: "Logo KKP",
			className: "w-full h-full object-contain"
		})), /* @__PURE__ */ React.createElement("div", { className: "flex flex-col items-center sm:items-start w-full sm:w-auto" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap items-center justify-center sm:justify-start gap-1.5 sm:gap-2" }, /* @__PURE__ */ React.createElement("span", { className: "px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-center" }, "National Sarpras Overview")), /* @__PURE__ */ React.createElement("h2", { className: "text-lg sm:text-xl md:text-2xl font-bold text-white tracking-tight mt-1.5 sm:mt-1 text-center sm:text-left" }, "Dasbor Analitik Sarana & Prasarana Vokasi KKP"), /* @__PURE__ */ React.createElement("p", { className: "text-slate-400 text-xs sm:text-sm mt-1 sm:mt-0.5 max-w-2xl text-center sm:text-left" }, "Monitoring kondisi fisik, kelayakan operasi armada kapal latih, tambak, laboratorium, dan sarpras pada 18 Satuan Pendidikan Kelautan dan Perikanan se-Indonesia."))), /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-center gap-1.5 bg-slate-900/90 p-1.5 rounded-xl border border-slate-700/60 self-center md:self-center overflow-x-auto max-w-full" }, /* @__PURE__ */ React.createElement(Filter, { className: "w-3.5 h-3.5 text-slate-400 ml-2" }), /* @__PURE__ */ React.createElement("button", {
			onClick: () => setJenjangFilter("ALL"),
			className: `px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${jenjangFilter === "ALL" ? "bg-cyan-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"}`
		}, "Semua (18)"), /* @__PURE__ */ React.createElement("button", {
			onClick: () => setJenjangFilter("Politeknik"),
			className: `px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${jenjangFilter === "Politeknik" ? "bg-cyan-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"}`
		}, "Politeknik (11)"), /* @__PURE__ */ React.createElement("button", {
			onClick: () => setJenjangFilter("SUPM"),
			className: `px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${jenjangFilter === "SUPM" ? "bg-cyan-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"}`
		}, "SUPM (7)"))), urgentAssets.length > 0 && /* @__PURE__ */ React.createElement("div", { className: "bg-gradient-to-r from-rose-950/70 via-rose-900/40 to-slate-900/80 border border-rose-500/50 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg shadow-rose-950/20" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-start sm:items-center space-x-3.5" }, /* @__PURE__ */ React.createElement("div", { className: "w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center flex-shrink-0 text-rose-400 animate-pulse" }, /* @__PURE__ */ React.createElement(ShieldAlert, { className: "w-5 h-5" })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement("span", { className: "font-bold text-rose-300 text-sm" }, "Peringatan Dini: ", urgentAssets.length, " Fasilitas Sarpras Kritis & Rusak Berat!"), /* @__PURE__ */ React.createElement("span", { className: "px-2 py-0.5 rounded text-[10px] font-extrabold bg-rose-500/20 text-rose-300 border border-rose-500/40" }, "Perlu Atensi KKP")), /* @__PURE__ */ React.createElement("p", { className: "text-slate-300 text-xs mt-0.5" }, "Contoh: ", /* @__PURE__ */ React.createElement("span", { className: "font-semibold text-white" }, urgentAssets[0]?.name), " (", urgentAssets[0]?.satdikName, ") — ", urgentAssets[0]?.issuesSummary.substring(0, 100), "..."))), /* @__PURE__ */ React.createElement("button", {
			onClick: () => onNavigateTab("maintenance"),
			className: "inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md shadow-rose-900/40 transition-colors whitespace-nowrap self-start sm:self-center"
		}, /* @__PURE__ */ React.createElement("span", null, "Tinjau Aset Kritis"), /* @__PURE__ */ React.createElement(ChevronRight, { className: "w-3.5 h-3.5" }))), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4" }, /* @__PURE__ */ React.createElement("div", { className: "bg-slate-800/90 rounded-2xl p-4 border border-slate-700/70 hover:border-cyan-500/50 transition-all shadow-md group" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between text-slate-400" }, /* @__PURE__ */ React.createElement("span", { className: "text-xs font-medium uppercase tracking-wider" }, "Total Sarpras"), /* @__PURE__ */ React.createElement("div", { className: "w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform" }, /* @__PURE__ */ React.createElement(Building2, { className: "w-4 h-4" }))), /* @__PURE__ */ React.createElement("div", { className: "mt-3" }, /* @__PURE__ */ React.createElement("div", { className: "text-2xl font-black text-white" }, totalAssets), /* @__PURE__ */ React.createElement("div", { className: "text-[11px] text-cyan-400/90 mt-0.5 flex items-center gap-1" }, /* @__PURE__ */ React.createElement("span", null, "Unit terdata aktif")))), /* @__PURE__ */ React.createElement("div", { className: "bg-slate-800/90 rounded-2xl p-4 border border-slate-700/70 hover:border-blue-500/50 transition-all shadow-md group" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between text-slate-400" }, /* @__PURE__ */ React.createElement("span", { className: "text-xs font-medium uppercase tracking-wider" }, "Indeks Kelayakan (IKSP)"), /* @__PURE__ */ React.createElement("div", { className: `w-8 h-8 rounded-lg ${isTargetAchieved ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"} flex items-center justify-center group-hover:scale-110 transition-transform` }, /* @__PURE__ */ React.createElement(CheckCircle2, { className: "w-4 h-4" }))), /* @__PURE__ */ React.createElement("div", { className: "mt-3" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-baseline gap-2" }, /* @__PURE__ */ React.createElement("span", { className: `text-2xl font-black ${isTargetAchieved ? "text-emerald-400" : "text-amber-400"}` }, avgConditionScore, "%"), /* @__PURE__ */ React.createElement("span", { className: "text-[11px] text-slate-400" }, "Target: ", NATIONAL_SARPRAS_TARGETS.targetIndeksKelayakan, "%")), /* @__PURE__ */ React.createElement("div", { className: "text-[11px] text-slate-400 mt-0.5" }, isTargetAchieved ? "✓ Memenuhi standar target" : "⚠ Di bawah target nasional"))), /* @__PURE__ */ React.createElement("div", { className: "bg-slate-800/90 rounded-2xl p-4 border border-slate-700/70 hover:border-emerald-500/50 transition-all shadow-md group" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between text-slate-400" }, /* @__PURE__ */ React.createElement("span", { className: "text-xs font-medium uppercase tracking-wider" }, "Kondisi Baik"), /* @__PURE__ */ React.createElement("div", { className: "w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center" }, /* @__PURE__ */ React.createElement(CheckCircle2, { className: "w-4 h-4" }))), /* @__PURE__ */ React.createElement("div", { className: "mt-3" }, /* @__PURE__ */ React.createElement("div", { className: "text-2xl font-black text-emerald-400" }, conditionCounts["Baik"], " ", /* @__PURE__ */ React.createElement("span", { className: "text-xs font-normal text-slate-400" }, "(", conditionPercentages.baik, "%)")), /* @__PURE__ */ React.createElement("div", { className: "text-[11px] text-slate-400 mt-0.5" }, "Layak fungsi operasional"))), /* @__PURE__ */ React.createElement("div", { className: "bg-slate-800/90 rounded-2xl p-4 border border-slate-700/70 hover:border-rose-500/50 transition-all shadow-md group" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between text-slate-400" }, /* @__PURE__ */ React.createElement("span", { className: "text-xs font-medium uppercase tracking-wider" }, "Rusak Berat (Kritis)"), /* @__PURE__ */ React.createElement("div", { className: "w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center" }, /* @__PURE__ */ React.createElement(AlertTriangle, { className: "w-4 h-4" }))), /* @__PURE__ */ React.createElement("div", { className: "mt-3" }, /* @__PURE__ */ React.createElement("div", { className: "text-2xl font-black text-rose-400" }, conditionCounts["Rusak Berat"], " ", /* @__PURE__ */ React.createElement("span", { className: "text-xs font-normal text-slate-400" }, "Unit (", conditionPercentages.rusakBerat, "%)")), /* @__PURE__ */ React.createElement("div", { className: "text-[11px] text-rose-400 mt-0.5 font-medium" }, "Tidak layak / stop operasi")))), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4" }, /* @__PURE__ */ React.createElement("div", { onClick: () => onNavigateTab("asrama"), className: "bg-slate-800/90 rounded-2xl p-4 border border-slate-700/70 hover:border-blue-500/50 transition-all shadow-md group cursor-pointer" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between text-slate-400" }, /* @__PURE__ */ React.createElement("span", { className: "text-xs font-medium uppercase tracking-wider" }, "Kapasitas Asrama Aktif"), /* @__PURE__ */ React.createElement("div", { className: `w-8 h-8 rounded-lg ${asramaSummaryStats.ratio >= 90 ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"} flex items-center justify-center group-hover:scale-110 transition-transform` }, /* @__PURE__ */ React.createElement(Bed, { className: "w-4 h-4" }))), /* @__PURE__ */ React.createElement("div", { className: "mt-3" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-baseline gap-2" }, /* @__PURE__ */ React.createElement("span", { className: `text-2xl font-black ${asramaSummaryStats.ratio >= 90 ? "text-emerald-400" : "text-amber-400"}` }, asramaSummaryStats.kapasitasAktif.toLocaleString("id-ID")), /* @__PURE__ */ React.createElement("span", { className: "text-[11px] text-slate-400" }, "(", asramaSummaryStats.ratio, "%)")), /* @__PURE__ */ React.createElement("div", { className: "text-[11px] text-slate-400 mt-0.5" }, asramaSummaryStats.satdikTerdata > 0 ? `${asramaSummaryStats.totalGedung} Gedung · ${asramaSummaryStats.totalKamar.toLocaleString("id-ID")} Kamar (${asramaSummaryStats.selisih >= 0 ? "+" : ""}${asramaSummaryStats.selisih.toLocaleString("id-ID")})` : "Belum ada data asrama terinput"))), /* @__PURE__ */ React.createElement("div", { onClick: () => onNavigateTab("standar"), className: "bg-slate-800/90 rounded-2xl p-4 border border-slate-700/70 hover:border-emerald-500/50 transition-all shadow-md group cursor-pointer" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between text-slate-400" }, /* @__PURE__ */ React.createElement("span", { className: "text-xs font-medium uppercase tracking-wider" }, "Standar Minimal Prodi"), /* @__PURE__ */ React.createElement("div", { className: `w-8 h-8 rounded-lg ${standarSummaryStats.pctTotal >= 40 ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"} flex items-center justify-center group-hover:scale-110 transition-transform` }, /* @__PURE__ */ React.createElement(GraduationCap, { className: "w-4 h-4" }))), /* @__PURE__ */ React.createElement("div", { className: "mt-3" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-baseline gap-2" }, /* @__PURE__ */ React.createElement("span", { className: `text-2xl font-black ${standarSummaryStats.hasData ? (standarSummaryStats.pctTotal >= 40 ? "text-emerald-400" : "text-amber-400") : "text-slate-400"}` }, standarSummaryStats.hasData ? `${standarSummaryStats.pctTotal}%` : "—"), /* @__PURE__ */ React.createElement("span", { className: "text-[11px] text-slate-400" }, standarSummaryStats.hasData ? `${standarSummaryStats.bidangCount} Rumpun` : "Jenjang PT")), /* @__PURE__ */ React.createElement("div", { className: "text-[11px] text-slate-400 mt-0.5" }, standarSummaryStats.hasData ? `${standarSummaryStats.stdItemsCount.toLocaleString("id-ID")} Item · Pras ${standarSummaryStats.pctPrasarana}% · Sar ${standarSummaryStats.pctSarana}%` : "Cakupan matriks pada 11 Satdik PT"))), /* @__PURE__ */ React.createElement("div", { onClick: () => onNavigateTab("tambak"), className: "bg-slate-800/90 rounded-2xl p-4 border border-cyan-500/40 hover:border-cyan-400 transition-all shadow-md group cursor-pointer" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between text-slate-400" }, /* @__PURE__ */ React.createElement("span", { className: "text-xs font-medium uppercase tracking-wider text-cyan-300" }, "Tambak & Kolam"), /* @__PURE__ */ React.createElement("div", { className: "w-8 h-8 rounded-lg bg-cyan-500/15 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform" }, /* @__PURE__ */ React.createElement(Fish, { className: "w-4 h-4" }))), /* @__PURE__ */ React.createElement("div", { className: "mt-3" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-baseline gap-2" }, /* @__PURE__ */ React.createElement("span", { className: "text-2xl font-black text-cyan-400" }, tambakSummaryStats.totalUnit.toLocaleString("id-ID")), /* @__PURE__ */ React.createElement("span", { className: "text-[11px] text-slate-400" }, `Unit (${tambakSummaryStats.totalLuasHa.toLocaleString("id-ID")} Ha)`)), /* @__PURE__ */ React.createElement("div", { className: "text-[11px] text-slate-400 mt-0.5" }, `${tambakSummaryStats.jumlahTambak} Tambak · ${tambakSummaryStats.jumlahKolam} Kolam · ${tambakSummaryStats.jumlahLainnya} Tandon/Bak`))), /* @__PURE__ */ React.createElement("div", { onClick: () => onNavigateTab("maintenance"), className: "bg-slate-800/90 rounded-2xl p-4 border border-slate-700/70 hover:border-rose-500/50 transition-all shadow-md group cursor-pointer" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between text-slate-400" }, /* @__PURE__ */ React.createElement("span", { className: "text-xs font-medium uppercase tracking-wider" }, "Utilisasi & Atensi Fisik"), /* @__PURE__ */ React.createElement("div", { className: "w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform" }, /* @__PURE__ */ React.createElement(Layers, { className: "w-4 h-4" }))), /* @__PURE__ */ React.createElement("div", { className: "mt-3" }, /* @__PURE__ */ React.createElement("div", { className: "text-2xl font-black text-cyan-400" }, avgUtilization || 0, "% ", /* @__PURE__ */ React.createElement("span", { className: "text-xs font-normal text-slate-400" }, "Utilisasi")), /* @__PURE__ */ React.createElement("div", { className: "text-[11px] text-slate-400 mt-0.5" }, `${urgentAssets.length} BMN Kritis · ${asramaSummaryStats.renovCount + asramaSummaryStats.kosongCount} Asrama Non-Optimal`)))), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-6" }, /* @__PURE__ */ React.createElement("div", { className: "lg:col-span-5 bg-slate-800/90 rounded-2xl p-5 border border-slate-700/70 shadow-lg flex flex-col justify-between" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between mb-1" }, /* @__PURE__ */ React.createElement("h3", { className: "text-base font-bold text-white tracking-tight flex items-center gap-2" }, /* @__PURE__ */ React.createElement("span", null, "Distribusi Kondisi Sarpras Nasional")), /* @__PURE__ */ React.createElement("span", { className: "text-xs text-cyan-400 font-semibold" }, totalAssets, " Unit Total")), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-slate-400 mb-4" }, "Klasifikasi kelayakan fisik seluruh sarana pendidikan vokasi KKP.")), /* @__PURE__ */ React.createElement("div", { className: "h-64 relative flex items-center justify-center my-2" }, /* @__PURE__ */ React.createElement(Doughnut, {
			data: donutData,
			options: donutOptions
		}), /* @__PURE__ */ React.createElement("div", { className: "absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-12" }, /* @__PURE__ */ React.createElement("span", { className: "text-2xl font-black text-white" }, conditionPercentages.baik, "%"), /* @__PURE__ */ React.createElement("span", { className: "text-[10px] text-emerald-400 font-semibold uppercase tracking-wider" }, "Kondisi Baik"))), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-3 gap-2 pt-2 border-t border-slate-700/60 text-xs" }, /* @__PURE__ */ React.createElement("div", { className: "bg-slate-900/60 p-2 sm:p-2.5 rounded-xl border border-slate-800 text-center sm:text-left" }, /* @__PURE__ */ React.createElement("span", { className: "text-slate-400 text-[10px] sm:text-[11px] block truncate" }, "Baik (Layak)"), /* @__PURE__ */ React.createElement("span", { className: "text-emerald-400 font-bold text-xs sm:text-sm block mt-0.5" }, conditionCounts["Baik"], " ", /* @__PURE__ */ React.createElement("span", { className: "text-[10px] font-normal text-slate-400" }, "(", conditionPercentages.baik, "%)"))), /* @__PURE__ */ React.createElement("div", { className: "bg-slate-900/60 p-2 sm:p-2.5 rounded-xl border border-slate-800 text-center sm:text-left" }, /* @__PURE__ */ React.createElement("span", { className: "text-slate-400 text-[10px] sm:text-[11px] block truncate" }, "Rusak Ringan"), /* @__PURE__ */ React.createElement("span", { className: "text-sky-400 font-bold text-xs sm:text-sm block mt-0.5" }, conditionCounts["Rusak Ringan"], " ", /* @__PURE__ */ React.createElement("span", { className: "text-[10px] font-normal text-slate-400" }, "(", conditionPercentages.rusakRingan, "%)"))), /* @__PURE__ */ React.createElement("div", { className: "bg-slate-900/60 p-2 sm:p-2.5 rounded-xl border border-slate-800 text-center sm:text-left" }, /* @__PURE__ */ React.createElement("span", { className: "text-slate-400 text-[10px] sm:text-[11px] block truncate" }, "Rusak Berat"), /* @__PURE__ */ React.createElement("span", { className: "text-rose-400 font-bold text-xs sm:text-sm block mt-0.5" }, conditionCounts["Rusak Berat"], " ", /* @__PURE__ */ React.createElement("span", { className: "text-[10px] font-normal text-slate-400" }, "(", conditionPercentages.rusakBerat, "%)"))))), /* @__PURE__ */ React.createElement("div", { className: "lg:col-span-7 bg-slate-800/90 rounded-2xl p-5 border border-slate-700/70 shadow-lg flex flex-col justify-between" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between mb-1" }, /* @__PURE__ */ React.createElement("h3", { className: "text-base font-bold text-white tracking-tight" }, "Peringkat Kelayakan Sarpras Satuan Pendidikan"), /* @__PURE__ */ React.createElement("button", {
			onClick: () => onNavigateTab("map"),
			className: "text-xs text-cyan-400 hover:text-cyan-300 font-medium inline-flex items-center gap-1"
		}, /* @__PURE__ */ React.createElement("span", null, "Lihat Seluruh Kampus"), /* @__PURE__ */ React.createElement(ChevronRight, { className: "w-3.5 h-3.5" }))), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-slate-400 mb-4" }, jenjangFilter === "Politeknik" ? "Indeks kelayakan operasional sarpras seluruh 11 Politeknik & Akademi KP." : jenjangFilter === "SUPM" ? "Indeks kelayakan operasional sarpras seluruh 7 SUPM se-Indonesia." : "Indeks kelayakan operasional sarpras (Top 10 Satuan Pendidikan KP).")), /* @__PURE__ */ React.createElement("div", { className: "h-72 sm:h-80" }, /* @__PURE__ */ React.createElement(Bar, {
			data: barData,
			options: barOptions
		})), /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-700/60" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-4" }, /* @__PURE__ */ React.createElement("span", { className: "flex items-center gap-1.5" }, /* @__PURE__ */ React.createElement("span", { className: "w-2.5 h-2.5 rounded-full bg-emerald-500" }), /* @__PURE__ */ React.createElement("span", null, "Sangat Baik (≥85%)")), /* @__PURE__ */ React.createElement("span", { className: "flex items-center gap-1.5" }, /* @__PURE__ */ React.createElement("span", { className: "w-2.5 h-2.5 rounded-full bg-sky-500" }), /* @__PURE__ */ React.createElement("span", null, "Cukup (75-84%)")), /* @__PURE__ */ React.createElement("span", { className: "flex items-center gap-1.5" }, /* @__PURE__ */ React.createElement("span", { className: "w-2.5 h-2.5 rounded-full bg-amber-500" }), /* @__PURE__ */ React.createElement("span", null, "Perlu Pemeliharaan (<75%)"))), /* @__PURE__ */ React.createElement("span", { className: "text-cyan-400 font-semibold hidden sm:inline" }, "Rata-rata Nasional: ", avgConditionScore, "%")))), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-5" }, /* @__PURE__ */ React.createElement("div", { className: "lg:col-span-6 bg-slate-800/90 rounded-2xl p-4 sm:p-5 border border-slate-700/70 shadow-lg" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between mb-1" }, /* @__PURE__ */ React.createElement("h3", { className: "text-base font-bold text-white tracking-tight" }, "Radar Kematangan Sarpras per Bidang Vokasi"), /* @__PURE__ */ React.createElement("span", { className: "text-xs text-slate-400 font-mono" }, "Benchmark KKP")), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-slate-400 mb-3" }, "Perbandingan tingkat kelayakan aktual vs target standar minimal vokasi."), /* @__PURE__ */ React.createElement("div", { className: "h-72 sm:h-80" }, /* @__PURE__ */ React.createElement(Radar, {
			data: radarData,
			options: radarOptions
		}))), /* @__PURE__ */ React.createElement("div", { className: "lg:col-span-6 bg-slate-800/90 rounded-2xl p-4 sm:p-5 border border-slate-700/70 shadow-lg flex flex-col" }, /* @__PURE__ */ React.createElement("div", { className: "mb-3" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between mb-1" }, /* @__PURE__ */ React.createElement("h3", { className: "text-base font-bold text-white tracking-tight" }, "Status Kelayakan per Bidang Vokasi"), /* @__PURE__ */ React.createElement("span", { className: "text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium" }, "Target: ", NATIONAL_SARPRAS_TARGETS.targetIndeksKelayakan, "%")), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-slate-400" }, "Capaian indeks kelayakan operasional fisik dibandingkan target standar nasional KKP.")), /* @__PURE__ */ React.createElement("div", { className: "flex-1 flex flex-col justify-between py-1" }, SARPRAS_CATEGORIES.map((cat) => {
			const data = categoryBreakdown[cat.id] || {
				count: 0,
				avgScore: 0
			};
			const score = Math.round(data.avgScore);
			const isTargetMet = score >= NATIONAL_SARPRAS_TARGETS.targetIndeksKelayakan;
			return /* @__PURE__ */ React.createElement("div", {
				key: cat.id,
				className: "space-y-1.5"
			}, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between text-xs" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2 min-w-0 pr-2" }, /* @__PURE__ */ React.createElement("span", {
				className: "w-2 h-2 rounded-full flex-shrink-0",
				style: { backgroundColor: cat.color }
			}), /* @__PURE__ */ React.createElement("span", { className: "text-slate-300 font-medium truncate" }, cat.name)), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2 flex-shrink-0" }, /* @__PURE__ */ React.createElement("span", { className: `font-bold ${isTargetMet ? "text-emerald-400" : "text-amber-400"}` }, score, "%"), /* @__PURE__ */ React.createElement("span", { className: `text-[10px] px-1.5 py-0.5 rounded font-semibold ${isTargetMet ? "bg-emerald-500/20 text-emerald-300" : "bg-amber-500/20 text-amber-300"}` }, isTargetMet ? "Memenuhi" : "Perlu Atensi"))), /* @__PURE__ */ React.createElement("div", { className: "w-full h-1.5 bg-slate-900 rounded-full overflow-hidden" }, /* @__PURE__ */ React.createElement("div", {
				className: `h-full rounded-full transition-all duration-500 ${isTargetMet ? "bg-emerald-500" : "bg-amber-500"}`,
				style: { width: `${Math.min(100, score)}%` }
			})));
		})))), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-5" }, /* @__PURE__ */ React.createElement("div", { className: "lg:col-span-4 bg-slate-800/90 rounded-2xl p-4 sm:p-5 border border-slate-700/70 shadow-lg flex flex-col justify-between" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between mb-1" }, /* @__PURE__ */ React.createElement("h3", { className: "text-base font-bold text-white tracking-tight" }, "Ringkasan Kapasitas Ruang Asrama Taruna"), /* @__PURE__ */ React.createElement("button", { onClick: () => onNavigateTab("asrama"), className: "text-xs text-cyan-400 hover:text-cyan-300 font-medium inline-flex items-center gap-1" }, /* @__PURE__ */ React.createElement("span", null, "Buka Menu Asrama"), /* @__PURE__ */ React.createElement(ChevronRight, { className: "w-3.5 h-3.5" }))), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-slate-400 mb-3" }, `Rekapitulasi ${asramaSummaryStats.satdikTerdata} Satdik terdata (standar 4 m²/orang · luas ${Math.round(asramaSummaryStats.totalLuas).toLocaleString("id-ID")} m² · kapasitas total ${asramaSummaryStats.kapasitasTotal.toLocaleString("id-ID")} orang).`), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-3 gap-2 mb-4 text-xs" }, /* @__PURE__ */ React.createElement("div", { className: "bg-slate-900/60 p-2 sm:p-2.5 rounded-xl border border-slate-800" }, /* @__PURE__ */ React.createElement("span", { className: "text-slate-400 text-[10px] sm:text-[11px] block truncate" }, "Gedung Digunakan"), /* @__PURE__ */ React.createElement("span", { className: "text-emerald-400 font-bold text-xs sm:text-sm block mt-0.5" }, asramaSummaryStats.digunakanCount, " / ", asramaSummaryStats.totalGedung)), /* @__PURE__ */ React.createElement("div", { className: "bg-slate-900/60 p-2 sm:p-2.5 rounded-xl border border-slate-800" }, /* @__PURE__ */ React.createElement("span", { className: "text-slate-400 text-[10px] sm:text-[11px] block truncate" }, "Renovasi / Kosong"), /* @__PURE__ */ React.createElement("span", { className: "text-amber-400 font-bold text-xs sm:text-sm block mt-0.5" }, asramaSummaryStats.renovCount, " / ", asramaSummaryStats.kosongCount, " Gd")), /* @__PURE__ */ React.createElement("div", { className: "bg-slate-900/60 p-2 sm:p-2.5 rounded-xl border border-slate-800" }, /* @__PURE__ */ React.createElement("span", { className: "text-slate-400 text-[10px] sm:text-[11px] block truncate" }, "Selisih Daya Tampung"), /* @__PURE__ */ React.createElement("span", { className: `${asramaSummaryStats.selisih >= 0 ? "text-emerald-400" : "text-rose-400"} font-bold text-xs sm:text-sm block mt-0.5` }, (asramaSummaryStats.selisih >= 0 ? "+" : "") + asramaSummaryStats.selisih.toLocaleString("id-ID"), " (", asramaSummaryStats.ratio, "%)"))), /* @__PURE__ */ React.createElement("div", { className: "space-y-2.5" }, asramaSummaryStats.priorityRows.length > 0 ? asramaSummaryStats.priorityRows.map((row) => { const isOk = row.ratio >= 90; const isSevere = row.ratio < 60; return /* @__PURE__ */ React.createElement("div", { key: row.satdikId, className: "space-y-1" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between text-xs" }, /* @__PURE__ */ React.createElement("span", { className: "text-slate-300 font-medium truncate pr-2" }, row.shortName, " ", /* @__PURE__ */ React.createElement("span", { className: "text-[11px] text-slate-400 font-normal" }, `(${row.kapAkt}/${row.taruna} taruna)`)), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2 flex-shrink-0" }, /* @__PURE__ */ React.createElement("span", { className: `font-bold ${isOk ? "text-emerald-400" : isSevere ? "text-rose-400" : "text-amber-400"}` }, row.ratio, "%"), /* @__PURE__ */ React.createElement("span", { className: `text-[10px] px-1.5 py-0.5 rounded font-semibold ${isOk ? "bg-emerald-500/20 text-emerald-300" : isSevere ? "bg-rose-500/20 text-rose-300" : "bg-amber-500/20 text-amber-300"}` }, row.ratio >= 100 ? "Memadai" : isSevere ? "Defisit Berat" : "Defisit"))), /* @__PURE__ */ React.createElement("div", { className: "w-full h-1.5 bg-slate-900 rounded-full overflow-hidden" }, /* @__PURE__ */ React.createElement("div", { className: `h-full rounded-full transition-all duration-500 ${isOk ? "bg-emerald-500" : isSevere ? "bg-rose-500" : "bg-amber-500"}`, style: { width: `${Math.min(100, row.ratio)}%` } }))); }) : /* @__PURE__ */ React.createElement("p", { className: "text-xs text-slate-400 py-4 text-center" }, "Data rekap asrama belum tersedia untuk filter ini."))), /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 pt-3 mt-4 border-t border-slate-700/60" }, /* @__PURE__ */ React.createElement("span", null, "Memadai (≥100%): ", /* @__PURE__ */ React.createElement("strong", { className: "text-emerald-400" }, asramaSummaryStats.memadaiCount), " · Defisit: ", /* @__PURE__ */ React.createElement("strong", { className: "text-amber-400" }, asramaSummaryStats.defisitCount), " Satdik"), asramaSummaryStats.unsurveyedList.length > 0 && /* @__PURE__ */ React.createElement("span", { className: "text-[11px] text-slate-400" }, "Belum terdata: ", asramaSummaryStats.unsurveyedList.map((u) => u.shortName).join(", ")))), /* @__PURE__ */ React.createElement("div", { className: "lg:col-span-4 bg-slate-800/90 rounded-2xl p-4 sm:p-5 border border-slate-700/70 shadow-lg flex flex-col justify-between" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between mb-1" }, /* @__PURE__ */ React.createElement("h3", { className: "text-base font-bold text-white tracking-tight" }, "Ringkasan Pemenuhan Standar Sarpras Prodi"), /* @__PURE__ */ React.createElement("button", { onClick: () => onNavigateTab("standar"), className: "text-xs text-cyan-400 hover:text-cyan-300 font-medium inline-flex items-center gap-1" }, /* @__PURE__ */ React.createElement("span", null, "Buka Standar Prodi"), /* @__PURE__ */ React.createElement(ChevronRight, { className: "w-3.5 h-3.5" }))), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-slate-400 mb-3" }, standarSummaryStats.hasData ? `Evaluasi ${standarSummaryStats.allTot.toLocaleString("id-ID")} titik standar (${standarSummaryStats.stdPrasaranaCount.toLocaleString("id-ID")} Prasarana · ${standarSummaryStats.stdSaranaCount.toLocaleString("id-ID")} Sarana) pada ${standarSummaryStats.rekapCount} kombinasi Prodi–Satdik.` : "Matriks standar minimal saat ini mencakup 11 Satdik Pendidikan Tinggi (Politeknik & Akademi Komunitas)."), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-3 gap-2 mb-4 text-xs" }, /* @__PURE__ */ React.createElement("div", { className: "bg-slate-900/60 p-2 sm:p-2.5 rounded-xl border border-slate-800" }, /* @__PURE__ */ React.createElement("span", { className: "text-slate-400 text-[10px] sm:text-[11px] block truncate" }, "Terpenuhi Penuh"), /* @__PURE__ */ React.createElement("span", { className: "text-emerald-400 font-bold text-xs sm:text-sm block mt-0.5" }, standarSummaryStats.allFull.toLocaleString("id-ID"), " ", /* @__PURE__ */ React.createElement("span", { className: "text-[10px] font-normal text-slate-400" }, "(", standarSummaryStats.pctFullPoint, "%)"))), /* @__PURE__ */ React.createElement("div", { className: "bg-slate-900/60 p-2 sm:p-2.5 rounded-xl border border-slate-800" }, /* @__PURE__ */ React.createElement("span", { className: "text-slate-400 text-[10px] sm:text-[11px] block truncate" }, "Sebagian"), /* @__PURE__ */ React.createElement("span", { className: "text-sky-400 font-bold text-xs sm:text-sm block mt-0.5" }, standarSummaryStats.allPart.toLocaleString("id-ID"), " ", /* @__PURE__ */ React.createElement("span", { className: "text-[10px] font-normal text-slate-400" }, "(", standarSummaryStats.pctPartPoint, "%)"))), /* @__PURE__ */ React.createElement("div", { className: "bg-slate-900/60 p-2 sm:p-2.5 rounded-xl border border-slate-800" }, /* @__PURE__ */ React.createElement("span", { className: "text-slate-400 text-[10px] sm:text-[11px] block truncate" }, "Belum Tersedia"), /* @__PURE__ */ React.createElement("span", { className: "text-rose-400 font-bold text-xs sm:text-sm block mt-0.5" }, standarSummaryStats.allZero.toLocaleString("id-ID"), " ", /* @__PURE__ */ React.createElement("span", { className: "text-[10px] font-normal text-slate-400" }, "(", standarSummaryStats.pctZeroPoint, "%)")))), standarSummaryStats.hasData ? /* @__PURE__ */ React.createElement("div", { className: "space-y-2.5" }, /* @__PURE__ */ React.createElement("div", { className: "space-y-1" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between text-xs" }, /* @__PURE__ */ React.createElement("span", { className: "text-slate-300 font-medium" }, "Kategori A — Prasarana Ruang / Lab / Workshop"), /* @__PURE__ */ React.createElement("span", { className: "font-bold text-sky-400" }, standarSummaryStats.pctPrasarana, "%")), /* @__PURE__ */ React.createElement("div", { className: "w-full h-1.5 bg-slate-900 rounded-full overflow-hidden" }, /* @__PURE__ */ React.createElement("div", { className: "h-full rounded-full bg-sky-500 transition-all duration-500", style: { width: `${Math.min(100, standarSummaryStats.pctPrasarana)}%` } }))), /* @__PURE__ */ React.createElement("div", { className: "space-y-1 pb-1.5 border-b border-slate-700/50" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between text-xs" }, /* @__PURE__ */ React.createElement("span", { className: "text-slate-300 font-medium" }, "Kategori B — Sarana Peralatan & Mesin Praktik"), /* @__PURE__ */ React.createElement("span", { className: "font-bold text-amber-400" }, standarSummaryStats.pctSarana, "%")), /* @__PURE__ */ React.createElement("div", { className: "w-full h-1.5 bg-slate-900 rounded-full overflow-hidden" }, /* @__PURE__ */ React.createElement("div", { className: "h-full rounded-full bg-amber-500 transition-all duration-500", style: { width: `${Math.min(100, standarSummaryStats.pctSarana)}%` } }))), standarSummaryStats.rumpunRows.map((rb) => /* @__PURE__ */ React.createElement("div", { key: rb.id, className: "space-y-1" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between text-xs" }, /* @__PURE__ */ React.createElement("span", { className: "text-slate-300 font-medium truncate pr-2" }, rb.nama, " ", /* @__PURE__ */ React.createElement("span", { className: "text-[11px] text-slate-400 font-normal" }, `(${rb.totalItems} item · ${rb.satdikCount} satdik)`)), /* @__PURE__ */ React.createElement("span", { className: `font-bold ${rb.pct >= 40 ? "text-emerald-400" : "text-amber-400"}` }, rb.pct, "%")), /* @__PURE__ */ React.createElement("div", { className: "w-full h-1.5 bg-slate-900 rounded-full overflow-hidden" }, /* @__PURE__ */ React.createElement("div", { className: `h-full rounded-full transition-all duration-500 ${rb.pct >= 40 ? "bg-emerald-500" : "bg-cyan-500"}`, style: { width: `${Math.min(100, rb.pct)}%` } }))))) : /* @__PURE__ */ React.createElement("p", { className: "text-xs text-slate-400 py-4 text-center" }, "Pilih filter Semua (18) atau Politeknik (11) untuk melihat capaian standar minimal prodi.")), /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 pt-3 mt-4 border-t border-slate-700/60" }, /* @__PURE__ */ React.createElement("span", null, "Memadai (≥70%): ", /* @__PURE__ */ React.createElement("strong", { className: "text-emerald-400" }, standarSummaryStats.memadai), " · Penguatan: ", /* @__PURE__ */ React.createElement("strong", { className: "text-sky-400" }, standarSummaryStats.penguatan), " · Defisit: ", /* @__PURE__ */ React.createElement("strong", { className: "text-rose-400" }, standarSummaryStats.defisit)), /* @__PURE__ */ React.createElement("span", { className: "text-cyan-400 font-semibold" }, "Rata-rata: ", standarSummaryStats.pctTotal, "%"))), /* @__PURE__ */ React.createElement("div", { className: "lg:col-span-4 bg-slate-800/90 rounded-2xl p-4 sm:p-5 border border-cyan-500/40 shadow-lg flex flex-col justify-between" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between mb-1" }, /* @__PURE__ */ React.createElement("h3", { className: "text-base font-bold text-white tracking-tight" }, "Ringkasan Fasilitas Tambak & Kolam"), /* @__PURE__ */ React.createElement("button", { onClick: () => onNavigateTab("tambak"), className: "text-xs text-cyan-400 hover:text-cyan-300 font-medium inline-flex items-center gap-1" }, /* @__PURE__ */ React.createElement("span", null, "Buka Menu Tambak"), /* @__PURE__ */ React.createElement(ChevronRight, { className: "w-3.5 h-3.5" }))), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-slate-400 mb-3" }, `Rekapitulasi ${tambakSummaryStats.totalUnit.toLocaleString("id-ID")} unit sarpras budidaya pada ${tambakSummaryStats.satdikCount} Satdik (luas total ${Math.round(tambakSummaryStats.totalLuasM2).toLocaleString("id-ID")} m² / ${tambakSummaryStats.totalLuasHa.toLocaleString("id-ID")} Ha · ${tambakSummaryStats.kondisiBaik} unit laik fungsi).`), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-3 gap-2 mb-4 text-xs" }, /* @__PURE__ */ React.createElement("div", { className: "bg-slate-900/60 p-2 sm:p-2.5 rounded-xl border border-slate-800" }, /* @__PURE__ */ React.createElement("span", { className: "text-slate-400 text-[10px] sm:text-[11px] block truncate" }, "Tambak Payau"), /* @__PURE__ */ React.createElement("span", { className: "text-cyan-400 font-bold text-xs sm:text-sm block mt-0.5" }, tambakSummaryStats.jumlahTambak, " Unit ", /* @__PURE__ */ React.createElement("span", { className: "text-[10px] font-normal text-slate-400" }, `(${tambakSummaryStats.luasTambakHa} Ha)`))), /* @__PURE__ */ React.createElement("div", { className: "bg-slate-900/60 p-2 sm:p-2.5 rounded-xl border border-slate-800" }, /* @__PURE__ */ React.createElement("span", { className: "text-slate-400 text-[10px] sm:text-[11px] block truncate" }, "Kolam Budidaya"), /* @__PURE__ */ React.createElement("span", { className: "text-sky-400 font-bold text-xs sm:text-sm block mt-0.5" }, tambakSummaryStats.jumlahKolam, " Unit ", /* @__PURE__ */ React.createElement("span", { className: "text-[10px] font-normal text-slate-400" }, `(${tambakSummaryStats.luasKolamHa} Ha)`))), /* @__PURE__ */ React.createElement("div", { className: "bg-slate-900/60 p-2 sm:p-2.5 rounded-xl border border-slate-800" }, /* @__PURE__ */ React.createElement("span", { className: "text-slate-400 text-[10px] sm:text-[11px] block truncate" }, "Tandon & Bak"), /* @__PURE__ */ React.createElement("span", { className: "text-emerald-400 font-bold text-xs sm:text-sm block mt-0.5" }, tambakSummaryStats.jumlahLainnya, " Unit ", /* @__PURE__ */ React.createElement("span", { className: "text-[10px] font-normal text-slate-400" }, `(${tambakSummaryStats.luasLainnyaHa} Ha)`)))), /* @__PURE__ */ React.createElement("div", { className: "space-y-2.5" }, tambakSummaryStats.topSatdikRows.map((row) => /* @__PURE__ */ React.createElement("div", { key: row.satdikId, className: "space-y-1" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between text-xs" }, /* @__PURE__ */ React.createElement("span", { className: "text-slate-300 font-medium truncate pr-2" }, row.shortName, " ", /* @__PURE__ */ React.createElement("span", { className: "text-[11px] text-slate-400 font-normal" }, `(${row.unitCount} unit · ${row.luasHa} Ha)`)), /* @__PURE__ */ React.createElement("span", { className: `font-bold ${row.pctBaik >= 85 ? "text-emerald-400" : "text-amber-400"}` }, row.pctBaik, "% Baik")), /* @__PURE__ */ React.createElement("div", { className: "w-full h-1.5 bg-slate-900 rounded-full overflow-hidden" }, /* @__PURE__ */ React.createElement("div", { className: `h-full rounded-full transition-all duration-500 ${row.pctBaik >= 85 ? "bg-emerald-500" : "bg-amber-500"}`, style: { width: `${Math.min(100, row.pctBaik)}%` } })))))), /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 pt-3 mt-4 border-t border-slate-700/60" }, /* @__PURE__ */ React.createElement("span", null, "Kondisi: ", /* @__PURE__ */ React.createElement("strong", { className: "text-emerald-400" }, tambakSummaryStats.kondisiBaik), " Baik · ", /* @__PURE__ */ React.createElement("strong", { className: "text-amber-400" }, tambakSummaryStats.kondisiRR), " RR · ", /* @__PURE__ */ React.createElement("strong", { className: "text-rose-400" }, tambakSummaryStats.kondisiRB), " RB"), /* @__PURE__ */ React.createElement("span", { className: "text-cyan-400 font-semibold" }, "Laik Operasi: ", tambakSummaryStats.pctBaik, "%")))));
	};
})();
const ExecutiveDashboard = window.__ExecutiveDashboard;

// ============================================================================
// MODULE: src/components/GeospatialMap.jsx
// ============================================================================
(() => {
	const { useState, useRef, useEffect, useCallback, useMemo } = React;
	const L = window.L;
	const { MapPin, Navigation, School, ExternalLink, Search, Compass, Info, ZoomIn, ZoomOut, RotateCcw, Locate, Globe, Map: MapIcon, Satellite, GraduationCap, Layers, Bed, Fish, CheckCircle2, X } = window.__VENDOR__.Lucide;
	const { SATDIK_LIST } = window.SARPRAS_DATA;
	// Peta Base Tile Providers (Semua peta asli beresolusi tinggi & gratis diakses)
	const TILE_LAYERS = {
		osm: {
			name: "Peta Standar (OSM)",
			icon: MapIcon,
			url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
			attribution: "&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> kontributor",
			maxZoom: 19
		},
		satellite: {
			name: "Satelit Asli (Esri)",
			icon: Satellite,
			url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
			attribution: "Citra Satelit &copy; Esri, Maxar, Earthstar Geographics, USDA, USGS",
			maxZoom: 18
		},
		topo: {
			name: "Topografi & Pesisir",
			icon: Globe,
			url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
			attribution: "Topografi &copy; Esri, HERE, Garmin, Intermap, USGS, METI/NASA",
			maxZoom: 18
		}
	};
	// Batas wilayah geospasial Indonesia Sabang s/d Merauke
	const INDONESIA_BOUNDS = [[-11.2, 94.8], [6.2, 141.2]];
	const INDONESIA_CENTER = [-2.2, 118];
	window.__GeospatialMap = function GeospatialMap({ satdikBreakdown, onSelectSatdikForExplorer, onNavigateTab }) {
		const [selectedSatdikId, setSelectedSatdikId] = useState("poltek-aup");
		const [regionFilter, setRegionFilter] = useState("ALL");
		const [jenjangFilter, setJenjangFilter] = useState("ALL");
		const [searchQuery, setSearchQuery] = useState("");
		const [activeLayer, setActiveLayer] = useState("osm");
		const [currentZoom, setCurrentZoom] = useState(5);
		const [isCalibrationModalOpen, setIsCalibrationModalOpen] = useState(false);
		const [isSidebarHighlighted, setIsSidebarHighlighted] = useState(false);
		const sidebarPanelRef = useRef(null);
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
			return SATDIK_LIST.filter((item) => {
				const matchesRegion = regionFilter === "ALL" || item.region === regionFilter;
				const matchesJenjang = jenjangFilter === "ALL" || jenjangFilter === "Politeknik" && (item.type === "Politeknik" || item.type === "Akademi") || jenjangFilter === "SUPM" && item.type === "SUPM";
				const matchesSearch = !searchQuery || item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.shortName.toLowerCase().includes(searchQuery.toLowerCase()) || item.kota.toLowerCase().includes(searchQuery.toLowerCase()) || item.provinsi.toLowerCase().includes(searchQuery.toLowerCase());
				return matchesRegion && matchesJenjang && matchesSearch;
			});
		}, [
			regionFilter,
			jenjangFilter,
			searchQuery
		]);
		const selectedSatdik = useMemo(() => {
			return SATDIK_LIST.find((s) => s.id === selectedSatdikId) || SATDIK_LIST[0];
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
			if (score >= 85) return {
				hex: "#10b981",
				bg: "bg-emerald-500",
				text: "text-emerald-400",
				border: "border-emerald-400"
			};
			if (score >= 75) return {
				hex: "#0284c7",
				bg: "bg-sky-500",
				text: "text-sky-400",
				border: "border-sky-400"
			};
			return {
				hex: "#f43f5e",
				bg: "bg-rose-500",
				text: "text-rose-400",
				border: "border-rose-400"
			};
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
    ` : "";
			return L.divIcon({
				className: "custom-satdik-marker",
				html: `
        <div style="display: flex; flex-direction: column; align-items: center; cursor: pointer; transform: ${isSelected ? "scale(1.15)" : "scale(1)"}; transition: transform 0.2s ease;">
          <div style="position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center;">
            ${isSelected ? `
              <div style="position: absolute; inset: -6px; border-radius: 50%; background-color: ${color.hex}; opacity: 0.45;" class="animate-ping"></div>
            ` : ""}
            <div style="width: ${isSelected ? "32px" : "26px"}; height: ${isSelected ? "32px" : "26px"}; border-radius: 50%; background: ${color.hex}; border: ${isSelected ? "3px" : "2px"} solid #ffffff; display: flex; align-items: center; justify-content: center; box-shadow: 0 3px 10px rgba(0,0,0,0.5); transition: all 0.2s ease;">
              <svg width="${isSelected ? "15" : "13"}" height="${isSelected ? "15" : "13"}" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
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
			const metrics = satdikBreakdown[item.id] || {
				avgScore: 80,
				count: 0,
				baik: 0,
				rusakRingan: 0,
				rusakBerat: 0
			};
			const score = Math.round(metrics.avgScore || 80);
			const scoreColorHex = score >= 85 ? "#10b981" : score >= 75 ? "#0284c7" : "#f43f5e";
			const gmapsQuery = encodeURIComponent(`${item.name} ${item.kota}`);
			const cal = metrics.calibration;
			const calComponentsHtml = (cal && Array.isArray(cal.components) && cal.components.length > 0)
				? `
          <div style="margin-bottom: 10px; background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(56, 189, 248, 0.25); border-radius: 8px; padding: 7px 8px;">
            <div style="display: flex; align-items: center; justify-content: space-between; font-size: 9.5px; font-weight: 700; color: #38bdf8; text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 5px;">
              <span>Sumber Kalibrasi 3 Pilar:</span>
              <span style="font-size: 8.5px; color: #94a3b8; font-weight: 600;">BPPSDM KP</span>
            </div>
            <div style="display: flex; flex-direction: column; gap: 3.5px;">
              ${cal.components.map(c => `
                <div style="display: flex; align-items: center; justify-content: space-between; font-size: 10px; color: #cbd5e1; background: rgba(30, 41, 59, 0.6); padding: 3px 6px; border-radius: 4px;">
                  <span style="display: flex; align-items: center; gap: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 180px;">
                    <span style="width: 5px; height: 5px; border-radius: 50%; background: #38bdf8; flex-shrink: 0;"></span>
                    <span style="font-weight: 600;">${c.name}</span>
                    <span style="color: #94a3b8; font-size: 8.5px;">(${c.weightPercent}%)</span>
                  </span>
                  <strong style="font-family: monospace; font-size: 10.5px; color: ${c.score >= 85 ? '#10b981' : c.score >= 75 ? '#38bdf8' : '#f43f5e'}; flex-shrink: 0;">${c.score}%</strong>
                </div>
              `).join('')}
            </div>
          </div>
        `
				: "";

			return `
      <div style="font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 14px 16px; min-width: 270px; max-width: 325px;">
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

        <!-- Score Kelayakan BMN Terkalibrasi -->
        <div style="margin-bottom: 10px;">
          <div style="display: flex; justify-content: space-between; font-size: 11px; font-weight: 600; margin-bottom: 3px;">
            <span style="color: #cbd5e1;">Indeks Kelayakan (Terkalibrasi):</span>
            <span style="color: ${scoreColorHex}; font-weight: 800;">${score}%</span>
          </div>
          <div style="width: 100%; height: 6px; background: #1e293b; border-radius: 9999px; overflow: hidden;">
            <div style="width: ${score}%; height: 100%; background: ${scoreColorHex}; border-radius: 9999px;"></div>
          </div>
        </div>

        <!-- Rincian 3 Pilar Kalibrasi -->
        ${calComponentsHtml}

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
            style="flex: 1; padding: 7px 10px; font-size: 11px; font-weight: 700; background: #0284c7; color: #ffffff; border: none; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px; box-shadow: 0 2px 6px rgba(2, 132, 199, 0.4);"
            title="Tutup popup dan arahkan langsung ke Panel Detail Kampus di sebelah kanan"
          >
            🔍 Rincian di Panel Kanan ➔
          </button>
          <button 
            type="button" 
            data-satdik-calib-modal="true"
            style="padding: 7px 10px; font-size: 11px; font-weight: 700; background: rgba(30, 41, 59, 0.95); color: #38bdf8; border: 1.5px solid rgba(56, 189, 248, 0.5); border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px;"
            title="Buka panduan lengkap sumber data 3 pilar dan rumus kalibrasi persentase"
          >
            ℹ️ Rumus %
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
				subdomains: defaultLayerCfg.subdomains || "abc",
				maxZoom: defaultLayerCfg.maxZoom
			}).addTo(map);
			tileLayerRef.current = tileLayer;
			// Pasang Layer Group untuk Marker Kampus
			const markersLayer = L.layerGroup().addTo(map);
			markersLayerRef.current = markersLayer;
			// Dengarkan perubahan zoom
			map.on("zoomend", () => {
				setCurrentZoom(map.getZoom());
			});
			// Delegasi klik tombol di dalam Leaflet Popup
			map.on("popupopen", (e) => {
				const container = e.popup.getElement();
				if (!container) return;
				const focusBtn = container.querySelector("[data-satdik-focus-id]");
				if (focusBtn) {
					focusBtn.onclick = (evt) => {
						evt.preventDefault();
						evt.stopPropagation();
						const id = focusBtn.getAttribute("data-satdik-focus-id");
						setSelectedSatdikId(id);
						// Tutup popup agar pandangan ke peta dan panel bersih
						map.closePopup();
						// Aktifkan efek highlight/glow pada Panel Detail Kampus di sebelah kanan
						setIsSidebarHighlighted(true);
						setTimeout(() => {
							setIsSidebarHighlighted(false);
						}, 2500);
						// Scroll layar secara mulus langsung ke Panel Kanan
						if (sidebarPanelRef.current) {
							sidebarPanelRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
						}
					};
				}
				const calibBtn = container.querySelector("[data-satdik-calib-modal]");
				if (calibBtn) {
					calibBtn.onclick = (evt) => {
						evt.preventDefault();
						evt.stopPropagation();
						map.closePopup();
						setIsCalibrationModalOpen(true);
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
				subdomains: cfg.subdomains || "abc",
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
			filteredSatdik.forEach((item) => {
				const isSelected = item.id === selectedSatdikId;
				const icon = createMarkerIcon(item, isSelected);
				const marker = L.marker([item.lat, item.lng], { icon });
				// Tambahkan Tooltip nama kampus saat mouse hover
				marker.bindTooltip(`${item.shortName} (${item.kota})`, {
					direction: "top",
					offset: [0, -22],
					className: "satdik-map-tooltip"
				});
				// Tambahkan Popup detail
				marker.bindPopup(createPopupContent(item), {
					maxWidth: 320,
					className: "satdik-leaflet-popup"
				});
				// Event klik marker
				marker.on("click", () => {
					setSelectedSatdikId(item.id);
				});
				marker.addTo(markersLayer);
				markersMapRef.current[item.id] = marker;
			});
		}, [
			filteredSatdik,
			selectedSatdikId,
			createMarkerIcon,
			createPopupContent
		]);
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
			if (newRegion === "ALL") {
				handleResetZoom();
				return;
			}
			// Ambil satdik di region tersebut untuk hitung bounding box asli
			const regionSatdiks = SATDIK_LIST.filter((s) => s.region === newRegion);
			if (regionSatdiks.length > 0) {
				const bounds = L.latLngBounds(regionSatdiks.map((s) => [s.lat, s.lng]));
				map.fitBounds(bounds, {
					padding: [60, 60],
					maxZoom: 9,
					animate: true,
					duration: 1.2
				});
			}
		};

		// Modal Transparansi & Metodologi Kalibrasi 3 Pilar
		const renderCalibrationModal = () => {
			if (!isCalibrationModalOpen) return null;
			return /* @__PURE__ */ React.createElement("div", {
				className: "calibration-modal-overlay fixed inset-0 flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fadeIn",
				style: {
					position: "fixed",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					zIndex: 999999,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					backgroundColor: "rgba(15, 23, 42, 0.88)",
					backdropFilter: "blur(8px)",
					WebkitBackdropFilter: "blur(8px)"
				},
				onClick: () => setIsCalibrationModalOpen(false)
			}, /* @__PURE__ */ React.createElement("div", {
				className: "calibration-modal-content bg-slate-900 border border-slate-700/80 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col text-slate-200 my-auto",
				style: { zIndex: 1000000, position: "relative" },
				onClick: (e) => e.stopPropagation()
			}, /* @__PURE__ */ React.createElement("div", {
				className: "p-4 sm:p-5 border-b border-slate-800 flex items-start justify-between gap-3 sticky top-0 bg-slate-900/95 backdrop-blur z-10"
			}, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", {
				className: "flex items-center gap-2 mb-1"
			}, /* @__PURE__ */ React.createElement("span", {
				className: "px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
			}, "Metodologi & Sumber Data"), /* @__PURE__ */ React.createElement("span", {
				className: "text-xs text-slate-400"
			}, "• BPPSDM KP 2026")), /* @__PURE__ */ React.createElement("h3", {
				className: "text-base sm:text-lg font-bold text-white flex items-center gap-2"
			}, /* @__PURE__ */ React.createElement(Layers, { className: "w-5 h-5 text-cyan-400" }), "Transparansi Kalibrasi Persentase Kelayakan Sarpras Peta"), /* @__PURE__ */ React.createElement("p", {
				className: "text-xs text-slate-400 mt-1"
			}, "Penetapan Indeks Kelayakan Sarana dan Prasarana (IKSP) Satuan Pendidikan KP secara terstandar dan berimbang.")), /* @__PURE__ */ React.createElement("button", {
				type: "button",
				onClick: () => setIsCalibrationModalOpen(false),
				className: "w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors flex-shrink-0",
				"aria-label": "Tutup modal"
			}, /* @__PURE__ */ React.createElement(X, { className: "w-4 h-4" }))), /* @__PURE__ */ React.createElement("div", {
				className: "p-4 sm:p-6 space-y-5 text-xs text-slate-300 leading-relaxed overflow-y-auto"
			}, /* @__PURE__ */ React.createElement("div", {
				className: "bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-2"
			}, /* @__PURE__ */ React.createElement("h4", {
				className: "text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5"
			}, /* @__PURE__ */ React.createElement(Info, { className: "w-4 h-4 text-cyan-400" }), "Mengapa Kalibrasi Persentase Dilakukan?"), /* @__PURE__ */ React.createElement("p", null, "Sebelum kalibrasi, persentase pada peta dihitung dari rata-rata mentah seluruh aset tanpa pengelompokan pilar. Hal ini menimbulkan bias: kampus dengan puluhan petak tambak (seperti Sidoarjo & Jembrana yang memiliki 46-50 kolam) skornya didominasi 90%+ oleh tambak sehingga menutupi pemenuhan laboratorium/ruang prodi. Sebaliknya, kampus dengan data sedikit terlihat tinggi secara semu."), /* @__PURE__ */ React.createElement("p", {
				className: "text-cyan-300 font-medium"
			}, "Melalui kalibrasi ini, setiap kampus dinilai secara proporsional dari 3 Pilar Resmi BPPSDM KP dengan rata-rata nasional terkalibrasi saat ini berada pada angka 82.2% (Kategori Sedang-Optimal).")), /* @__PURE__ */ React.createElement("div", {
				className: "space-y-3"
			}, /* @__PURE__ */ React.createElement("h4", {
				className: "text-xs font-bold text-white uppercase tracking-wider"
			}, "3 Pilar Resmi Sumber Persentase (%)"), /* @__PURE__ */ React.createElement("div", {
				className: "bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60 space-y-2"
			}, /* @__PURE__ */ React.createElement("div", {
				className: "flex items-center justify-between"
			}, /* @__PURE__ */ React.createElement("span", {
				className: "font-bold text-white text-xs flex items-center gap-2"
			}, /* @__PURE__ */ React.createElement(Bed, { className: "w-4 h-4 text-cyan-400" }), "1. Pilar Asrama Taruna", /* @__PURE__ */ React.createElement("span", {
				className: "text-[10px] text-cyan-400 font-mono bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800"
			}, "Bobot Acuan 35%")), /* @__PURE__ */ React.createElement("span", {
				className: "text-[10px] text-slate-400 italic"
			}, "Rekap Asrama BPPSDM KP 2025")), /* @__PURE__ */ React.createElement("p", {
				className: "text-slate-300 text-[11px]"
			}, "Dihitung dari kombinasi kelaikan fisik gedung (bobot 65%: Digunakan = 100%, Perlu Renovasi = 65%, Tidak Digunakan = 25%) dan rasio kecukupan kapasitas ranjang aktif terhadap populasi taruna (bobot 35%).")), /* @__PURE__ */ React.createElement("div", {
				className: "bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60 space-y-2"
			}, /* @__PURE__ */ React.createElement("div", {
				className: "flex items-center justify-between"
			}, /* @__PURE__ */ React.createElement("span", {
				className: "font-bold text-white text-xs flex items-center gap-2"
			}, /* @__PURE__ */ React.createElement(Fish, { className: "w-4 h-4 text-cyan-400" }), "2. Pilar Tambak & Kolam Praktik", /* @__PURE__ */ React.createElement("span", {
				className: "text-[10px] text-cyan-400 font-mono bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800"
			}, "Bobot Acuan 35%")), /* @__PURE__ */ React.createElement("span", {
				className: "text-[10px] text-slate-400 italic"
			}, "Inventarisasi Tambak Satdik KP")), /* @__PURE__ */ React.createElement("p", {
				className: "text-slate-300 text-[11px]"
			}, "Dihitung dari kondisi fisik petak budidaya/kolam/hatchery (bobot 70%: Baik = 100%, Rusak Ringan = 65%, Rusak Berat = 25%) dan rasio petak aktif beroperasi (bobot 30%), dilengkapi baseline smoothing untuk satuan dengan unit terbatas (≤2 unit).")), /* @__PURE__ */ React.createElement("div", {
				className: "bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60 space-y-2"
			}, /* @__PURE__ */ React.createElement("div", {
				className: "flex items-center justify-between"
			}, /* @__PURE__ */ React.createElement("span", {
				className: "font-bold text-white text-xs flex items-center gap-2"
			}, /* @__PURE__ */ React.createElement(GraduationCap, { className: "w-4 h-4 text-cyan-400" }), "3. Pilar Standar Minimal Sarpras Prodi", /* @__PURE__ */ React.createElement("span", {
				className: "text-[10px] text-cyan-400 font-mono bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800"
			}, "Bobot Acuan 30%")), /* @__PURE__ */ React.createElement("span", {
				className: "text-[10px] text-slate-400 italic"
			}, "Matriks Kurikulum 12 Rumpun Vokasi")), /* @__PURE__ */ React.createElement("p", {
				className: "text-slate-300 text-[11px]"
			}, "Dihitung dari pemenuhan prasarana inti lab/workshop (bobot 65%) + ketersediaan sarana/peralatan kurikulum (bobot 20%) + total standar (bobot 15%). Kampus menengah (SUPM) yang belum masuk matriks D3/D4 diselaraskan bobotnya ke pilar aktif dan baseline akreditasi kejuruan."))), /* @__PURE__ */ React.createElement("div", {
				className: "bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 space-y-2"
			}, /* @__PURE__ */ React.createElement("h4", {
				className: "text-xs font-bold text-white uppercase tracking-wider"
			}, "Klasifikasi Status Persentase Kelayakan"), /* @__PURE__ */ React.createElement("div", {
				className: "grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1"
			}, /* @__PURE__ */ React.createElement("div", {
				className: "p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300"
			}, /* @__PURE__ */ React.createElement("div", {
				className: "font-bold text-xs flex items-center gap-1.5"
			}, /* @__PURE__ */ React.createElement("span", { className: "w-2.5 h-2.5 rounded-full bg-emerald-500" }), "≥ 85% (Optimal)"), /* @__PURE__ */ React.createElement("p", {
				className: "text-[10px] text-slate-300 mt-1"
			}, "Sarpras siap pakai prima, asrama berkapasitas cukup, dan fasilitas praktik memadai.")), /* @__PURE__ */ React.createElement("div", {
				className: "p-2.5 rounded-lg bg-sky-950/40 border border-sky-500/30 text-sky-300"
			}, /* @__PURE__ */ React.createElement("div", {
				className: "font-bold text-xs flex items-center gap-1.5"
			}, /* @__PURE__ */ React.createElement("span", { className: "w-2.5 h-2.5 rounded-full bg-sky-500" }), "75% - 84% (Sedang)"), /* @__PURE__ */ React.createElement("p", {
				className: "text-[10px] text-slate-300 mt-1"
			}, "Operasional berjalan normal dengan kebutuhan renovasi ringan berkala.")), /* @__PURE__ */ React.createElement("div", {
				className: "p-2.5 rounded-lg bg-rose-950/40 border border-rose-500/30 text-rose-300"
			}, /* @__PURE__ */ React.createElement("div", {
				className: "font-bold text-xs flex items-center gap-1.5"
			}, /* @__PURE__ */ React.createElement("span", { className: "w-2.5 h-2.5 rounded-full bg-rose-500" }), "< 75% (Perhatian)"), /* @__PURE__ */ React.createElement("p", {
				className: "text-[10px] text-slate-300 mt-1"
			}, "Memerlukan intervensi segera (gedung asrama rusak, kolam idle, atau defisit alat)."))))), /* @__PURE__ */ React.createElement("div", {
				className: "p-4 border-t border-slate-800 flex justify-end bg-slate-900/90"
			}, /* @__PURE__ */ React.createElement("button", {
				type: "button",
				onClick: () => setIsCalibrationModalOpen(false),
				className: "px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-colors shadow-sm"
			}, "Mengerti & Tutup"))));
		};

		return /* @__PURE__ */ React.createElement("div", { className: "space-y-6" }, /* @__PURE__ */ React.createElement("div", { className: "bg-slate-800/90 rounded-2xl p-4 sm:p-5 border border-slate-700/70 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap items-center gap-2" }, /* @__PURE__ */ React.createElement("span", { className: "px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30" }, "Sistem Informasi Geospasial"), /* @__PURE__ */ React.createElement("span", { className: "text-slate-400 text-xs" }, "• 18 Satdik Sabang s/d Merauke")), /* @__PURE__ */ React.createElement("h2", { className: "text-xl sm:text-2xl font-bold text-white tracking-tight mt-1 flex items-center gap-2" }, /* @__PURE__ */ React.createElement(Navigation, { className: "w-5 h-5 text-cyan-400" }), /* @__PURE__ */ React.createElement("span", null, "Peta Persebaran Sarana dan Prasarana Satuan Pendidikan KP")), /* @__PURE__ */ React.createElement("p", { className: "text-slate-400 text-xs sm:text-sm mt-0.5" }, "Peta geografis nyata menampilkan sebaran kampus Politeknik & SUPM KKP dengan citra satelit dan data kelayakan BMN terintegrasi.")), /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap items-center gap-2 self-start md:self-center" }, /* @__PURE__ */ React.createElement("div", { className: "relative" }, /* @__PURE__ */ React.createElement(Search, { className: "w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" }), /* @__PURE__ */ React.createElement("input", {
			type: "text",
			placeholder: "Cari kampus / kota...",
			value: searchQuery,
			onChange: (e) => setSearchQuery(e.target.value),
			className: "bg-slate-900 text-slate-200 border border-slate-700 text-xs rounded-xl pl-8 pr-3 py-2 focus:outline-none focus:border-cyan-500 shadow-sm w-36 sm:w-48 placeholder:text-slate-500"
		})), /* @__PURE__ */ React.createElement("select", {
			value: regionFilter,
			onChange: (e) => handleRegionChange(e.target.value),
			className: "bg-slate-900 text-slate-200 border border-slate-700 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-500 shadow-sm"
		}, /* @__PURE__ */ React.createElement("option", { value: "ALL" }, "Semua Wilayah (18 Satdik)"), /* @__PURE__ */ React.createElement("option", { value: "Sumatera" }, "Sumatera (4 Satdik)"), /* @__PURE__ */ React.createElement("option", { value: "Jawa" }, "Jawa (5 Satdik)"), /* @__PURE__ */ React.createElement("option", { value: "Kalimantan" }, "Kalimantan (1 Satdik)"), /* @__PURE__ */ React.createElement("option", { value: "Sulawesi" }, "Sulawesi (4 Satdik)"), /* @__PURE__ */ React.createElement("option", { value: "Bali-Nusa Tenggara" }, "Bali & NT (2 Satdik)"), /* @__PURE__ */ React.createElement("option", { value: "Maluku" }, "Maluku (1 Satdik)"), /* @__PURE__ */ React.createElement("option", { value: "Papua" }, "Papua (1 Satdik)")), /* @__PURE__ */ React.createElement("div", { className: "flex items-center bg-slate-900 rounded-xl p-1 border border-slate-700" }, /* @__PURE__ */ React.createElement("button", {
			onClick: () => setJenjangFilter("ALL"),
			className: `px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${jenjangFilter === "ALL" ? "bg-cyan-600 text-white shadow-xs" : "text-slate-400 hover:text-white"}`
		}, "Semua"), /* @__PURE__ */ React.createElement("button", {
			onClick: () => setJenjangFilter("Politeknik"),
			className: `px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${jenjangFilter === "Politeknik" ? "bg-cyan-600 text-white shadow-xs" : "text-slate-400 hover:text-white"}`
		}, "Poltek (11)"), /* @__PURE__ */ React.createElement("button", {
			onClick: () => setJenjangFilter("SUPM"),
			className: `px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${jenjangFilter === "SUPM" ? "bg-cyan-600 text-white shadow-xs" : "text-slate-400 hover:text-white"}`
		}, "SUPM (7)")))), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-6" }, /* @__PURE__ */ React.createElement("div", { className: "lg:col-span-8 bg-slate-800/90 rounded-2xl p-3.5 sm:p-4 border border-slate-700/70 shadow-md flex flex-col overflow-hidden" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-2.5" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement(Compass, { className: "w-4 h-4 text-cyan-400 flex-shrink-0" }), /* @__PURE__ */ React.createElement("h3", { className: "text-sm sm:text-base font-bold text-white tracking-tight" }, "Peta Asli Nusantara (Interaktif)")), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-1.5 flex-wrap" }, /* @__PURE__ */ React.createElement("span", { className: "text-[11px] text-slate-400 font-medium mr-1 hidden sm:inline" }, "Lapisan:"), /* @__PURE__ */ React.createElement("button", {
			type: "button",
			onClick: () => setActiveLayer("satellite"),
			className: `flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${activeLayer === "satellite" ? "bg-cyan-600 text-white shadow-sm" : "bg-slate-900/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700"}`,
			title: "Citra Satelit Asli Resolusi Tinggi"
		}, /* @__PURE__ */ React.createElement(Satellite, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ React.createElement("span", null, "Satelit Asli")), /* @__PURE__ */ React.createElement("button", {
			type: "button",
			onClick: () => setActiveLayer("osm"),
			className: `flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${activeLayer === "osm" ? "bg-cyan-600 text-white shadow-sm" : "bg-slate-900/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700"}`,
			title: "Peta Jalan dan Geografi Standar (OSM)"
		}, /* @__PURE__ */ React.createElement(MapIcon, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ React.createElement("span", null, "Peta Jalan")), /* @__PURE__ */ React.createElement("button", {
			type: "button",
			onClick: () => setActiveLayer("topo"),
			className: `flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${activeLayer === "topo" ? "bg-cyan-600 text-white shadow-sm" : "bg-slate-900/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700"}`,
			title: "Peta Topografi & Pesisir"
		}, /* @__PURE__ */ React.createElement(Globe, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ React.createElement("span", null, "Topografi")))), /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap items-center justify-between text-xs px-2.5 py-1.5 mb-2 bg-slate-900/60 rounded-xl border border-slate-800 gap-2" }, /* @__PURE__ */ React.createElement("span", { className: "text-[11px] text-slate-400 font-medium flex items-center gap-1" }, /* @__PURE__ */ React.createElement(Info, { className: "w-3 h-3 text-cyan-400" }), /* @__PURE__ */ React.createElement("span", null, "Status Kelayakan BMN (Terkalibrasi):")), /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap items-center gap-3" }, /* @__PURE__ */ React.createElement("span", { className: "flex items-center gap-1.5 text-slate-300 text-[11px]" }, /* @__PURE__ */ React.createElement("span", { className: "w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" }), /* @__PURE__ */ React.createElement("span", null, "≥85% (Optimal)")), /* @__PURE__ */ React.createElement("span", { className: "flex items-center gap-1.5 text-slate-300 text-[11px]" }, /* @__PURE__ */ React.createElement("span", { className: "w-2.5 h-2.5 rounded-full bg-sky-500 shadow-sm shadow-sky-500/50" }), /* @__PURE__ */ React.createElement("span", null, "75-84% (Sedang)")), /* @__PURE__ */ React.createElement("span", { className: "flex items-center gap-1.5 text-slate-300 text-[11px]" }, /* @__PURE__ */ React.createElement("span", { className: "w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50" }), /* @__PURE__ */ React.createElement("span", null, "<75% (Perhatian)")), /* @__PURE__ */ React.createElement("button", {
			type: "button",
			onClick: () => setIsCalibrationModalOpen(true),
			className: "px-2.5 py-0.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-300 hover:text-white border border-cyan-800 text-[11px] font-semibold flex items-center gap-1.5 transition-all shadow-2xs",
			title: "Lihat penjelasan sumber 3 pilar dan rumus kalibrasi persentase"
		}, /* @__PURE__ */ React.createElement(Layers, { className: "w-3 h-3 text-cyan-400" }), /* @__PURE__ */ React.createElement("span", null, "Sumber & Rumus Kalibrasi (%)")))), /* @__PURE__ */ React.createElement("div", { className: "relative w-full flex-1 min-h-[380px] xs:min-h-[440px] sm:min-h-[500px] rounded-xl border border-slate-700/80 overflow-hidden shadow-inner" }, /* @__PURE__ */ React.createElement("div", {
			ref: mapContainerRef,
			className: "w-full h-full min-h-[380px] xs:min-h-[440px] sm:min-h-[500px]"
		}), /* @__PURE__ */ React.createElement("div", { className: "absolute top-3 left-3 z-10 flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/80 text-[11px] text-cyan-300 font-medium shadow-lg pointer-events-none" }, /* @__PURE__ */ React.createElement(Compass, { className: "w-3.5 h-3.5 text-cyan-400" }), /* @__PURE__ */ React.createElement("span", null, "Peta Asli Terkalibrasi GPS"), /* @__PURE__ */ React.createElement("span", { className: "text-slate-500" }, "•"), /* @__PURE__ */ React.createElement("span", { className: "font-mono text-white text-[10px]" }, "WPP-NRI")), /* @__PURE__ */ React.createElement("div", { className: "absolute top-3 right-3 z-10 flex flex-col items-center bg-slate-900/90 backdrop-blur-md rounded-xl border border-slate-700/80 shadow-2xl p-1 gap-1" }, /* @__PURE__ */ React.createElement("button", {
			type: "button",
			onClick: handleZoomIn,
			className: "w-8 h-8 rounded-lg bg-slate-800 hover:bg-cyan-600 text-slate-200 hover:text-white flex items-center justify-center transition-all active:scale-90 shadow-sm",
			title: "Perbesar Peta (Zoom In)",
			"aria-label": "Zoom In"
		}, /* @__PURE__ */ React.createElement(ZoomIn, { className: "w-4 h-4" })), /* @__PURE__ */ React.createElement("div", {
			className: "text-[10px] font-mono font-bold text-cyan-400 py-0.5 select-none text-center min-w-[32px]",
			title: "Tingkat Pembesaran Peta Asli"
		}, currentZoom, "x"), /* @__PURE__ */ React.createElement("button", {
			type: "button",
			onClick: handleZoomOut,
			className: "w-8 h-8 rounded-lg bg-slate-800 hover:bg-cyan-600 text-slate-200 hover:text-white flex items-center justify-center transition-all active:scale-90 shadow-sm",
			title: "Perkecil Peta (Zoom Out)",
			"aria-label": "Zoom Out"
		}, /* @__PURE__ */ React.createElement(ZoomOut, { className: "w-4 h-4" })), /* @__PURE__ */ React.createElement("div", { className: "w-full h-px bg-slate-700/80 my-0.5" }), /* @__PURE__ */ React.createElement("button", {
			type: "button",
			onClick: handleResetZoom,
			className: "w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-all active:scale-90",
			title: "Kembali ke Seluruh Nusantara (Sabang s/d Merauke)",
			"aria-label": "Reset View"
		}, /* @__PURE__ */ React.createElement(RotateCcw, { className: "w-3.5 h-3.5" })), /* @__PURE__ */ React.createElement("button", {
			type: "button",
			onClick: handleFocusSelectedSatdik,
			className: "w-8 h-8 rounded-lg bg-slate-800 hover:bg-cyan-600 text-cyan-400 hover:text-white flex items-center justify-center transition-all active:scale-90",
			title: `Fokus ke Kampus: ${selectedSatdik.shortName}`,
			"aria-label": "Fokus Kampus Terpilih"
		}, /* @__PURE__ */ React.createElement(Locate, { className: "w-3.5 h-3.5" }))), /* @__PURE__ */ React.createElement("div", { className: "absolute bottom-2 left-2 right-2 z-10 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/80 flex items-center justify-between text-[11px] text-slate-300 pointer-events-none" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-1.5 truncate mr-2" }, /* @__PURE__ */ React.createElement(Info, { className: "w-3.5 h-3.5 text-cyan-400 flex-shrink-0" }), /* @__PURE__ */ React.createElement("span", { className: "truncate" }, "Klik marker pin untuk melihat profil kampus, atau gunakan tombol lapisan di kanan atas.")), /* @__PURE__ */ React.createElement("span", { className: "font-mono text-cyan-400 text-[10px] whitespace-nowrap hidden xs:inline" }, filteredSatdik.length, " Satdik Aktif"))), /* @__PURE__ */ React.createElement("div", { className: "mt-3 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-700" }, filteredSatdik.map((s) => {
			const isSelected = selectedSatdikId === s.id;
			const metrics = satdikBreakdown[s.id] || { avgScore: 80 };
			const colors = getPinColor(metrics.avgScore);
			return /* @__PURE__ */ React.createElement("button", {
				key: s.id,
				onClick: () => handleFocusSatdik(s),
				className: `flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs whitespace-nowrap transition-all border ${isSelected ? "bg-cyan-950/90 border-cyan-500 text-white shadow-xs font-bold scale-[1.02]" : "bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800"}`,
				title: `${s.name} - Klik untuk memilih dan fokus di peta asli`
			}, /* @__PURE__ */ React.createElement("span", { className: `w-2 h-2 rounded-full ${colors.bg}` }), /* @__PURE__ */ React.createElement("span", { className: "font-semibold" }, s.shortName), /* @__PURE__ */ React.createElement("span", { className: `text-[10px] font-mono ${colors.text}` }, Math.round(metrics.avgScore), "%"));
		}))), /* @__PURE__ */ React.createElement("div", {
			ref: sidebarPanelRef,
			id: "panel-satdik-detail",
			className: `lg:col-span-4 bg-slate-800/90 rounded-2xl p-4 sm:p-5 border shadow-md flex flex-col justify-between transition-all duration-300 ${isSidebarHighlighted ? "sidebar-panel-highlight border-cyan-400 scale-[1.01]" : "border-slate-700/70"}`
		}, /* @__PURE__ */ React.createElement("div", null, isSidebarHighlighted && /* @__PURE__ */ React.createElement("div", {
			className: "bg-cyan-500 text-slate-950 font-bold text-xs px-3 py-1.5 rounded-xl mb-3 flex items-center justify-between shadow-lg animate-pulse"
		}, /* @__PURE__ */ React.createElement("span", { className: "flex items-center gap-1.5" }, /* @__PURE__ */ React.createElement(CheckCircle2, { className: "w-4 h-4 text-slate-950" }), "Panel Rincian Kampus Sedang Difokuskan"), /* @__PURE__ */ React.createElement("span", { className: "text-[10px] uppercase font-black tracking-wider" }, "Aktif")), /* @__PURE__ */ React.createElement("div", { className: "flex items-start justify-between gap-2 pb-3 border-b border-slate-700/60" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { className: "px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30" }, selectedSatdik.jenjang, " • ", selectedSatdik.type), /* @__PURE__ */ React.createElement("h3", { className: "text-base sm:text-lg font-bold text-white mt-1.5 leading-snug" }, selectedSatdik.name), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-slate-400 flex items-center gap-1 mt-0.5" }, /* @__PURE__ */ React.createElement(MapPin, { className: "w-3.5 h-3.5 text-cyan-400" }), /* @__PURE__ */ React.createElement("span", null, selectedSatdik.kota, ", ", selectedSatdik.provinsi, " (", selectedSatdik.region, ")")), /* @__PURE__ */ React.createElement("button", {
			type: "button",
			onClick: handleFocusSelectedSatdik,
			className: "inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-lg bg-cyan-950/80 hover:bg-cyan-600 text-cyan-300 hover:text-white border border-cyan-700/60 text-[11px] font-semibold transition-all active:scale-95 shadow-2xs",
			title: "Arahkan dan perbesar peta asli ke lokasi kampus ini"
		}, /* @__PURE__ */ React.createElement(Locate, { className: "w-3 h-3" }), /* @__PURE__ */ React.createElement("span", null, "Fokus Lokasi di Peta Asli"))), /* @__PURE__ */ React.createElement("div", { className: "text-right flex-shrink-0" }, /* @__PURE__ */ React.createElement("span", { className: "text-[10px] text-slate-400 block" }, "Akreditasi"), /* @__PURE__ */ React.createElement("span", { className: "text-xs font-bold text-emerald-400 px-2 py-0.5 bg-emerald-500/10 rounded border border-emerald-500/30" }, selectedSatdik.akreditasi))), /* @__PURE__ */ React.createElement("div", { className: "my-2.5 p-3 bg-slate-900/70 rounded-xl border border-slate-800 text-xs space-y-2" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-start gap-2" }, /* @__PURE__ */ React.createElement(MapPin, { className: "w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" }), /* @__PURE__ */ React.createElement("div", { className: "flex-1 min-w-0" }, /* @__PURE__ */ React.createElement("span", { className: "text-[10px] text-slate-400 font-semibold uppercase tracking-wider block" }, "Alamat Resmi Kampus (Maps)"), /* @__PURE__ */ React.createElement("p", { className: "text-slate-200 text-xs mt-0.5 leading-snug font-medium" }, selectedSatdik.alamat || `${selectedSatdik.kota}, ${selectedSatdik.provinsi}`))), /* @__PURE__ */ React.createElement("div", { className: "pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]" }, /* @__PURE__ */ React.createElement("div", { className: "font-mono text-[10px] text-slate-400" }, /* @__PURE__ */ React.createElement("span", { className: "text-cyan-400 font-bold" }, selectedSatdik.lat.toFixed(4), "°"), ", ", /* @__PURE__ */ React.createElement("span", { className: "text-cyan-400 font-bold" }, selectedSatdik.lng.toFixed(4), "°")), /* @__PURE__ */ React.createElement("a", {
			href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${selectedSatdik.name} ${selectedSatdik.kota}`)}`,
			target: "_blank",
			rel: "noopener noreferrer",
			className: "inline-flex items-center gap-1 text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 hover:underline",
			title: "Buka rute dan lokasi di Google Maps"
		}, /* @__PURE__ */ React.createElement("span", null, "Buka di Google Maps"), /* @__PURE__ */ React.createElement(ExternalLink, { className: "w-3 h-3" })))), /* @__PURE__ */ React.createElement("div", { className: "my-2.5 text-xs space-y-2" }, /* @__PURE__ */ React.createElement("div", { className: "bg-slate-900/70 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-1.5 text-slate-400" }, /* @__PURE__ */ React.createElement(School, { className: "w-3.5 h-3.5 text-cyan-400" }), /* @__PURE__ */ React.createElement("span", null, "Program Studi")), /* @__PURE__ */ React.createElement("div", { className: "text-base font-bold text-white mt-0.5" }, selectedSatdik.prodi?.length || 0, " ", /* @__PURE__ */ React.createElement("span", { className: "text-[10px] text-slate-400 font-normal" }, "Program Kejuruan"))), /* @__PURE__ */ React.createElement("div", { className: "text-right" }, /* @__PURE__ */ React.createElement("span", { className: "text-[10px] text-slate-400 block" }, "Tahun Berdiri"), /* @__PURE__ */ React.createElement("span", { className: "text-xs font-bold text-slate-200" }, selectedSatdik.establishedYear))), selectedSatdik.prodi && selectedSatdik.prodi.length > 0 && /* @__PURE__ */ React.createElement("div", { className: "bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80" }, /* @__PURE__ */ React.createElement("div", { className: "text-[11px] font-semibold text-slate-300 mb-1.5 flex items-center justify-between" }, /* @__PURE__ */ React.createElement("span", { className: "flex items-center gap-1" }, /* @__PURE__ */ React.createElement(GraduationCap, { className: "w-3.5 h-3.5 text-cyan-400" }), /* @__PURE__ */ React.createElement("span", null, "Program Kejuruan / Studi:")), /* @__PURE__ */ React.createElement("span", { className: "text-[10px] text-cyan-400 font-mono" }, "(", selectedSatdik.prodi.length, " prodi)")), /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap gap-1.5" }, selectedSatdik.prodi.map((prodiName, idx) => /* @__PURE__ */ React.createElement("span", {
			key: idx,
			className: "px-2 py-0.5 text-[10px] rounded-md bg-cyan-950/70 text-cyan-300 border border-cyan-800/50 font-medium"
		}, prodiName))))), /* @__PURE__ */ React.createElement("div", { className: "bg-gradient-to-br from-slate-900 to-slate-950 p-4 rounded-xl border border-slate-700/80 mb-3.5 shadow-xs" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between mb-2" }, /* @__PURE__ */ React.createElement("span", { className: "text-xs font-semibold text-slate-300" }, "Ringkasan Sarpras Kampus"), /* @__PURE__ */ React.createElement("span", { className: "text-xs font-bold text-cyan-400" }, selectedMetrics.count, " Sarpras Terdata")), /* @__PURE__ */ React.createElement("div", { className: "space-y-1 mb-3" }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-between text-xs" }, /* @__PURE__ */ React.createElement("span", { className: "text-slate-400" }, "Indeks Kelayakan Kampus"), /* @__PURE__ */ React.createElement("span", { className: "font-bold text-white" }, Math.round(selectedMetrics.avgScore), "%")), /* @__PURE__ */ React.createElement("div", { className: "w-full h-2 bg-slate-800 rounded-full overflow-hidden" }, /* @__PURE__ */ React.createElement("div", {
			className: `h-full rounded-full transition-all duration-500 ${selectedMetrics.avgScore >= 85 ? "bg-emerald-500" : selectedMetrics.avgScore >= 75 ? "bg-sky-500" : "bg-rose-500"}`,
			style: { width: `${selectedMetrics.avgScore}%` }
		}))), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-3 gap-2 text-center text-[10px]" }, /* @__PURE__ */ React.createElement("div", { className: "bg-slate-800/80 p-1.5 rounded-lg border border-slate-700" }, /* @__PURE__ */ React.createElement("span", { className: "text-slate-400 block" }, "Baik"), /* @__PURE__ */ React.createElement("span", { className: "font-bold text-emerald-400 text-xs" }, selectedMetrics.baik)), /* @__PURE__ */ React.createElement("div", { className: "bg-slate-800/80 p-1.5 rounded-lg border border-slate-700" }, /* @__PURE__ */ React.createElement("span", { className: "text-slate-400 block" }, "R. Ringan"), /* @__PURE__ */ React.createElement("span", { className: "font-bold text-sky-400 text-xs" }, selectedMetrics.rusakRingan)), /* @__PURE__ */ React.createElement("div", { className: "bg-slate-800/80 p-1.5 rounded-lg border border-slate-700" }, /* @__PURE__ */ React.createElement("span", { className: "text-slate-400 block" }, "R. Berat"), /* @__PURE__ */ React.createElement("span", { className: "font-bold text-rose-400 text-xs" }, selectedMetrics.rusakBerat)))), selectedMetrics.calibration && /* @__PURE__ */ React.createElement("div", { className: "bg-slate-900/85 p-3.5 rounded-xl border border-cyan-800/50 mb-3.5 space-y-2.5 shadow-sm" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-1.5" }, /* @__PURE__ */ React.createElement(Layers, { className: "w-3.5 h-3.5 text-cyan-400" }), /* @__PURE__ */ React.createElement("span", { className: "text-[11px] font-bold text-white tracking-wide" }, "Transparansi Sumber Persentase (%)")), /* @__PURE__ */ React.createElement("button", {
			type: "button",
			onClick: () => setIsCalibrationModalOpen(true),
			className: "text-[10px] text-cyan-400 hover:text-cyan-300 font-semibold underline"
		}, "Metodologi")), /* @__PURE__ */ React.createElement("p", { className: "text-[10px] text-slate-400 leading-snug" }, "Dikalibrasikan secara berimbang dari ", selectedMetrics.calibration.components.length, " pilar data resmi BPPSDM KP:"), /* @__PURE__ */ React.createElement("div", { className: "space-y-1.5" }, selectedMetrics.calibration.components.map((c) => {
			const pillColor = c.score >= 85 ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" : c.score >= 75 ? "text-sky-400 bg-sky-500/10 border-sky-500/20" : "text-rose-400 bg-rose-500/10 border-rose-500/20";
			const IconComp = c.id === "asrama" ? Bed : c.id === "tambak" ? Fish : c.id === "standar" ? GraduationCap : Layers;
			return /* @__PURE__ */ React.createElement("div", {
				key: c.id,
				className: "bg-slate-950/70 p-2 rounded-lg border border-slate-800 text-[11px] space-y-1"
			}, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React.createElement("span", { className: "font-semibold text-slate-200 flex items-center gap-1.5" }, /* @__PURE__ */ React.createElement(IconComp, { className: "w-3 h-3 text-cyan-400 flex-shrink-0" }), c.name, /* @__PURE__ */ React.createElement("span", { className: "text-[9px] text-slate-400 font-mono font-normal" }, `(Bobot ${c.weightPercent}%)`)), /* @__PURE__ */ React.createElement("span", { className: `px-1.5 py-0.5 rounded text-[10px] font-mono font-bold border ${pillColor}` }, `${c.score}%`)), /* @__PURE__ */ React.createElement("p", { className: "text-[10px] text-slate-400 leading-tight pl-4.5" }, c.desc), /* @__PURE__ */ React.createElement("span", { className: "text-[9px] text-slate-400 block pl-4.5 italic truncate" }, `Sumber: ${c.source}`));
		})), /* @__PURE__ */ React.createElement("div", { className: "pt-1.5 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400" }, /* @__PURE__ */ React.createElement("span", null, "Formula: ∑(Skor Pilar × Bobot)"), /* @__PURE__ */ React.createElement("strong", { className: "text-white font-mono" }, `IKSP = ${Math.round(selectedMetrics.avgScore)}%`))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h4", { className: "text-xs font-bold text-slate-300 uppercase tracking-wider mb-2" }, "Fasilitas Unggulan Kampus Ini"), /* @__PURE__ */ React.createElement("div", { className: "space-y-1.5 max-h-36 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-700 text-xs" }, selectedMetrics.assets.length > 0 ? selectedMetrics.assets.map((asset) => /* @__PURE__ */ React.createElement("div", {
			key: asset.id,
			className: "bg-slate-900/50 p-2 rounded-lg border border-slate-800/80 flex items-center justify-between shadow-2xs"
		}, /* @__PURE__ */ React.createElement("div", { className: "truncate mr-2" }, /* @__PURE__ */ React.createElement("span", { className: "font-medium text-white block truncate" }, asset.name), /* @__PURE__ */ React.createElement("span", { className: "text-[10px] text-cyan-300 font-medium" }, asset.prodi || "Fasilitas Umum")), /* @__PURE__ */ React.createElement("span", { className: `px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap ${asset.condition === "Baik" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : asset.condition === "Rusak Ringan" ? "bg-sky-500/10 text-sky-400 border border-sky-500/20" : "bg-rose-500/10 text-rose-400 border border-rose-500/20"}` }, asset.condition))) : /* @__PURE__ */ React.createElement("p", { className: "text-xs text-slate-400 italic" }, "Data sarpras belum tersedia.")), onNavigateTab && /* @__PURE__ */ React.createElement("div", { className: "mt-3 pt-3 border-t border-slate-700/60 flex flex-wrap gap-2 text-xs" }, /* @__PURE__ */ React.createElement("button", {
			type: "button",
			onClick: () => onNavigateTab("asrama"),
			className: "flex-1 min-w-[95px] px-2 py-1.5 rounded-lg bg-slate-900 hover:bg-cyan-950 text-slate-300 hover:text-cyan-300 border border-slate-800 hover:border-cyan-700 text-[10.5px] font-semibold flex items-center justify-center gap-1 transition-all shadow-2xs",
			title: `Buka Tab Asrama Taruna untuk ${selectedSatdik.shortName}`
		}, /* @__PURE__ */ React.createElement(Bed, { className: "w-3 h-3 text-cyan-400" }), "Tab Asrama"), /* @__PURE__ */ React.createElement("button", {
			type: "button",
			onClick: () => onNavigateTab("tambak"),
			className: "flex-1 min-w-[95px] px-2 py-1.5 rounded-lg bg-slate-900 hover:bg-cyan-950 text-slate-300 hover:text-cyan-300 border border-slate-800 hover:border-cyan-700 text-[10.5px] font-semibold flex items-center justify-center gap-1 transition-all shadow-2xs",
			title: `Buka Tab Tambak & Kolam untuk ${selectedSatdik.shortName}`
		}, /* @__PURE__ */ React.createElement(Fish, { className: "w-3 h-3 text-cyan-400" }), "Tab Tambak"), /* @__PURE__ */ React.createElement("button", {
			type: "button",
			onClick: () => onNavigateTab("standar"),
			className: "flex-1 min-w-[95px] px-2 py-1.5 rounded-lg bg-slate-900 hover:bg-cyan-950 text-slate-300 hover:text-cyan-300 border border-slate-800 hover:border-cyan-700 text-[10.5px] font-semibold flex items-center justify-center gap-1 transition-all shadow-2xs",
			title: `Buka Tab Standar Minimal Sarpras Prodi untuk ${selectedSatdik.shortName}`
		}, /* @__PURE__ */ React.createElement(GraduationCap, { className: "w-3 h-3 text-cyan-400" }), "Standar Prodi")))))),
			renderCalibrationModal()
		);
	};
})();
const GeospatialMap = window.__GeospatialMap;
// ============================================================================
// MODULE: src/components/EarlyWarningMaintenance.jsx
// ============================================================================
(() => {
	const { useState } = React;
	const { AlertTriangle, ShieldAlert, Wrench, Calendar, Clock, CheckCircle2, Ship, Building2, Anchor, Check, AlertCircle } = window.__VENDOR__.Lucide;
	window.__EarlyWarningMaintenance = function EarlyWarningMaintenance({ urgentAssets, onResolveAsset }) {
		const [resolvedIds, setResolvedIds] = useState(new Set());
		const [filterType, setFilterType] = useState("ALL");
		const handleQuickResolve = (assetId) => {
			setResolvedIds((prev) => new Set([...prev, assetId]));
			if (onResolveAsset) {
				onResolveAsset(assetId, "Baik", "Telah diselesaikan melalui program perbaikan mendesak BPPSDM KP.");
			}
		};
		const filteredUrgent = urgentAssets.filter((asset) => {
			if (resolvedIds.has(asset.id)) return false;
			if (filterType === "Rusak Berat") return asset.condition === "Rusak Berat";
			if (filterType === "Rusak Ringan") return asset.condition === "Rusak Ringan";
			return true;
		});
		// Scheduled Docking & Maintenance Timeline
		const maintenanceSchedule = [];
		return /* @__PURE__ */ React.createElement("div", { className: "space-y-6" }, /* @__PURE__ */ React.createElement("div", { className: "bg-gradient-to-r from-rose-950/80 via-slate-900 to-slate-900 p-5 rounded-2xl border border-rose-500/50 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement("span", { className: "px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse" }, "Early Warning System (EWS)"), /* @__PURE__ */ React.createElement("span", { className: "text-slate-400 text-xs" }, "• Aset Sarpras Berstatus Darurat")), /* @__PURE__ */ React.createElement("h2", { className: "text-xl sm:text-2xl font-bold text-white tracking-tight mt-1 flex items-center gap-2" }, /* @__PURE__ */ React.createElement(ShieldAlert, { className: "w-5 h-5 text-rose-400" }), /* @__PURE__ */ React.createElement("span", null, "Pusat Peringatan Dini & Manajemen Perbaikan Darurat")), /* @__PURE__ */ React.createElement("p", { className: "text-slate-300 text-xs sm:text-sm mt-0.5 max-w-3xl" }, "Deteksi dini kerusakan kritis pada armada kapal latih, mesin pendingin UPI, dan instalasi asrama yang berisiko menghentikan proses belajar mengajar taruna.")), /* @__PURE__ */ React.createElement("div", { className: "bg-slate-950/80 p-3 rounded-xl border border-rose-500/30 text-xs self-start md:self-center flex items-center gap-4" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { className: "text-slate-400 text-[10px] block" }, "Aset Kritis Aktif:"), /* @__PURE__ */ React.createElement("span", { className: "text-lg font-black text-rose-400" }, filteredUrgent.length, " Fasilitas")), /* @__PURE__ */ React.createElement("div", { className: "border-l border-slate-800 pl-4" }, /* @__PURE__ */ React.createElement("span", { className: "text-slate-400 text-[10px] block" }, "Prioritas Penanganan:"), /* @__PURE__ */ React.createElement("span", { className: "text-sm font-bold text-amber-400" }, "Segera / Mendesak")))), /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap items-center justify-between gap-3 bg-slate-800/80 p-3.5 rounded-xl border border-slate-700" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement("span", { className: "text-xs text-slate-400 font-medium" }, "Filter Kritis:"), /* @__PURE__ */ React.createElement("button", {
			onClick: () => setFilterType("ALL"),
			className: `px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${filterType === "ALL" ? "bg-rose-600 text-white" : "bg-slate-900 text-slate-400 hover:text-white"}`
		}, "Semua (", filteredUrgent.length, ")"), /* @__PURE__ */ React.createElement("button", {
			onClick: () => setFilterType("Rusak Berat"),
			className: `px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${filterType === "Rusak Berat" ? "bg-rose-600 text-white" : "bg-slate-900 text-slate-400 hover:text-white"}`
		}, "Rusak Berat (", urgentAssets.filter((a) => a.condition === "Rusak Berat").length, ")"), /* @__PURE__ */ React.createElement("button", {
			onClick: () => setFilterType("Rusak Ringan"),
			className: `px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${filterType === "Rusak Ringan" ? "bg-amber-600 text-white" : "bg-slate-900 text-slate-400 hover:text-white"}`
		}, "Rusak Ringan (", urgentAssets.filter((a) => a.condition === "Rusak Ringan").length, ")"))), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4" }, filteredUrgent.map((asset) => /* @__PURE__ */ React.createElement("div", {
			key: asset.id,
			className: "bg-slate-800/90 rounded-2xl p-5 border border-rose-500/40 shadow-lg flex flex-col justify-between space-y-4 hover:border-rose-400 transition-all"
		}, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "flex items-start justify-between gap-2" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center space-x-2" }, /* @__PURE__ */ React.createElement("div", { className: "w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center flex-shrink-0" }, /* @__PURE__ */ React.createElement(AlertTriangle, { className: "w-5 h-5 animate-pulse" })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", { className: "text-base font-bold text-white leading-tight" }, asset.name))), /* @__PURE__ */ React.createElement("span", { className: "px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-rose-500/20 text-rose-300 border border-rose-500/40 whitespace-nowrap" }, asset.condition, " (", asset.conditionScore, "%)")), /* @__PURE__ */ React.createElement("div", { className: "text-xs text-slate-300 mt-2 flex items-center justify-between" }, /* @__PURE__ */ React.createElement("span", { className: "font-medium text-cyan-300" }, asset.satdikName), /* @__PURE__ */ React.createElement("span", { className: "text-[11px] text-slate-400 font-medium" }, asset.prodi || "Semua Program Studi (Umum)")), /* @__PURE__ */ React.createElement("div", { className: "mt-3 bg-slate-950/70 p-3 rounded-xl border border-slate-800 text-xs" }, /* @__PURE__ */ React.createElement("span", { className: "text-[11px] font-bold text-rose-300 block mb-1" }, "Diagnosa Kerusakan & Risiko:"), /* @__PURE__ */ React.createElement("p", { className: "text-slate-300 leading-relaxed" }, asset.issuesSummary)), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 gap-2 mt-3 text-[11px]" }, /* @__PURE__ */ React.createElement("div", { className: "bg-slate-900/60 p-2 rounded-lg border border-slate-800" }, /* @__PURE__ */ React.createElement("span", { className: "text-slate-400 block text-[10px]" }, "Tahun Perolehan:"), /* @__PURE__ */ React.createElement("span", { className: "font-semibold text-slate-200" }, asset.acquisitionYear || "-")), /* @__PURE__ */ React.createElement("div", { className: "bg-slate-900/60 p-2 rounded-lg border border-slate-800" }, /* @__PURE__ */ React.createElement("span", { className: "text-slate-400 block text-[10px]" }, "Tingkat Urgensi:"), /* @__PURE__ */ React.createElement("span", { className: "font-bold text-amber-400 font-mono" }, asset.maintenanceUrgency || "Segera")))), /* @__PURE__ */ React.createElement("div", { className: "pt-3 border-t border-slate-700/60 flex items-center justify-between gap-2" }, /* @__PURE__ */ React.createElement("span", { className: "text-[10px] text-slate-400" }, "Jadwal Servis: ", asset.nextMaintenanceDate || "Mendesak"), /* @__PURE__ */ React.createElement("button", {
			onClick: () => handleQuickResolve(asset.id),
			className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/90 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors shadow-sm"
		}, /* @__PURE__ */ React.createElement(Check, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ React.createElement("span", null, "Tandai Selesai Diperbaiki"))))), filteredUrgent.length === 0 && /* @__PURE__ */ React.createElement("div", { className: "col-span-2 bg-emerald-950/40 p-8 rounded-2xl border border-emerald-500/40 text-center space-y-2" }, /* @__PURE__ */ React.createElement(CheckCircle2, { className: "w-10 h-10 text-emerald-400 mx-auto" }), /* @__PURE__ */ React.createElement("h3", { className: "text-base font-bold text-white" }, "Seluruh Sarpras Kritis Telah Tertangani!"), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-slate-300 max-w-md mx-auto" }, "Tidak ada aset berstatus Rusak Berat atau sertifikat mati yang belum tertangani. Kelayakan operasional vokasi berjalan optimal."))), /* @__PURE__ */ React.createElement("div", { className: "bg-slate-800/90 rounded-2xl p-5 border border-slate-700/70 shadow-lg space-y-4" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", { className: "text-base font-bold text-white tracking-tight flex items-center gap-2" }, /* @__PURE__ */ React.createElement(Calendar, { className: "w-5 h-5 text-cyan-400" }), /* @__PURE__ */ React.createElement("span", null, "Jadwal Docking Kapal Latih & Pemeliharaan Berkala 2026/2027")), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-slate-400 mt-0.5" }, "Rencana aksi pemeliharaan preventif dan kuratif yang terjadwal pada galangan mitra dan balai pengujian.")), /* @__PURE__ */ React.createElement("span", { className: "text-xs px-2.5 py-1 rounded-lg bg-slate-900 text-slate-300 border border-slate-700" }, `${maintenanceSchedule.length} Agenda Terjadwal`)), /* @__PURE__ */ React.createElement("div", { className: "space-y-2.5 pt-2" }, maintenanceSchedule.length > 0 ? maintenanceSchedule.map((item, idx) => /* @__PURE__ */ React.createElement("div", {
			key: idx,
			className: "bg-slate-900/70 p-3.5 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
		}, /* @__PURE__ */ React.createElement("div", { className: "flex items-start sm:items-center space-x-3" }, /* @__PURE__ */ React.createElement("div", { className: "w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center flex-shrink-0 text-cyan-400" }, /* @__PURE__ */ React.createElement(Ship, { className: "w-5 h-5" })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement("span", { className: "text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800" }, item.date), /* @__PURE__ */ React.createElement("span", { className: "text-[10px] text-slate-400" }, "• ", item.type)), /* @__PURE__ */ React.createElement("h4", { className: "text-xs font-bold text-white mt-0.5" }, item.title), /* @__PURE__ */ React.createElement("p", { className: "text-[11px] text-slate-400 mt-0.5" }, "Lokasi / Mitra: ", item.facility))), /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between sm:justify-end gap-3 text-xs" }, /* @__PURE__ */ React.createElement("span", { className: `px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap ${item.status.includes("Mendesak") ? "bg-rose-500/20 text-rose-300 border border-rose-500/40" : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"}` }, item.status)))) : /* @__PURE__ */ React.createElement("div", { className: "p-6 rounded-xl bg-slate-900/40 border border-slate-800 text-center text-xs text-slate-400" }, "Belum ada agenda pemeliharaan terjadwal."))));
	};
})();
const EarlyWarningMaintenance = window.__EarlyWarningMaintenance;
// ============================================================================
// MODULE: src/components/AddAssetModal.jsx (Unified Add Data + Excel Import Modal)
// ============================================================================
(() => {
	const { useState, useEffect, useRef } = React;
	const {
		X, PlusCircle, Building2, FileText, Coins, ShieldCheck, Wrench,
		Check, AlertCircle, AlertTriangle, GraduationCap, Bed, Fish, Layers,
		Sparkles, CheckCircle2, Download, RotateCcw, ArrowUpRight, Info
	} = window.__VENDOR__.Lucide;
	const { SATDIK_LIST, SARPRAS_CATEGORIES, PRODI_LIST, getCategoryForProdi, getProdisForCategory } = window.SARPRAS_DATA;

	window.__AddAssetModal = function AddAssetModal({
		isOpen,
		onClose,
		onAddBuilding,
		onAddTambakUnit,
		onAddItem,
		onBulkImport,
		initialType = "asrama",
		standarBidangList = [],
		satdikList = SATDIK_LIST,
		currentUser = null
	}) {
		const lockedSatdik = currentUser?.accessibleSatdik && currentUser.accessibleSatdik !== "ALL"
			? currentUser.accessibleSatdik
			: null;

		const effectiveSatdikList = Array.isArray(satdikList) && satdikList.length > 0 ? satdikList : SATDIK_LIST;
		const defaultSatdikId = lockedSatdik || effectiveSatdikList[0]?.id || "poltek-aup";

		const fallbackBidangList = [
			{ id: "pasca_aup", code: "PSC", nama: "Pascasarjana (Magister Terapan AUP)" },
			{ id: "penangkapan_ikan", code: "PIK", nama: "Penangkapan Ikan" },
			{ id: "permesinan_kapal", code: "PMK", nama: "Permesinan Kapal" },
			{ id: "budidaya", code: "BDP", nama: "Budidaya Perikanan" },
			{ id: "mekanisasi_kp", code: "MKN", nama: "Mekanisasi Perikanan" },
			{ id: "pengolahan", code: "PGH", nama: "Pengolahan Hasil Perikanan" },
			{ id: "pengelolaan_sdp", code: "SDP", nama: "Pengelolaan Sumber Daya Perairan" },
			{ id: "patologi", code: "PTL", nama: "Patologi Perairan / Kesehatan Ikan" },
			{ id: "penyuluhan", code: "PNY", nama: "Penyuluhan Perikanan" },
			{ id: "agribisnis", code: "AGR", nama: "Agribisnis Perikanan" },
			{ id: "kelautan", code: "KLT", nama: "Kelautan" },
			{ id: "konservasi_ekowisata", code: "KSV", nama: "Konservasi & Ekowisata Bahari" }
		];
		const effectiveBidangList = standarBidangList.length > 0 ? standarBidangList : fallbackBidangList;

		// Active tab in modal: "asrama" | "tambak" | "standar" | "import"
		const [activeTab, setActiveTab] = useState(() => {
			if (initialType === "asrama" || initialType === "tambak" || initialType === "standar" || initialType === "import") return initialType;
			return "asrama";
		});

		useEffect(() => {
			if (initialType === "asrama" || initialType === "tambak" || initialType === "standar" || initialType === "import") {
				setActiveTab(initialType);
			} else {
				setActiveTab("asrama");
			}
		}, [initialType, isOpen]);

		const [errorMsg, setErrorMsg] = useState("");
		const [successMsg, setSuccessMsg] = useState("");
		const [isSubmitting, setIsSubmitting] = useState(false);

		// -------------------------------------------------------------
		// TAB 1 STATE: Gedung Asrama
		// -------------------------------------------------------------
		const [asramaForm, setAsramaForm] = useState({
			satdikId: defaultSatdikId,
			kampus: "Kampus Utama",
			nama: "",
			peruntukan: "Taruna Putra",
			jumlahKamar: 12,
			panjangM: 4,
			lebarM: 5,
			luasM2: 240,
			kapasitas: 60,
			status: "Digunakan",
			keterangan: ""
		});

		const handleAsramaChange = (e) => {
			const { name, value, type } = e.target;
			const val = type === "number" ? (value === "" ? "" : Number(value)) : value;
			setAsramaForm((prev) => {
				const next = { ...prev, [name]: val };
				if ((name === "panjangM" || name === "lebarM" || name === "jumlahKamar") && next.panjangM && next.lebarM && next.jumlahKamar) {
					const calcLuas = Number(next.panjangM) * Number(next.lebarM) * Number(next.jumlahKamar);
					next.luasM2 = Math.round(calcLuas * 100) / 100;
					next.kapasitas = Math.floor(next.luasM2 / 4);
				} else if (name === "luasM2") {
					const luas = Number(val) || 0;
					next.kapasitas = Math.floor(luas / 4);
				}
				return next;
			});
		};

		// -------------------------------------------------------------
		// TAB 2B STATE: Tambak & Kolam Budidaya
		// -------------------------------------------------------------
		const [tambakForm, setTambakForm] = useState({
			satdikId: defaultSatdikId,
			kampusLokasi: "Kampus Utama",
			nama: "",
			jenis: "Tambak",
			luasM2: 1000,
			kondisi: "Baik",
			statusOperasional: "Aktif",
			fungsi: "Pembesaran Udang Vaname / Praktikum Taruna",
			pelataran: "Plastik Mulsa HDPE / Tanah",
			listrik: "Ada (PLN / Genset)",
			kincir: "Kincir Air 1 HP",
			jumlahKincir: 4,
			keterangan: ""
		});

		const handleTambakChange = (e) => {
			const { name, value, type } = e.target;
			setTambakForm((prev) => ({
				...prev,
				[name]: type === "number" ? (value === "" ? 0 : Number(value)) : value
			}));
		};

		// -------------------------------------------------------------
		// TAB 3 STATE: Item Standar Prodi
		// -------------------------------------------------------------
		const defaultBidangId = effectiveBidangList[0]?.id || "penangkapan_ikan";
		const [standarForm, setStandarForm] = useState({
			bidangId: defaultBidangId,
			sec: "B",
			grpCode: "B.1",
			grpName: "Peralatan Praktik Kejuruan",
			subGrp: "Peralatan Utama",
			nama: "",
			stdVol: 1,
			satuan: "Unit",
			realSatdikId: defaultSatdikId,
			realVol: 1,
			kondisi: "Baik",
			ket: ""
		});

		const handleStandarChange = (e) => {
			const { name, value, type } = e.target;
			setStandarForm((prev) => ({
				...prev,
				[name]: type === "number" ? (value === "" ? 0 : Number(value)) : value
			}));
		};

		// -------------------------------------------------------------
		// TAB 4 STATE: Import File Excel (.xlsx / .xls / .csv)
		// -------------------------------------------------------------
		const fileInputRef = useRef(null);
		const [isDragging, setIsDragging] = useState(false);
		const [selectedFileInfo, setSelectedFileInfo] = useState(null);
		const [importPreview, setImportPreview] = useState(null);
		const [isParsingFile, setIsParsingFile] = useState(false);

		if (!isOpen) return null;

		const handleDownloadTemplate = (templateType = "all") => {
			setErrorMsg("");
			if (typeof window.SARPRAS_EXCEL?.downloadImportTemplateExcel === "function") {
				window.SARPRAS_EXCEL.downloadImportTemplateExcel({
					templateType,
					satdikList: effectiveSatdikList,
					standarBidangList: effectiveBidangList,
					currentUser
				});
			} else {
				setErrorMsg("Modul generator template Excel belum siap. Silakan muat ulang halaman (Ctrl + F5).");
			}
		};

		const processExcelFile = async (file) => {
			if (!file) return;
			setErrorMsg("");
			setSuccessMsg("");
			const ext = (file.name.split(".").pop() || "").toLowerCase();
			if (!["xlsx", "xls", "csv"].includes(ext)) {
				setErrorMsg("Format file tidak didukung. Harap unggah file Excel (.xlsx, .xls) atau .csv.");
				return;
			}
			if (typeof window.SARPRAS_EXCEL?.parseImportExcelWorkbook !== "function") {
				setErrorMsg("Modul pembaca Excel belum siap. Silakan muat ulang halaman (Ctrl + F5).");
				return;
			}

			setIsParsingFile(true);
			try {
				let arrayBuffer;
				if (typeof file.arrayBuffer === "function") {
					arrayBuffer = await file.arrayBuffer();
				} else {
					arrayBuffer = await new Promise((resolve, reject) => {
						const reader = new FileReader();
						reader.onload = (ev) => resolve(ev.target.result);
						reader.onerror = () => reject(new Error("Gagal membaca file Excel."));
						reader.readAsArrayBuffer(file);
					});
				}

				const parsed = window.SARPRAS_EXCEL.parseImportExcelWorkbook(arrayBuffer, {
					satdikList: effectiveSatdikList,
					standarBidangList: effectiveBidangList,
					currentUser
				});

				setSelectedFileInfo({
					name: file.name,
					sizeKB: Math.max(1, Math.round(file.size / 1024))
				});
				setImportPreview(parsed);

				if (parsed.totalValid === 0 && (!parsed.warnings || parsed.warnings.length === 0)) {
					setErrorMsg("File berhasil dibaca, namun belum ada baris data baru yang diisi (baris [PETUNJUK] dan [CONTOH] dilewati otomatis). Silakan isi data mulai Baris ke-9 pada template.");
				}
			} catch (err) {
				setErrorMsg("Gagal memproses file Excel: " + (err.message || "Pastikan file tidak rusak."));
				setImportPreview(null);
			} finally {
				setIsParsingFile(false);
			}
		};

		const handleFileInputChange = (e) => {
			const file = e.target.files?.[0];
			if (file) processExcelFile(file);
			e.target.value = "";
		};

		const handleDropFile = (e) => {
			e.preventDefault();
			e.stopPropagation();
			setIsDragging(false);
			const file = e.dataTransfer?.files?.[0];
			if (file) processExcelFile(file);
		};

		const handleResetImport = () => {
			setSelectedFileInfo(null);
			setImportPreview(null);
			setErrorMsg("");
			setSuccessMsg("");
			if (fileInputRef.current) fileInputRef.current.value = "";
		};

		// Gabungkan sampel baris untuk tabel pratinjau
		const combinedPreviewRows = [];
		if (importPreview) {
			(importPreview.buildings || []).forEach((b) => {
				combinedPreviewRows.push({
					badge: "Gedung Asrama",
					badgeClass: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
					lokasi: b.satdikName || b.satdikId,
					nama: b.nama,
					detail: b.jumlahKamar + " Kamar • " + b.luasM2 + " m² • Kapasitas " + b.kapasitas + " Org (" + b.status + ")"
				});
			});
			(importPreview.tambakUnits || []).forEach((tb) => {
				combinedPreviewRows.push({
					badge: "Tambak & Kolam",
					badgeClass: "bg-teal-500/15 text-teal-300 border-teal-500/30",
					lokasi: tb.satdikName || tb.satdikId,
					nama: tb.nama,
					detail: tb.jenis + " • " + tb.luasM2 + " m² • " + tb.kondisi + " (" + tb.statusOperasional + ")"
				});
			});
			(importPreview.standarItems || []).forEach((st) => {
				combinedPreviewRows.push({
					badge: "Standar Prodi",
					badgeClass: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
					lokasi: st.bidangNama || st.bidangId,
					nama: st.nama,
					detail: "Sek. " + st.sec + " • Standar: " + st.stdVol + " " + st.satuan + (st.realPreview ? " • Riil " + st.realPreview : "")
				});
			});
		}

		// -------------------------------------------------------------
		// SUBMIT ROUTER
		// -------------------------------------------------------------
		const handleSubmit = async (e) => {
			e.preventDefault();
			setErrorMsg("");
			setSuccessMsg("");
			setIsSubmitting(true);

			try {
				if (activeTab === "asrama") {
					if (!asramaForm.nama.trim()) {
						setErrorMsg("Nama gedung asrama wajib diisi.");
						setIsSubmitting(false);
						return;
					}
					const buildingPayload = {
						...asramaForm,
						jumlahKamar: Number(asramaForm.jumlahKamar) || 0,
						luasM2: Number(asramaForm.luasM2) || 0,
						kapasitas: Number(asramaForm.kapasitas) || (Number(asramaForm.luasM2) > 0 ? Math.floor(Number(asramaForm.luasM2) / 4) : 0),
						rincian: (asramaForm.panjangM && asramaForm.lebarM && asramaForm.jumlahKamar)
							? [{ label: asramaForm.nama, ukuran: asramaForm.panjangM + "m x " + asramaForm.lebarM + "m", jumlah: Number(asramaForm.jumlahKamar) }]
							: []
					};
					if (onAddBuilding) {
						await onAddBuilding(buildingPayload);
					}
					setSuccessMsg("Gedung asrama taruna berhasil disimpan ke database!");
					setTimeout(() => onClose(), 800);
				} else if (activeTab === "tambak") {
					if (!tambakForm.nama.trim()) {
						setErrorMsg("Nama prasarana / petak tambak atau kolam wajib diisi.");
						setIsSubmitting(false);
						return;
					}
					const tambakPayload = {
						...tambakForm,
						luasM2: Number(tambakForm.luasM2) || 0,
						jumlahKincir: Number(tambakForm.jumlahKincir) || 0
					};
					if (onAddTambakUnit) {
						await onAddTambakUnit(tambakPayload);
					}
					setSuccessMsg("Unit prasarana/sarana tambak & kolam berhasil disimpan ke database!");
					setTimeout(() => onClose(), 800);
				} else if (activeTab === "standar") {
					if (!standarForm.nama.trim()) {
						setErrorMsg("Nama item standar sarpras wajib diisi.");
						setIsSubmitting(false);
						return;
					}
					const realObj = {};
					if (standarForm.realSatdikId && standarForm.realVol !== "") {
						realObj[standarForm.realSatdikId] = Number(standarForm.realVol) || 0;
					}
					const itemPayload = {
						bidangId: standarForm.bidangId,
						sec: standarForm.sec,
						grpCode: standarForm.grpCode || "-",
						grpName: standarForm.grpName || "-",
						subGrp: standarForm.subGrp || "-",
						nama: standarForm.nama,
						stdVol: Number(standarForm.stdVol) || 1,
						satuan: standarForm.satuan || "Unit",
						kondisi: standarForm.kondisi || "Baik",
						ket: standarForm.ket || "",
						real: realObj
					};
					if (onAddItem) {
						await onAddItem(itemPayload);
					}
					setSuccessMsg("Item standar minimal prodi berhasil ditambahkan!");
					setTimeout(() => onClose(), 800);
				} else if (activeTab === "import") {
					if (!importPreview || importPreview.totalValid === 0) {
						setErrorMsg("Belum ada data valid untuk diimpor. Unggah file Excel yang telah diisi terlebih dahulu.");
						setIsSubmitting(false);
						return;
					}
					if (onBulkImport) {
						const res = await onBulkImport({
							buildings: importPreview.buildings || [],
							tambakUnits: importPreview.tambakUnits || [],
							standarItems: importPreview.standarItems || []
						});
						const totalSaved = res?.counts?.total || importPreview.totalValid;
						setSuccessMsg("Berhasil mengimpor " + totalSaved + " baris data Excel ke sistem & database!");
					} else {
						for (const b of (importPreview.buildings || [])) {
							if (onAddBuilding) await onAddBuilding(b);
						}
						for (const tb of (importPreview.tambakUnits || [])) {
							if (onAddTambakUnit) await onAddTambakUnit(tb);
						}
						for (const st of (importPreview.standarItems || [])) {
							if (onAddItem) await onAddItem(st);
						}
						setSuccessMsg("Berhasil mengimpor " + importPreview.totalValid + " baris data Excel!");
					}
					setTimeout(() => onClose(), 1100);
				}
			} catch (err) {
				setErrorMsg(err.message || "Gagal menyimpan data.");
			} finally {
				setIsSubmitting(false);
			}
		};

		const headerTitles = {
			asrama: { title: "Tambah Gedung Asrama Taruna", sub: "Pencatatan fisik gedung & kapasitas standar 4 m²/orang", icon: Bed },
			tambak: { title: "Tambah Unit Tambak & Kolam Budidaya", sub: "Pencatatan petak tambak, kolam, hatchery & sarana penunjang budidaya", icon: Fish },
			standar: { title: "Tambah Item Standar Minimal Prodi", sub: "Pencatatan item kurikulum standar 12 rumpun vokasi KKP", icon: GraduationCap },
			import: { title: "Import Massal Data Sarpras via Excel (.xlsx)", sub: "Unggah banyak data Gedung Asrama, Tambak/Kolam & Standar Prodi sekaligus menggunakan template resmi", icon: FileText }
		};
		const ActiveHeaderIcon = headerTitles[activeTab]?.icon || PlusCircle;

		return /* @__PURE__ */ React.createElement("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn" },
			/* @__PURE__ */ React.createElement("div", {
				className: "bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl",
				onClick: (e) => e.stopPropagation()
			},
				/* MODAL HEADER */
				/* @__PURE__ */ React.createElement("div", { className: "bg-slate-800/90 px-5 sm:px-6 py-3.5 border-b border-slate-700/80 flex items-center justify-between" },
					/* @__PURE__ */ React.createElement("div", { className: "flex items-center space-x-3 min-w-0" },
						/* @__PURE__ */ React.createElement("div", { className: "w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 flex-shrink-0" },
							/* @__PURE__ */ React.createElement(ActiveHeaderIcon, { className: "w-5 h-5" })
						),
						/* @__PURE__ */ React.createElement("div", { className: "min-w-0" },
							/* @__PURE__ */ React.createElement("h3", { className: "text-sm sm:text-base font-bold text-white truncate" }, headerTitles[activeTab]?.title),
							/* @__PURE__ */ React.createElement("p", { className: "text-[11px] text-slate-400 truncate" }, headerTitles[activeTab]?.sub)
						)
					),
					/* @__PURE__ */ React.createElement("button", {
						onClick: onClose,
						className: "w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors flex-shrink-0"
					}, /* @__PURE__ */ React.createElement(X, { className: "w-5 h-5" }))
				),

				/* TAB SELECTOR: 3 FORM MANUAL + 1 IMPORT EXCEL */
				/* @__PURE__ */ React.createElement("div", { className: "bg-slate-950/60 p-2 sm:px-6 border-b border-slate-800 flex items-center justify-between gap-1.5 overflow-x-auto" },
					/* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-1.5" },
						/* @__PURE__ */ React.createElement("button", {
							type: "button",
							onClick: () => { setActiveTab("asrama"); setErrorMsg(""); setSuccessMsg(""); },
							className: "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all " + (activeTab === "asrama" ? "bg-cyan-600 text-white shadow-md shadow-cyan-900/40" : "bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white")
						},
							/* @__PURE__ */ React.createElement(Bed, { className: "w-3.5 h-3.5" }),
							/* @__PURE__ */ React.createElement("span", null, "1. Gedung Asrama")
						),
						/* @__PURE__ */ React.createElement("button", {
							type: "button",
							onClick: () => { setActiveTab("tambak"); setErrorMsg(""); setSuccessMsg(""); },
							className: "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all " + (activeTab === "tambak" ? "bg-cyan-600 text-white shadow-md shadow-cyan-900/40" : "bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white")
						},
							/* @__PURE__ */ React.createElement(Fish, { className: "w-3.5 h-3.5" }),
							/* @__PURE__ */ React.createElement("span", null, "2. Tambak & Kolam")
						),
						/* @__PURE__ */ React.createElement("button", {
							type: "button",
							onClick: () => { setActiveTab("standar"); setErrorMsg(""); setSuccessMsg(""); },
							className: "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all " + (activeTab === "standar" ? "bg-cyan-600 text-white shadow-md shadow-cyan-900/40" : "bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white")
						},
							/* @__PURE__ */ React.createElement(GraduationCap, { className: "w-3.5 h-3.5" }),
							/* @__PURE__ */ React.createElement("span", null, "3. Standar Prodi")
						)
					),
					/* @__PURE__ */ React.createElement("button", {
						type: "button",
						onClick: () => { setActiveTab("import"); setErrorMsg(""); setSuccessMsg(""); },
						className: "flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border " + (activeTab === "import" ? "bg-emerald-600 border-emerald-400 text-white shadow-md shadow-emerald-900/40" : "bg-emerald-950/50 border-emerald-600/40 text-emerald-300 hover:bg-emerald-900/50 hover:text-white")
					},
						/* @__PURE__ */ React.createElement(FileText, { className: "w-3.5 h-3.5" }),
						/* @__PURE__ */ React.createElement("span", null, "4. Import Excel (.xlsx)")
					)
				),

				/* FORM CONTENT */
				/* @__PURE__ */ React.createElement("form", {
					onSubmit: handleSubmit,
					className: "overflow-y-auto p-5 sm:p-6 space-y-4 flex-1 scrollbar-thin scrollbar-thumb-slate-700 text-xs"
				},
					errorMsg && /* @__PURE__ */ React.createElement("div", { className: "bg-rose-950/80 border border-rose-500 text-rose-300 p-3 rounded-xl flex items-start gap-2 animate-shake" },
						/* @__PURE__ */ React.createElement(AlertCircle, { className: "w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" }),
						/* @__PURE__ */ React.createElement("span", null, errorMsg)
					),
					successMsg && /* @__PURE__ */ React.createElement("div", { className: "bg-emerald-950/80 border border-emerald-500 text-emerald-300 p-3 rounded-xl flex items-center gap-2 animate-fadeIn" },
						/* @__PURE__ */ React.createElement(CheckCircle2, { className: "w-4 h-4 text-emerald-400 flex-shrink-0" }),
						/* @__PURE__ */ React.createElement("span", { className: "font-semibold" }, successMsg)
					),

					/* SHORTCUT INFO BANNER ON MANUAL TABS */
					activeTab !== "import" && /* @__PURE__ */ React.createElement("div", { className: "bg-slate-950/60 border border-slate-800 rounded-xl px-3.5 py-2 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400" },
						/* @__PURE__ */ React.createElement("span", { className: "flex items-center gap-1.5" },
							/* @__PURE__ */ React.createElement(Sparkles, { className: "w-3.5 h-3.5 text-emerald-400" }),
							/* @__PURE__ */ React.createElement("span", null, "Ingin menambahkan banyak data sekaligus dari spreadsheet?")
						),
						/* @__PURE__ */ React.createElement("button", {
							type: "button",
							onClick: () => { setActiveTab("import"); setErrorMsg(""); setSuccessMsg(""); },
							className: "text-emerald-400 hover:text-emerald-300 font-semibold underline inline-flex items-center gap-1"
						},
							/* @__PURE__ */ React.createElement("span", null, "Gunakan Import Excel & Unduh Template"),
							/* @__PURE__ */ React.createElement(ArrowUpRight, { className: "w-3.5 h-3.5" })
						)
					),

					/* =================== FORM TAB 1: GEDUNG ASRAMA =================== */
					activeTab === "asrama" && /* @__PURE__ */ React.createElement(React.Fragment, null,
						/* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4" },
							/* @__PURE__ */ React.createElement("div", null,
								/* @__PURE__ */ React.createElement("label", { className: "text-slate-300 font-semibold block mb-1" }, "Satuan Pendidikan (Satdik) *"),
								/* @__PURE__ */ React.createElement("select", {
									name: "satdikId",
									value: asramaForm.satdikId,
									disabled: Boolean(lockedSatdik),
									onChange: handleAsramaChange,
									className: "w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500 disabled:opacity-60"
								}, effectiveSatdikList.map((s) => /* @__PURE__ */ React.createElement("option", { key: s.id, value: s.id }, s.shortName + " (" + s.kota + ")")))
							),
							/* @__PURE__ */ React.createElement("div", null,
								/* @__PURE__ */ React.createElement("label", { className: "text-slate-300 font-semibold block mb-1" }, "Kampus / Lokasi Fisik"),
								/* @__PURE__ */ React.createElement("input", {
									type: "text",
									name: "kampus",
									value: asramaForm.kampus,
									onChange: handleAsramaChange,
									placeholder: "Contoh: Kampus Utama / Kampus II Pari / Kampus Bone",
									className: "w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
								})
							)
						),
						/* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4" },
							/* @__PURE__ */ React.createElement("div", null,
								/* @__PURE__ */ React.createElement("label", { className: "text-slate-300 font-semibold block mb-1" }, "Nama Gedung Asrama *"),
								/* @__PURE__ */ React.createElement("input", {
									type: "text",
									name: "nama",
									required: true,
									value: asramaForm.nama,
									onChange: handleAsramaChange,
									placeholder: "Contoh: Gedung Asrama Taruna A / Kakap 01",
									className: "w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
								})
							),
							/* @__PURE__ */ React.createElement("div", null,
								/* @__PURE__ */ React.createElement("label", { className: "text-slate-300 font-semibold block mb-1" }, "Peruntukan Penghuni"),
								/* @__PURE__ */ React.createElement("select", {
									name: "peruntukan",
									value: asramaForm.peruntukan,
									onChange: handleAsramaChange,
									className: "w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
								},
									/* @__PURE__ */ React.createElement("option", { value: "Taruna Putra" }, "Taruna Putra"),
									/* @__PURE__ */ React.createElement("option", { value: "Taruni Putri" }, "Taruni Putri"),
									/* @__PURE__ */ React.createElement("option", { value: "Campuran / Khusus" }, "Campuran / Khusus"),
									/* @__PURE__ */ React.createElement("option", { value: "Umum / Penginapan" }, "Umum / Penginapan")
								)
							)
						),
						/* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4" },
							/* @__PURE__ */ React.createElement("div", null,
								/* @__PURE__ */ React.createElement("label", { className: "text-slate-300 font-semibold block mb-1" }, "Jumlah Kamar / Barak"),
								/* @__PURE__ */ React.createElement("input", {
									type: "number",
									name: "jumlahKamar",
									min: "1",
									value: asramaForm.jumlahKamar,
									onChange: handleAsramaChange,
									className: "w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
								})
							),
							/* @__PURE__ */ React.createElement("div", null,
								/* @__PURE__ */ React.createElement("label", { className: "text-slate-300 font-semibold block mb-1" }, "Panjang Kamar (m)"),
								/* @__PURE__ */ React.createElement("input", {
									type: "number",
									step: "0.1",
									name: "panjangM",
									value: asramaForm.panjangM,
									onChange: handleAsramaChange,
									className: "w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
								})
							),
							/* @__PURE__ */ React.createElement("div", null,
								/* @__PURE__ */ React.createElement("label", { className: "text-slate-300 font-semibold block mb-1" }, "Lebar Kamar (m)"),
								/* @__PURE__ */ React.createElement("input", {
									type: "number",
									step: "0.1",
									name: "lebarM",
									value: asramaForm.lebarM,
									onChange: handleAsramaChange,
									className: "w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
								})
							)
						),
						/* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950/40 p-3 rounded-xl border border-slate-800" },
							/* @__PURE__ */ React.createElement("div", null,
								/* @__PURE__ */ React.createElement("label", { className: "text-slate-300 font-semibold block mb-1 flex items-center justify-between" },
									/* @__PURE__ */ React.createElement("span", null, "Total Luas Lantai (m²)"),
									/* @__PURE__ */ React.createElement("span", { className: "text-[10px] text-cyan-400 font-normal" }, "(Otomatis / Manual)")
								),
								/* @__PURE__ */ React.createElement("input", {
									type: "number",
									step: "0.1",
									name: "luasM2",
									value: asramaForm.luasM2,
									onChange: handleAsramaChange,
									className: "w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
								})
							),
							/* @__PURE__ */ React.createElement("div", null,
								/* @__PURE__ */ React.createElement("label", { className: "text-slate-300 font-semibold block mb-1 flex items-center justify-between" },
									/* @__PURE__ */ React.createElement("span", null, "Kapasitas Standar (Org)"),
									/* @__PURE__ */ React.createElement("span", { className: "text-[10px] text-emerald-400 font-normal" }, "Rumus: Luas ÷ 4 m²")
								),
								/* @__PURE__ */ React.createElement("input", {
									type: "number",
									name: "kapasitas",
									value: asramaForm.kapasitas,
									onChange: handleAsramaChange,
									className: "w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-emerald-300 font-bold focus:outline-none focus:border-emerald-500 font-mono"
								})
							)
						),
						/* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4" },
							/* @__PURE__ */ React.createElement("div", null,
								/* @__PURE__ */ React.createElement("label", { className: "text-slate-300 font-semibold block mb-1" }, "Status Bangunan"),
								/* @__PURE__ */ React.createElement("select", {
									name: "status",
									value: asramaForm.status,
									onChange: handleAsramaChange,
									className: "w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
								},
									/* @__PURE__ */ React.createElement("option", { value: "Digunakan" }, "Digunakan (Normal)"),
									/* @__PURE__ */ React.createElement("option", { value: "Perlu Renovasi" }, "Perlu Renovasi / Pemeliharaan"),
									/* @__PURE__ */ React.createElement("option", { value: "Tidak Digunakan" }, "Tidak Digunakan / Kosong")
								)
							),
							/* @__PURE__ */ React.createElement("div", null,
								/* @__PURE__ */ React.createElement("label", { className: "text-slate-300 font-semibold block mb-1" }, "Keterangan / Fasilitas Tambahan"),
								/* @__PURE__ */ React.createElement("input", {
									type: "text",
									name: "keterangan",
									value: asramaForm.keterangan,
									onChange: handleAsramaChange,
									placeholder: "Contoh: Kamar mandi dalam, kasur bertingkat, lemari",
									className: "w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
								})
							)
						)
					),

					/* =================== FORM TAB 3: TAMBAK & KOLAM =================== */
					activeTab === "tambak" && /* @__PURE__ */ React.createElement(React.Fragment, null,
						/* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4" },
							/* @__PURE__ */ React.createElement("div", null,
								/* @__PURE__ */ React.createElement("label", { className: "text-slate-300 font-semibold block mb-1" }, "Satuan Pendidikan (Satdik) *"),
								/* @__PURE__ */ React.createElement("select", {
									name: "satdikId",
									value: tambakForm.satdikId,
									disabled: Boolean(lockedSatdik),
									onChange: handleTambakChange,
									className: "w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500 disabled:opacity-60"
								}, effectiveSatdikList.map((s) => /* @__PURE__ */ React.createElement("option", { key: s.id, value: s.id }, s.shortName + " (" + s.kota + ")")))
							),
							/* @__PURE__ */ React.createElement("div", null,
								/* @__PURE__ */ React.createElement("label", { className: "text-slate-300 font-semibold block mb-1" }, "Kampus / Lokasi Instalasi"),
								/* @__PURE__ */ React.createElement("input", {
									type: "text",
									name: "kampusLokasi",
									value: tambakForm.kampusLokasi,
									onChange: handleTambakChange,
									placeholder: "Contoh: Instalasi Tambak Karangantu Serang / Pulokerto",
									className: "w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
								})
							)
						),
						/* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4" },
							/* @__PURE__ */ React.createElement("div", { className: "sm:col-span-2" },
								/* @__PURE__ */ React.createElement("label", { className: "text-slate-300 font-semibold block mb-1" }, "Nama Prasarana / Petak / Unit *"),
								/* @__PURE__ */ React.createElement("input", {
									type: "text",
									name: "nama",
									required: true,
									value: tambakForm.nama,
									onChange: handleTambakChange,
									placeholder: "Contoh: Petak Tambak Millennial B1 / Kolam Bioflok Bundar / Indoor Hatchery",
									className: "w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
								})
							),
							/* @__PURE__ */ React.createElement("div", null,
								/* @__PURE__ */ React.createElement("label", { className: "text-slate-300 font-semibold block mb-1" }, "Jenis Prasarana"),
								/* @__PURE__ */ React.createElement("select", {
									name: "jenis",
									value: tambakForm.jenis,
									onChange: handleTambakChange,
									className: "w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
								},
									/* @__PURE__ */ React.createElement("option", { value: "Tambak" }, "Tambak (Petak Air Payau)"),
									/* @__PURE__ */ React.createElement("option", { value: "Kolam" }, "Kolam / Bak Budidaya"),
									/* @__PURE__ */ React.createElement("option", { value: "Hatchery" }, "Hatchery / Lab Pembenihan"),
									/* @__PURE__ */ React.createElement("option", { value: "Karamba" }, "Karamba Jaring Apung (KJA)"),
									/* @__PURE__ */ React.createElement("option", { value: "Pendukung" }, "Sarana Pendukung / Tandon / Saluran")
								)
							)
						),
						/* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-950/40 p-3 rounded-xl border border-slate-800" },
							/* @__PURE__ */ React.createElement("div", null,
								/* @__PURE__ */ React.createElement("label", { className: "text-slate-300 font-semibold block mb-1" }, "Luas Area (m²)"),
								/* @__PURE__ */ React.createElement("input", {
									type: "number",
									step: "0.1",
									min: "0",
									name: "luasM2",
									value: tambakForm.luasM2,
									onChange: handleTambakChange,
									className: "w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
								})
							),
							/* @__PURE__ */ React.createElement("div", null,
								/* @__PURE__ */ React.createElement("label", { className: "text-slate-300 font-semibold block mb-1" }, "Kondisi Fisik"),
								/* @__PURE__ */ React.createElement("select", {
									name: "kondisi",
									value: tambakForm.kondisi,
									onChange: handleTambakChange,
									className: "w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
								},
									/* @__PURE__ */ React.createElement("option", { value: "Baik" }, "Baik (Layak)"),
									/* @__PURE__ */ React.createElement("option", { value: "Rusak Ringan" }, "Rusak Ringan"),
									/* @__PURE__ */ React.createElement("option", { value: "Rusak Berat" }, "Rusak Berat")
								)
							),
							/* @__PURE__ */ React.createElement("div", null,
								/* @__PURE__ */ React.createElement("label", { className: "text-slate-300 font-semibold block mb-1" }, "Status Operasional"),
								/* @__PURE__ */ React.createElement("select", {
									name: "statusOperasional",
									value: tambakForm.statusOperasional,
									onChange: handleTambakChange,
									className: "w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
								},
									/* @__PURE__ */ React.createElement("option", { value: "Aktif" }, "Aktif (Digunakan Praktik/TeFa)"),
									/* @__PURE__ */ React.createElement("option", { value: "Idle" }, "Idle / Belum Optimal"),
									/* @__PURE__ */ React.createElement("option", { value: "Tidak Aktif" }, "Tidak Aktif / Rusak"),
									/* @__PURE__ */ React.createElement("option", { value: "KSO" }, "Kerja Sama Operasional (KSO)")
								)
							)
						),
						/* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4" },
							/* @__PURE__ */ React.createElement("div", null,
								/* @__PURE__ */ React.createElement("label", { className: "text-slate-300 font-semibold block mb-1" }, "Fungsi / Komoditas Budidaya"),
								/* @__PURE__ */ React.createElement("input", {
									type: "text",
									name: "fungsi",
									value: tambakForm.fungsi,
									onChange: handleTambakChange,
									placeholder: "Contoh: Pembesaran Udang Vaname / Ikan Nila Salin",
									className: "w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
								})
							),
							/* @__PURE__ */ React.createElement("div", null,
								/* @__PURE__ */ React.createElement("label", { className: "text-slate-300 font-semibold block mb-1" }, "Pelataran / Konstruksi Kolam"),
								/* @__PURE__ */ React.createElement("input", {
									type: "text",
									name: "pelataran",
									value: tambakForm.pelataran,
									onChange: handleTambakChange,
									placeholder: "Contoh: Geomembran HDPE / Beton / Tanah",
									className: "w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
								})
							)
						),
						/* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4" },
							/* @__PURE__ */ React.createElement("div", null,
								/* @__PURE__ */ React.createElement("label", { className: "text-slate-300 font-semibold block mb-1" }, "Ketersediaan Listrik"),
								/* @__PURE__ */ React.createElement("input", {
									type: "text",
									name: "listrik",
									value: tambakForm.listrik,
									onChange: handleTambakChange,
									placeholder: "Contoh: PLN 66 kVA + Genset",
									className: "w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
								})
							),
							/* @__PURE__ */ React.createElement("div", null,
								/* @__PURE__ */ React.createElement("label", { className: "text-slate-300 font-semibold block mb-1" }, "Sarana Kincir / Aerator"),
								/* @__PURE__ */ React.createElement("input", {
									type: "text",
									name: "kincir",
									value: tambakForm.kincir,
									onChange: handleTambakChange,
									placeholder: "Contoh: Kincir Air 1 HP 3 Phase / Root Blower",
									className: "w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
								})
							),
							/* @__PURE__ */ React.createElement("div", null,
								/* @__PURE__ */ React.createElement("label", { className: "text-slate-300 font-semibold block mb-1" }, "Jumlah Kincir (Unit)"),
								/* @__PURE__ */ React.createElement("input", {
									type: "number",
									min: "0",
									name: "jumlahKincir",
									value: tambakForm.jumlahKincir,
									onChange: handleTambakChange,
									className: "w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
								})
							)
						),
						/* @__PURE__ */ React.createElement("div", null,
							/* @__PURE__ */ React.createElement("label", { className: "text-slate-300 font-semibold block mb-1" }, "Keterangan Teknis / Catatan Lapangan"),
							/* @__PURE__ */ React.createElement("textarea", {
								name: "keterangan",
								rows: "2",
								value: tambakForm.keterangan,
								onChange: handleTambakChange,
								placeholder: "Catatan kondisi tanggul, pintu air, pompa, saluran inlet/outlet, dll.",
								className: "w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
							})
						)
					),

					/* =================== FORM TAB 4: STANDAR PRODI =================== */
					activeTab === "standar" && /* @__PURE__ */ React.createElement(React.Fragment, null,
						/* @__PURE__ */ React.createElement("div", null,
							/* @__PURE__ */ React.createElement("label", { className: "text-slate-300 font-semibold block mb-1" }, "Rumpun Program Studi Vokasi *"),
							/* @__PURE__ */ React.createElement("select", {
								name: "bidangId",
								value: standarForm.bidangId,
								onChange: handleStandarChange,
								className: "w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
							}, effectiveBidangList.map((b) => /* @__PURE__ */ React.createElement("option", { key: b.id, value: b.id }, (b.code ? "[" + b.code + "] " : "") + (b.nama || b.id))))
						),
						/* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4" },
							/* @__PURE__ */ React.createElement("div", null,
								/* @__PURE__ */ React.createElement("label", { className: "text-slate-300 font-semibold block mb-1" }, "Klasifikasi Standar"),
								/* @__PURE__ */ React.createElement("select", {
									name: "sec",
									value: standarForm.sec,
									onChange: handleStandarChange,
									className: "w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
								},
									/* @__PURE__ */ React.createElement("option", { value: "A" }, "A. Prasarana (Ruang, Lab, Workshop, Kapal Latih)"),
									/* @__PURE__ */ React.createElement("option", { value: "B" }, "B. Sarana (Peralatan, Mesin, Perabot Praktikum)")
								)
							),
							/* @__PURE__ */ React.createElement("div", null,
								/* @__PURE__ */ React.createElement("label", { className: "text-slate-300 font-semibold block mb-1" }, "Kode Kelompok & Nama Kelompok"),
								/* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-3 gap-2" },
									/* @__PURE__ */ React.createElement("input", {
										type: "text",
										name: "grpCode",
										value: standarForm.grpCode,
										onChange: handleStandarChange,
										placeholder: "Kode (A.1)",
										className: "bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
									}),
									/* @__PURE__ */ React.createElement("input", {
										type: "text",
										name: "grpName",
										value: standarForm.grpName,
										onChange: handleStandarChange,
										placeholder: "Nama Kelompok (Lab Navigasi)",
										className: "col-span-2 bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
									})
								)
							)
						),
						/* @__PURE__ */ React.createElement("div", null,
							/* @__PURE__ */ React.createElement("label", { className: "text-slate-300 font-semibold block mb-1" }, "Nama Sarana / Prasarana Standar Minimal *"),
							/* @__PURE__ */ React.createElement("input", {
								type: "text",
								name: "nama",
								required: true,
								value: standarForm.nama,
								onChange: handleStandarChange,
								placeholder: "Contoh: Marine Radar ARPA X-Band 36 NM / Kolam Beton 20m²",
								className: "w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
							})
						),
						/* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4" },
							/* @__PURE__ */ React.createElement("div", null,
								/* @__PURE__ */ React.createElement("label", { className: "text-slate-300 font-semibold block mb-1" }, "Volume Standar Minimal *"),
								/* @__PURE__ */ React.createElement("input", {
									type: "number",
									name: "stdVol",
									min: "1",
									required: true,
									value: standarForm.stdVol,
									onChange: handleStandarChange,
									className: "w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
								})
							),
							/* @__PURE__ */ React.createElement("div", null,
								/* @__PURE__ */ React.createElement("label", { className: "text-slate-300 font-semibold block mb-1" }, "Satuan Pengukuran"),
								/* @__PURE__ */ React.createElement("select", {
									name: "satuan",
									value: standarForm.satuan,
									onChange: handleStandarChange,
									className: "w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
								},
									/* @__PURE__ */ React.createElement("option", { value: "Unit" }, "Unit"),
									/* @__PURE__ */ React.createElement("option", { value: "Ruang" }, "Ruang"),
									/* @__PURE__ */ React.createElement("option", { value: "Paket" }, "Paket"),
									/* @__PURE__ */ React.createElement("option", { value: "Set" }, "Set"),
									/* @__PURE__ */ React.createElement("option", { value: "m²" }, "m²"),
									/* @__PURE__ */ React.createElement("option", { value: "Buah" }, "Buah")
								)
							)
						),
						/* @__PURE__ */ React.createElement("div", { className: "bg-slate-950/40 p-3 rounded-xl border border-slate-800 space-y-3" },
							/* @__PURE__ */ React.createElement("div", { className: "text-slate-300 font-semibold text-[11px] flex items-center justify-between" },
								/* @__PURE__ */ React.createElement("span", null, "Input Realisasi Kuantitas Kampus (Opsional)"),
								/* @__PURE__ */ React.createElement("span", { className: "text-cyan-400 font-normal" }, "Langsung memetakan pencapaian kampus")
							),
							/* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-3" },
								/* @__PURE__ */ React.createElement("div", null,
									/* @__PURE__ */ React.createElement("label", { className: "text-slate-400 block mb-1 text-[10px]" }, "Satuan Pendidikan"),
									/* @__PURE__ */ React.createElement("select", {
										name: "realSatdikId",
										value: standarForm.realSatdikId,
										disabled: Boolean(lockedSatdik),
										onChange: handleStandarChange,
										className: "w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-cyan-500 text-xs disabled:opacity-60"
									}, effectiveSatdikList.map((s) => /* @__PURE__ */ React.createElement("option", { key: s.id, value: s.id }, s.shortName)))
								),
								/* @__PURE__ */ React.createElement("div", null,
									/* @__PURE__ */ React.createElement("label", { className: "text-slate-400 block mb-1 text-[10px]" }, "Kuantitas Riil Dimiliki"),
									/* @__PURE__ */ React.createElement("input", {
										type: "number",
										name: "realVol",
										min: "0",
										value: standarForm.realVol,
										onChange: handleStandarChange,
										className: "w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-cyan-500 text-xs font-mono"
									})
								),
								/* @__PURE__ */ React.createElement("div", null,
									/* @__PURE__ */ React.createElement("label", { className: "text-slate-400 block mb-1 text-[10px]" }, "Kondisi Fisik Riil"),
									/* @__PURE__ */ React.createElement("select", {
										name: "kondisi",
										value: standarForm.kondisi,
										onChange: handleStandarChange,
										className: "w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-cyan-500 text-xs"
									},
										/* @__PURE__ */ React.createElement("option", { value: "Baik" }, "Baik (Layak)"),
										/* @__PURE__ */ React.createElement("option", { value: "Rusak Ringan" }, "Rusak Ringan"),
										/* @__PURE__ */ React.createElement("option", { value: "Rusak Berat" }, "Rusak Berat")
									)
								)
							)
						),
						/* @__PURE__ */ React.createElement("div", null,
							/* @__PURE__ */ React.createElement("label", { className: "text-slate-300 font-semibold block mb-1" }, "Catatan Kurikulum / Spesifikasi Teknis"),
							/* @__PURE__ */ React.createElement("textarea", {
								name: "ket",
								rows: "2",
								value: standarForm.ket,
								onChange: handleStandarChange,
								placeholder: "Spesifikasi minimal kurikulum, merk/tipe referensi, sertifikasi, dll.",
								className: "w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
							})
						)
					),

					/* =================== FORM TAB 4: IMPORT EXCEL (.XLSX) =================== */
					activeTab === "import" && /* @__PURE__ */ React.createElement("div", { className: "space-y-4" },
						/* STEP 1: DOWNLOAD TEMPLATE */
						/* @__PURE__ */ React.createElement("div", { className: "bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-3" },
							/* @__PURE__ */ React.createElement("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3" },
								/* @__PURE__ */ React.createElement("div", null,
									/* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" },
										/* @__PURE__ */ React.createElement("span", { className: "px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold text-[10px]" }, "LANGKAH 1"),
										/* @__PURE__ */ React.createElement("h4", { className: "font-bold text-white text-xs sm:text-sm" }, "Unduh Template Resmi Excel Sarana & Prasarana Satuan Pendidikan KP (.xlsx)")
									),
									/* @__PURE__ */ React.createElement("p", { className: "text-slate-400 text-[11px] mt-1" }, "Dilengkapi petunjuk pengisian, contoh baris data, serta daftar kode resmi 18 Satdik dan 12 Rumpun Prodi.")
								),
								/* @__PURE__ */ React.createElement("button", {
									type: "button",
									onClick: () => handleDownloadTemplate("all"),
									className: "inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-900/30 transition-all whitespace-nowrap"
								},
									/* @__PURE__ */ React.createElement(Download, { className: "w-4 h-4" }),
									/* @__PURE__ */ React.createElement("span", null, "Unduh Template Lengkap (.xlsx)")
								)
							),
							/* @__PURE__ */ React.createElement("div", { className: "pt-2.5 border-t border-slate-800/80 flex flex-wrap items-center gap-2" },
								/* @__PURE__ */ React.createElement("span", { className: "text-[11px] text-slate-400 mr-1" }, "Atau unduh per kategori:"),
								/* @__PURE__ */ React.createElement("button", {
									type: "button",
									onClick: () => handleDownloadTemplate("asrama"),
									className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-medium transition"
								},
									/* @__PURE__ */ React.createElement(Download, { className: "w-3 h-3 text-indigo-400" }),
									/* @__PURE__ */ React.createElement("span", null, "Khusus Gedung Asrama")
								),
								/* @__PURE__ */ React.createElement("button", {
									type: "button",
									onClick: () => handleDownloadTemplate("tambak"),
									className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-medium transition"
								},
									/* @__PURE__ */ React.createElement(Download, { className: "w-3 h-3 text-teal-400" }),
									/* @__PURE__ */ React.createElement("span", null, "Khusus Tambak & Kolam")
								),
								/* @__PURE__ */ React.createElement("button", {
									type: "button",
									onClick: () => handleDownloadTemplate("standar"),
									className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-medium transition"
								},
									/* @__PURE__ */ React.createElement(Download, { className: "w-3 h-3 text-emerald-400" }),
									/* @__PURE__ */ React.createElement("span", null, "Khusus Standar Prodi")
								),
								/* @__PURE__ */ React.createElement("a", {
									href: "Templates/Template_Import_SARPRAS_KKP.xlsx",
									download: "Template_Import_SARPRAS_KKP.xlsx",
									className: "ml-auto text-[11px] text-cyan-400 hover:text-cyan-300 underline"
								}, "Unduh File Statis Master")
							)
						),

						/* STEP 2: UPLOAD / DROPZONE */
						/* @__PURE__ */ React.createElement("div", { className: "bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-3" },
							/* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between" },
								/* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" },
									/* @__PURE__ */ React.createElement("span", { className: "px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold text-[10px]" }, "LANGKAH 2"),
									/* @__PURE__ */ React.createElement("h4", { className: "font-bold text-white text-xs sm:text-sm" }, "Unggah File Excel yang Telah Diisi")
								),
								selectedFileInfo && /* @__PURE__ */ React.createElement("button", {
									type: "button",
									onClick: handleResetImport,
									className: "inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-rose-400 transition"
								},
									/* @__PURE__ */ React.createElement(RotateCcw, { className: "w-3.5 h-3.5" }),
									/* @__PURE__ */ React.createElement("span", null, "Ganti / Reset File")
								)
							),

							/* @__PURE__ */ React.createElement("input", {
								ref: fileInputRef,
								type: "file",
								accept: ".xlsx,.xls,.csv",
								onChange: handleFileInputChange,
								className: "hidden"
							}),

							/* @__PURE__ */ React.createElement("div", {
								onDragOver: (e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); },
								onDragLeave: (e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); },
								onDrop: handleDropFile,
								onClick: () => fileInputRef.current && fileInputRef.current.click(),
								className: "border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all " + (isDragging ? "border-emerald-400 bg-emerald-950/30" : selectedFileInfo ? "border-cyan-500/50 bg-slate-900/80 hover:border-cyan-400" : "border-slate-700 bg-slate-900/40 hover:border-cyan-500/60 hover:bg-slate-900/70")
							},
								/* @__PURE__ */ React.createElement("div", { className: "w-11 h-11 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto mb-2.5" },
									/* @__PURE__ */ React.createElement(Layers, { className: "w-5 h-5" })
								),
								isParsingFile
									? /* @__PURE__ */ React.createElement("p", { className: "text-cyan-300 font-semibold text-xs" }, "Membaca & memvalidasi lembar kerja Excel...")
									: selectedFileInfo
										? /* @__PURE__ */ React.createElement("div", null,
											/* @__PURE__ */ React.createElement("p", { className: "text-white font-bold text-xs sm:text-sm" }, selectedFileInfo.name),
											/* @__PURE__ */ React.createElement("p", { className: "text-slate-400 text-[11px] mt-0.5" }, "Ukuran file: " + selectedFileInfo.sizeKB + " KB • Klik di sini jika ingin memilih file lain")
										)
										: /* @__PURE__ */ React.createElement("div", null,
											/* @__PURE__ */ React.createElement("p", { className: "text-slate-200 font-semibold text-xs sm:text-sm" }, "Klik untuk memilih file Excel atau tarik & lepas (Drag & Drop) ke kotak ini"),
											/* @__PURE__ */ React.createElement("p", { className: "text-slate-400 text-[11px] mt-1" }, "Mendukung format Microsoft Excel (.xlsx, .xls) maupun CSV (.csv)")
										)
							)
						),

						/* STEP 3: PREVIEW & VALIDATION RESULTS */
						importPreview && /* @__PURE__ */ React.createElement("div", { className: "bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-3 animate-fadeIn" },
							/* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between flex-wrap gap-2" },
								/* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" },
									/* @__PURE__ */ React.createElement("span", { className: "px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold text-[10px]" }, "LANGKAH 3"),
									/* @__PURE__ */ React.createElement("h4", { className: "font-bold text-white text-xs sm:text-sm" }, "Hasil Pembacaan & Validasi Baris Data")
								),
								/* @__PURE__ */ React.createElement("span", { className: "text-[11px] font-bold " + (importPreview.totalValid > 0 ? "text-emerald-400" : "text-amber-400") },
									importPreview.totalValid + " Baris Valid Siap Disimpan"
								)
							),

							/* SUMMARY BADGES */
							/* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-2.5" },
								/* @__PURE__ */ React.createElement("div", { className: "bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-center" },
									/* @__PURE__ */ React.createElement("div", { className: "text-lg font-black text-indigo-400" }, importPreview.buildings.length),
									/* @__PURE__ */ React.createElement("div", { className: "text-[10px] text-slate-400 font-medium" }, "Gedung Asrama")
								),
								/* @__PURE__ */ React.createElement("div", { className: "bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-center" },
									/* @__PURE__ */ React.createElement("div", { className: "text-lg font-black text-teal-400" }, (importPreview.tambakUnits || []).length),
									/* @__PURE__ */ React.createElement("div", { className: "text-[10px] text-slate-400 font-medium" }, "Tambak & Kolam")
								),
								/* @__PURE__ */ React.createElement("div", { className: "bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-center" },
									/* @__PURE__ */ React.createElement("div", { className: "text-lg font-black text-emerald-400" }, importPreview.standarItems.length),
									/* @__PURE__ */ React.createElement("div", { className: "text-[10px] text-slate-400 font-medium" }, "Item Standar Prodi")
								)
							),

							/* WARNINGS IF ANY */
							importPreview.warnings && importPreview.warnings.length > 0 && /* @__PURE__ */ React.createElement("div", { className: "bg-amber-950/40 border border-amber-500/40 rounded-xl p-3 space-y-1.5" },
								/* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-1.5 text-amber-300 font-bold text-[11px]" },
									/* @__PURE__ */ React.createElement(AlertTriangle, { className: "w-3.5 h-3.5 flex-shrink-0" }),
									/* @__PURE__ */ React.createElement("span", null, importPreview.warnings.length + " Catatan Validasi pada File Excel:")
								),
								/* @__PURE__ */ React.createElement("ul", { className: "max-h-28 overflow-y-auto space-y-1 text-[11px] text-amber-200/90 pl-4 list-disc" },
									importPreview.warnings.map((w, idx) => /* @__PURE__ */ React.createElement("li", { key: idx },
										"Sheet ", /* @__PURE__ */ React.createElement("strong", null, w.sheet), " (Baris ", w.row, "): ", w.message
									))
								)
							),

							/* PREVIEW TABLE */
							combinedPreviewRows.length > 0 && /* @__PURE__ */ React.createElement("div", { className: "border border-slate-800 rounded-xl overflow-hidden" },
								/* @__PURE__ */ React.createElement("div", { className: "max-h-48 overflow-y-auto" },
									/* @__PURE__ */ React.createElement("table", { className: "w-full text-left border-collapse text-[11px]" },
										/* @__PURE__ */ React.createElement("thead", { className: "bg-slate-900 text-slate-400 sticky top-0" },
											/* @__PURE__ */ React.createElement("tr", null,
												/* @__PURE__ */ React.createElement("th", { className: "py-2 px-3 font-semibold" }, "Kategori"),
												/* @__PURE__ */ React.createElement("th", { className: "py-2 px-3 font-semibold" }, "Satdik / Rumpun"),
												/* @__PURE__ */ React.createElement("th", { className: "py-2 px-3 font-semibold" }, "Nama Data"),
												/* @__PURE__ */ React.createElement("th", { className: "py-2 px-3 font-semibold" }, "Rincian")
											)
										),
										/* @__PURE__ */ React.createElement("tbody", { className: "divide-y divide-slate-800/70 bg-slate-950/40" },
											combinedPreviewRows.slice(0, 25).map((r, i) => /* @__PURE__ */ React.createElement("tr", { key: i, className: "hover:bg-slate-900/60" },
												/* @__PURE__ */ React.createElement("td", { className: "py-1.5 px-3 whitespace-nowrap" },
													/* @__PURE__ */ React.createElement("span", { className: "px-2 py-0.5 rounded border text-[10px] font-semibold " + r.badgeClass }, r.badge)
												),
												/* @__PURE__ */ React.createElement("td", { className: "py-1.5 px-3 text-slate-300 whitespace-nowrap" }, r.lokasi),
												/* @__PURE__ */ React.createElement("td", { className: "py-1.5 px-3 text-white font-semibold" }, r.nama),
												/* @__PURE__ */ React.createElement("td", { className: "py-1.5 px-3 text-slate-400" }, r.detail)
											))
										)
									)
								),
								combinedPreviewRows.length > 25 && /* @__PURE__ */ React.createElement("div", { className: "bg-slate-900/90 px-3 py-1.5 text-[10px] text-slate-400 text-center border-t border-slate-800" },
									"Menampilkan 25 dari total " + combinedPreviewRows.length + " baris data yang siap diimpor."
								)
							)
						)
					),

					/* MODAL FOOTER */
					/* @__PURE__ */ React.createElement("div", { className: "pt-4 border-t border-slate-800 flex items-center justify-end gap-2.5" },
						/* @__PURE__ */ React.createElement("button", {
							type: "button",
							onClick: onClose,
							disabled: isSubmitting,
							className: "px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition-colors disabled:opacity-50"
						}, "Batal"),
						/* @__PURE__ */ React.createElement("button", {
							type: "submit",
							disabled: isSubmitting || (activeTab === "import" && (!importPreview || importPreview.totalValid === 0)),
							className: "inline-flex items-center gap-1.5 px-5 py-2 rounded-xl font-bold shadow-md transition-colors disabled:opacity-50 " + (activeTab === "import" ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/40" : "bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-900/40")
						},
							/* @__PURE__ */ React.createElement(Check, { className: "w-4 h-4" }),
							/* @__PURE__ */ React.createElement("span", null,
								isSubmitting
									? "Menyimpan ke Database..."
									: activeTab === "import"
										? ("Import " + (importPreview?.totalValid || 0) + " Data ke Database")
										: "Simpan Data ke Database"
							)
						)
					)
				)
			)
		);
	};
})();
const AddAssetModal = window.__AddAssetModal;
// ============================================================================
// MODULE: src/components/UserProfileModal.jsx
// ============================================================================
(() => {
	const { X, User, Mail, ShieldCheck, Building2, Key, LogOut, CheckCircle2, Calendar, Lock, BadgeCheck } = window.__VENDOR__.Lucide;
	window.__UserProfileModal = function UserProfileModal({ user, isOpen, onClose, onLogout }) {
		if (!isOpen || !user) return null;
		return /* @__PURE__ */ React.createElement("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn" }, /* @__PURE__ */ React.createElement("div", {
			className: "bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col",
			onClick: (e) => e.stopPropagation()
		}, /* @__PURE__ */ React.createElement("div", { className: "bg-gradient-to-r from-slate-800 to-cyan-950 p-6 border-b border-slate-700 relative" }, /* @__PURE__ */ React.createElement("button", {
			onClick: onClose,
			className: "absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
		}, /* @__PURE__ */ React.createElement(X, { className: "w-4 h-4" })), /* @__PURE__ */ React.createElement("div", { className: "flex items-center space-x-4" }, /* @__PURE__ */ React.createElement("div", { className: "w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 p-0.5 shadow-lg shadow-cyan-500/30 flex-shrink-0" }, /* @__PURE__ */ React.createElement("div", { className: "w-full h-full rounded-[14px] bg-slate-900 flex items-center justify-center text-white" }, /* @__PURE__ */ React.createElement(User, { className: "w-8 h-8 text-cyan-400" }))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { className: "px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/40" }, user.roleLabel), /* @__PURE__ */ React.createElement("h3", { className: "text-base sm:text-lg font-bold text-white mt-1 leading-snug" }, user.name)))), /* @__PURE__ */ React.createElement("div", { className: "p-6 space-y-4 text-xs" }, /* @__PURE__ */ React.createElement("div", { className: "bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 space-y-2" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { className: "text-slate-400 text-[10px] block" }, "Jabatan Kedinasan:"), /* @__PURE__ */ React.createElement("span", { className: "text-slate-200 font-semibold" }, user.jabatan)), /* @__PURE__ */ React.createElement("div", { className: "pt-2 border-t border-slate-800/60" }, /* @__PURE__ */ React.createElement("span", { className: "text-slate-400 text-[10px] block" }, "Unit Kerja:"), /* @__PURE__ */ React.createElement("span", { className: "text-cyan-300 font-medium" }, user.unitKerja))), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 gap-3" }, /* @__PURE__ */ React.createElement("div", { className: "bg-slate-950/70 p-3 rounded-xl border border-slate-800" }, /* @__PURE__ */ React.createElement("span", { className: "text-slate-400 text-[10px] block" }, "Email Kedinasan:"), /* @__PURE__ */ React.createElement("span", { className: "text-slate-200 font-medium truncate block mt-0.5" }, user.email)), /* @__PURE__ */ React.createElement("div", { className: "bg-slate-950/70 p-3 rounded-xl border border-slate-800" }, /* @__PURE__ */ React.createElement("span", { className: "text-slate-400 text-[10px] block" }, "Cakupan Wilayah:"), /* @__PURE__ */ React.createElement("span", { className: "text-emerald-400 font-bold block mt-0.5" }, user.accessibleSatdik === "ALL" ? "18 Satdik Nasional" : user.satdikName || "Kampus Khusus"))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { className: "text-slate-400 font-semibold block mb-2 uppercase text-[10px] tracking-wider" }, "Hak Akses Sistem (Permissions):"), /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap gap-1.5" }, user.permissions.map((perm, idx) => /* @__PURE__ */ React.createElement("span", {
			key: idx,
			className: "inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-[10px] font-medium"
		}, /* @__PURE__ */ React.createElement(CheckCircle2, { className: "w-3 h-3 text-cyan-400" }), /* @__PURE__ */ React.createElement("span", null, perm.replace("_", " ").toUpperCase()))))), /* @__PURE__ */ React.createElement("div", { className: "p-3 bg-cyan-950/30 rounded-xl border border-cyan-800/40 text-[11px] text-cyan-300 flex items-center gap-2" }, /* @__PURE__ */ React.createElement(ShieldCheck, { className: "w-4 h-4 text-cyan-400 flex-shrink-0" }), /* @__PURE__ */ React.createElement("span", null, "Sesi aktif Anda diamankan dengan protokol TLS 1.3 dan tersambung ke SSO KKP."))), /* @__PURE__ */ React.createElement("div", { className: "bg-slate-800/80 px-6 py-4 border-t border-slate-700/80 flex items-center justify-between" }, /* @__PURE__ */ React.createElement("button", {
			onClick: onClose,
			className: "px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
		}, "Tutup"), /* @__PURE__ */ React.createElement("button", {
			onClick: onLogout,
			className: "inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-950/40 transition-colors"
		}, /* @__PURE__ */ React.createElement(LogOut, { className: "w-4 h-4" }), /* @__PURE__ */ React.createElement("span", null, "Keluar / Logout")))));
	};
})();
const UserProfileModal = window.__UserProfileModal;
// ============================================================================
// MODULE: src/components/AsramaCapacityView.jsx
// ============================================================================
(() => {
	const { useState, useMemo, useRef, useEffect } = React;
	const {
		Bed, Building2, Users, ExternalLink, Search, Filter, Download, RotateCcw,
		ArrowUpDown, ChevronLeft, ChevronRight, CheckCircle2, AlertTriangle, Info, Layers,
		PlusCircle, Edit3, X, Save
	} = window.__VENDOR__.Lucide;
	const { Bar } = window.__VENDOR__.ReactChartJS2;
	const logoKkp = window.__LOGO_KKP || "Frontend/assets/logo-kkp.png";

	function fmtInt(n) {
		return Math.round(Number(n) || 0).toLocaleString("id-ID");
	}
	function fmtDec(n) {
		return (Number(n) || 0).toLocaleString("id-ID", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
	}

	function AsramaBuildingModal({ isOpen, initialData, satdikList, lockedSatdik, onClose, onSave }) {
		const isEdit = Boolean(initialData);
		const [formData, setFormData] = useState({
			satdikId: initialData?.satdikId || lockedSatdik || (satdikList?.[0]?.id || "poltek-aup"),
			nama: initialData?.nama || "",
			kampus: initialData?.kampus || "Kampus Utama",
			peruntukan: initialData?.peruntukan || "Putra",
			jumlahKamar: initialData?.jumlahKamar ?? 10,
			luasM2: initialData?.luasM2 ?? 160,
			kapasitas: initialData?.kapasitas ?? 40,
			status: initialData?.status || "Digunakan",
			keterangan: initialData?.keterangan || ""
		});
		const [autoKapasitas, setAutoKapasitas] = useState(!isEdit);
		const [submitting, setSubmitting] = useState(false);

		if (!isOpen) return null;

		const handleChange = (e) => {
			const { name, value, type } = e.target;
			const val = type === "number" ? (value === "" ? "" : Number(value)) : value;
			setFormData((prev) => {
				const next = { ...prev, [name]: val };
				if (name === "luasM2" && autoKapasitas) {
					const luas = Number(val) || 0;
					next.kapasitas = Math.floor(luas / 4);
				}
				return next;
			});
		};

		const handleSubmit = async (e) => {
			e.preventDefault();
			if (!formData.nama.trim()) {
				alert("Nama gedung asrama wajib diisi.");
				return;
			}
			setSubmitting(true);
			try {
				await onSave({
					...formData,
					jumlahKamar: Number(formData.jumlahKamar) || 0,
					luasM2: Number(formData.luasM2) || 0,
					kapasitas: Number(formData.kapasitas) || (Number(formData.luasM2) > 0 ? Math.floor(Number(formData.luasM2) / 4) : 0)
				});
			} finally {
				setSubmitting(false);
			}
		};

		return /* @__PURE__ */ React.createElement("div", {
			className: "fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
		},
			/* @__PURE__ */ React.createElement("div", {
				className: "bg-slate-800 rounded-2xl border border-slate-700 w-full max-w-xl my-8 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
			},
				/* Modal Header */
				/* @__PURE__ */ React.createElement("div", { className: "px-5 py-4 border-b border-slate-700 flex items-center justify-between bg-slate-900/50 flex-shrink-0" },
					/* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2.5" },
						/* @__PURE__ */ React.createElement("div", { className: "w-8 h-8 rounded-lg bg-cyan-500/15 text-cyan-400 flex items-center justify-center" },
							/* @__PURE__ */ React.createElement(Bed, { className: "w-4 h-4" })
						),
						/* @__PURE__ */ React.createElement("div", null,
							/* @__PURE__ */ React.createElement("h3", { className: "font-bold text-white text-sm sm:text-base" },
								isEdit ? "Edit Data Gedung Asrama" : "Tambah Gedung Asrama Baru"
							),
							/* @__PURE__ */ React.createElement("p", { className: "text-[11px] text-slate-400" },
								isEdit ? `ID: ${initialData.id} • ${initialData.nama}` : "Perekaman data fisik kapasitas asrama taruna"
							)
						)
					),
					/* @__PURE__ */ React.createElement("button", {
						type: "button",
						onClick: onClose,
						className: "p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
					}, /* @__PURE__ */ React.createElement(X, { className: "w-4 h-4" }))
				),

				/* Modal Body / Form */
				/* @__PURE__ */ React.createElement("form", { onSubmit: handleSubmit, className: "p-5 space-y-4 overflow-y-auto flex-1 text-xs" },
					/* Satdik & Kampus */
					/* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3" },
						/* @__PURE__ */ React.createElement("div", null,
							/* @__PURE__ */ React.createElement("label", { className: "block font-medium text-slate-300 mb-1" }, "Satuan Pendidikan *"),
							/* @__PURE__ */ React.createElement("select", {
								name: "satdikId",
								value: formData.satdikId,
								onChange: handleChange,
								disabled: Boolean(lockedSatdik),
								className: "w-full py-2 px-3 bg-slate-900 text-slate-100 rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-500 disabled:opacity-60"
							},
								(satdikList || []).map((s) => /* @__PURE__ */ React.createElement("option", { key: s.id, value: s.id },
									`${s.shortName || s.name} (${s.type || "Satdik"})`
								))
							)
						),
						/* @__PURE__ */ React.createElement("div", null,
							/* @__PURE__ */ React.createElement("label", { className: "block font-medium text-slate-300 mb-1" }, "Kampus / Lokasi"),
							/* @__PURE__ */ React.createElement("input", {
								type: "text",
								name: "kampus",
								value: formData.kampus,
								onChange: handleChange,
								placeholder: "misal: Kampus Utama Pasar Minggu",
								className: "w-full py-2 px-3 bg-slate-900 text-slate-100 rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-500"
							})
						)
					),

					/* Nama & Peruntukan */
					/* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-3" },
						/* @__PURE__ */ React.createElement("div", { className: "sm:col-span-2" },
							/* @__PURE__ */ React.createElement("label", { className: "block font-medium text-slate-300 mb-1" }, "Nama Gedung / Barak *"),
							/* @__PURE__ */ React.createElement("input", {
								type: "text",
								name: "nama",
								value: formData.nama,
								onChange: handleChange,
								required: true,
								placeholder: "misal: Asrama Taruna Tuna (Gedung A)",
								className: "w-full py-2 px-3 bg-slate-900 text-slate-100 rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-500 font-medium"
							})
						),
						/* @__PURE__ */ React.createElement("div", null,
							/* @__PURE__ */ React.createElement("label", { className: "block font-medium text-slate-300 mb-1" }, "Peruntukan"),
							/* @__PURE__ */ React.createElement("select", {
								name: "peruntukan",
								value: formData.peruntukan,
								onChange: handleChange,
								className: "w-full py-2 px-3 bg-slate-900 text-slate-100 rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-500"
							},
								/* @__PURE__ */ React.createElement("option", { value: "Putra" }, "Putra (Taruna)"),
								/* @__PURE__ */ React.createElement("option", { value: "Putri" }, "Putri (Taruni)"),
								/* @__PURE__ */ React.createElement("option", { value: "Campur" }, "Campur / Terpisah Sayap"),
								/* @__PURE__ */ React.createElement("option", { value: "Tidak disebut" }, "Umum / Belum Disebut")
							)
						)
					),

					/* Kamar, Luas, Kapasitas */
					/* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-3 gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-700/60" },
						/* @__PURE__ */ React.createElement("div", null,
							/* @__PURE__ */ React.createElement("label", { className: "block font-medium text-slate-300 mb-1" }, "Jumlah Kamar"),
							/* @__PURE__ */ React.createElement("input", {
								type: "number",
								min: "0",
								name: "jumlahKamar",
								value: formData.jumlahKamar,
								onChange: handleChange,
								className: "w-full py-1.5 px-2.5 bg-slate-800 text-slate-100 rounded-lg border border-slate-700 focus:outline-none focus:border-cyan-500 font-mono"
							})
						),
						/* @__PURE__ */ React.createElement("div", null,
							/* @__PURE__ */ React.createElement("label", { className: "block font-medium text-slate-300 mb-1" }, "Luas (m²)"),
							/* @__PURE__ */ React.createElement("input", {
								type: "number",
								step: "0.1",
								min: "0",
								name: "luasM2",
								value: formData.luasM2,
								onChange: handleChange,
								className: "w-full py-1.5 px-2.5 bg-slate-800 text-slate-100 rounded-lg border border-slate-700 focus:outline-none focus:border-cyan-500 font-mono"
							})
						),
						/* @__PURE__ */ React.createElement("div", null,
							/* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between mb-1" },
								/* @__PURE__ */ React.createElement("label", { className: "font-medium text-slate-300" }, "Kapasitas"),
								/* @__PURE__ */ React.createElement("button", {
									type: "button",
									onClick: () => {
										const nextAuto = !autoKapasitas;
										setAutoKapasitas(nextAuto);
										if (nextAuto && Number(formData.luasM2) > 0) {
											setFormData(prev => ({ ...prev, kapasitas: Math.floor(Number(prev.luasM2) / 4) }));
										}
									},
									className: `text-[10px] ${autoKapasitas ? "text-cyan-400 font-bold" : "text-slate-500"}`
								}, "Auto 4m²")
							),
							/* @__PURE__ */ React.createElement("input", {
								type: "number",
								min: "0",
								name: "kapasitas",
								value: formData.kapasitas,
								onChange: (e) => { setAutoKapasitas(false); handleChange(e); },
								className: "w-full py-1.5 px-2.5 bg-slate-800 text-emerald-300 rounded-lg border border-slate-700 focus:outline-none focus:border-cyan-500 font-mono font-bold"
							})
						)
					),

					/* Status & Keterangan */
					/* @__PURE__ */ React.createElement("div", { className: "space-y-3" },
						/* @__PURE__ */ React.createElement("div", null,
							/* @__PURE__ */ React.createElement("label", { className: "block font-medium text-slate-300 mb-1" }, "Status Operasional Gedung"),
							/* @__PURE__ */ React.createElement("select", {
								name: "status",
								value: formData.status,
								onChange: handleChange,
								className: "w-full py-2 px-3 bg-slate-900 text-slate-100 rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-500"
							},
								/* @__PURE__ */ React.createElement("option", { value: "Digunakan" }, "Digunakan (Aktif Dihuni Taruna)"),
								/* @__PURE__ */ React.createElement("option", { value: "Perlu Renovasi" }, "Perlu Renovasi (Rusak / Sedang Diperbaiki)"),
								/* @__PURE__ */ React.createElement("option", { value: "Tidak Digunakan" }, "Tidak Digunakan (Kosong / Non-Aktif)")
							)
						),
						/* @__PURE__ */ React.createElement("div", null,
							/* @__PURE__ */ React.createElement("label", { className: "block font-medium text-slate-300 mb-1" }, "Catatan / Keterangan"),
							/* @__PURE__ */ React.createElement("textarea", {
								name: "keterangan",
								rows: 2,
								value: formData.keterangan,
								onChange: handleChange,
								placeholder: "misal: Bangunan 2 lantai, baru direnovasi...",
								className: "w-full py-2 px-3 bg-slate-900 text-slate-100 rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-500"
							})
						)
					),

					/* Actions */
					/* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-end gap-2.5 pt-3 border-t border-slate-700" },
						/* @__PURE__ */ React.createElement("button", {
							type: "button",
							onClick: onClose,
							disabled: submitting,
							className: "px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold transition-colors"
						}, "Batal"),
						/* @__PURE__ */ React.createElement("button", {
							type: "submit",
							disabled: submitting,
							className: "inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold shadow-md shadow-cyan-950/40 transition-colors"
						},
							/* @__PURE__ */ React.createElement(Save, { className: "w-4 h-4" }),
							/* @__PURE__ */ React.createElement("span", null, submitting ? "Menyimpan..." : (isEdit ? "Simpan Perubahan" : "Tambahkan Gedung"))
						)
					)
				)
			)
		);
	}

	window.__AsramaCapacityView = function AsramaCapacityView({ asramaData, satdikList, currentUser, onAddBuilding, onUpdateBuilding, onDeleteBuilding, onOpenAddModal }) {
		const { isDark } = useTheme();
		const detailRef = useRef(null);

		const lockedSatdik = currentUser?.accessibleSatdik && currentUser.accessibleSatdik !== "ALL"
			? currentUser.accessibleSatdik
			: null;

		const [jenjangFilter, setJenjangFilter] = useState("ALL");
		const [selectedSatdik, setSelectedSatdik] = useState(() => lockedSatdik || "ALL");
		const [basisMode, setBasisMode] = useState("standar"); // "standar" | "adjustment" | "aktif"
		const [rekapSortField, setRekapSortField] = useState("ratio");
		const [rekapSortDir, setRekapSortDir] = useState("desc");

		const [buildingSearch, setBuildingSearch] = useState("");
		const [statusFilter, setStatusFilter] = useState("ALL");
		const [genderFilter, setGenderFilter] = useState("ALL");
		const [buildingSortField, setBuildingSortField] = useState("kapasitas");
		const [buildingSortDir, setBuildingSortDir] = useState("desc");
		const [expandedBuildingId, setExpandedBuildingId] = useState(null);
		const [currentPage, setCurrentPage] = useState(1);
		const itemsPerPage = 15;

		// State CRUD Modals
		const [isBuildingModalOpen, setIsBuildingModalOpen] = useState(false);
		const [selectedBuildingForEdit, setSelectedBuildingForEdit] = useState(null);
		const [deletingBuilding, setDeletingBuilding] = useState(null);
		const [isSubmitting, setIsSubmitting] = useState(false);

		useEffect(() => {
			if (lockedSatdik) setSelectedSatdik(lockedSatdik);
		}, [lockedSatdik]);

		const satdikMap = useMemo(() => {
			const m = {};
			(satdikList || []).forEach((s) => { m[s.id] = s; });
			return m;
		}, [satdikList]);

		const rawSummary = asramaData?.summary || [];
		const rawBuildings = asramaData?.buildings || [];

		// Enrich summary rows with Satdik master info & selected basis metrics
		const enrichedSummary = useMemo(() => {
			return rawSummary.map((s) => {
				const sat = satdikMap[s.satdikId] || {};
				const tarunaCount = Number(sat.tarunaCount) || 0;
				const kapStandar = Number(s.kapasitas) || 0;
				const kapAdj = s.kapasitasAdjustment != null ? Number(s.kapasitasAdjustment) : kapStandar;
				const kapAktif = s.kapasitasAktif != null ? Number(s.kapasitasAktif) : kapStandar;
				const luasStandar = Number(s.luasM2) || 0;
				const luasAdj = s.luasAdjustment != null ? Number(s.luasAdjustment) : luasStandar;

				const kapasitasUsed = basisMode === "adjustment" ? kapAdj : basisMode === "aktif" ? kapAktif : kapStandar;
				const luasUsed = basisMode === "adjustment" ? luasAdj : luasStandar;
				const selisih = Math.round(kapasitasUsed) - tarunaCount;
				const ratio = tarunaCount > 0 ? Math.round((kapasitasUsed / tarunaCount) * 1000) / 10 : 0;

				return {
					...s,
					satdik: sat,
					satdikName: sat.name || s.namaExcel || s.satdikId,
					shortName: sat.shortName || s.namaExcel || s.satdikId,
					type: sat.type || (s.satdikId.startsWith("supm-") ? "SUPM" : "Politeknik"),
					kota: sat.kota || "",
					provinsi: sat.provinsi || "",
					tarunaCount,
					kapasitasUsed,
					luasUsed,
					selisih,
					ratio
				};
			});
		}, [rawSummary, satdikMap, basisMode]);

		// Unsurveyed Satdik (in 18 master list, not in 16 Excel sheets)
		const unsurveyedSatdik = useMemo(() => {
			const surveyedIds = new Set(rawSummary.map((s) => s.satdikId));
			return (satdikList || []).filter((s) => !surveyedIds.has(s.id));
		}, [rawSummary, satdikList]);

		// Filtered summary rows
		const filteredSummary = useMemo(() => {
			return enrichedSummary
				.filter((row) => {
					const matchSatdik = selectedSatdik === "ALL" || row.satdikId === selectedSatdik;
					const matchJenjang = jenjangFilter === "ALL"
						|| (jenjangFilter === "Politeknik" && row.type !== "SUPM")
						|| (jenjangFilter === "SUPM" && row.type === "SUPM");
					return matchSatdik && matchJenjang;
				})
				.sort((a, b) => {
					let va = a[rekapSortField];
					let vb = b[rekapSortField];
					if (typeof va === "string") {
						va = va.toLowerCase();
						vb = String(vb || "").toLowerCase();
					}
					if (va < vb) return rekapSortDir === "asc" ? -1 : 1;
					if (va > vb) return rekapSortDir === "asc" ? 1 : -1;
					return 0;
				});
		}, [enrichedSummary, selectedSatdik, jenjangFilter, rekapSortField, rekapSortDir]);

		// Aggregate KPIs for current filtered summary
		const totals = useMemo(() => {
			let unit = 0, kamar = 0, luas = 0, kap = 0, taruna = 0, renov = 0, kosong = 0, memadai = 0;
			filteredSummary.forEach((r) => {
				unit += Number(r.jumlahAsrama) || 0;
				kamar += Number(r.jumlahKamar) || 0;
				luas += Number(r.luasUsed) || 0;
				kap += Math.round(Number(r.kapasitasUsed) || 0);
				taruna += Number(r.tarunaCount) || 0;
				renov += Number(r.jumlahPerluRenovasi) || 0;
				kosong += Number(r.jumlahTidakDipakai) || 0;
				if (r.ratio >= 100) memadai += 1;
			});
			const ratio = taruna > 0 ? Math.round((kap / taruna) * 1000) / 10 : 0;
			const selisih = kap - taruna;
			return { unit, kamar, luas, kap, taruna, renov, kosong, memadai, ratio, selisih, satdikCount: filteredSummary.length };
		}, [filteredSummary]);

		// Filtered detail buildings
		const allowedSatdikIds = useMemo(() => new Set(filteredSummary.map((r) => r.satdikId)), [filteredSummary]);

		const statusCounts = useMemo(() => {
			const scoped = rawBuildings.filter((b) => allowedSatdikIds.has(b.satdikId));
			return {
				total: scoped.length,
				digunakan: scoped.filter((b) => b.status === "Digunakan").length,
				renovasi: scoped.filter((b) => b.status === "Perlu Renovasi").length,
				kosong: scoped.filter((b) => b.status === "Tidak Dipakai").length
			};
		}, [rawBuildings, allowedSatdikIds]);

		const filteredBuildings = useMemo(() => {
			const q = buildingSearch.trim().toLowerCase();
			return rawBuildings
				.filter((b) => {
					if (!allowedSatdikIds.has(b.satdikId)) return false;
					if (statusFilter !== "ALL" && b.status !== statusFilter) return false;
					if (genderFilter !== "ALL" && b.peruntukan !== genderFilter) return false;
					if (q) {
						const sat = satdikMap[b.satdikId];
						const hay = [
							b.id,
							b.nama,
							b.kampus || "",
							b.keterangan || "",
							sat?.name || "",
							sat?.shortName || ""
						].join(" ").toLowerCase();
						if (!hay.includes(q)) return false;
					}
					return true;
				})
				.sort((a, b) => {
					let va = buildingSortField === "satdikName"
						? (satdikMap[a.satdikId]?.shortName || a.satdikId)
						: a[buildingSortField];
					let vb = buildingSortField === "satdikName"
						? (satdikMap[b.satdikId]?.shortName || b.satdikId)
						: b[buildingSortField];
					if (typeof va === "string") {
						va = va.toLowerCase();
						vb = String(vb || "").toLowerCase();
					}
					if (va < vb) return buildingSortDir === "asc" ? -1 : 1;
					if (va > vb) return buildingSortDir === "asc" ? 1 : -1;
					return 0;
				});
		}, [rawBuildings, allowedSatdikIds, statusFilter, genderFilter, buildingSearch, buildingSortField, buildingSortDir, satdikMap]);

		const totalPages = Math.ceil(filteredBuildings.length / itemsPerPage) || 1;
		const paginatedBuildings = filteredBuildings.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

		const toggleRekapSort = (field) => {
			if (rekapSortField === field) {
				setRekapSortDir((d) => (d === "asc" ? "desc" : "asc"));
			} else {
				setRekapSortField(field);
				setRekapSortDir(field === "shortName" ? "asc" : "desc");
			}
		};

		const toggleBuildingSort = (field) => {
			if (buildingSortField === field) {
				setBuildingSortDir((d) => (d === "asc" ? "desc" : "asc"));
			} else {
				setBuildingSortField(field);
				setBuildingSortDir(field === "nama" || field === "satdikName" ? "asc" : "desc");
			}
		};

		const handleFocusSatdikBuildings = (satdikId) => {
			setSelectedSatdik(satdikId);
			setCurrentPage(1);
			setTimeout(() => {
				if (detailRef.current) {
					detailRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
				}
			}, 60);
		};

		const handleResetAll = () => {
			setJenjangFilter("ALL");
			setSelectedSatdik(lockedSatdik || "ALL");
			setBasisMode("standar");
			setBuildingSearch("");
			setStatusFilter("ALL");
			setGenderFilter("ALL");
			setExpandedBuildingId(null);
			setCurrentPage(1);
		};

		// Chart.js Bar Comparison: Kapasitas Asrama vs Jumlah Taruna
		const textColor = isDark ? "#cbd5e1" : "#090d16";
		const textMuted = isDark ? "#94a3b8" : "#1e293b";
		const gridColor = isDark ? "rgba(51, 65, 85, 0.4)" : "#cbd5e1";

		const chartRows = useMemo(() => {
			return [...filteredSummary].sort((a, b) => b.tarunaCount - a.tarunaCount);
		}, [filteredSummary]);

		const barData = {
			labels: chartRows.map((r) => r.shortName.replace("Politeknik ", "Poltek ")),
			datasets: [
				{
					label: basisMode === "adjustment"
						? "Kapasitas Asrama Adjustment (Orang)"
						: basisMode === "aktif"
							? "Kapasitas Asrama Aktif Dipakai (Orang)"
							: "Kapasitas Asrama Standar 4 m² (Orang)",
					data: chartRows.map((r) => Math.round(r.kapasitasUsed)),
					backgroundColor: isDark ? "rgba(6, 182, 212, 0.85)" : "#0284c7",
					borderColor: "#06b6d4",
					borderWidth: 1,
					borderRadius: 5
				},
				{
					label: "Jumlah Taruna Aktif (Orang)",
					data: chartRows.map((r) => r.tarunaCount),
					backgroundColor: isDark ? "rgba(245, 158, 11, 0.75)" : "#d97706",
					borderColor: "#f59e0b",
					borderWidth: 1,
					borderRadius: 5
				}
			]
		};

		const barOptions = {
			responsive: true,
			maintainAspectRatio: false,
			plugins: {
				legend: {
					position: "top",
					labels: { color: textColor, font: { size: 11, weight: "600" }, boxWidth: 12 }
				}
			},
			scales: {
				x: {
					ticks: { color: textColor, font: { size: 10, weight: "600" }, maxRotation: 35, minRotation: 0 },
					grid: { display: false }
				},
				y: {
					beginAtZero: true,
					ticks: { color: textMuted, font: { size: 10 } },
					grid: { color: gridColor }
				}
			}
		};

		const selectedUnsurveyed = unsurveyedSatdik.find((s) => s.id === selectedSatdik);

		return /* @__PURE__ */ React.createElement("div", { className: "space-y-6" },
			/* 1. HERO HEADER */
			/* @__PURE__ */ React.createElement("div", { className: "flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-gradient-to-r from-slate-800/90 via-slate-800/70 to-slate-900/90 p-4 sm:p-5 rounded-2xl border border-slate-700/80 shadow-lg relative overflow-hidden" },
				/* @__PURE__ */ React.createElement("div", { className: "absolute right-0 top-0 bottom-0 opacity-5 pointer-events-none flex items-center pr-6" },
					/* @__PURE__ */ React.createElement("img", { src: logoKkp, alt: "KKP Watermark", className: "w-56 h-56 object-contain" })
				),
				/* @__PURE__ */ React.createElement("div", { className: "flex flex-col sm:flex-row items-center text-center sm:text-left gap-3.5 sm:gap-4 relative z-10" },
					/* @__PURE__ */ React.createElement("div", { className: "w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white p-1.5 shadow-md border border-cyan-500/30 flex items-center justify-center flex-shrink-0" },
						/* @__PURE__ */ React.createElement("img", { src: logoKkp, alt: "Logo KKP", className: "w-full h-full object-contain" })
					),
					/* @__PURE__ */ React.createElement("div", null,
						/* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap items-center justify-center sm:justify-start gap-2" },
							/* @__PURE__ */ React.createElement("span", { className: "px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30" }, "Survei Resmi Asrama Taruna KKP"),
							/* @__PURE__ */ React.createElement("span", { className: "text-xs text-slate-400" }, "• Standar Ruang 4 m² / Taruna")
						),
						/* @__PURE__ */ React.createElement("h2", { className: "text-lg sm:text-xl md:text-2xl font-bold text-white tracking-tight mt-1 flex items-center justify-center sm:justify-start gap-2" },
							/* @__PURE__ */ React.createElement(Bed, { className: "w-5 h-5 text-cyan-400 flex-shrink-0" }),
							/* @__PURE__ */ React.createElement("span", null, "Analitik Kapasitas & Ketersediaan Asrama")
						),
						/* @__PURE__ */ React.createElement("p", { className: "text-slate-400 text-xs sm:text-sm mt-0.5 max-w-2xl" },
							"Perbandingan daya tampung riil asrama terhadap jumlah taruna aktif, rasio ketercukupan per Satdik, rincian dimensi 104 gedung, dan tautan dokumen Google Drive."
						)
					)
				),
				/* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap items-center justify-center gap-2 relative z-10" },
					/* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-700/60", title: "Pilih dasar perhitungan daya tampung asrama" },
						/* @__PURE__ */ React.createElement("button", {
							onClick: () => setBasisMode("standar"),
							className: `px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${basisMode === "standar" ? "bg-cyan-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"}`
						}, "Standar 4 m²"),
						/* @__PURE__ */ React.createElement("button", {
							onClick: () => setBasisMode("adjustment"),
							className: `px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${basisMode === "adjustment" ? "bg-cyan-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"}`
						}, "Adjustment"),
						/* @__PURE__ */ React.createElement("button", {
							onClick: () => setBasisMode("aktif"),
							className: `px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${basisMode === "aktif" ? "bg-cyan-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"}`
						}, "Aktif Dipakai")
					)
				)
			),

			/* 2. GLOBAL FILTER BAR (JENJANG & SATDIK) */
			/* @__PURE__ */ React.createElement("div", { className: "bg-slate-800/80 rounded-2xl p-4 border border-slate-700/70 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-3" },
				/* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap items-center gap-2" },
					/* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-700" },
						/* @__PURE__ */ React.createElement(Filter, { className: "w-3.5 h-3.5 text-cyan-400 ml-2 mr-1" }),
						/* @__PURE__ */ React.createElement("button", {
							onClick: () => { setJenjangFilter("ALL"); setCurrentPage(1); },
							className: `px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${jenjangFilter === "ALL" ? "bg-cyan-600 text-white" : "text-slate-400 hover:text-slate-200"}`
						}, "Semua (16)"),
						/* @__PURE__ */ React.createElement("button", {
							onClick: () => { setJenjangFilter("Politeknik"); setCurrentPage(1); },
							className: `px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${jenjangFilter === "Politeknik" ? "bg-cyan-600 text-white" : "text-slate-400 hover:text-slate-200"}`
						}, "Politeknik & AKKP (11)"),
						/* @__PURE__ */ React.createElement("button", {
							onClick: () => { setJenjangFilter("SUPM"); setCurrentPage(1); },
							className: `px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${jenjangFilter === "SUPM" ? "bg-cyan-600 text-white" : "text-slate-400 hover:text-slate-200"}`
						}, "SUPM (5)")
					),
					/* @__PURE__ */ React.createElement("select", {
						value: selectedSatdik,
						disabled: Boolean(lockedSatdik),
						onChange: (e) => { setSelectedSatdik(e.target.value); setCurrentPage(1); },
						className: "py-2 px-3 bg-slate-900 text-slate-200 text-xs rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-500"
					},
						/* @__PURE__ */ React.createElement("option", { value: "ALL" }, "Semua Satdik Terdata (16 Kampus)"),
						enrichedSummary.map((s) => /* @__PURE__ */ React.createElement("option", { key: s.satdikId, value: s.satdikId }, s.shortName, " — Kapasitas ", fmtInt(s.kapasitasUsed), " org")),
						unsurveyedSatdik.length > 0 && /* @__PURE__ */ React.createElement("optgroup", { label: "Belum Tercantum di Excel Survei" },
							unsurveyedSatdik.map((u) => /* @__PURE__ */ React.createElement("option", { key: u.id, value: u.id }, u.shortName, " (Belum ada data Excel)"))
						)
					)
				),
				/* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2 text-xs text-slate-400" },
					/* @__PURE__ */ React.createElement("span", null, "Sumber: ", /* @__PURE__ */ React.createElement("strong", { className: "text-slate-200 font-mono" }, asramaData?.meta?.sumber || "05072025_Rekap Asrama_Adjustmen.xlsx")),
					(selectedSatdik !== (lockedSatdik || "ALL") || jenjangFilter !== "ALL" || basisMode !== "standar" || buildingSearch || statusFilter !== "ALL" || genderFilter !== "ALL") && /* @__PURE__ */ React.createElement("button", {
						onClick: handleResetAll,
						className: "inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs transition-colors"
					},
						/* @__PURE__ */ React.createElement(RotateCcw, { className: "w-3.5 h-3.5 text-cyan-400" }),
						/* @__PURE__ */ React.createElement("span", null, "Reset")
					)
				)
			),

			/* Info jika operator/user memilih 2 satdik yang belum ada di file Excel */
			selectedUnsurveyed && /* @__PURE__ */ React.createElement("div", { className: "bg-slate-800/90 rounded-2xl p-5 border border-amber-500/30 shadow-md flex items-start gap-3" },
				/* @__PURE__ */ React.createElement("div", { className: "w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center flex-shrink-0" },
					/* @__PURE__ */ React.createElement(Info, { className: "w-5 h-5" })
				),
				/* @__PURE__ */ React.createElement("div", null,
					/* @__PURE__ */ React.createElement("h4", { className: "font-bold text-white text-sm" }, "Data Survei Asrama Belum Tersedia untuk ", selectedUnsurveyed.name),
					/* @__PURE__ */ React.createElement("p", { className: "text-xs text-slate-400 mt-1" },
						"Satuan pendidikan ini memiliki ", fmtInt(selectedUnsurveyed.tarunaCount), " taruna aktif pada master data, namun belum memiliki lembar rincian pada file Excel ",
						asramaData?.meta?.sumber || "Rekap Asrama", ". Tambahkan sheet kampus pada file Excel lalu jalankan skrip import_asrama.py untuk memperbarui otomatis."
					)
				)
			),

			/* 3. EMPAT KARTU KPI EKSEKUTIF ASRAMA */
			filteredSummary.length > 0 && /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4" },
				/* KPI 1: Unit & Kamar */
				/* @__PURE__ */ React.createElement("div", { className: "bg-slate-800/90 rounded-2xl p-4 border border-slate-700/70 hover:border-cyan-500/50 transition-all shadow-md" },
					/* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between text-slate-400" },
						/* @__PURE__ */ React.createElement("span", { className: "text-xs font-medium uppercase tracking-wider" }, "Total Gedung Asrama"),
						/* @__PURE__ */ React.createElement("div", { className: "w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center" },
							/* @__PURE__ */ React.createElement(Building2, { className: "w-4 h-4" })
						)
					),
					/* @__PURE__ */ React.createElement("div", { className: "mt-3" },
						/* @__PURE__ */ React.createElement("div", { className: "text-2xl font-black text-white" }, fmtInt(totals.unit), " ", /* @__PURE__ */ React.createElement("span", { className: "text-xs font-normal text-slate-400" }, "Unit")),
						/* @__PURE__ */ React.createElement("div", { className: "text-[11px] text-cyan-400 mt-0.5" }, fmtInt(totals.kamar), " Kamar/Barak • ", totals.satdikCount, " Satdik")
					)
				),
				/* KPI 2: Luas Kamar Total */
				/* @__PURE__ */ React.createElement("div", { className: "bg-slate-800/90 rounded-2xl p-4 border border-slate-700/70 hover:border-blue-500/50 transition-all shadow-md" },
					/* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between text-slate-400" },
						/* @__PURE__ */ React.createElement("span", { className: "text-xs font-medium uppercase tracking-wider" }, "Luas Kamar Total"),
						/* @__PURE__ */ React.createElement("div", { className: "w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center" },
							/* @__PURE__ */ React.createElement(Layers, { className: "w-4 h-4" })
						)
					),
					/* @__PURE__ */ React.createElement("div", { className: "mt-3" },
						/* @__PURE__ */ React.createElement("div", { className: "text-2xl font-black text-white" }, fmtInt(totals.luas), " ", /* @__PURE__ */ React.createElement("span", { className: "text-xs font-normal text-slate-400" }, "m²")),
						/* @__PURE__ */ React.createElement("div", { className: "text-[11px] text-slate-400 mt-0.5" },
							"Rata-rata ", totals.kamar > 0 ? fmtDec(totals.luas / totals.kamar) : 0, " m² per kamar/barak"
						)
					)
				),
				/* KPI 3: Kapasitas Tampung */
				/* @__PURE__ */ React.createElement("div", { className: "bg-slate-800/90 rounded-2xl p-4 border border-slate-700/70 hover:border-emerald-500/50 transition-all shadow-md" },
					/* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between text-slate-400" },
						/* @__PURE__ */ React.createElement("span", { className: "text-xs font-medium uppercase tracking-wider" }, "Daya Tampung Asrama"),
						/* @__PURE__ */ React.createElement("div", { className: "w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center" },
							/* @__PURE__ */ React.createElement(Bed, { className: "w-4 h-4" })
						)
					),
					/* @__PURE__ */ React.createElement("div", { className: "mt-3" },
						/* @__PURE__ */ React.createElement("div", { className: "text-2xl font-black text-emerald-400" }, fmtInt(totals.kap), " ", /* @__PURE__ */ React.createElement("span", { className: "text-xs font-normal text-slate-400" }, "Taruna")),
						/* @__PURE__ */ React.createElement("div", { className: "text-[11px] text-slate-400 mt-0.5" },
							"Populasi Taruna: ", fmtInt(totals.taruna), " orang"
						)
					)
				),
				/* KPI 4: Rasio Ketercukupan */
				/* @__PURE__ */ React.createElement("div", { className: "bg-slate-800/90 rounded-2xl p-4 border border-slate-700/70 hover:border-cyan-500/50 transition-all shadow-md" },
					/* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between text-slate-400" },
						/* @__PURE__ */ React.createElement("span", { className: "text-xs font-medium uppercase tracking-wider" }, "Rasio Ketercukupan"),
						/* @__PURE__ */ React.createElement("div", { className: `w-8 h-8 rounded-lg ${totals.ratio >= 100 ? "bg-emerald-500/10 text-emerald-400" : totals.ratio >= 75 ? "bg-amber-500/10 text-amber-400" : "bg-rose-500/10 text-rose-400"} flex items-center justify-center` },
							/* @__PURE__ */ React.createElement(Users, { className: "w-4 h-4" })
						)
					),
					/* @__PURE__ */ React.createElement("div", { className: "mt-3" },
						/* @__PURE__ */ React.createElement("div", { className: `text-2xl font-black ${totals.ratio >= 100 ? "text-emerald-400" : totals.ratio >= 75 ? "text-amber-400" : "text-rose-400"}` }, totals.ratio, "%"),
						/* @__PURE__ */ React.createElement("div", { className: "text-[11px] text-slate-400 mt-0.5" },
							totals.selisih >= 0 ? `+${fmtInt(totals.selisih)} kasur` : `Selisih ${fmtInt(totals.selisih)} kasur`,
							" • ", totals.memadai, "/", totals.satdikCount, " memadai"
						)
					)
				)
			),

			/* 4. GRAFIK PERBANDINGAN KAPASITAS VS JUMLAH TARUNA */
			filteredSummary.length > 1 && /* @__PURE__ */ React.createElement("div", { className: "bg-slate-800/90 rounded-2xl p-5 border border-slate-700/70 shadow-lg" },
				/* @__PURE__ */ React.createElement("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3" },
					/* @__PURE__ */ React.createElement("div", null,
						/* @__PURE__ */ React.createElement("h3", { className: "text-base font-bold text-white tracking-tight" }, "Perbandingan Daya Tampung Asrama vs Jumlah Taruna per Satdik"),
						/* @__PURE__ */ React.createElement("p", { className: "text-xs text-slate-400" }, "Visualisasi kesenjangan kapasitas tempat tinggal taruna terhadap populasi taruna aktif masing-masing kampus.")
					),
					(totals.renov > 0 || totals.kosong > 0) && /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap items-center gap-2 text-[11px]" },
						totals.renov > 0 && /* @__PURE__ */ React.createElement("span", { className: "px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold" }, "⚠ ", totals.renov, " Gedung Perlu Renovasi"),
						totals.kosong > 0 && /* @__PURE__ */ React.createElement("span", { className: "px-2.5 py-1 rounded-lg bg-rose-500/15 text-rose-400 border border-rose-500/30 font-semibold" }, "• ", totals.kosong, " Gedung Sementara Kosong")
					)
				),
				/* @__PURE__ */ React.createElement("div", { className: "h-72 sm:h-80" },
					/* @__PURE__ */ React.createElement(Bar, { data: barData, options: barOptions })
				)
			),

			/* 5. TABEL RINGKASAN PER SATDIK + LINK GOOGLE DRIVE */
			filteredSummary.length > 0 && /* @__PURE__ */ React.createElement("div", { className: "bg-slate-800/90 rounded-2xl border border-slate-700/70 shadow-lg overflow-hidden" },
				/* @__PURE__ */ React.createElement("div", { className: "p-4 sm:p-5 border-b border-slate-700/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2" },
					/* @__PURE__ */ React.createElement("div", null,
						/* @__PURE__ */ React.createElement("h3", { className: "text-base font-bold text-white tracking-tight" }, "Ringkasan Kapasitas & Rasio Ketercukupan per Satuan Pendidikan"),
						/* @__PURE__ */ React.createElement("p", { className: "text-xs text-slate-400 mt-0.5" }, "Klik tombol Rincian untuk menelusuri gedung asrama per kampus, atau klik Drive untuk membuka berkas survei asli.")
					),
					/* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3 text-[11px] text-slate-400" },
						/* @__PURE__ */ React.createElement("span", { className: "flex items-center gap-1" }, /* @__PURE__ */ React.createElement("span", { className: "w-2.5 h-2.5 rounded-full bg-emerald-500" }), "Memadai (≥100%)"),
						/* @__PURE__ */ React.createElement("span", { className: "flex items-center gap-1" }, /* @__PURE__ */ React.createElement("span", { className: "w-2.5 h-2.5 rounded-full bg-amber-500" }), "Cukup (70–99%)"),
						/* @__PURE__ */ React.createElement("span", { className: "flex items-center gap-1" }, /* @__PURE__ */ React.createElement("span", { className: "w-2.5 h-2.5 rounded-full bg-rose-500" }), "Defisit (<70%)")
					)
				),
				/* @__PURE__ */ React.createElement("div", { className: "overflow-x-auto" },
					/* @__PURE__ */ React.createElement("table", { className: "w-full text-left text-xs border-collapse" },
						/* @__PURE__ */ React.createElement("thead", null,
							/* @__PURE__ */ React.createElement("tr", { className: "bg-slate-900/90 text-slate-300 border-b border-slate-700/80 font-semibold uppercase tracking-wider text-[11px]" },
								/* @__PURE__ */ React.createElement("th", { onClick: () => toggleRekapSort("shortName"), className: "p-3.5 cursor-pointer hover:text-cyan-400 transition-colors" },
									/* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-1.5" }, /* @__PURE__ */ React.createElement("span", null, "Satuan Pendidikan"), /* @__PURE__ */ React.createElement(ArrowUpDown, { className: "w-3.5 h-3.5 opacity-60" }))
								),
								/* @__PURE__ */ React.createElement("th", { onClick: () => toggleRekapSort("jumlahAsrama"), className: "p-3.5 cursor-pointer hover:text-cyan-400 transition-colors" },
									/* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-1.5" }, /* @__PURE__ */ React.createElement("span", null, "Unit & Kamar"), /* @__PURE__ */ React.createElement(ArrowUpDown, { className: "w-3.5 h-3.5 opacity-60" }))
								),
								/* @__PURE__ */ React.createElement("th", { onClick: () => toggleRekapSort("luasUsed"), className: "p-3.5 cursor-pointer hover:text-cyan-400 transition-colors" },
									/* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-1.5" }, /* @__PURE__ */ React.createElement("span", null, "Luas Kamar"), /* @__PURE__ */ React.createElement(ArrowUpDown, { className: "w-3.5 h-3.5 opacity-60" }))
								),
								/* @__PURE__ */ React.createElement("th", { onClick: () => toggleRekapSort("kapasitasUsed"), className: "p-3.5 cursor-pointer hover:text-cyan-400 transition-colors" },
									/* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-1.5" }, /* @__PURE__ */ React.createElement("span", null, "Kapasitas vs Taruna"), /* @__PURE__ */ React.createElement(ArrowUpDown, { className: "w-3.5 h-3.5 opacity-60" }))
								),
								/* @__PURE__ */ React.createElement("th", { onClick: () => toggleRekapSort("ratio"), className: "p-3.5 cursor-pointer hover:text-cyan-400 transition-colors" },
									/* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-1.5" }, /* @__PURE__ */ React.createElement("span", null, "Rasio Ketercukupan"), /* @__PURE__ */ React.createElement(ArrowUpDown, { className: "w-3.5 h-3.5 opacity-60" }))
								),
								/* @__PURE__ */ React.createElement("th", { className: "p-3.5 text-right" }, "Dokumen & Rincian")
							)
						),
						/* @__PURE__ */ React.createElement("tbody", { className: "divide-y divide-slate-800" },
							filteredSummary.map((row) => {
								const isSelected = selectedSatdik === row.satdikId;
								const badgeCls = row.ratio >= 100
									? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
									: row.ratio >= 70
										? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
										: "bg-rose-500/15 text-rose-400 border border-rose-500/30";
								const barCls = row.ratio >= 100 ? "bg-emerald-500" : row.ratio >= 70 ? "bg-amber-500" : "bg-rose-500";
								return /* @__PURE__ */ React.createElement("tr", {
									key: row.satdikId,
									className: `hover:bg-slate-700/40 transition-colors ${isSelected ? "bg-slate-700/40" : ""}`
								},
									/* Satdik */
									/* @__PURE__ */ React.createElement("td", { className: "p-3.5" },
										/* @__PURE__ */ React.createElement("div", { className: "font-bold text-white" }, row.shortName),
										/* @__PURE__ */ React.createElement("div", { className: "text-[11px] text-slate-400" }, row.kota ? `${row.kota}, ${row.provinsi}` : row.satdikName)
									),
									/* Unit & Kamar */
									/* @__PURE__ */ React.createElement("td", { className: "p-3.5" },
										/* @__PURE__ */ React.createElement("div", { className: "font-semibold text-slate-200" }, row.jumlahAsrama, " Unit • ", fmtInt(row.jumlahKamar), " Kamar"),
										/* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap gap-1 mt-1" },
											row.jumlahPerluRenovasi > 0 && /* @__PURE__ */ React.createElement("span", { className: "px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-500/20 text-amber-300" }, row.jumlahPerluRenovasi, " perlu renovasi"),
											row.jumlahTidakDipakai > 0 && /* @__PURE__ */ React.createElement("span", { className: "px-1.5 py-0.5 rounded text-[10px] font-semibold bg-rose-500/15 text-rose-400" }, row.jumlahTidakDipakai, " kosong")
										)
									),
									/* Luas */
									/* @__PURE__ */ React.createElement("td", { className: "p-3.5 font-mono text-slate-200" },
										/* @__PURE__ */ React.createElement("div", null, fmtDec(row.luasUsed), " m²"),
										basisMode !== "adjustment" && row.luasAdjustment && Math.round(row.luasAdjustment) !== Math.round(row.luasM2) && /* @__PURE__ */ React.createElement("div", { className: "text-[10px] text-slate-400" }, "Adj: ", fmtDec(row.luasAdjustment), " m²")
									),
									/* Kapasitas vs Taruna */
									/* @__PURE__ */ React.createElement("td", { className: "p-3.5" },
										/* @__PURE__ */ React.createElement("div", { className: "flex items-baseline gap-1.5" },
											/* @__PURE__ */ React.createElement("span", { className: "font-bold text-white" }, fmtInt(row.kapasitasUsed)),
											/* @__PURE__ */ React.createElement("span", { className: "text-slate-400 text-[11px]" }, "/ ", fmtInt(row.tarunaCount), " taruna")
										),
										/* @__PURE__ */ React.createElement("div", { className: `text-[10px] font-semibold mt-0.5 ${row.selisih >= 0 ? "text-emerald-400" : "text-rose-400"}` },
											row.selisih >= 0 ? `+${fmtInt(row.selisih)} kasur` : `${fmtInt(row.selisih)} kasur (Kurang)`
										)
									),
									/* Rasio Ketercukupan */
									/* @__PURE__ */ React.createElement("td", { className: "p-3.5" },
										/* @__PURE__ */ React.createElement("div", { className: "space-y-1 max-w-[130px]" },
											/* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between gap-2" },
												/* @__PURE__ */ React.createElement("span", { className: `px-2 py-0.5 rounded text-[10px] font-bold ${badgeCls}` },
													row.ratio >= 100 ? "Memadai" : row.ratio >= 70 ? "Cukup" : "Defisit"
												),
												/* @__PURE__ */ React.createElement("span", { className: "font-mono font-bold text-white text-[11px]" }, row.ratio, "%")
											),
											/* @__PURE__ */ React.createElement("div", { className: "w-full h-1.5 bg-slate-900 rounded-full overflow-hidden" },
												/* @__PURE__ */ React.createElement("div", {
													className: `h-full rounded-full ${barCls}`,
													style: { width: `${Math.min(100, row.ratio)}%` }
												})
											)
										)
									),
									/* Dokumen Google Drive & Rincian */
									/* @__PURE__ */ React.createElement("td", { className: "p-3.5 text-right" },
										/* @__PURE__ */ React.createElement("div", { className: "inline-flex items-center justify-end gap-1.5" },
											row.driveUrl && /* @__PURE__ */ React.createElement("a", {
												href: row.driveUrl,
												target: "_blank",
												rel: "noopener noreferrer",
												className: "inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-emerald-200 border border-emerald-700/60 text-[11px] font-semibold transition-colors",
												title: `Buka dokumen Google Drive resmi ${row.shortName}`
											},
												/* @__PURE__ */ React.createElement("span", null, "Drive"),
												/* @__PURE__ */ React.createElement(ExternalLink, { className: "w-3 h-3 text-emerald-400" })
											),
											/* @__PURE__ */ React.createElement("button", {
												onClick: () => handleFocusSatdikBuildings(isSelected && !lockedSatdik ? "ALL" : row.satdikId),
												className: `inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-colors ${isSelected ? "bg-cyan-600 text-white border-cyan-500" : "bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border-cyan-800"}`
											},
												/* @__PURE__ */ React.createElement("span", null, isSelected && !lockedSatdik ? "Semua" : `Gedung (${row.jumlahAsrama})`)
											)
										)
									)
								);
							})
						),
						/* Footer Total */
						/* @__PURE__ */ React.createElement("tfoot", null,
							/* @__PURE__ */ React.createElement("tr", { className: "bg-slate-900/90 border-t border-slate-700 font-bold text-white text-xs" },
								/* @__PURE__ */ React.createElement("td", { className: "p-3.5" }, "TOTAL (", totals.satdikCount, " Satdik)"),
								/* @__PURE__ */ React.createElement("td", { className: "p-3.5" }, fmtInt(totals.unit), " Unit • ", fmtInt(totals.kamar), " Kamar"),
								/* @__PURE__ */ React.createElement("td", { className: "p-3.5 font-mono" }, fmtDec(totals.luas), " m²"),
								/* @__PURE__ */ React.createElement("td", { className: "p-3.5" }, fmtInt(totals.kap), " / ", fmtInt(totals.taruna), " taruna"),
								/* @__PURE__ */ React.createElement("td", { className: "p-3.5 font-mono text-cyan-400" }, totals.ratio, "% (", totals.selisih >= 0 ? "+" : "", fmtInt(totals.selisih), ")"),
								/* @__PURE__ */ React.createElement("td", { className: "p-3.5 text-right text-[11px] text-slate-400 font-normal" }, "Standar 4 m²/orang")
							)
						)
					)
				),
				selectedSatdik === "ALL" && jenjangFilter === "ALL" && unsurveyedSatdik.length > 0 && /* @__PURE__ */ React.createElement("div", { className: "px-4 py-3 bg-slate-900/60 border-t border-slate-800 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2" },
					/* @__PURE__ */ React.createElement("span", null,
						"Catatan Cakupan: 2 dari 18 Satdik KKP belum tercantum pada lembar survei Excel saat ini: ",
						/* @__PURE__ */ React.createElement("strong", { className: "text-slate-200" }, unsurveyedSatdik.map((s) => `${s.shortName} (${s.tarunaCount} taruna)`).join(" & ")), "."
					),
					/* @__PURE__ */ React.createElement("span", { className: "text-cyan-400 font-medium" }, "KPI Inventaris Aset Utama tidak terpengaruh (Dataset Terpisah)")
				)
			),

			/* 6. TABEL DETAIL PER GEDUNG ASRAMA (104 GEDUNG + RINCIAN KAMAR/BARAK) */
			filteredSummary.length > 0 && /* @__PURE__ */ React.createElement("div", { ref: detailRef, className: "bg-slate-800/90 rounded-2xl border border-slate-700/70 shadow-lg overflow-hidden" },
				/* @__PURE__ */ React.createElement("div", { className: "p-4 sm:p-5 border-b border-slate-700/70 space-y-3" },
					/* @__PURE__ */ React.createElement("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-2" },
						/* @__PURE__ */ React.createElement("div", null,
							/* @__PURE__ */ React.createElement("h3", { className: "text-base font-bold text-white tracking-tight flex items-center gap-2" },
								/* @__PURE__ */ React.createElement(Bed, { className: "w-4 h-4 text-cyan-400" }),
								/* @__PURE__ */ React.createElement("span", null, "Tabel Detail per Gedung & Barak Asrama"),
								selectedSatdik !== "ALL" && satdikMap[selectedSatdik] && /* @__PURE__ */ React.createElement("span", { className: "px-2 py-0.5 rounded-full text-[11px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/30" }, satdikMap[selectedSatdik].shortName)
							),
							/* @__PURE__ */ React.createElement("p", { className: "text-xs text-slate-400 mt-0.5" }, "Klik baris gedung yang memiliki beberapa tipe ruang/lantai untuk melihat rincian ukuran masing-masing kamar atau barak.")
						),
						/* @__PURE__ */ React.createElement("span", { className: "text-xs text-slate-400" },
							"Menampilkan ", /* @__PURE__ */ React.createElement("strong", { className: "text-white" }, filteredBuildings.length), " dari ", statusCounts.total, " Gedung"
						)
					),

					/* Filter Gedung */
					/* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-2.5" },
						/* @__PURE__ */ React.createElement("div", { className: "lg:col-span-5 relative" },
							/* @__PURE__ */ React.createElement(Search, { className: "w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" }),
							/* @__PURE__ */ React.createElement("input", {
								type: "text",
								placeholder: "Cari nama gedung, barak, kampus cabang, keterangan...",
								value: buildingSearch,
								onChange: (e) => { setBuildingSearch(e.target.value); setCurrentPage(1); },
								className: "w-full pl-9 pr-4 py-2 bg-slate-900 text-slate-100 placeholder-slate-400 text-xs rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-500"
							})
						),
						/* @__PURE__ */ React.createElement("div", { className: "lg:col-span-4" },
							/* @__PURE__ */ React.createElement("select", {
								value: statusFilter,
								onChange: (e) => { setStatusFilter(e.target.value); setCurrentPage(1); },
								className: "w-full py-2 px-3 bg-slate-900 text-slate-200 text-xs rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-500"
							},
								/* @__PURE__ */ React.createElement("option", { value: "ALL" }, `Semua Status Gedung (${statusCounts.total})`),
								/* @__PURE__ */ React.createElement("option", { value: "Digunakan" }, `Digunakan Aktif (${statusCounts.digunakan})`),
								/* @__PURE__ */ React.createElement("option", { value: "Perlu Renovasi" }, `Perlu Renovasi (${statusCounts.renovasi})`),
								/* @__PURE__ */ React.createElement("option", { value: "Tidak Dipakai" }, `Sementara Kosong / Tidak Dipakai (${statusCounts.kosong})`)
							)
						),
						/* @__PURE__ */ React.createElement("div", { className: "lg:col-span-3" },
							/* @__PURE__ */ React.createElement("select", {
								value: genderFilter,
								onChange: (e) => { setGenderFilter(e.target.value); setCurrentPage(1); },
								className: "w-full py-2 px-3 bg-slate-900 text-slate-200 text-xs rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-500"
							},
								/* @__PURE__ */ React.createElement("option", { value: "ALL" }, "Semua Peruntukan"),
								/* @__PURE__ */ React.createElement("option", { value: "Putra" }, "Asrama Putra (Taruna)"),
								/* @__PURE__ */ React.createElement("option", { value: "Putri" }, "Asrama Putri (Taruni)"),
								/* @__PURE__ */ React.createElement("option", { value: "Tidak disebut" }, "Umum / Belum Disebut")
							)
						)
					)
				),

				/* Tabel Gedung */
				/* @__PURE__ */ React.createElement("div", { className: "overflow-x-auto" },
					/* @__PURE__ */ React.createElement("table", { className: "w-full text-left text-xs border-collapse" },
						/* @__PURE__ */ React.createElement("thead", null,
							/* @__PURE__ */ React.createElement("tr", { className: "bg-slate-900/90 text-slate-300 border-b border-slate-700/80 font-semibold uppercase tracking-wider text-[11px]" },
								/* @__PURE__ */ React.createElement("th", { onClick: () => toggleBuildingSort("nama"), className: "p-3.5 cursor-pointer hover:text-cyan-400 transition-colors" },
									/* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-1.5" }, /* @__PURE__ */ React.createElement("span", null, "Nama Gedung / Barak"), /* @__PURE__ */ React.createElement(ArrowUpDown, { className: "w-3.5 h-3.5 opacity-60" }))
								),
								/* @__PURE__ */ React.createElement("th", { onClick: () => toggleBuildingSort("satdikName"), className: "p-3.5 cursor-pointer hover:text-cyan-400 transition-colors" },
									/* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-1.5" }, /* @__PURE__ */ React.createElement("span", null, "Satuan Pendidikan"), /* @__PURE__ */ React.createElement(ArrowUpDown, { className: "w-3.5 h-3.5 opacity-60" }))
								),
								/* @__PURE__ */ React.createElement("th", { className: "p-3.5" }, "Peruntukan"),
								/* @__PURE__ */ React.createElement("th", { onClick: () => toggleBuildingSort("jumlahKamar"), className: "p-3.5 cursor-pointer hover:text-cyan-400 transition-colors" },
									/* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-1.5" }, /* @__PURE__ */ React.createElement("span", null, "Kamar & Ukuran"), /* @__PURE__ */ React.createElement(ArrowUpDown, { className: "w-3.5 h-3.5 opacity-60" }))
								),
								/* @__PURE__ */ React.createElement("th", { onClick: () => toggleBuildingSort("luasM2"), className: "p-3.5 cursor-pointer hover:text-cyan-400 transition-colors" },
									/* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-1.5" }, /* @__PURE__ */ React.createElement("span", null, "Luas (m²)"), /* @__PURE__ */ React.createElement(ArrowUpDown, { className: "w-3.5 h-3.5 opacity-60" }))
								),
								/* @__PURE__ */ React.createElement("th", { onClick: () => toggleBuildingSort("kapasitas"), className: "p-3.5 cursor-pointer hover:text-cyan-400 transition-colors" },
									/* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-1.5" }, /* @__PURE__ */ React.createElement("span", null, "Kapasitas"), /* @__PURE__ */ React.createElement(ArrowUpDown, { className: "w-3.5 h-3.5 opacity-60" }))
								),
								/* @__PURE__ */ React.createElement("th", { className: "p-3.5" }, "Status & Catatan"),
								/* @__PURE__ */ React.createElement("th", { className: "p-3.5 text-center w-28" }, "Aksi")
							)
						),
						/* @__PURE__ */ React.createElement("tbody", { className: "divide-y divide-slate-800" },
							paginatedBuildings.length > 0 ? paginatedBuildings.map((b) => {
								const sat = satdikMap[b.satdikId] || {};
								const hasSubRows = Array.isArray(b.rincian) && b.rincian.length > 1;
								const isExpanded = expandedBuildingId === b.id;
								const singleDim = Array.isArray(b.rincian) && b.rincian.length === 1 ? b.rincian[0].ukuran : null;
								const statusCls = b.status === "Digunakan"
									? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
									: b.status === "Perlu Renovasi"
										? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
										: "bg-rose-500/15 text-rose-400 border border-rose-500/30";

								return /* @__PURE__ */ React.createElement(React.Fragment, { key: b.id },
									/* @__PURE__ */ React.createElement("tr", {
										onClick: () => hasSubRows && setExpandedBuildingId(isExpanded ? null : b.id),
										className: `hover:bg-slate-700/40 transition-colors ${hasSubRows ? "cursor-pointer" : ""}`
									},
										/* Nama Gedung */
										/* @__PURE__ */ React.createElement("td", { className: "p-3.5" },
											/* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2.5" },
												/* @__PURE__ */ React.createElement("div", { className: "w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center flex-shrink-0" },
													/* @__PURE__ */ React.createElement(Bed, { className: "w-4 h-4" })
												),
												/* @__PURE__ */ React.createElement("div", null,
													/* @__PURE__ */ React.createElement("div", { className: "font-bold text-white flex flex-wrap items-center gap-1.5" },
														/* @__PURE__ */ React.createElement("span", null, b.nama),
														b.kampus && /* @__PURE__ */ React.createElement("span", { className: "px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-900 border border-slate-700 text-cyan-300" }, b.kampus)
													),
													/* @__PURE__ */ React.createElement("span", { className: "text-[10px] font-mono text-slate-400" }, b.id)
												)
											)
										),
										/* Satdik */
										/* @__PURE__ */ React.createElement("td", { className: "p-3.5 text-slate-300 font-medium" }, sat.shortName || b.satdikId),
										/* Peruntukan */
										/* @__PURE__ */ React.createElement("td", { className: "p-3.5" },
											/* @__PURE__ */ React.createElement("span", {
												className: `px-2 py-0.5 rounded text-[10px] font-semibold ${b.peruntukan === "Putra" ? "bg-sky-500/15 text-sky-400 border border-sky-500/30" : b.peruntukan === "Putri" ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30" : "bg-slate-900 text-slate-400 border border-slate-700"}`
											}, b.peruntukan === "Tidak disebut" ? "Umum" : b.peruntukan)
										),
										/* Kamar & Ukuran */
										/* @__PURE__ */ React.createElement("td", { className: "p-3.5" },
											/* @__PURE__ */ React.createElement("div", { className: "font-semibold text-slate-200" }, fmtInt(b.jumlahKamar), " ruang"),
											/* @__PURE__ */ React.createElement("div", { className: "text-[11px] text-slate-400" },
												singleDim || (hasSubRows ? `${b.rincian.length} tipe/lantai ${isExpanded ? "(tutup ▲)" : "(rincian ▼)"}` : "-")
											)
										),
										/* Luas */
										/* @__PURE__ */ React.createElement("td", { className: "p-3.5 font-mono text-slate-200" }, fmtDec(b.luasM2), " m²"),
										/* Kapasitas */
										/* @__PURE__ */ React.createElement("td", { className: "p-3.5" },
											/* @__PURE__ */ React.createElement("span", { className: "font-bold text-emerald-400" }, fmtInt(b.kapasitas)),
											/* @__PURE__ */ React.createElement("span", { className: "text-slate-400 text-[11px]" }, " orang")
										),
										/* Status */
										/* @__PURE__ */ React.createElement("td", { className: "p-3.5" },
											/* @__PURE__ */ React.createElement("span", { className: `inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${statusCls}` }, b.status),
											b.keterangan && /* @__PURE__ */ React.createElement("div", { className: "text-[10px] text-slate-400 mt-1" }, b.keterangan)
										),
										/* Aksi */
										/* @__PURE__ */ React.createElement("td", { className: "p-3.5 text-center whitespace-nowrap", onClick: (e) => e.stopPropagation() },
											/* @__PURE__ */ React.createElement("div", { className: "inline-flex items-center gap-1" },
												onUpdateBuilding && /* @__PURE__ */ React.createElement("button", {
													onClick: (e) => { e.stopPropagation(); setSelectedBuildingForEdit(b); setIsBuildingModalOpen(true); },
													className: "p-1.5 rounded-lg bg-slate-900/80 hover:bg-cyan-600 text-slate-300 hover:text-white border border-slate-700 hover:border-cyan-500 transition-colors",
													title: "Edit Gedung Asrama"
												}, /* @__PURE__ */ React.createElement(Edit3, { className: "w-3.5 h-3.5" })),
												onDeleteBuilding && /* @__PURE__ */ React.createElement("button", {
													onClick: (e) => { e.stopPropagation(); setDeletingBuilding(b); },
													className: "p-1.5 rounded-lg bg-slate-900/80 hover:bg-rose-600 text-rose-400 hover:text-white border border-slate-700 hover:border-rose-500 transition-colors",
													title: "Hapus Gedung Asrama"
												}, /* @__PURE__ */ React.createElement(X, { className: "w-3.5 h-3.5" }))
											)
										)
									),
									hasSubRows && isExpanded && /* @__PURE__ */ React.createElement("tr", { className: "bg-slate-900/70" },
										/* @__PURE__ */ React.createElement("td", { colSpan: "8", className: "p-4" },
											/* @__PURE__ */ React.createElement("div", { className: "text-[11px] font-semibold text-cyan-400 mb-2" }, "Rincian Sub-Ruang / Barak pada ", b.nama, ":"),
											/* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2" },
												b.rincian.map((rc, idx) => /* @__PURE__ */ React.createElement("div", {
													key: idx,
													className: "bg-slate-800/90 p-2.5 rounded-xl border border-slate-700/70 flex items-center justify-between text-xs"
												},
													/* @__PURE__ */ React.createElement("div", null,
														/* @__PURE__ */ React.createElement("div", { className: "font-semibold text-white" }, rc.label || `Tipe Ruang ${idx + 1}`),
														/* @__PURE__ */ React.createElement("div", { className: "text-[11px] text-slate-400 font-mono" }, "Ukuran: ", rc.ukuran || "-", " • ", rc.jumlah, " ruang")
													),
													/* @__PURE__ */ React.createElement("div", { className: "text-right" },
														/* @__PURE__ */ React.createElement("div", { className: "font-bold text-emerald-400" }, rc.kapasitas > 0 ? `${fmtDec(rc.kapasitas)} org` : "Gabungan"),
														rc.luasM2 > 0 && /* @__PURE__ */ React.createElement("div", { className: "text-[10px] text-slate-400 font-mono" }, fmtDec(rc.luasM2), " m²")
													)
												))
											)
										)
									)
								);
							}) : /* @__PURE__ */ React.createElement("tr", null,
								/* @__PURE__ */ React.createElement("td", { colSpan: "8", className: "p-8 text-center text-slate-400" }, "Tidak ada gedung asrama yang sesuai dengan kriteria pencarian/filter.")
							)
						)
					)
				),

				/* Pagination Gedung */
				totalPages > 1 && /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between bg-slate-900/60 px-4 py-3 border-t border-slate-800 text-xs text-slate-300" },
					/* @__PURE__ */ React.createElement("div", null, "Halaman ", /* @__PURE__ */ React.createElement("span", { className: "font-bold text-white" }, currentPage), " dari ", totalPages),
					/* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-1.5" },
						/* @__PURE__ */ React.createElement("button", {
							onClick: () => setCurrentPage((p) => Math.max(1, p - 1)),
							disabled: currentPage === 1,
							className: "p-1.5 rounded-lg bg-slate-900 hover:bg-slate-700 disabled:opacity-30 text-slate-200 transition-colors"
						}, /* @__PURE__ */ React.createElement(ChevronLeft, { className: "w-4 h-4" })),
						Array.from({ length: totalPages }).map((_, i) => /* @__PURE__ */ React.createElement("button", {
							key: i + 1,
							onClick: () => setCurrentPage(i + 1),
							className: `w-7 h-7 rounded-lg text-xs font-semibold transition-colors ${currentPage === i + 1 ? "bg-cyan-600 text-white" : "bg-slate-900 text-slate-400 hover:text-white"}`
						}, i + 1)),
						/* @__PURE__ */ React.createElement("button", {
							onClick: () => setCurrentPage((p) => Math.min(totalPages, p + 1)),
							disabled: currentPage === totalPages,
							className: "p-1.5 rounded-lg bg-slate-900 hover:bg-slate-700 disabled:opacity-30 text-slate-200 transition-colors"
						}, /* @__PURE__ */ React.createElement(ChevronRight, { className: "w-4 h-4" }))
					)
				)
			),

			/* MODAL FORMULIR TAMBAH / EDIT GEDUNG ASRAMA */
			isBuildingModalOpen && /* @__PURE__ */ React.createElement(AsramaBuildingModal, {
				isOpen: isBuildingModalOpen,
				initialData: selectedBuildingForEdit,
				satdikList,
				lockedSatdik,
				onClose: () => { setIsBuildingModalOpen(false); setSelectedBuildingForEdit(null); },
				onSave: async (formPayload) => {
					setIsSubmitting(true);
					try {
						if (selectedBuildingForEdit) {
							await onUpdateBuilding(selectedBuildingForEdit.id, formPayload);
						} else {
							await onAddBuilding(formPayload);
						}
						setIsBuildingModalOpen(false);
						setSelectedBuildingForEdit(null);
					} catch (err) {
						alert("Gagal menyimpan data gedung: " + (err.message || err));
					} finally {
						setIsSubmitting(false);
					}
				}
			}),

			/* MODAL KONFIRMASI HAPUS GEDUNG */
			deletingBuilding && /* @__PURE__ */ React.createElement("div", {
				className: "fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
			},
				/* @__PURE__ */ React.createElement("div", {
					className: "bg-slate-800 rounded-2xl border border-slate-700 p-6 max-w-md w-full shadow-2xl space-y-4"
				},
					/* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3 text-rose-400" },
						/* @__PURE__ */ React.createElement("div", { className: "w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center flex-shrink-0" },
							/* @__PURE__ */ React.createElement(AlertTriangle, { className: "w-5 h-5 text-rose-400" })
						),
						/* @__PURE__ */ React.createElement("div", null,
							/* @__PURE__ */ React.createElement("h3", { className: "font-bold text-white text-base" }, "Hapus Gedung Asrama?"),
							/* @__PURE__ */ React.createElement("p", { className: "text-xs text-slate-400 mt-0.5" }, "Konfirmasi penghapusan data gedung fisik")
						)
					),
					/* @__PURE__ */ React.createElement("p", { className: "text-xs text-slate-300 leading-relaxed" },
						"Apakah Anda yakin ingin menghapus gedung ", /* @__PURE__ */ React.createElement("strong", { className: "text-white" }, deletingBuilding.nama),
						" pada ", /* @__PURE__ */ React.createElement("strong", { className: "text-cyan-300" }, satdikMap[deletingBuilding.satdikId]?.shortName || deletingBuilding.satdikId), "?",
						" Rekapitulasi kapasitas dan ketersediaan kamar Satdik akan dihitung ulang secara otomatis."
					),
					/* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-end gap-2 pt-2" },
						/* @__PURE__ */ React.createElement("button", {
							onClick: () => setDeletingBuilding(null),
							disabled: isSubmitting,
							className: "px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold transition-colors"
						}, "Batal"),
						/* @__PURE__ */ React.createElement("button", {
							onClick: async () => {
								setIsSubmitting(true);
								try {
									await onDeleteBuilding(deletingBuilding.id);
									setDeletingBuilding(null);
								} catch (err) {
									alert("Gagal menghapus: " + (err.message || err));
								} finally {
									setIsSubmitting(false);
								}
							},
							disabled: isSubmitting,
							className: "px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors shadow-md shadow-rose-950/40"
						}, isSubmitting ? "Menghapus..." : "Ya, Hapus Gedung")
					)
				)
			)
		);
	};
})();
const AsramaCapacityView = window.__AsramaCapacityView;
// ============================================================================
// MODULE: src/components/StandarProdiView.jsx
// ============================================================================
(() => {
	const { useState, useMemo, useRef, useEffect } = React;
	const {
		GraduationCap, Building2, Wrench, Boxes, Layers, Search, Filter, Download, PlusCircle,
		RotateCcw, ArrowUpDown, ChevronLeft, ChevronRight, CheckCircle2, AlertTriangle, Info, BadgeCheck,
		Edit3, X, Save, Check
	} = window.__VENDOR__.Lucide;
	const { Bar } = window.__VENDOR__.ReactChartJS2;
	const logoKkp = window.__LOGO_KKP || "Frontend/assets/logo-kkp.png";

	function fmtInt(n) {
		return Math.round(Number(n) || 0).toLocaleString("id-ID");
	}
	function fmtPct(n) {
		return (Math.round((Number(n) || 0) * 10) / 10).toFixed(1);
	}

	window.__StandarProdiView = function StandarProdiView({ standarData, satdikList, currentUser, onAddItem, onUpdateItem, onDeleteItem, onOpenAddModal }) {
		const { isDark } = useTheme();
		const catalogRef = useRef(null);

		const lockedSatdik = currentUser?.accessibleSatdik && currentUser.accessibleSatdik !== "ALL"
			? currentUser.accessibleSatdik
			: null;

		const rawBidang = standarData?.bidang || [];
		const rawRekap = standarData?.rekap || [];
		const rawItems = standarData?.items || [];

		const satdikMap = useMemo(() => {
			const m = {};
			(satdikList || []).forEach((s) => { m[s.id] = s; });
			return m;
		}, [satdikList]);

		const bidangMap = useMemo(() => {
			const m = {};
			rawBidang.forEach((b) => { m[b.id] = b; });
			return m;
		}, [rawBidang]);

		const surveyedSatdikIds = useMemo(() => {
			const ids = new Set();
			rawRekap.forEach((r) => ids.add(r.satdikId));
			return ids;
		}, [rawRekap]);

		const surveyedSatdikList = useMemo(() => {
			return (satdikList || []).filter((s) => surveyedSatdikIds.has(s.id));
		}, [satdikList, surveyedSatdikIds]);

		const unsurveyedSatdikList = useMemo(() => {
			return (satdikList || []).filter((s) => !surveyedSatdikIds.has(s.id));
		}, [satdikList, surveyedSatdikIds]);

		const [selectedBidang, setSelectedBidang] = useState("ALL");
		const [selectedSatdik, setSelectedSatdik] = useState(() => lockedSatdik || "ALL");
		const [chartAxis, setChartAxis] = useState("bidang"); // "bidang" | "satdik"
		const [rekapSortField, setRekapSortField] = useState("persenTotal");
		const [rekapSortDir, setRekapSortDir] = useState("desc");

		// Katalog & Matriks rincian item standar
		const [catalogBidang, setCatalogBidang] = useState("penangkapan_ikan");
		const [secFilter, setSecFilter] = useState("ALL"); // "ALL" | "A" | "B"
		const [gapFilter, setGapFilter] = useState("ALL"); // "ALL" | "KOSONG" | "KURANG" | "TERPENUHI"
		const [viewMode, setViewMode] = useState("GROUP"); // "GROUP" | "FLAT"
		const [itemSearch, setItemSearch] = useState("");
		const [expandedGroups, setExpandedGroups] = useState({});
		const [currentPage, setCurrentPage] = useState(1);
		const itemsPerPage = 25;

		// State Modal Edit / Tambah Item Standar Sarpras
		const [editingItem, setEditingItem] = useState(null);
		const [isSaving, setIsSaving] = useState(false);

		const canEdit = !currentUser || currentUser?.permissions?.includes("edit_all") || currentUser?.permissions?.includes("edit_own");
		const canDelete = !currentUser || currentUser?.permissions?.includes("delete") || currentUser?.permissions?.includes("edit_all");

		// Pastikan bidang katalog valid saat operator kampus login
		const availableBidang = useMemo(() => {
			if (selectedSatdik !== "ALL" && surveyedSatdikIds.has(selectedSatdik)) {
				return rawBidang.filter((b) => Array.isArray(b.satdikIds) && b.satdikIds.includes(selectedSatdik));
			}
			return rawBidang;
		}, [rawBidang, selectedSatdik, surveyedSatdikIds]);

		useEffect(() => {
			if (lockedSatdik) setSelectedSatdik(lockedSatdik);
		}, [lockedSatdik]);

		useEffect(() => {
			if (selectedBidang !== "ALL") {
				setCatalogBidang(selectedBidang);
				setChartAxis("satdik");
			} else if (availableBidang.length > 0 && catalogBidang !== "ALL" && !availableBidang.some((b) => b.id === catalogBidang)) {
				setCatalogBidang(availableBidang[0].id);
			}
		}, [selectedBidang, availableBidang]);

		const selectedUnsurveyed = unsurveyedSatdikList.find((s) => s.id === selectedSatdik);

		// Rekap yang difilter & disortir
		const filteredRekap = useMemo(() => {
			return rawRekap
				.filter((r) => {
					if (selectedBidang !== "ALL" && r.bidangId !== selectedBidang) return false;
					if (selectedSatdik !== "ALL" && r.satdikId !== selectedSatdik) return false;
					return true;
				})
				.map((r) => {
					const b = bidangMap[r.bidangId] || {};
					const s = satdikMap[r.satdikId] || {};
					return {
						...r,
						bidangNama: b.nama || r.bidangId,
						prodiLabel: Array.isArray(b.prodi) ? b.prodi.join(", ") : "",
						satdikShort: s.shortName || s.name || r.satdikId,
						satdikKota: s.kota ? `${s.kota}, ${s.provinsi}` : (s.name || ""),
						defisitCount: (Number(r.totalSebagian) || 0) + (Number(r.totalKosong) || 0)
					};
				})
				.sort((a, b) => {
					let va = a[rekapSortField];
					let vb = b[rekapSortField];
					if (typeof va === "string") {
						va = va.toLowerCase();
						vb = String(vb || "").toLowerCase();
					}
					if (va < vb) return rekapSortDir === "asc" ? -1 : 1;
					if (va > vb) return rekapSortDir === "asc" ? 1 : -1;
					return 0;
				});
		}, [rawRekap, selectedBidang, selectedSatdik, bidangMap, satdikMap, rekapSortField, rekapSortDir]);

		// KPI Agregat
		const kpiSummary = useMemo(() => {
			const scopedBidang = selectedBidang !== "ALL"
				? availableBidang.filter((b) => b.id === selectedBidang)
				: availableBidang;
			const stdItemsCount = scopedBidang.reduce((acc, b) => acc + (Number(b.totalItems) || 0), 0);
			const stdPrasaranaCount = scopedBidang.reduce((acc, b) => acc + (Number(b.prasaranaCount) || 0), 0);
			const stdSaranaCount = scopedBidang.reduce((acc, b) => acc + (Number(b.saranaCount) || 0), 0);

			let pTot = 0, pFull = 0, pPart = 0, pZero = 0, pWeighted = 0;
			let sTot = 0, sFull = 0, sPart = 0, sZero = 0, sWeighted = 0;
			const satdikSet = new Set();

			filteredRekap.forEach((r) => {
				satdikSet.add(r.satdikId);
				const pt = Number(r.prasaranaTotal) || 0;
				const st = Number(r.saranaTotal) || 0;
				pTot += pt;
				pFull += Number(r.prasaranaTerpenuhi) || 0;
				pPart += Number(r.prasaranaSebagian) || 0;
				pZero += Number(r.prasaranaKosong) || 0;
				pWeighted += ((Number(r.persenPrasarana) || 0) / 100) * pt;

				sTot += st;
				sFull += Number(r.saranaTerpenuhi) || 0;
				sPart += Number(r.saranaSebagian) || 0;
				sZero += Number(r.saranaKosong) || 0;
				sWeighted += ((Number(r.persenSarana) || 0) / 100) * st;
			});

			const allTot = pTot + sTot;
			const pctPrasarana = pTot > 0 ? Math.round((pWeighted / pTot) * 1000) / 10 : 0;
			const pctSarana = sTot > 0 ? Math.round((sWeighted / sTot) * 1000) / 10 : 0;
			const pctTotal = allTot > 0 ? Math.round(((pWeighted + sWeighted) / allTot) * 1000) / 10 : 0;

			return {
				bidangCount: scopedBidang.length,
				satdikCount: satdikSet.size,
				stdItemsCount,
				stdPrasaranaCount,
				stdSaranaCount,
				pTot, pFull, pPart, pZero, pctPrasarana,
				sTot, sFull, sPart, sZero, pctSarana,
				allTot,
				allFull: pFull + sFull,
				allPart: pPart + sPart,
				allZero: pZero + sZero,
				pctTotal
			};
		}, [availableBidang, selectedBidang, filteredRekap]);

		// Data Grafik Perbandingan Prasarana vs Sarana
		const textColor = isDark ? "#cbd5e1" : "#090d16";
		const textMuted = isDark ? "#94a3b8" : "#1e293b";
		const gridColor = isDark ? "rgba(51, 65, 85, 0.4)" : "#cbd5e1";

		const chartPayload = useMemo(() => {
			const groupMap = {};
			filteredRekap.forEach((r) => {
				const key = chartAxis === "satdik" ? r.satdikId : r.bidangId;
				const label = chartAxis === "satdik"
					? (r.satdikShort.replace("Politeknik KP ", "PKP ").replace("Politeknik ", ""))
					: r.bidangNama;
				if (!groupMap[key]) {
					groupMap[key] = { key, label, pTot: 0, pW: 0, sTot: 0, sW: 0 };
				}
				const pt = Number(r.prasaranaTotal) || 0;
				const st = Number(r.saranaTotal) || 0;
				groupMap[key].pTot += pt;
				groupMap[key].pW += ((Number(r.persenPrasarana) || 0) / 100) * pt;
				groupMap[key].sTot += st;
				groupMap[key].sW += ((Number(r.persenSarana) || 0) / 100) * st;
			});
			const rows = Object.values(groupMap).map((g) => {
				const pPct = g.pTot > 0 ? Math.round((g.pW / g.pTot) * 1000) / 10 : 0;
				const sPct = g.sTot > 0 ? Math.round((g.sW / g.sTot) * 1000) / 10 : 0;
				const avg = (g.pTot + g.sTot) > 0 ? ((g.pW + g.sW) / (g.pTot + g.sTot)) * 100 : 0;
				return { ...g, pPct, sPct, avg };
			}).sort((a, b) => b.avg - a.avg);

			return {
				labels: rows.map((r) => r.label),
				datasets: [
					{
						label: "Kesiapan Prasarana Lab/Workshop (%)",
						data: rows.map((r) => r.pPct),
						backgroundColor: "rgba(14, 165, 233, 0.85)",
						borderColor: "#0284c7",
						borderWidth: 1,
						borderRadius: 5
					},
					{
						label: "Kesiapan Sarana Alat/Perabot (%)",
						data: rows.map((r) => r.sPct),
						backgroundColor: "rgba(16, 185, 129, 0.82)",
						borderColor: "#059669",
						borderWidth: 1,
						borderRadius: 5
					}
				]
			};
		}, [filteredRekap, chartAxis]);

		const barOptions = {
			responsive: true,
			maintainAspectRatio: false,
			plugins: {
				legend: {
					position: "top",
					labels: { color: textColor, font: { size: 11, weight: "600" }, boxWidth: 12 }
				}
			},
			scales: {
				x: {
					ticks: { color: textColor, font: { size: 10, weight: "600" }, maxRotation: 35, minRotation: 0 },
					grid: { display: false }
				},
				y: {
					beginAtZero: true,
					max: 100,
					ticks: {
						color: textMuted,
						font: { size: 10 },
						callback: (val) => `${val}%`
					},
					grid: { color: gridColor }
				}
			}
		};

		// Kampus kolom aktif untuk tabel matriks katalog
		const activeCatalogBidangObj = catalogBidang !== "ALL" ? bidangMap[catalogBidang] : null;
		const matrixSatdikIds = useMemo(() => {
			if (selectedSatdik !== "ALL" && surveyedSatdikIds.has(selectedSatdik)) {
				return [selectedSatdik];
			}
			if (activeCatalogBidangObj && Array.isArray(activeCatalogBidangObj.satdikIds)) {
				return activeCatalogBidangObj.satdikIds;
			}
			return Array.from(surveyedSatdikIds);
		}, [selectedSatdik, surveyedSatdikIds, activeCatalogBidangObj]);

		// Filter katalog item standar
		const filteredItems = useMemo(() => {
			const q = itemSearch.trim().toLowerCase();
			return rawItems.filter((it) => {
				if (catalogBidang !== "ALL" && it.bidangId !== catalogBidang) return false;
				if (selectedSatdik !== "ALL" && surveyedSatdikIds.has(selectedSatdik)) {
					if (!it.real || it.real[selectedSatdik] === undefined) return false;
				}
				if (secFilter !== "ALL" && it.sec !== secFilter) return false;

				if (gapFilter !== "ALL") {
					const targetSids = (selectedSatdik !== "ALL" && surveyedSatdikIds.has(selectedSatdik))
						? [selectedSatdik]
						: Object.keys(it.real || {});
					const sv = Number(it.stdVol) || 1;
					const matchGap = targetSids.some((sid) => {
						const rv = Number(it.real?.[sid]) || 0;
						if (gapFilter === "KOSONG") return rv === 0;
						if (gapFilter === "KURANG") return rv > 0 && rv < sv;
						if (gapFilter === "TERPENUHI") return rv >= sv;
						return true;
					});
					if (!matchGap) return false;
				}

				if (q) {
					const bNama = bidangMap[it.bidangId]?.nama || "";
					const hay = [
						it.id,
						bNama,
						it.grpCode || "",
						it.grpName || "",
						it.subGrp || "",
						it.nama || "",
						it.ket || "",
						it.kondisi || ""
					].join(" ").toLowerCase();
					if (!hay.includes(q)) return false;
				}
				return true;
			});
		}, [rawItems, catalogBidang, selectedSatdik, surveyedSatdikIds, secFilter, gapFilter, itemSearch, bidangMap]);

		// Pengelompokan item per Grup Fasilitas/Laboratorium (Accordion)
		const groupedCatalog = useMemo(() => {
			const groups = [];
			const gMap = {};
			filteredItems.forEach((it) => {
				const key = `${it.bidangId}::${it.sec}::${it.grpCode}::${it.grpName}`;
				if (!gMap[key]) {
					const bObj = bidangMap[it.bidangId] || {};
					const gNote = bObj.groupNotes?.[it.grpCode] || "";
					gMap[key] = {
						key,
						bidangId: it.bidangId,
						bidangNama: bObj.nama || it.bidangId,
						sec: it.sec,
						grpCode: it.grpCode,
						grpName: it.grpName,
						groupNote: gNote,
						items: [],
						fullCells: 0,
						partCells: 0,
						zeroCells: 0,
						totalCells: 0
					};
					groups.push(gMap[key]);
				}
				const g = gMap[key];
				g.items.push(it);
				const sv = Number(it.stdVol) || 1;
				matrixSatdikIds.forEach((sid) => {
					if (it.real && it.real[sid] !== undefined) {
						const rv = Number(it.real[sid]) || 0;
						g.totalCells += 1;
						if (rv >= sv) g.fullCells += 1;
						else if (rv > 0) g.partCells += 1;
						else g.zeroCells += 1;
					}
				});
			});
			return groups;
		}, [filteredItems, matrixSatdikIds, bidangMap]);

		// Buka otomatis 2 grup pertama saat berpindah bidang
		useEffect(() => {
			const init = {};
			groupedCatalog.slice(0, 2).forEach((g) => { init[g.key] = true; });
			setExpandedGroups(init);
			setCurrentPage(1);
		}, [catalogBidang, selectedSatdik, secFilter, gapFilter]);

		const totalPages = Math.ceil(filteredItems.length / itemsPerPage) || 1;
		const paginatedFlatItems = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

		const toggleRekapSort = (field) => {
			if (rekapSortField === field) {
				setRekapSortDir((d) => (d === "asc" ? "desc" : "asc"));
			} else {
				setRekapSortField(field);
				setRekapSortDir(field === "bidangNama" || field === "satdikShort" ? "asc" : "desc");
			}
		};

		const handleFocusRekapRow = (rk) => {
			setCatalogBidang(rk.bidangId);
			if (!lockedSatdik) {
				setSelectedSatdik(rk.satdikId);
			}
			setCurrentPage(1);
			setTimeout(() => {
				if (catalogRef.current) {
					catalogRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
				}
			}, 60);
		};

		const handleResetAll = () => {
			setSelectedBidang("ALL");
			setSelectedSatdik(lockedSatdik || "ALL");
			setChartAxis("bidang");
			setCatalogBidang(availableBidang[0]?.id || "penangkapan_ikan");
			setSecFilter("ALL");
			setGapFilter("ALL");
			setItemSearch("");
			setViewMode("GROUP");
			setCurrentPage(1);
		};

		const toggleGroupExpand = (gKey) => {
			setExpandedGroups((prev) => ({ ...prev, [gKey]: !prev[gKey] }));
		};

		const expandOrCollapseAll = (openAll) => {
			if (!openAll) {
				setExpandedGroups({});
				return;
			}
			const next = {};
			groupedCatalog.slice(0, 30).forEach((g) => { next[g.key] = true; });
			setExpandedGroups(next);
		};

		const scopeLabel = [
			selectedBidang === "ALL" ? "12 Rumpun Prodi" : (bidangMap[selectedBidang]?.nama || selectedBidang),
			selectedSatdik === "ALL" ? "11 Satdik Pendidikan Tinggi" : (satdikMap[selectedSatdik]?.shortName || selectedSatdik)
		].join(" • ");

		// CRUD Actions: Buka Modal Edit & Simpan
		const openEditItemModal = (item, focusSatdikId = null) => {
			setEditingItem({
				id: item.id,
				bidangId: item.bidangId,
				sec: item.sec || "A",
				subSec: item.subSec || item.sec || "A",
				grpCode: item.grpCode || "",
				grpName: item.grpName || "",
				subGrp: item.subGrp || "",
				no: item.no || "",
				nama: item.nama || "",
				stdVol: item.stdVol ?? 1,
				satuan: item.satuan || "Unit",
				kondisi: item.kondisi || "Baik",
				ket: item.ket || "",
				real: { ...(item.real || {}) },
				_focusSatdikId: focusSatdikId,
				_isNew: false
			});
		};

		const openAddItemModal = () => {
			const curBidang = catalogBidang !== "ALL" ? catalogBidang : (availableBidang[0]?.id || "penangkapan_ikan");
			const bObj = bidangMap[curBidang] || {};
			const initialReal = {};
			(bObj.satdikIds || []).forEach((sid) => {
				initialReal[sid] = 0;
			});
			setEditingItem({
				id: "",
				bidangId: curBidang,
				sec: secFilter !== "ALL" ? secFilter : "A",
				subSec: secFilter !== "ALL" ? secFilter : "A",
				grpCode: "A.1",
				grpName: "FASILITAS STANDAR",
				subGrp: "",
				no: "",
				nama: "",
				stdVol: 1,
				satuan: "Unit",
				kondisi: "Baik",
				ket: "",
				real: initialReal,
				_focusSatdikId: null,
				_isNew: true
			});
		};

		const handleSaveItem = async (e) => {
			e.preventDefault();
			if (!editingItem?.nama?.trim()) {
				alert("Nama jenis prasarana / sarana standar wajib diisi.");
				return;
			}
			setIsSaving(true);
			try {
				const payload = {
					...editingItem,
					nama: editingItem.nama.trim(),
					stdVol: Number(editingItem.stdVol) || 0,
					sec: editingItem.sec || "A",
					subSec: editingItem.subSec || editingItem.sec || "A",
					grpCode: editingItem.grpCode || "-",
					grpName: editingItem.grpName || "-",
					subGrp: editingItem.subGrp || "",
					no: editingItem.no || "",
					satuan: editingItem.satuan || "Unit",
					kondisi: editingItem.kondisi || "",
					ket: editingItem.ket || "",
					real: editingItem.real || {}
				};
				if (editingItem._isNew && onAddItem) {
					await onAddItem(payload);
				} else if (onUpdateItem) {
					await onUpdateItem(editingItem.id, payload);
				}
				setEditingItem(null);
			} catch (err) {
				alert("Gagal menyimpan perubahan item standar: " + (err?.message || "Kesalahan jaringan"));
			} finally {
				setIsSaving(false);
			}
		};

		const handleDeleteClick = async (it) => {
			if (!window.confirm(`Hapus item standar "${it.nama}" (${it.id})?\nData realisasi pada semua kampus terkait juga akan dihapus dan rekapitulasi akan dihitung ulang.`)) {
				return;
			}
			try {
				if (onDeleteItem) {
					await onDeleteItem(it.id);
				}
			} catch (err) {
				alert("Gagal menghapus item standar: " + (err?.message || "Kesalahan jaringan"));
			}
		};

		// Helper render tabel matriks untuk sekumpulan item
		const renderMatrixTable = (itemsSubset, showBidangCol) => {
			return /* @__PURE__ */ React.createElement("div", { className: "overflow-x-auto" },
				/* @__PURE__ */ React.createElement("table", { className: "w-full text-left text-xs border-collapse" },
					/* @__PURE__ */ React.createElement("thead", null,
						/* @__PURE__ */ React.createElement("tr", { className: "bg-slate-900/90 text-slate-300 border-b border-slate-700/80 font-semibold uppercase tracking-wider text-[10px]" },
							/* @__PURE__ */ React.createElement("th", { className: "p-3 w-16" }, "Kode"),
							showBidangCol && /* @__PURE__ */ React.createElement("th", { className: "p-3" }, "Rumpun Prodi"),
							/* @__PURE__ */ React.createElement("th", { className: "p-3 min-w-[220px]" }, "Jenis Prasarana / Sarana Standar"),
							/* @__PURE__ */ React.createElement("th", { className: "p-3 text-center whitespace-nowrap" }, "Standar Minimal"),
							matrixSatdikIds.map((sid) => {
								const sat = satdikMap[sid];
								const shortLabel = sat?.shortName
									? sat.shortName.replace("Politeknik KP ", "PKP ").replace("Politeknik ", "")
									: sid;
								return /* @__PURE__ */ React.createElement("th", {
									key: sid,
									className: "p-2.5 text-center whitespace-nowrap",
									title: sat?.name || sid
								}, shortLabel);
							}),
							/* @__PURE__ */ React.createElement("th", { className: "p-3 min-w-[180px]" }, "Kondisi / Catatan Audit"),
							/* @__PURE__ */ React.createElement("th", { className: "p-3 text-center whitespace-nowrap w-20" }, "Aksi")
						)
					),
					/* @__PURE__ */ React.createElement("tbody", { className: "divide-y divide-slate-800" },
						itemsSubset.map((it) => {
							const sv = Number(it.stdVol) || 1;
							const secBadge = it.sec === "A"
								? "bg-sky-500/15 text-sky-400 border border-sky-500/30"
								: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30";
							const kondisiMap = {
								B: { label: "Kondisi: Baik (B)", cls: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30" },
								RR: { label: "Rusak Ringan (RR)", cls: "bg-amber-500/20 text-amber-300 border border-amber-500/30" },
								RB: { label: "Rusak Berat (RB)", cls: "bg-rose-500/15 text-rose-400 border border-rose-500/30" }
							};
							const kondInfo = it.kondisi ? kondisiMap[it.kondisi] : null;

							return /* @__PURE__ */ React.createElement("tr", { key: it.id, className: "hover:bg-slate-700/40 transition-colors" },
								/* Kode */
								/* @__PURE__ */ React.createElement("td", { className: "p-3 font-mono text-[10px] text-slate-400 whitespace-nowrap" },
									/* @__PURE__ */ React.createElement("span", { className: `inline-block px-1.5 py-0.5 rounded font-bold mr-1 ${secBadge}` }, it.sec),
									it.no || "-"
								),
								/* Rumpun bila mode lintas bidang */
								showBidangCol && /* @__PURE__ */ React.createElement("td", { className: "p-3 text-[11px] font-semibold text-cyan-400 whitespace-nowrap" },
									bidangMap[it.bidangId]?.nama || it.bidangId
								),
								/* Nama Item + Konteks Sub-ruang */
								/* @__PURE__ */ React.createElement("td", { className: "p-3" },
									/* @__PURE__ */ React.createElement("div", { className: "font-semibold text-white leading-snug" }, it.nama),
									/* @__PURE__ */ React.createElement("div", { className: "text-[10px] text-slate-400 mt-0.5" },
										showBidangCol && /* @__PURE__ */ React.createElement("span", { className: "font-mono text-slate-300" }, it.grpCode, " ", it.grpName, it.subGrp ? " • " : ""),
										it.subGrp && /* @__PURE__ */ React.createElement("span", null, it.subGrp)
									)
								),
								/* Standar Minimal */
								/* @__PURE__ */ React.createElement("td", { className: "p-3 text-center whitespace-nowrap" },
									/* @__PURE__ */ React.createElement("span", { className: "font-mono font-bold text-white text-xs" }, fmtInt(sv)),
									/* @__PURE__ */ React.createElement("span", { className: "text-[10px] text-slate-400 ml-1" }, it.satuan)
								),
								/* Kolom Realisasi per Kampus */
								matrixSatdikIds.map((sid) => {
									const hasCell = it.real && it.real[sid] !== undefined;
									if (!hasCell) {
										return /* @__PURE__ */ React.createElement("td", { key: sid, className: "p-2.5 text-center text-slate-500 font-mono" }, "—");
									}
									const rv = Number(it.real[sid]) || 0;
									const cellCls = rv >= sv
										? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
										: rv > 0
											? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
											: "bg-rose-500/15 text-rose-400 border border-rose-500/30";
									const isEditableForUser = canEdit && (!lockedSatdik || lockedSatdik === sid);
									return /* @__PURE__ */ React.createElement("td", { key: sid, className: "p-2 text-center" },
										/* @__PURE__ */ React.createElement("button", {
											type: "button",
											onClick: (e) => {
												e.stopPropagation();
												if (isEditableForUser) {
													openEditItemModal(it, sid);
												}
											},
											className: `inline-flex items-center justify-center min-w-[36px] px-2 py-0.5 rounded font-mono font-bold text-[11px] ${cellCls} ${isEditableForUser ? "hover:ring-2 hover:ring-cyan-400 hover:scale-105 cursor-pointer transition-transform" : "cursor-default"}`,
											title: `${rv >= sv ? `Terpenuhi (${rv}/${sv} ${it.satuan})` : rv > 0 ? `Kurang ${sv - rv} ${it.satuan} (${rv}/${sv})` : `Belum tersedia (0/${sv} ${it.satuan})`}${isEditableForUser ? " — Klik untuk mengedit ketersediaan kampus ini" : ""}`
										}, fmtInt(rv))
									);
								}),
								/* Catatan / Kondisi */
								/* @__PURE__ */ React.createElement("td", { className: "p-3 text-[11px] text-slate-300" },
									kondInfo && /* @__PURE__ */ React.createElement("span", { className: `inline-block px-2 py-0.5 rounded text-[10px] font-bold mr-1.5 mb-1 ${kondInfo.cls}` }, kondInfo.label),
									it.ket
										? /* @__PURE__ */ React.createElement("span", { className: "text-slate-300 leading-relaxed" }, it.ket)
										: (!kondInfo && /* @__PURE__ */ React.createElement("span", { className: "text-slate-500" }, "—"))
								),
								/* Kolom Aksi */
								/* @__PURE__ */ React.createElement("td", { className: "p-2.5 text-center whitespace-nowrap", onClick: (e) => e.stopPropagation() },
									/* @__PURE__ */ React.createElement("div", { className: "inline-flex items-center gap-1 justify-center" },
										canEdit && /* @__PURE__ */ React.createElement("button", {
											type: "button",
											onClick: (e) => { e.stopPropagation(); openEditItemModal(it); },
											className: "p-1.5 rounded-lg bg-slate-900/80 hover:bg-cyan-600 text-slate-300 hover:text-white border border-slate-700 hover:border-cyan-500 transition-colors shadow-sm",
											title: `Edit data item standar: ${it.nama}`
										}, /* @__PURE__ */ React.createElement(Edit3, { className: "w-3.5 h-3.5" })),
										canDelete && /* @__PURE__ */ React.createElement("button", {
											type: "button",
											onClick: (e) => { e.stopPropagation(); handleDeleteClick(it); },
											className: "p-1.5 rounded-lg bg-slate-900/80 hover:bg-rose-600 text-rose-400 hover:text-white border border-slate-700 hover:border-rose-500 transition-colors shadow-sm",
											title: `Hapus item standar: ${it.nama}`
										}, /* @__PURE__ */ React.createElement(X, { className: "w-3.5 h-3.5" }))
									)
								)
							);
						})
					)
				)
			);
		};

		return /* @__PURE__ */ React.createElement("div", { className: "space-y-6" },
			/* 1. HERO HEADER */
			/* @__PURE__ */ React.createElement("div", { className: "flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-gradient-to-r from-slate-800/90 via-slate-800/70 to-slate-900/90 p-4 sm:p-5 rounded-2xl border border-slate-700/80 shadow-lg relative overflow-hidden" },
				/* @__PURE__ */ React.createElement("div", { className: "absolute right-0 top-0 bottom-0 opacity-5 pointer-events-none flex items-center pr-6" },
					/* @__PURE__ */ React.createElement("img", { src: logoKkp, alt: "KKP Watermark", className: "w-56 h-56 object-contain" })
				),
				/* @__PURE__ */ React.createElement("div", { className: "flex flex-col sm:flex-row items-center text-center sm:text-left gap-3.5 sm:gap-4 relative z-10" },
					/* @__PURE__ */ React.createElement("div", { className: "w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white p-1.5 shadow-md border border-cyan-500/30 flex items-center justify-center flex-shrink-0" },
						/* @__PURE__ */ React.createElement("img", { src: logoKkp, alt: "Logo KKP", className: "w-full h-full object-contain" })
					),
					/* @__PURE__ */ React.createElement("div", null,
						/* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap items-center justify-center sm:justify-start gap-2" },
							/* @__PURE__ */ React.createElement("span", { className: "px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30" }, "Evaluasi Kurikulum Vokasi KKP"),
							/* @__PURE__ */ React.createElement("span", { className: "text-xs text-slate-400" }, "• 12 Rumpun Prodi • 11 Satdik Pendidikan Tinggi")
						),
						/* @__PURE__ */ React.createElement("h2", { className: "text-lg sm:text-2xl font-extrabold text-white tracking-tight mt-1" }, "Standar Minimal & Gap Sarpras Program Studi"),
						/* @__PURE__ */ React.createElement("p", { className: "text-xs sm:text-sm text-slate-300 max-w-2xl mt-0.5" }, "Pemetaan pemenuhan standar minimal Prasarana (Ruang Lab/Workshop/Kapal Latih) dan Sarana (Peralatan & Perabot Praktik) antar-kampus tanpa mencampuri KPI valuasi aset BMN utama.")
					)
				)
			),

			/* 2. FILTER BAR UTAMA */
			/* @__PURE__ */ React.createElement("div", { className: "bg-slate-800/90 p-3.5 sm:p-4 rounded-2xl border border-slate-700/70 shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-3" },
				/* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap items-center gap-2.5" },
					/* Pilih Rumpun Prodi */
					/* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-1.5" },
						/* @__PURE__ */ React.createElement(GraduationCap, { className: "w-4 h-4 text-cyan-400 flex-shrink-0" }),
						/* @__PURE__ */ React.createElement("select", {
							value: selectedBidang,
							onChange: (e) => { setSelectedBidang(e.target.value); setCurrentPage(1); },
							className: "py-2 px-3 bg-slate-900 text-slate-200 text-xs rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-500"
						},
							/* @__PURE__ */ React.createElement("option", { value: "ALL" }, `Semua Rumpun Prodi (${availableBidang.length} Bidang)`),
							availableBidang.map((b) => /* @__PURE__ */ React.createElement("option", { key: b.id, value: b.id },
								`${b.nama} (${b.totalItems} item • ${b.satdikIds.length} kampus)`
							))
						)
					),
					/* Pilih Satdik */
					/* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-1.5" },
						/* @__PURE__ */ React.createElement(Building2, { className: "w-4 h-4 text-emerald-400 flex-shrink-0" }),
						/* @__PURE__ */ React.createElement("select", {
							value: selectedSatdik,
							disabled: Boolean(lockedSatdik),
							onChange: (e) => { setSelectedSatdik(e.target.value); setSelectedBidang("ALL"); setCurrentPage(1); },
							className: "py-2 px-3 bg-slate-900 text-slate-200 text-xs rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-500"
						},
							/* @__PURE__ */ React.createElement("option", { value: "ALL" }, `Semua Satdik Pendidikan Tinggi (${surveyedSatdikList.length} Kampus)`),
							surveyedSatdikList.map((s) => /* @__PURE__ */ React.createElement("option", { key: s.id, value: s.id }, s.shortName)),
							unsurveyedSatdikList.length > 0 && /* @__PURE__ */ React.createElement("optgroup", { label: "Belum Tercantum di File Excel (Jenjang SUPM)" },
								unsurveyedSatdikList.map((u) => /* @__PURE__ */ React.createElement("option", { key: u.id, value: u.id }, `${u.shortName} (Belum ada sheet Excel)`))
							)
						)
					)
				),
				/* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap items-center gap-2 text-xs text-slate-400" },
					/* @__PURE__ */ React.createElement("span", null, "Sumber: ", /* @__PURE__ */ React.createElement("strong", { className: "text-slate-200 font-mono" }, standarData?.meta?.sumber || "Data Contoh.xlsx")),
					(selectedBidang !== "ALL" || selectedSatdik !== (lockedSatdik || "ALL") || secFilter !== "ALL" || gapFilter !== "ALL" || itemSearch) && /* @__PURE__ */ React.createElement("button", {
						onClick: handleResetAll,
						className: "inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs transition-colors"
					},
						/* @__PURE__ */ React.createElement(RotateCcw, { className: "w-3.5 h-3.5 text-cyan-400" }),
						/* @__PURE__ */ React.createElement("span", null, "Reset Filter")
					)
				)
			),

			/* Info jika user/operator memilih Satdik SUPM yang belum tercantum di Data Contoh.xlsx */
			selectedUnsurveyed && /* @__PURE__ */ React.createElement("div", { className: "bg-slate-800/90 rounded-2xl p-5 border border-amber-500/30 shadow-md flex items-start gap-3" },
				/* @__PURE__ */ React.createElement("div", { className: "w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center flex-shrink-0" },
					/* @__PURE__ */ React.createElement(Info, { className: "w-5 h-5" })
				),
				/* @__PURE__ */ React.createElement("div", null,
					/* @__PURE__ */ React.createElement("h4", { className: "font-bold text-white text-sm" }, "Matriks Standar Sarpras Prodi Belum Tersedia untuk ", selectedUnsurveyed.name),
					/* @__PURE__ */ React.createElement("p", { className: "text-xs text-slate-400 mt-1" },
						"Berkas ", standarData?.meta?.sumber || "Data Contoh.xlsx", " saat ini memuat matriks standar minimal untuk 11 Satdik Pendidikan Tinggi (Politeknik KP & AK-KP Wakatobi). Untuk menambahkan jenjang SUPM, tambahkan kolom kampus pada lembar Excel lalu jalankan ",
						/* @__PURE__ */ React.createElement("span", { className: "font-mono text-cyan-400" }, "python Database/import_standar_sarpras.py"), "."
					)
				)
			),

			/* 3. EMPAT KARTU KPI EKSEKUTIF STANDAR PRODI */
			filteredRekap.length > 0 && /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4" },
				/* KPI 1: Total Katalog Standar */
				/* @__PURE__ */ React.createElement("div", { className: "bg-slate-800/90 rounded-2xl p-4 border border-slate-700/70 hover:border-cyan-500/50 transition-all shadow-md" },
					/* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between text-slate-400" },
						/* @__PURE__ */ React.createElement("span", { className: "text-xs font-medium uppercase tracking-wider" }, "Katalog Standar Prodi"),
						/* @__PURE__ */ React.createElement("div", { className: "w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center" },
							/* @__PURE__ */ React.createElement(Layers, { className: "w-4 h-4" })
						)
					),
					/* @__PURE__ */ React.createElement("div", { className: "mt-3" },
						/* @__PURE__ */ React.createElement("div", { className: "text-2xl font-black text-white" }, fmtInt(kpiSummary.stdItemsCount), " ", /* @__PURE__ */ React.createElement("span", { className: "text-xs font-normal text-slate-400" }, "Item")),
						/* @__PURE__ */ React.createElement("div", { className: "text-[11px] text-cyan-400 mt-0.5" },
							fmtInt(kpiSummary.stdPrasaranaCount), " Prasarana • ", fmtInt(kpiSummary.stdSaranaCount), " Sarana"
						)
					)
				),
				/* KPI 2: Kesiapan Prasarana (A) */
				/* @__PURE__ */ React.createElement("div", { className: "bg-slate-800/90 rounded-2xl p-4 border border-slate-700/70 hover:border-blue-500/50 transition-all shadow-md" },
					/* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between text-slate-400" },
						/* @__PURE__ */ React.createElement("span", { className: "text-xs font-medium uppercase tracking-wider" }, "Prasarana"),
						/* @__PURE__ */ React.createElement("div", { className: "w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center" },
							/* @__PURE__ */ React.createElement(Building2, { className: "w-4 h-4" })
						)
					),
					/* @__PURE__ */ React.createElement("div", { className: "mt-3" },
						/* @__PURE__ */ React.createElement("div", { className: "text-2xl font-black text-sky-400" }, fmtPct(kpiSummary.pctPrasarana), "%"),
						/* @__PURE__ */ React.createElement("div", { className: "text-[11px] text-slate-400 mt-0.5" },
							fmtInt(kpiSummary.pFull), " terpenuhi dari ", fmtInt(kpiSummary.pTot), " titik lab/ruang"
						)
					)
				),
				/* KPI 3: Kesiapan Sarana (B) */
				/* @__PURE__ */ React.createElement("div", { className: "bg-slate-800/90 rounded-2xl p-4 border border-slate-700/70 hover:border-emerald-500/50 transition-all shadow-md" },
					/* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between text-slate-400" },
						/* @__PURE__ */ React.createElement("span", { className: "text-xs font-medium uppercase tracking-wider" }, "Sarana"),
						/* @__PURE__ */ React.createElement("div", { className: "w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center" },
							/* @__PURE__ */ React.createElement(Wrench, { className: "w-4 h-4" })
						)
					),
					/* @__PURE__ */ React.createElement("div", { className: "mt-3" },
						/* @__PURE__ */ React.createElement("div", { className: "text-2xl font-black text-emerald-400" }, fmtPct(kpiSummary.pctSarana), "%"),
						/* @__PURE__ */ React.createElement("div", { className: "text-[11px] text-slate-400 mt-0.5" },
							fmtInt(kpiSummary.sFull), " terpenuhi • ", fmtInt(kpiSummary.sPart), " kurang vol"
						)
					)
				),
				/* KPI 4: Gap / Defisit Prioritas */
				/* @__PURE__ */ React.createElement("div", { className: "bg-slate-800/90 rounded-2xl p-4 border border-slate-700/70 hover:border-cyan-500/50 transition-all shadow-md" },
					/* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between text-slate-400" },
						/* @__PURE__ */ React.createElement("span", { className: "text-xs font-medium uppercase tracking-wider" }, "Indeks Total & Gap"),
						/* @__PURE__ */ React.createElement("div", { className: `w-8 h-8 rounded-lg ${kpiSummary.pctTotal >= 60 ? "bg-emerald-500/10 text-emerald-400" : kpiSummary.pctTotal >= 35 ? "bg-amber-500/10 text-amber-400" : "bg-rose-500/10 text-rose-400"} flex items-center justify-center` },
							/* @__PURE__ */ React.createElement(BadgeCheck, { className: "w-4 h-4" })
						)
					),
					/* @__PURE__ */ React.createElement("div", { className: "mt-3" },
						/* @__PURE__ */ React.createElement("div", { className: `text-2xl font-black ${kpiSummary.pctTotal >= 60 ? "text-emerald-400" : kpiSummary.pctTotal >= 35 ? "text-amber-400" : "text-rose-400"}` }, fmtPct(kpiSummary.pctTotal), "%"),
						/* @__PURE__ */ React.createElement("div", { className: "text-[11px] text-slate-400 mt-0.5" },
							fmtInt(kpiSummary.allZero), " belum ada (0) • ", kpiSummary.satdikCount, " Satdik"
						)
					)
				)
			),

			/* 4. GRAFIK PERBANDINGAN PRASARANA VS SARANA */
			filteredRekap.length > 0 && chartPayload.labels.length > 0 && /* @__PURE__ */ React.createElement("div", { className: "bg-slate-800/90 rounded-2xl p-5 border border-slate-700/70 shadow-lg" },
				/* @__PURE__ */ React.createElement("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3" },
					/* @__PURE__ */ React.createElement("div", null,
						/* @__PURE__ */ React.createElement("h3", { className: "text-base font-bold text-white tracking-tight" },
							chartAxis === "satdik"
								? "Perbandingan Pemenuhan Standar Prasarana vs Sarana Antar-Satdik"
								: "Perbandingan Pemenuhan Standar Prasarana vs Sarana per Rumpun Prodi"
						),
						/* @__PURE__ */ React.createElement("p", { className: "text-xs text-slate-400" }, "Skor ketercapaian dihitung tertimbang per item (maks. 100% per item agar surplus perabot tidak menutupi defisit alat utama).")
					),
					/* Toggle Sumbu Grafik */
					/* @__PURE__ */ React.createElement("div", { className: "inline-flex rounded-xl bg-slate-900 p-1 border border-slate-700/80 self-start" },
						/* @__PURE__ */ React.createElement("button", {
							onClick: () => setChartAxis("bidang"),
							className: `px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${chartAxis === "bidang" ? "bg-cyan-600 text-white" : "text-slate-400 hover:text-slate-200"}`
						}, "Per Rumpun Prodi"),
						/* @__PURE__ */ React.createElement("button", {
							onClick: () => setChartAxis("satdik"),
							className: `px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${chartAxis === "satdik" ? "bg-cyan-600 text-white" : "text-slate-400 hover:text-slate-200"}`
						}, "Per Kampus Satdik")
					)
				),
				/* @__PURE__ */ React.createElement("div", { className: "h-72 sm:h-80" },
					/* @__PURE__ */ React.createElement(Bar, { data: chartPayload, options: barOptions })
				)
			),

			/* 5. TABEL REKAPITULASI PEMENUHAN PER RUMPUN PRODI & SATDIK */
			filteredRekap.length > 0 && /* @__PURE__ */ React.createElement("div", { className: "bg-slate-800/90 rounded-2xl border border-slate-700/70 shadow-lg overflow-hidden" },
				/* @__PURE__ */ React.createElement("div", { className: "p-4 sm:p-5 border-b border-slate-700/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2" },
					/* @__PURE__ */ React.createElement("div", null,
						/* @__PURE__ */ React.createElement("h3", { className: "text-base font-bold text-white tracking-tight" }, "Matriks Rekapitulasi Pemenuhan Standar per Rumpun Prodi & Kampus"),
						/* @__PURE__ */ React.createElement("p", { className: "text-xs text-slate-400 mt-0.5" }, "Klik tombol Rincian Item untuk menelusuri daftar laboratorium, workshop, dan peralatan pada pasangan Prodi–Kampus tersebut.")
					),
					/* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3 text-[11px] text-slate-400" },
						/* @__PURE__ */ React.createElement("span", { className: "flex items-center gap-1" }, /* @__PURE__ */ React.createElement("span", { className: "w-2.5 h-2.5 rounded-full bg-emerald-500" }), "Memadai (≥70%)"),
						/* @__PURE__ */ React.createElement("span", { className: "flex items-center gap-1" }, /* @__PURE__ */ React.createElement("span", { className: "w-2.5 h-2.5 rounded-full bg-amber-500" }), "Penguatan (40–69%)"),
						/* @__PURE__ */ React.createElement("span", { className: "flex items-center gap-1" }, /* @__PURE__ */ React.createElement("span", { className: "w-2.5 h-2.5 rounded-full bg-rose-500" }), "Defisit (<40%)")
					)
				),
				/* @__PURE__ */ React.createElement("div", { className: "overflow-x-auto" },
					/* @__PURE__ */ React.createElement("table", { className: "w-full text-left text-xs border-collapse" },
						/* @__PURE__ */ React.createElement("thead", null,
							/* @__PURE__ */ React.createElement("tr", { className: "bg-slate-900/90 text-slate-300 border-b border-slate-700/80 font-semibold uppercase tracking-wider text-[11px]" },
								/* @__PURE__ */ React.createElement("th", { onClick: () => toggleRekapSort("bidangNama"), className: "p-3.5 cursor-pointer hover:text-cyan-400 transition-colors" },
									/* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-1.5" }, /* @__PURE__ */ React.createElement("span", null, "Rumpun / Bidang Prodi"), /* @__PURE__ */ React.createElement(ArrowUpDown, { className: "w-3.5 h-3.5 opacity-60" }))
								),
								/* @__PURE__ */ React.createElement("th", { onClick: () => toggleRekapSort("satdikShort"), className: "p-3.5 cursor-pointer hover:text-cyan-400 transition-colors" },
									/* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-1.5" }, /* @__PURE__ */ React.createElement("span", null, "Satuan Pendidikan"), /* @__PURE__ */ React.createElement(ArrowUpDown, { className: "w-3.5 h-3.5 opacity-60" }))
								),
								/* @__PURE__ */ React.createElement("th", { onClick: () => toggleRekapSort("persenPrasarana"), className: "p-3.5 cursor-pointer hover:text-cyan-400 transition-colors" },
									/* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-1.5" }, /* @__PURE__ */ React.createElement("span", null, "A. Prasarana (Lab/Ruang)"), /* @__PURE__ */ React.createElement(ArrowUpDown, { className: "w-3.5 h-3.5 opacity-60" }))
								),
								/* @__PURE__ */ React.createElement("th", { onClick: () => toggleRekapSort("persenSarana"), className: "p-3.5 cursor-pointer hover:text-cyan-400 transition-colors" },
									/* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-1.5" }, /* @__PURE__ */ React.createElement("span", null, "B. Sarana (Alat/Perabot)"), /* @__PURE__ */ React.createElement(ArrowUpDown, { className: "w-3.5 h-3.5 opacity-60" }))
								),
								/* @__PURE__ */ React.createElement("th", { onClick: () => toggleRekapSort("defisitCount"), className: "p-3.5 cursor-pointer hover:text-cyan-400 transition-colors" },
									/* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-1.5" }, /* @__PURE__ */ React.createElement("span", null, "Rincian Gap / Defisit"), /* @__PURE__ */ React.createElement(ArrowUpDown, { className: "w-3.5 h-3.5 opacity-60" }))
								),
								/* @__PURE__ */ React.createElement("th", { onClick: () => toggleRekapSort("persenTotal"), className: "p-3.5 cursor-pointer hover:text-cyan-400 transition-colors" },
									/* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-1.5" }, /* @__PURE__ */ React.createElement("span", null, "Skor Pemenuhan"), /* @__PURE__ */ React.createElement(ArrowUpDown, { className: "w-3.5 h-3.5 opacity-60" }))
								),
								/* @__PURE__ */ React.createElement("th", { className: "p-3.5 text-right" }, "Eksplorasi")
							)
						),
						/* @__PURE__ */ React.createElement("tbody", { className: "divide-y divide-slate-800" },
							filteredRekap.map((row) => {
								const isFocused = catalogBidang === row.bidangId && selectedSatdik === row.satdikId;
								const pct = Number(row.persenTotal) || 0;
								const badgeCls = pct >= 70
									? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
									: pct >= 40
										? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
										: "bg-rose-500/15 text-rose-400 border border-rose-500/30";
								const barCls = pct >= 70 ? "bg-emerald-500" : pct >= 40 ? "bg-amber-500" : "bg-rose-500";

								return /* @__PURE__ */ React.createElement("tr", {
									key: row.id,
									className: `hover:bg-slate-700/40 transition-colors ${isFocused ? "bg-slate-700/40" : ""}`
								},
									/* Rumpun */
									/* @__PURE__ */ React.createElement("td", { className: "p-3.5" },
										/* @__PURE__ */ React.createElement("div", { className: "font-bold text-white" }, row.bidangNama),
										/* @__PURE__ */ React.createElement("div", { className: "text-[10px] text-slate-400 line-clamp-2 max-w-[230px]" }, row.prodiLabel)
									),
									/* Satdik */
									/* @__PURE__ */ React.createElement("td", { className: "p-3.5" },
										/* @__PURE__ */ React.createElement("div", { className: "font-semibold text-slate-200" }, row.satdikShort),
										/* @__PURE__ */ React.createElement("div", { className: "text-[10px] text-slate-400" }, row.satdikKota)
									),
									/* Prasarana */
									/* @__PURE__ */ React.createElement("td", { className: "p-3.5" },
										/* @__PURE__ */ React.createElement("div", { className: "font-mono font-bold text-sky-400" }, fmtPct(row.persenPrasarana), "%"),
										/* @__PURE__ */ React.createElement("div", { className: "text-[10px] text-slate-400" },
											row.prasaranaTerpenuhi, " / ", row.prasaranaTotal, " ruang terpenuhi"
										)
									),
									/* Sarana */
									/* @__PURE__ */ React.createElement("td", { className: "p-3.5" },
										/* @__PURE__ */ React.createElement("div", { className: "font-mono font-bold text-emerald-400" }, fmtPct(row.persenSarana), "%"),
										/* @__PURE__ */ React.createElement("div", { className: "text-[10px] text-slate-400" },
											row.saranaTerpenuhi, " / ", row.saranaTotal, " alat terpenuhi"
										)
									),
									/* Gap */
									/* @__PURE__ */ React.createElement("td", { className: "p-3.5" },
										/* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap gap-1" },
											row.totalKosong > 0 && /* @__PURE__ */ React.createElement("span", { className: "px-1.5 py-0.5 rounded text-[10px] font-semibold bg-rose-500/15 text-rose-400" }, row.totalKosong, " belum ada"),
											row.totalSebagian > 0 && /* @__PURE__ */ React.createElement("span", { className: "px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-500/20 text-amber-300" }, row.totalSebagian, " kurang vol"),
											row.totalKosong === 0 && row.totalSebagian === 0 && /* @__PURE__ */ React.createElement("span", { className: "px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/15 text-emerald-400" }, "Lengkap 100%")
										)
									),
									/* Skor Pemenuhan */
									/* @__PURE__ */ React.createElement("td", { className: "p-3.5" },
										/* @__PURE__ */ React.createElement("div", { className: "space-y-1 max-w-[135px]" },
											/* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between gap-2" },
												/* @__PURE__ */ React.createElement("span", { className: `px-2 py-0.5 rounded text-[10px] font-bold ${badgeCls}` },
													pct >= 70 ? "Memadai" : pct >= 40 ? "Penguatan" : "Defisit"
												),
												/* @__PURE__ */ React.createElement("span", { className: "font-mono font-bold text-white text-[11px]" }, fmtPct(pct), "%")
											),
											/* @__PURE__ */ React.createElement("div", { className: "w-full h-1.5 bg-slate-900 rounded-full overflow-hidden" },
												/* @__PURE__ */ React.createElement("div", {
													className: `h-full rounded-full ${barCls}`,
													style: { width: `${Math.min(100, pct)}%` }
												})
											)
										)
									),
									/* Tombol Rincian */
									/* @__PURE__ */ React.createElement("td", { className: "p-3.5 text-right" },
										/* @__PURE__ */ React.createElement("button", {
											onClick: () => handleFocusRekapRow(row),
											className: `inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-colors ${isFocused ? "bg-cyan-600 text-white border-cyan-500" : "bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border-cyan-800"}`
										},
											/* @__PURE__ */ React.createElement("span", null, `Rincian (${row.totalItems})`)
										)
									)
								);
							})
						)
					)
				),
				selectedSatdik === "ALL" && unsurveyedSatdikList.length > 0 && /* @__PURE__ */ React.createElement("div", { className: "px-4 py-3 bg-slate-900/60 border-t border-slate-800 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2" },
					/* @__PURE__ */ React.createElement("span", null,
						"Cakupan Matriks: 11 Satdik Pendidikan Tinggi (Politeknik KP & AK-KP Wakatobi) telah terpetakan; 7 Satdik jenjang SUPM belum tercantum pada ",
						/* @__PURE__ */ React.createElement("strong", { className: "text-slate-200 font-mono" }, standarData?.meta?.sumber || "Data Contoh.xlsx"), "."
					),
					/* @__PURE__ */ React.createElement("span", { className: "text-cyan-400 font-medium" }, "KPI 48 Aset Strategis Utama Tetap Terpisah & Terjaga")
				)
			),

			/* 6. EKSPLORASI HIERARKI LABORATORIUM/WORKSHOP & MATRIKS ITEM STANDAR */
			!selectedUnsurveyed && /* @__PURE__ */ React.createElement("div", { ref: catalogRef, className: "bg-slate-800/90 rounded-2xl border border-slate-700/70 shadow-lg overflow-hidden" },
				/* @__PURE__ */ React.createElement("div", { className: "p-4 sm:p-5 border-b border-slate-700/70 space-y-3.5" },
					/* Header Katalog */
					/* @__PURE__ */ React.createElement("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-2" },
						/* @__PURE__ */ React.createElement("div", null,
							/* @__PURE__ */ React.createElement("h3", { className: "text-base font-bold text-white tracking-tight flex flex-wrap items-center gap-2" },
								/* @__PURE__ */ React.createElement(GraduationCap, { className: "w-4 h-4 text-cyan-400" }),
								/* @__PURE__ */ React.createElement("span", null, "Katalog Hierarki Laboratorium, Workshop & Matriks Realisasi Item"),
								activeCatalogBidangObj && /* @__PURE__ */ React.createElement("span", { className: "px-2 py-0.5 rounded-full text-[11px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/30" }, activeCatalogBidangObj.nama),
								selectedSatdik !== "ALL" && satdikMap[selectedSatdik] && /* @__PURE__ */ React.createElement("span", { className: "px-2 py-0.5 rounded-full text-[11px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30" }, satdikMap[selectedSatdik].shortName)
							),
							/* @__PURE__ */ React.createElement("p", { className: "text-xs text-slate-400 mt-0.5" }, "Buka grup fasilitas (A.1 / B.2.1) untuk memeriksa volume standar minimal vs ketersediaan riil di tiap kampus beserta catatan audit.")
						),
						/* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2 text-xs text-slate-400" },
							/* @__PURE__ */ React.createElement("span", null, "Menampilkan ", /* @__PURE__ */ React.createElement("strong", { className: "text-white" }, fmtInt(filteredItems.length)), " item standar"),
							canEdit && /* @__PURE__ */ React.createElement("button", {
								type: "button",
								onClick: openAddItemModal,
								className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs shadow-md shadow-cyan-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] ml-1"
							},
								/* @__PURE__ */ React.createElement(PlusCircle, { className: "w-3.5 h-3.5" }),
								/* @__PURE__ */ React.createElement("span", null, "Tambah Item")
							)
						)
					),

					/* Kontrol Pencarian, Pilihan Sheet Katalog, Filter Seksi, Filter Gap, & Mode Tampilan */
					/* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-2.5" },
						/* Search */
						/* @__PURE__ */ React.createElement("div", { className: "lg:col-span-4 relative" },
							/* @__PURE__ */ React.createElement(Search, { className: "w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" }),
							/* @__PURE__ */ React.createElement("input", {
								type: "text",
								placeholder: "Cari simulator, kapal latih, lab, mikroskop, las...",
								value: itemSearch,
								onChange: (e) => { setItemSearch(e.target.value); setCurrentPage(1); },
								className: "w-full pl-9 pr-3 py-2 bg-slate-900 text-slate-200 placeholder-slate-400 text-xs rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-500"
							})
						),
						/* Pilih Rumpun Katalog */
						/* @__PURE__ */ React.createElement("div", { className: "lg:col-span-3" },
							/* @__PURE__ */ React.createElement("select", {
								value: catalogBidang,
								onChange: (e) => { setCatalogBidang(e.target.value); setCurrentPage(1); },
								className: "w-full py-2 px-3 bg-slate-900 text-slate-200 text-xs rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-500"
							},
								availableBidang.map((b) => /* @__PURE__ */ React.createElement("option", { key: b.id, value: b.id },
									`Sheet: ${b.nama} (${b.totalItems})`
								)),
								/* @__PURE__ */ React.createElement("option", { value: "ALL" }, "Semua 12 Sheet Sekaligus (Pencarian Lintas Prodi)")
							)
						),
						/* Filter Seksi */
						/* @__PURE__ */ React.createElement("div", { className: "lg:col-span-2" },
							/* @__PURE__ */ React.createElement("select", {
								value: secFilter,
								onChange: (e) => { setSecFilter(e.target.value); setCurrentPage(1); },
								className: "w-full py-2 px-3 bg-slate-900 text-slate-200 text-xs rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-500"
							},
								/* @__PURE__ */ React.createElement("option", { value: "ALL" }, "Seksi: Prasarana & Sarana"),
								/* @__PURE__ */ React.createElement("option", { value: "A" }, "A. Prasarana (Ruang/Lab)"),
								/* @__PURE__ */ React.createElement("option", { value: "B" }, "B. Sarana (Peralatan/Perabot)")
							)
						),
						/* Filter Status Gap */
						/* @__PURE__ */ React.createElement("div", { className: "lg:col-span-3" },
							/* @__PURE__ */ React.createElement("select", {
								value: gapFilter,
								onChange: (e) => { setGapFilter(e.target.value); setCurrentPage(1); },
								className: "w-full py-2 px-3 bg-slate-900 text-slate-200 text-xs rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-500"
							},
								/* @__PURE__ */ React.createElement("option", { value: "ALL" }, "Status: Semua Ketersediaan"),
								/* @__PURE__ */ React.createElement("option", { value: "KOSONG" }, "Gap Prioritas: Belum Ada (0)"),
								/* @__PURE__ */ React.createElement("option", { value: "KURANG" }, "Defisit Kuantitas: Kurang dari Standar"),
								/* @__PURE__ */ React.createElement("option", { value: "TERPENUHI" }, "Memenuhi Standar (≥ Vol Minimal)")
							)
						)
					),

					/* Sub-bar Mode Tampilan (Grup Accordion vs Tabel Datar) */
					/* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap items-center justify-between gap-2 pt-1" },
						/* @__PURE__ */ React.createElement("div", { className: "inline-flex rounded-xl bg-slate-900 p-1 border border-slate-700/80" },
							/* @__PURE__ */ React.createElement("button", {
								onClick: () => setViewMode("GROUP"),
								className: `px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${viewMode === "GROUP" ? "bg-cyan-600 text-white" : "text-slate-400 hover:text-slate-200"}`
							}, `Per Grup Lab / Workshop (${groupedCatalog.length})`),
							/* @__PURE__ */ React.createElement("button", {
								onClick: () => setViewMode("FLAT"),
								className: `px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${viewMode === "FLAT" ? "bg-cyan-600 text-white" : "text-slate-400 hover:text-slate-200"}`
							}, `Tabel Matriks Datar (${fmtInt(filteredItems.length)})`)
						),
						viewMode === "GROUP" && groupedCatalog.length > 0 && /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2 text-xs" },
							/* @__PURE__ */ React.createElement("button", {
								onClick: () => expandOrCollapseAll(true),
								className: "px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-700 text-cyan-400 border border-slate-700 font-medium transition-colors"
							}, "Buka Semua Grup"),
							/* @__PURE__ */ React.createElement("button", {
								onClick: () => expandOrCollapseAll(false),
								className: "px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-700 text-slate-300 border border-slate-700 font-medium transition-colors"
							}, "Tutup Semua")
						)
					)
				),

				/* ISI KATALOG: MODE GRUP ACCORDION ATAU MODE TABEL DATAR */
				filteredItems.length === 0 ? /* @__PURE__ */ React.createElement("div", { className: "p-10 text-center text-slate-400 text-xs" },
					"Tidak ditemukan item standar sarpras yang cocok dengan kata kunci atau filter yang dipilih."
				) : viewMode === "GROUP" ? /* @__PURE__ */ React.createElement("div", { className: "divide-y divide-slate-800" },
					groupedCatalog.map((grp) => {
						const isOpen = Boolean(expandedGroups[grp.key]);
						const grpPct = grp.totalCells > 0 ? Math.round((grp.fullCells / grp.totalCells) * 100) : 0;
						const secTagCls = grp.sec === "A"
							? "bg-sky-500/15 text-sky-400 border border-sky-500/30"
							: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30";
						const pctBadgeCls = grpPct >= 70
							? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
							: grpPct >= 40
								? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
								: "bg-rose-500/15 text-rose-400 border border-rose-500/30";

						return /* @__PURE__ */ React.createElement("div", { key: grp.key, className: "bg-slate-800/60" },
							/* Header Accordion Grup */
							/* @__PURE__ */ React.createElement("button", {
								type: "button",
								onClick: () => toggleGroupExpand(grp.key),
								className: "w-full px-4 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-left hover:bg-slate-700/40 transition-colors"
							},
								/* @__PURE__ */ React.createElement("div", { className: "space-y-1" },
									/* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap items-center gap-2" },
										/* @__PURE__ */ React.createElement("span", { className: "text-cyan-400 font-bold text-xs w-4 inline-block" }, isOpen ? "▼" : "▶"),
										/* @__PURE__ */ React.createElement("span", { className: `px-2 py-0.5 rounded text-[10px] font-bold ${secTagCls}` },
											grp.sec === "A" ? "A. PRASARANA" : "B. SARANA"
										),
										catalogBidang === "ALL" && /* @__PURE__ */ React.createElement("span", { className: "px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-900 text-cyan-300 border border-slate-700" }, grp.bidangNama),
										/* @__PURE__ */ React.createElement("span", { className: "font-mono text-xs font-bold text-cyan-400" }, grp.grpCode),
										/* @__PURE__ */ React.createElement("span", { className: "font-bold text-white text-xs sm:text-sm" }, grp.grpName)
									),
									grp.groupNote && /* @__PURE__ */ React.createElement("div", { className: "text-[11px] text-amber-300 pl-6" },
										"Catatan Audit: ", grp.groupNote
									)
								),
								/* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap items-center gap-2 pl-6 sm:pl-0 flex-shrink-0" },
									/* @__PURE__ */ React.createElement("span", { className: "text-[11px] text-slate-400" }, grp.items.length, " item standar"),
									grp.zeroCells > 0 && /* @__PURE__ */ React.createElement("span", { className: "px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-500/15 text-rose-400" }, grp.zeroCells, " kosong"),
									/* @__PURE__ */ React.createElement("span", { className: `px-2 py-0.5 rounded text-[10px] font-bold font-mono ${pctBadgeCls}` }, grpPct, "% terpenuhi")
								)
							),
							/* Tabel Item di Dalam Grup */
							isOpen && /* @__PURE__ */ React.createElement("div", { className: "border-t border-slate-700/70 bg-slate-900/40" },
								renderMatrixTable(grp.items, false)
							)
						);
					})
				) : /* @__PURE__ */ React.createElement("div", null,
					renderMatrixTable(paginatedFlatItems, catalogBidang === "ALL"),
					totalPages > 1 && /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between bg-slate-900/60 px-4 py-3 border-t border-slate-800 text-xs text-slate-300" },
						/* @__PURE__ */ React.createElement("div", null,
							"Halaman ", /* @__PURE__ */ React.createElement("span", { className: "font-bold text-white" }, currentPage), " dari ", totalPages,
							" (", fmtInt(filteredItems.length), " item)"
						),
						/* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-1.5" },
							/* @__PURE__ */ React.createElement("button", {
								onClick: () => setCurrentPage((p) => Math.max(1, p - 1)),
								disabled: currentPage === 1,
								className: "p-1.5 rounded-lg bg-slate-900 hover:bg-slate-700 disabled:opacity-30 text-slate-200 transition-colors"
							}, /* @__PURE__ */ React.createElement(ChevronLeft, { className: "w-4 h-4" })),
							/* @__PURE__ */ React.createElement("span", { className: "px-2.5 py-1 rounded-lg bg-cyan-600 text-white font-bold font-mono" }, currentPage),
							/* @__PURE__ */ React.createElement("button", {
								onClick: () => setCurrentPage((p) => Math.min(totalPages, p + 1)),
								disabled: currentPage === totalPages,
								className: "p-1.5 rounded-lg bg-slate-900 hover:bg-slate-700 disabled:opacity-30 text-slate-200 transition-colors"
							}, /* @__PURE__ */ React.createElement(ChevronRight, { className: "w-4 h-4" }))
						)
					)
				)
			),

			/* 7. MODAL EDIT / TAMBAH ITEM STANDAR SARPRAS PRODI */
			editingItem && /* @__PURE__ */ React.createElement("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn",
				onClick: () => setEditingItem(null)
			},
				/* @__PURE__ */ React.createElement("div", {
					className: "bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl",
					onClick: (e) => e.stopPropagation()
				},
					/* Modal Header */
					/* @__PURE__ */ React.createElement("div", { className: "bg-slate-800/95 px-5 sm:px-6 py-3.5 border-b border-slate-700/80 flex items-center justify-between" },
						/* @__PURE__ */ React.createElement("div", { className: "flex items-center space-x-3 min-w-0" },
							/* @__PURE__ */ React.createElement("div", { className: "w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 flex-shrink-0" },
								/* @__PURE__ */ React.createElement(GraduationCap, { className: "w-5 h-5" })
							),
							/* @__PURE__ */ React.createElement("div", { className: "min-w-0" },
								/* @__PURE__ */ React.createElement("h3", { className: "text-sm sm:text-base font-bold text-white truncate" },
									editingItem._isNew ? "Tambah Item Standar Sarpras Baru" : `Edit Item: ${editingItem.nama || editingItem.id}`
								),
								/* @__PURE__ */ React.createElement("p", { className: "text-[11px] text-slate-400 truncate" },
									editingItem._isNew
										? "Pencatatan item kurikulum standar prodi baru"
										: `${editingItem.id} • ${bidangMap[editingItem.bidangId]?.nama || editingItem.bidangId} • ${editingItem.grpName || ""}`
								)
							)
						),
						/* @__PURE__ */ React.createElement("button", {
							type: "button",
							onClick: () => setEditingItem(null),
							className: "w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors flex-shrink-0"
						}, /* @__PURE__ */ React.createElement(X, { className: "w-5 h-5" }))
					),
					/* Modal Form Body */
					/* @__PURE__ */ React.createElement("form", { onSubmit: handleSaveItem, className: "flex-1 overflow-y-auto p-5 sm:p-6 space-y-6" },
						/* Bagian 1: Informasi Standar Sarpras */
						/* @__PURE__ */ React.createElement("div", { className: "space-y-4" },
							/* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2 border-b border-slate-700/80 pb-2" },
								/* @__PURE__ */ React.createElement(Boxes, { className: "w-4 h-4 text-cyan-400" }),
								/* @__PURE__ */ React.createElement("h4", { className: "text-xs font-bold uppercase tracking-wider text-cyan-400" }, "Spesifikasi & Standar Minimal")
							),
							/* Grid Input Informasi */
							/* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs" },
								/* Nama Item */
								/* @__PURE__ */ React.createElement("div", { className: "sm:col-span-2 lg:col-span-2 space-y-1" },
									/* @__PURE__ */ React.createElement("label", { className: "font-semibold text-slate-300 block" },
										"Nama Jenis Prasarana / Sarana Standar ",
										/* @__PURE__ */ React.createElement("span", { className: "text-rose-400" }, "*")
									),
									/* @__PURE__ */ React.createElement("input", {
										type: "text",
										required: true,
										value: editingItem.nama || "",
										onChange: (e) => setEditingItem((prev) => ({ ...prev, nama: e.target.value })),
										placeholder: "Contoh: Simulator Radar & ARPA",
										className: "w-full py-2 px-3 bg-slate-800 text-white placeholder-slate-500 rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-500"
									})
								),
								/* Rumpun Prodi */
								/* @__PURE__ */ React.createElement("div", { className: "space-y-1" },
									/* @__PURE__ */ React.createElement("label", { className: "font-semibold text-slate-300 block" }, "Rumpun / Bidang Prodi"),
									/* @__PURE__ */ React.createElement("select", {
										value: editingItem.bidangId,
										disabled: !editingItem._isNew,
										onChange: (e) => {
											const newBid = e.target.value;
											const bObj = bidangMap[newBid] || {};
											const nextReal = {};
											(bObj.satdikIds || []).forEach((s) => { nextReal[s] = editingItem.real[s] ?? 0; });
											setEditingItem((prev) => ({ ...prev, bidangId: newBid, real: nextReal }));
										},
										className: "w-full py-2 px-3 bg-slate-800 text-white rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-500 disabled:opacity-60"
									},
										rawBidang.map((b) => /* @__PURE__ */ React.createElement("option", { key: b.id, value: b.id }, b.nama))
									)
								),
								/* Seksi Standar (A / B) */
								/* @__PURE__ */ React.createElement("div", { className: "space-y-1" },
									/* @__PURE__ */ React.createElement("label", { className: "font-semibold text-slate-300 block" }, "Seksi Standar"),
									/* @__PURE__ */ React.createElement("select", {
										value: editingItem.sec || "A",
										onChange: (e) => setEditingItem((prev) => ({ ...prev, sec: e.target.value, subSec: e.target.value })),
										className: "w-full py-2 px-3 bg-slate-800 text-white rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-500"
									},
										/* @__PURE__ */ React.createElement("option", { value: "A" }, "A. Prasarana (Ruang Lab / Workshop / Latih)"),
										/* @__PURE__ */ React.createElement("option", { value: "B" }, "B. Sarana (Peralatan & Perabot Praktik)")
									)
								),
								/* Kode Kelompok */
								/* @__PURE__ */ React.createElement("div", { className: "space-y-1" },
									/* @__PURE__ */ React.createElement("label", { className: "font-semibold text-slate-300 block" }, "Kode Kelompok"),
									/* @__PURE__ */ React.createElement("input", {
										type: "text",
										value: editingItem.grpCode || "",
										onChange: (e) => setEditingItem((prev) => ({ ...prev, grpCode: e.target.value })),
										placeholder: "Contoh: A.1 atau B.2.1",
										className: "w-full py-2 px-3 bg-slate-800 text-white placeholder-slate-500 rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-500"
									})
								),
								/* Nama Kelompok / Lab */
								/* @__PURE__ */ React.createElement("div", { className: "space-y-1" },
									/* @__PURE__ */ React.createElement("label", { className: "font-semibold text-slate-300 block" }, "Kelompok Fasilitas / Lab"),
									/* @__PURE__ */ React.createElement("input", {
										type: "text",
										value: editingItem.grpName || "",
										onChange: (e) => setEditingItem((prev) => ({ ...prev, grpName: e.target.value })),
										placeholder: "Contoh: BENGKEL MOTOR TEMPEL",
										className: "w-full py-2 px-3 bg-slate-800 text-white placeholder-slate-500 rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-500"
									})
								),
								/* Sub-Kelompok */
								/* @__PURE__ */ React.createElement("div", { className: "space-y-1" },
									/* @__PURE__ */ React.createElement("label", { className: "font-semibold text-slate-300 block" }, "Sub-Kelompok / Konteks"),
									/* @__PURE__ */ React.createElement("input", {
										type: "text",
										value: editingItem.subGrp || "",
										onChange: (e) => setEditingItem((prev) => ({ ...prev, subGrp: e.target.value })),
										placeholder: "Contoh: Peralatan, Perabot, dll.",
										className: "w-full py-2 px-3 bg-slate-800 text-white placeholder-slate-500 rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-500"
									})
								),
								/* Nomor Item */
								/* @__PURE__ */ React.createElement("div", { className: "space-y-1" },
									/* @__PURE__ */ React.createElement("label", { className: "font-semibold text-slate-300 block" }, "No. Urut Item"),
									/* @__PURE__ */ React.createElement("input", {
										type: "text",
										value: editingItem.no || "",
										onChange: (e) => setEditingItem((prev) => ({ ...prev, no: e.target.value })),
										placeholder: "Contoh: 1 atau a.",
										className: "w-full py-2 px-3 bg-slate-800 text-white placeholder-slate-500 rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-500"
									})
								),
								/* Standar Minimal Volume */
								/* @__PURE__ */ React.createElement("div", { className: "space-y-1" },
									/* @__PURE__ */ React.createElement("label", { className: "font-semibold text-slate-300 block" },
										"Standar Minimal Vol ",
										/* @__PURE__ */ React.createElement("span", { className: "text-rose-400" }, "*")
									),
									/* @__PURE__ */ React.createElement("input", {
										type: "number",
										required: true,
										min: "0",
										step: "any",
										value: editingItem.stdVol ?? 1,
										onChange: (e) => setEditingItem((prev) => ({ ...prev, stdVol: e.target.value })),
										className: "w-full py-2 px-3 bg-slate-800 text-white rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-500 font-mono font-bold"
									})
								),
								/* Satuan Unit */
								/* @__PURE__ */ React.createElement("div", { className: "space-y-1" },
									/* @__PURE__ */ React.createElement("label", { className: "font-semibold text-slate-300 block" }, "Satuan"),
									/* @__PURE__ */ React.createElement("input", {
										type: "text",
										value: editingItem.satuan || "",
										onChange: (e) => setEditingItem((prev) => ({ ...prev, satuan: e.target.value })),
										placeholder: "Unit / Buah / Set / Paket / Ruang",
										className: "w-full py-2 px-3 bg-slate-800 text-white placeholder-slate-500 rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-500"
									})
								),
								/* Kondisi Audit */
								/* @__PURE__ */ React.createElement("div", { className: "space-y-1" },
									/* @__PURE__ */ React.createElement("label", { className: "font-semibold text-slate-300 block" }, "Kondisi Audit Fisik"),
									/* @__PURE__ */ React.createElement("select", {
										value: editingItem.kondisi || "Baik",
										onChange: (e) => setEditingItem((prev) => ({ ...prev, kondisi: e.target.value })),
										className: "w-full py-2 px-3 bg-slate-800 text-white rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-500"
									},
										/* @__PURE__ */ React.createElement("option", { value: "Baik" }, "Baik (B)"),
										/* @__PURE__ */ React.createElement("option", { value: "Rusak Ringan" }, "Rusak Ringan (RR)"),
										/* @__PURE__ */ React.createElement("option", { value: "Rusak Berat" }, "Rusak Berat (RB)")
									)
								),
								/* Catatan Audit */
								/* @__PURE__ */ React.createElement("div", { className: "sm:col-span-2 lg:col-span-3 space-y-1" },
									/* @__PURE__ */ React.createElement("label", { className: "font-semibold text-slate-300 block" }, "Catatan Audit / Keterangan"),
									/* @__PURE__ */ React.createElement("textarea", {
										rows: "2",
										value: editingItem.ket || "",
										onChange: (e) => setEditingItem((prev) => ({ ...prev, ket: e.target.value })),
										placeholder: "Catatan audit fasilitas, pemanfaatan alat, status pengadaan...",
										className: "w-full py-2 px-3 bg-slate-800 text-white placeholder-slate-500 rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-500 text-xs resize-none"
									})
								)
							)
						),

						/* Bagian 2: Ketersediaan Riil per Kampus Satdik */
						(() => {
							const itemBidangObj = bidangMap[editingItem.bidangId] || {};
							const targetSids = Array.isArray(itemBidangObj.satdikIds) && itemBidangObj.satdikIds.length > 0
								? itemBidangObj.satdikIds
								: matrixSatdikIds;
							const sv = Number(editingItem.stdVol) || 1;

							return /* @__PURE__ */ React.createElement("div", { className: "space-y-3 pt-2" },
								/* Sub-Header Realisasi Kampus */
								/* @__PURE__ */ React.createElement("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700/80 pb-2" },
									/* @__PURE__ */ React.createElement("div", null,
										/* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" },
											/* @__PURE__ */ React.createElement(Building2, { className: "w-4 h-4 text-emerald-400" }),
											/* @__PURE__ */ React.createElement("h4", { className: "text-xs font-bold uppercase tracking-wider text-emerald-400" }, "Ketersediaan Riil Kampus Satuan Pendidikan")
										),
										/* @__PURE__ */ React.createElement("p", { className: "text-[11px] text-slate-400 mt-0.5" },
											`Masukkan volume ketersediaan fisik pada ${targetSids.length} kampus penyelenggara rumpun prodi ini (Standar: ${sv} ${editingItem.satuan || "Unit"}).`
										)
									),
									/* Quick Action Buttons */
									/* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-1.5 flex-shrink-0 text-[11px]" },
										/* @__PURE__ */ React.createElement("button", {
											type: "button",
											onClick: () => {
												const nextReal = { ...(editingItem.real || {}) };
												targetSids.forEach((sid) => {
													if (!lockedSatdik || lockedSatdik === sid) {
														nextReal[sid] = sv;
													}
												});
												setEditingItem((prev) => ({ ...prev, real: nextReal }));
											},
											className: "px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-medium transition-colors"
										}, `Set Sesuai Standar (${sv})`),
										/* @__PURE__ */ React.createElement("button", {
											type: "button",
											onClick: () => {
												const nextReal = { ...(editingItem.real || {}) };
												targetSids.forEach((sid) => {
													if (!lockedSatdik || lockedSatdik === sid) {
														nextReal[sid] = 0;
													}
												});
												setEditingItem((prev) => ({ ...prev, real: nextReal }));
											},
											className: "px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-medium transition-colors"
										}, "Set 0 Semua")
									)
								),
								/* Grid Card Realisasi Kampus */
								/* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3" },
									targetSids.map((sid) => {
										const sat = satdikMap[sid];
										const val = editingItem.real && editingItem.real[sid] !== undefined
											? editingItem.real[sid]
											: 0;
										const numVal = Number(val) || 0;
										const isFocused = editingItem._focusSatdikId === sid;
										const isLockedForOther = Boolean(lockedSatdik && lockedSatdik !== sid);

										const badge = numVal >= sv
											? { text: `Memenuhi (${numVal}/${sv})`, cls: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30" }
											: numVal > 0
												? { text: `Kurang ${sv - numVal} (${numVal}/${sv})`, cls: "bg-amber-500/20 text-amber-300 border border-amber-500/30" }
												: { text: "Belum Ada (0)", cls: "bg-rose-500/15 text-rose-400 border border-rose-500/30" };

										return /* @__PURE__ */ React.createElement("div", {
											key: sid,
											className: `p-3 rounded-xl border transition-all ${
												isFocused
													? "bg-slate-800/90 border-cyan-500 shadow-md ring-1 ring-cyan-500/50"
													: "bg-slate-800/50 border-slate-700/70 hover:border-slate-600"
											} ${isLockedForOther ? "opacity-50" : ""}`
										},
											/* Info Kampus */
											/* @__PURE__ */ React.createElement("div", { className: "flex items-start justify-between gap-1 mb-2" },
												/* @__PURE__ */ React.createElement("div", { className: "min-w-0" },
													/* @__PURE__ */ React.createElement("div", { className: "font-semibold text-white text-xs truncate" },
														sat?.shortName || sat?.name || sid
													),
													/* @__PURE__ */ React.createElement("div", { className: "text-[10px] text-slate-400 truncate" },
														sat?.kota ? `${sat.kota}, ${sat.provinsi}` : (sat?.name || "")
													)
												),
												/* @__PURE__ */ React.createElement("span", {
													className: `px-1.5 py-0.5 rounded text-[10px] font-bold border flex-shrink-0 ${badge.cls}`
												}, badge.text)
											),
											/* Input Realisasi Kampus */
											/* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" },
												/* @__PURE__ */ React.createElement("input", {
													type: "number",
													min: "0",
													step: "any",
													disabled: isLockedForOther,
													value: val,
													onChange: (e) => {
														const v = e.target.value === "" ? "" : Number(e.target.value);
														setEditingItem((prev) => ({
															...prev,
															real: { ...(prev.real || {}), [sid]: v }
														}));
													},
													className: "w-full py-1.5 px-3 bg-slate-900 text-white rounded-lg border border-slate-700 focus:outline-none focus:border-cyan-500 font-mono font-bold text-xs disabled:opacity-50"
												}),
												/* @__PURE__ */ React.createElement("span", { className: "text-[11px] text-slate-400 font-medium whitespace-nowrap" },
													editingItem.satuan || "Unit"
												)
											),
											isLockedForOther && /* @__PURE__ */ React.createElement("div", { className: "text-[10px] text-slate-500 mt-1 italic" },
												"Terkunci untuk operator satdik lain"
											)
										);
									})
								)
							);
						})(),

						/* Modal Form Actions */
						/* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-end gap-2.5 pt-4 border-t border-slate-700/80" },
							/* @__PURE__ */ React.createElement("button", {
								type: "button",
								onClick: () => setEditingItem(null),
								className: "px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
							}, "Batal"),
							/* @__PURE__ */ React.createElement("button", {
								type: "submit",
								disabled: isSaving,
								className: "inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-cyan-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
							},
								/* @__PURE__ */ React.createElement(Save, { className: "w-4 h-4" }),
								/* @__PURE__ */ React.createElement("span", null, isSaving ? "Menyimpan Perubahan..." : "Simpan Data Standar")
							)
						)
					)
				)
			)
		);
	};
})();
const StandarProdiView = window.__StandarProdiView;
// ============================================================================
// MODULE: src/components/TambakKolamView.jsx
// ============================================================================
(() => {
	const { useState, useMemo, useRef } = React;
	const { Bar } = window.__VENDOR__.ReactChartJS2;
	const {
		Fish,
		Layers,
		MapPin,
		Compass,
		Activity,
		Wrench,
		CheckCircle2,
		AlertTriangle,
		ExternalLink,
		Building2,
		PlusCircle,
		Edit3,
		X,
		Save,
		Search,
		Filter,
		Download,
		RotateCcw,
		ArrowUpDown,
		ChevronLeft,
		ChevronRight,
		Info,
		FileText
	} = window.__VENDOR__.Lucide;

	const JENIS_OPTIONS = ["Tambak", "Kolam", "Tandon", "Bak / Biofloc"];
	const KONDISI_OPTIONS = ["Baik", "Rusak Ringan", "Rusak Berat"];
	const STATUS_OP_OPTIONS = [
		"Aktif Budidaya",
		"Tandon / Pendukung",
		"Belum Dimanfaatkan",
		"Rusak / Tidak Berfungsi",
		"Koperasi / Sewa"
	];
	const PELATARAN_KAT_OPTIONS = [
		"HDPE / Geomembran",
		"Tanah",
		"Beton / Semen",
		"Fiber / Terpal"
	];

	window.__TambakKolamView = function TambakKolamView({
		tambakData,
		satdikList,
		currentUser,
		onAddUnit,
		onUpdateUnit,
		onDeleteUnit,
		onExportExcel
	}) {
		const { isDark } = useTheme();
		const detailSectionRef = useRef(null);

		const masterSatdik = useMemo(
			() => (Array.isArray(satdikList) && satdikList.length > 0 ? satdikList : window.SARPRAS_DATA?.SATDIK_LIST || []),
			[satdikList]
		);
		const satdikMap = useMemo(() => {
			const m = {};
			masterSatdik.forEach((s) => {
				m[s.id] = s;
			});
			return m;
		}, [masterSatdik]);

		const lockedSatdik = currentUser?.accessibleSatdik && currentUser.accessibleSatdik !== "ALL"
			? currentUser.accessibleSatdik
			: null;

		const [jenjangFilter, setJenjangFilter] = useState("ALL");
		const [selectedSatdik, setSelectedSatdik] = useState(() => lockedSatdik || "ALL");
		const [jenisFilter, setJenisFilter] = useState("ALL");
		const [kondisiFilter, setKondisiFilter] = useState("ALL");
		const [pelataranFilter, setPelataranFilter] = useState("ALL");
		const [statusOpFilter, setStatusOpFilter] = useState("ALL");
		const [searchQuery, setSearchQuery] = useState("");
		const [chartMetric, setChartMetric] = useState("luas"); // "luas" | "unit"
		const [sortField, setSortField] = useState("noUrut");
		const [sortOrder, setSortOrder] = useState("asc");
		const [currentPage, setCurrentPage] = useState(1);
		const [pageSize, setPageSize] = useState(25);

		// Modal CRUD State
		const [editingUnit, setEditingUnit] = useState(null); // null | { mode: 'add' | 'edit', data: {...} }
		const [isSaving, setIsSaving] = useState(false);

		const canEdit = Boolean(
			currentUser?.permissions?.includes("edit_all") || currentUser?.permissions?.includes("edit_own")
		);
		const canEditSatdik = (satdikId) => {
			if (!canEdit) return false;
			if (currentUser?.permissions?.includes("edit_all")) return true;
			return currentUser?.accessibleSatdik === satdikId;
		};

		const rawSummary = useMemo(() => tambakData?.summary || [], [tambakData]);
		const rawUnits = useMemo(() => tambakData?.units || [], [tambakData]);

		// Filter Summary (18 Satdik)
		const filteredSummary = useMemo(() => {
			return rawSummary.filter((s) => {
				if (lockedSatdik && s.satdikId !== lockedSatdik) return false;
				if (selectedSatdik !== "ALL" && s.satdikId !== selectedSatdik) return false;
				if (jenjangFilter === "PT" && s.jenjang === "SUPM") return false;
				if (jenjangFilter === "SUPM" && s.jenjang !== "SUPM") return false;
				return true;
			});
		}, [rawSummary, lockedSatdik, selectedSatdik, jenjangFilter]);

		const allowedSatdikIds = useMemo(() => new Set(filteredSummary.map((s) => s.satdikId)), [filteredSummary]);

		// Filter Units (370 Unit)
		const filteredUnits = useMemo(() => {
			const q = searchQuery.trim().toLowerCase();
			return rawUnits.filter((u) => {
				if (!allowedSatdikIds.has(u.satdikId)) return false;
				if (jenisFilter !== "ALL" && u.jenis !== jenisFilter) return false;
				if (kondisiFilter !== "ALL" && u.kondisi !== kondisiFilter) return false;
				if (pelataranFilter !== "ALL" && u.pelataranKategori !== pelataranFilter) return false;
				if (statusOpFilter !== "ALL" && u.statusOperasional !== statusOpFilter) return false;
				if (q) {
					const hay = [
						u.id,
						u.nama,
						u.namaSatdik,
						u.jenis,
						u.kampusLokasi,
						u.fungsi,
						u.pelataran,
						u.listrik,
						u.kincir,
						u.lokasiLabel,
						u.keterangan
					]
						.filter(Boolean)
						.join(" ")
						.toLowerCase();
					if (!hay.includes(q)) return false;
				}
				return true;
			});
		}, [rawUnits, allowedSatdikIds, jenisFilter, kondisiFilter, pelataranFilter, statusOpFilter, searchQuery]);

		// Sort Units
		const sortedUnits = useMemo(() => {
			const arr = [...filteredUnits];
			arr.sort((a, b) => {
				let va = a[sortField];
				let vb = b[sortField];
				if (sortField === "luasM2" || sortField === "jumlahKincir" || sortField === "noUrut") {
					va = Number(va) || 0;
					vb = Number(vb) || 0;
					if (va === vb && sortField === "noUrut") {
						return String(a.satdikId).localeCompare(String(b.satdikId));
					}
					return sortOrder === "asc" ? va - vb : vb - va;
				}
				va = String(va || "").toLowerCase();
				vb = String(vb || "").toLowerCase();
				return sortOrder === "asc" ? va.localeCompare(vb, "id") : vb.localeCompare(va, "id");
			});
			return arr;
		}, [filteredUnits, sortField, sortOrder]);

		// Aggregate KPI Stats from filteredUnits & filteredSummary
		const stats = useMemo(() => {
			let totalUnit = 0,
				jmlTambak = 0,
				jmlKolam = 0,
				jmlTandon = 0,
				jmlBak = 0;
			let luasTotal = 0,
				luasTambak = 0,
				luasKolam = 0;
			let baik = 0,
				rr = 0,
				rb = 0;
			let totalKincir = 0;
			const pelataranCounts = {
				"HDPE / Geomembran": 0,
				"Tanah": 0,
				"Beton / Semen": 0,
				"Fiber / Terpal": 0
			};
			const statusCounts = {
				"Aktif Budidaya": 0,
				"Tandon / Pendukung": 0,
				"Belum Dimanfaatkan": 0,
				"Rusak / Tidak Berfungsi": 0,
				"Koperasi / Sewa": 0
			};

			filteredUnits.forEach((u) => {
				totalUnit++;
				const luas = Number(u.luasM2) || 0;
				luasTotal += luas;
				if (u.jenis === "Tambak") {
					jmlTambak++;
					luasTambak += luas;
				} else if (u.jenis === "Kolam") {
					jmlKolam++;
					luasKolam += luas;
				} else if (u.jenis === "Tandon") {
					jmlTandon++;
					luasKolam += luas;
				} else {
					jmlBak++;
					luasKolam += luas;
				}

				if (u.kondisi === "Baik") baik++;
				else if (u.kondisi === "Rusak Ringan") rr++;
				else rb++;

				totalKincir += Number(u.jumlahKincir) || 0;
				const pk = u.pelataranKategori || "Tanah";
				pelataranCounts[pk] = (pelataranCounts[pk] || 0) + 1;

				const st = u.statusOperasional || "Aktif Budidaya";
				statusCounts[st] = (statusCounts[st] || 0) + 1;
			});

			const pctBaik = totalUnit > 0 ? Math.round((baik / totalUnit) * 1000) / 10 : 0;
			const pctRR = totalUnit > 0 ? Math.round((rr / totalUnit) * 1000) / 10 : 0;
			const pctRB = totalUnit > 0 ? Math.round((rb / totalUnit) * 1000) / 10 : 0;
			const satdikWithUnits = filteredSummary.filter((s) => (Number(s.jumlahUnit) || 0) > 0).length;

			return {
				totalSatdik: filteredSummary.length,
				satdikWithUnits,
				totalUnit,
				jmlTambak,
				jmlKolam,
				jmlTandon,
				jmlBak,
				luasTotal,
				luasHa: luasTotal / 10000,
				luasTambak,
				luasKolam,
				baik,
				rr,
				rb,
				pctBaik,
				pctRR,
				pctRB,
				totalKincir,
				pelataranCounts,
				statusCounts
			};
		}, [filteredUnits, filteredSummary]);

		// Chart Data (Satdik comparison)
		const chartConfig = useMemo(() => {
			const activeRows = filteredSummary
				.filter((s) => s.jumlahUnit > 0)
				.slice()
				.sort((a, b) =>
					chartMetric === "luas"
						? (Number(b.luasTotalM2) || 0) - (Number(a.luasTotalM2) || 0)
						: (Number(b.jumlahUnit) || 0) - (Number(a.jumlahUnit) || 0)
				);

			const labels = activeRows.map((s) => {
				const sat = satdikMap[s.satdikId];
				return sat?.shortName || s.namaSatdik;
			});

			const dataTambak = activeRows.map((s) =>
				chartMetric === "luas" ? Math.round(Number(s.luasTambakM2) || 0) : Number(s.jumlahTambak) || 0
			);
			const dataKolam = activeRows.map((s) =>
				chartMetric === "luas"
					? Math.round(Number(s.luasKolamM2) || 0)
					: (Number(s.jumlahKolam) || 0) + (Number(s.jumlahTandon) || 0)
			);

			const textColor = isDark ? "#cbd5e1" : "#0f172a";
			const gridColor = isDark ? "rgba(51, 65, 85, 0.35)" : "#e2e8f0";

			return {
				data: {
					labels,
					datasets: [
						{
							label: chartMetric === "luas" ? "Luas Tambak (m²)" : "Unit Tambak",
							data: dataTambak,
							backgroundColor: isDark ? "rgba(6, 182, 212, 0.85)" : "#0891b2",
							borderColor: "#06b6d4",
							borderWidth: 1,
							borderRadius: 5
						},
						{
							label: chartMetric === "luas" ? "Luas Kolam / Tandon / Bak (m²)" : "Unit Kolam / Tandon / Bak",
							data: dataKolam,
							backgroundColor: isDark ? "rgba(16, 185, 129, 0.85)" : "#059669",
							borderColor: "#10b981",
							borderWidth: 1,
							borderRadius: 5
						}
					]
				},
				options: {
					responsive: true,
					maintainAspectRatio: false,
					plugins: {
						legend: {
							position: "top",
							labels: {
								color: textColor,
								font: { size: 11, weight: "600" },
								boxWidth: 12
							}
						},
						tooltip: {
							callbacks: {
								label: (ctx) => {
									const val = Number(ctx.raw) || 0;
									if (chartMetric === "luas") {
										return `${ctx.dataset.label}: ${val.toLocaleString("id-ID")} m² (${(val / 10000).toFixed(2)} Ha)`;
									}
									return `${ctx.dataset.label}: ${val.toLocaleString("id-ID")} Unit`;
								}
							}
						}
					},
					scales: {
						x: {
							stacked: true,
							grid: { display: false },
							ticks: {
								color: textColor,
								font: { size: 10, weight: "600" },
								maxRotation: 35,
								minRotation: 20
							}
						},
						y: {
							stacked: true,
							grid: { color: gridColor },
							ticks: {
								color: textColor,
								font: { size: 10 },
								callback: (v) => (chartMetric === "luas" ? Number(v).toLocaleString("id-ID") + " m²" : v)
							}
						}
					}
				}
			};
		}, [filteredSummary, satdikMap, chartMetric, isDark]);

		const totalPages = pageSize === "ALL" ? 1 : Math.max(1, Math.ceil(sortedUnits.length / Number(pageSize)));
		const paginatedUnits = useMemo(() => {
			if (pageSize === "ALL") return sortedUnits;
			const sz = Number(pageSize) || 25;
			const start = (currentPage - 1) * sz;
			return sortedUnits.slice(start, start + sz);
		}, [sortedUnits, currentPage, pageSize]);

		const handleSort = (field) => {
			if (sortField === field) {
				setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
			} else {
				setSortField(field);
				setSortOrder(field === "luasM2" || field === "jumlahKincir" ? "desc" : "asc");
			}
			setCurrentPage(1);
		};

		const handleResetFilters = () => {
			if (!lockedSatdik) setSelectedSatdik("ALL");
			setJenjangFilter("ALL");
			setJenisFilter("ALL");
			setKondisiFilter("ALL");
			setPelataranFilter("ALL");
			setStatusOpFilter("ALL");
			setSearchQuery("");
			setCurrentPage(1);
		};

		const handleSelectSatdikDrilldown = (satdikId) => {
			setSelectedSatdik(satdikId);
			setCurrentPage(1);
			if (detailSectionRef.current) {
				detailSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
			}
		};

		const openAddUnitModal = () => {
			const defaultSatdik = lockedSatdik || (selectedSatdik !== "ALL" ? selectedSatdik : "poltek-aup");
			const existingInSatdik = rawUnits.filter((u) => u.satdikId === defaultSatdik);
			const nextNo = existingInSatdik.length + 1;
			setEditingUnit({
				mode: "add",
				data: {
					satdikId: defaultSatdik,
					noUrut: nextNo,
					nama: "",
					jenis: "Tambak",
					kampusLokasi: satdikMap[defaultSatdik]?.kota ? `Kampus ${satdikMap[defaultSatdik].kota}` : "Lingkungan Kampus",
					luasM2: 1000,
					kondisi: "Baik",
					fungsi: "Budidaya Udang Vannamei (TEFA)",
					statusOperasional: "Aktif Budidaya",
					pelataran: "HDPE",
					listrik: "Tersedia Daya Listrik",
					kincir: "4 unit @ 1HP",
					jumlahKincir: 4,
					lokasiLabel: "Lingkungan Kampus",
					mapUrl: "",
					keterangan: "Lokasi dalam lingkungan kampus"
				}
			});
		};

		const openEditUnitModal = (unit) => {
			setEditingUnit({
				mode: "edit",
				data: { ...unit }
			});
		};

		const handleSaveUnit = async (e) => {
			e.preventDefault();
			if (!editingUnit?.data?.nama || !editingUnit?.data?.satdikId) {
				alert("Nama Tambak/Kolam dan Satuan Pendidikan wajib diisi.");
				return;
			}
			setIsSaving(true);
			try {
				const d = editingUnit.data;
				const payload = {
					...d,
					luasM2: Number(d.luasM2) || 0,
					jumlahKincir: Number(d.jumlahKincir) || 0,
					noUrut: Number(d.noUrut) || 1
				};
				if (editingUnit.mode === "add" && onAddUnit) {
					await onAddUnit(payload);
				} else if (editingUnit.mode === "edit" && onUpdateUnit) {
					await onUpdateUnit(d.id, payload);
				}
				setEditingUnit(null);
			} catch (err) {
				alert("Gagal menyimpan data tambak/kolam: " + (err?.message || "Kesalahan jaringan"));
			} finally {
				setIsSaving(false);
			}
		};

		const handleDeleteClick = async (unit) => {
			if (!window.confirm(`Hapus unit "${unit.nama}" (${unit.namaSatdik}) dari daftar Tambak & Kolam?`)) {
				return;
			}
			try {
				if (onDeleteUnit) {
					await onDeleteUnit(unit.id);
				}
			} catch (err) {
				alert("Gagal menghapus unit: " + (err?.message || "Kesalahan jaringan"));
			}
		};

		const isFiltered =
			(!lockedSatdik && selectedSatdik !== "ALL") ||
			jenjangFilter !== "ALL" ||
			jenisFilter !== "ALL" ||
			kondisiFilter !== "ALL" ||
			pelataranFilter !== "ALL" ||
			statusOpFilter !== "ALL" ||
			searchQuery.trim() !== "";

		return /* @__PURE__ */ React.createElement(
			"div",
			{ className: "space-y-6" },
			// 1. HERO BANNER
			/* @__PURE__ */ React.createElement(
				"div",
				{
					className:
						"bg-gradient-to-r from-slate-800/95 via-cyan-950/60 to-slate-900/95 rounded-2xl p-5 sm:p-6 border border-cyan-500/30 shadow-xl relative overflow-hidden"
				},
				/* @__PURE__ */ React.createElement(
					"div",
					{ className: "flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10" },
					/* @__PURE__ */ React.createElement(
						"div",
						{ className: "space-y-1.5 max-w-3xl" },
						/* @__PURE__ */ React.createElement(
							"div",
							{ className: "flex flex-wrap items-center gap-2" },
							/* @__PURE__ */ React.createElement(
								"span",
								{
									className:
										"inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
								},
								/* @__PURE__ */ React.createElement(Fish, { className: "w-3.5 h-3.5" }),
								"Prasarana & Sarana Budidaya Perikanan"
							),
							/* @__PURE__ */ React.createElement(
								"span",
								{
									className:
										"px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
								},
								"Data Audit Tahun 2025 · 18 Satdik KKP"
							)
						),
						/* @__PURE__ */ React.createElement(
							"h2",
							{ className: "text-xl sm:text-2xl font-extrabold text-white tracking-tight" },
							"Inventaris & Analitik Tambak dan Kolam Satuan Pendidikan"
						),
						/* @__PURE__ */ React.createElement(
							"p",
							{ className: "text-xs sm:text-sm text-slate-300 leading-relaxed" },
							"Pemetaan menyeluruh prasarana ",
							/* @__PURE__ */ React.createElement("strong", { className: "text-cyan-300" }, "Tambak, Kolam Air Tawar/Payau, Tandon, dan Bak Pembenihan/Biofloc"),
							" beserta spesifikasi konstruksi pelataran (HDPE, Beton, Tanah, Fiber), daya listrik, jumlah kincir air, dan titik koordinat Google Maps/Earth pada 18 Satuan Pendidikan Vokasi KKP."
						)
					),
					/* @__PURE__ */ React.createElement(
						"div",
						{ className: "flex flex-wrap items-center gap-2.5 self-start lg:self-center" },
						/* @__PURE__ */ React.createElement(
							"a",
							{
								href: "Excel/1c-Data%20Tambak%20dan%20Kolam%20Satuan%20Pendidikan.pdf",
								target: "_blank",
								rel: "noopener noreferrer",
								className:
									"inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/40 text-xs font-semibold transition-all shadow-sm"
							},
							/* @__PURE__ */ React.createElement(FileText, { className: "w-4 h-4 text-cyan-400" }),
							/* @__PURE__ */ React.createElement("span", null, "Dokumen PDF Asli (26 Hal)"),
							/* @__PURE__ */ React.createElement(ExternalLink, { className: "w-3.5 h-3.5 opacity-75" })
						)
					)
				)
			),

			// 2. GLOBAL FILTER BAR
			/* @__PURE__ */ React.createElement(
				"div",
				{
					className:
						"bg-slate-800/90 rounded-2xl p-4 border border-slate-700/70 shadow-md flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3"
				},
				/* @__PURE__ */ React.createElement(
					"div",
					{ className: "flex flex-wrap items-center gap-2" },
					/* @__PURE__ */ React.createElement(
						"div",
						{ className: "flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-700/70" },
						[
							{ id: "ALL", label: "Semua Jenjang (18)" },
							{ id: "PT", label: "Politeknik & AKKP (11)" },
							{ id: "SUPM", label: "SUPM (7)" }
						].map((tab) =>
							/* @__PURE__ */ React.createElement(
								"button",
								{
									key: tab.id,
									disabled: Boolean(lockedSatdik),
									onClick: () => {
										setJenjangFilter(tab.id);
										setSelectedSatdik("ALL");
										setCurrentPage(1);
									},
									className: `px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
										jenjangFilter === tab.id
											? "bg-cyan-600 text-white shadow"
											: "text-slate-400 hover:text-slate-200"
									} ${lockedSatdik ? "opacity-60 cursor-not-allowed" : ""}`
								},
								tab.label
							)
						)
					),
					/* @__PURE__ */ React.createElement(
						"select",
						{
							value: selectedSatdik,
							disabled: Boolean(lockedSatdik),
							onChange: (e) => {
								setSelectedSatdik(e.target.value);
								setCurrentPage(1);
							},
							className:
								"bg-slate-900 text-slate-100 text-xs font-semibold rounded-xl px-3 py-2 border border-slate-700 focus:outline-none focus:border-cyan-500"
						},
						/* @__PURE__ */ React.createElement("option", { value: "ALL" }, "Semua Satuan Pendidikan (18 Satdik)"),
						rawSummary
							.filter((s) => {
								if (jenjangFilter === "PT") return s.jenjang !== "SUPM";
								if (jenjangFilter === "SUPM") return s.jenjang === "SUPM";
								return true;
							})
							.map((s) =>
								/* @__PURE__ */ React.createElement(
									"option",
									{ key: s.satdikId, value: s.satdikId },
									`${s.namaSatdik} (${s.jumlahUnit} Unit · ${(Number(s.luasTotalM2) || 0).toLocaleString("id-ID")} m²)`
								)
							)
					),
					/* @__PURE__ */ React.createElement(
						"div",
						{ className: "flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-700/70" },
						["ALL", ...JENIS_OPTIONS].map((j) =>
							/* @__PURE__ */ React.createElement(
								"button",
								{
									key: j,
									onClick: () => {
										setJenisFilter(j);
										setCurrentPage(1);
									},
									className: `px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
										jenisFilter === j
											? "bg-emerald-600 text-white shadow"
											: "text-slate-400 hover:text-slate-200"
									}`
								},
								j === "ALL" ? "Semua Jenis" : j
							)
						)
					)
				),
				isFiltered &&
					/* @__PURE__ */ React.createElement(
						"button",
						{
							onClick: handleResetFilters,
							className:
								"inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 text-xs font-semibold transition-all self-start lg:self-center"
						},
						/* @__PURE__ */ React.createElement(RotateCcw, { className: "w-3.5 h-3.5" }),
						"Reset Filter"
					)
			),

			// 3. 4 EXECUTIVE KPI CARDS
			/* @__PURE__ */ React.createElement(
				"div",
				{ className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" },
				// Card 1: Total Unit
				/* @__PURE__ */ React.createElement(
					"div",
					{ className: "bg-slate-800/90 rounded-2xl p-4 border border-slate-700/70 shadow-md flex flex-col justify-between" },
					/* @__PURE__ */ React.createElement(
						"div",
						{ className: "flex items-center justify-between" },
						/* @__PURE__ */ React.createElement(
							"span",
							{ className: "text-xs font-bold uppercase tracking-wider text-slate-400" },
							"Total Unit Prasarana"
						),
						/* @__PURE__ */ React.createElement(
							"div",
							{ className: "w-9 h-9 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center" },
							/* @__PURE__ */ React.createElement(Fish, { className: "w-5 h-5" })
						)
					),
					/* @__PURE__ */ React.createElement(
						"div",
						{ className: "my-2.5" },
						/* @__PURE__ */ React.createElement(
							"div",
							{ className: "flex items-baseline gap-2" },
							/* @__PURE__ */ React.createElement(
								"span",
								{ className: "text-2xl sm:text-3xl font-black text-white" },
								stats.totalUnit.toLocaleString("id-ID")
							),
							/* @__PURE__ */ React.createElement(
								"span",
								{ className: "text-xs font-semibold text-cyan-400" },
								`Petak / Kolam (${stats.satdikWithUnits}/${stats.totalSatdik} Satdik)`
							)
						)
					),
					/* @__PURE__ */ React.createElement(
						"div",
						{ className: "grid grid-cols-3 gap-1.5 pt-2.5 border-t border-slate-700/60 text-[11px]" },
						/* @__PURE__ */ React.createElement(
							"div",
							{ className: "bg-slate-900/70 px-2 py-1 rounded-lg text-center" },
							/* @__PURE__ */ React.createElement("span", { className: "text-slate-400 block text-[10px]" }, "Tambak"),
							/* @__PURE__ */ React.createElement("span", { className: "text-cyan-300 font-bold" }, stats.jmlTambak)
						),
						/* @__PURE__ */ React.createElement(
							"div",
							{ className: "bg-slate-900/70 px-2 py-1 rounded-lg text-center" },
							/* @__PURE__ */ React.createElement("span", { className: "text-slate-400 block text-[10px]" }, "Kolam"),
							/* @__PURE__ */ React.createElement("span", { className: "text-emerald-300 font-bold" }, stats.jmlKolam)
						),
						/* @__PURE__ */ React.createElement(
							"div",
							{ className: "bg-slate-900/70 px-2 py-1 rounded-lg text-center" },
							/* @__PURE__ */ React.createElement("span", { className: "text-slate-400 block text-[10px]" }, "Tandon/Bak"),
							/* @__PURE__ */ React.createElement("span", { className: "text-amber-300 font-bold" }, stats.jmlTandon + stats.jmlBak)
						)
					)
				),

				// Card 2: Total Luas Lahan Air
				/* @__PURE__ */ React.createElement(
					"div",
					{ className: "bg-slate-800/90 rounded-2xl p-4 border border-slate-700/70 shadow-md flex flex-col justify-between" },
					/* @__PURE__ */ React.createElement(
						"div",
						{ className: "flex items-center justify-between" },
						/* @__PURE__ */ React.createElement(
							"span",
							{ className: "text-xs font-bold uppercase tracking-wider text-slate-400" },
							"Total Luas Lahan Air"
						),
						/* @__PURE__ */ React.createElement(
							"div",
							{ className: "w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center" },
							/* @__PURE__ */ React.createElement(Compass, { className: "w-5 h-5" })
						)
					),
					/* @__PURE__ */ React.createElement(
						"div",
						{ className: "my-2.5" },
						/* @__PURE__ */ React.createElement(
							"div",
							{ className: "flex items-baseline gap-2" },
							/* @__PURE__ */ React.createElement(
								"span",
								{ className: "text-2xl sm:text-3xl font-black text-emerald-400" },
								stats.luasHa.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
								" Ha"
							),
							/* @__PURE__ */ React.createElement(
								"span",
								{ className: "text-xs text-slate-300 font-mono" },
								`(${Math.round(stats.luasTotal).toLocaleString("id-ID")} m²)`
							)
						)
					),
					/* @__PURE__ */ React.createElement(
						"div",
						{ className: "grid grid-cols-2 gap-1.5 pt-2.5 border-t border-slate-700/60 text-[11px]" },
						/* @__PURE__ */ React.createElement(
							"div",
							{ className: "bg-slate-900/70 px-2 py-1 rounded-lg" },
							/* @__PURE__ */ React.createElement("span", { className: "text-slate-400 block text-[10px]" }, "Luas Tambak"),
							/* @__PURE__ */ React.createElement(
								"span",
								{ className: "text-cyan-300 font-bold" },
								`${Math.round(stats.luasTambak).toLocaleString("id-ID")} m²`
							)
						),
						/* @__PURE__ */ React.createElement(
							"div",
							{ className: "bg-slate-900/70 px-2 py-1 rounded-lg" },
							/* @__PURE__ */ React.createElement("span", { className: "text-slate-400 block text-[10px]" }, "Kolam & Tandon"),
							/* @__PURE__ */ React.createElement(
								"span",
								{ className: "text-emerald-300 font-bold" },
								`${Math.round(stats.luasKolam).toLocaleString("id-ID")} m²`
							)
						)
					)
				),

				// Card 3: Kondisi Fisik Prasarana
				/* @__PURE__ */ React.createElement(
					"div",
					{ className: "bg-slate-800/90 rounded-2xl p-4 border border-slate-700/70 shadow-md flex flex-col justify-between" },
					/* @__PURE__ */ React.createElement(
						"div",
						{ className: "flex items-center justify-between" },
						/* @__PURE__ */ React.createElement(
							"span",
							{ className: "text-xs font-bold uppercase tracking-wider text-slate-400" },
							"Kelayakan Kondisi Fisik"
						),
						/* @__PURE__ */ React.createElement(
							"div",
							{ className: "w-9 h-9 rounded-xl bg-sky-500/15 text-sky-400 flex items-center justify-center" },
							/* @__PURE__ */ React.createElement(CheckCircle2, { className: "w-5 h-5" })
						)
					),
					/* @__PURE__ */ React.createElement(
						"div",
						{ className: "my-2.5" },
						/* @__PURE__ */ React.createElement(
							"div",
							{ className: "flex items-baseline gap-2" },
							/* @__PURE__ */ React.createElement(
								"span",
								{ className: "text-2xl sm:text-3xl font-black text-white" },
								`${stats.pctBaik}%`
							),
							/* @__PURE__ */ React.createElement(
								"span",
								{ className: "text-xs text-emerald-400 font-semibold" },
								`${stats.baik} Unit Kondisi Baik`
							)
						),
						/* @__PURE__ */ React.createElement(
							"div",
							{ className: "w-full h-2 bg-slate-900 rounded-full overflow-hidden flex mt-2" },
							/* @__PURE__ */ React.createElement("div", {
								className: "bg-emerald-500 h-full",
								style: { width: `${stats.pctBaik}%` }
							}),
							/* @__PURE__ */ React.createElement("div", {
								className: "bg-amber-500 h-full",
								style: { width: `${stats.pctRR}%` }
							}),
							/* @__PURE__ */ React.createElement("div", {
								className: "bg-rose-500 h-full",
								style: { width: `${stats.pctRB}%` }
							})
						)
					),
					/* @__PURE__ */ React.createElement(
						"div",
						{ className: "grid grid-cols-3 gap-1.5 pt-2.5 border-t border-slate-700/60 text-[11px]" },
						/* @__PURE__ */ React.createElement(
							"div",
							{ className: "bg-slate-900/70 px-2 py-1 rounded-lg text-center" },
							/* @__PURE__ */ React.createElement("span", { className: "text-slate-400 block text-[10px]" }, "Baik"),
							/* @__PURE__ */ React.createElement("span", { className: "text-emerald-400 font-bold" }, stats.baik)
						),
						/* @__PURE__ */ React.createElement(
							"div",
							{ className: "bg-slate-900/70 px-2 py-1 rounded-lg text-center" },
							/* @__PURE__ */ React.createElement("span", { className: "text-slate-400 block text-[10px]" }, "Rusak Ringan"),
							/* @__PURE__ */ React.createElement("span", { className: "text-amber-400 font-bold" }, stats.rr)
						),
						/* @__PURE__ */ React.createElement(
							"div",
							{ className: "bg-slate-900/70 px-2 py-1 rounded-lg text-center" },
							/* @__PURE__ */ React.createElement("span", { className: "text-slate-400 block text-[10px]" }, "Rusak Berat"),
							/* @__PURE__ */ React.createElement("span", { className: "text-rose-400 font-bold" }, stats.rb)
						)
					)
				),

				// Card 4: Sarpras Kincir & Status Operasional
				/* @__PURE__ */ React.createElement(
					"div",
					{ className: "bg-slate-800/90 rounded-2xl p-4 border border-slate-700/70 shadow-md flex flex-col justify-between" },
					/* @__PURE__ */ React.createElement(
						"div",
						{ className: "flex items-center justify-between" },
						/* @__PURE__ */ React.createElement(
							"span",
							{ className: "text-xs font-bold uppercase tracking-wider text-slate-400" },
							"Sarana Kincir & Utilisasi"
						),
						/* @__PURE__ */ React.createElement(
							"div",
							{ className: "w-9 h-9 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center" },
							/* @__PURE__ */ React.createElement(Activity, { className: "w-5 h-5" })
						)
					),
					/* @__PURE__ */ React.createElement(
						"div",
						{ className: "my-2.5" },
						/* @__PURE__ */ React.createElement(
							"div",
							{ className: "flex items-baseline gap-2" },
							/* @__PURE__ */ React.createElement(
								"span",
								{ className: "text-2xl sm:text-3xl font-black text-amber-400" },
								stats.totalKincir.toLocaleString("id-ID")
							),
							/* @__PURE__ */ React.createElement(
								"span",
								{ className: "text-xs text-slate-300 font-semibold" },
								"Unit Kincir Air Terpasang"
							)
						)
					),
					/* @__PURE__ */ React.createElement(
						"div",
						{ className: "grid grid-cols-2 gap-1.5 pt-2.5 border-t border-slate-700/60 text-[11px]" },
						/* @__PURE__ */ React.createElement(
							"div",
							{ className: "bg-slate-900/70 px-2 py-1 rounded-lg" },
							/* @__PURE__ */ React.createElement("span", { className: "text-slate-400 block text-[10px]" }, "Aktif / Tandon"),
							/* @__PURE__ */ React.createElement(
								"span",
								{ className: "text-emerald-400 font-bold" },
								`${(stats.statusCounts["Aktif Budidaya"] || 0) + (stats.statusCounts["Tandon / Pendukung"] || 0) + (stats.statusCounts["Koperasi / Sewa"] || 0)} Unit`
							)
						),
						/* @__PURE__ */ React.createElement(
							"div",
							{ className: "bg-slate-900/70 px-2 py-1 rounded-lg" },
							/* @__PURE__ */ React.createElement("span", { className: "text-slate-400 block text-[10px]" }, "Idle / Non-Aktif"),
							/* @__PURE__ */ React.createElement(
								"span",
								{ className: "text-rose-400 font-bold" },
								`${(stats.statusCounts["Belum Dimanfaatkan"] || 0) + (stats.statusCounts["Rusak / Tidak Berfungsi"] || 0)} Unit`
							)
						)
					)
				)
			),

			// 4. CHARTS & PELATARAN BREAKDOWN
			/* @__PURE__ */ React.createElement(
				"div",
				{ className: "grid grid-cols-1 lg:grid-cols-12 gap-5" },
				// Left: Bar Chart
				/* @__PURE__ */ React.createElement(
					"div",
					{
						className:
							"lg:col-span-8 bg-slate-800/90 rounded-2xl p-4 sm:p-5 border border-slate-700/70 shadow-lg flex flex-col justify-between"
					},
					/* @__PURE__ */ React.createElement(
						"div",
						{ className: "flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3" },
						/* @__PURE__ */ React.createElement(
							"div",
							null,
							/* @__PURE__ */ React.createElement(
								"h3",
								{ className: "text-base font-bold text-white tracking-tight" },
								"Sebaran Prasarana Tambak & Kolam per Satuan Pendidikan"
							),
							/* @__PURE__ */ React.createElement(
								"p",
								{ className: "text-xs text-slate-400" },
								"Perbandingan kapasitas lahan air (m²) dan jumlah petak/kolam antar kampus vokasi KKP."
							)
						),
						/* @__PURE__ */ React.createElement(
							"div",
							{ className: "flex items-center bg-slate-900 p-1 rounded-xl border border-slate-700 self-start sm:self-center" },
							/* @__PURE__ */ React.createElement(
								"button",
								{
									onClick: () => setChartMetric("luas"),
									className: `px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
										chartMetric === "luas" ? "bg-cyan-600 text-white" : "text-slate-400 hover:text-slate-200"
									}`
								},
								"Berdasarkan Luas (m²)"
							),
							/* @__PURE__ */ React.createElement(
								"button",
								{
									onClick: () => setChartMetric("unit"),
									className: `px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
										chartMetric === "unit" ? "bg-cyan-600 text-white" : "text-slate-400 hover:text-slate-200"
									}`
								},
								"Berdasarkan Jumlah Unit"
							)
						)
					),
					/* @__PURE__ */ React.createElement(
						"div",
						{ className: "h-72 sm:h-80" },
						/* @__PURE__ */ React.createElement(Bar, {
							data: chartConfig.data,
							options: chartConfig.options
						})
					)
				),

				// Right: Konstruksi Pelataran & Status Pemanfaatan
				/* @__PURE__ */ React.createElement(
					"div",
					{
						className:
							"lg:col-span-4 bg-slate-800/90 rounded-2xl p-4 sm:p-5 border border-slate-700/70 shadow-lg flex flex-col justify-between space-y-4"
					},
					/* @__PURE__ */ React.createElement(
						"div",
						null,
						/* @__PURE__ */ React.createElement(
							"h3",
							{ className: "text-base font-bold text-white tracking-tight mb-1" },
							"Konstruksi Pelataran & Status"
						),
						/* @__PURE__ */ React.createElement(
							"p",
							{ className: "text-xs text-slate-400 mb-3" },
							"Klik kategori di bawah untuk memfilter rincian unit."
						),
						/* @__PURE__ */ React.createElement(
							"div",
							{ className: "space-y-2" },
							PELATARAN_KAT_OPTIONS.map((pk) => {
								const cnt = stats.pelataranCounts[pk] || 0;
								const pct = stats.totalUnit > 0 ? Math.round((cnt / stats.totalUnit) * 1000) / 10 : 0;
								const isSelected = pelataranFilter === pk;
								const barColor =
									pk === "HDPE / Geomembran"
										? "bg-cyan-500"
										: pk === "Beton / Semen"
										? "bg-emerald-500"
										: pk === "Tanah"
										? "bg-amber-500"
										: "bg-purple-500";
								return /* @__PURE__ */ React.createElement(
									"div",
									{
										key: pk,
										onClick: () => {
											setPelataranFilter(isSelected ? "ALL" : pk);
											setCurrentPage(1);
										},
										className: `p-2.5 rounded-xl border transition-all cursor-pointer ${
											isSelected
												? "bg-cyan-950/60 border-cyan-500"
												: "bg-slate-900/60 border-slate-800 hover:border-slate-600"
										}`
									},
									/* @__PURE__ */ React.createElement(
										"div",
										{ className: "flex items-center justify-between text-xs mb-1" },
										/* @__PURE__ */ React.createElement("span", { className: "font-semibold text-slate-200" }, pk),
										/* @__PURE__ */ React.createElement(
											"span",
											{ className: "font-bold text-white font-mono" },
											`${cnt} Unit (${pct}%)`
										)
									),
									/* @__PURE__ */ React.createElement(
										"div",
										{ className: "w-full h-1.5 bg-slate-800 rounded-full overflow-hidden" },
										/* @__PURE__ */ React.createElement("div", {
											className: `h-full rounded-full ${barColor}`,
											style: { width: `${Math.min(100, pct)}%` }
										})
									)
								);
							})
						)
					),
					/* @__PURE__ */ React.createElement(
						"div",
						{ className: "pt-3 border-t border-slate-700/60" },
						/* @__PURE__ */ React.createElement(
							"h4",
							{ className: "text-xs font-bold uppercase tracking-wider text-slate-400 mb-2" },
							"Status Operasional Budidaya"
						),
						/* @__PURE__ */ React.createElement(
							"div",
							{ className: "grid grid-cols-2 gap-2 text-xs" },
							STATUS_OP_OPTIONS.map((st) => {
								const cnt = stats.statusCounts[st] || 0;
								const active = statusOpFilter === st;
								return /* @__PURE__ */ React.createElement(
									"button",
									{
										key: st,
										onClick: () => {
											setStatusOpFilter(active ? "ALL" : st);
											setCurrentPage(1);
										},
										className: `p-2 rounded-xl border text-left transition-all ${
											active
												? "bg-cyan-950/70 border-cyan-400 text-white"
												: "bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300"
										}`
									},
									/* @__PURE__ */ React.createElement(
										"span",
										{ className: "text-[10px] text-slate-400 block truncate" },
										st
									),
									/* @__PURE__ */ React.createElement(
										"span",
										{ className: "text-sm font-bold text-white" },
										`${cnt} Unit`
									)
								);
							})
						)
					)
				)
			),

			// 5. TABEL 1: REKAPITULASI PER SATUAN PENDIDIKAN (18 SATDIK)
			/* @__PURE__ */ React.createElement(
				"div",
				{ className: "bg-slate-800/90 rounded-2xl border border-slate-700/70 shadow-lg overflow-hidden" },
				/* @__PURE__ */ React.createElement(
					"div",
					{ className: "p-4 sm:p-5 border-b border-slate-700/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2" },
					/* @__PURE__ */ React.createElement(
						"div",
						null,
						/* @__PURE__ */ React.createElement(
							"h3",
							{ className: "text-base font-bold text-white flex items-center gap-2" },
							/* @__PURE__ */ React.createElement(Building2, { className: "w-4 h-4 text-cyan-400" }),
							"Rekapitulasi Prasarana Tambak & Kolam per Satuan Pendidikan (18 Satdik)"
						),
						/* @__PURE__ */ React.createElement(
							"p",
							{ className: "text-xs text-slate-400 mt-0.5" },
							"Klik baris Satuan Pendidikan untuk memfilter rincian petak tambak/kolam di bawah."
						)
					),
					/* @__PURE__ */ React.createElement(
						"span",
						{ className: "text-xs font-semibold text-cyan-400 bg-cyan-950/60 px-3 py-1 rounded-lg border border-cyan-500/30" },
						`${filteredSummary.length} Satuan Pendidikan Ditampilkan`
					)
				),
				/* @__PURE__ */ React.createElement(
					"div",
					{ className: "overflow-x-auto" },
					/* @__PURE__ */ React.createElement(
						"table",
						{ className: "w-full text-left border-collapse text-xs" },
						/* @__PURE__ */ React.createElement(
							"thead",
							null,
							/* @__PURE__ */ React.createElement(
								"tr",
								{ className: "bg-slate-900/90 text-slate-300 border-b border-slate-700/80 uppercase text-[10px] tracking-wider" },
								/* @__PURE__ */ React.createElement("th", { className: "py-3 px-3 text-center w-10" }, "No"),
								/* @__PURE__ */ React.createElement("th", { className: "py-3 px-3" }, "Satuan Pendidikan & Lokasi"),
								/* @__PURE__ */ React.createElement("th", { className: "py-3 px-3 text-center" }, "Total Unit"),
								/* @__PURE__ */ React.createElement("th", { className: "py-3 px-3 text-center" }, "Komposisi Unit"),
								/* @__PURE__ */ React.createElement("th", { className: "py-3 px-3 text-right" }, "Total Luas (m² / Ha)"),
								/* @__PURE__ */ React.createElement("th", { className: "py-3 px-3 text-center" }, "Kondisi (B / RR / RB)"),
								/* @__PURE__ */ React.createElement("th", { className: "py-3 px-3 text-center" }, "Kincir Air"),
								/* @__PURE__ */ React.createElement("th", { className: "py-3 px-3" }, "Instalasi Listrik"),
								/* @__PURE__ */ React.createElement("th", { className: "py-3 px-3 text-center" }, "Tautan Peta"),
								/* @__PURE__ */ React.createElement("th", { className: "py-3 px-3 text-center" }, "Aksi")
							)
						),
						/* @__PURE__ */ React.createElement(
							"tbody",
							{ className: "divide-y divide-slate-700/50" },
							filteredSummary.map((row, idx) => {
								const isSelected = selectedSatdik === row.satdikId;
								const luas = Number(row.luasTotalM2) || 0;
								const luasHa = luas / 10000;
								const hasUnits = (Number(row.jumlahUnit) || 0) > 0;
								return /* @__PURE__ */ React.createElement(
									"tr",
									{
										key: row.satdikId,
										onClick: () => handleSelectSatdikDrilldown(isSelected ? "ALL" : row.satdikId),
										className: `transition-colors cursor-pointer ${
											isSelected
												? "bg-cyan-950/50 hover:bg-cyan-950/70"
												: "hover:bg-slate-700/40"
										}`
									},
									/* @__PURE__ */ React.createElement(
										"td",
										{ className: "py-3 px-3 text-center font-mono text-slate-400" },
										idx + 1
									),
									/* @__PURE__ */ React.createElement(
										"td",
										{ className: "py-3 px-3" },
										/* @__PURE__ */ React.createElement(
											"div",
											{ className: "flex items-center gap-2" },
											/* @__PURE__ */ React.createElement(
												"span",
												{ className: "font-bold text-white" },
												row.namaSatdik
											),
											/* @__PURE__ */ React.createElement(
												"span",
												{
													className: `px-1.5 py-0.5 rounded text-[10px] font-semibold ${
														row.jenjang === "SUPM"
															? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
															: "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30"
													}`
												},
												row.jenjang
											)
										),
										/* @__PURE__ */ React.createElement(
											"div",
											{ className: "text-[11px] text-slate-400 mt-0.5" },
											row.lokasiUtama || "-"
										)
									),
									/* @__PURE__ */ React.createElement(
										"td",
										{ className: "py-3 px-3 text-center" },
										hasUnits
											? /* @__PURE__ */ React.createElement(
													"span",
													{ className: "font-extrabold text-sm text-white font-mono" },
													row.jumlahUnit
											  )
											: /* @__PURE__ */ React.createElement(
													"span",
													{ className: "px-2 py-0.5 rounded bg-slate-700 text-slate-300 text-[10px]" },
													"Tidak Memiliki"
											  )
									),
									/* @__PURE__ */ React.createElement(
										"td",
										{ className: "py-3 px-3 text-center" },
										hasUnits
											? /* @__PURE__ */ React.createElement(
													"div",
													{ className: "inline-flex items-center gap-1.5 text-[11px]" },
													row.jumlahTambak > 0 &&
														/* @__PURE__ */ React.createElement(
															"span",
															{ className: "px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 font-semibold" },
															`${row.jumlahTambak} Tambak`
														),
													row.jumlahKolam > 0 &&
														/* @__PURE__ */ React.createElement(
															"span",
															{ className: "px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 font-semibold" },
															`${row.jumlahKolam} Kolam`
														),
													row.jumlahTandon > 0 &&
														/* @__PURE__ */ React.createElement(
															"span",
															{ className: "px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 font-semibold" },
															`${row.jumlahTandon} Tandon/Bak`
														)
											  )
											: /* @__PURE__ */ React.createElement("span", { className: "text-slate-500" }, "—")
									),
									/* @__PURE__ */ React.createElement(
										"td",
										{ className: "py-3 px-3 text-right font-mono" },
										hasUnits
											? /* @__PURE__ */ React.createElement(
													"div",
													null,
													/* @__PURE__ */ React.createElement(
														"span",
														{ className: "font-bold text-emerald-400 block" },
														`${luas.toLocaleString("id-ID")} m²`
													),
													/* @__PURE__ */ React.createElement(
														"span",
														{ className: "text-[10px] text-slate-400" },
														`${luasHa.toFixed(2)} Ha`
													)
											  )
											: /* @__PURE__ */ React.createElement("span", { className: "text-slate-500" }, "0 m²")
									),
									/* @__PURE__ */ React.createElement(
										"td",
										{ className: "py-3 px-3 text-center" },
										hasUnits
											? /* @__PURE__ */ React.createElement(
													"div",
													{ className: "inline-flex items-center gap-1 font-mono text-[11px]" },
													/* @__PURE__ */ React.createElement(
														"span",
														{ className: "px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold", title: "Baik" },
														row.kondisiBaik
													),
													/* @__PURE__ */ React.createElement(
														"span",
														{ className: "px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold", title: "Rusak Ringan" },
														row.kondisiRusakRingan
													),
													/* @__PURE__ */ React.createElement(
														"span",
														{ className: "px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold", title: "Rusak Berat" },
														row.kondisiRusakBerat
													)
											  )
											: /* @__PURE__ */ React.createElement("span", { className: "text-slate-500" }, "—")
									),
									/* @__PURE__ */ React.createElement(
										"td",
										{ className: "py-3 px-3 text-center font-mono" },
										Number(row.totalKincir) > 0
											? /* @__PURE__ */ React.createElement(
													"span",
													{ className: "px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 font-bold" },
													`${row.totalKincir} Unit`
											  )
											: /* @__PURE__ */ React.createElement("span", { className: "text-slate-500" }, "—")
									),
									/* @__PURE__ */ React.createElement(
										"td",
										{ className: "py-3 px-3 text-slate-300 max-w-[220px] truncate", title: row.dayaListrik },
										row.dayaListrik || "-"
									),
									/* @__PURE__ */ React.createElement(
										"td",
										{ className: "py-3 px-3 text-center", onClick: (e) => e.stopPropagation() },
										row.mapUrl
											? /* @__PURE__ */ React.createElement(
													"a",
													{
														href: row.mapUrl,
														target: "_blank",
														rel: "noopener noreferrer",
														className:
															"inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-cyan-950 text-cyan-400 border border-cyan-500/30 text-[11px] font-semibold transition-colors"
													},
													/* @__PURE__ */ React.createElement(MapPin, { className: "w-3 h-3" }),
													row.satdikId === "akkp-wakatobi" ? "Dokumen" : "Lokasi",
													/* @__PURE__ */ React.createElement(ExternalLink, { className: "w-3 h-3" })
											  )
											: "—"
									),
									/* @__PURE__ */ React.createElement(
										"td",
										{ className: "py-3 px-3 text-center" },
										/* @__PURE__ */ React.createElement(
											"button",
											{
												onClick: (e) => {
													e.stopPropagation();
													handleSelectSatdikDrilldown(isSelected ? "ALL" : row.satdikId);
												},
												className: `px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
													isSelected
														? "bg-cyan-600 text-white"
														: "bg-slate-700/70 hover:bg-slate-700 text-slate-200"
												}`
											},
											isSelected ? "Semua" : "Rincian"
										)
									)
								);
							})
						)
					)
				)
			),

			// 6. TABEL 2: KATALOG RINCIAN UNIT TAMBAK & KOLAM (370 UNIT)
			/* @__PURE__ */ React.createElement(
				"div",
				{
					ref: detailSectionRef,
					className: "bg-slate-800/90 rounded-2xl border border-slate-700/70 shadow-lg overflow-hidden"
				},
				/* @__PURE__ */ React.createElement(
					"div",
					{ className: "p-4 sm:p-5 border-b border-slate-700/70 space-y-3" },
					/* @__PURE__ */ React.createElement(
						"div",
						{ className: "flex flex-col sm:flex-row sm:items-center justify-between gap-2" },
						/* @__PURE__ */ React.createElement(
							"div",
							null,
							/* @__PURE__ */ React.createElement(
								"h3",
								{ className: "text-base font-bold text-white flex items-center gap-2" },
								/* @__PURE__ */ React.createElement(Layers, { className: "w-4 h-4 text-emerald-400" }),
								"Katalog Rincian Unit Tambak, Kolam, Tandon & Bak Budidaya",
								selectedSatdik !== "ALL" &&
									/* @__PURE__ */ React.createElement(
										"span",
										{ className: "px-2.5 py-0.5 rounded-full text-xs bg-cyan-500/20 text-cyan-300 border border-cyan-500/40" },
										satdikMap[selectedSatdik]?.shortName || selectedSatdik
									)
							),
							/* @__PURE__ */ React.createElement(
								"p",
								{ className: "text-xs text-slate-400 mt-0.5" },
								`Menampilkan ${sortedUnits.length.toLocaleString("id-ID")} unit dari total ${rawUnits.length.toLocaleString("id-ID")} unit terdata.`
							)
						),
						/* @__PURE__ */ React.createElement(
							"div",
							{ className: "flex flex-wrap items-center gap-2" },
							/* @__PURE__ */ React.createElement(
								"div",
								{ className: "relative min-w-[240px]" },
								/* @__PURE__ */ React.createElement(Search, {
									className: "w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"
								}),
								/* @__PURE__ */ React.createElement("input", {
									type: "text",
									value: searchQuery,
									onChange: (e) => {
										setSearchQuery(e.target.value);
										setCurrentPage(1);
									},
									placeholder: "Cari nama tambak/kolam, vannamei, nila, lokasi...",
									className:
										"w-full pl-9 pr-8 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
								}),
								searchQuery &&
									/* @__PURE__ */ React.createElement(
										"button",
										{
											onClick: () => {
												setSearchQuery("");
												setCurrentPage(1);
											},
											className: "absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
										},
										/* @__PURE__ */ React.createElement(X, { className: "w-3.5 h-3.5" })
									)
							),
							/* @__PURE__ */ React.createElement(
								"select",
								{
									value: kondisiFilter,
									onChange: (e) => {
										setKondisiFilter(e.target.value);
										setCurrentPage(1);
									},
									className: "bg-slate-900 text-slate-200 text-xs rounded-xl px-3 py-1.5 border border-slate-700"
								},
								/* @__PURE__ */ React.createElement("option", { value: "ALL" }, "Semua Kondisi"),
								KONDISI_OPTIONS.map((k) => /* @__PURE__ */ React.createElement("option", { key: k, value: k }, `Kondisi: ${k}`))
							),
							/* @__PURE__ */ React.createElement(
								"select",
								{
									value: pelataranFilter,
									onChange: (e) => {
										setPelataranFilter(e.target.value);
										setCurrentPage(1);
									},
									className: "bg-slate-900 text-slate-200 text-xs rounded-xl px-3 py-1.5 border border-slate-700"
								},
								/* @__PURE__ */ React.createElement("option", { value: "ALL" }, "Semua Pelataran"),
								PELATARAN_KAT_OPTIONS.map((p) =>
									/* @__PURE__ */ React.createElement("option", { key: p, value: p }, `Pelataran: ${p}`)
								)
							),
							/* @__PURE__ */ React.createElement(
								"select",
								{
									value: statusOpFilter,
									onChange: (e) => {
										setStatusOpFilter(e.target.value);
										setCurrentPage(1);
									},
									className: "bg-slate-900 text-slate-200 text-xs rounded-xl px-3 py-1.5 border border-slate-700"
								},
								/* @__PURE__ */ React.createElement("option", { value: "ALL" }, "Semua Status Operasional"),
								STATUS_OP_OPTIONS.map((st) =>
									/* @__PURE__ */ React.createElement("option", { key: st, value: st }, st)
								)
							)
						)
					)
				),

				// Tabel Rincian Unit
				/* @__PURE__ */ React.createElement(
					"div",
					{ className: "overflow-x-auto" },
					/* @__PURE__ */ React.createElement(
						"table",
						{ className: "w-full text-left border-collapse text-xs" },
						/* @__PURE__ */ React.createElement(
							"thead",
							null,
							/* @__PURE__ */ React.createElement(
								"tr",
								{ className: "bg-slate-900/90 text-slate-300 border-b border-slate-700/80 uppercase text-[10px] tracking-wider" },
								/* @__PURE__ */ React.createElement(
									"th",
									{
										onClick: () => handleSort("noUrut"),
										className: "py-3 px-3 text-center cursor-pointer hover:text-cyan-400"
									},
									"No"
								),
								/* @__PURE__ */ React.createElement(
									"th",
									{
										onClick: () => handleSort("namaSatdik"),
										className: "py-3 px-3 cursor-pointer hover:text-cyan-400"
									},
									"Satuan Pendidikan"
								),
								/* @__PURE__ */ React.createElement(
									"th",
									{
										onClick: () => handleSort("nama"),
										className: "py-3 px-3 cursor-pointer hover:text-cyan-400"
									},
									"Nama Tambak / Kolam"
								),
								/* @__PURE__ */ React.createElement(
									"th",
									{
										onClick: () => handleSort(" luasM2".trim()),
										className: "py-3 px-3 text-right cursor-pointer hover:text-cyan-400"
									},
									/* @__PURE__ */ React.createElement(
										"span",
										{ className: "inline-flex items-center gap-1" },
										"Luas (m²)",
										/* @__PURE__ */ React.createElement(ArrowUpDown, { className: "w-3 h-3" })
									)
								),
								/* @__PURE__ */ React.createElement(
									"th",
									{
										onClick: () => handleSort("kondisi"),
										className: "py-3 px-3 text-center cursor-pointer hover:text-cyan-400"
									},
									"Kondisi"
								),
								/* @__PURE__ */ React.createElement(
									"th",
									{
										onClick: () => handleSort("fungsi"),
										className: "py-3 px-3 cursor-pointer hover:text-cyan-400"
									},
									"Fungsi & Peruntukan"
								),
								/* @__PURE__ */ React.createElement(
									"th",
									{
										onClick: () => handleSort("pelataran"),
										className: "py-3 px-3 text-center cursor-pointer hover:text-cyan-400"
									},
									"Pelataran"
								),
								/* @__PURE__ */ React.createElement("th", { className: "py-3 px-3" }, "Listrik & Kincir"),
								/* @__PURE__ */ React.createElement("th", { className: "py-3 px-3 text-center" }, "Google Map"),
								canEdit && /* @__PURE__ */ React.createElement("th", { className: "py-3 px-3 text-center" }, "Aksi")
							)
						),
						/* @__PURE__ */ React.createElement(
							"tbody",
							{ className: "divide-y divide-slate-700/50" },
							paginatedUnits.length > 0
								? paginatedUnits.map((u, idx) => {
										const rowNum =
											pageSize === "ALL" ? idx + 1 : (currentPage - 1) * (Number(pageSize) || 25) + idx + 1;
										const kondBadge =
											u.kondisi === "Baik"
												? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
												: u.kondisi === "Rusak Ringan"
												? "bg-amber-500/15 text-amber-300 border-amber-500/30"
												: "bg-rose-500/15 text-rose-300 border-rose-500/30";
										const jenisBadge =
											u.jenis === "Tambak"
												? "bg-cyan-500/15 text-cyan-300 border-cyan-500/30"
												: u.jenis === "Kolam"
												? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
												: "bg-amber-500/15 text-amber-300 border-amber-500/30";

										return /* @__PURE__ */ React.createElement(
											"tr",
											{ key: u.id, className: "hover:bg-slate-700/35 transition-colors" },
											/* @__PURE__ */ React.createElement(
												"td",
												{ className: "py-3 px-3 text-center font-mono text-slate-400" },
												rowNum
											),
											/* @__PURE__ */ React.createElement(
												"td",
												{ className: "py-3 px-3" },
												/* @__PURE__ */ React.createElement(
													"div",
													{ className: "font-bold text-white" },
													satdikMap[u.satdikId]?.shortName || u.namaSatdik
												),
												/* @__PURE__ */ React.createElement(
													"div",
													{ className: "text-[10px] text-slate-400 truncate max-w-[180px]", title: u.kampusLokasi },
													u.kampusLokasi || "-"
												)
											),
											/* @__PURE__ */ React.createElement(
												"td",
												{ className: "py-3 px-3" },
												/* @__PURE__ */ React.createElement(
													"div",
													{ className: "flex items-center gap-1.5 flex-wrap" },
													/* @__PURE__ */ React.createElement(
														"span",
														{ className: "font-bold text-slate-100" },
														u.nama
													),
													/* @__PURE__ */ React.createElement(
														"span",
														{ className: `px-1.5 py-0.5 rounded text-[10px] font-semibold border ${jenisBadge}` },
														u.jenis
													)
												),
												/* @__PURE__ */ React.createElement(
													"div",
													{ className: "text-[10px] font-mono text-slate-400 mt-0.5" },
													`ID: ${u.id} · No.Satdik: ${u.noUrut}`
												)
											),
											/* @__PURE__ */ React.createElement(
												"td",
												{ className: "py-3 px-3 text-right font-mono" },
												Number(u.luasM2) > 0
													? /* @__PURE__ */ React.createElement(
															"span",
															{ className: "font-bold text-emerald-400" },
															`${Number(u.luasM2).toLocaleString("id-ID")} m²`
													  )
													: /* @__PURE__ */ React.createElement(
															"span",
															{ className: "text-slate-500" },
															u.luasLabel || "-"
													  )
											),
											/* @__PURE__ */ React.createElement(
												"td",
												{ className: "py-3 px-3 text-center" },
												/* @__PURE__ */ React.createElement(
													"span",
													{ className: `px-2 py-0.5 rounded-full text-[11px] font-bold border ${kondBadge}` },
													u.kondisi
												)
											),
											/* @__PURE__ */ React.createElement(
												"td",
												{ className: "py-3 px-3" },
												/* @__PURE__ */ React.createElement(
													"div",
													{ className: "font-medium text-slate-200" },
													u.fungsi || "-"
												),
												/* @__PURE__ */ React.createElement(
													"div",
													{ className: "text-[10px] text-slate-400 mt-0.5" },
													u.statusOperasional
												)
											),
											/* @__PURE__ */ React.createElement(
												"td",
												{ className: "py-3 px-3 text-center" },
												/* @__PURE__ */ React.createElement(
													"span",
													{ className: "px-2 py-0.5 rounded bg-slate-900 text-slate-200 border border-slate-700 font-semibold text-[11px]" },
													u.pelataran || "-"
												)
											),
											/* @__PURE__ */ React.createElement(
												"td",
												{ className: "py-3 px-3" },
												/* @__PURE__ */ React.createElement(
													"div",
													{ className: "text-[11px] text-slate-200 truncate max-w-[210px]", title: u.listrik },
													/* @__PURE__ */ React.createElement("span", { className: "text-slate-400" }, "Listrik: "),
													u.listrik || "-"
												),
												/* @__PURE__ */ React.createElement(
													"div",
													{ className: "text-[11px] text-amber-300 truncate max-w-[210px]", title: u.kincir },
													/* @__PURE__ */ React.createElement("span", { className: "text-slate-400" }, "Kincir: "),
													u.kincir || "-"
												)
											),
											/* @__PURE__ */ React.createElement(
												"td",
												{ className: "py-3 px-3 text-center" },
												u.mapUrl
													? /* @__PURE__ */ React.createElement(
															"a",
															{
																href: u.mapUrl,
																target: "_blank",
																rel: "noopener noreferrer",
																title: u.lokasiLabel || "Buka di Google Maps / Earth",
																className:
																	"inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-cyan-950 text-cyan-400 border border-cyan-500/30 text-[11px] font-semibold transition-colors"
															},
															/* @__PURE__ */ React.createElement(MapPin, { className: "w-3 h-3" }),
															"Peta",
															/* @__PURE__ */ React.createElement(ExternalLink, { className: "w-3 h-3" })
													  )
													: "—"
											),
											canEdit &&
												/* @__PURE__ */ React.createElement(
													"td",
													{ className: "py-3 px-3 text-center" },
													canEditSatdik(u.satdikId)
														? /* @__PURE__ */ React.createElement(
																"div",
																{ className: "inline-flex items-center gap-1" },
																/* @__PURE__ */ React.createElement(
																	"button",
																	{
																		onClick: () => openEditUnitModal(u),
																		className:
																			"p-1.5 rounded-lg bg-slate-900 hover:bg-cyan-950 text-cyan-400 border border-slate-700",
																		title: "Edit Unit Tambak/Kolam"
																	},
																	/* @__PURE__ */ React.createElement(Edit3, { className: "w-3.5 h-3.5" })
																),
																/* @__PURE__ */ React.createElement(
																	"button",
																	{
																		onClick: () => handleDeleteClick(u),
																		className:
																			"p-1.5 rounded-lg bg-slate-900 hover:bg-rose-950 text-rose-400 border border-slate-700",
																		title: "Hapus Unit"
																	},
																	/* @__PURE__ */ React.createElement(X, { className: "w-3.5 h-3.5" })
																)
														  )
														: /* @__PURE__ */ React.createElement("span", { className: "text-slate-500 text-[10px]" }, "Read-only")
												)
										);
								  })
								: /* @__PURE__ */ React.createElement(
										"tr",
										null,
										/* @__PURE__ */ React.createElement(
											"td",
											{ colSpan: canEdit ? 10 : 9, className: "py-8 text-center text-slate-400 text-xs" },
											selectedSatdik === "akkp-wakatobi"
												? "Akademi Komunitas KP Wakatobi tidak memiliki prasarana tambak/kolam."
												: "Tidak ada unit tambak/kolam yang sesuai dengan filter pencarian."
										)
								  )
						)
					)
				),

				// Pagination Footer
				/* @__PURE__ */ React.createElement(
					"div",
					{
						className:
							"p-3.5 sm:px-5 border-t border-slate-700/70 bg-slate-900/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400"
					},
					/* @__PURE__ */ React.createElement(
						"div",
						{ className: "flex items-center gap-2" },
						/* @__PURE__ */ React.createElement("span", null, "Baris per halaman:"),
						/* @__PURE__ */ React.createElement(
							"select",
							{
								value: pageSize,
								onChange: (e) => {
									setPageSize(e.target.value);
									setCurrentPage(1);
								},
								className: "bg-slate-800 text-white rounded-lg px-2 py-1 border border-slate-700 text-xs"
							},
							/* @__PURE__ */ React.createElement("option", { value: 25 }, "25"),
							/* @__PURE__ */ React.createElement("option", { value: 50 }, "50"),
							/* @__PURE__ */ React.createElement("option", { value: 100 }, "100"),
							/* @__PURE__ */ React.createElement("option", { value: "ALL" }, "Semua (370)")
						)
					),
					pageSize !== "ALL" &&
						/* @__PURE__ */ React.createElement(
							"div",
							{ className: "flex items-center gap-2" },
							/* @__PURE__ */ React.createElement(
								"span",
								null,
								`Halaman ${currentPage} dari ${totalPages}`
							),
							/* @__PURE__ */ React.createElement(
								"button",
								{
									onClick: () => setCurrentPage((p) => Math.max(1, p - 1)),
									disabled: currentPage === 1,
									className: "p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white"
								},
								/* @__PURE__ */ React.createElement(ChevronLeft, { className: "w-4 h-4" })
							),
							/* @__PURE__ */ React.createElement(
								"button",
								{
									onClick: () => setCurrentPage((p) => Math.min(totalPages, p + 1)),
									disabled: currentPage === totalPages,
									className: "p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white"
								},
								/* @__PURE__ */ React.createElement(ChevronRight, { className: "w-4 h-4" })
							)
						)
				)
			),

			// 7. MODAL ADD / EDIT UNIT TAMBAK & KOLAM
			editingUnit &&
				/* @__PURE__ */ React.createElement(
					"div",
					{
						className:
							"fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
					},
					/* @__PURE__ */ React.createElement(
						"div",
						{
							className:
								"bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl space-y-4 my-8"
						},
						/* @__PURE__ */ React.createElement(
							"div",
							{ className: "flex items-center justify-between border-b border-slate-800 pb-3" },
							/* @__PURE__ */ React.createElement(
								"div",
								{ className: "flex items-center gap-2.5" },
								/* @__PURE__ */ React.createElement(
									"div",
									{ className: "w-9 h-9 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center" },
									/* @__PURE__ */ React.createElement(Fish, { className: "w-5 h-5" })
								),
								/* @__PURE__ */ React.createElement(
									"div",
									null,
									/* @__PURE__ */ React.createElement(
										"h3",
										{ className: "text-base font-bold text-white" },
										editingUnit.mode === "add"
											? "Tambah Unit Tambak / Kolam Baru"
											: `Edit Unit: ${editingUnit.data.nama}`
									),
									/* @__PURE__ */ React.createElement(
										"p",
										{ className: "text-xs text-slate-400" },
										"Perubahan otomatis menyinkronkan Rekapitulasi Luas & Unit Satdik."
									)
								)
							),
							/* @__PURE__ */ React.createElement(
								"button",
								{
									onClick: () => setEditingUnit(null),
									className: "p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
								},
								/* @__PURE__ */ React.createElement(X, { className: "w-4 h-4" })
							)
						),
						/* @__PURE__ */ React.createElement(
							"form",
							{ onSubmit: handleSaveUnit, className: "space-y-3 text-xs" },
							/* @__PURE__ */ React.createElement(
								"div",
								{ className: "grid grid-cols-1 sm:grid-cols-2 gap-3" },
								/* @__PURE__ */ React.createElement(
									"div",
									null,
									/* @__PURE__ */ React.createElement(
										"label",
										{ className: "block text-slate-300 font-semibold mb-1" },
										"Satuan Pendidikan"
									),
									/* @__PURE__ */ React.createElement(
										"select",
										{
											value: editingUnit.data.satdikId,
											disabled: Boolean(lockedSatdik),
											onChange: (e) =>
												setEditingUnit((prev) => ({
													...prev,
													data: { ...prev.data, satdikId: e.target.value }
												})),
											className: "w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
										},
										masterSatdik.map((s) =>
											/* @__PURE__ */ React.createElement("option", { key: s.id, value: s.id }, s.name)
										)
									)
								),
								/* @__PURE__ */ React.createElement(
									"div",
									null,
									/* @__PURE__ */ React.createElement(
										"label",
										{ className: "block text-slate-300 font-semibold mb-1" },
										"Nama Petak Tambak / Kolam"
									),
									/* @__PURE__ */ React.createElement("input", {
										type: "text",
										required: true,
										value: editingUnit.data.nama || "",
										onChange: (e) =>
											setEditingUnit((prev) => ({
												...prev,
												data: { ...prev.data, nama: e.target.value }
											})),
										placeholder: "Contoh: Tambak Modul V / Kolam E1",
										className: "w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
									})
								),
								/* @__PURE__ */ React.createElement(
									"div",
									null,
									/* @__PURE__ */ React.createElement(
										"label",
										{ className: "block text-slate-300 font-semibold mb-1" },
										"Jenis Prasarana"
									),
									/* @__PURE__ */ React.createElement(
										"select",
										{
											value: editingUnit.data.jenis || "Tambak",
											onChange: (e) =>
												setEditingUnit((prev) => ({
													...prev,
													data: { ...prev.data, jenis: e.target.value }
												})),
											className: "w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
										},
										JENIS_OPTIONS.map((j) =>
											/* @__PURE__ */ React.createElement("option", { key: j, value: j }, j)
										)
									)
								),
								/* @__PURE__ */ React.createElement(
									"div",
									null,
									/* @__PURE__ */ React.createElement(
										"label",
										{ className: "block text-slate-300 font-semibold mb-1" },
										"Luas Area (m²)"
									),
									/* @__PURE__ */ React.createElement("input", {
										type: "number",
										step: "0.01",
										min: "0",
										value: editingUnit.data.luasM2 ?? 0,
										onChange: (e) =>
											setEditingUnit((prev) => ({
												...prev,
												data: { ...prev.data, luasM2: e.target.value }
											})),
										className: "w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
									})
								),
								/* @__PURE__ */ React.createElement(
									"div",
									null,
									/* @__PURE__ */ React.createElement(
										"label",
										{ className: "block text-slate-300 font-semibold mb-1" },
										"Kondisi Fisik"
									),
									/* @__PURE__ */ React.createElement(
										"select",
										{
											value: editingUnit.data.kondisi || "Baik",
											onChange: (e) =>
												setEditingUnit((prev) => ({
													...prev,
													data: { ...prev.data, kondisi: e.target.value }
												})),
											className: "w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
										},
										KONDISI_OPTIONS.map((k) =>
											/* @__PURE__ */ React.createElement("option", { key: k, value: k }, k)
										)
									)
								),
								/* @__PURE__ */ React.createElement(
									"div",
									null,
									/* @__PURE__ */ React.createElement(
										"label",
										{ className: "block text-slate-300 font-semibold mb-1" },
										"Status Operasional"
									),
									/* @__PURE__ */ React.createElement(
										"select",
										{
											value: editingUnit.data.statusOperasional || "Aktif Budidaya",
											onChange: (e) =>
												setEditingUnit((prev) => ({
													...prev,
													data: { ...prev.data, statusOperasional: e.target.value }
												})),
											className: "w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
										},
										STATUS_OP_OPTIONS.map((st) =>
											/* @__PURE__ */ React.createElement("option", { key: st, value: st }, st)
										)
									)
								),
								/* @__PURE__ */ React.createElement(
									"div",
									null,
									/* @__PURE__ */ React.createElement(
										"label",
										{ className: "block text-slate-300 font-semibold mb-1" },
										"Fungsi / Komoditas Budidaya"
									),
									/* @__PURE__ */ React.createElement("input", {
										type: "text",
										value: editingUnit.data.fungsi || "",
										onChange: (e) =>
											setEditingUnit((prev) => ({
												...prev,
												data: { ...prev.data, fungsi: e.target.value }
											})),
										placeholder: "Budidaya Vannamei (TEFA) / Ikan Nila",
										className: "w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
									})
								),
								/* @__PURE__ */ React.createElement(
									"div",
									null,
									/* @__PURE__ */ React.createElement(
										"label",
										{ className: "block text-slate-300 font-semibold mb-1" },
										"Konstruksi Pelataran"
									),
									/* @__PURE__ */ React.createElement("input", {
										type: "text",
										value: editingUnit.data.pelataran || "",
										onChange: (e) =>
											setEditingUnit((prev) => ({
												...prev,
												data: { ...prev.data, pelataran: e.target.value }
											})),
										placeholder: "HDPE / Tanah / Beton / Fiber",
										className: "w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
									})
								),
								/* @__PURE__ */ React.createElement(
									"div",
									null,
									/* @__PURE__ */ React.createElement(
										"label",
										{ className: "block text-slate-300 font-semibold mb-1" },
										"Daya / Jaringan Listrik"
									),
									/* @__PURE__ */ React.createElement("input", {
										type: "text",
										value: editingUnit.data.listrik || "",
										onChange: (e) =>
											setEditingUnit((prev) => ({
												...prev,
												data: { ...prev.data, listrik: e.target.value }
											})),
										placeholder: "16 KVA / Tersedia Daya Listrik",
										className: "w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
									})
								),
								/* @__PURE__ */ React.createElement(
									"div",
									{ className: "grid grid-cols-3 gap-2" },
									/* @__PURE__ */ React.createElement(
										"div",
										{ className: "col-span-2" },
										/* @__PURE__ */ React.createElement(
											"label",
											{ className: "block text-slate-300 font-semibold mb-1" },
											"Spesifikasi Kincir / Aerasi"
										),
										/* @__PURE__ */ React.createElement("input", {
											type: "text",
											value: editingUnit.data.kincir || "",
											onChange: (e) =>
												setEditingUnit((prev) => ({
													...prev,
													data: { ...prev.data, kincir: e.target.value }
												})),
											placeholder: "12 unit @1HP 3 phase",
											className: "w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
										})
									),
									/* @__PURE__ */ React.createElement(
										"div",
										null,
										/* @__PURE__ */ React.createElement(
											"label",
											{ className: "block text-slate-300 font-semibold mb-1" },
											"Jml Kincir"
										),
										/* @__PURE__ */ React.createElement("input", {
											type: "number",
											min: "0",
											value: editingUnit.data.jumlahKincir ?? 0,
											onChange: (e) =>
												setEditingUnit((prev) => ({
													...prev,
													data: { ...prev.data, jumlahKincir: e.target.value }
												})),
											className: "w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
										})
									)
								),
								/* @__PURE__ */ React.createElement(
									"div",
									null,
									/* @__PURE__ */ React.createElement(
										"label",
										{ className: "block text-slate-300 font-semibold mb-1" },
										"Link Lokasi Google Map / Earth"
									),
									/* @__PURE__ */ React.createElement("input", {
										type: "text",
										value: editingUnit.data.mapUrl || "",
										onChange: (e) =>
											setEditingUnit((prev) => ({
												...prev,
												data: { ...prev.data, mapUrl: e.target.value }
											})),
										placeholder: "https://maps.app.goo.gl/...",
										className: "w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
									})
								),
								/* @__PURE__ */ React.createElement(
									"div",
									null,
									/* @__PURE__ */ React.createElement(
										"label",
										{ className: "block text-slate-300 font-semibold mb-1" },
										"Kampus / Keterangan Lokasi"
									),
									/* @__PURE__ */ React.createElement("input", {
										type: "text",
										value: editingUnit.data.keterangan || "",
										onChange: (e) =>
											setEditingUnit((prev) => ({
												...prev,
												data: { ...prev.data, keterangan: e.target.value, kampusLokasi: e.target.value }
											})),
										placeholder: "Lokasi dalam lingkungan kampus...",
										className: "w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
									})
								)
							),
							/* @__PURE__ */ React.createElement(
								"div",
								{ className: "flex items-center justify-end gap-2 pt-3 border-t border-slate-800" },
								/* @__PURE__ */ React.createElement(
									"button",
									{
										type: "button",
										onClick: () => setEditingUnit(null),
										className: "px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
									},
									"Batal"
								),
								/* @__PURE__ */ React.createElement(
									"button",
									{
										type: "submit",
										disabled: isSaving,
										className:
											"inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold shadow-md"
									},
									/* @__PURE__ */ React.createElement(Save, { className: "w-4 h-4" }),
									isSaving ? "Menyimpan..." : "Simpan Data"
								)
							)
						)
					)
				)
		);
	};
})();
const TambakKolamView = window.__TambakKolamView;
// ============================================================================
// MODULE: src/App.jsx
// ============================================================================
(() => {
	const { useState, useEffect, useMemo } = React;
	const { SATDIK_LIST, SARPRAS_CATEGORIES } = window.SARPRAS_DATA;
	const { calculateSarprasKPIs, buildRealSarprasItems } = window.SARPRAS_DATA;
	const {
		apiCheckHealth,
		apiFetchAsrama,
		apiCreateAsramaBuilding,
		apiUpdateAsramaBuilding,
		apiDeleteAsramaBuilding,
		apiFetchStandarSarpras,
		apiCreateStandarItem,
		apiUpdateStandarItem,
		apiDeleteStandarItem,
		apiFetchTambakKolam,
		apiCreateTambakUnit,
		apiUpdateTambakUnit,
		apiDeleteTambakUnit,
		apiBulkImport
	} = window.SARPRAS_API;
	const { exportAsramaToExcel, exportStandarToExcel, exportTambakToExcel, exportComprehensiveToExcel } = window.SARPRAS_EXCEL;
	const AUTH_STORAGE_KEY = "kkp_auth_session_v2";
	window.__App = function App() {
		// Authentication session state
		const [currentUser, setCurrentUser] = useState(() => {
			try {
				const savedUser = localStorage.getItem(AUTH_STORAGE_KEY);
				if (savedUser) return JSON.parse(savedUser);
			} catch (e) {
				console.warn("Failed to parse auth session", e);
			}
			return null;
		});
		const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
		// Status koneksi database Laragon MySQL
		const [dbStatus, setDbStatus] = useState({
			connected: false,
			loading: true,
			info: null
		});
		// Dataset ketersediaan ruang asrama (Zero-Build fallback dari Services/asrama-data.js + sinkron MySQL)
		const [asramaData, setAsramaData] = useState(() => window.SARPRAS_ASRAMA || { meta: null, summary: [], buildings: [] });
		// Dataset pemenuhan standar minimal sarpras prodi (Zero-Build fallback dari Services/standar-data.js + sinkron MySQL)
		const [standarData, setStandarData] = useState(() => window.SARPRAS_STANDAR || { meta: null, bidang: [], rekap: [], items: [] });
		// Dataset prasarana & sarana tambak dan kolam (Zero-Build fallback dari Services/tambak-data.js + sinkron MySQL)
		const [tambakData, setTambakData] = useState(() => window.SARPRAS_TAMBAK || { meta: null, summary: [], units: [] });
		// Purging legacy catalog cache keys from localStorage
		useEffect(() => {
			try {
				localStorage.removeItem("kkp_sarpras_database_v2");
				localStorage.removeItem("kkp_sarpras_database_v3");
				localStorage.removeItem("kkp_sarpras_database_v4");
				localStorage.removeItem("kkp_sarpras_database_v5");
				localStorage.removeItem("kkp_sarpras_database_v6");
			} catch {}
		}, []);
		// Agregasi sarpras dari 3 modul nyata (Asrama, Tambak & Kolam, dan Standar Prodi)
		const assets = useMemo(() => {
			if (typeof buildRealSarprasItems === "function") {
				return buildRealSarprasItems({
					asramaData,
					tambakData,
					standarData,
					satdikList: SATDIK_LIST
				});
			}
			return [];
		}, [asramaData, tambakData, standarData]);
		// Active navigation tab
		const [activeTab, setActiveTab] = useState("dashboard");
		// Scroll to top helper function (smooth scroll with instant fallback)
		const scrollToTop = () => {
			try {
				window.scrollTo({
					top: 0,
					left: 0,
					behavior: "smooth"
				});
			} catch {
				window.scrollTo(0, 0);
			}
		};
		// Otomatis scroll ke posisi paling atas saat berpindah tab/menu
		useEffect(() => {
			scrollToTop();
			const timer = setTimeout(() => {
				scrollToTop();
			}, 50);
			return () => clearTimeout(timer);
		}, [activeTab]);
		// Handler pergantian tab yang menjamin scroll ke atas (bahkan jika tab yang sama diklik)
		const handleTabChange = (tabId) => {
			setActiveTab(tabId);
			scrollToTop();
		};
		// Add Asset modal state
		const [isAddModalOpen, setIsAddModalOpen] = useState(false);
		const [addModalInitialType, setAddModalInitialType] = useState("asrama");

		const handleOpenAddModal = (type) => {
			let targetType = type;
			if (!targetType || typeof targetType !== "string") {
				if (activeTab === "asrama") targetType = "asrama";
				else if (activeTab === "tambak") targetType = "tambak";
				else if (activeTab === "standar") targetType = "standar";
				else targetType = "asrama";
			}
			setAddModalInitialType(targetType);
			setIsAddModalOpen(true);
		};
		// Periksa koneksi ke MySQL Laragon dan muat data real-time
		useEffect(() => {
			let isMounted = true;
			async function checkAndLoadData() {
				try {
					const health = await apiCheckHealth();
					if (!isMounted) return;
					if (health.isConnected) {
						setDbStatus({
							connected: true,
							loading: false,
							info: health.info
						});
						if (typeof apiFetchAsrama === "function") {
							try {
								const asr = await apiFetchAsrama();
								if (isMounted && asr.success && Array.isArray(asr.summary) && asr.summary.length > 0) {
									setAsramaData({ meta: asr.meta, summary: asr.summary, buildings: asr.buildings || [] });
								}
							} catch {}
						}
						if (typeof apiFetchStandarSarpras === "function") {
							try {
								const std = await apiFetchStandarSarpras();
								if (isMounted && std.success && Array.isArray(std.bidang) && std.bidang.length > 0) {
									setStandarData({
										meta: std.meta,
										bidang: std.bidang,
										rekap: std.rekap || [],
										items: std.items || []
									});
								}
							} catch {}
						}
						if (typeof apiFetchTambakKolam === "function") {
							try {
								const tbk = await apiFetchTambakKolam();
								if (isMounted && tbk.success && Array.isArray(tbk.summary) && tbk.summary.length > 0) {
									setTambakData({
										meta: tbk.meta,
										summary: tbk.summary,
										units: tbk.units || []
									});
								}
							} catch {}
						}
					} else {
						setDbStatus({
							connected: false,
							loading: false,
							info: null
						});
					}
				} catch {
					if (isMounted) {
						setDbStatus({
							connected: false,
							loading: false,
							info: null
						});
					}
				}
			}
			checkAndLoadData();
			return () => {
				isMounted = false;
			};
		}, []);
		// Handle Login
		const handleLogin = (user, rememberMe) => {
			setCurrentUser(user);
			if (rememberMe) {
				try {
					localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
				} catch (e) {
					console.warn("Failed to save auth session", e);
				}
			}
		};
		// Handle Logout
		const handleLogout = () => {
			try {
				localStorage.removeItem(AUTH_STORAGE_KEY);
			} catch (e) {}
			setCurrentUser(null);
			setIsProfileModalOpen(false);
		};
		// Reactive KPI calculation
		const kpis = useMemo(() => {
			return calculateSarprasKPIs(assets, SATDIK_LIST, { asramaData, tambakData, standarData });
		}, [assets, asramaData, tambakData, standarData]);
		// Export Excel handler dengan format tabel rapi, kop KKP, dan formula
		const handleExportAsrama = (payload, scopeLabel) => {
			if (typeof exportAsramaToExcel === "function") {
				exportAsramaToExcel(payload || asramaData, SATDIK_LIST, {
					currentUser,
					filterSatdikName: scopeLabel || (currentUser?.accessibleSatdik === "ALL" ? "Seluruh Satuan Pendidikan Terdata (16 Satdik)" : currentUser?.satdikName || "Kampus Khusus"),
					filenamePrefix: "Sarana_Prasarana_Satdik_KP_Kapasitas_Asrama"
				});
			}
		};
		const handleExportStandar = (payload, scopeLabel, selectedSatdikId) => {
			if (typeof exportStandarToExcel === "function") {
				exportStandarToExcel(payload || standarData, SATDIK_LIST, {
					currentUser,
					filterScopeLabel: scopeLabel || (currentUser?.accessibleSatdik === "ALL" ? "Seluruh Rumpun Prodi (12 Bidang) & 11 Satdik Pendidikan Tinggi" : currentUser?.satdikName || "Kampus Khusus"),
					selectedSatdik: selectedSatdikId || (currentUser?.accessibleSatdik !== "ALL" ? currentUser?.accessibleSatdik : "ALL"),
					filenamePrefix: "Sarana_Prasarana_Satdik_KP_Standar_Minimal_Prodi"
				});
			}
		};

		// =========================================================================
		// CRUD Handlers: Kapasitas Asrama
		// =========================================================================
		const handleAddAsramaBuilding = async (payload) => {
			let result = null;
			if (dbStatus.connected && typeof apiCreateAsramaBuilding === "function") {
				result = await apiCreateAsramaBuilding(payload);
			}
			const createdBuilding = result?.data || {
				id: payload.id || ("ASR-" + Date.now()),
				...payload,
				jumlahKamar: Number(payload.jumlahKamar) || 0,
				luasM2: Number(payload.luasM2) || 0,
				kapasitas: Number(payload.kapasitas) || 0,
				status: payload.status || "Digunakan",
				rincian: payload.rincian || []
			};
			const summaryRow = result?.summaryRow;

			setAsramaData((prev) => {
				const nextBuildings = [createdBuilding, ...(prev.buildings || [])];
				let nextSummary = [...(prev.summary || [])];
				if (summaryRow) {
					const idx = nextSummary.findIndex((s) => s.satdikId === summaryRow.satdikId);
					if (idx >= 0) nextSummary[idx] = summaryRow;
					else nextSummary.push(summaryRow);
				} else {
					const sid = createdBuilding.satdikId;
					const bList = nextBuildings.filter((b) => b.satdikId === sid);
					const sumRow = nextSummary.find((s) => s.satdikId === sid) || { satdikId: sid };
					const updated = {
						...sumRow,
						jumlahAsrama: bList.length,
						jumlahKamar: bList.reduce((acc, b) => acc + (Number(b.jumlahKamar) || 0), 0),
						luasM2: bList.reduce((acc, b) => acc + (Number(b.luasM2) || 0), 0),
						kapasitas: bList.reduce((acc, b) => acc + (Number(b.kapasitas) || 0), 0),
						kapasitasAktif: bList.filter(b => b.status === "Digunakan").reduce((acc, b) => acc + (Number(b.kapasitas) || 0), 0),
						jumlahTidakDipakai: bList.filter(b => b.status === "Tidak Digunakan").length,
						jumlahPerluRenovasi: bList.filter(b => b.status === "Perlu Renovasi").length
					};
					const sIdx = nextSummary.findIndex((s) => s.satdikId === sid);
					if (sIdx >= 0) nextSummary[sIdx] = updated;
					else nextSummary.push(updated);
				}
				return {
					...prev,
					buildings: nextBuildings,
					summary: nextSummary
				};
			});
			return createdBuilding;
		};

		const handleUpdateAsramaBuilding = async (id, payload) => {
			let result = null;
			if (dbStatus.connected && typeof apiUpdateAsramaBuilding === "function") {
				result = await apiUpdateAsramaBuilding(id, payload);
			}
			const updatedBuilding = result?.data || { id, ...payload };
			const summaryRow = result?.summaryRow;

			setAsramaData((prev) => {
				const nextBuildings = (prev.buildings || []).map((b) => b.id === id ? { ...b, ...updatedBuilding } : b);
				let nextSummary = [...(prev.summary || [])];
				if (summaryRow) {
					const idx = nextSummary.findIndex((s) => s.satdikId === summaryRow.satdikId);
					if (idx >= 0) nextSummary[idx] = summaryRow;
					else nextSummary.push(summaryRow);
				} else {
					const sid = updatedBuilding.satdikId || prev.buildings.find(b => b.id === id)?.satdikId;
					if (sid) {
						const bList = nextBuildings.filter((b) => b.satdikId === sid);
						const sumRow = nextSummary.find((s) => s.satdikId === sid) || { satdikId: sid };
						const updated = {
							...sumRow,
							jumlahAsrama: bList.length,
							jumlahKamar: bList.reduce((acc, b) => acc + (Number(b.jumlahKamar) || 0), 0),
							luasM2: bList.reduce((acc, b) => acc + (Number(b.luasM2) || 0), 0),
							kapasitas: bList.reduce((acc, b) => acc + (Number(b.kapasitas) || 0), 0),
							kapasitasAktif: bList.filter(b => b.status === "Digunakan").reduce((acc, b) => acc + (Number(b.kapasitas) || 0), 0),
							jumlahTidakDipakai: bList.filter(b => b.status === "Tidak Digunakan").length,
							jumlahPerluRenovasi: bList.filter(b => b.status === "Perlu Renovasi").length
						};
						const sIdx = nextSummary.findIndex((s) => s.satdikId === sid);
						if (sIdx >= 0) nextSummary[sIdx] = updated;
						else nextSummary.push(updated);
					}
				}
				return {
					...prev,
					buildings: nextBuildings,
					summary: nextSummary
				};
			});
			return updatedBuilding;
		};

		const handleDeleteAsramaBuilding = async (id) => {
			let result = null;
			if (dbStatus.connected && typeof apiDeleteAsramaBuilding === "function") {
				result = await apiDeleteAsramaBuilding(id);
			}
			const summaryRow = result?.summaryRow;

			setAsramaData((prev) => {
				const target = (prev.buildings || []).find((b) => b.id === id);
				const sid = target?.satdikId;
				const nextBuildings = (prev.buildings || []).filter((b) => b.id !== id);
				let nextSummary = [...(prev.summary || [])];
				if (summaryRow) {
					const idx = nextSummary.findIndex((s) => s.satdikId === summaryRow.satdikId);
					if (idx >= 0) nextSummary[idx] = summaryRow;
				} else if (sid) {
					const bList = nextBuildings.filter((b) => b.satdikId === sid);
					const sumRow = nextSummary.find((s) => s.satdikId === sid);
					if (sumRow) {
						const updated = {
							...sumRow,
							jumlahAsrama: bList.length,
							jumlahKamar: bList.reduce((acc, b) => acc + (Number(b.jumlahKamar) || 0), 0),
							luasM2: bList.reduce((acc, b) => acc + (Number(b.luasM2) || 0), 0),
						kapasitas: bList.reduce((acc, b) => acc + (Number(b.kapasitas) || 0), 0),
						kapasitasAktif: bList.filter(b => b.status === "Digunakan").reduce((acc, b) => acc + (Number(b.kapasitas) || 0), 0),
						jumlahTidakDipakai: bList.filter(b => b.status === "Tidak Digunakan").length,
						jumlahPerluRenovasi: bList.filter(b => b.status === "Perlu Renovasi").length
						};
						const sIdx = nextSummary.findIndex((s) => s.satdikId === sid);
						if (sIdx >= 0) nextSummary[sIdx] = updated;
					}
				}
				return {
					...prev,
					buildings: nextBuildings,
					summary: nextSummary
				};
			});
			return true;
		};

		// =========================================================================
		// CRUD Handlers: Standar Sarpras Prodi
		// =========================================================================
		const recomputeLocalStandarRekap = (itemsList, prevBidangList, prevRekapList, bidangId) => {
			const bRow = prevBidangList.find((b) => b.id === bidangId);
			if (!bRow) return { bidangList: prevBidangList, rekapList: prevRekapList };

			const satdikIds = Array.isArray(bRow.satdikIds) ? bRow.satdikIds : [];
			const codePrefix = bRow.code || 'STD';
			const bItems = itemsList.filter((it) => it.bidangId === bidangId);

			let pTotBidang = 0;
			let sTotBidang = 0;
			bItems.forEach((it) => {
				if (it.sec === 'A') pTotBidang++;
				else sTotBidang++;
			});
			const totalItemsBidang = bItems.length;

			const nextBidangList = prevBidangList.map((b) => {
				if (b.id !== bidangId) return b;
				return {
					...b,
					prasaranaCount: pTotBidang,
					saranaCount: sTotBidang,
					totalItems: totalItemsBidang
				};
			});

			const nextRekapList = [...prevRekapList];

			satdikIds.forEach((sid) => {
				let p_tot = 0, p_full = 0, p_part = 0, p_zero = 0;
				let s_tot = 0, s_full = 0, s_part = 0, s_zero = 0;
				let p_score_sum = 0.0;
				let s_score_sum = 0.0;
				let std_vol_sum = 0.0;
				let real_vol_sum = 0.0;

				bItems.forEach((it) => {
					const sv = Number(it.stdVol) || 0;
					const rv = it.real && it.real[sid] !== undefined ? Number(it.real[sid]) : 0;

					std_vol_sum += sv;
					real_vol_sum += rv;
					const ratio_item = (sv <= 0 && rv > 0) ? 1.0 : (sv > 0 ? Math.min(1.0, rv / sv) : 0.0);

					if (it.sec === 'A') {
						p_tot++;
						p_score_sum += ratio_item;
						if (sv > 0 && rv >= sv) p_full++;
						else if (rv > 0) p_part++;
						else p_zero++;
					} else {
						s_tot++;
						s_score_sum += ratio_item;
						if (sv > 0 && rv >= sv) s_full++;
						else if (rv > 0) s_part++;
						else s_zero++;
					}
				});

				const tot_items = p_tot + s_tot;
				const tot_full = p_full + s_full;
				const tot_part = p_part + s_part;
				const tot_zero = p_zero + s_zero;

				const persen_p = p_tot > 0 ? Math.round((p_score_sum / p_tot) * 1000) / 10 : 0.0;
				const persen_s = s_tot > 0 ? Math.round((s_score_sum / s_tot) * 1000) / 10 : 0.0;
				const persen_all = tot_items > 0 ? Math.round(((p_score_sum + s_score_sum) / tot_items) * 1000) / 10 : 0.0;

				const rekapId = `${codePrefix}-${sid}`;
				const updatedRow = {
					id: rekapId,
					bidangId,
					satdikId: sid,
					prasaranaTotal: p_tot,
					prasaranaTerpenuhi: p_full,
					prasaranaSebagian: p_part,
					prasaranaKosong: p_zero,
					saranaTotal: s_tot,
					saranaTerpenuhi: s_full,
					saranaSebagian: s_part,
					saranaKosong: s_zero,
					totalItems: tot_items,
					totalTerpenuhi: tot_full,
					totalSebagian: tot_part,
					totalKosong: tot_zero,
					persenPrasarana: persen_p,
					persenSarana: persen_s,
					persenTotal: persen_all,
					stdVolSum: Math.round(std_vol_sum * 100) / 100,
					realVolSum: Math.round(real_vol_sum * 100) / 100
				};

				const rIdx = nextRekapList.findIndex((r) => r.bidangId === bidangId && r.satdikId === sid);
				if (rIdx >= 0) nextRekapList[rIdx] = { ...nextRekapList[rIdx], ...updatedRow };
				else nextRekapList.push(updatedRow);
			});

			return { bidangList: nextBidangList, rekapList: nextRekapList };
		};

		const handleAddStandarItem = async (payload) => {
			let result = null;
			if (dbStatus.connected && typeof apiCreateStandarItem === "function") {
				result = await apiCreateStandarItem(payload);
			}
			const createdItem = result?.data || {
				id: payload.id || ("STD-" + Date.now()),
				...payload
			};
			setStandarData((prev) => {
				const nextItems = [...(prev.items || []), createdItem];
				let nextBidang = [...(prev.bidang || [])];
				let nextRekap = [...(prev.rekap || [])];
				if (result?.bidang) {
					const bIdx = nextBidang.findIndex((b) => b.id === result.bidang.id);
					if (bIdx >= 0) nextBidang[bIdx] = result.bidang;
				}
				if (Array.isArray(result?.rekap) && result.rekap.length > 0) {
					result.rekap.forEach((r) => {
						const rIdx = nextRekap.findIndex((x) => x.id === r.id || (x.bidangId === r.bidangId && x.satdikId === r.satdikId));
						if (rIdx >= 0) nextRekap[rIdx] = r;
						else nextRekap.push(r);
					});
				} else if (createdItem.bidangId) {
					const recomputed = recomputeLocalStandarRekap(nextItems, nextBidang, nextRekap, createdItem.bidangId);
					nextBidang = recomputed.bidangList;
					nextRekap = recomputed.rekapList;
				}
				return {
					...prev,
					items: nextItems,
					bidang: nextBidang,
					rekap: nextRekap
				};
			});
			return createdItem;
		};

		const handleUpdateStandarItem = async (id, payload) => {
			let result = null;
			if (dbStatus.connected && typeof apiUpdateStandarItem === "function") {
				result = await apiUpdateStandarItem(id, payload);
			}
			setStandarData((prev) => {
				const oldItem = (prev.items || []).find((it) => it.id === id);
				const mergedReal = { ...(oldItem?.real || {}), ...(payload.real || {}) };
				const updatedItem = result?.data || { ...(oldItem || {}), ...payload, real: mergedReal };
				const nextItems = (prev.items || []).map((it) => it.id === id ? updatedItem : it);
				let nextBidang = [...(prev.bidang || [])];
				let nextRekap = [...(prev.rekap || [])];

				if (result?.bidang) {
					const bIdx = nextBidang.findIndex((b) => b.id === result.bidang.id);
					if (bIdx >= 0) nextBidang[bIdx] = result.bidang;
				}
				if (Array.isArray(result?.rekap) && result.rekap.length > 0) {
					result.rekap.forEach((r) => {
						const rIdx = nextRekap.findIndex((x) => x.id === r.id || (x.bidangId === r.bidangId && x.satdikId === r.satdikId));
						if (rIdx >= 0) nextRekap[rIdx] = r;
						else nextRekap.push(r);
					});
				} else {
					const targetBid = updatedItem.bidangId || oldItem?.bidangId;
					if (targetBid) {
						const recomputed = recomputeLocalStandarRekap(nextItems, nextBidang, nextRekap, targetBid);
						nextBidang = recomputed.bidangList;
						nextRekap = recomputed.rekapList;
					}
				}
				return {
					...prev,
					items: nextItems,
					bidang: nextBidang,
					rekap: nextRekap
				};
			});
			return result?.data || { id, ...payload };
		};

		const handleDeleteStandarItem = async (id) => {
			let result = null;
			if (dbStatus.connected && typeof apiDeleteStandarItem === "function") {
				result = await apiDeleteStandarItem(id);
			}
			setStandarData((prev) => {
				const oldItem = (prev.items || []).find((it) => it.id === id);
				const targetBid = oldItem?.bidangId;
				const nextItems = (prev.items || []).filter((it) => it.id !== id);
				let nextBidang = [...(prev.bidang || [])];
				let nextRekap = [...(prev.rekap || [])];

				if (result?.bidang) {
					const bIdx = nextBidang.findIndex((b) => b.id === result.bidang.id);
					if (bIdx >= 0) nextBidang[bIdx] = result.bidang;
				}
				if (Array.isArray(result?.rekap) && result.rekap.length > 0) {
					result.rekap.forEach((r) => {
						const rIdx = nextRekap.findIndex((x) => x.id === r.id || (x.bidangId === r.bidangId && x.satdikId === r.satdikId));
						if (rIdx >= 0) nextRekap[rIdx] = r;
						else nextRekap.push(r);
					});
				} else if (targetBid) {
					const recomputed = recomputeLocalStandarRekap(nextItems, nextBidang, nextRekap, targetBid);
					nextBidang = recomputed.bidangList;
					nextRekap = recomputed.rekapList;
				}
				return {
					...prev,
					items: nextItems,
					bidang: nextBidang,
					rekap: nextRekap
				};
			});
			return true;
		};
		// =========================================================================
		// Batch Import Handler: Gedung Asrama + Tambak/Kolam + Standar Prodi (Excel)
		// =========================================================================
		const handleBulkImport = async ({ buildings: inBuildings = [], tambakUnits: inTambak = [], standarItems: inStandar = [] }) => {
			if (inTambak.length > 0) {
				for (const tb of inTambak) {
					await handleAddTambakUnit(tb);
				}
			}

			if (dbStatus.connected && typeof apiBulkImport === "function" && (inBuildings.length > 0 || inStandar.length > 0)) {
				const res = await apiBulkImport({
					buildings: inBuildings,
					standarItems: inStandar
				});

				if ((Array.isArray(res.buildings) && res.buildings.length > 0) || (Array.isArray(res.asramaSummary) && res.asramaSummary.length > 0)) {
					setAsramaData((prev) => {
						const nextBuildings = [...(res.buildings || []), ...(prev.buildings || [])];
						const nextSummary = [...(prev.summary || [])];
						(res.asramaSummary || []).forEach((sRow) => {
							const idx = nextSummary.findIndex((x) => x.satdikId === sRow.satdikId);
							if (idx >= 0) nextSummary[idx] = sRow;
							else nextSummary.push(sRow);
						});
						return { ...prev, buildings: nextBuildings, summary: nextSummary };
					});
				}

				if ((Array.isArray(res.standarItems) && res.standarItems.length > 0) || (Array.isArray(res.standarBidang) && res.standarBidang.length > 0)) {
					setStandarData((prev) => {
						const nextItems = [...(prev.items || []), ...(res.standarItems || [])];
						const nextBidang = [...(prev.bidang || [])];
						const nextRekap = [...(prev.rekap || [])];
						(res.standarBidang || []).forEach((bRow) => {
							const bIdx = nextBidang.findIndex((x) => x.id === bRow.id);
							if (bIdx >= 0) nextBidang[bIdx] = bRow;
						});
						(res.standarRekap || []).forEach((rRow) => {
							const rIdx = nextRekap.findIndex((x) => x.id === rRow.id || (x.bidangId === rRow.bidangId && x.satdikId === rRow.satdikId));
							if (rIdx >= 0) nextRekap[rIdx] = rRow;
							else nextRekap.push(rRow);
						});
						return { ...prev, items: nextItems, bidang: nextBidang, rekap: nextRekap };
					});
				}

				return {
					...res,
					counts: {
						...(res.counts || {}),
						tambakUnits: inTambak.length,
						total: (res.counts?.total || 0) + inTambak.length
					}
				};
			}

			// Fallback Mode Offline (Local State)
			const nowTs = Date.now();

			if (inBuildings.length > 0) {
				const localBuildings = inBuildings.map((b, idx) => ({
					id: b.id || ("ASR-IMP-" + (nowTs + idx).toString().slice(-5)),
					...b,
					jumlahKamar: Number(b.jumlahKamar) || 0,
					luasM2: Number(b.luasM2) || 0,
					kapasitas: Number(b.kapasitas) || 0,
					status: b.status || "Digunakan"
				}));
				setAsramaData((prev) => {
					const nextBuildings = [...localBuildings, ...(prev.buildings || [])];
					const nextSummary = [...(prev.summary || [])];
					const affectedSids = new Set(localBuildings.map((b) => b.satdikId));
					affectedSids.forEach((sid) => {
						const bList = nextBuildings.filter((b) => b.satdikId === sid);
						const sumRow = nextSummary.find((s) => s.satdikId === sid) || { satdikId: sid };
						const updated = {
							...sumRow,
							jumlahAsrama: bList.length,
							jumlahKamar: bList.reduce((acc, b) => acc + (Number(b.jumlahKamar) || 0), 0),
							luasM2: bList.reduce((acc, b) => acc + (Number(b.luasM2) || 0), 0),
							kapasitas: bList.reduce((acc, b) => acc + (Number(b.kapasitas) || 0), 0),
							kapasitasAktif: bList.filter((b) => b.status === "Digunakan").reduce((acc, b) => acc + (Number(b.kapasitas) || 0), 0),
							jumlahTidakDipakai: bList.filter((b) => b.status === "Tidak Digunakan").length,
							jumlahPerluRenovasi: bList.filter((b) => b.status === "Perlu Renovasi").length
						};
						const sIdx = nextSummary.findIndex((s) => s.satdikId === sid);
						if (sIdx >= 0) nextSummary[sIdx] = updated;
						else nextSummary.push(updated);
					});
					return { ...prev, buildings: nextBuildings, summary: nextSummary };
				});
			}

			if (inStandar.length > 0) {
				const localStandar = inStandar.map((st, idx) => ({
					id: st.id || ("STD-IMP-" + (nowTs + idx).toString().slice(-5)),
					...st
				}));
				setStandarData((prev) => ({
					...prev,
					items: [...(prev.items || []), ...localStandar]
				}));
			}

			return {
				success: true,
				counts: {
					buildings: inBuildings.length,
					tambakUnits: inTambak.length,
					standarItems: inStandar.length,
					total: inBuildings.length + inTambak.length + inStandar.length
				}
			};
		};

		const handleExportTambak = (payload, scopeLabel) => {
			if (typeof exportTambakToExcel === "function") {
				exportTambakToExcel(payload || tambakData, SATDIK_LIST, {
					currentUser,
					filterSatdikName:
						scopeLabel ||
						(currentUser?.accessibleSatdik === "ALL"
							? "Seluruh Satuan Pendidikan KKP (18 Satdik)"
							: currentUser?.satdikName || "Kampus Khusus"),
					filenamePrefix: "Sarana_Prasarana_Satdik_KP_Tambak_dan_Kolam"
				});
			}
		};

		const recomputeLocalTambakSummary = (unitsList, prevSummary, satdikId) => {
			const sUnits = unitsList.filter((u) => u.satdikId === satdikId);
			const existing = prevSummary.find((s) => s.satdikId === satdikId) || {
				satdikId,
				namaSatdik: SATDIK_LIST.find((s) => s.id === satdikId)?.name || satdikId,
				jenjang: SATDIK_LIST.find((s) => s.id === satdikId)?.type || "Politeknik"
			};
			return {
				...existing,
				jumlahUnit: sUnits.length,
				jumlahTambak: sUnits.filter((u) => u.jenis === "Tambak").length,
				jumlahKolam: sUnits.filter((u) => u.jenis === "Kolam").length,
				jumlahTandon: sUnits.filter((u) => u.jenis !== "Tambak" && u.jenis !== "Kolam").length,
				luasTotalM2: sUnits.reduce((acc, u) => acc + (Number(u.luasM2) || 0), 0),
				luasTambakM2: sUnits.filter((u) => u.jenis === "Tambak").reduce((acc, u) => acc + (Number(u.luasM2) || 0), 0),
				luasKolamM2: sUnits.filter((u) => u.jenis !== "Tambak").reduce((acc, u) => acc + (Number(u.luasM2) || 0), 0),
				kondisiBaik: sUnits.filter((u) => u.kondisi === "Baik").length,
				kondisiRusakRingan: sUnits.filter((u) => u.kondisi === "Rusak Ringan").length,
				kondisiRusakBerat: sUnits.filter((u) => u.kondisi === "Rusak Berat").length,
				totalKincir: sUnits.reduce((acc, u) => acc + (Number(u.jumlahKincir) || 0), 0)
			};
		};

		const handleAddTambakUnit = async (payload) => {
			let result = null;
			if (dbStatus.connected && typeof apiCreateTambakUnit === "function") {
				result = await apiCreateTambakUnit(payload);
			}
			const satObj = SATDIK_LIST.find((s) => s.id === payload.satdikId);
			const createdUnit = result?.unit || {
				id: payload.id || "TBK-NEW-" + Date.now().toString().slice(-4),
				namaSatdik: satObj?.name || payload.satdikId,
				jenjang: satObj?.type || "Politeknik",
				...payload,
				luasM2: Number(payload.luasM2) || 0,
				jumlahKincir: Number(payload.jumlahKincir) || 0
			};
			const summaryRow = result?.summaryRow;
			setTambakData((prev) => {
				const nextUnits = [createdUnit, ...(prev.units || [])];
				const nextSummary = [...(prev.summary || [])];
				const updatedSum = summaryRow || recomputeLocalTambakSummary(nextUnits, nextSummary, createdUnit.satdikId);
				const idx = nextSummary.findIndex((s) => s.satdikId === createdUnit.satdikId);
				if (idx >= 0) nextSummary[idx] = updatedSum;
				else nextSummary.push(updatedSum);
				return { ...prev, units: nextUnits, summary: nextSummary };
			});
			return createdUnit;
		};

		const handleUpdateTambakUnit = async (id, payload) => {
			let result = null;
			if (dbStatus.connected && typeof apiUpdateTambakUnit === "function") {
				result = await apiUpdateTambakUnit(id, payload);
			}
			const updatedUnit = result?.unit || { id, ...payload };
			const summaryRow = result?.summaryRow;
			setTambakData((prev) => {
				const nextUnits = (prev.units || []).map((u) => (u.id === id ? { ...u, ...updatedUnit } : u));
				const nextSummary = [...(prev.summary || [])];
				const sid = updatedUnit.satdikId || prev.units.find((u) => u.id === id)?.satdikId;
				if (sid) {
					const updatedSum = summaryRow || recomputeLocalTambakSummary(nextUnits, nextSummary, sid);
					const idx = nextSummary.findIndex((s) => s.satdikId === sid);
					if (idx >= 0) nextSummary[idx] = updatedSum;
				}
				return { ...prev, units: nextUnits, summary: nextSummary };
			});
			return updatedUnit;
		};

		const handleDeleteTambakUnit = async (id) => {
			let result = null;
			if (dbStatus.connected && typeof apiDeleteTambakUnit === "function") {
				result = await apiDeleteTambakUnit(id);
			}
			const summaryRow = result?.summaryRow;
			setTambakData((prev) => {
				const target = (prev.units || []).find((u) => u.id === id);
				const sid = result?.satdikId || target?.satdikId;
				const nextUnits = (prev.units || []).filter((u) => u.id !== id);
				const nextSummary = [...(prev.summary || [])];
				if (sid) {
					const updatedSum = summaryRow || recomputeLocalTambakSummary(nextUnits, nextSummary, sid);
					const idx = nextSummary.findIndex((s) => s.satdikId === sid);
					if (idx >= 0) nextSummary[idx] = updatedSum;
				}
				return { ...prev, units: nextUnits, summary: nextSummary };
			});
			return true;
		};

		// Handler penyelesaian pemeliharaan mendesak (EarlyWarningMaintenance)
		const handleResolveUrgentAsset = async (assetId, _newCondition, notes) => {
			const matchingBuilding = (asramaData?.buildings || []).find((b) => b.id === assetId);
			if (matchingBuilding) {
				await handleUpdateAsramaBuilding(assetId, {
					...matchingBuilding,
					status: "Digunakan",
					keterangan: notes || matchingBuilding.keterangan
				});
				return;
			}
			const matchingTambak = (tambakData?.units || []).find((u) => u.id === assetId);
			if (matchingTambak) {
				await handleUpdateTambakUnit(assetId, {
					...matchingTambak,
					kondisi: "Baik",
					keterangan: notes || matchingTambak.keterangan
				});
			}
		};

		const handleExportExcel = () => {
			if (typeof window.SARPRAS_EXCEL?.exportComprehensiveToExcel === "function") {
				window.SARPRAS_EXCEL.exportComprehensiveToExcel({
					asramaData,
					tambakData,
					standarData,
					satdikList: SATDIK_LIST,
					currentUser,
					options: {
						filterSatdikName: currentUser?.accessibleSatdik === "ALL" ? "Seluruh Satuan Pendidikan (18 Kampus Vokasi KKP)" : currentUser?.satdikName || "Kampus Khusus",
						filenamePrefix: "Sarana_Prasarana_Satdik_KP_Laporan_Komprehensif_Nasional"
					}
				});
				return;
			}
			alert("Modul ekspor Excel sedang memuat. Silakan muat ulang halaman (Ctrl + F5).");
		};
		// If user is not authenticated, show the official government Login Portal
		const [isSidebarOpen, setIsSidebarOpen] = useState(true);
		const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

		const handleToggleSidebar = () => {
			if (typeof window !== "undefined" && window.innerWidth < 768) {
				setIsMobileDrawerOpen((prev) => !prev);
			} else {
				setIsSidebarOpen((prev) => !prev);
				setTimeout(() => {
					try {
						window.dispatchEvent(new Event("resize"));
					} catch {}
				}, 220);
			}
		};

		if (!currentUser) {
			return /* @__PURE__ */ React.createElement(LoginScreen, { onLogin: handleLogin });
		}
		return /* @__PURE__ */ React.createElement("div", { className: "min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-white" }, /* @__PURE__ */ React.createElement(Navbar, {
			activeTab,
			setActiveTab: handleTabChange,
			totalAssets: kpis?.totalAssets || 0,
			criticalCount: kpis?.urgentAssets?.length || 0,
			onOpenAddModal: handleOpenAddModal,
			onExportExcel: handleExportExcel,
			onExportCSV: handleExportExcel,
			currentUser,
			onOpenProfile: () => setIsProfileModalOpen(true),
			onLogout: handleLogout,
			dbStatus,
			onToggleSidebar: handleToggleSidebar,
			isSidebarOpen,
			showTopNav: false
		}), /* @__PURE__ */ React.createElement("div", {
			className: "flex-1 flex min-h-0 relative items-start",
			style: { alignItems: "flex-start" }
		}, /* @__PURE__ */ React.createElement(YouTubeSidebar, {
			activeTab,
			setActiveTab: (tabId) => {
				handleTabChange(tabId);
				setIsMobileDrawerOpen(false);
			},
			isOpen: isSidebarOpen,
			isMobileOpen: isMobileDrawerOpen,
			onCloseMobile: () => setIsMobileDrawerOpen(false),
			criticalCount: kpis?.urgentAssets?.length || 0,
			onOpenAddModal: handleOpenAddModal,
			onExportExcel: handleExportExcel,
			currentUser,
			dbStatus
		}), /* @__PURE__ */ React.createElement("div", { className: "flex-1 min-w-0 flex flex-col" }, currentUser.accessibleSatdik && currentUser.accessibleSatdik !== "ALL" && /* @__PURE__ */ React.createElement("div", { className: "bg-cyan-950/70 border-b border-cyan-800/50 py-2 px-4 text-xs text-cyan-200" }, /* @__PURE__ */ React.createElement("div", { className: "max-w-7xl mx-auto flex items-center justify-between" }, /* @__PURE__ */ React.createElement("span", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement("span", { className: "w-2 h-2 rounded-full bg-cyan-400 animate-ping" }), /* @__PURE__ */ React.createElement("span", null, "Mode Operator Kampus Aktif: ", /* @__PURE__ */ React.createElement("strong", null, currentUser.satdikName), ". Data terfokus pada satdik Anda.")))), /* @__PURE__ */ React.createElement("main", { className: "flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6 mobile-main-container pb-24 md:pb-8" }, activeTab === "dashboard" && /* @__PURE__ */ React.createElement(ExecutiveDashboard, {
			kpis,
			assets,
			asramaData,
			standarData,
			tambakData,
			satdikList: SATDIK_LIST,
			currentUser,
			onNavigateTab: handleTabChange
		}), activeTab === "map" && /* @__PURE__ */ React.createElement(GeospatialMap, {
			satdikBreakdown: kpis.satdikBreakdown,
			onNavigateTab: handleTabChange
		}), activeTab === "asrama" && /* @__PURE__ */ React.createElement(AsramaCapacityView, {
			asramaData,
			satdikList: SATDIK_LIST,
			currentUser,
			onAddBuilding: handleAddAsramaBuilding,
			onUpdateBuilding: handleUpdateAsramaBuilding,
			onDeleteBuilding: handleDeleteAsramaBuilding,
			onOpenAddModal: handleOpenAddModal
		}), activeTab === "tambak" && /* @__PURE__ */ React.createElement(TambakKolamView, {
			tambakData,
			satdikList: SATDIK_LIST,
			currentUser,
			onAddUnit: handleAddTambakUnit,
			onUpdateUnit: handleUpdateTambakUnit,
			onDeleteUnit: handleDeleteTambakUnit,
			onOpenAddModal: handleOpenAddModal
		}), activeTab === "standar" && /* @__PURE__ */ React.createElement(StandarProdiView, {
			standarData,
			satdikList: SATDIK_LIST,
			currentUser,
			onAddItem: handleAddStandarItem,
			onUpdateItem: handleUpdateStandarItem,
			onDeleteItem: handleDeleteStandarItem,
			onOpenAddModal: handleOpenAddModal
		}), activeTab === "maintenance" && /* @__PURE__ */ React.createElement(EarlyWarningMaintenance, {
			urgentAssets: kpis.urgentAssets,
			onResolveAsset: handleResolveUrgentAsset
		})))), /* @__PURE__ */ React.createElement(AddAssetModal, {
			isOpen: isAddModalOpen,
			onClose: () => setIsAddModalOpen(false),
			onAddBuilding: handleAddAsramaBuilding,
			onAddTambakUnit: handleAddTambakUnit,
			onAddItem: handleAddStandarItem,
			onBulkImport: handleBulkImport,
			initialType: addModalInitialType,
			standarBidangList: standarData?.bidang || [],
			satdikList: SATDIK_LIST,
			currentUser
		}), /* @__PURE__ */ React.createElement(UserProfileModal, {
			user: currentUser,
			isOpen: isProfileModalOpen,
			onClose: () => setIsProfileModalOpen(false),
			onLogout: handleLogout
		}), /* @__PURE__ */ React.createElement(MobileBottomNav, {
			activeTab,
			setActiveTab: handleTabChange,
			criticalCount: kpis?.urgentAssets?.length || 0,
			onOpenAddModal: handleOpenAddModal,
			canAddAsset: currentUser?.permissions?.includes("edit_all") || currentUser?.permissions?.includes("edit_own")
		}));
	};
})();
const App = window.__App;
// ============================================================================
// MODULE: src/main.jsx
// ============================================================================
(() => {
	const { Component, StrictMode } = React;
	const { createRoot } = window.__VENDOR__.ReactDOMClient;
	class ErrorBoundary extends Component {
		constructor(props) {
			super(props);
			this.state = {
				hasError: false,
				error: null
			};
		}
		static getDerivedStateFromError(error) {
			return {
				hasError: true,
				error
			};
		}
		componentDidCatch(error, errorInfo) {
			console.error("ErrorBoundary caught:", error, errorInfo);
		}
		render() {
			if (this.state.hasError) {
				return /* @__PURE__ */ React.createElement("div", { className: "min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center font-sans" }, /* @__PURE__ */ React.createElement("div", { className: "max-w-md bg-slate-900 border border-rose-500/40 rounded-2xl p-6 shadow-2xl" }, /* @__PURE__ */ React.createElement("div", { className: "w-12 h-12 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto mb-3 text-xl font-bold" }, "!"), /* @__PURE__ */ React.createElement("h2", { className: "text-lg font-bold text-white mb-2" }, "Terjadi Kendala Memuat Tampilan"), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-slate-400 mb-5 break-words" }, this.state.error?.message || "Aplikasi mengalami kesalahan sementara."), /* @__PURE__ */ React.createElement("div", { className: "flex gap-3 justify-center" }, /* @__PURE__ */ React.createElement("button", {
					onClick: () => window.location.reload(),
					className: "px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition"
				}, "Muat Ulang"), /* @__PURE__ */ React.createElement("button", {
					onClick: () => {
						try {
							localStorage.removeItem("kkp_auth_session_v2");
						} catch {}
						window.location.reload();
					},
					className: "px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold transition shadow-md shadow-cyan-900/30"
				}, "Reset Sesi Login"))));
			}
			return this.props.children;
		}
	}
	createRoot(document.getElementById("root")).render(/* @__PURE__ */ React.createElement(StrictMode, null, /* @__PURE__ */ React.createElement(ErrorBoundary, null, /* @__PURE__ */ React.createElement(ThemeProvider, null, /* @__PURE__ */ React.createElement(App, null)))));
})();

})();
