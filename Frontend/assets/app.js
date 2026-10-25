/**
 * assets/js/app.js
 * Komponen Utama Antarmuka Web SIM-SARPRAS KKP (Tampilan Asli Utuh)
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
	const { Anchor, BarChart3, MapPin, Layers, AlertTriangle, PlusCircle, Download, Ship, Sparkles, Activity, User, LogOut, Sun, Moon } = window.__VENDOR__.Lucide;
	const logoKkp = "assets/logo-kkp.png";
	window.__Navbar = function Navbar({ activeTab, setActiveTab, totalAssets, criticalCount, onOpenAddModal, onExportCSV, onExportExcel, currentUser, onOpenProfile, onLogout, dbStatus }) {
		const { isDark, toggleTheme } = useTheme();
		const navItems = [
			{
				id: "dashboard",
				label: "Ringkasan Eksekutif",
				icon: BarChart3
			},
			{
				id: "map",
				label: "Peta Sebaran Geospasial",
				icon: MapPin
			},
			{
				id: "explorer",
				label: "Inventaris & Katalog Sarpras",
				icon: Layers
			},
			{
				id: "maintenance",
				label: "Early Warning & Perbaikan",
				icon: AlertTriangle,
				badge: criticalCount > 0 ? criticalCount : null,
				badgeColor: "bg-rose-500 text-white animate-pulse"
			}
		];
		return /* @__PURE__ */ React.createElement("header", { className: "sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-xl transition-colors duration-200" }, /* @__PURE__ */ React.createElement("div", { className: "max-w-7xl mx-auto px-3 sm:px-6" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between h-14 sm:h-16" }, /* @__PURE__ */ React.createElement("div", {
			className: "flex items-center space-x-2 sm:space-x-3 cursor-pointer min-w-0",
			onClick: () => setActiveTab("dashboard")
		}, /* @__PURE__ */ React.createElement("div", { className: `header-logo-container w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-white p-1 flex items-center justify-center shadow-lg hover:scale-105 transition-transform flex-shrink-0 border ${isDark ? "border-cyan-400/50 shadow-cyan-500/20" : "border-black shadow-slate-400/20"}` }, /* @__PURE__ */ React.createElement("img", {
			src: logoKkp,
			alt: "Logo Resmi Kementerian Kelautan dan Perikanan",
			className: "w-full h-full object-contain"
		})), /* @__PURE__ */ React.createElement("div", { className: "min-w-0" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-1.5 sm:gap-2" }, /* @__PURE__ */ React.createElement("h1", { className: "text-sm sm:text-lg font-bold text-white tracking-tight leading-tight truncate" }, "SARPRAS ", /* @__PURE__ */ React.createElement("span", { className: "text-cyan-400 font-extrabold" }, "KKP"))), /* @__PURE__ */ React.createElement("p", { className: "text-[11px] text-slate-400 hidden sm:block" }, "Dashboard Analitik Sarana & Prasarana Vokasi Kelautan & Perikanan"))), /* @__PURE__ */ React.createElement("div", { className: "flex items-center space-x-1.5 sm:space-x-2" }, currentUser?.permissions?.includes("edit_all") || currentUser?.permissions?.includes("edit_own") ? /* @__PURE__ */ React.createElement("button", {
			onClick: onOpenAddModal,
			className: "hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs shadow-md shadow-cyan-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]",
			title: "Input data aset sarana prasarana baru"
		}, /* @__PURE__ */ React.createElement(PlusCircle, { className: "w-4 h-4" }), /* @__PURE__ */ React.createElement("span", null, "Tambah Sarpras")) : null, /* @__PURE__ */ React.createElement("button", {
			onClick: onExportExcel || onExportCSV,
			className: "hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-emerald-200 border border-emerald-700/60 text-xs font-semibold shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]",
			title: "Ekspor data inventaris sarpras ke Microsoft Excel (.xls) dengan tabel berformat resmi & rapi"
		}, /* @__PURE__ */ React.createElement(Download, { className: "w-4 h-4 text-emerald-400" }), /* @__PURE__ */ React.createElement("span", null, "Ekspor Excel")), /* @__PURE__ */ React.createElement("button", {
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
			title: "Keluar dari sesi SARPRAS",
			"aria-label": "Logout"
		}, /* @__PURE__ */ React.createElement(LogOut, { className: "w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-500 dark:text-rose-400 group-hover:text-white transition-colors" }), /* @__PURE__ */ React.createElement("span", { className: "text-[11px] sm:text-xs font-bold tracking-tight" }, "Keluar"))))), /* @__PURE__ */ React.createElement("div", { className: "hidden md:flex items-center space-x-1 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-slate-700" }, navItems.map((tab) => {
			const Icon = tab.icon;
			const isActive = activeTab === tab.id;
			return /* @__PURE__ */ React.createElement("button", {
				key: tab.id,
				onClick: () => setActiveTab(tab.id),
				className: `relative flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-all duration-200 ${isActive ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-900/50" : "text-slate-300 hover:text-white hover:bg-slate-800/70"}`
			}, /* @__PURE__ */ React.createElement(Icon, { className: `w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}` }), /* @__PURE__ */ React.createElement("span", null, tab.label), tab.badge && /* @__PURE__ */ React.createElement("span", { className: `px-1.5 py-0.2 text-[10px] font-bold rounded-full ${tab.badgeColor}` }, tab.badge), isActive && /* @__PURE__ */ React.createElement("span", { className: "absolute bottom-0 left-2 right-2 h-0.5 bg-cyan-300 rounded-full" }));
		}))));
	};
})();
const Navbar = window.__Navbar;
// ============================================================================
// MODULE: src/components/MobileBottomNav.jsx
// ============================================================================
(() => {
	// src/components/MobileBottomNav.jsx
	const { BarChart3, MapPin, Layers, AlertTriangle, PlusCircle } = window.__VENDOR__.Lucide;
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
				id: "explorer",
				label: "Katalog",
				icon: Layers
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
			onClick: onOpenAddModal,
			className: "flex flex-col items-center justify-center py-1 px-1 text-cyan-400 hover:text-cyan-300",
			title: "Tambah Sarpras Baru"
		}, /* @__PURE__ */ React.createElement(PlusCircle, { className: "w-5 h-5 text-cyan-400" }), /* @__PURE__ */ React.createElement("span", { className: "text-[10px] mt-0.5 tracking-tight font-medium text-cyan-400" }, "+Aset"))));
	};
})();
const MobileBottomNav = window.__MobileBottomNav;
// ============================================================================
// MODULE: src/components/LoginScreen.jsx
// ============================================================================
(() => {
	const { useState } = React;
	const { Lock, Mail, Eye, EyeOff, Building2, CheckCircle2, AlertCircle, UserCheck, KeyRound, ChevronRight, Anchor, Shield, Sparkles, Sun, Moon } = window.__VENDOR__.Lucide;
	const { AUTH_USERS, authenticateUser } = window.SARPRAS_AUTH;
	const { apiLogin } = window.SARPRAS_API;
	const logoKkp = "assets/logo-kkp.png";
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
				// Coba autentikasi lokal akun demo (jika backend offline atau belum tersinkron)
				const localUser = authenticateUser(identifier, password);
				if (localUser) {
					onLogin(localUser, rememberMe);
					return;
				}
				setErrorMessage(res.message || "Email/NIP atau kata sandi tidak cocok. Silakan periksa kembali kredensial Anda.");
			} catch {
				const localUser = authenticateUser(identifier, password);
				if (localUser) {
					onLogin(localUser, rememberMe);
				} else {
					setErrorMessage("Email/NIP atau kata sandi tidak cocok. Silakan periksa kembali kredensial Anda.");
				}
			} finally {
				setIsLoading(false);
			}
		};
		const handleQuickDemoLogin = (user) => {
			setIdentifier(user.email);
			setPassword(user.password);
			setErrorMessage("");
			setIsLoading(true);
			setTimeout(() => {
				onLogin(user, true);
			}, 300);
		};
		return /* @__PURE__ */ React.createElement("div", { className: "min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 flex flex-col justify-between p-4 sm:p-6 text-slate-100 relative overflow-hidden font-sans selection:bg-cyan-500 selection:text-white" }, /* @__PURE__ */ React.createElement("div", {
			className: "absolute inset-0 opacity-10 pointer-events-none",
			style: {
				backgroundImage: "radial-gradient(circle, #0284c7 1px, transparent 1px)",
				backgroundSize: "28px 28px"
			}
		}), /* @__PURE__ */ React.createElement("div", { className: "absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-600/10 blur-[120px] pointer-events-none" }), /* @__PURE__ */ React.createElement("div", { className: "absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" }), /* @__PURE__ */ React.createElement("div", { className: "max-w-4xl mx-auto w-full flex items-center justify-end text-xs py-2 text-slate-400 relative z-10" }, /* @__PURE__ */ React.createElement("button", {
			type: "button",
			onClick: toggleTheme,
			className: "p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center justify-center",
			title: isDark ? "Beralih ke Mode Terang (Light Mode)" : "Beralih ke Mode Gelap (Dark Mode)",
			"aria-label": "Toggle Theme"
		}, isDark ? /* @__PURE__ */ React.createElement(Sun, { className: "w-3.5 h-3.5 text-amber-400" }) : /* @__PURE__ */ React.createElement(Moon, { className: "w-3.5 h-3.5 text-sky-400" }))), /* @__PURE__ */ React.createElement("div", { className: "max-w-xl mx-auto w-full my-auto py-6 relative z-10" }, /* @__PURE__ */ React.createElement("div", { className: "bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-cyan-950/40 relative" }, /* @__PURE__ */ React.createElement("div", { className: "text-center space-y-3 pb-6 border-b border-slate-800" }, /* @__PURE__ */ React.createElement("div", { className: `login-logo-container w-20 h-20 mx-auto rounded-2xl bg-white p-2 shadow-xl flex items-center justify-center transform hover:scale-105 transition-transform duration-300 border-2 ${isDark ? "border-cyan-400/60 shadow-cyan-500/20" : "border-black shadow-slate-400/20"}` }, /* @__PURE__ */ React.createElement("img", {
			src: logoKkp,
			alt: "Logo Kementerian Kelautan dan Perikanan",
			className: "w-full h-full object-contain"
		})), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { className: "text-[11px] font-bold text-cyan-400 uppercase tracking-widest block" }, "Kementerian Kelautan dan Perikanan Republik Indonesia"), /* @__PURE__ */ React.createElement("h1", { className: "text-xl sm:text-2xl font-black text-white tracking-tight mt-1" }, "SARPRAS ", /* @__PURE__ */ React.createElement("span", { className: "text-cyan-400" }, "KKP")), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-slate-400 mt-1 max-w-md mx-auto" }, "Sistem Informasi & Analitik Sarana Prasarana Satuan Pendidikan Vokasi Kelautan dan Perikanan (BPPSDM KP)"))), errorMessage && /* @__PURE__ */ React.createElement("div", { className: "mt-5 p-3.5 bg-rose-950/80 border border-rose-500/50 rounded-xl text-xs text-rose-300 flex items-start gap-2.5 animate-shake" }, /* @__PURE__ */ React.createElement(AlertCircle, { className: "w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" }), /* @__PURE__ */ React.createElement("span", null, errorMessage)), /* @__PURE__ */ React.createElement("form", {
			onSubmit: handleSubmit,
			className: "mt-6 space-y-4"
		}, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "text-xs font-semibold text-slate-300 block mb-1.5" }, "Email Kedinasan (@kkp.go.id) atau NIP"), /* @__PURE__ */ React.createElement("div", { className: "relative" }, /* @__PURE__ */ React.createElement(Mail, { className: "w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" }), /* @__PURE__ */ React.createElement("input", {
			type: "text",
			required: true,
			placeholder: "admin.pusdik@kkp.go.id",
			value: identifier,
			onChange: (e) => setIdentifier(e.target.value),
			className: "w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
		}))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between mb-1.5" }, /* @__PURE__ */ React.createElement("label", { className: "text-xs font-semibold text-slate-300" }, "Kata Sandi (Password)"), /* @__PURE__ */ React.createElement("span", { className: "text-[11px] text-cyan-400 hover:text-cyan-300 cursor-pointer" }, "Lupa sandi?")), /* @__PURE__ */ React.createElement("div", { className: "relative" }, /* @__PURE__ */ React.createElement(Lock, { className: "w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" }), /* @__PURE__ */ React.createElement("input", {
			type: showPassword ? "text" : "password",
			required: true,
			placeholder: "••••••••",
			value: password,
			onChange: (e) => setPassword(e.target.value),
			className: "w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
		}), /* @__PURE__ */ React.createElement("button", {
			type: "button",
			onClick: () => setShowPassword(!showPassword),
			className: "absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
		}, showPassword ? /* @__PURE__ */ React.createElement(EyeOff, { className: "w-4 h-4" }) : /* @__PURE__ */ React.createElement(Eye, { className: "w-4 h-4" })))), /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between text-xs pt-1" }, /* @__PURE__ */ React.createElement("label", { className: "flex items-center space-x-2 cursor-pointer text-slate-400 hover:text-slate-300" }, /* @__PURE__ */ React.createElement("input", {
			type: "checkbox",
			checked: rememberMe,
			onChange: (e) => setRememberMe(e.target.checked),
			className: "rounded bg-slate-950 border-slate-700 text-cyan-600 focus:ring-cyan-500 w-3.5 h-3.5"
		}), /* @__PURE__ */ React.createElement("span", null, "Ingat sesi login pada perangkat ini")), /* @__PURE__ */ React.createElement("span", { className: "text-[10px] text-emerald-400 font-medium flex items-center gap-1" }, /* @__PURE__ */ React.createElement(Shield, { className: "w-3 h-3" }), /* @__PURE__ */ React.createElement("span", null, "SSL 256-Bit"))), /* @__PURE__ */ React.createElement("button", {
			type: "submit",
			disabled: isLoading,
			className: "w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 text-white font-bold text-xs tracking-wide shadow-lg shadow-cyan-900/40 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
		}, isLoading ? /* @__PURE__ */ React.createElement("div", { className: "w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" }) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(KeyRound, { className: "w-4 h-4" }), /* @__PURE__ */ React.createElement("span", null, "Masuk ke Sistem SARPRAS")))), /* @__PURE__ */ React.createElement("div", { className: "mt-6 pt-5 border-t border-slate-800" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between mb-2.5" }, /* @__PURE__ */ React.createElement("span", { className: "text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5" }, /* @__PURE__ */ React.createElement(Sparkles, { className: "w-3.5 h-3.5 text-cyan-400" }), /* @__PURE__ */ React.createElement("span", null, "Pilihan Masuk Cepat (Akun Dinas)")), /* @__PURE__ */ React.createElement("span", { className: "text-[10px] text-slate-500" }, "Klik 1-kali untuk masuk langsung")), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs" }, AUTH_USERS.map((user, idx) => /* @__PURE__ */ React.createElement("button", {
			key: user.id,
			type: "button",
			onClick: () => handleQuickDemoLogin(user),
			className: `bg-slate-950/70 hover:bg-slate-800 p-2.5 rounded-xl border border-slate-800 hover:border-cyan-500/50 text-left transition-all group flex items-center justify-between ${AUTH_USERS.length % 2 !== 0 && idx === AUTH_USERS.length - 1 ? "sm:col-span-2" : ""}`
		}, /* @__PURE__ */ React.createElement("div", { className: "truncate mr-2" }, /* @__PURE__ */ React.createElement("span", { className: "font-bold text-white block text-[11px] group-hover:text-cyan-300 truncate" }, user.name.split(",")[0]), /* @__PURE__ */ React.createElement("span", { className: "text-[10px] text-cyan-400 block truncate" }, user.roleLabel), /* @__PURE__ */ React.createElement("span", { className: "text-[9px] text-slate-500 block truncate" }, user.email), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-1.5 mt-1" }, /* @__PURE__ */ React.createElement("span", { className: "text-[9px] text-slate-400" }, "Sandi:"), /* @__PURE__ */ React.createElement("span", { className: "text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/50" }, user.password))), /* @__PURE__ */ React.createElement(ChevronRight, { className: "w-4 h-4 text-slate-600 group-hover:text-cyan-400 flex-shrink-0 transition-colors" }))))))));
	};
})();
const LoginScreen = window.__LoginScreen;
// ============================================================================
// MODULE: src/components/ExecutiveDashboard.jsx
// ============================================================================
(() => {
	const { useState } = React;
	const { Building2, CheckCircle2, AlertTriangle, Users, ArrowUpRight, TrendingUp, Ship, Fish, Boxes, Compass, Factory, Briefcase, Wrench, ShieldAlert, ChevronRight, Filter } = window.__VENDOR__.Lucide;
	const { Doughnut, Bar, Radar } = window.__VENDOR__.ReactChartJS2;
	const { NATIONAL_SARPRAS_TARGETS, SARPRAS_CATEGORIES } = window.SARPRAS_DATA;
	const logoKkp = "assets/logo-kkp.png";
	window.__ExecutiveDashboard = function ExecutiveDashboard({ kpis, onNavigateTab, onFilterCategory, onSelectSatdik }) {
		const { isDark } = useTheme();
		const [jenjangFilter, setJenjangFilter] = useState("ALL");
		if (!kpis) return null;
		// Dynamic theme colors for Chart.js based on Light / Dark Mode
		const textColor = isDark ? "#cbd5e1" : "#090d16";
		const textMuted = isDark ? "#94a3b8" : "#1e293b";
		const textBold = isDark ? "#e2e8f0" : "#000000";
		const gridColor = isDark ? "rgba(51, 65, 85, 0.4)" : "#cbd5e1";
		// Extract condition counts and percentages
		const { totalAssets, avgConditionScore, avgUtilization, conditionCounts, conditionPercentages, categoryBreakdown, satdikBreakdown, urgentAssets } = kpis;
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
					const percentage = totalAssets > 0 ? (value / totalAssets * 100).toFixed(1) : 0;
					return ` ${context.label}: ${value} Unit (${percentage}%)`;
				} } }
			},
			cutout: "68%"
		};
		// Bar Chart: 8 Satuan Pendidikan dengan Skor Kelayakan Tertinggi / Pembanding
		const satdikEntries = Object.values(satdikBreakdown).filter((s) => {
			if (jenjangFilter === "Politeknik") return s.satdik.type === "Politeknik" || s.satdik.type === "Akademi";
			if (jenjangFilter === "SUPM") return s.satdik.type === "SUPM";
			return true;
		}).sort((a, b) => b.avgScore - a.avgScore);
		const barData = {
			labels: satdikEntries.slice(0, 8).map((s) => s.satdik.shortName),
			datasets: [{
				label: "Indeks Kelayakan Sarpras (%)",
				data: satdikEntries.slice(0, 8).map((s) => Math.round(s.avgScore)),
				backgroundColor: satdikEntries.slice(0, 8).map((s) => {
					if (!isDark) {
						return s.avgScore >= 85 ? "#10b981" : s.avgScore >= 75 ? "#0ea5e9" : "#f59e0b";
					}
					return s.avgScore >= 85 ? "rgba(16, 185, 129, 0.75)" : s.avgScore >= 75 ? "rgba(14, 165, 233, 0.75)" : "rgba(245, 158, 11, 0.75)";
				}),
				borderColor: satdikEntries.slice(0, 8).map((s) => s.avgScore >= 85 ? "#10b981" : s.avgScore >= 75 ? "#0ea5e9" : "#f59e0b"),
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
				tooltip: { callbacks: { title: (tooltipItems) => {
					if (!tooltipItems.length) return "";
					const item = tooltipItems[0];
					const rawLabel = item.label;
					return Array.isArray(rawLabel) ? rawLabel.join(" ") : rawLabel || "";
				} } }
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
		})), /* @__PURE__ */ React.createElement("div", { className: "flex flex-col items-center sm:items-start w-full sm:w-auto" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap items-center justify-center sm:justify-start gap-1.5 sm:gap-2" }, /* @__PURE__ */ React.createElement("span", { className: "px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-center" }, "National Sarpras Overview")), /* @__PURE__ */ React.createElement("h2", { className: "text-lg sm:text-xl md:text-2xl font-bold text-white tracking-tight mt-1.5 sm:mt-1 text-center sm:text-left" }, "Dasbor Analitik Sarana & Prasarana Vokasi KKP"), /* @__PURE__ */ React.createElement("p", { className: "text-slate-400 text-xs sm:text-sm mt-1 sm:mt-0.5 max-w-2xl text-center sm:text-left" }, "Monitoring kondisi fisik, kelayakan operasi armada kapal latih, tambak, laboratorium, dan asrama pada 18 Satuan Pendidikan Kelautan dan Perikanan se-Indonesia."))), /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-center gap-1.5 bg-slate-900/90 p-1.5 rounded-xl border border-slate-700/60 self-center md:self-center overflow-x-auto max-w-full" }, /* @__PURE__ */ React.createElement(Filter, { className: "w-3.5 h-3.5 text-slate-400 ml-2" }), /* @__PURE__ */ React.createElement("button", {
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
		}, /* @__PURE__ */ React.createElement("span", null, "Tinjau Aset Kritis"), /* @__PURE__ */ React.createElement(ChevronRight, { className: "w-3.5 h-3.5" }))), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4" }, /* @__PURE__ */ React.createElement("div", { className: "bg-slate-800/90 rounded-2xl p-4 border border-slate-700/70 hover:border-cyan-500/50 transition-all shadow-md group" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between text-slate-400" }, /* @__PURE__ */ React.createElement("span", { className: "text-xs font-medium uppercase tracking-wider" }, "Total Sarpras"), /* @__PURE__ */ React.createElement("div", { className: "w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform" }, /* @__PURE__ */ React.createElement(Building2, { className: "w-4 h-4" }))), /* @__PURE__ */ React.createElement("div", { className: "mt-3" }, /* @__PURE__ */ React.createElement("div", { className: "text-2xl font-black text-white" }, totalAssets), /* @__PURE__ */ React.createElement("div", { className: "text-[11px] text-cyan-400/90 mt-0.5 flex items-center gap-1" }, /* @__PURE__ */ React.createElement("span", null, "Unit terdata aktif")))), /* @__PURE__ */ React.createElement("div", { className: "bg-slate-800/90 rounded-2xl p-4 border border-slate-700/70 hover:border-blue-500/50 transition-all shadow-md group" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between text-slate-400" }, /* @__PURE__ */ React.createElement("span", { className: "text-xs font-medium uppercase tracking-wider" }, "Indeks Kelayakan (IKSP)"), /* @__PURE__ */ React.createElement("div", { className: `w-8 h-8 rounded-lg ${isTargetAchieved ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"} flex items-center justify-center group-hover:scale-110 transition-transform` }, /* @__PURE__ */ React.createElement(CheckCircle2, { className: "w-4 h-4" }))), /* @__PURE__ */ React.createElement("div", { className: "mt-3" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-baseline gap-2" }, /* @__PURE__ */ React.createElement("span", { className: `text-2xl font-black ${isTargetAchieved ? "text-emerald-400" : "text-amber-400"}` }, avgConditionScore, "%"), /* @__PURE__ */ React.createElement("span", { className: "text-[11px] text-slate-400" }, "Target: ", NATIONAL_SARPRAS_TARGETS.targetIndeksKelayakan, "%")), /* @__PURE__ */ React.createElement("div", { className: "text-[11px] text-slate-400 mt-0.5" }, isTargetAchieved ? "✓ Memenuhi standar target" : "⚠ Di bawah target nasional"))), /* @__PURE__ */ React.createElement("div", { className: "bg-slate-800/90 rounded-2xl p-4 border border-slate-700/70 hover:border-emerald-500/50 transition-all shadow-md group" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between text-slate-400" }, /* @__PURE__ */ React.createElement("span", { className: "text-xs font-medium uppercase tracking-wider" }, "Kondisi Baik"), /* @__PURE__ */ React.createElement("div", { className: "w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center" }, /* @__PURE__ */ React.createElement(CheckCircle2, { className: "w-4 h-4" }))), /* @__PURE__ */ React.createElement("div", { className: "mt-3" }, /* @__PURE__ */ React.createElement("div", { className: "text-2xl font-black text-emerald-400" }, conditionCounts["Baik"], " ", /* @__PURE__ */ React.createElement("span", { className: "text-xs font-normal text-slate-400" }, "(", conditionPercentages.baik, "%)")), /* @__PURE__ */ React.createElement("div", { className: "text-[11px] text-slate-400 mt-0.5" }, "Layak fungsi operasional"))), /* @__PURE__ */ React.createElement("div", { className: "bg-slate-800/90 rounded-2xl p-4 border border-slate-700/70 hover:border-rose-500/50 transition-all shadow-md group" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between text-slate-400" }, /* @__PURE__ */ React.createElement("span", { className: "text-xs font-medium uppercase tracking-wider" }, "Rusak Berat (Kritis)"), /* @__PURE__ */ React.createElement("div", { className: "w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center" }, /* @__PURE__ */ React.createElement(AlertTriangle, { className: "w-4 h-4" }))), /* @__PURE__ */ React.createElement("div", { className: "mt-3" }, /* @__PURE__ */ React.createElement("div", { className: "text-2xl font-black text-rose-400" }, conditionCounts["Rusak Berat"], " ", /* @__PURE__ */ React.createElement("span", { className: "text-xs font-normal text-slate-400" }, "Unit (", conditionPercentages.rusakBerat, "%)")), /* @__PURE__ */ React.createElement("div", { className: "text-[11px] text-rose-400 mt-0.5 font-medium" }, "Tidak layak / stop operasi")))), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-6" }, /* @__PURE__ */ React.createElement("div", { className: "lg:col-span-5 bg-slate-800/90 rounded-2xl p-5 border border-slate-700/70 shadow-lg flex flex-col justify-between" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between mb-1" }, /* @__PURE__ */ React.createElement("h3", { className: "text-base font-bold text-white tracking-tight flex items-center gap-2" }, /* @__PURE__ */ React.createElement("span", null, "Distribusi Kondisi Sarpras Nasional")), /* @__PURE__ */ React.createElement("span", { className: "text-xs text-cyan-400 font-semibold" }, totalAssets, " Unit Total")), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-slate-400 mb-4" }, "Klasifikasi kelayakan fisik seluruh sarana pendidikan vokasi KKP.")), /* @__PURE__ */ React.createElement("div", { className: "h-64 relative flex items-center justify-center my-2" }, /* @__PURE__ */ React.createElement(Doughnut, {
			data: donutData,
			options: donutOptions
		}), /* @__PURE__ */ React.createElement("div", { className: "absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-12" }, /* @__PURE__ */ React.createElement("span", { className: "text-2xl font-black text-white" }, conditionPercentages.baik, "%"), /* @__PURE__ */ React.createElement("span", { className: "text-[10px] text-emerald-400 font-semibold uppercase tracking-wider" }, "Kondisi Baik"))), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-3 gap-2 pt-2 border-t border-slate-700/60 text-xs" }, /* @__PURE__ */ React.createElement("div", { className: "bg-slate-900/60 p-2 sm:p-2.5 rounded-xl border border-slate-800 text-center sm:text-left" }, /* @__PURE__ */ React.createElement("span", { className: "text-slate-400 text-[10px] sm:text-[11px] block truncate" }, "Baik (Layak)"), /* @__PURE__ */ React.createElement("span", { className: "text-emerald-400 font-bold text-xs sm:text-sm block mt-0.5" }, conditionCounts["Baik"], " ", /* @__PURE__ */ React.createElement("span", { className: "text-[10px] font-normal text-slate-400" }, "(", conditionPercentages.baik, "%)"))), /* @__PURE__ */ React.createElement("div", { className: "bg-slate-900/60 p-2 sm:p-2.5 rounded-xl border border-slate-800 text-center sm:text-left" }, /* @__PURE__ */ React.createElement("span", { className: "text-slate-400 text-[10px] sm:text-[11px] block truncate" }, "Rusak Ringan"), /* @__PURE__ */ React.createElement("span", { className: "text-sky-400 font-bold text-xs sm:text-sm block mt-0.5" }, conditionCounts["Rusak Ringan"], " ", /* @__PURE__ */ React.createElement("span", { className: "text-[10px] font-normal text-slate-400" }, "(", conditionPercentages.rusakRingan, "%)"))), /* @__PURE__ */ React.createElement("div", { className: "bg-slate-900/60 p-2 sm:p-2.5 rounded-xl border border-slate-800 text-center sm:text-left" }, /* @__PURE__ */ React.createElement("span", { className: "text-slate-400 text-[10px] sm:text-[11px] block truncate" }, "Rusak Berat"), /* @__PURE__ */ React.createElement("span", { className: "text-rose-400 font-bold text-xs sm:text-sm block mt-0.5" }, conditionCounts["Rusak Berat"], " ", /* @__PURE__ */ React.createElement("span", { className: "text-[10px] font-normal text-slate-400" }, "(", conditionPercentages.rusakBerat, "%)"))))), /* @__PURE__ */ React.createElement("div", { className: "lg:col-span-7 bg-slate-800/90 rounded-2xl p-5 border border-slate-700/70 shadow-lg flex flex-col justify-between" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between mb-1" }, /* @__PURE__ */ React.createElement("h3", { className: "text-base font-bold text-white tracking-tight" }, "Peringkat Kelayakan Sarpras Satuan Pendidikan"), /* @__PURE__ */ React.createElement("button", {
			onClick: () => onNavigateTab("map"),
			className: "text-xs text-cyan-400 hover:text-cyan-300 font-medium inline-flex items-center gap-1"
		}, /* @__PURE__ */ React.createElement("span", null, "Lihat Seluruh Kampus"), /* @__PURE__ */ React.createElement(ChevronRight, { className: "w-3.5 h-3.5" }))), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-slate-400 mb-4" }, "Indeks kelayakan operasional sarpras berdasarkan audit teknis (Top Satdik).")), /* @__PURE__ */ React.createElement("div", { className: "h-72" }, /* @__PURE__ */ React.createElement(Bar, {
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
		})))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between mb-3" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", { className: "text-base font-bold text-white" }, "Katalog Bidang Sarana & Prasarana Vokasi"), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-slate-400" }, "Klik bidang untuk melihat rincian inventaris dan spesifikasi sarpras.")), /* @__PURE__ */ React.createElement("button", {
			onClick: () => onNavigateTab("explorer"),
			className: "text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
		}, /* @__PURE__ */ React.createElement("span", null, "Buka Inventaris Penuh"), /* @__PURE__ */ React.createElement(ChevronRight, { className: "w-3.5 h-3.5" }))), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-8 gap-3" }, SARPRAS_CATEGORIES.map((cat) => {
			const data = categoryBreakdown[cat.id] || {
				count: 0,
				avgScore: 0
			};
			const IconComponent = cat.iconName === "Ship" ? Ship : cat.iconName === "Wrench" ? Wrench : cat.iconName === "Fish" ? Fish : cat.iconName === "Boxes" ? Boxes : cat.iconName === "TrendingUp" ? TrendingUp : cat.iconName === "Compass" ? Compass : cat.iconName === "Users" ? Users : cat.iconName === "Briefcase" ? Briefcase : cat.iconName === "Factory" ? Factory : Building2;
			return /* @__PURE__ */ React.createElement("div", {
				key: cat.id,
				onClick: () => {
					onFilterCategory(cat.id);
					onNavigateTab("explorer");
				},
				className: "bg-slate-800/80 hover:bg-slate-800 p-4 rounded-xl border border-slate-700/70 hover:border-cyan-500/60 transition-all cursor-pointer shadow-md group flex flex-col justify-between"
			}, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React.createElement("div", {
				className: "w-9 h-9 rounded-lg flex items-center justify-center text-white",
				style: {
					backgroundColor: `${cat.color}25`,
					color: cat.color
				}
			}, /* @__PURE__ */ React.createElement(IconComponent, { className: "w-5 h-5" })), /* @__PURE__ */ React.createElement("span", { className: "text-[11px] font-bold text-slate-400 group-hover:text-cyan-400 transition-colors" }, data.count, " Unit")), /* @__PURE__ */ React.createElement("h4", { className: "font-bold text-white text-xs mt-3 group-hover:text-cyan-300 transition-colors line-clamp-1" }, cat.name), /* @__PURE__ */ React.createElement("p", { className: "text-[11px] text-slate-400 mt-1 line-clamp-2" }, cat.description)), /* @__PURE__ */ React.createElement("div", { className: "mt-3 pt-2.5 border-t border-slate-700/60 flex items-center justify-between text-[11px]" }, /* @__PURE__ */ React.createElement("span", { className: "text-slate-400" }, "Kelayakan:"), /* @__PURE__ */ React.createElement("span", {
				className: "font-bold text-white",
				style: { color: cat.color }
			}, Math.round(data.avgScore), "%")));
		}))));
	};
})();
const ExecutiveDashboard = window.__ExecutiveDashboard;
// ============================================================================
// MODULE: src/components/GeospatialMap.jsx
// ============================================================================
(() => {
	const { useState, useRef, useEffect, useCallback, useMemo } = React;
	const L = window.L;
	const { MapPin, Navigation, School, ExternalLink, Search, Compass, Info, ZoomIn, ZoomOut, RotateCcw, Locate, Globe, Map: MapIcon, Satellite, GraduationCap } = window.__VENDOR__.Lucide;
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
	window.__GeospatialMap = function GeospatialMap({ satdikBreakdown, onSelectSatdikForExplorer }) {
		const [selectedSatdikId, setSelectedSatdikId] = useState("poltek-aup");
		const [regionFilter, setRegionFilter] = useState("ALL");
		const [jenjangFilter, setJenjangFilter] = useState("ALL");
		const [searchQuery, setSearchQuery] = useState("");
		const [activeLayer, setActiveLayer] = useState("osm");
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
					focusBtn.onclick = () => {
						const id = focusBtn.getAttribute("data-satdik-focus-id");
						setSelectedSatdikId(id);
					};
				}
				const exploreBtn = container.querySelector("[data-satdik-explore-id]");
				if (exploreBtn) {
					exploreBtn.onclick = () => {
						const id = exploreBtn.getAttribute("data-satdik-explore-id");
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
		return /* @__PURE__ */ React.createElement("div", { className: "space-y-6" }, /* @__PURE__ */ React.createElement("div", { className: "bg-slate-800/90 rounded-2xl p-4 sm:p-5 border border-slate-700/70 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap items-center gap-2" }, /* @__PURE__ */ React.createElement("span", { className: "px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30" }, "Sistem Informasi Geospasial"), /* @__PURE__ */ React.createElement("span", { className: "text-slate-400 text-xs" }, "• 18 Satdik Sabang s/d Merauke")), /* @__PURE__ */ React.createElement("h2", { className: "text-xl sm:text-2xl font-bold text-white tracking-tight mt-1 flex items-center gap-2" }, /* @__PURE__ */ React.createElement(Navigation, { className: "w-5 h-5 text-cyan-400" }), /* @__PURE__ */ React.createElement("span", null, "Peta Persebaran Sarpras Satuan Pendidikan KKP")), /* @__PURE__ */ React.createElement("p", { className: "text-slate-400 text-xs sm:text-sm mt-0.5" }, "Peta geografis nyata menampilkan sebaran kampus Politeknik & SUPM KKP dengan citra satelit dan data kelayakan BMN terintegrasi.")), /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap items-center gap-2 self-start md:self-center" }, /* @__PURE__ */ React.createElement("div", { className: "relative" }, /* @__PURE__ */ React.createElement(Search, { className: "w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" }), /* @__PURE__ */ React.createElement("input", {
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
		}, /* @__PURE__ */ React.createElement(Globe, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ React.createElement("span", null, "Topografi")))), /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between text-xs px-2 py-1.5 mb-2 bg-slate-900/60 rounded-xl border border-slate-800" }, /* @__PURE__ */ React.createElement("span", { className: "text-[11px] text-slate-400 font-medium flex items-center gap-1" }, /* @__PURE__ */ React.createElement(Info, { className: "w-3 h-3 text-cyan-400" }), /* @__PURE__ */ React.createElement("span", null, "Status Kelayakan BMN:")), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3" }, /* @__PURE__ */ React.createElement("span", { className: "flex items-center gap-1.5 text-slate-300 text-[11px]" }, /* @__PURE__ */ React.createElement("span", { className: "w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" }), /* @__PURE__ */ React.createElement("span", null, "≥85% (Optimal)")), /* @__PURE__ */ React.createElement("span", { className: "flex items-center gap-1.5 text-slate-300 text-[11px]" }, /* @__PURE__ */ React.createElement("span", { className: "w-2.5 h-2.5 rounded-full bg-sky-500 shadow-sm shadow-sky-500/50" }), /* @__PURE__ */ React.createElement("span", null, "75-84% (Sedang)")), /* @__PURE__ */ React.createElement("span", { className: "flex items-center gap-1.5 text-slate-300 text-[11px]" }, /* @__PURE__ */ React.createElement("span", { className: "w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50" }), /* @__PURE__ */ React.createElement("span", null, "<75% (Perhatian)")))), /* @__PURE__ */ React.createElement("div", { className: "relative w-full flex-1 min-h-[380px] xs:min-h-[440px] sm:min-h-[500px] rounded-xl border border-slate-700/80 overflow-hidden shadow-inner" }, /* @__PURE__ */ React.createElement("div", {
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
		}))), /* @__PURE__ */ React.createElement("div", { className: "lg:col-span-4 bg-slate-800/90 rounded-2xl p-4 sm:p-5 border border-slate-700/70 shadow-md flex flex-col justify-between" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "flex items-start justify-between gap-2 pb-3 border-b border-slate-700/60" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { className: "px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30" }, selectedSatdik.jenjang, " • ", selectedSatdik.type), /* @__PURE__ */ React.createElement("h3", { className: "text-base sm:text-lg font-bold text-white mt-1.5 leading-snug" }, selectedSatdik.name), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-slate-400 flex items-center gap-1 mt-0.5" }, /* @__PURE__ */ React.createElement(MapPin, { className: "w-3.5 h-3.5 text-cyan-400" }), /* @__PURE__ */ React.createElement("span", null, selectedSatdik.kota, ", ", selectedSatdik.provinsi, " (", selectedSatdik.region, ")")), /* @__PURE__ */ React.createElement("button", {
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
		}))), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-3 gap-2 text-center text-[10px]" }, /* @__PURE__ */ React.createElement("div", { className: "bg-slate-800/80 p-1.5 rounded-lg border border-slate-700" }, /* @__PURE__ */ React.createElement("span", { className: "text-slate-400 block" }, "Baik"), /* @__PURE__ */ React.createElement("span", { className: "font-bold text-emerald-400 text-xs" }, selectedMetrics.baik)), /* @__PURE__ */ React.createElement("div", { className: "bg-slate-800/80 p-1.5 rounded-lg border border-slate-700" }, /* @__PURE__ */ React.createElement("span", { className: "text-slate-400 block" }, "R. Ringan"), /* @__PURE__ */ React.createElement("span", { className: "font-bold text-sky-400 text-xs" }, selectedMetrics.rusakRingan)), /* @__PURE__ */ React.createElement("div", { className: "bg-slate-800/80 p-1.5 rounded-lg border border-slate-700" }, /* @__PURE__ */ React.createElement("span", { className: "text-slate-400 block" }, "R. Berat"), /* @__PURE__ */ React.createElement("span", { className: "font-bold text-rose-400 text-xs" }, selectedMetrics.rusakBerat)))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h4", { className: "text-xs font-bold text-slate-300 uppercase tracking-wider mb-2" }, "Fasilitas Unggulan Kampus Ini"), /* @__PURE__ */ React.createElement("div", { className: "space-y-1.5 max-h-36 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-700 text-xs" }, selectedMetrics.assets.length > 0 ? selectedMetrics.assets.map((asset) => /* @__PURE__ */ React.createElement("div", {
			key: asset.id,
			className: "bg-slate-900/50 p-2 rounded-lg border border-slate-800/80 flex items-center justify-between shadow-2xs"
		}, /* @__PURE__ */ React.createElement("div", { className: "truncate mr-2" }, /* @__PURE__ */ React.createElement("span", { className: "font-medium text-white block truncate" }, asset.name), /* @__PURE__ */ React.createElement("span", { className: "text-[10px] text-cyan-300 font-medium" }, asset.prodi || "Fasilitas Umum")), /* @__PURE__ */ React.createElement("span", { className: `px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap ${asset.condition === "Baik" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : asset.condition === "Rusak Ringan" ? "bg-sky-500/10 text-sky-400 border border-sky-500/20" : "bg-rose-500/10 text-rose-400 border border-rose-500/20"}` }, asset.condition))) : /* @__PURE__ */ React.createElement("p", { className: "text-xs text-slate-400 italic" }, "Data aset belum dimasukkan.")))), /* @__PURE__ */ React.createElement("div", { className: "mt-4 pt-3 border-t border-slate-700/60" }, /* @__PURE__ */ React.createElement("button", {
			onClick: () => onSelectSatdikForExplorer(selectedSatdik.id),
			className: "w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-colors shadow-md shadow-cyan-900/30 active:scale-[0.98]"
		}, /* @__PURE__ */ React.createElement("span", null, "Buka Daftar Lengkap Sarpras Kampus Ini"), /* @__PURE__ */ React.createElement(ExternalLink, { className: "w-3.5 h-3.5" }))))));
	};
})();
const GeospatialMap = window.__GeospatialMap;
// ============================================================================
// MODULE: src/components/AssetDetailModal.jsx
// ============================================================================
(() => {
	const { useState, useEffect } = React;
	const { X, Building2, Calendar, ShieldCheck, AlertTriangle, Wrench, Activity, FileText, CheckCircle2, Ship, Fish, Boxes, Users, Compass, Briefcase, TrendingUp, Save, Clock, Info, Edit3, Sliders, Eye, AlertCircle, Sparkles, RotateCcw, GraduationCap } = window.__VENDOR__.Lucide;
	const { SATDIK_LIST, SARPRAS_CATEGORIES, PRODI_LIST, getCategoryForProdi, getProdisForCategory } = window.SARPRAS_DATA;
	// Helper icon category
	const getCategoryIcon = (category) => {
		switch (category) {
			case "penangkapan_ikan":
			case "penangkapan_mesin":
			case "maritim_kapal":
			case "alat_tangkap": return Ship;
			case "permesinan_mekanisasi": return Wrench;
			case "budidaya_perikanan":
			case "akuakultur": return Fish;
			case "pengolahan_hasil":
			case "pengolahan_upi": return Boxes;
			case "agribisnis_perikanan":
			case "agribisnis_penyuluhan":
			case "tefa": return TrendingUp;
			case "kelautan_konservasi":
			case "konservasi_pariwisata": return Compass;
			case "sosial_pemberdayaan":
			case "asrama_penunjang": return Users;
			case "administrasi_umum":
			case "administasi_umum": return Briefcase;
			default: return Building2;
		}
	};
	window.__AssetDetailModal = function AssetDetailModal({ asset, isOpen, onClose, onUpdateAsset, onUpdateCondition, currentUser }) {
		// Modes
		const [isFullEditMode, setIsFullEditMode] = useState(false);
		const [isQuickEditMode, setIsQuickEditMode] = useState(false);
		const [activeTab, setActiveTab] = useState("identitas");
		const [isSavedToast, setIsSavedToast] = useState(false);
		const [toastMessage, setToastMessage] = useState("");
		const [errorMsg, setErrorMsg] = useState("");
		// Full Edit Form State
		const [formData, setFormData] = useState({
			name: "",
			satdikId: "",
			satdikName: "",
			prodi: "",
			category: "penangkapan_ikan",
			condition: "Baik",
			conditionScore: 85,
			acquisitionYear: 2020,
			utilizationRate: 80,
			capacityDesc: "",
			specs: "",
			certificationStatus: "Tersertifikasi Aktif",
			certificationAuthority: "",
			certExpiryDate: "",
			lastMaintenanceDate: "",
			nextMaintenanceDate: "",
			maintenanceUrgency: "Normal",
			estimatedRepairCost: 0,
			issuesSummary: ""
		});
		// Quick Edit State (for operator or fast status updates)
		const [quickCondition, setQuickCondition] = useState("Baik");
		const [quickNotes, setQuickNotes] = useState("");
		// Sync state whenever asset or modal visibility changes
		useEffect(() => {
			if (asset) {
				setFormData({
					name: asset.name || "",
					satdikId: asset.satdikId || SATDIK_LIST[0]?.id || "",
					satdikName: asset.satdikName || SATDIK_LIST[0]?.name || "",
					prodi: asset.prodi || SATDIK_LIST[0]?.prodi?.[0] || "Semua Program Studi (Umum)",
					category: asset.category || SARPRAS_CATEGORIES[0]?.id || "penangkapan_ikan",
					condition: asset.condition || "Baik",
					conditionScore: asset.conditionScore !== undefined ? asset.conditionScore : 85,
					acquisitionYear: asset.acquisitionYear || 2020,
					utilizationRate: asset.utilizationRate !== undefined ? asset.utilizationRate : 80,
					capacityDesc: asset.capacityDesc || "",
					specs: asset.specs || "",
					certificationStatus: asset.certificationStatus || "Tersertifikasi Aktif",
					certificationAuthority: asset.certificationAuthority || "",
					certExpiryDate: asset.certExpiryDate || "",
					lastMaintenanceDate: asset.lastMaintenanceDate || "",
					nextMaintenanceDate: asset.nextMaintenanceDate || "",
					maintenanceUrgency: asset.maintenanceUrgency || "Normal",
					estimatedRepairCost: asset.estimatedRepairCost || 0,
					issuesSummary: asset.issuesSummary || ""
				});
				setQuickCondition(asset.condition || "Baik");
				setQuickNotes(asset.issuesSummary || "");
				setIsFullEditMode(false);
				setIsQuickEditMode(false);
				setErrorMsg("");
				setActiveTab("identitas");
			}
		}, [asset, isOpen]);
		// Hook rules: all hooks called above, early return follows safely
		if (!isOpen || !asset) return null;
		// Role & Permissions check
		const canEditFull = currentUser?.permissions?.includes("edit_all") || currentUser?.role === "super_admin" || currentUser?.role === "admin_pusdik";
		const canEditOwn = currentUser?.permissions?.includes("edit_own") || currentUser?.role === "operator_kampus";
		const isOwnCampus = currentUser?.accessibleSatdik === "ALL" || currentUser?.accessibleSatdik === asset.satdikId;
		const canQuickEdit = canEditFull || canEditOwn && isOwnCampus;
		const isAuditor = currentUser?.role === "auditor" || currentUser?.permissions?.includes("audit_mode");
		// Input change handler for full edit form
		const handleInputChange = (field, value) => {
			setFormData((prev) => ({
				...prev,
				[field]: value
			}));
		};
		// Handler for Satuan Pendidikan change (auto-sync satdikName, prodi, and category)
		const handleSatdikChange = (newSatdikId) => {
			const selected = SATDIK_LIST.find((s) => s.id === newSatdikId);
			const newProdi = selected?.prodi?.[0] || "Semua Program Studi (Umum)";
			const matchedCat = getCategoryForProdi(newProdi);
			setFormData((prev) => ({
				...prev,
				satdikId: newSatdikId,
				satdikName: selected ? selected.name : prev.satdikName,
				prodi: newProdi,
				...matchedCat ? { category: matchedCat } : {}
			}));
		};
		// Handler for Prodi change (auto-sync category)
		const handleProdiChange = (newProdi) => {
			const matchedCat = getCategoryForProdi(newProdi);
			setFormData((prev) => ({
				...prev,
				prodi: newProdi,
				...matchedCat ? { category: matchedCat } : {}
			}));
		};
		// Handler for Category change (auto-align prodi)
		const handleCategoryChange = (newCategory) => {
			const catProdis = getProdisForCategory(newCategory);
			let nextProdi = formData.prodi;
			if (catProdis.length > 0 && !catProdis.includes(formData.prodi)) {
				const currentCampus = SATDIK_LIST.find((s) => s.id === formData.satdikId);
				const campusProdis = currentCampus?.prodi || [];
				const campusMatch = campusProdis.find((p) => catProdis.includes(p));
				nextProdi = campusMatch || catProdis[0];
			} else if (catProdis.length === 0) {
				nextProdi = "Semua Program Studi (Umum)";
			}
			setFormData((prev) => ({
				...prev,
				category: newCategory,
				prodi: nextProdi
			}));
		};
		// Handler for condition selection in full edit mode
		const handleConditionSelect = (cond) => {
			const scoreMap = {
				"Baik": 92,
				"Rusak Ringan": 75,
				"Rusak Berat": 25
			};
			const urgencyMap = {
				"Baik": "Normal",
				"Rusak Ringan": "Normal",
				"Rusak Berat": "Kritis / Segera"
			};
			setFormData((prev) => ({
				...prev,
				condition: cond,
				conditionScore: scoreMap[cond] || prev.conditionScore,
				maintenanceUrgency: urgencyMap[cond] || prev.maintenanceUrgency
			}));
		};
		// Save Full Edit Handler
		const handleSaveFull = () => {
			if (!formData.name.trim()) {
				setErrorMsg("Nama sarana prasarana tidak boleh kosong.");
				setActiveTab("identitas");
				return;
			}
			const payload = {
				name: formData.name.trim(),
				satdikId: formData.satdikId,
				satdikName: formData.satdikName,
				prodi: (formData.prodi || "").trim() || "Semua Program Studi (Umum)",
				category: formData.category,
				condition: formData.condition,
				conditionScore: Math.min(100, Math.max(0, Number(formData.conditionScore) || 0)),
				acquisitionYear: Number(formData.acquisitionYear) || 2020,
				utilizationRate: Math.min(100, Math.max(0, Number(formData.utilizationRate) || 0)),
				capacityDesc: formData.capacityDesc.trim(),
				specs: formData.specs.trim(),
				certificationStatus: formData.certificationStatus,
				certificationAuthority: formData.certificationAuthority.trim(),
				certExpiryDate: formData.certExpiryDate || null,
				lastMaintenanceDate: formData.lastMaintenanceDate || null,
				nextMaintenanceDate: formData.nextMaintenanceDate || null,
				maintenanceUrgency: formData.maintenanceUrgency,
				estimatedRepairCost: Number(formData.estimatedRepairCost) || 0,
				issuesSummary: formData.issuesSummary.trim()
			};
			const updateFunc = onUpdateAsset || onUpdateCondition;
			if (updateFunc) {
				updateFunc(asset.id, payload);
			}
			setToastMessage("Seluruh perubahan data sarpras berhasil disimpan dan disinkronkan ke database!");
			setIsSavedToast(true);
			setIsFullEditMode(false);
			setErrorMsg("");
			setTimeout(() => {
				setIsSavedToast(false);
			}, 3e3);
		};
		// Save Quick Condition Handler
		const handleSaveQuick = () => {
			const updateFunc = onUpdateAsset || onUpdateCondition;
			if (updateFunc) {
				updateFunc(asset.id, quickCondition, quickNotes);
			}
			setToastMessage("Status kondisi fisik dan log pemeliharaan berhasil diperbarui!");
			setIsSavedToast(true);
			setIsQuickEditMode(false);
			setTimeout(() => {
				setIsSavedToast(false);
			}, 3e3);
		};
		const CategoryIcon = getCategoryIcon(isFullEditMode ? formData.category : asset.category);
		return /* @__PURE__ */ React.createElement("div", {
			className: "fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn",
			onClick: onClose
		}, /* @__PURE__ */ React.createElement("div", {
			className: "bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl transition-all",
			onClick: (e) => e.stopPropagation()
		}, /* @__PURE__ */ React.createElement("div", { className: "bg-slate-800/95 px-5 sm:px-6 py-3.5 border-b border-slate-700/80 flex items-center justify-between flex-shrink-0" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center space-x-3 overflow-hidden" }, /* @__PURE__ */ React.createElement("div", { className: "w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 flex-shrink-0" }, /* @__PURE__ */ React.createElement(CategoryIcon, { className: "w-5 h-5" })), /* @__PURE__ */ React.createElement("div", { className: "min-w-0" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap items-center gap-2" }, /* @__PURE__ */ React.createElement("span", { className: "font-mono text-[11px] text-cyan-400 font-semibold px-2 py-0.5 bg-cyan-950/80 rounded border border-cyan-800" }, asset.id), /* @__PURE__ */ React.createElement("span", { className: `px-2 py-0.5 rounded text-[10px] font-bold ${(isFullEditMode ? formData.condition : asset.condition) === "Baik" ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30" : (isFullEditMode ? formData.condition : asset.condition) === "Rusak Ringan" ? "bg-sky-500/15 text-sky-400 border border-sky-500/30" : "bg-rose-500/15 text-rose-400 border border-rose-500/30"}` }, isFullEditMode ? formData.condition : asset.condition, " (", isFullEditMode ? formData.conditionScore : asset.conditionScore, "%)"), canEditFull ? /* @__PURE__ */ React.createElement("span", { className: "hidden sm:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30" }, /* @__PURE__ */ React.createElement(Sparkles, { className: "w-3 h-3 text-cyan-400" }), /* @__PURE__ */ React.createElement("span", null, "Kendali Penuh")) : canEditOwn && isOwnCampus ? /* @__PURE__ */ React.createElement("span", { className: "hidden sm:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30" }, /* @__PURE__ */ React.createElement(Wrench, { className: "w-3 h-3 text-amber-400" }), /* @__PURE__ */ React.createElement("span", null, "Operator Kampus")) : /* @__PURE__ */ React.createElement("span", { className: "hidden sm:inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700" }, /* @__PURE__ */ React.createElement(Eye, { className: "w-3 h-3 text-slate-400" }), /* @__PURE__ */ React.createElement("span", null, "Mode Tinjauan"))), /* @__PURE__ */ React.createElement("h3", {
			className: "text-sm sm:text-base font-bold text-white mt-0.5 truncate",
			title: isFullEditMode ? formData.name : asset.name
		}, isFullEditMode ? formData.name || "Nama Sarana Prasarana" : asset.name))), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2 flex-shrink-0 ml-2" }, !isFullEditMode && !isQuickEditMode && canEditFull && /* @__PURE__ */ React.createElement("button", {
			type: "button",
			onClick: () => setIsFullEditMode(true),
			className: "hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-semibold shadow-md shadow-cyan-900/30 transition-all active:scale-95 border border-cyan-400/30",
			title: "Buka form untuk mengedit seluruh data sarana prasarana"
		}, /* @__PURE__ */ React.createElement(Edit3, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ React.createElement("span", null, "Edit Lengkap")), /* @__PURE__ */ React.createElement("button", {
			onClick: onClose,
			className: "w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors",
			title: "Tutup Modal"
		}, /* @__PURE__ */ React.createElement(X, { className: "w-5 h-5" })))), /* @__PURE__ */ React.createElement("div", { className: "overflow-y-auto p-4 sm:p-6 space-y-5 flex-1 scrollbar-thin scrollbar-thumb-slate-700" }, isSavedToast && /* @__PURE__ */ React.createElement("div", { className: "bg-emerald-950/90 border border-emerald-500/80 text-emerald-200 p-3 rounded-xl flex items-center gap-2.5 text-xs shadow-lg animate-fadeIn" }, /* @__PURE__ */ React.createElement(CheckCircle2, { className: "w-4 h-4 text-emerald-400 flex-shrink-0" }), /* @__PURE__ */ React.createElement("span", { className: "font-medium" }, toastMessage)), errorMsg && /* @__PURE__ */ React.createElement("div", { className: "bg-rose-950/90 border border-rose-500/80 text-rose-200 p-3 rounded-xl flex items-center gap-2.5 text-xs shadow-lg animate-shake" }, /* @__PURE__ */ React.createElement(AlertCircle, { className: "w-4 h-4 text-rose-400 flex-shrink-0" }), /* @__PURE__ */ React.createElement("span", null, errorMsg)), isFullEditMode ? /* @__PURE__ */ React.createElement("div", { className: "space-y-4 animate-fadeIn" }, /* @__PURE__ */ React.createElement("div", { className: "bg-gradient-to-r from-cyan-950/70 via-blue-950/50 to-slate-900 border border-cyan-800/60 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3" }, /* @__PURE__ */ React.createElement("div", { className: "w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center flex-shrink-0" }, /* @__PURE__ */ React.createElement(Sparkles, { className: "w-4 h-4" })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h4", { className: "text-xs font-bold text-white flex items-center gap-2" }, /* @__PURE__ */ React.createElement("span", null, "Mode Edit Kendali Penuh"), /* @__PURE__ */ React.createElement("span", { className: "text-[10px] font-normal px-2 py-0.5 rounded bg-cyan-900/60 text-cyan-300 border border-cyan-700/50" }, currentUser?.roleLabel || "Admin Berwenang")), /* @__PURE__ */ React.createElement("p", { className: "text-[11px] text-cyan-200/90" }, "Anda berwenang mengedit seluruh master atribut sarana prasarana: nama, satdik, utilisasi, spesifikasi, dan jadwal pemeliharaan."))), /* @__PURE__ */ React.createElement("button", {
			type: "button",
			onClick: () => setIsFullEditMode(false),
			className: "self-end sm:self-center px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium border border-slate-700 transition-colors flex items-center gap-1.5"
		}, /* @__PURE__ */ React.createElement(RotateCcw, { className: "w-3 h-3 text-slate-400" }), /* @__PURE__ */ React.createElement("span", null, "Batal Edit"))), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-800 scrollbar-none" }, [
			{
				id: "identitas",
				label: "1. Identitas & Satdik",
				icon: FileText
			},
			{
				id: "valuasi",
				label: "2. Utilisasi & Perolehan",
				icon: Activity
			},
			{
				id: "kondisi",
				label: "3. Kondisi Fisik",
				icon: Wrench
			},
			{
				id: "spesifikasi",
				label: "4. Spesifikasi Teknis",
				icon: Sliders
			},
			{
				id: "catatan",
				label: "5. Catatan Teknis",
				icon: AlertTriangle
			}
		].map((tab) => {
			const TabIcon = tab.icon;
			const isActive = activeTab === tab.id;
			return /* @__PURE__ */ React.createElement("button", {
				key: tab.id,
				type: "button",
				onClick: () => setActiveTab(tab.id),
				className: `flex items-center gap-1.5 px-3 py-2 rounded-t-xl text-xs font-semibold whitespace-nowrap transition-all border-b-2 ${isActive ? "bg-slate-800/90 text-cyan-400 border-cyan-400" : "bg-transparent text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-800/40"}`
			}, /* @__PURE__ */ React.createElement(TabIcon, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ React.createElement("span", null, tab.label));
		})), activeTab === "identitas" && /* @__PURE__ */ React.createElement("div", { className: "bg-slate-800/60 p-4 sm:p-5 rounded-xl border border-slate-700/60 space-y-4" }, /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4" }, /* @__PURE__ */ React.createElement("div", { className: "sm:col-span-2" }, /* @__PURE__ */ React.createElement("label", { className: "text-xs font-semibold text-slate-300 block mb-1.5" }, "Nama Sarana / Prasarana ", /* @__PURE__ */ React.createElement("span", { className: "text-rose-400" }, "*")), /* @__PURE__ */ React.createElement("input", {
			type: "text",
			value: formData.name,
			onChange: (e) => handleInputChange("name", e.target.value),
			placeholder: "Contoh: Kapal Latih KM. Madidihang 03",
			className: "w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-medium"
		})), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "text-xs font-semibold text-slate-300 block mb-1.5" }, "Satuan Pendidikan (18 Kampus Vokasi KKP) ", /* @__PURE__ */ React.createElement("span", { className: "text-rose-400" }, "*")), /* @__PURE__ */ React.createElement("select", {
			value: formData.satdikId,
			onChange: (e) => handleSatdikChange(e.target.value),
			className: "w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
		}, SATDIK_LIST.map((s) => /* @__PURE__ */ React.createElement("option", {
			key: s.id,
			value: s.id
		}, s.shortName, " — (", s.kota, ", ", s.provinsi, ")")))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "text-xs font-semibold text-slate-300 block mb-1.5 flex items-center justify-between" }, /* @__PURE__ */ React.createElement("span", null, "Program Studi"), /* @__PURE__ */ React.createElement("span", { className: "text-[10px] text-cyan-400 font-normal" }, "(", (SATDIK_LIST.find((s) => s.id === formData.satdikId)?.prodi || []).length, " prodi kampus)")), /* @__PURE__ */ React.createElement("select", {
			value: formData.prodi,
			onChange: (e) => handleProdiChange(e.target.value),
			className: "w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 truncate"
		}, /* @__PURE__ */ React.createElement("option", { value: "Semua Program Studi (Umum)" }, "Semua Program Studi (Umum / Fasilitas Bersama)"), (() => {
			const currentCampus = SATDIK_LIST.find((s) => s.id === formData.satdikId);
			const prodis = currentCampus?.prodi || [];
			return /* @__PURE__ */ React.createElement(React.Fragment, null, prodis.length > 0 && /* @__PURE__ */ React.createElement("optgroup", { label: `Program Studi ${currentCampus.shortName}` }, prodis.map((p) => {
				const catId = getCategoryForProdi(p);
				const catName = SARPRAS_CATEGORIES.find((c) => c.id === catId)?.name;
				return /* @__PURE__ */ React.createElement("option", {
					key: p,
					value: p
				}, p, " ", catName ? `(${catName})` : "");
			})), /* @__PURE__ */ React.createElement("optgroup", { label: "Daftar 25 Program Studi Nasional" }, PRODI_LIST.filter((p) => !prodis.includes(p)).map((p) => {
				const catId = getCategoryForProdi(p);
				const catName = SARPRAS_CATEGORIES.find((c) => c.id === catId)?.name;
				return /* @__PURE__ */ React.createElement("option", {
					key: p,
					value: p
				}, p, " ", catName ? `(${catName})` : "");
			})));
		})())), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between mb-1.5" }, /* @__PURE__ */ React.createElement("label", { className: "text-xs font-semibold text-slate-300 block" }, "Bidang Sarpras ", /* @__PURE__ */ React.createElement("span", { className: "text-rose-400" }, "*")), formData.prodi && formData.prodi !== "Semua Program Studi (Umum)" && /* @__PURE__ */ React.createElement("span", { className: "text-[10px] text-cyan-400 bg-cyan-950/70 border border-cyan-800/50 px-2 py-0.5 rounded-full flex items-center gap-1 font-medium" }, /* @__PURE__ */ React.createElement(GraduationCap, { className: "w-3 h-3 text-cyan-400" }), /* @__PURE__ */ React.createElement("span", null, "Sesuai Prodi: ", formData.prodi))), /* @__PURE__ */ React.createElement("select", {
			value: formData.category,
			onChange: (e) => handleCategoryChange(e.target.value),
			className: "w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
		}, SARPRAS_CATEGORIES.map((c) => /* @__PURE__ */ React.createElement("option", {
			key: c.id,
			value: c.id
		}, c.name, " ", c.prodis?.length > 0 ? `(${c.prodis.length} Prodi Terkait)` : "")))))), activeTab === "valuasi" && /* @__PURE__ */ React.createElement("div", { className: "bg-slate-800/60 p-4 sm:p-5 rounded-xl border border-slate-700/60 space-y-4" }, /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4" }, /* @__PURE__ */ React.createElement("div", { className: "sm:col-span-3" }, /* @__PURE__ */ React.createElement("label", { className: "text-xs font-semibold text-slate-300 block mb-1.5" }, "Tahun Perolehan ", /* @__PURE__ */ React.createElement("span", { className: "text-rose-400" }, "*")), /* @__PURE__ */ React.createElement("input", {
			type: "number",
			min: "1970",
			max: "2030",
			value: formData.acquisitionYear,
			onChange: (e) => handleInputChange("acquisitionYear", e.target.value),
			className: "w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-medium"
		}), /* @__PURE__ */ React.createElement("span", { className: "text-[11px] text-cyan-400 mt-1 block" }, "Usia Pakai: ", 2026 - (Number(formData.acquisitionYear) || 2026), " Tahun")), /* @__PURE__ */ React.createElement("div", { className: "sm:col-span-3 bg-slate-900/80 p-3.5 rounded-xl border border-slate-700/50" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between mb-2" }, /* @__PURE__ */ React.createElement("label", { className: "text-xs font-semibold text-slate-300 flex items-center gap-1.5" }, /* @__PURE__ */ React.createElement(Sliders, { className: "w-3.5 h-3.5 text-cyan-400" }), /* @__PURE__ */ React.createElement("span", null, "Tingkat Utilisasi Praktik Taruna & Operasional (%)")), /* @__PURE__ */ React.createElement("span", { className: "text-xs font-bold text-cyan-300 font-mono" }, formData.utilizationRate, "% Terpakai")), /* @__PURE__ */ React.createElement("input", {
			type: "range",
			min: "0",
			max: "100",
			value: formData.utilizationRate,
			onChange: (e) => handleInputChange("utilizationRate", Number(e.target.value)),
			className: "w-full accent-cyan-500 cursor-pointer h-2 bg-slate-950 rounded-lg"
		}), /* @__PURE__ */ React.createElement("div", { className: "flex justify-between text-[10px] text-slate-400 mt-1 font-mono" }, /* @__PURE__ */ React.createElement("span", null, "0% (Idle / Menganggur)"), /* @__PURE__ */ React.createElement("span", null, "50% (Moderat)"), /* @__PURE__ */ React.createElement("span", null, "100% (Kapasitas Penuh)"))))), activeTab === "kondisi" && /* @__PURE__ */ React.createElement("div", { className: "bg-slate-800/60 p-4 sm:p-5 rounded-xl border border-slate-700/60 space-y-4" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "text-xs font-semibold text-slate-300 block mb-2" }, "Status Kondisi Fisik Sarpras ", /* @__PURE__ */ React.createElement("span", { className: "text-rose-400" }, "*")), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-3 gap-2.5" }, [
			{
				id: "Baik",
				label: "Baik (Skor ~92%)",
				color: "emerald"
			},
			{
				id: "Rusak Ringan",
				label: "Rusak Ringan (Skor ~75%)",
				color: "sky"
			},
			{
				id: "Rusak Berat",
				label: "Rusak Berat (Skor ~25%)",
				color: "rose"
			}
		].map((c) => {
			const isSelected = formData.condition === c.id;
			return /* @__PURE__ */ React.createElement("button", {
				key: c.id,
				type: "button",
				onClick: () => handleConditionSelect(c.id),
				className: `py-2 px-3 rounded-xl text-xs font-bold border transition-all text-center ${isSelected ? c.color === "emerald" ? "bg-emerald-600/30 border-emerald-400 text-emerald-300 shadow-md shadow-emerald-950" : c.color === "sky" ? "bg-sky-600/30 border-sky-400 text-sky-300 shadow-md shadow-sky-950" : "bg-rose-600/30 border-rose-400 text-rose-300 shadow-md shadow-rose-950" : "bg-slate-900/80 border-slate-700 text-slate-400 hover:text-white hover:border-slate-600"}`
			}, c.label);
		}))), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "text-xs font-semibold text-slate-300 block mb-1.5" }, "Skor Kondisi Presisi (0 - 100%)"), /* @__PURE__ */ React.createElement("input", {
			type: "number",
			min: "0",
			max: "100",
			value: formData.conditionScore,
			onChange: (e) => handleInputChange("conditionScore", e.target.value),
			className: "w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
		})), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "text-xs font-semibold text-slate-300 block mb-1.5" }, "Tingkat Urgensi Intervensi"), /* @__PURE__ */ React.createElement("select", {
			value: formData.maintenanceUrgency,
			onChange: (e) => handleInputChange("maintenanceUrgency", e.target.value),
			className: "w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
		}, /* @__PURE__ */ React.createElement("option", { value: "Normal" }, "Normal (Pemeliharaan Berkala)"), /* @__PURE__ */ React.createElement("option", { value: "Pemeliharaan Rutin" }, "Pemeliharaan Rutin (Dalam Antrian)"), /* @__PURE__ */ React.createElement("option", { value: "Kritis / Segera" }, "Kritis / Segera (Overhaul / Darurat)"))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "text-xs font-semibold text-slate-300 block mb-1.5" }, "Tanggal Pemeliharaan Terakhir"), /* @__PURE__ */ React.createElement("input", {
			type: "date",
			value: formData.lastMaintenanceDate || "",
			onChange: (e) => handleInputChange("lastMaintenanceDate", e.target.value),
			className: "w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
		})), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "text-xs font-semibold text-slate-300 block mb-1.5" }, "Jadwal Pemeliharaan Berikutnya"), /* @__PURE__ */ React.createElement("input", {
			type: "date",
			value: formData.nextMaintenanceDate || "",
			onChange: (e) => handleInputChange("nextMaintenanceDate", e.target.value),
			className: "w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
		})))), activeTab === "spesifikasi" && /* @__PURE__ */ React.createElement("div", { className: "bg-slate-800/60 p-4 sm:p-5 rounded-xl border border-slate-700/60 space-y-4" }, /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4" }, /* @__PURE__ */ React.createElement("div", { className: "sm:col-span-2" }, /* @__PURE__ */ React.createElement("label", { className: "text-xs font-semibold text-slate-300 block mb-1.5" }, "Kapasitas Desain & Operasional"), /* @__PURE__ */ React.createElement("input", {
			type: "text",
			value: formData.capacityDesc,
			onChange: (e) => handleInputChange("capacityDesc", e.target.value),
			placeholder: "Contoh: Daya Tampung 30 Taruna Latih, DWT 150 Ton",
			className: "w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
		})), /* @__PURE__ */ React.createElement("div", { className: "sm:col-span-2" }, /* @__PURE__ */ React.createElement("label", { className: "text-xs font-semibold text-slate-300 block mb-1.5" }, "Detail Mesin / Konfigurasi Teknis / Dimensi"), /* @__PURE__ */ React.createElement("textarea", {
			rows: "3",
			value: formData.specs,
			onChange: (e) => handleInputChange("specs", e.target.value),
			placeholder: "Contoh: LOA: 50.2 m, Breadth: 9.5 m, Main Engine: Yanmar 1800 HP...",
			className: "w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 font-mono leading-relaxed focus:outline-none focus:border-cyan-500"
		})))), activeTab === "catatan" && /* @__PURE__ */ React.createElement("div", { className: "bg-slate-800/60 p-4 sm:p-5 rounded-xl border border-slate-700/60 space-y-3" }, /* @__PURE__ */ React.createElement("label", { className: "text-xs font-semibold text-slate-300 block" }, "Catatan Analisis Masalah & Riwayat Tindakan Pemeliharaan"), /* @__PURE__ */ React.createElement("textarea", {
			rows: "5",
			value: formData.issuesSummary,
			onChange: (e) => handleInputChange("issuesSummary", e.target.value),
			placeholder: "Masukkan uraian riwayat perbaikan, kendala suku cadang, atau rekomendasi teknis operasional...",
			className: "w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 leading-relaxed focus:outline-none focus:border-cyan-500"
		})), /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between pt-2" }, /* @__PURE__ */ React.createElement("button", {
			type: "button",
			onClick: () => setIsFullEditMode(false),
			className: "px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors"
		}, "Batal"), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement("button", {
			type: "button",
			onClick: handleSaveFull,
			className: "inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-cyan-900/40 transition-all active:scale-95 border border-cyan-400/40"
		}, /* @__PURE__ */ React.createElement(Save, { className: "w-4 h-4" }), /* @__PURE__ */ React.createElement("span", null, "Simpan Seluruh Data Sarpras"))))) : 
		/* ============================================================== */
		/* CASE 2: NORMAL VIEW MODE + RESTRICTED EDIT FOR OPERATOR */
		/* ============================================================== */
		/* @__PURE__ */ React.createElement("div", { className: "space-y-5 animate-fadeIn" }, /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs" }, /* @__PURE__ */ React.createElement("div", { className: "bg-slate-800/80 p-3 rounded-xl border border-slate-700/60" }, /* @__PURE__ */ React.createElement("span", { className: "text-slate-400 block text-[11px]" }, "Satuan Pendidikan"), /* @__PURE__ */ React.createElement("span", {
			className: "font-semibold text-white mt-0.5 block truncate",
			title: asset.satdikName
		}, asset.satdikName)), /* @__PURE__ */ React.createElement("div", { className: "bg-slate-800/80 p-3 rounded-xl border border-slate-700/60" }, /* @__PURE__ */ React.createElement("span", { className: "text-slate-400 block text-[11px]" }, "Tingkat Utilisasi"), /* @__PURE__ */ React.createElement("span", { className: "font-bold text-cyan-400 mt-0.5 block" }, asset.utilizationRate, "% Terpakai")), /* @__PURE__ */ React.createElement("div", { className: "bg-slate-800/80 p-3 rounded-xl border border-slate-700/60" }, /* @__PURE__ */ React.createElement("span", { className: "text-slate-400 block text-[11px]" }, "Tahun Perolehan"), /* @__PURE__ */ React.createElement("span", { className: "font-semibold text-white mt-0.5 block" }, asset.acquisitionYear, " (", 2026 - asset.acquisitionYear, " Thn Pakai)"))), /* @__PURE__ */ React.createElement("div", { className: "bg-slate-800/50 p-4 rounded-xl border border-slate-700/60 space-y-2" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2 text-xs font-bold text-slate-200" }, /* @__PURE__ */ React.createElement(FileText, { className: "w-4 h-4 text-cyan-400" }), /* @__PURE__ */ React.createElement("span", null, "Spesifikasi Teknis & Kapasitas Desain")), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { className: "text-slate-400 text-[11px] block" }, "Bidang Sarpras:"), /* @__PURE__ */ React.createElement("p", {
			className: "text-slate-200 font-medium mt-0.5 truncate",
			title: SARPRAS_CATEGORIES.find((c) => c.id === asset.category)?.name || asset.category
		}, SARPRAS_CATEGORIES.find((c) => c.id === asset.category)?.name || asset.category || "-")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { className: "text-slate-400 text-[11px] block" }, "Program Studi:"), /* @__PURE__ */ React.createElement("p", {
			className: "text-cyan-300 font-medium mt-0.5 flex items-center gap-1.5 truncate",
			title: asset.prodi || "Semua Program Studi (Umum)"
		}, /* @__PURE__ */ React.createElement(GraduationCap, { className: "w-3.5 h-3.5 text-cyan-400 flex-shrink-0" }), /* @__PURE__ */ React.createElement("span", { className: "truncate font-semibold" }, asset.prodi || "Semua Program Studi (Umum)"))), /* @__PURE__ */ React.createElement("div", { className: "sm:col-span-2" }, /* @__PURE__ */ React.createElement("span", { className: "text-slate-400 text-[11px] block" }, "Kapasitas Operasional:"), /* @__PURE__ */ React.createElement("p", { className: "text-slate-200 font-medium mt-0.5" }, asset.capacityDesc || "-")), /* @__PURE__ */ React.createElement("div", { className: "sm:col-span-2" }, /* @__PURE__ */ React.createElement("span", { className: "text-slate-400 text-[11px] block" }, "Detail Mesin / Konfigurasi:"), /* @__PURE__ */ React.createElement("p", { className: "text-slate-200 font-mono text-[11px] bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 mt-1 leading-relaxed" }, asset.specs || "-")))), /* @__PURE__ */ React.createElement("div", { className: "bg-slate-800/50 p-4 rounded-xl border border-slate-700/60 space-y-3" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between text-xs font-bold text-slate-200" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement(Wrench, { className: "w-4 h-4 text-amber-400" }), /* @__PURE__ */ React.createElement("span", null, "Analisis Kondisi & Catatan Pemeliharaan")), asset.nextMaintenanceDate && /* @__PURE__ */ React.createElement("span", { className: "text-[11px] text-slate-400 font-medium flex items-center gap-1" }, /* @__PURE__ */ React.createElement(Calendar, { className: "w-3.5 h-3.5 text-cyan-400" }), /* @__PURE__ */ React.createElement("span", null, "Jadwal Berikutnya: ", asset.nextMaintenanceDate))), isQuickEditMode ? /* @__PURE__ */ React.createElement("div", { className: "space-y-3 bg-slate-900/90 p-3.5 rounded-xl border border-cyan-800/60 animate-fadeIn" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React.createElement("span", { className: "text-xs font-bold text-cyan-300" }, "Pembaruan Status Kondisi Lapangan"), /* @__PURE__ */ React.createElement("span", { className: "text-[10px] text-slate-400" }, canEditFull ? "Akses: Kendali Penuh" : "Akses: Operator Kampus")), /* @__PURE__ */ React.createElement("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1" }, /* @__PURE__ */ React.createElement("label", { className: "text-xs text-slate-300 font-medium" }, "Kondisi Fisik Baru:"), /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap gap-2" }, [
			"Baik",
			"Rusak Ringan",
			"Rusak Berat"
		].map((cond) => /* @__PURE__ */ React.createElement("button", {
			key: cond,
			type: "button",
			onClick: () => setQuickCondition(cond),
			className: `px-3 py-1 text-xs rounded-lg font-semibold border transition-all ${quickCondition === cond ? "bg-cyan-600 border-cyan-400 text-white shadow-md shadow-cyan-950" : "bg-slate-800 border-slate-700 text-slate-400 hover:text-white"}`
		}, cond)))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "text-xs text-slate-300 font-medium block mb-1" }, "Catatan Teknis / Log Riwayat Perbaikan:"), /* @__PURE__ */ React.createElement("textarea", {
			rows: "3",
			value: quickNotes,
			onChange: (e) => setQuickNotes(e.target.value),
			className: "w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500",
			placeholder: "Uraikan tindakan perbaikan atau pemeliharaan yang telah dikerjakan di lapangan..."
		})), /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-end gap-2 pt-1" }, /* @__PURE__ */ React.createElement("button", {
			type: "button",
			onClick: () => setIsQuickEditMode(false),
			className: "px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
		}, "Batal"), /* @__PURE__ */ React.createElement("button", {
			type: "button",
			onClick: handleSaveQuick,
			className: "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md shadow-cyan-900/40"
		}, /* @__PURE__ */ React.createElement(Save, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ React.createElement("span", null, "Simpan Status")))) : /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-800" }, asset.issuesSummary || "Tidak ada catatan permasalahan teknis."), /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap items-center justify-between gap-2 mt-3 pt-2 border-t border-slate-800/80" }, /* @__PURE__ */ React.createElement("div", null, canEditFull ? /* @__PURE__ */ React.createElement("span", { className: "text-[11px] text-cyan-400 flex items-center gap-1" }, /* @__PURE__ */ React.createElement(Sparkles, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ React.createElement("span", null, "Akun Anda memiliki kendali penuh atas master data sarpras ini.")) : canEditOwn && isOwnCampus ? /* @__PURE__ */ React.createElement("span", { className: "text-[11px] text-amber-300 flex items-center gap-1" }, /* @__PURE__ */ React.createElement(Wrench, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ React.createElement("span", null, "Operator Kampus berwenang memperbarui kondisi & log pemeliharaan.")) : /* @__PURE__ */ React.createElement("span", { className: "text-[11px] text-slate-400 flex items-center gap-1" }, /* @__PURE__ */ React.createElement(Info, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ React.createElement("span", null, isAuditor ? "Akun Anda dalam mode audit tinjauan (Hanya Baca)." : "Akses edit terbatas pada operator kampus terkait."))), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, canQuickEdit && /* @__PURE__ */ React.createElement("button", {
			type: "button",
			onClick: () => {
				setQuickCondition(asset.condition);
				setQuickNotes(asset.issuesSummary || "");
				setIsQuickEditMode(true);
			},
			className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-medium border border-slate-700 transition-colors"
		}, /* @__PURE__ */ React.createElement(Wrench, { className: "w-3.5 h-3.5 text-amber-400" }), /* @__PURE__ */ React.createElement("span", null, "Ubah Kondisi / Log")), canEditFull && /* @__PURE__ */ React.createElement("button", {
			type: "button",
			onClick: () => {
				setIsFullEditMode(true);
				setIsQuickEditMode(false);
			},
			className: "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-semibold shadow-md shadow-cyan-900/30 transition-all border border-cyan-400/30"
		}, /* @__PURE__ */ React.createElement(Edit3, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ React.createElement("span", null, "Edit Keseluruhan Data")))))))), /* @__PURE__ */ React.createElement("div", { className: "bg-slate-800/80 px-5 sm:px-6 py-3 border-t border-slate-700/80 flex items-center justify-between text-xs text-slate-400 flex-shrink-0" }, /* @__PURE__ */ React.createElement("span", { className: "flex items-center gap-1 text-[11px]" }, /* @__PURE__ */ React.createElement(Clock, { className: "w-3.5 h-3.5 text-slate-500" }), /* @__PURE__ */ React.createElement("span", null, "Terakhir disinkronkan: ", asset.lastMaintenanceDate || "2026-01-15")), /* @__PURE__ */ React.createElement("button", {
			onClick: onClose,
			className: "px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors border border-slate-700"
		}, "Tutup"))));
	};
})();
const AssetDetailModal = window.__AssetDetailModal;
// ============================================================================
// MODULE: src/components/AssetExplorer.jsx
// ============================================================================
(() => {
	const { useState, useMemo } = React;
	const { Search, Filter, Layers, Building2, Ship, Fish, Boxes, Briefcase, Compass, Wrench, Users, TrendingUp, CheckCircle2, AlertTriangle, ArrowUpDown, LayoutGrid, List, RotateCcw, ExternalLink, ChevronLeft, ChevronRight, ShieldAlert, Download, GraduationCap } = window.__VENDOR__.Lucide;
	const { SATDIK_LIST, SARPRAS_CATEGORIES, PRODI_LIST, getCategoryForProdi, getProdisForCategory } = window.SARPRAS_DATA;
	const { exportAssetsToExcel } = window.SARPRAS_EXCEL;
	window.__AssetExplorer = function AssetExplorer({ assets, initialSatdikFilter = "ALL", initialCategoryFilter = "ALL", onUpdateAsset, onUpdateAssetCondition, currentUser }) {
		const [searchQuery, setSearchQuery] = useState("");
		const [selectedSatdik, setSelectedSatdik] = useState(initialSatdikFilter);
		const [selectedProdi, setSelectedProdi] = useState("ALL");
		const [selectedCategory, setSelectedCategory] = useState(initialCategoryFilter);
		const [selectedCondition, setSelectedCondition] = useState("ALL");
		const [selectedUrgency, setSelectedUrgency] = useState("ALL");
		const [viewMode, setViewMode] = useState("table");
		// Sorting state
		const [sortField, setSortField] = useState("name");
		const [sortDirection, setSortDirection] = useState("asc");
		// Pagination state
		const [currentPage, setCurrentPage] = useState(1);
		const itemsPerPage = 10;
		// Selected asset for modal (tracked reactively)
		const [selectedAsset, setSelectedAsset] = useState(null);
		const [isModalOpen, setIsModalOpen] = useState(false);
		const activeModalAsset = useMemo(() => {
			if (!selectedAsset) return null;
			return assets.find((a) => a.id === selectedAsset.id) || selectedAsset;
		}, [assets, selectedAsset]);
		// Sync if props change
		React.useEffect(() => {
			if (initialSatdikFilter) setSelectedSatdik(initialSatdikFilter);
		}, [initialSatdikFilter]);
		React.useEffect(() => {
			if (initialCategoryFilter) setSelectedCategory(initialCategoryFilter);
		}, [initialCategoryFilter]);
		// Available Prodi options based on selected campus and selected category
		const availableProdis = useMemo(() => {
			let prodis = PRODI_LIST;
			if (selectedSatdik !== "ALL") {
				const sat = SATDIK_LIST.find((s) => s.id === selectedSatdik);
				prodis = sat?.prodi || PRODI_LIST;
			}
			if (selectedCategory !== "ALL") {
				const catProdis = getProdisForCategory(selectedCategory);
				if (catProdis.length > 0) {
					return prodis.filter((p) => catProdis.includes(p));
				}
			}
			return prodis;
		}, [selectedSatdik, selectedCategory]);
		const handleCategoryFilterChange = (catId) => {
			setSelectedCategory(catId);
			setCurrentPage(1);
			if (catId !== "ALL" && selectedProdi !== "ALL") {
				const catProdis = getProdisForCategory(catId);
				if (catProdis.length > 0 && !catProdis.includes(selectedProdi)) {
					setSelectedProdi("ALL");
				}
			}
		};
		const handleProdiFilterChange = (prodiName) => {
			setSelectedProdi(prodiName);
			setCurrentPage(1);
			if (prodiName !== "ALL" && prodiName !== "Semua Program Studi (Umum)") {
				const matchedCat = getCategoryForProdi(prodiName);
				if (matchedCat && selectedCategory !== "ALL" && selectedCategory !== matchedCat) {
					setSelectedCategory(matchedCat);
				}
			}
		};
		// Filter and sort logic
		const filteredAssets = useMemo(() => {
			return assets.filter((item) => {
				const matchSearch = searchQuery === "" || item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.satdikName.toLowerCase().includes(searchQuery.toLowerCase()) || item.prodi && item.prodi.toLowerCase().includes(searchQuery.toLowerCase()) || item.specs && item.specs.toLowerCase().includes(searchQuery.toLowerCase());
				const matchSatdik = selectedSatdik === "ALL" || item.satdikId === selectedSatdik;
				const matchProdi = selectedProdi === "ALL" || item.prodi && item.prodi.toLowerCase() === selectedProdi.toLowerCase() || selectedProdi === "Semua Program Studi (Umum)" && (!item.prodi || item.prodi.includes("Umum"));
				const matchCat = selectedCategory === "ALL" || item.category === selectedCategory;
				const matchCond = selectedCondition === "ALL" || item.condition === selectedCondition;
				const matchUrg = selectedUrgency === "ALL" || item.maintenanceUrgency === selectedUrgency;
				return matchSearch && matchSatdik && matchProdi && matchCat && matchCond && matchUrg;
			}).sort((a, b) => {
				let valA = a[sortField];
				let valB = b[sortField];
				if (sortField === "conditionScore" || sortField === "utilizationRate" || sortField === "acquisitionYear") {
					valA = Number(valA) || 0;
					valB = Number(valB) || 0;
				} else if (typeof valA === "string") {
					valA = valA.toLowerCase();
					valB = (valB || "").toLowerCase();
				}
				if (valA < valB) return sortDirection === "asc" ? -1 : 1;
				if (valA > valB) return sortDirection === "asc" ? 1 : -1;
				return 0;
			});
		}, [
			assets,
			searchQuery,
			selectedSatdik,
			selectedProdi,
			selectedCategory,
			selectedCondition,
			selectedUrgency,
			sortField,
			sortDirection
		]);
		// Pagination calculation
		const totalPages = Math.ceil(filteredAssets.length / itemsPerPage) || 1;
		const paginatedAssets = filteredAssets.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
		const handleSort = (field) => {
			if (sortField === field) {
				setSortDirection((prev) => prev === "asc" ? "desc" : "asc");
			} else {
				setSortField(field);
				setSortDirection("asc");
			}
		};
		const handleResetFilters = () => {
			setSearchQuery("");
			setSelectedSatdik("ALL");
			setSelectedProdi("ALL");
			setSelectedCategory("ALL");
			setSelectedCondition("ALL");
			setSelectedUrgency("ALL");
			setCurrentPage(1);
		};
		const handleExportFilteredExcel = () => {
			const satdikObj = SATDIK_LIST.find((s) => s.id === selectedSatdik);
			const catObj = SARPRAS_CATEGORIES.find((c) => c.id === selectedCategory);
			exportAssetsToExcel(filteredAssets, {
				currentUser,
				filterSatdikName: selectedSatdik === "ALL" ? "Semua Satdik (18 Kampus)" : satdikObj?.name || selectedSatdik,
				filterCategoryName: selectedCategory === "ALL" ? "Semua Bidang" : catObj?.name || selectedCategory,
				filterProdiName: selectedProdi === "ALL" ? "Semua Program Studi" : selectedProdi,
				filenamePrefix: `SARPRAS_KKP_${selectedSatdik !== "ALL" ? selectedSatdik : "Inventaris"}`
			});
		};
		const openDetail = (asset) => {
			setSelectedAsset(asset);
			setIsModalOpen(true);
		};
		const getCategoryIcon = (category) => {
			switch (category) {
				case "penangkapan_ikan":
				case "penangkapan_mesin":
				case "maritim_kapal":
				case "alat_tangkap": return Ship;
				case "permesinan_mekanisasi": return Wrench;
				case "budidaya_perikanan":
				case "akuakultur": return Fish;
				case "pengolahan_hasil":
				case "pengolahan_upi": return Boxes;
				case "agribisnis_perikanan":
				case "agribisnis_penyuluhan":
				case "tefa": return TrendingUp;
				case "kelautan_konservasi":
				case "konservasi_pariwisata": return Compass;
				case "sosial_pemberdayaan":
				case "asrama_penunjang": return Users;
				case "administrasi_umum":
				case "administasi_umum": return Briefcase;
				default: return Building2;
			}
		};
		return /* @__PURE__ */ React.createElement("div", { className: "space-y-6" }, /* @__PURE__ */ React.createElement("div", { className: "bg-slate-800/90 rounded-2xl p-5 border border-slate-700/70 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement("span", { className: "px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30" }, "Katalog Inventaris Sarana & Prasarana"), /* @__PURE__ */ React.createElement("span", { className: "text-slate-400 text-xs" }, "• Database SARPRAS KKP")), /* @__PURE__ */ React.createElement("h2", { className: "text-xl sm:text-2xl font-bold text-white tracking-tight mt-1 flex items-center gap-2" }, /* @__PURE__ */ React.createElement(Layers, { className: "w-5 h-5 text-cyan-400" }), /* @__PURE__ */ React.createElement("span", null, "Eksplorasi & Inventaris Sarana Prasarana")), /* @__PURE__ */ React.createElement("p", { className: "text-slate-400 text-xs sm:text-sm mt-0.5" }, "Pencarian cerdas dan pemfilteran multidimensi seluruh aset fisik, kapal latih, laboratorium, dan TEFA vokasi.")), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2 self-start md:self-center" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center bg-slate-900 rounded-xl p-1 border border-slate-700" }, /* @__PURE__ */ React.createElement("button", {
			onClick: () => setViewMode("table"),
			className: `p-1.5 rounded-lg text-xs font-medium transition-colors ${viewMode === "table" ? "bg-cyan-600 text-white" : "text-slate-400 hover:text-white"}`,
			title: "Tampilan Tabel Data"
		}, /* @__PURE__ */ React.createElement(List, { className: "w-4 h-4" })), /* @__PURE__ */ React.createElement("button", {
			onClick: () => setViewMode("grid"),
			className: `p-1.5 rounded-lg text-xs font-medium transition-colors ${viewMode === "grid" ? "bg-cyan-600 text-white" : "text-slate-400 hover:text-white"}`,
			title: "Tampilan Kartu Grid"
		}, /* @__PURE__ */ React.createElement(LayoutGrid, { className: "w-4 h-4" }))), /* @__PURE__ */ React.createElement("button", {
			onClick: handleResetFilters,
			className: "flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs transition-colors",
			title: "Reset semua filter ke kondisi awal"
		}, /* @__PURE__ */ React.createElement(RotateCcw, { className: "w-3.5 h-3.5 text-cyan-400" }), /* @__PURE__ */ React.createElement("span", null, "Reset")))), /* @__PURE__ */ React.createElement("div", { className: "bg-slate-800/80 rounded-2xl p-4 border border-slate-700/70 shadow-md space-y-3" }, /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-2.5" }, /* @__PURE__ */ React.createElement("div", { className: "lg:col-span-3 relative" }, /* @__PURE__ */ React.createElement(Search, { className: "w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" }), /* @__PURE__ */ React.createElement("input", {
			type: "text",
			placeholder: "Cari sarpras / spesifikasi...",
			value: searchQuery,
			onChange: (e) => {
				setSearchQuery(e.target.value);
				setCurrentPage(1);
			},
			className: "w-full pl-9 pr-4 py-2 bg-slate-900 text-slate-100 placeholder-slate-400 text-xs rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-500"
		})), /* @__PURE__ */ React.createElement("div", { className: "lg:col-span-3" }, /* @__PURE__ */ React.createElement("select", {
			value: selectedSatdik,
			onChange: (e) => {
				setSelectedSatdik(e.target.value);
				setSelectedProdi("ALL");
				setCurrentPage(1);
			},
			className: "w-full py-2 px-3 bg-slate-900 text-slate-200 text-xs rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-500 truncate",
			title: "Filter Satuan Pendidikan"
		}, /* @__PURE__ */ React.createElement("option", { value: "ALL" }, "Semua Satdik (18 Kampus)"), SATDIK_LIST.map((s) => /* @__PURE__ */ React.createElement("option", {
			key: s.id,
			value: s.id
		}, s.shortName, " (", s.kota, ")")))), /* @__PURE__ */ React.createElement("div", { className: "lg:col-span-2" }, /* @__PURE__ */ React.createElement("select", {
			value: selectedProdi,
			onChange: (e) => handleProdiFilterChange(e.target.value),
			className: "w-full py-2 px-3 bg-slate-900 text-slate-200 text-xs rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-500 truncate",
			title: "Filter Program Studi"
		}, /* @__PURE__ */ React.createElement("option", { value: "ALL" }, "Semua Program Studi"), /* @__PURE__ */ React.createElement("option", { value: "Semua Program Studi (Umum)" }, "Fasilitas Bersama / Umum"), availableProdis.map((p) => {
			const catId = getCategoryForProdi(p);
			const catName = SARPRAS_CATEGORIES.find((c) => c.id === catId)?.name;
			return /* @__PURE__ */ React.createElement("option", {
				key: p,
				value: p
			}, p, " ", catName ? `(${catName})` : "");
		}))), /* @__PURE__ */ React.createElement("div", { className: "lg:col-span-2" }, /* @__PURE__ */ React.createElement("select", {
			value: selectedCategory,
			onChange: (e) => handleCategoryFilterChange(e.target.value),
			className: "w-full py-2 px-3 bg-slate-900 text-slate-200 text-xs rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-500 truncate",
			title: "Filter Bidang Sarpras"
		}, /* @__PURE__ */ React.createElement("option", { value: "ALL" }, "Semua Bidang"), SARPRAS_CATEGORIES.map((c) => /* @__PURE__ */ React.createElement("option", {
			key: c.id,
			value: c.id
		}, c.name, " ", c.prodis?.length > 0 ? `(${c.prodis.length} Prodi)` : "")))), /* @__PURE__ */ React.createElement("div", { className: "lg:col-span-2" }, /* @__PURE__ */ React.createElement("select", {
			value: selectedCondition,
			onChange: (e) => {
				setSelectedCondition(e.target.value);
				setCurrentPage(1);
			},
			className: "w-full py-2 px-3 bg-slate-900 text-slate-200 text-xs rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-500",
			title: "Filter Kondisi Fisik"
		}, /* @__PURE__ */ React.createElement("option", { value: "ALL" }, "Semua Kondisi"), /* @__PURE__ */ React.createElement("option", { value: "Baik" }, "Baik (Layak)"), /* @__PURE__ */ React.createElement("option", { value: "Rusak Ringan" }, "Rusak Ringan"), /* @__PURE__ */ React.createElement("option", { value: "Rusak Berat" }, "Rusak Berat (Kritis)")))), /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-700/60 text-xs" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap items-center gap-2" }, /* @__PURE__ */ React.createElement("span", { className: "text-slate-400 text-[11px] flex items-center gap-1" }, /* @__PURE__ */ React.createElement(Filter, { className: "w-3 h-3 text-cyan-400" }), /* @__PURE__ */ React.createElement("span", null, "Filter Cepat:")), /* @__PURE__ */ React.createElement("button", {
			onClick: () => {
				setSelectedUrgency(selectedUrgency === "Kritis / Segera" ? "ALL" : "Kritis / Segera");
				setCurrentPage(1);
			},
			className: `px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-colors ${selectedUrgency === "Kritis / Segera" ? "bg-rose-500/20 text-rose-300 border-rose-500/50" : "bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200"}`
		}, "⚠ Urgensi Kritis (", assets.filter((a) => a.maintenanceUrgency === "Kritis / Segera").length, ")"), /* @__PURE__ */ React.createElement("button", {
			onClick: () => {
				setSelectedCategory(selectedCategory === "penangkapan_ikan" ? "ALL" : "penangkapan_ikan");
				setCurrentPage(1);
			},
			className: `px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-colors ${selectedCategory === "penangkapan_ikan" ? "bg-sky-500/20 text-sky-300 border-sky-500/50" : "bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200"}`
		}, "⚓ Penangkapan Ikan (", assets.filter((a) => a.category === "penangkapan_ikan").length, ")")), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3" }, /* @__PURE__ */ React.createElement("span", { className: "text-slate-400 text-xs hidden sm:inline" }, "Menampilkan ", /* @__PURE__ */ React.createElement("span", { className: "font-bold text-white" }, filteredAssets.length), " dari ", assets.length, " Aset"), /* @__PURE__ */ React.createElement("button", {
			onClick: handleExportFilteredExcel,
			className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 text-emerald-200 border border-emerald-700/60 text-xs font-semibold shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]",
			title: "Ekspor tabel aset yang tersaring saat ini ke Microsoft Excel (.xls) dengan format resmi & rapi"
		}, /* @__PURE__ */ React.createElement(Download, { className: "w-3.5 h-3.5 text-emerald-400" }), /* @__PURE__ */ React.createElement("span", null, "Ekspor Excel (", filteredAssets.length, ")"))))), viewMode === "table" ? /* @__PURE__ */ React.createElement("div", { className: "bg-slate-800/90 rounded-2xl border border-slate-700/70 shadow-lg overflow-hidden" }, /* @__PURE__ */ React.createElement("div", { className: "overflow-x-auto" }, /* @__PURE__ */ React.createElement("table", { className: "w-full text-left text-xs border-collapse" }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", { className: "bg-slate-900/90 text-slate-300 border-b border-slate-700/80 font-semibold uppercase tracking-wider text-[11px]" }, /* @__PURE__ */ React.createElement("th", {
			onClick: () => handleSort("name"),
			className: "p-3.5 cursor-pointer hover:text-cyan-400 transition-colors"
		}, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-1.5" }, /* @__PURE__ */ React.createElement("span", null, "Nama Sarana & Prasarana"), /* @__PURE__ */ React.createElement(ArrowUpDown, { className: "w-3.5 h-3.5 opacity-60" }))), /* @__PURE__ */ React.createElement("th", {
			onClick: () => handleSort("satdikName"),
			className: "p-3.5 cursor-pointer hover:text-cyan-400 transition-colors"
		}, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-1.5" }, /* @__PURE__ */ React.createElement("span", null, "Satuan Pendidikan"), /* @__PURE__ */ React.createElement(ArrowUpDown, { className: "w-3.5 h-3.5 opacity-60" }))), /* @__PURE__ */ React.createElement("th", {
			onClick: () => handleSort("category"),
			className: "p-3.5 cursor-pointer hover:text-cyan-400 transition-colors"
		}, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-1.5" }, /* @__PURE__ */ React.createElement("span", null, "Bidang"), /* @__PURE__ */ React.createElement(ArrowUpDown, { className: "w-3.5 h-3.5 opacity-60" }))), /* @__PURE__ */ React.createElement("th", {
			onClick: () => handleSort("conditionScore"),
			className: "p-3.5 cursor-pointer hover:text-cyan-400 transition-colors"
		}, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-1.5" }, /* @__PURE__ */ React.createElement("span", null, "Kondisi & Skor"), /* @__PURE__ */ React.createElement(ArrowUpDown, { className: "w-3.5 h-3.5 opacity-60" }))), /* @__PURE__ */ React.createElement("th", {
			onClick: () => handleSort("utilizationRate"),
			className: "p-3.5 cursor-pointer hover:text-cyan-400 transition-colors"
		}, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-1.5" }, /* @__PURE__ */ React.createElement("span", null, "Utilisasi"), /* @__PURE__ */ React.createElement(ArrowUpDown, { className: "w-3.5 h-3.5 opacity-60" }))), /* @__PURE__ */ React.createElement("th", { className: "p-3.5 text-right" }, "Aksi"))), /* @__PURE__ */ React.createElement("tbody", { className: "divide-y divide-slate-800" }, paginatedAssets.length > 0 ? paginatedAssets.map((asset) => {
			const CategoryIcon = getCategoryIcon(asset.category);
			return /* @__PURE__ */ React.createElement("tr", {
				key: asset.id,
				className: "hover:bg-slate-700/40 transition-colors cursor-pointer",
				onClick: () => openDetail(asset)
			}, /* @__PURE__ */ React.createElement("td", { className: "p-3.5" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center space-x-3" }, /* @__PURE__ */ React.createElement("div", { className: "w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center flex-shrink-0" }, /* @__PURE__ */ React.createElement(CategoryIcon, { className: "w-4 h-4" })), /* @__PURE__ */ React.createElement("div", { className: "max-w-[280px]" }, /* @__PURE__ */ React.createElement("span", {
				className: "font-bold text-white block truncate",
				title: asset.name
			}, asset.name), asset.prodi && /* @__PURE__ */ React.createElement("span", {
				className: "inline-flex items-center gap-1 text-[10px] text-cyan-300 font-medium truncate mt-0.5",
				title: `Program Studi: ${asset.prodi}`
			}, /* @__PURE__ */ React.createElement(GraduationCap, { className: "w-3 h-3 text-cyan-400 flex-shrink-0" }), /* @__PURE__ */ React.createElement("span", { className: "truncate" }, asset.prodi))))), /* @__PURE__ */ React.createElement("td", { className: "p-3.5 text-slate-300" }, /* @__PURE__ */ React.createElement("span", {
				className: "font-medium block max-w-[200px] truncate",
				title: asset.satdikName
			}, asset.satdikName), /* @__PURE__ */ React.createElement("span", { className: "text-[10px] text-slate-400" }, "Thn Perolehan: ", asset.acquisitionYear)), /* @__PURE__ */ React.createElement("td", { className: "p-3.5" }, /* @__PURE__ */ React.createElement("span", { className: "inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-900 border border-slate-700 text-slate-300" }, SARPRAS_CATEGORIES.find((c) => c.id === asset.category)?.name || asset.category)), /* @__PURE__ */ React.createElement("td", { className: "p-3.5" }, /* @__PURE__ */ React.createElement("div", { className: "space-y-1 max-w-[130px]" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React.createElement("span", { className: `px-2 py-0.5 rounded text-[10px] font-bold ${asset.condition === "Baik" ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30" : asset.condition === "Rusak Ringan" ? "bg-sky-500/15 text-sky-400 border border-sky-500/30" : "bg-rose-500/15 text-rose-400 border border-rose-500/30"}` }, asset.condition), /* @__PURE__ */ React.createElement("span", { className: "text-[10px] text-slate-400 font-mono" }, asset.conditionScore, "%")), /* @__PURE__ */ React.createElement("div", { className: "w-full h-1.5 bg-slate-900 rounded-full overflow-hidden" }, /* @__PURE__ */ React.createElement("div", {
				className: `h-full rounded-full ${asset.conditionScore >= 85 ? "bg-emerald-500" : asset.conditionScore >= 75 ? "bg-sky-500" : asset.conditionScore >= 50 ? "bg-amber-500" : "bg-rose-500"}`,
				style: { width: `${asset.conditionScore}%` }
			})))), /* @__PURE__ */ React.createElement("td", { className: "p-3.5" }, /* @__PURE__ */ React.createElement("div", { className: "space-y-1 max-w-[100px]" }, /* @__PURE__ */ React.createElement("span", { className: "font-semibold text-slate-200" }, asset.utilizationRate, "%"), /* @__PURE__ */ React.createElement("div", { className: "w-full h-1.5 bg-slate-900 rounded-full overflow-hidden" }, /* @__PURE__ */ React.createElement("div", {
				className: "h-full bg-cyan-500 rounded-full",
				style: { width: `${asset.utilizationRate}%` }
			})))), /* @__PURE__ */ React.createElement("td", {
				className: "p-3.5 text-right",
				onClick: (e) => e.stopPropagation()
			}, /* @__PURE__ */ React.createElement("button", {
				onClick: () => openDetail(asset),
				className: "inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 text-[11px] font-medium transition-colors"
			}, /* @__PURE__ */ React.createElement("span", null, "Detail"), /* @__PURE__ */ React.createElement(ExternalLink, { className: "w-3 h-3" }))));
		}) : /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("td", {
			colSpan: "7",
			className: "p-8 text-center text-slate-400"
		}, "Tidak ada aset sarpras yang cocok dengan kriteria filter yang dipilih.")))))) : 
		/* Grid Card View */
		/* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" }, paginatedAssets.length > 0 ? paginatedAssets.map((asset) => {
			const CategoryIcon = getCategoryIcon(asset.category);
			return /* @__PURE__ */ React.createElement("div", {
				key: asset.id,
				onClick: () => openDetail(asset),
				className: "bg-slate-800/90 hover:bg-slate-800 rounded-2xl p-4 border border-slate-700/70 hover:border-cyan-500/50 shadow-md transition-all cursor-pointer flex flex-col justify-between group"
			}, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center space-x-2" }, /* @__PURE__ */ React.createElement("div", { className: "w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center" }, /* @__PURE__ */ React.createElement(CategoryIcon, { className: "w-4 h-4" }))), /* @__PURE__ */ React.createElement("span", { className: `px-2 py-0.5 rounded text-[10px] font-bold ${asset.condition === "Baik" ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30" : asset.condition === "Rusak Ringan" ? "bg-sky-500/15 text-sky-400 border border-sky-500/30" : "bg-rose-500/15 text-rose-400 border border-rose-500/30"}` }, asset.condition)), /* @__PURE__ */ React.createElement("h4", { className: "font-bold text-white text-sm mt-3 group-hover:text-cyan-300 transition-colors line-clamp-1" }, asset.name), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-slate-400 mt-0.5 line-clamp-1" }, asset.satdikName), asset.prodi && /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-1.5 text-[11px] text-cyan-300 font-medium truncate mt-1" }, /* @__PURE__ */ React.createElement(GraduationCap, { className: "w-3.5 h-3.5 text-cyan-400 flex-shrink-0" }), /* @__PURE__ */ React.createElement("span", { className: "truncate" }, asset.prodi)), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-slate-300 mt-2 line-clamp-2 bg-slate-900/60 p-2 rounded-lg border border-slate-800" }, asset.specs || asset.capacityDesc)), /* @__PURE__ */ React.createElement("div", { className: "mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { className: "text-[10px] text-slate-400 block" }, "Tahun Perolehan"), /* @__PURE__ */ React.createElement("span", { className: "font-bold text-slate-200" }, asset.acquisitionYear)), /* @__PURE__ */ React.createElement("div", { className: "text-right" }, /* @__PURE__ */ React.createElement("span", { className: "text-[10px] text-slate-400 block" }, "Utilisasi"), /* @__PURE__ */ React.createElement("span", { className: "font-bold text-cyan-400" }, asset.utilizationRate, "%"))));
		}) : /* @__PURE__ */ React.createElement("div", { className: "col-span-full p-8 text-center text-slate-400 bg-slate-800/40 rounded-2xl border border-slate-700" }, "Tidak ada aset sarpras yang ditemukan.")), totalPages > 1 && /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between bg-slate-800/80 px-4 py-3 rounded-2xl border border-slate-700/70 text-xs text-slate-300" }, /* @__PURE__ */ React.createElement("div", null, "Halaman ", /* @__PURE__ */ React.createElement("span", { className: "font-bold text-white" }, currentPage), " dari ", totalPages), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-1.5" }, /* @__PURE__ */ React.createElement("button", {
			onClick: () => setCurrentPage((p) => Math.max(1, p - 1)),
			disabled: currentPage === 1,
			className: "p-1.5 rounded-lg bg-slate-900 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-900 text-slate-200 transition-colors"
		}, /* @__PURE__ */ React.createElement(ChevronLeft, { className: "w-4 h-4" })), Array.from({ length: totalPages }).map((_, i) => /* @__PURE__ */ React.createElement("button", {
			key: i + 1,
			onClick: () => setCurrentPage(i + 1),
			className: `w-7 h-7 rounded-lg text-xs font-semibold transition-colors ${currentPage === i + 1 ? "bg-cyan-600 text-white" : "bg-slate-900 text-slate-400 hover:text-white"}`
		}, i + 1)), /* @__PURE__ */ React.createElement("button", {
			onClick: () => setCurrentPage((p) => Math.min(totalPages, p + 1)),
			disabled: currentPage === totalPages,
			className: "p-1.5 rounded-lg bg-slate-900 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-900 text-slate-200 transition-colors"
		}, /* @__PURE__ */ React.createElement(ChevronRight, { className: "w-4 h-4" })))), /* @__PURE__ */ React.createElement(AssetDetailModal, {
			asset: activeModalAsset,
			isOpen: isModalOpen,
			onClose: () => {
				setIsModalOpen(false);
				setSelectedAsset(null);
			},
			onUpdateAsset: onUpdateAsset || onUpdateAssetCondition,
			onUpdateCondition: onUpdateAsset || onUpdateAssetCondition,
			currentUser
		}));
	};
})();
const AssetExplorer = window.__AssetExplorer;
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
		const maintenanceSchedule = [
			{
				date: "Oktober 2026",
				title: "Jadwal Dry-Docking KM. Madidihang 03 (Poltek AUP)",
				facility: "Galangan Kapal Jakarta Port",
				status: "Terjadwal",
				type: "Docking Kapal"
			},
			{
				date: "November 2026",
				title: "Overhaul Total & Penggantian Turbocharger KM. Frans Kaisiepo (Sorong)",
				facility: "Dok & Galangan Kapal Sorong",
				status: "Mendesak (Prioritas Tinggi)",
				type: "Overhaul Darurat"
			},
			{
				date: "November 2026",
				title: "Audit & Kalibrasi Alat Lab Lingkungan (Poltek KP Sidoarjo)",
				facility: "Komite Akreditasi Nasional (KAN)",
				status: "Persiapan Berkas",
				type: "Kalibrasi ISO"
			},
			{
				date: "Desember 2026",
				title: "Penggantian Evaporator & Kompresor Cold Storage 30 Ton (Poltek AUP)",
				facility: "Teknisi Khusus Bitzer Refrigeration",
				status: "Verifikasi Teknis",
				type: "Refrigerasi"
			},
			{
				date: "Januari 2027",
				title: "Perbaikan Dermaga Apung & Gangway Pasir Putih (Poltek KP Pangandaran)",
				facility: "Kontraktor Maritim Jabar",
				status: "Usulan Prioritas",
				type: "Dermaga Latih"
			}
		];
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
		}, /* @__PURE__ */ React.createElement(Check, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ React.createElement("span", null, "Tandai Selesai Diperbaiki"))))), filteredUrgent.length === 0 && /* @__PURE__ */ React.createElement("div", { className: "col-span-2 bg-emerald-950/40 p-8 rounded-2xl border border-emerald-500/40 text-center space-y-2" }, /* @__PURE__ */ React.createElement(CheckCircle2, { className: "w-10 h-10 text-emerald-400 mx-auto" }), /* @__PURE__ */ React.createElement("h3", { className: "text-base font-bold text-white" }, "Seluruh Sarpras Kritis Telah Tertangani!"), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-slate-300 max-w-md mx-auto" }, "Tidak ada aset berstatus Rusak Berat atau sertifikat mati yang belum tertangani. Kelayakan operasional vokasi berjalan optimal."))), /* @__PURE__ */ React.createElement("div", { className: "bg-slate-800/90 rounded-2xl p-5 border border-slate-700/70 shadow-lg space-y-4" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", { className: "text-base font-bold text-white tracking-tight flex items-center gap-2" }, /* @__PURE__ */ React.createElement(Calendar, { className: "w-5 h-5 text-cyan-400" }), /* @__PURE__ */ React.createElement("span", null, "Jadwal Docking Kapal Latih & Pemeliharaan Berkala 2026/2027")), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-slate-400 mt-0.5" }, "Rencana aksi pemeliharaan preventif dan kuratif yang terjadwal pada galangan mitra dan balai pengujian.")), /* @__PURE__ */ React.createElement("span", { className: "text-xs px-2.5 py-1 rounded-lg bg-slate-900 text-slate-300 border border-slate-700" }, "5 Agenda Terjadwal")), /* @__PURE__ */ React.createElement("div", { className: "space-y-2.5 pt-2" }, maintenanceSchedule.map((item, idx) => /* @__PURE__ */ React.createElement("div", {
			key: idx,
			className: "bg-slate-900/70 p-3.5 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
		}, /* @__PURE__ */ React.createElement("div", { className: "flex items-start sm:items-center space-x-3" }, /* @__PURE__ */ React.createElement("div", { className: "w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center flex-shrink-0 text-cyan-400" }, /* @__PURE__ */ React.createElement(Ship, { className: "w-5 h-5" })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement("span", { className: "text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800" }, item.date), /* @__PURE__ */ React.createElement("span", { className: "text-[10px] text-slate-400" }, "• ", item.type)), /* @__PURE__ */ React.createElement("h4", { className: "text-xs font-bold text-white mt-0.5" }, item.title), /* @__PURE__ */ React.createElement("p", { className: "text-[11px] text-slate-400 mt-0.5" }, "Lokasi / Mitra: ", item.facility))), /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between sm:justify-end gap-3 text-xs" }, /* @__PURE__ */ React.createElement("span", { className: `px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap ${item.status.includes("Mendesak") ? "bg-rose-500/20 text-rose-300 border border-rose-500/40" : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"}` }, item.status)))))));
	};
})();
const EarlyWarningMaintenance = window.__EarlyWarningMaintenance;
// ============================================================================
// MODULE: src/components/AddAssetModal.jsx
// ============================================================================
(() => {
	const { useState } = React;
	const { X, PlusCircle, Building2, FileText, Coins, ShieldCheck, Wrench, Check, AlertCircle, GraduationCap } = window.__VENDOR__.Lucide;
	const { SATDIK_LIST, SARPRAS_CATEGORIES, PRODI_LIST, getCategoryForProdi, getProdisForCategory } = window.SARPRAS_DATA;
	window.__AddAssetModal = function AddAssetModal({ isOpen, onClose, onAddAsset }) {
		if (!isOpen) return null;
		const initialProdi = SATDIK_LIST[0]?.prodi?.[0] || "Semua Program Studi (Umum)";
		const initialCategory = getCategoryForProdi(initialProdi) || SARPRAS_CATEGORIES[0].id;
		const [formData, setFormData] = useState({
			name: "",
			satdikId: SATDIK_LIST[0].id,
			prodi: initialProdi,
			category: initialCategory,
			condition: "Baik",
			acquisitionYear: 2024,
			utilizationRate: 85,
			capacityDesc: "",
			specs: "",
			certificationStatus: "Tersertifikasi Aktif",
			certificationAuthority: "BKI / Hubla / KKP",
			estimatedRepairCost: 0,
			issuesSummary: "Kondisi aset baru beroperasi normal sesuai standar teknis operasional vokasi."
		});
		const [errorMsg, setErrorMsg] = useState("");
		const selectedSatdik = SATDIK_LIST.find((s) => s.id === formData.satdikId) || SATDIK_LIST[0];
		const campusProdis = selectedSatdik?.prodi || [];
		const handleChange = (e) => {
			const { name, value, type } = e.target;
			if (name === "satdikId") {
				const nextSatdik = SATDIK_LIST.find((s) => s.id === value);
				const nextProdis = nextSatdik?.prodi || [];
				const newProdi = nextProdis[0] || "Semua Program Studi (Umum)";
				const matchedCat = getCategoryForProdi(newProdi);
				setFormData((prev) => ({
					...prev,
					satdikId: value,
					prodi: newProdi,
					...matchedCat ? { category: matchedCat } : {}
				}));
				return;
			}
			if (name === "prodi") {
				const matchedCat = getCategoryForProdi(value);
				setFormData((prev) => ({
					...prev,
					prodi: value,
					...matchedCat ? { category: matchedCat } : {}
				}));
				return;
			}
			if (name === "category") {
				const catProdis = getProdisForCategory(value);
				let nextProdi = formData.prodi;
				if (catProdis.length > 0 && !catProdis.includes(formData.prodi)) {
					const campusMatch = campusProdis.find((p) => catProdis.includes(p));
					nextProdi = campusMatch || catProdis[0];
				} else if (catProdis.length === 0) {
					nextProdi = "Semua Program Studi (Umum)";
				}
				setFormData((prev) => ({
					...prev,
					category: value,
					prodi: nextProdi
				}));
				return;
			}
			setFormData((prev) => ({
				...prev,
				[name]: type === "number" ? Number(value) : value
			}));
		};
		const handleSubmit = (e) => {
			e.preventDefault();
			if (!formData.name.trim()) {
				setErrorMsg("Nama sarana/prasarana wajib diisi.");
				return;
			}
			const scoreMap = {
				"Baik": 92,
				"Rusak Ringan": 75,
				"Rusak Berat": 25
			};
			const urgencyMap = {
				"Baik": "Normal",
				"Rusak Ringan": "Normal",
				"Rusak Berat": "Kritis / Segera"
			};
			const newAsset = {
				id: `SAR-USR-${Date.now().toString().slice(-4)}`,
				satdikName: selectedSatdik ? selectedSatdik.name : "Satdik KKP",
				conditionScore: scoreMap[formData.condition] || 85,
				maintenanceUrgency: urgencyMap[formData.condition] || "Normal",
				lastMaintenanceDate: new Date().toISOString().slice(0, 10),
				nextMaintenanceDate: "2027-01-15",
				...formData,
				prodi: formData.prodi || campusProdis[0] || "Semua Program Studi (Umum)"
			};
			onAddAsset(newAsset);
			onClose();
		};
		return /* @__PURE__ */ React.createElement("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn" }, /* @__PURE__ */ React.createElement("div", {
			className: "bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl",
			onClick: (e) => e.stopPropagation()
		}, /* @__PURE__ */ React.createElement("div", { className: "bg-slate-800/90 px-6 py-4 border-b border-slate-700/80 flex items-center justify-between" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center space-x-3" }, /* @__PURE__ */ React.createElement("div", { className: "w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400" }, /* @__PURE__ */ React.createElement(PlusCircle, { className: "w-5 h-5" })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", { className: "text-base sm:text-lg font-bold text-white" }, "Tambah Data Sarana Prasarana"), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-slate-400" }, "Pencatatan aset baru pada Satuan Pendidikan Kementerian Kelautan dan Perikanan"))), /* @__PURE__ */ React.createElement("button", {
			onClick: onClose,
			className: "w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
		}, /* @__PURE__ */ React.createElement(X, { className: "w-5 h-5" }))), /* @__PURE__ */ React.createElement("form", {
			onSubmit: handleSubmit,
			className: "overflow-y-auto p-6 space-y-4 flex-1 scrollbar-thin scrollbar-thumb-slate-700 text-xs"
		}, errorMsg && /* @__PURE__ */ React.createElement("div", { className: "bg-rose-950/80 border border-rose-500 text-rose-300 p-2.5 rounded-xl flex items-center gap-2" }, /* @__PURE__ */ React.createElement(AlertCircle, { className: "w-4 h-4 text-rose-400" }), /* @__PURE__ */ React.createElement("span", null, errorMsg)), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "text-slate-300 font-semibold block mb-1" }, "Nama Sarana / Prasarana *"), /* @__PURE__ */ React.createElement("input", {
			type: "text",
			name: "name",
			required: true,
			value: formData.name,
			onChange: handleChange,
			placeholder: "Contoh: Kapal Latih KM. Nusantara Bahari 01 / Hatchery Udang Superintensif",
			className: "w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
		})), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "text-slate-300 font-semibold block mb-1" }, "Satuan Pendidikan (Satdik)"), /* @__PURE__ */ React.createElement("select", {
			name: "satdikId",
			value: formData.satdikId,
			onChange: handleChange,
			className: "w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
		}, SATDIK_LIST.map((s) => /* @__PURE__ */ React.createElement("option", {
			key: s.id,
			value: s.id
		}, s.shortName, " (", s.kota, ")")))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "text-slate-300 font-semibold block mb-1 flex items-center justify-between" }, /* @__PURE__ */ React.createElement("span", null, "Program Studi"), /* @__PURE__ */ React.createElement("span", { className: "text-[10px] text-cyan-400 font-normal" }, "(", campusProdis.length, " prodi kampus)")), /* @__PURE__ */ React.createElement("select", {
			name: "prodi",
			value: formData.prodi,
			onChange: handleChange,
			className: "w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500 truncate"
		}, /* @__PURE__ */ React.createElement("option", { value: "Semua Program Studi (Umum)" }, "Semua Program Studi (Umum / Fasilitas Bersama)"), campusProdis.length > 0 && /* @__PURE__ */ React.createElement("optgroup", { label: `Program Studi ${selectedSatdik.shortName}` }, campusProdis.map((p) => {
			const catId = getCategoryForProdi(p);
			const catName = SARPRAS_CATEGORIES.find((c) => c.id === catId)?.name;
			return /* @__PURE__ */ React.createElement("option", {
				key: p,
				value: p
			}, p, " ", catName ? `(${catName})` : "");
		})), /* @__PURE__ */ React.createElement("optgroup", { label: "Daftar 25 Program Studi Nasional" }, PRODI_LIST.filter((p) => !campusProdis.includes(p)).map((p) => {
			const catId = getCategoryForProdi(p);
			const catName = SARPRAS_CATEGORIES.find((c) => c.id === catId)?.name;
			return /* @__PURE__ */ React.createElement("option", {
				key: p,
				value: p
			}, p, " ", catName ? `(${catName})` : "");
		}))))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between mb-1" }, /* @__PURE__ */ React.createElement("label", { className: "text-slate-300 font-semibold block" }, "Bidang Sarpras"), formData.prodi && formData.prodi !== "Semua Program Studi (Umum)" && /* @__PURE__ */ React.createElement("span", { className: "text-[10px] text-cyan-400 bg-cyan-950/70 border border-cyan-800/50 px-2 py-0.5 rounded-full flex items-center gap-1 font-medium" }, /* @__PURE__ */ React.createElement(GraduationCap, { className: "w-3 h-3 text-cyan-400" }), /* @__PURE__ */ React.createElement("span", null, "Sesuai Prodi: ", formData.prodi))), /* @__PURE__ */ React.createElement("select", {
			name: "category",
			value: formData.category,
			onChange: handleChange,
			className: "w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
		}, SARPRAS_CATEGORIES.map((c) => /* @__PURE__ */ React.createElement("option", {
			key: c.id,
			value: c.id
		}, c.name, " ", c.prodis?.length > 0 ? `(${c.prodis.length} Prodi Terkait)` : "")))), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "text-slate-300 font-semibold block mb-1" }, "Kondisi Fisik Aset"), /* @__PURE__ */ React.createElement("select", {
			name: "condition",
			value: formData.condition,
			onChange: handleChange,
			className: "w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
		}, /* @__PURE__ */ React.createElement("option", { value: "Baik" }, "Baik (Layak)"), /* @__PURE__ */ React.createElement("option", { value: "Rusak Ringan" }, "Rusak Ringan"), /* @__PURE__ */ React.createElement("option", { value: "Rusak Berat" }, "Rusak Berat (Kritis)"))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "text-slate-300 font-semibold block mb-1" }, "Tingkat Utilisasi (%)"), /* @__PURE__ */ React.createElement("input", {
			type: "number",
			name: "utilizationRate",
			min: "0",
			max: "100",
			value: formData.utilizationRate,
			onChange: handleChange,
			className: "w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
		})), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "text-slate-300 font-semibold block mb-1" }, "Tahun Perolehan"), /* @__PURE__ */ React.createElement("input", {
			type: "number",
			name: "acquisitionYear",
			min: "1980",
			max: "2026",
			value: formData.acquisitionYear,
			onChange: handleChange,
			className: "w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
		}))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "text-slate-300 font-semibold block mb-1" }, "Kapasitas Desain Operasional"), /* @__PURE__ */ React.createElement("input", {
			type: "text",
			name: "capacityDesc",
			value: formData.capacityDesc,
			onChange: handleChange,
			placeholder: "Contoh: Daya Tampung 120 Taruna / 30 Ton Cold Storage / 200 GT Kapal",
			className: "w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
		})), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "text-slate-300 font-semibold block mb-1" }, "Spesifikasi Mesin / Teknis Terperinci"), /* @__PURE__ */ React.createElement("textarea", {
			name: "specs",
			rows: "2",
			value: formData.specs,
			onChange: handleChange,
			placeholder: "Detail mesin utama, dimensi, daya listrik, tipe peralatan, dll.",
			className: "w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
		})), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "text-slate-300 font-semibold block mb-1" }, "Catatan Kondisi / Analisis Teknis"), /* @__PURE__ */ React.createElement("textarea", {
			name: "issuesSummary",
			rows: "2",
			value: formData.issuesSummary,
			onChange: handleChange,
			className: "w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
		})), /* @__PURE__ */ React.createElement("div", { className: "pt-3 border-t border-slate-800 flex items-center justify-end gap-2" }, /* @__PURE__ */ React.createElement("button", {
			type: "button",
			onClick: onClose,
			className: "px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors"
		}, "Batal"), /* @__PURE__ */ React.createElement("button", {
			type: "submit",
			className: "inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold shadow-md shadow-cyan-900/40 transition-colors"
		}, /* @__PURE__ */ React.createElement(Check, { className: "w-4 h-4" }), /* @__PURE__ */ React.createElement("span", null, "Simpan ke Database"))))));
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
		}, /* @__PURE__ */ React.createElement(X, { className: "w-4 h-4" })), /* @__PURE__ */ React.createElement("div", { className: "flex items-center space-x-4" }, /* @__PURE__ */ React.createElement("div", { className: "w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 p-0.5 shadow-lg shadow-cyan-500/30 flex-shrink-0" }, /* @__PURE__ */ React.createElement("div", { className: "w-full h-full rounded-[14px] bg-slate-900 flex items-center justify-center text-white" }, /* @__PURE__ */ React.createElement(User, { className: "w-8 h-8 text-cyan-400" }))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { className: "px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/40" }, user.roleLabel), /* @__PURE__ */ React.createElement("h3", { className: "text-base sm:text-lg font-bold text-white mt-1 leading-snug" }, user.name), user.nip && user.nip !== "-" && /* @__PURE__ */ React.createElement("p", { className: "text-xs text-slate-400 font-mono" }, "NIP. ", user.nip)))), /* @__PURE__ */ React.createElement("div", { className: "p-6 space-y-4 text-xs" }, /* @__PURE__ */ React.createElement("div", { className: "bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 space-y-2" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { className: "text-slate-400 text-[10px] block" }, "Jabatan Kedinasan:"), /* @__PURE__ */ React.createElement("span", { className: "text-slate-200 font-semibold" }, user.jabatan)), /* @__PURE__ */ React.createElement("div", { className: "pt-2 border-t border-slate-800/60" }, /* @__PURE__ */ React.createElement("span", { className: "text-slate-400 text-[10px] block" }, "Unit Kerja:"), /* @__PURE__ */ React.createElement("span", { className: "text-cyan-300 font-medium" }, user.unitKerja))), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 gap-3" }, /* @__PURE__ */ React.createElement("div", { className: "bg-slate-950/70 p-3 rounded-xl border border-slate-800" }, /* @__PURE__ */ React.createElement("span", { className: "text-slate-400 text-[10px] block" }, "Email Kedinasan:"), /* @__PURE__ */ React.createElement("span", { className: "text-slate-200 font-medium truncate block mt-0.5" }, user.email)), /* @__PURE__ */ React.createElement("div", { className: "bg-slate-950/70 p-3 rounded-xl border border-slate-800" }, /* @__PURE__ */ React.createElement("span", { className: "text-slate-400 text-[10px] block" }, "Cakupan Wilayah:"), /* @__PURE__ */ React.createElement("span", { className: "text-emerald-400 font-bold block mt-0.5" }, user.accessibleSatdik === "ALL" ? "18 Satdik Nasional" : user.satdikName || "Kampus Khusus"))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { className: "text-slate-400 font-semibold block mb-2 uppercase text-[10px] tracking-wider" }, "Hak Akses Sistem (Permissions):"), /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap gap-1.5" }, user.permissions.map((perm, idx) => /* @__PURE__ */ React.createElement("span", {
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
// MODULE: src/App.jsx
// ============================================================================
(() => {
	const { useState, useEffect, useMemo } = React;
	const { SATDIK_LIST, SARPRAS_CATEGORIES } = window.SARPRAS_DATA;
	const { getFullSarprasData, calculateSarprasKPIs, normalizeCategory } = window.SARPRAS_DATA;
	const { apiCheckHealth, apiFetchAssets, apiCreateAsset, apiUpdateAsset } = window.SARPRAS_API;
	const { exportAssetsToExcel } = window.SARPRAS_EXCEL;
	const STORAGE_KEY = "kkp_sarpras_database_v2";
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
		// Load assets from localStorage or default dataset (fallback)
		const [assets, setAssets] = useState(() => {
			try {
				const saved = localStorage.getItem(STORAGE_KEY);
				if (saved) {
					const parsed = JSON.parse(saved);
					if (Array.isArray(parsed) && parsed.length > 0) {
						return parsed.map((a) => ({
							...a,
							category: normalizeCategory(a.category, a)
						}));
					}
				}
			} catch (e) {
				console.warn("Failed to load local storage, using initial dataset", e);
			}
			return getFullSarprasData();
		});
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
		// Pre-filter states for Explorer tab
		const [explorerSatdikFilter, setExplorerSatdikFilter] = useState("ALL");
		const [explorerCategoryFilter, setExplorerCategoryFilter] = useState("ALL");
		// Add Asset modal state
		const [isAddModalOpen, setIsAddModalOpen] = useState(false);
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
						const res = await apiFetchAssets();
						if (isMounted && res.success && res.data.length > 0) {
							const normalized = res.data.map((a) => ({
								...a,
								category: normalizeCategory(a.category, a)
							}));
							setAssets(normalized);
							try {
								localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
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
		// Save to localStorage when assets change (as cache/fallback)
		useEffect(() => {
			try {
				localStorage.setItem(STORAGE_KEY, JSON.stringify(assets));
			} catch (e) {
				console.warn("Failed to save to localStorage", e);
			}
		}, [assets]);
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
			// If operator of a specific campus, autofocus on that campus
			if (user.accessibleSatdik && user.accessibleSatdik !== "ALL") {
				setExplorerSatdikFilter(user.accessibleSatdik);
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
			return calculateSarprasKPIs(assets, SATDIK_LIST);
		}, [assets]);
		// Update asset handler (supports full update payload or legacy condition/notes)
		const handleUpdateAsset = async (assetId, payloadOrCondition, notes) => {
			let updatePayload = {};
			if (typeof payloadOrCondition === "object" && payloadOrCondition !== null) {
				updatePayload = { ...payloadOrCondition };
			} else {
				const newCondition = payloadOrCondition;
				const scoreMap = {
					"Baik": 92,
					"Rusak Ringan": 75,
					"Rusak Berat": 25
				};
				const urgencyMap = {
					"Baik": "Normal",
					"Rusak Ringan": "Normal",
					"Rusak Berat": "Kritis / Segera"
				};
				const target = assets.find((a) => a.id === assetId);
				const newCertStatus = newCondition === "Baik" && target?.certificationStatus === "Kadaluarsa" ? "Tersertifikasi Aktif" : target?.certificationStatus;
				const nowIso = new Date().toISOString().slice(0, 10);
				updatePayload = {
					condition: newCondition,
					conditionScore: scoreMap[newCondition] || target?.conditionScore || 80,
					maintenanceUrgency: urgencyMap[newCondition] || target?.maintenanceUrgency || "Normal",
					issuesSummary: notes !== undefined ? notes : target?.issuesSummary,
					lastMaintenanceDate: nowIso,
					certificationStatus: newCertStatus
				};
			}
			// Optimistic UI update
			setAssets((prev) => prev.map((a) => {
				if (a.id === assetId) {
					return {
						...a,
						...updatePayload
					};
				}
				return a;
			}));
			// Sinkronisasi ke MySQL Laragon
			if (dbStatus.connected) {
				await apiUpdateAsset(assetId, updatePayload);
			}
		};
		// Add new asset handler
		const handleAddAsset = async (newAsset) => {
			setAssets((prev) => [newAsset, ...prev]);
			// Sinkronisasi ke MySQL Laragon
			if (dbStatus.connected) {
				await apiCreateAsset(newAsset);
			}
		};
		// Quick navigation handlers
		const handleFilterCategoryAndNavigate = (categoryId) => {
			setExplorerCategoryFilter(categoryId);
			setExplorerSatdikFilter("ALL");
			handleTabChange("explorer");
		};
		const handleSelectSatdikAndNavigate = (satdikId) => {
			setExplorerSatdikFilter(satdikId);
			setExplorerCategoryFilter("ALL");
			handleTabChange("explorer");
		};
		// Export Excel handler dengan format tabel rapi, kop KKP, dan formula
		const handleExportExcel = () => {
			exportAssetsToExcel(assets, {
				currentUser,
				filterSatdikName: currentUser?.accessibleSatdik === "ALL" ? "Seluruh Satuan Pendidikan (18 Kampus Vokasi KKP)" : currentUser?.satdikName || "Kampus Khusus",
				filterCategoryName: "Semua Bidang Sarpras",
				filenamePrefix: "SARPRAS_KKP_Inventaris_Lengkap"
			});
		};
		// If user is not authenticated, show the official government Login Portal
		if (!currentUser) {
			return /* @__PURE__ */ React.createElement(LoginScreen, { onLogin: handleLogin });
		}
		return /* @__PURE__ */ React.createElement("div", { className: "min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-white" }, /* @__PURE__ */ React.createElement(Navbar, {
			activeTab,
			setActiveTab: handleTabChange,
			totalAssets: kpis?.totalAssets || 0,
			criticalCount: kpis?.urgentAssets?.length || 0,
			onOpenAddModal: () => setIsAddModalOpen(true),
			onExportExcel: handleExportExcel,
			onExportCSV: handleExportExcel,
			currentUser,
			onOpenProfile: () => setIsProfileModalOpen(true),
			onLogout: handleLogout,
			dbStatus
		}), currentUser.accessibleSatdik && currentUser.accessibleSatdik !== "ALL" && /* @__PURE__ */ React.createElement("div", { className: "bg-cyan-950/70 border-b border-cyan-800/50 py-2 px-4 text-xs text-cyan-200" }, /* @__PURE__ */ React.createElement("div", { className: "max-w-7xl mx-auto flex items-center justify-between" }, /* @__PURE__ */ React.createElement("span", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement("span", { className: "w-2 h-2 rounded-full bg-cyan-400 animate-ping" }), /* @__PURE__ */ React.createElement("span", null, "Mode Operator Kampus Aktif: ", /* @__PURE__ */ React.createElement("strong", null, currentUser.satdikName), ". Data terfokus pada satdik Anda.")), /* @__PURE__ */ React.createElement("button", {
			onClick: () => {
				setExplorerSatdikFilter(currentUser.accessibleSatdik);
				handleTabChange("explorer");
			},
			className: "underline text-cyan-300 hover:text-white font-medium text-[11px]"
		}, "Lihat Sarpras Kampus Saya"))), /* @__PURE__ */ React.createElement("main", { className: "flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6 mobile-main-container pb-24 md:pb-8" }, activeTab === "dashboard" && /* @__PURE__ */ React.createElement(ExecutiveDashboard, {
			kpis,
			onNavigateTab: handleTabChange,
			onFilterCategory: handleFilterCategoryAndNavigate,
			onSelectSatdik: handleSelectSatdikAndNavigate
		}), activeTab === "map" && /* @__PURE__ */ React.createElement(GeospatialMap, {
			satdikBreakdown: kpis.satdikBreakdown,
			onSelectSatdikForExplorer: handleSelectSatdikAndNavigate
		}), activeTab === "explorer" && /* @__PURE__ */ React.createElement(AssetExplorer, {
			assets,
			initialSatdikFilter: explorerSatdikFilter,
			initialCategoryFilter: explorerCategoryFilter,
			onUpdateAsset: handleUpdateAsset,
			onUpdateAssetCondition: handleUpdateAsset,
			currentUser
		}), activeTab === "maintenance" && /* @__PURE__ */ React.createElement(EarlyWarningMaintenance, {
			urgentAssets: kpis.urgentAssets,
			onResolveAsset: handleUpdateAsset
		})), /* @__PURE__ */ React.createElement(AddAssetModal, {
			isOpen: isAddModalOpen,
			onClose: () => setIsAddModalOpen(false),
			onAddAsset: handleAddAsset
		}), /* @__PURE__ */ React.createElement(UserProfileModal, {
			user: currentUser,
			isOpen: isProfileModalOpen,
			onClose: () => setIsProfileModalOpen(false),
			onLogout: handleLogout
		}), /* @__PURE__ */ React.createElement(MobileBottomNav, {
			activeTab,
			setActiveTab: handleTabChange,
			criticalCount: kpis?.urgentAssets?.length || 0,
			onOpenAddModal: () => setIsAddModalOpen(true),
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
