<!doctype html>
<html lang="id" class="light">
  <head>
    <meta charset="UTF-8" />
    <meta name="csrf-token" content="{{ csrf_token() }}" />
    <link rel="icon" type="image/png" href="{{ asset('assets/logo-kkp.png') }}" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="color-scheme" content="light dark" />
    <meta name="theme-color" content="#f1f5f9" />
    <!-- Anti-flash: terapkan tema tersimpan SEBELUM halaman dilukis (mencegah kedip gelap saat mode terang) -->
    <script>
      (function () {
        var t = "light";
        try { var s = localStorage.getItem("kkp_theme_mode_v2"); if (s === "light" || s === "dark") t = s; } catch (e) {}
        var r = document.documentElement;
        r.classList.remove("light", "dark");
        r.classList.add(t);
        r.style.colorScheme = t;
        var m = document.querySelector('meta[name="theme-color"]');
        if (m) m.setAttribute("content", t === "light" ? "#f1f5f9" : "#0f172a");
      })();
    </script>
    <title>Sarana dan Prasarana Satuan Pendidikan KP | Analitik Data Sarana &amp; Prasarana Pendidikan Kelautan dan Perikanan</title>
    <meta name="description" content="Sistem Informasi &amp; Analitik Data Sarana dan Prasarana (Sarpras) pada Satuan Pendidikan Kementerian Kelautan dan Perikanan Republik Indonesia." />
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
    <meta http-equiv="Pragma" content="no-cache" />
    <meta http-equiv="Expires" content="0" />
    <!-- Google Fonts: Plus Jakarta Sans & JetBrains Mono -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
    <!-- Stylesheets: Tailwind CSS + Leaflet GIS + Custom Style -->
    <link rel="stylesheet" href="{{ asset('assets/css/tailwind.min.css') }}?v=20261109_12" />
    <link rel="stylesheet" href="{{ asset('assets/css/leaflet.css') }}?v=20261109_12" />
    <link rel="stylesheet" href="{{ asset('assets/css/style.css') }}?v=20261127_02" />
  </head>
  <body class="bg-slate-900 text-slate-100 antialiased selection:bg-cyan-500 selection:text-white">
    <div id="root"></div>

    <script>window.__LOGO_KKP = @json(asset('assets/logo-kkp.png'));</script>
    <script src="{{ asset('assets/vendor/react-vendor.min.js') }}"></script>
    <script src="{{ asset('assets/vendor/leaflet.js') }}"></script>
    <script src="{{ asset('assets/vendor/xlsx.bundle.js') }}"></script>
    <script src="{{ asset('assets/vendor/core-bundle.min.js') }}?v=20261127_02"></script>
    <script src="{{ asset('assets/app.js') }}?v=20261127_03"></script>
    <!-- Vercel Web Analytics (@vercel/analytics v2.0.1) — aktif otomatis pada domain produksi Vercel -->
    <script>
      (function () {
        window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
        var h = window.location.hostname;
        var isLocal = h === "localhost" || h === "127.0.0.1" || /\.test$|\.local$/i.test(h);
        if (!isLocal) {
          var s = document.createElement("script");
          s.defer = true;
          s.src = "/_vercel/insights/script.js";
          s.dataset.sdkn = "@vercel/analytics/react";
          s.dataset.sdkv = "2.0.1";
          document.head.appendChild(s);
        }
      })();
    </script>
  </body>
</html>
