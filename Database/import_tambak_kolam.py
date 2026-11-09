#!/usr/bin/env python3
"""
Generate dataset Prasarana dan Sarana Tambak dan Kolam Satuan Pendidikan KKP (Tahun 2025)
Sumber: Excel/1c-Data Tambak dan Kolam Satuan Pendidikan.pdf (26 Halaman, 18 Satdik)
Outputs:
  - Database/tambak_data.json
  - Services/tambak-data.js (window.SARPRAS_TAMBAK)
"""

import json
import re
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
JSON_OUT = BASE_DIR / "Database" / "tambak_data.json"
JS_OUT = BASE_DIR / "Services" / "tambak-data.js"

SATDIK_META = [
    ("poltek-aup", "Politeknik AUP", "AUP", "Politeknik", "Kampus Serang & Kampus Bogor", "16 KVA (Modul I, II, IV) & 8 KVA (Modul III)"),
    ("poltek-kp-sidoarjo", "Politeknik KP Sidoarjo", "SID", "Politeknik", "Kampus PKP Sidoarjo, SLP Lamongan & SLP Pasuruan", "Tersedia Kampus Sidoarjo, 40 KVA (Lamongan), 105 KVA (Pasuruan)"),
    ("poltek-kp-bitung", "Politeknik KP Bitung", "BIT", "Politeknik", "Kampus PKP Bitung (Ex SUPM)", "Tidak ada"),
    ("poltek-kp-sorong", "Politeknik KP Sorong", "SOR", "Politeknik", "Kampus PKP Sorong", "Tersedia pada 5 unit (Tambak 1-3, IPBAT, IPBAL)"),
    ("poltek-kp-karawang", "Politeknik KP Karawang", "KRW", "Politeknik", "Kampus PKP Karawang", "8 KVA (Tandon, L11, L16, L17)"),
    ("poltek-kp-bone", "Politeknik KP Bone", "BON", "Politeknik", "Kampus 1 & Lokasi Mallari", "60 KVA (Kampus 1) & 100 KVA (Mallari)"),
    ("poltek-kp-kupang", "Politeknik KP Kupang", "KPG", "Politeknik", "Lingkungan TEFA PKP Kupang", "Ada instalasi listrik (Unit 1-8)"),
    ("poltek-kp-dumai", "Politeknik KP Dumai", "DUM", "Politeknik", "Kampus PKP Dumai", "Tidak ada"),
    ("poltek-kp-pangandaran", "Politeknik KP Pangandaran", "PND", "Politeknik", "Kampus PKP Pangandaran & Lahan Sewa Koperasi", "197 KVA (Jaringan Kampus) & 50 KVA (Jaringan Koperasi)"),
    ("poltek-kp-jembrana", "Politeknik KP Jembrana", "JMB", "Politeknik", "Kampus PKP Jembrana (Outdoor, Semi Outdoor, Indoor)", "345 KVA (Jaringan Kampus) & 33 KVA (Jaringan Koperasi)"),
    ("akkp-wakatobi", "AK-KP Wakatobi", "WKT", "Akademi Komunitas", "Kampus AK-KP Wakatobi", "Tidak ada"),
    ("supm-ladong", "SUPM Ladong", "LDG", "SUPM", "Sertipikat Tanah No. 1 & No. 21 (Tefa Air Tawar / Lab Basah)", "Tersedia instalasi listrik di seluruh unit"),
    ("supm-pariaman", "SUPM Pariaman", "PRM", "SUPM", "Lingkungan Kampus SUPM Pariaman", "Tersedia pada Kolam Ikan Air Payau (TEFA)"),
    ("supm-kotaagung", "SUPM Kota Agung", "KTA", "SUPM", "Lingkungan Kampus SUPM Kota Agung", "Tersedia Daya Listrik 105 KWh"),
    ("supm-tegal", "SUPM Tegal", "TGL", "SUPM", "Sertipikat No. 138, 139, 140 & Kec. Lebaksiu Tegal", "17.900 Watt (Tambak 15) & 7.700 Watt (Kolam Lebaksiu)"),
    ("supm-waiheru", "SUPM Waiheru", "WHR", "SUPM", "Kompleks SUPM Waiheru Ambon & Desa Kairatu SBB", "Digabung listrik kantor (Ambon) & 16.500 Watt (Desa Kairatu)"),
    ("supm-pontianak", "SUPM Pontianak", "PTK", "SUPM", "Desa Purun Kecil (Sungai Pinyuh) & Desa Kepayang (Anjongan)", "13.200 VA (Tambak Purun Kecil) & 3.950 VA (Kolam Kepayang)"),
    ("supm-sorong", "SUPM Sorong", "SSR", "SUPM", "Kompleks SUPM Sorong", "Instalasi Asrama SPP Neg-1 (S1 / 2.200 VA)"),
]


def dms_to_maps_url(dms_str: str) -> str:
    s = dms_str.strip()
    if s.startswith("http://") or s.startswith("https://"):
        return s
    # Match decimal coordinates like "1.458236, 125.213981" or "-0.56713, 100.09289"
    m_dec = re.match(r"^([+-]?\d+(?:\.\d+)?)\s*,\s*([+-]?\d+(?:\.\d+)?)$", s)
    if m_dec:
        lat, lon = m_dec.group(1), m_dec.group(2)
        return f"https://www.google.com/maps/search/?api=1&query={lat},{lon}"
    # Fallback query search for DMS or coordinate strings
    from urllib.parse import quote
    return f"https://www.google.com/maps/search/?api=1&query={quote(s)}"


def classify_jenis(nama: str, fungsi: str = "") -> str:
    nl = nama.lower()
    fl = fungsi.lower()
    if "tandon" in nl or ("tandon" in fl and "tambak" not in nl and "kolam" not in nl):
        return "Tandon"
    if nl.startswith("tambak"):
        if "tandon" in nl:
            return "Tandon"
        return "Tambak"
    if nl.startswith("tefa busmetik") or nl.startswith("sfv") or nl.startswith("koperasi"):
        return "Tambak"
    if "bak " in nl or nl.startswith("bak") or "biofloc" in nl:
        return "Bak / Biofloc"
    if "kolam" in nl:
        return "Kolam"
    return "Tambak"


def classify_status_operasional(kondisi: str, fungsi: str, keterangan: str = "", nama: str = "") -> str:
    fl = (fungsi or "").lower()
    kl = (kondisi or "").lower()
    ketl = (keterangan or "").lower()
    nl = (nama or "").lower()
    if "koperasi" in nl or "koperasi" in ketl or "sewa" in fl:
        return "Koperasi / Sewa"
    if "tandon" in fl or "tandon" in nl or "resapan" in fl or "lokasi kampus" in fl:
        return "Tandon / Pendukung"
    if (
        "tidak dimanfaatkan" in fl
        or "tidak berfungsi" in fl
        or "tidak difungsikan" in fl
        or "belum dimanfaatkan" in fl
        or "belum di manfaatkan" in fl
        or "belum dibanfaatkan" in fl
        or "belum operasional" in fl
        or "ex-budidaya" in fl
    ):
        if "rusak" in kl or "rusak" in fl or "tidak berfungsi" in fl or "tidak difungsikan" in fl:
            return "Rusak / Tidak Berfungsi"
        return "Belum Dimanfaatkan"
    if "rusak berat" in kl and ("tidak" in fl or "belum" in fl):
        return "Rusak / Tidak Berfungsi"
    return "Aktif Budidaya"


def normalize_pelataran(p: str) -> str:
    pl = (p or "").strip()
    if not pl or pl == "-":
        return "Tanah"
    u = pl.upper()
    if "HDPE" in u or "HDFE" in u or "GEOMEMBRAN" in u:
        if "BETON" in u:
            return "Beton HDPE"
        if "SETENGAH" in u:
            return "Setengah HDPE"
        return "HDPE"
    if "BETON" in u or "SEMEN" in u or "RABATAN" in u:
        return pl
    if "FIBER" in u:
        return "Fiber"
    if "TERPAL" in u:
        return "Terpal"
    return pl


def build_raw_units():
    units = []

    def add(satdik_id, no, nama, luas_m2, kondisi, fungsi, pelataran, listrik, kincir, jml_kincir, lokasi_label, map_url, keterangan, kampus_lokasi="", luas_label=None):
        units.append({
            "satdikId": satdik_id,
            "noUrut": no,
            "nama": nama,
            "jenis": classify_jenis(nama, fungsi),
            "kampusLokasi": kampus_lokasi or keterangan or "-",
            "luasM2": float(luas_m2),
            "luasLabel": luas_label if luas_label is not None else (f"{luas_m2:,.2f}".replace(",", "X").replace(".", ",").replace("X", ".").rstrip("0").rstrip(",") + " m2" if luas_m2 > 0 else "-"),
            "kondisi": kondisi,
            "fungsi": fungsi,
            "statusOperasional": classify_status_operasional(kondisi, fungsi, keterangan, nama),
            "pelataran": pelataran,
            "pelataranKategori": (
                "HDPE / Geomembran" if any(k in pelataran.upper() for k in ["HDPE", "HDFE", "GEOMEMBRAN"])
                else "Beton / Semen" if any(k in pelataran.upper() for k in ["BETON", "SEMEN", "RABATAN"])
                else "Fiber / Terpal" if any(k in pelataran.upper() for k in ["FIBER", "TERPAL"])
                else "Tanah"
            ),
            "listrik": listrik if listrik else "-",
            "kincir": kincir if kincir else "-",
            "jumlahKincir": int(jml_kincir),
            "lokasiLabel": lokasi_label,
            "mapUrl": map_url,
            "keterangan": keterangan,
        })

    # =========================================================================
    # 1. POLITEKNIK AUP (30 Unit - Hal 1-2)
    # =========================================================================
    aup_serang_url = "https://earth.google.com/web/@-6.0272597,106.16082304,1.28369367a,1107.73989295d,35y,0.00000002h,7.76283155t,0r"
    aup_bogor_url = "https://earth.google.com/web/@-6.60303275,106.78888093,243.15793569a,286.23459096d,30y,0h,0t,0r"
    aup_serang = [
        (1, "Tambak Modul I (4 Petak / @ 600 m2)", 2400, "Baik", "Budidaya Vannamei (TEFA)", "HDPE", "16 KVA", "12 unit @1HP 3 phase", 12),
        (2, "Tambak Modul II (4 Petak / @ 1.000 m2)", 4000, "Baik", "Budidaya Vannamei (TEFA)", "HDPE", "16 KVA", "16 Unit @1HP 3 phase", 16),
        (3, "Tambak Modul III (2 Petak / @ 600 m2)", 1200, "Baik", "Budidaya Vannamei (TEFA)", "HDPE", "8 KVA", "6 Unit @1HP 3 phase", 6),
        (4, "Tambak Modul IV (4 Petak / @ 600 m2)", 2400, "Baik", "Budidaya Vannamei (TEFA)", "HDPE", "16 KVA", "12 unit @1HP 3 phase", 12),
        (5, "Tandon modul 3", 300, "Baik", "Budidaya Bandeng", "Tanah", "Jaringan Listrik modul 3", "1 Unit kincir @ 1HP 3 phase", 1),
        (6, "Tandon modul 2 (2 Petak / @ 2.000 m2)", 4000, "Baik", "Budidaya Bandeng", "HDPE", "Jaringan Listrik modul 2", "1 Unit kincir @ 1HP 3 phase", 1),
        (7, "Tandon utama", 10000, "Baik", "Budidaya Bandeng", "Tanah", "Belum ada jaringan listrik", "Tidak ada kincir", 0),
        (8, "Tambak tradisional (4 Petak / @ 1.000 m2)", 4000, "Baik", "Budidaya Bandeng", "Tanah", "Belum ada jaringan listrik", "Tidak ada kincir", 0),
        (9, "Tambak tradisional", 5000, "Baik", "Budidaya Bandeng", "Tanah", "Belum ada jaringan listrik", "Tidak ada kincir", 0),
        (10, "Tambak tradisional Silvofishery", 1000, "Baik", "Budidaya Bandeng", "Tanah", "Belum ada jaringan listrik", "Tidak ada kincir", 0),
    ]
    for no, nama, luas, kond, fungsi, pel, lis, kin, jkin in aup_serang:
        add("poltek-aup", no, nama, luas, kond, fungsi, pel, lis, kin, jkin, "Lokasi Tanah AUP di Kampus Serang", aup_serang_url, "Lokasi dalam lingkungan kampus Serang", "Kampus Serang")

    aup_bogor = [
        (11, "Kolam A1", 150, "Baik", "Budidaya Ikan Nila", "HDPE"),
        (12, "Kolam A2", 81, "Baik", "Budidaya Ikan Nila", "HDPE"),
        (13, "Kolam A3", 81, "Baik", "Budidaya Ikan Nila", "Tanah"),
        (14, "Kolam A4", 108, "Baik", "Budidaya Ikan Nila", "Tanah"),
        (15, "Kolam A5", 158, "Baik", "Budidaya Ikan Nila", "Tanah"),
        (16, "Kolam A6", 298, "Baik", "Belum dimanfaatkan", "Tanah"),
        (17, "Kolam B1", 226, "Baik", "Budidaya Ikan Lele", "HDPE"),
        (18, "Kolam B2", 114, "Baik", "Budidaya Ikan Lele", "HDPE"),
        (19, "Kolam B3", 106, "Baik", "Belum dimanfaatkan", "HDPE"),
        (20, "Kolam B4", 93, "Baik", "Belum dimanfaatkan", "Tanah"),
        (21, "Kolam B5", 98, "Baik", "Budidaya Ikan Mas", "Tanah"),
        (22, "Kolam B6", 181, "Baik", "Belum dimanfaatkan", "Tanah"),
        (23, "Kolam C1", 293, "Baik", "Tidak dimanfaatkan (Rusak)", "HDPE"),
        (24, "Kolam C2", 188, "Baik", "Budidaya Ikan Lele", "HDPE"),
        (25, "Kolam C3", 208, "Baik", "Budidaya Ikan Nila", "Tanah"),
        (26, "Kolam C4", 184, "Baik", "Budidaya Ikan Nila", "Tanah"),
        (27, "Kolam C5", 249, "Rusak Berat", "Tidak dimanfaatkan (Rusak)", "Tanah"),
        (28, "Kolam D1", 86, "Rusak Berat", "Tidak dimanfaatkan (Rusak Berat)", "Tanah"),
        (29, "Kolam D2", 32, "Rusak Berat", "Tidak dimanfaatkan (Rusak Berat)", "Tanah"),
        (30, "Kolam D3", 96, "Rusak Berat", "Tidak dimanfaatkan (Rusak Berat)", "Tanah"),
    ]
    for no, nama, luas, kond, fungsi, pel in aup_bogor:
        add("poltek-aup", no, nama, luas, kond, fungsi, pel, "Tidak ada Instalasi Listrik ke Kolam", "Tidak ada kincir", 0, "Kampus AUP Kolam di Bogor", aup_bogor_url, "Lokasi dalam lingkungan kampus Bogor", "Kampus Bogor")

    # =========================================================================
    # 2. POLITEKNIK KP SIDOARJO (49 Unit - Hal 3-4)
    # =========================================================================
    sidoarjo_kampus = [
        (1, "Tambak 1", 2313, "Baik", "Kolam Pancing 1 : Nila + Patin", "Tanah", "Tersedia Daya Listrik", "12 unit @1HP 3 phase", 12, "7°23'51\"S 112°47'31\"E"),
        (2, "Tambak 2", 1878, "Baik", "Kolam Pancing 2 : Nila + Patin", "Tanah", "Tersedia Daya Listrik", "16 Unit @1HP 3 phase", 16, "7°23'53\"S 112°47'30\"E"),
        (3, "Tambak 3", 1679, "Baik", "Kolam Pancing 3 : Nila + Patin", "Tanah", "Tersedia Daya Listrik", "6 Unit @1HP 3 phase", 6, "7°23'52\"S 112°47'29\"E"),
        (4, "Tambak 4", 1679, "Baik", "Kolam Transit", "Tanah", "Tersedia Daya Listrik", "12 unit @1HP 3 phase", 12, "7°23'50\"S 112°47'29\"E"),
        (5, "Tambak 5", 0, "Baik", "Kolam Tandon Air", "Tanah", "Belum Tersedia", "-", 0, "7°23'52\"S 112°47'27\"E"),
        (6, "Tambak 6", 0, "Baik", "Kolam Induk Nila Nirwana", "Tanah", "Belum Tersedia", "-", 0, "7°23'52\"S 112°47'26\"E"),
        (7, "Tambak 7", 0, "Baik", "Kolam Pembesaran Nila", "Tanah", "Belum Tersedia", "-", 0, "7°23'52\"S 112°47'26\"E"),
        (8, "Tambak 8", 0, "Baik", "Kolam Pembesaran Nila", "Tanah", "Belum Tersedia", "-", 0, "7°23'51\"S 112°47'26\"E"),
        (9, "Tambak 9", 0, "Baik", "Kolam Pembesaran Bawal + Patin", "Tanah", "Belum Tersedia", "-", 0, "7°23'50\"S 112°47'25\"E"),
        (10, "Tambak 10", 500, "Baik", "Kolam Kafe", "HDPE Geomembran", "Tersedia Daya Listrik", "Ada", 1, "7°23'50\"S 112°47'25\"E"),
        (11, "Tambak 11", 0, "Baik", "Kolam Polikultur", "Tanah", "Belum Tersedia", "Ada", 1, "7°23'50\"S 112°47'25\"E"),
    ]
    for no, nama, luas, kond, fungsi, pel, lis, kin, jkin, dms in sidoarjo_kampus:
        add("poltek-kp-sidoarjo", no, nama, luas, kond, fungsi, pel, lis, kin, jkin, dms, dms_to_maps_url(dms), "Kampus PKP Sidoarjo", "Kampus PKP Sidoarjo")

    lamongan_rows = [
        (12, "Kolam 1", 12, "Bak Tandon Outdoor", "6°52'17\"S 112°22'11\"E"),
        (13, "Kolam 2", 12, "Bak Tandon Outdoor", "6°52'17\"S 112°22'11\"E"),
        (14, "Kolam 3", 12, "Bak Tandon Outdoor", "6°52'16\"S 112°22'11\"E"),
        (15, "Kolam 4", 12, "Bak Tandon Outdoor", "6°52'16\"S 112°22'11\"E"),
        (16, "Kolam 5", 12, "Bak Tandon Outdoor", "6°52'17\"S 112°22'10\"E"),
        (17, "Kolam 6", 12, "Bak Tandon Outdoor", "6°52'17\"S 112°22'10\"E"),
        (18, "Kolam 7", 12, "Bak Tandon Outdoor", "6°52'16\"S 112°22'11\"E"),
        (19, "Kolam 8", 12, "Bak Tandon Outdoor", "6°52'16\"S 112°22'11\"E"),
        (20, "Kolam 9", 6, "Bak Pendederan", "6°52'16\"S 112°22'10\"E"),
        (21, "Kolam 10", 6, "Bak Pendederan", "6°52'16\"S 112°22'10\"E"),
        (22, "Kolam 11", 6, "Bak Pendederan", "6°52'16\"S 112°22'10\"E"),
        (23, "Kolam 12", 81, "Bak Tandon", "6°52'16\"S 112°22'10\"E"),
        (24, "Kolam 13", 81, "Bak Tandon", "6°52'16\"S 112°22'10\"E"),
    ]
    for no, nama, luas, fungsi, dms in lamongan_rows:
        add("poltek-kp-sidoarjo", no, nama, luas, "Baik", fungsi, "Rabatan Biasa", "Tersedia Daya Listrik 40 KVA", "-", 0, dms, dms_to_maps_url(dms), "SLP Lamongan", "SLP Lamongan")

    pasuruan_rows = [
        (25, "Tambak 1 (SLP Pasuruan)", 5000, "Kawasan Mangrove", "Tanah", "Belum Tersedia", "-", 0, "7°35'56\"S 112°51'51\"E"),
        (26, "Tambak 2 (SLP Pasuruan)", 5000, "Kawasan Mangrove", "Tanah", "Belum Tersedia", "-", 0, "7°35'55\"S 112°51'48\"E"),
        (27, "Tambak 3 (SLP Pasuruan)", 5000, "Budidaya Bandeng Tradisional", "Tanah", "Tersedia Daya Listrik 105 KVA", "-", 0, "7°35'54\"S 112°51'57\"E"),
        (28, "Tambak 4 (SLP Pasuruan)", 5000, "Budidaya Bandeng Tradisional", "Tanah", "Tersedia Daya Listrik 105 KVA", "-", 0, "7°35'54\"S 112°51'55\"E"),
        (29, "Tambak 5 (SLP Pasuruan)", 5000, "Kawasan Mangrove", "Tanah", "Belum Tersedia", "-", 0, "7°35'53\"S 112°51'52\"E"),
        (30, "Tambak 6 (SLP Pasuruan)", 5000, "Kawasan Mangrove", "Tanah", "Belum Tersedia", "-", 0, "7°35'53\"S 112°51'50\"E"),
        (31, "Tambak 7 (SLP Pasuruan)", 5000, "Budidaya Bandeng Tradisional", "Tanah", "Tersedia Daya Listrik 105 KVA", "-", 0, "7°35'52\"S 112°51'58\"E"),
        (32, "Tambak 8 (SLP Pasuruan)", 5000, "Budidaya Bandeng Tradisional", "Tanah", "Tersedia Daya Listrik 105 KVA", "-", 0, "7°35'51\"S 112°51'55\"E"),
        (33, "Tambak 9 (SLP Pasuruan)", 5000, "Budidaya Bandeng Tradisional", "Tanah", "Tersedia Daya Listrik 105 KVA", "-", 0, "7°35'51\"S 112°51'53\"E"),
        (34, "Tambak 10 (SLP Pasuruan)", 5000, "Kawasan Mangrove", "Tanah", "Belum Tersedia", "-", 0, "7°35'50\"S 112°51'50\"E"),
        (35, "Tambak 11 (SLP Pasuruan)", 5000, "Kawasan Mangrove", "Tanah", "Belum Tersedia", "-", 0, "7°35'50\"S 112°51'48\"E"),
        (36, "Tambak 12 (SLP Pasuruan)", 5000, "Budidaya Udang Vannamei Modern", "HDPE Geomembran", "Tersedia Daya Listrik 105 KVA", "-", 0, "7°35'51\"S 112°52'06\"E"),
        (37, "Tambak 13 (SLP Pasuruan)", 5000, "Budidaya Udang Vannamei Modern", "HDPE Geomembran", "Tersedia Daya Listrik 105 KVA", "Ada", 1, "7°35'50\"S 112°52'03\"E"),
        (38, "Tambak 14 (SLP Pasuruan)", 5000, "Budidaya Udang Vannamei Modern", "HDPE Geomembran", "Tersedia Daya Listrik 105 KVA", "Ada", 1, "7°35'50\"S 112°52'01\"E"),
        (39, "Tambak 15 (SLP Pasuruan)", 5000, "Budidaya Udang Vannamei Modern", "HDPE Geomembran", "Tersedia Daya Listrik 105 KVA", "Ada", 1, "7°35'49\"S 112°51'58\"E"),
        (40, "Tambak 16 (SLP Pasuruan)", 5000, "Budidaya Tradisional", "Tanah", "Tersedia Daya Listrik 105 KVA", "-", 0, "7°35'49\"S 112°51'56\"E"),
        (41, "Tambak 17 (SLP Pasuruan)", 5000, "Kawasan Mangrove", "Tanah", "Belum Tersedia", "-", 0, "7°35'48\"S 112°51'53\"E"),
        (42, "Tambak 18 (SLP Pasuruan)", 5000, "Kawasan Mangrove", "Tanah", "Belum Tersedia", "-", 0, "7°35'48\"S 112°51'51\"E"),
        (43, "Tambak 19 (SLP Pasuruan)", 5000, "Budidaya Bandeng Tradisional", "Tanah", "Tersedia Daya Listrik 105 KVA", "-", 0, "7°35'47\"S 112°52'07\"E"),
        (44, "Tambak 20a (SLP Pasuruan)", 2500, "Budidaya Udang Vannamei Modern", "HDPE", "Tersedia Daya Listrik 105 KVA", "-", 0, "7°35'48\"S 112°52'05\"E"),
        (45, "Tambak 20b (SLP Pasuruan)", 2500, "Budidaya Udang Vannamei Modern", "HDPE", "Tersedia Daya Listrik 105 KVA", "-", 0, "7°35'47\"S 112°52'03\"E"),
        (46, "Tambak 21 (SLP Pasuruan)", 5000, "Budidaya Bandeng Tradisional", "Tanah", "Tersedia Daya Listrik 105 KVA", "-", 0, "7°35'46\"S 112°52'01\"E"),
        (47, "Tambak 22 (SLP Pasuruan)", 5000, "Budidaya Bandeng Tradisional", "Tanah", "Tersedia Daya Listrik 105 KVA", "-", 0, "7°35'46\"S 112°51'59\"E"),
        (48, "Tambak 23 (SLP Pasuruan)", 5000, "Budidaya Bandeng Tradisional", "Tanah", "Tersedia Daya Listrik 105 KVA", "-", 0, "7°35'46\"S 112°51'57\"E"),
        (49, "Tambak 24 (SLP Pasuruan)", 5000, "Kawasan Mangrove", "Tanah", "Belum Tersedia", "-", 0, "7°35'45\"S 112°51'54\"E"),
    ]
    for no, nama, luas, fungsi, pel, lis, kin, jkin, dms in pasuruan_rows:
        add("poltek-kp-sidoarjo", no, nama, luas, "Baik", fungsi, pel, lis, kin, jkin, dms, dms_to_maps_url(dms), "SLP Pasuruan", "SLP Pasuruan")

    # =========================================================================
    # 3. POLITEKNIK KP BITUNG (2 Unit - Hal 5)
    # =========================================================================
    add(
        "poltek-kp-bitung", 1, "Kolam Air Tawar Bawah", 295, "Rusak Berat", "Tidak berfungsi", "Tanah", "Tidak ada", "Tidak ada", 0,
        "1.458236, 125.213981", dms_to_maps_url("1.458236, 125.213981"),
        "BMN Aset Ex Deptan (SUPM) Prodi Budidaya Perikanan di atas tanah sertifikat Nomor HP.8 Tahun 1995. Saluran air tertutup tanah akibat banjir bandang 2017.",
        "Kampus PKP Bitung"
    )
    add(
        "poltek-kp-bitung", 2, "Kolam Air Tawar Atas", 249, "Rusak Berat", "Tidak berfungsi", "Tanah", "Tidak ada", "Tidak ada", 0,
        "1.459006, 125.210894", dms_to_maps_url("1.459006, 125.210894"),
        "BMN Aset Ex Deptan (SUPM) Prodi Budidaya Perikanan di atas tanah sertifikat Nomor HP.10 Tahun 2016. Tertutup tanah akibat banjir bandang 2017.",
        "Kampus PKP Bitung"
    )

    # =========================================================================
    # 4. POLITEKNIK KP SORONG (6 Unit - Hal 6)
    # =========================================================================
    sorong_rows = [
        (1, "Tambak-1 Busmetik", 3493, "Baik", "Budidaya udang vaname", "HDPE", "Ada", "Tidak ada", 0, "0°49'43\"S 131°14'08\"E", "Kampus PKP Sorong"),
        (2, "Tambak-2 Wanamina", 2448, "Baik", "Budidaya Mangrove", "Tanah", "Ada", "Tidak ada", 0, "0°49'45\"S 131°14'08\"E", "Kampus PKP Sorong"),
        (3, "Tambak-3 Bandeng", 2998, "Baik", "Budidaya Bandeng", "Tanah", "Ada", "Tidak ada", 0, "0°49'47\"S 131°14'07\"E", "Kampus PKP Sorong"),
        (4, "Tambak-4 Agromina", 1120, "Baik", "Budidaya Mujair", "Tanah", "Tidak ada", "Tidak ada", 0, "0°49'41\"S 131°14'08\"E", "Kampus PKP Sorong"),
        (5, "Kolam-5 IPBAT", 276, "Baik", "Budidaya Ikan Hias", "Beton", "Ada", "Ada", 1, "0°49'44\"S 131°14'03\"E", "15 Kolam"),
        (6, "Kolam-6 IPBAL", 196, "Baik", "Budidaya Ikan Laut", "Beton", "Ada", "Tidak ada", 0, "0°49'47\"S 131°14'01\"E", "10 Kolam"),
    ]
    for no, nama, luas, kond, fungsi, pel, lis, kin, jkin, dms, ket in sorong_rows:
        add("poltek-kp-sorong", no, nama, luas, kond, fungsi, pel, lis, kin, jkin, dms, dms_to_maps_url(dms), ket, "Kampus PKP Sorong")

    # =========================================================================
    # 5. POLITEKNIK KP KARAWANG (30 Unit - Hal 7-8)
    # =========================================================================
    krw_url_1 = "https://earth.google.com/web/@-6.28647857,107.3030461,11.55609559a,1109.39931635d,35y,-76.6707922h,11.88405426t,0.00009792r"
    krw_url_2 = "https://earth.google.com/web/@-6.28612519,107.30232981,12.11865899a,1000d,30y,0h,0t,0r"
    krw_rows_1 = [
        (1, "Kolam L1", 198, "Baik", "Pendederan Ikan Nila", "Tanah", "-"),
        (2, "Kolam L2", 345, "Baik", "Pendederan Ikan Nila", "Tanah", "-"),
        (3, "Kolam L3", 370, "Baik", "Pendederan Ikan Nila", "Tanah", "-"),
        (4, "Kolam L4", 456, "Baik", "Pendederan Ikan Nila", "Tanah", "-"),
        (5, "Kolam L5", 38, "Baik", "Pendederan Ikan Nila", "Tanah", "-"),
        (6, "Kolam L6", 420, "Baik", "Pembenihan Ikan Nila", "Tanah", "-"),
        (7, "Kolam L7", 416, "Baik", "Pembenihan Ikan Nila", "Tanah", "-"),
        (8, "Kolam L8", 387, "Baik", "Pembenihan Ikan Nila", "Tanah", "-"),
        (9, "Kolam L9", 295, "Baik", "Pembenihan Ikan Nila", "Tanah", "-"),
        (10, "Kolam L10", 802, "Baik", "Tandon", "Tanah", "-"),
        (11, "Tandon", 3320, "Baik", "Tandon", "Tanah", "8 KVA"),
        (12, "Kolam L11", 1980, "Baik", "Budidaya Ikan Nila", "Tanah", "8 KVA"),
        (13, "Kolam L12", 1076, "Baik", "Kolam Pemancingan", "Tanah", "-"),
        (14, "Kolam L13", 1297, "Rusak Ringan", "ex-Budidaya Ikan Nila", "Tanah", "-"),
        (15, "Kolam L14", 553, "Rusak Ringan", "ex-Budidaya Ikan Nila", "Tanah", "-"),
        (16, "Kolam L15", 376, "Rusak Ringan", "ex-Budidaya Ikan Nila", "Tanah", "-"),
        (17, "Kolam L16", 1843, "Baik", "Budidaya Ikan Nila", "Tanah", "8 KVA"),
        (18, "Kolam L17", 4395, "Baik", "Pembenihan Ikan Nila, Gurame, dan Patin", "Tanah", "8 KVA"),
    ]
    for no, nama, luas, kond, fungsi, pel, lis in krw_rows_1:
        add("poltek-kp-karawang", no, nama, luas, kond, fungsi, pel, lis, "-", 0, "PKP Karawang", krw_url_1, "Lokasi dalam lingkungan kampus Karawang", "Kampus Karawang")

    for idx in range(1, 13):
        no = 18 + idx
        add("poltek-kp-karawang", no, f"Kolam A{idx}", 400, "Rusak Berat", "Tidak dimanfaatkan", "Beton HDPE", "-", "-", 0, "Kolam A1-A12 PKP Karawang", krw_url_2, "Lokasi dalam lingkungan kampus Karawang", "Kampus Karawang")

    # =========================================================================
    # 6. POLITEKNIK KP BONE (18 Unit - Hal 9)
    # =========================================================================
    bone_url_1 = "https://www.google.com/maps/@-4.4799928,120.3793849,72m/data=!3m1!1e3?hl=id"
    bone_url_2 = "https://www.google.com/maps/@-4.4620268,120.3673287,288m/data=!3m1!1e3?hl=id"
    bone_k1 = [
        (1, "Tambak Petak 1", 1479, "Budidaya Udang Vaname", "HDPE", 5),
        (2, "Tambak Petak 2", 1552, "Budidaya Udang Vaname", "HDPE", 5),
        (3, "Tambak Petak 3", 1485, "Belum Dimanfaatkan", "HDPE", 0),
        (4, "Tambak Petak 4", 1534, "Belum Dimanfaatkan", "HDPE", 0),
        (5, "Tandon 1", 1508, "Tandon Air", "HDPE", 0),
        (6, "Tandon 2", 1166, "Tandon Air", "HDPE", 0),
        (7, "Tambak Tanah 1 (Kampus 1)", 3484, "Belum Dimanfaatkan", "Tanah", 0),
        (8, "Tambak Tanah 2 (Kampus 1)", 8262, "Budidaya Ikan Bandeng", "Tanah", 0),
    ]
    for no, nama, luas, fungsi, pel, jkin in bone_k1:
        add(
            "poltek-kp-bone", no, nama, luas, "Baik", fungsi, pel, "60 KVA (Kampus 1)",
            "Kincir Air 10 Buah, Pompa Celup 8\" (1 buah), Pompa Celup 3\" (3 buah)", jkin,
            "Kampus 1 PKP Bone (-4.4799928, 120.3793849)", bone_url_1,
            "Lokasi Tambak berada di Kampus 1. Petak belum dimanfaatkan karena alokasi anggaran tidak ada.",
            "Kampus 1 PKP Bone"
        )

    bone_mallari = [
        (9, "Tambak Petak 1A", 1900, "Belum Dimanfaatkan", "HDPE", 5),
        (10, "Tambak Petak 2A", 1800, "Belum Dimanfaatkan", "HDPE", 5),
        (11, "Tambak Petak 3A", 1800, "Belum Dimanfaatkan", "HDPE", 5),
        (12, "Tambak Tanah 1 (Mallari)", 1729, "Belum Dimanfaatkan", "Tanah", 0),
        (13, "Tambak Petak 5A", 2730, "Tandon Air", "HDPE", 4),
        (14, "Tambak Petak 6A", 1775, "Belum Dimanfaatkan", "HDPE", 5),
        (15, "Tambak Petak 7A", 1638, "Belum Dimanfaatkan", "HDPE", 5),
        (16, "Tambak Tanah 2 (Mallari)", 1729, "Belum Dimanfaatkan", "Tanah", 0),
        (17, "Tambak Petak 1B", 8398, "Belum Dimanfaatkan", "HDPE", 8),
        (18, "Tambak Petak 2B", 8398, "Belum Dimanfaatkan", "HDPE", 7),
    ]
    for no, nama, luas, fungsi, pel, jkin in bone_mallari:
        add(
            "poltek-kp-bone", no, nama, luas, "Baik", fungsi, pel, "100 KVA (Mallari)",
            "Kincir Air 44 Buah (4 Baik, 40 RR), Pompa Celup 10\" (3), 8\" (2), 3\" (4)", jkin,
            "Lokasi Mallari (-4.4620268, 120.3673287)", bone_url_2,
            "Lokasi Tambak berada di Mallari. Petak belum dimanfaatkan karena alokasi anggaran tidak ada.",
            "Lokasi Mallari"
        )

    # =========================================================================
    # 7. POLITEKNIK KP KUPANG (9 Unit - Hal 10-11)
    # =========================================================================
    kupang_url = "https://earth.google.com/web/search/POLITEKNIK+KELAUTAN+DAN+PERIKANAN+KUPANG/@-10.21871612,123.5138214,32.02096958a,166.96859171d,35y,169.8559564h,0t,0r"
    kupang_rows = [
        (1, "Tambak 1", 625, "Baik", "Budidaya Vannamei (TEFA)", "HDPE", "Ada instalasi listrik", "3 unit", 3),
        (2, "Tambak 2", 300, "Baik", "Budidaya Vannamei (TEFA)", "HDPE", "Ada instalasi listrik", "2 unit", 2),
        (3, "Bak Beton 1", 72, "Baik", "Budidaya Ikan Nila", "Beton", "Ada instalasi listrik", "-", 0),
        (4, "Bak Beton 2", 72, "Baik", "Budidaya Ikan Nila", "Beton", "Ada instalasi listrik", "-", 0),
        (5, "Bak Beton 3", 72, "Rusak Berat", "Belum dimanfaatkan", "Beton", "Ada instalasi listrik", "-", 0),
        (6, "Bak Beton 4", 72, "Rusak Berat", "Belum dimanfaatkan", "Beton", "Ada instalasi listrik", "-", 0),
        (7, "Bak Fiber", 75.47, "Rusak Ringan", "Budidaya ikan nila", "Fiber", "Ada instalasi listrik", "-", 0),
        (8, "Kolam Terpal bulat", 224.39, "Rusak Ringan", "Budidaya ikan nila", "Terpal", "Ada instalasi listrik", "-", 0),
        (9, "Tambak garam", 2038, "Rusak Berat", "Produksi Garam", "Beton", "-", "-", 0),
    ]
    for no, nama, luas, kond, fungsi, pel, lis, kin, jkin in kupang_rows:
        add("poltek-kp-kupang", no, nama, luas, kond, fungsi, pel, lis, kin, jkin, "Lokasi tanah di PKP Kupang", kupang_url, "Lingkungan TEFA PKP Kupang", "Lingkungan TEFA PKP Kupang")

    # =========================================================================
    # 8. POLITEKNIK KP DUMAI (1 Unit - Hal 12)
    # =========================================================================
    add(
        "poltek-kp-dumai", 1, "Kolam Resapan", 68, "Baik", "Resapan bila air pasang (bukan kolam ikan)", "Tanah", "-", "-", 0,
        "Kampus PKP Dumai", "https://maps.app.goo.gl/EwvuZ3zuAFokZSH3A",
        "Tidak memiliki prasarana Tambak/Kolam budidaya (hanya kolam resapan air pasang)", "Kampus PKP Dumai"
    )

    # =========================================================================
    # 9. POLITEKNIK KP PANGANDARAN (15 Unit - Hal 13-14)
    # =========================================================================
    pnd_kampus = [
        (1, "Tambak Petak - 1", 400, "2 unit @ 1HP 1 Phase", 2, "https://earth.google.com/earth/d/1KWY20sURNGModwRz-YHBRitSNW5ULNJj?usp=sharing"),
        (2, "Tambak Petak - 2", 400, "2 unit @ 1HP 1 Phase", 2, "https://earth.google.com/earth/d/1F7CWHxQ8_hL7sQ0s-h2vXQp9L-U2d6rO?usp=sharing"),
        (3, "Tambak Petak - 3", 400, "2 unit @ 1HP 1 Phase", 2, "https://earth.google.com/earth/d/1H9E02HFRu0Y8W3vD1d3a8H5mX5c9L7eA?usp=sharing"),
        (4, "Tambak Petak - 4", 400, "2 unit @ 1HP 1 Phase", 2, "https://earth.google.com/earth/d/1G4B21KLMn9X7V2uC0c2z7G4lW4b8K6dZ?usp=sharing"),
        (5, "Tambak Petak - 5", 900, "8 unit @ 1HP 1 Phase", 8, "https://earth.google.com/earth/d/1KWY20sURNGModwRz-YHBRitSNW5ULNJj?usp=sharing"),
    ]
    for no, nama, luas, kin, jkin, url in pnd_kampus:
        add(
            "poltek-kp-pangandaran", no, nama, luas, "Baik", "Budidaya udang vaname", "Plastik HDPE",
            "Tergabung jaringan listrik kampus, daya 197 KVA", kin, jkin,
            f"Koordinat Petak - {no}", url, "Dalam Lingkungan Kampus", "Lingkungan Kampus Pangandaran"
        )

    pnd_kop_luas = [400, 400, 350, 300, 300, 300, 300, 900, 900, 900]
    pnd_kop_url = "https://earth.google.com/earth/d/1y3b9Kt6CL8yHgSdoyMRO9sfxn5wteyVt?usp=sharing"
    for idx, luas in enumerate(pnd_kop_luas, start=1):
        no = 5 + idx
        add(
            "poltek-kp-pangandaran", no, f"Tambak Koperasi - {idx}", luas, "Baik", "Budidaya udang vaname", "Plastik HDPE",
            "Memiliki jaringan listrik sendiri sebesar 50 KVA", "6 unit @ 3HP 3 Phase", 6,
            "Koordinat Tambak Koperasi", pnd_kop_url,
            "Koperasi Mina Marlin Abadi (sewa Lahan Kampus) - Aset koperasi dan hasil produksi bukan setoran PNBP",
            "Lahan Sewa Koperasi Mina Marlin Abadi"
        )

    # =========================================================================
    # 10. POLITEKNIK KP JEMBRANA (46 Unit - Hal 15-16)
    # =========================================================================
    jmb_url = "https://www.google.com/maps/search/?api=1&query=-8.3936,114.5936"
    jmb_outdoor = [
        (1, "TEFA Busmetik 1", 1600),
        (2, "TEFA Busmetik 2", 1600),
        (3, "SFV 1", 1600),
        (4, "SFV 2", 1600),
    ]
    for no, nama, luas in jmb_outdoor:
        add(
            "poltek-kp-jembrana", no, nama, luas, "Baik", "Budidaya udang vaname", "HDPE",
            "Tergabung jaringan listrik kampus, daya 345 kVA", "6 unit @1HP 1 phase", 6,
            "Lokasi Tambak Politeknik KP Jembrana", jmb_url,
            "Lokasi dalam lingkungan kampus (Outdoor)", "Kampus Jembrana (Outdoor)"
        )

    for idx in range(1, 7):
        no = 4 + idx
        add(
            "poltek-kp-jembrana", no, f"Kolam Bundar {idx}", 7.6, "Baik", "Budidaya udang/ikan", "HDPE",
            "Tergabung jaringan listrik kampus, daya 345 kVA",
            "Aerasi menggunakan root blower (3 phase 2.2 Kw 380V 50Hz 5A)", 0,
            "Lokasi Tambak Politeknik KP Jembrana", jmb_url,
            "Lokasi dalam lingkungan kampus (Semi Outdoor)", "Kampus Jembrana (Semi Outdoor)"
        )

    for idx in range(7, 19):
        no = 4 + idx
        add(
            "poltek-kp-jembrana", no, f"Kolam Bundar {idx}", 8.4, "Baik", "Budidaya udang/ikan", "Beton",
            "Tergabung jaringan listrik kampus, daya 345 kVA",
            "Aerasi menggunakan root blower (3 phase 2.2 Kw 380V 50Hz 5A)", 0,
            "Lokasi Tambak Politeknik KP Jembrana", jmb_url,
            "Lokasi dalam lingkungan kampus (Semi Outdoor)", "Kampus Jembrana (Semi Outdoor)"
        )

    for idx in range(1, 3):
        no = 22 + idx
        add(
            "poltek-kp-jembrana", no, f"Kolam Indoor {idx}", 17, "Baik", "Budidaya udang/ikan", "Beton",
            "Tergabung jaringan listrik kampus, daya 345 kVA",
            "Aerasi menggunakan Resun LP 200 dan LP 100", 0,
            "Lokasi Tambak Politeknik KP Jembrana", jmb_url,
            "Lokasi dalam lingkungan kampus (Indoor)", "Kampus Jembrana (Indoor)"
        )

    for idx in range(3, 7):
        no = 22 + idx
        add(
            "poltek-kp-jembrana", no, f"Kolam Indoor {idx}", 8, "Baik", "Budidaya udang/ikan", "Beton",
            "Tergabung jaringan listrik kampus, daya 345 kVA",
            "Aerasi menggunakan Resun LP 200 dan LP 100", 0,
            "Lokasi Tambak Politeknik KP Jembrana", jmb_url,
            "Lokasi dalam lingkungan kampus (Indoor)", "Kampus Jembrana (Indoor)"
        )

    for idx in range(7, 9):
        no = 22 + idx
        add(
            "poltek-kp-jembrana", no, f"Kolam Indoor {idx}", 8, "Baik", "Budidaya udang/ikan", "Beton",
            "Tergabung jaringan listrik kampus, daya 345 kVA",
            "2 unit Super charge 3 HP 3 Phase (kondisi rusak berat)", 2,
            "Lokasi Tambak Politeknik KP Jembrana", jmb_url,
            "Lokasi dalam lingkungan kampus (Indoor)", "Kampus Jembrana (Indoor)"
        )

    for idx in range(9, 21):
        no = 22 + idx
        add(
            "poltek-kp-jembrana", no, f"Kolam Indoor {idx}", 4, "Baik", "Budidaya udang/ikan", "Beton",
            "Tergabung jaringan listrik kampus, daya 345 kVA",
            "2 unit Super charge 3 HP 3 Phase (kondisi rusak berat)", 0,
            "Lokasi Tambak Politeknik KP Jembrana", jmb_url,
            "Lokasi dalam lingkungan kampus (Indoor)", "Kampus Jembrana (Indoor)"
        )

    jmb_kop = [
        (43, "Koperasi 1 (Petak 1 - Aset Koperasi)", 1600, "6 unit @1HP 3 phase", 6),
        (44, "Koperasi 2 (Petak 2 - Aset Koperasi)", 1600, "6 unit @1HP 3 phase", 6),
        (45, "Koperasi 3 (Petak 3 - Aset Koperasi)", 1600, "6 unit @1HP 3 phase", 6),
        (46, "Koperasi 4 (Petak 4 - Aset Koperasi)", 800, "3 unit @1HP 3 phase", 3),
    ]
    for no, nama, luas, kin, jkin in jmb_kop:
        add(
            "poltek-kp-jembrana", no, nama, luas, "Baik", "Budidaya udang vaname", "HDPE",
            "Memiliki jaringan listrik sendiri sebesar 33 kVa", kin, jkin,
            "Lokasi Tambak Politeknik KP Jembrana", jmb_url,
            "Lokasi dalam lingkungan kampus (Outdoor) - Aset koperasi, hasil produksi bukan setoran PNBP",
            "Kampus Jembrana (Outdoor - Koperasi)"
        )

    # =========================================================================
    # 11. AK-KP WAKATOBI (0 Unit - Hal 17)
    # =========================================================================
    # Tidak memiliki tambak/kolam (tercatat di rekapitulasi Satdik)

    # =========================================================================
    # 12. SUPM LADONG (11 Unit - Hal 18)
    # =========================================================================
    ldg_rows_1 = [
        (1, "Tambak Petak A", 2500, "Baik", "Petak pemeliharaan, belum dimanfaatkan", "HDPE", "Ada", "6 unit (rusak)", 6),
        (2, "Tambak Petak B", 2500, "Baik", "Petak pemeliharaan, belum dimanfaatkan", "HDPE", "Ada", "-", 0),
        (3, "Tambak Tandon", 3500, "Baik", "Tandon", "Tanah", "Ada", "-", 0),
    ]
    for no, nama, luas, kond, fungsi, pel, lis, kin, jkin in ldg_rows_1:
        add(
            "supm-ladong", no, nama, luas, kond, fungsi, pel, lis, kin, jkin,
            "5°36'03\"N 95°29'47\"E", dms_to_maps_url("5°36'03\"N 95°29'47\"E"),
            "Sertipikat Tanah No. 1", "Sertipikat Tanah No. 1"
        )

    ldg_rows_2 = [
        (4, "Kolam tefa", 2, "Baik", "Dimanfaatkan", "Bak Beton", None),
        (5, "Bak pemijahan", 25, "Baik", "Dimanfaatkan", "Beton (2 unit)", None),
        (6, "Kolam larva", 3, "Baik", "Dimanfaatkan", "Beton (9 unit)", None),
        (7, "Bak Pemeliharaan induk", 3, "Baik", "Dimanfaatkan", "Beton (12 unit)", None),
        (8, "Pendederan benih", 4, "Baik", "Dimanfaatkan", "Beton (4 Unit)", None),
        (9, "Kolam pembesaran 1", 16, "Rusak Berat", "Dimanfaatkan", "Beton (2 unit)", None),
        (10, "Kolam pembesaran 2", 16, "Rusak Berat", "Dimanfaatkan", "Tanah (2 unit)", None),
        (11, "Biofloc", 21.2, "Baik", "Dimanfaatkan", "Beton (3 unit)", "3 D3 (21,2 m2)"),
    ]
    for no, nama, luas, kond, fungsi, pel, llabel in ldg_rows_2:
        add(
            "supm-ladong", no, nama, luas, kond, fungsi, pel, "Ada", "-", 0,
            "Tefa Air Tawar (5.6062834, 95.4871599) & Lab Basah (5.6064172, 95.4869179)",
            dms_to_maps_url("5.6062834, 95.4871599"),
            "Sertipikat Tanah No. 21", "Sertipikat Tanah No. 21 (Tefa Air Tawar)", luas_label=llabel
        )

    # =========================================================================
    # 13. SUPM PARIAMAN (18 Unit - Hal 19)
    # =========================================================================
    prm_coord = "-0.56713, 100.09289"
    prm_url = dms_to_maps_url(prm_coord)
    add("supm-pariaman", 1, "Bangunan Kolam BST", 1200, "Baik", "Kolam Dewi2 (BST)", "Pematang Beton", "-", "-", 0, prm_coord, prm_url, "Lokasi dalam lingkungan kampus", "Kampus SUPM Pariaman")
    prm_payau = [
        (2, "Kolam Ikan Air Payau 1", 4514, "Budidaya Vannamei (TEFA)", "Setengah HDPE", "Ada", "Kincir 56 Unit (Kondisi Baik)", 7),
        (3, "Kolam Ikan Air Payau 2", 3645, "Budidaya Vannamei (TEFA)", "HDPE", "Ada", "Kincir 56 Unit (Kondisi Baik)", 7),
        (4, "Kolam Ikan Air Payau 3 (Tandon)", 1200, "Tandon Air", "Tanah", "-", "-", 0),
        (5, "Kolam Ikan Air Payau 4", 4060, "Budidaya Vannamei (TEFA)", "Setengah HDPE", "Ada", "Kincir 56 Unit (Kondisi Baik)", 7),
        (6, "Kolam Ikan Air Payau 5", 2100, "Budidaya Vannamei (TEFA)", "HDPE", "Ada", "Kincir 56 Unit (Kondisi Baik)", 6),
        (7, "Kolam Ikan Air Payau 6", 1200, "Budidaya Vannamei (TEFA)", "HDPE", "Ada", "Kincir 56 Unit (Kondisi Baik)", 5),
        (8, "Kolam Ikan Air Payau 7", 1600, "Budidaya Vannamei (TEFA)", "HDPE", "Ada", "Kincir 56 Unit (Kondisi Baik)", 6),
        (9, "Kolam Ikan Air Payau 8 (Tandon)", 1600, "Tandon Air", "Tanah", "-", "-", 0),
        (10, "Kolam Ikan Air Payau 9", 1600, "Budidaya Vannamei (TEFA)", "HDPE", "Ada", "Kincir 56 Unit (Kondisi Baik)", 6),
        (11, "Kolam Ikan Air Payau 10", 2500, "Budidaya Vannamei (TEFA)", "HDPE", "Ada", "Kincir 56 Unit (Kondisi Baik)", 6),
        (12, "Kolam Ikan Air Payau 11", 2200, "Budidaya Vannamei (TEFA)", "HDPE", "Ada", "Kincir 56 Unit (Kondisi Baik)", 6),
    ]
    for no, nama, luas, fungsi, pel, lis, kin, jkin in prm_payau:
        add("supm-pariaman", no, nama, luas, "Baik", fungsi, pel, lis, kin, jkin, prm_coord, prm_url, "Lokasi dalam lingkungan kampus", "Kampus SUPM Pariaman")

    prm_tawar_luas = [762, 352, 352, 762, 352, 352]
    for idx, luas in enumerate(prm_tawar_luas, start=1):
        no = 12 + idx
        add("supm-pariaman", no, f"Kolam Air Tawar {idx}", luas, "Baik", "Belum Dimanfaatkan", "Pematang Beton", "Tidak ada", "Tidak ada", 0, prm_coord, prm_url, "Lokasi dalam lingkungan kampus", "Kampus SUPM Pariaman")

    # =========================================================================
    # 14. SUPM KOTA AGUNG (16 Unit - Hal 20)
    # =========================================================================
    kta_dms = "5°29'48\"S 104°35'38\"E"
    kta_url = dms_to_maps_url(kta_dms)
    kta_rows = [
        (1, "Tambak - A1", 1000, 3),
        (2, "Tambak - A2", 1000, 4),
        (3, "Tambak - A3", 1000, 3),
        (4, "Tambak - A4", 1000, 3),
        (5, "Tandon 1", 1000, 1),
        (6, "Tambak - B1", 1000, 4),
        (7, "Tambak - B2", 1000, 3),
        (8, "Tambak - B3", 1000, 3),
        (9, "Tambak - B4", 1000, 4),
        (10, "Tandon 2", 1000, 1),
        (11, "Tambak - C1", 700, 3),
        (12, "Tambak - C2", 1600, 4),
        (13, "Tambak - C3", 1600, 3),
        (14, "Tambak - C4", 1600, 3),
        (15, "Tandon 3", 1000, 4),
        (16, "Tandon 4", 1000, 4),
    ]
    for no, nama, luas, jkin in kta_rows:
        add(
            "supm-kotaagung", no, nama, luas, "Baik", "Belum Operasional", "HDPE",
            "Tersedia Daya Listrik 105 KWh", f"{jkin} unit", jkin,
            kta_dms, kta_url, "Lokasi dalam lingkungan Kampus", "Kampus SUPM Kota Agung"
        )

    # =========================================================================
    # 15. SUPM TEGAL (18 Unit - Hal 21)
    # =========================================================================
    tgl_url_138 = "https://earth.google.com/web/@-6.84774691,109.15582657,1.44149983a,329.88022238d,35y,0h,0t,0r"
    tgl_url_139 = "https://earth.google.com/web/@-6.84756452,109.15685971,0.34011906a,491.32049684d,35y,0h,0t,0r"
    tgl_url_140 = "https://earth.google.com/web/@-6.84756452,109.15685971,0.34011906a,491.32049684d,35y,0h,0t,0r"
    tgl_url_lebak = "https://earth.google.com/web/@-7.04990794,109.13646691,197.45478495a,178.90226334d,35y,0h,0t,0r"

    for no, luas in [(1, 5700), (2, 2100), (3, 7000), (4, 4300), (5, 4300)]:
        add("supm-tegal", no, f"Tambak {no}", luas, "Baik", "Belum dimanfaatkan", "Tanah", "Belum ada instalasi jaringan listrik", "-", 0, "Lokasi Tambak Sertipikat No 138", tgl_url_138, "Sertipikat No 138 (Luas : 32.100 m2)", "Sertipikat No. 138 Tegal")

    for no in range(6, 11):
        add("supm-tegal", no, f"Tambak {no}", 4300, "Baik", "Belum dimanfaatkan", "Tanah", "Belum ada instalasi jaringan listrik", "-", 0, "Lokasi Tambak Sertipikat No 139", tgl_url_139, "Sertipikat No 139 (Luas : 44.390 m2)", "Sertipikat No. 139 Tegal")

    for no in (11, 12):
        add("supm-tegal", no, f"Tambak {no}", 4300, "Baik", "Tandon Air", "Tanah", "Belum ada instalasi jaringan listrik", "-", 0, "Lokasi Tambak Sertipikat No 139", tgl_url_139, "Sertipikat No 139 (Luas : 44.390 m2)", "Sertipikat No. 139 Tegal")

    for no in (13, 14):
        add("supm-tegal", no, f"Tambak {no}", 0, "Baik", "Sebagai Lokasi Kampus", "Tanah", "-", "-", 0, "Lokasi Tambak Sertipikat 140", tgl_url_140, "Sertipikat No 140 (Luas : 25.160 m2)", "Sertipikat No. 140 Tegal")

    add("supm-tegal", 15, "Tambak 15", 4000, "Baik", "Budidaya Vannamei (TEFA)", "HDPE", "Tersedia Daya Listrik 17.900 Watt", "12 unit", 12, "Lokasi Tambak Sertipikat 140", tgl_url_140, "Sertipikat No 140 (Luas : 25.160 m2)", "Sertipikat No. 140 Tegal")
    add("supm-tegal", 16, "Tambak 16", 2700, "Baik", "Belum dimanfaatkan", "HDPE", "-", "-", 0, "Lokasi Tambak Sertipikat 140", tgl_url_140, "Sertipikat No 140 (Luas : 25.160 m2)", "Sertipikat No. 140 Tegal")
    add("supm-tegal", 17, "Tambak 17", 3400, "Baik", "Belum dimanfaatkan", "Tanah", "-", "-", 0, "Lokasi Tambak Sertipikat 140", tgl_url_140, "Sertipikat No 140 (Luas : 25.160 m2)", "Sertipikat No. 140 Tegal")
    add("supm-tegal", 18, "Kolam Lebaksiu", 1898, "Baik", "Budidaya Air Tawar", "Beton", "Tersedia Daya Listrik 7.700 Watt", "Tidak ada", 0, "Lokasi Kolam SUPM di Lebaksiu", tgl_url_lebak, "Di Kecamatan Lebaksiu, Tegal", "Kec. Lebaksiu, Tegal")

    # =========================================================================
    # 16. SUPM WAIHERU (49 Unit - Hal 22-23)
    # =========================================================================
    whr_ambon_tambak = "-3.6321802, 128.2194410"
    whr_kairatu = "-3.3542610, 128.3579702"
    whr_ambon_kolam = "-3.6319958, 128.2197006"

    whr_t1_5 = [
        (1, "Tambak 1", 736, "Baik", "Belum dimanfaatkan", "Beton, dasar tanah", "Digabung dengan listrik kantor", "-", 0),
        (2, "Tambak 2", 736, "Baik", "Pembesaran Udang Vaname", "HDPE", "Digabung dengan listrik kantor", "5 unit", 5),
        (3, "Tambak 3", 736, "Baik", "Pembesaran Udang Vaname", "HDPE", "Digabung dengan listrik kantor", "5 unit", 5),
        (4, "Tambak 4", 736, "Baik", "Belum dimanfaatkan", "Beton, dasar tanah", "Digabung dengan listrik kantor", "-", 0),
        (5, "Tambak 5", 736, "Baik", "Belum dimanfaatkan", "Beton, dasar tanah", "Digabung dengan listrik kantor", "-", 0),
    ]
    for no, nama, luas, kond, fungsi, pel, lis, kin, jkin in whr_t1_5:
        add("supm-waiheru", no, nama, luas, kond, fungsi, pel, lis, kin, jkin, whr_ambon_tambak, dms_to_maps_url(whr_ambon_tambak), "Lokasi di Kompleks SUPM Waiheru, Kota Ambon", "Kompleks SUPM Waiheru Ambon")

    whr_t6_14 = [
        (6, 651), (7, 686), (8, 784), (9, 1170), (10, 550), (11, 620), (12, 1460), (13, 570), (14, 530)
    ]
    for no, luas in whr_t6_14:
        add("supm-waiheru", no, f"Tambak {no}", luas, "Rusak Berat", "Belum dimanfaatkan", "Tanah", "Tersedia Jaringan listrik 16.500 Watt", "-", 0, whr_kairatu, dms_to_maps_url(whr_kairatu), "Lokasi di Desa Kairatu Kab. Seram Bagian Barat", "Desa Kairatu, Kab. SBB")

    whr_kolam_specs = [
        (1, 200, "Baik", "Budidaya Ikan Air Tawar"),
        (2, 200, "Baik", "Budidaya Ikan Air Tawar"),
        (3, 200, "Baik", "Budidaya Ikan Air Tawar"),
        (4, 200, "Baik", "Budidaya Ikan Air Tawar"),
        (5, 200, "Baik", "Budidaya Ikan Air Tawar"),
        (6, 200, "Baik", "Budidaya Ikan Air Tawar"),
        (7, 200, "Baik", "Budidaya Ikan Air Tawar"),
        (8, 200, "Rusak Ringan", "Budidaya Ikan Air Tawar"),
        (9, 48, "Baik", "Budidaya Ikan Air Tawar"),
        (10, 48, "Baik", "Budidaya Ikan Air Tawar"),
        (11, 48, "Baik", "Budidaya Ikan Air Tawar"),
        (12, 48, "Baik", "Budidaya Ikan Air Tawar"),
        (13, 140, "Baik", "Budidaya Ikan Air Tawar"),
        (14, 140, "Baik", "Budidaya Ikan Air Tawar"),
        (15, 140, "Baik", "Budidaya Ikan Air Tawar"),
        (16, 140, "Baik", "Budidaya Ikan Air Tawar"),
        (17, 140, "Baik", "Budidaya Ikan Air Tawar"),
        (18, 79, "Baik", "Budidaya Ikan Air Tawar"),
        (19, 79, "Baik", "Budidaya Ikan Air Tawar"),
        (20, 79, "Baik", "Budidaya Ikan Air Tawar"),
        (21, 79, "Baik", "Budidaya Ikan Air Tawar"),
        (22, 79, "Baik", "Budidaya Ikan Air Tawar"),
        (23, 171, "Baik", "Budidaya Ikan Air Tawar"),
        (24, 80, "Baik", "Budidaya Ikan Air Tawar"),
        (25, 16, "Rusak Ringan", "Budidaya Udang Vaname"),
        (26, 16, "Rusak Ringan", "Budidaya Udang Vaname"),
        (27, 16, "Rusak Ringan", "Budidaya Udang Vaname"),
        (28, 16, "Rusak Ringan", "Budidaya Udang Vaname"),
        (29, 16, "Rusak Ringan", "Budidaya Udang Vaname"),
        (30, 13, "Rusak Ringan", "Budidaya Udang Vaname"),
        (31, 13, "Rusak Ringan", "Budidaya Udang Vaname"),
        (32, 13, "Baik", "Budidaya Ikan Air Tawar"),
        (33, 152, "Baik", "Budidaya Ikan Air Tawar"),
        (34, 115, "Baik", "Budidaya Ikan Air Tawar"),
        (35, 200, "Baik", "Budidaya Ikan Air Tawar"),
    ]
    for k_idx, luas, kond, fungsi in whr_kolam_specs:
        no = 14 + k_idx
        add("supm-waiheru", no, f"Kolam {k_idx}", luas, kond, fungsi, "Beton, dasar tanah", "-", "-", 0, whr_ambon_kolam, dms_to_maps_url(whr_ambon_kolam), "Lokasi di Kompleks SUPM Waiheru, Kota Ambon", "Kompleks SUPM Waiheru Ambon")

    # =========================================================================
    # 17. SUPM PONTIANAK (50 Unit - Hal 24-25)
    # =========================================================================
    ptk_tambak = [
        (1, "Tambak Petak 1", 570, "Tanah", 1, "https://maps.app.goo.gl/WpxAJRFbT6jZJwgW6"),
        (2, "Tambak Petak 2", 672, "Tanah", 1, "https://maps.app.goo.gl/GRxgok41CJ8XkXPB7"),
        (3, "Tambak Petak 3", 1567, "HDPE", 1, "https://maps.app.goo.gl/h8exK5Q1rBiAW4y98"),
        (4, "Tambak Petak 4", 1114, "HDPE", 1, "https://maps.app.goo.gl/ZQgiDjNQePbQPVJf7"),
        (5, "Tambak Petak 5", 1526, "Tanah", 0, "https://maps.app.goo.gl/fVenMdXWxYkS6tHL7"),
        (6, "Tambak Petak 6", 1677, "Tanah", 0, "https://maps.app.goo.gl/w21c3gAc3Y6VxYGP6"),
        (7, "Tambak Petak 7", 1221, "Tanah", 0, "https://maps.app.goo.gl/WKmS2u8LFUk9Z3xh9"),
        (8, "Tambak Petak 8", 1122, "Tanah", 0, "https://maps.app.goo.gl/xA1WjpdqR94ZcGq2A"),
    ]
    for no, nama, luas, pel, jkin, url in ptk_tambak:
        add(
            "supm-pontianak", no, nama, luas, "Baik", "Pembesaran Ikan / Udang", pel,
            "13.200 VA", "4 Unit, Kondisi Rusak Semua", jkin,
            "Desa Purun Kecil, Sungai Pinyuh", url,
            "Lokasi di Desa Purun Kecil, Kec. Sungai Pinyuh, Kab. Mempawah", "Desa Purun Kecil, Kab. Mempawah"
        )

    ptk_kolam = [
        (9, "Kolam 1", 375, "Rusak Berat", "Tidak Difungsikan", "Semen", "https://maps.app.goo.gl/sHEBwVeYwsmkmUfu5"),
        (10, "Kolam 2", 200, "Baik", "Induk", "Semen", "https://maps.app.goo.gl/1GnFFeows76CDfrR7"),
        (11, "Kolam 3", 200, "Baik", "Induk", "Semen", "https://maps.app.goo.gl/vrB8XE6Bo1h2Gujn8"),
        (12, "Kolam 4", 375, "Baik", "Pendederan", "Semen", "https://maps.app.goo.gl/EUxVi9nmN2WK893c7"),
        (13, "Kolam 5", 400, "Baik", "Pendederan", "Semen", "https://maps.app.goo.gl/Sixi2Eg8HW6yc7Nh7"),
        (14, "Kolam 6", 450, "Baik", "Penampungan", "Semen", "https://maps.app.goo.gl/WQr5hnt2bRJ5ZgRRA"),
        (15, "Kolam 7", 500, "Baik", "Indukan", "Semen", "https://maps.app.goo.gl/k2DF7PsFtN3i6PNr8"),
        (16, "Kolam 8", 500, "Baik", "Penampungan", "Semen", "https://maps.app.goo.gl/dfNUXq2dCUK3im8P8"),
        (17, "Kolam 9", 500, "Baik", "Pendederan", "Semen", "https://maps.app.goo.gl/PPoWNsiCbQ54yuPs7"),
        (18, "Kolam 10", 300, "Rusak Berat", "Tidak Difungsikan", "Semen", "https://maps.app.goo.gl/2zQoTCgExv7wYBJ98"),
        (19, "Kolam 11", 350, "Rusak Ringan", "Sewa", "Semen", "https://maps.app.goo.gl/eHjZSQmd6WzBEiQVA"),
        (20, "Kolam 12", 300, "Rusak Ringan", "Sewa", "Tanah", "https://maps.app.goo.gl/6rNDz7ep99BiQEEEA"),
        (21, "Kolam 13", 300, "Rusak Ringan", "Sewa", "Tanah", "https://maps.app.goo.gl/6QxKp95fRBjbYoUk6"),
        (22, "Kolam 14", 150, "Baik", "Pemijahan", "Tanah", "https://maps.app.goo.gl/MFGoRcRayXyjTKnJA"),
        (23, "Kolam 15", 300, "Baik", "Pemijahan", "Tanah", "https://maps.app.goo.gl/MFGoRcRayXyjTKnJA"),
        (24, "Kolam 16", 150, "Baik", "Pendederan", "Tanah", "https://maps.app.goo.gl/1jJ4FKpvSdyH1v7SA"),
        (25, "Kolam 17", 150, "Baik", "Pendederan", "Tanah", "https://maps.app.goo.gl/1jJ4FKpvSdyH1v7SA"),
        (26, "Kolam 18", 150, "Baik", "Pendederan", "Tanah", "https://maps.app.goo.gl/1jJ4FKpvSdyH1v7SA"),
        (27, "Kolam 19", 500, "Baik", "Pendederan", "Semen", "https://maps.app.goo.gl/j4C2KGVP7QXmyYtv5"),
        (28, "Kolam 20", 500, "Baik", "Pendederan", "Semen", "https://maps.app.goo.gl/QBcLYcDi7WLLZHxF8"),
        (29, "Kolam 21", 450, "Rusak Ringan", "Penampungan", "Semen", "https://maps.app.goo.gl/FmoVMDo4ULobxLnL6"),
        (30, "Kolam 22", 900, "Baik", "Pembesaran", "Tanah", "https://maps.app.goo.gl/M1MBXrQzTTEQQYHR7"),
        (31, "Kolam 23", 1000, "Baik", "Penampungan", "Tanah", "https://maps.app.goo.gl/yhv1gazpH7ExEXpSA"),
        (32, "Kolam 24", 2000, "Baik", "Penampungan", "Tanah", "https://maps.app.goo.gl/9KAv6rXY61P5t3G59"),
        (33, "Kolam 25", 500, "Rusak Berat", "Tidak Difungsikan", "Tanah", "https://maps.app.goo.gl/1uU9fGDFc9rtqRUdA"),
        (34, "Kolam 26", 400, "Rusak Berat", "Tidak Difungsikan", "Tanah", "https://maps.app.goo.gl/5eRkUH7GTujNGtBK6"),
        (35, "Kolam 27", 500, "Rusak Berat", "Tidak Difungsikan", "Tanah", "https://maps.app.goo.gl/WFunC4Vs6gon6gX18"),
        (36, "Kolam 28", 400, "Rusak Berat", "Tidak Difungsikan", "Tanah", "https://maps.app.goo.gl/iBZmYysQSVAqjMD28"),
        (37, "Kolam 29", 450, "Baik", "Pendederan", "Tanah", "https://maps.app.goo.gl/7ggwY3XqVT9tK95P8"),
        (38, "Kolam 30", 450, "Baik", "Pendederan", "Tanah", "https://maps.app.goo.gl/dCRpuDKRw7GRU8U18"),
        (39, "Kolam 31", 500, "Baik", "Pendederan", "Tanah", "https://maps.app.goo.gl/Be4VSx7g9Z52LKQw5"),
        (40, "Kolam 32", 300, "Baik", "Pendederan", "Tanah", "https://maps.app.goo.gl/K9bZt8otZvLTnu6b7"),
        (41, "Kolam 33", 300, "Baik", "Pendederan", "Tanah", "https://maps.app.goo.gl/9iFSnYC2zJfw8GWK8"),
        (42, "Kolam 34", 1500, "Rusak Berat", "Tidak Difungsikan", "Tanah", "https://maps.app.goo.gl/69nh9mWXSyRyuJrV6"),
        (43, "Kolam 35", 800, "Rusak Berat", "Tidak Difungsikan", "Tanah", "https://maps.app.goo.gl/9tZgLFywtAxBQJQ36"),
        (44, "Kolam 36", 500, "Rusak Berat", "Tidak Difungsikan", "Tanah", "https://maps.app.goo.gl/2aEMPnNWkaGidrtt5"),
        (45, "Kolam 37", 300, "Rusak Berat", "Tidak Difungsikan", "Tanah", "https://maps.app.goo.gl/RHs6hcMr87wZTtpm7"),
        (46, "Kolam 38", 350, "Rusak Berat", "Tidak Difungsikan", "Tanah", "https://maps.app.goo.gl/4NQMtRQSMciUitik8"),
        (47, "Kolam 39", 300, "Rusak Berat", "Tidak Difungsikan", "Tanah", "https://maps.app.goo.gl/EUBBqEgub1jiv4cN6"),
        (48, "Kolam 40", 600, "Baik", "Pendederan", "Tanah", "https://maps.app.goo.gl/M1gu9BXFcP9wXC1v9"),
        (49, "Kolam 41", 550, "Baik", "Pendederan", "Tanah", "https://maps.app.goo.gl/LrTpToZ3QdNzZxh28"),
        (50, "Kolam 42", 400, "Baik", "Pendederan", "Tanah", "https://maps.app.goo.gl/2gGtGAVSY1rZteaS6"),
    ]
    for no, nama, luas, kond, fungsi, pel, url in ptk_kolam:
        add(
            "supm-pontianak", no, nama, luas, kond, fungsi, pel,
            "3.950 VA", "Tidak Ada", 0,
            "Desa Kepayang, Kec. Anjongan", url,
            "Lokasi di Desa Kepayang, Kec. Anjongan, Kab. Mempawah", "Desa Kepayang, Kab. Mempawah"
        )

    # =========================================================================
    # 18. SUPM SORONG (2 Unit - Hal 26)
    # =========================================================================
    add(
        "supm-sorong", 1, "Kolam Air Tawar", 48, "Baik", "Pembesaran Ikan Air Tawar", "Beton, Dasar Beton",
        "-", "-", 0, "Kompleks SUPM Sorong", "https://maps.app.goo.gl/Qo9X6QN7UPUPmdd26",
        "Lokasi Di Dalam Kompleks SUPM Sorong", "Kompleks SUPM Sorong"
    )
    add(
        "supm-sorong", 2, "Kolam Fiber pembenihan air tawar", 32, "Baik",
        "Pembenihan Ikan Air Tawar (4 Unit Dengan Ukuran Tiap Unit P= 4m, L=2m)", "Fiber",
        "Diinstalasi dari Asrama SPP Neg-1 (S1/2200 VA)", "Airator", 0,
        "Kompleks SUPM Sorong", "https://maps.app.goo.gl/JmEtbx8LicJjrAHQ7",
        "Lokasi Di Dalam Kompleks SUPM Sorong", "Kompleks SUPM Sorong"
    )

    return units


def main():
    raw_units = build_raw_units()
    code_map = {sid: code for sid, _, code, _, _, _ in SATDIK_META}
    name_map = {sid: name for sid, name, _, _, _, _ in SATDIK_META}
    jenjang_map = {sid: jenjang for sid, _, _, jenjang, _, _ in SATDIK_META}

    units = []
    for u in raw_units:
        code = code_map[u["satdikId"]]
        uid = f"TBK-{code}-{u['noUrut']:03d}"
        units.append({
            "id": uid,
            "satdikId": u["satdikId"],
            "namaSatdik": name_map[u["satdikId"]],
            "jenjang": jenjang_map[u["satdikId"]],
            **u,
        })

    summary = []
    for sid, sname, scode, sjenjang, slokasi, slistrik in SATDIK_META:
        s_units = [u for u in units if u["satdikId"] == sid]
        jml_unit = len(s_units)
        jml_tambak = sum(1 for u in s_units if u["jenis"] == "Tambak")
        jml_kolam = sum(1 for u in s_units if u["jenis"] == "Kolam")
        jml_tandon = sum(1 for u in s_units if u["jenis"] in ("Tandon", "Bak / Biofloc"))
        luas_total = round(sum(u["luasM2"] for u in s_units), 2)
        luas_tambak = round(sum(u["luasM2"] for u in s_units if u["jenis"] == "Tambak"), 2)
        luas_kolam = round(sum(u["luasM2"] for u in s_units if u["jenis"] != "Tambak"), 2)
        k_baik = sum(1 for u in s_units if u["kondisi"] == "Baik")
        k_rr = sum(1 for u in s_units if u["kondisi"] == "Rusak Ringan")
        k_rb = sum(1 for u in s_units if u["kondisi"] == "Rusak Berat")
        u_aktif = sum(1 for u in s_units if u["statusOperasional"] in ("Aktif Budidaya", "Koperasi / Sewa", "Tandon / Pendukung"))
        u_belum = sum(1 for u in s_units if u["statusOperasional"] in ("Belum Dimanfaatkan", "Rusak / Tidak Berfungsi"))
        total_kincir = sum(u["jumlahKincir"] for u in s_units)

        if sid == "akkp-wakatobi":
            map_url = "https://drive.google.com/file/d/1kmTbwtt2u5t4lKjYFw5ZoqSOI5xjkj1T/view?usp=drive_link"
            ket = "Akademi Komunitas KP Wakatobi tidak memiliki prasarana tambak/kolam"
        else:
            map_url = s_units[0]["mapUrl"] if s_units else ""
            ket = s_units[0]["keterangan"] if s_units else ""

        summary.append({
            "satdikId": sid,
            "namaSatdik": sname,
            "kodeSatdik": scode,
            "jenjang": sjenjang,
            "jumlahUnit": jml_unit,
            "jumlahTambak": jml_tambak,
            "jumlahKolam": jml_kolam,
            "jumlahTandon": jml_tandon,
            "luasTotalM2": luas_total,
            "luasTambakM2": luas_tambak,
            "luasKolamM2": luas_kolam,
            "kondisiBaik": k_baik,
            "kondisiRusakRingan": k_rr,
            "kondisiRusakBerat": k_rb,
            "unitAktif": u_aktif,
            "unitBelumDimanfaatkan": u_belum,
            "totalKincir": total_kincir,
            "dayaListrik": slistrik,
            "lokasiUtama": slokasi,
            "mapUrl": map_url,
            "keterangan": ket,
        })

    payload = {
        "meta": {
            "title": "Prasarana dan Sarana Tambak dan Kolam Satuan Pendidikan KKP",
            "source": "1c-Data Tambak dan Kolam Satuan Pendidikan.pdf",
            "tahun": 2025,
            "totalSatdik": len(summary),
            "satdikMemilikiUnit": sum(1 for s in summary if s["jumlahUnit"] > 0),
            "totalUnit": len(units),
            "totalLuasM2": round(sum(u["luasM2"] for u in units), 2),
            "totalKincir": sum(u["jumlahKincir"] for u in units),
        },
        "summary": summary,
        "units": units,
    }

    JSON_OUT.write_text(json.dumps(payload, indent=2, ensure_ascii=False), encoding="utf-8")

    js_content = (
        "// Auto-generated from Excel/1c-Data Tambak dan Kolam Satuan Pendidikan.pdf\n"
        "// Do not edit manually without updating Database/import_tambak_kolam.py\n"
        f"window.SARPRAS_TAMBAK = {json.dumps(payload, indent=2, ensure_ascii=False)};\n"
    )
    JS_OUT.write_text(js_content, encoding="utf-8")

    print(f"[OK] Generated {JSON_OUT} and {JS_OUT}")
    print(f"     Total Satdik : {payload['meta']['totalSatdik']} ({payload['meta']['satdikMemilikiUnit']} memiliki tambak/kolam)")
    print(f"     Total Unit   : {payload['meta']['totalUnit']} petak/kolam")
    print(f"     Total Luas   : {payload['meta']['totalLuasM2']:,.2f} m2 ({payload['meta']['totalLuasM2']/10000:,.2f} Ha)")
    print(f"     Total Kincir : {payload['meta']['totalKincir']} unit")


if __name__ == "__main__":
    main()
