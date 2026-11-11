"""
Konverter Rekap Asrama (Excel) -> Dataset Sarana dan Prasarana Satuan Pendidikan KP
=========================================================
Membaca file  Excel/3. 05072025_Rekap Asrama_Adjustmen.xlsx  (sheet "Rekap" + 16 sheet
detail per Satdik) lalu menghasilkan:

  1. Database/asrama_data.json   -> dipakai Database/seed.php untuk mengisi tabel MySQL
  2. Services/asrama-data.js     -> dataset fallback Zero-Build untuk Frontend (window.SARPRAS_ASRAMA)

Hanya memakai pustaka standar Python (tanpa openpyxl).
Jalankan dari root projek:   python Database/import_asrama.py
"""
import json
import os
import re
import sys
import zipfile
import xml.etree.ElementTree as ET

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
XLSX = os.path.join(ROOT, 'Excel', '3. 05072025_Rekap Asrama_Adjustmen.xlsx')
OUT_JSON = os.path.join(ROOT, 'Database', 'asrama_data.json')
OUT_JS = os.path.join(ROOT, 'Services', 'asrama-data.js')

NS = {'ns': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
REL_ID = '{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id'

# Kode sheet Excel -> ID Satdik di master data projek
SHEET_TO_SATDIK = {
    'AUP': 'poltek-aup',
    'SDA': 'poltek-kp-sidoarjo',
    'BTG': 'poltek-kp-bitung',
    'SRG': 'poltek-kp-sorong',
    'KRW': 'poltek-kp-karawang',
    'KPG': 'poltek-kp-kupang',
    'BNE': 'poltek-kp-bone',
    'PND': 'poltek-kp-pangandaran',
    'DUM': 'poltek-kp-dumai',
    'JBR': 'poltek-kp-jembrana',
    'WKT': 'akkp-wakatobi',
    'LDG': 'supm-ladong',
    'PRM': 'supm-pariaman',
    'KTA': 'supm-kotaagung',
    'TGL': 'supm-tegal',
    'WHR': 'supm-waiheru',
}

# Nama Satdik pada sheet "Rekap" -> ID Satdik
REKAP_NAME_TO_SATDIK = {
    'politekik aup': 'poltek-aup',
    'politeknik aup': 'poltek-aup',
    'politeknik kp sidoarjo': 'poltek-kp-sidoarjo',
    'politeknik kp bitung': 'poltek-kp-bitung',
    'politeknik kp sorong': 'poltek-kp-sorong',
    'politeknik kp karawang': 'poltek-kp-karawang',
    'politeknik kp kupang': 'poltek-kp-kupang',
    'politeknik kp bone': 'poltek-kp-bone',
    'politeknik kp pangandaran': 'poltek-kp-pangandaran',
    'politeknik kp dumai': 'poltek-kp-dumai',
    'politeknik kp jembrana': 'poltek-kp-jembrana',
    'akkp wakatobi': 'akkp-wakatobi',
    'supm ladong': 'supm-ladong',
    'supm pariaman': 'supm-pariaman',
    'supm kota agung': 'supm-kotaagung',
    'supm tegal': 'supm-tegal',
    'supm waiheru': 'supm-waiheru',
}


def read_workbook(path):
    """Mengembalikan {nama_sheet: [(nomor_baris, {kolom: nilai})]}"""
    sheets = {}
    with zipfile.ZipFile(path) as z:
        shared = []
        if 'xl/sharedStrings.xml' in z.namelist():
            root = ET.fromstring(z.read('xl/sharedStrings.xml'))
            for si in root.findall('.//ns:si', NS):
                shared.append(''.join(t.text or '' for t in si.findall('.//ns:t', NS)))
        wb = ET.fromstring(z.read('xl/workbook.xml'))
        rels = ET.fromstring(z.read('xl/_rels/workbook.xml.rels'))
        targets = {r.attrib['Id']: r.attrib['Target'] for r in rels}
        for sh in wb.findall('.//ns:sheet', NS):
            target = targets[sh.attrib[REL_ID]].lstrip('/')
            if not target.startswith('xl/'):
                target = 'xl/' + target
            xml = ET.fromstring(z.read(target))
            rows = []
            for row in xml.findall('.//ns:row', NS):
                vals = {}
                for c in row.findall('ns:c', NS):
                    v = c.find('ns:v', NS)
                    val = v.text if v is not None else ''
                    if c.attrib.get('t') == 's' and val != '':
                        val = shared[int(val)]
                    elif c.attrib.get('t') == 'inlineStr':
                        val = ''.join(t.text or '' for t in c.findall('.//ns:t', NS))
                    val = (val or '').strip()
                    if val:
                        vals[re.match(r'[A-Z]+', c.attrib['r']).group(0)] = val
                rows.append((int(row.attrib['r']), vals))
            sheets[sh.attrib['name']] = rows
    return sheets


def num(value):
    if value is None or value == '':
        return 0.0
    try:
        return float(str(value).replace(' ', ''))
    except ValueError:
        return 0.0


def r2(value):
    return round(value + 0.0, 2)


def clean_name(raw):
    name = re.sub(r'\s+', ' ', raw).strip()
    name = re.sub(r'^\d+\s+', '', name)          # "1 THUNNUS" -> "THUNNUS"
    name = re.sub(r'\s*-\s*$', '', name)          # "Patin (Taruna) -" -> "Patin (Taruna)"
    if name.count('(') > name.count(')'):         # "EPHYRA (Taruna" -> "EPHYRA (Taruna)"
        name += ')'
    return name


def clean_size(raw):
    if not raw:
        return ''
    s = re.sub(r'\s+', ' ', raw).strip()
    s = re.sub(r'\s*m\b', '', s, flags=re.I)        # buang satuan "m"
    s = re.sub(r'\s*[xX]\s*', ' x ', s)
    return s + ' m'


def detect_gender(name):
    n = name.lower()
    if 'putri' in n or 'taruni' in n:
        return 'Putri'
    if 'putra' in n or 'taruna' in n:
        return 'Putra'
    return 'Tidak disebut'


def status_from_notes(notes):
    joined = ' '.join(notes).lower()
    if 'tidak dipakai' in joined or 'kosong' in joined:
        return 'Tidak Dipakai'
    if 'renovasi' in joined:
        return 'Perlu Renovasi'
    return 'Digunakan'


def parse_detail_sheet(code, rows):
    satdik_id = SHEET_TO_SATDIK[code]
    title = next((v.get('A') for r, v in rows if r == 2 and v.get('A')), code)
    header_row = next(r for r, v in rows if v.get('A') == 'No')
    buildings, current, kampus = [], None, None

    for r, v in rows:
        if r <= header_row or not v:
            continue
        b = v.get('B', '')
        if b.upper().startswith('JUMLAH'):
            continue
        if b.upper().startswith('KAMPUS ') and 'A' not in v:
            kampus = b.title()
            continue

        is_new = bool(re.fullmatch(r'\d+', v.get('A', '')))
        if is_new:
            current = {
                'nama': clean_name(b),
                'kampus': kampus,
                'rincian': [],
                'keterangan': [],
            }
            buildings.append(current)
        if current is None:
            continue

        if v.get('G') and not re.fullmatch(r'[\d.]+', v['G']):
            if v['G'] not in current['keterangan']:
                current['keterangan'].append(v['G'])

        if any(k in v for k in ('C', 'D', 'E', 'F')):
            label = clean_name(b) if b else ''
            current['rincian'].append({
                'label': label,
                'ukuran': clean_size(v.get('C', '')),
                'jumlah': int(num(v.get('D'))),
                'luasM2': r2(num(v.get('E'))),
                'kapasitas': r2(num(v.get('F'))),
            })

    # Penamaan unik per satdik + agregasi
    seen = {}
    result = []
    for idx, bld in enumerate(buildings, start=1):
        base = bld['nama']
        seen[base] = seen.get(base, 0) + 1
        nama = base if seen[base] == 1 else f'{base} ({seen[base]})'
        result.append({
            'id': f'ASR-{code}-{idx:03d}',
            'satdikId': satdik_id,
            'kampus': bld['kampus'],
            'nama': nama,
            'peruntukan': detect_gender(base),
            'jumlahKamar': sum(x['jumlah'] for x in bld['rincian']),
            'luasM2': r2(sum(x['luasM2'] for x in bld['rincian'])),
            'kapasitas': r2(sum(x['kapasitas'] for x in bld['rincian'])),
            'status': status_from_notes(bld['keterangan']),
            'keterangan': '; '.join(bld['keterangan']),
            'rincian': bld['rincian'],
        })
    return title, result


def parse_rekap(rows):
    header_row = next(r for r, v in rows if v.get('A') == 'No')
    summary = {}
    for r, v in rows:
        if r <= header_row or not v.get('B') or v['B'].upper().startswith('JUMLAH'):
            continue
        key = re.sub(r'\s+', ' ', v['B']).strip().lower()
        satdik_id = REKAP_NAME_TO_SATDIK.get(key)
        if not satdik_id:
            print(f'  [PERINGATAN] Nama satdik di Rekap tidak dikenali: {v["B"]!r}', file=sys.stderr)
            continue
        summary[satdik_id] = {
            'satdikId': satdik_id,
            'namaExcel': v['B'].strip(),
            'jumlahAsrama': int(num(v.get('C'))),
            'jumlahKamar': int(num(v.get('D'))),
            'luasM2': r2(num(v.get('E'))),
            'kapasitas': r2(num(v.get('F'))),
            'luasAdjustment': r2(num(v.get('J'))) if v.get('J') else None,
            'kapasitasAdjustment': r2(num(v.get('K'))) if v.get('K') else None,
            'keterangan': v.get('G', ''),
            'driveUrl': v.get('H', ''),
        }
    return summary


def main():
    if not os.path.exists(XLSX):
        sys.exit(f'File Excel tidak ditemukan: {XLSX}')
    sheets = read_workbook(XLSX)
    summary = parse_rekap(sheets['Rekap'])

    buildings, titles = [], {}
    for code in SHEET_TO_SATDIK:
        if code not in sheets:
            print(f'  [PERINGATAN] Sheet {code} tidak ada di Excel', file=sys.stderr)
            continue
        title, items = parse_detail_sheet(code, sheets[code])
        titles[SHEET_TO_SATDIK[code]] = title
        buildings.extend(items)

    # Validasi silang Rekap vs total detail
    print('Validasi Rekap vs Detail (unit / kamar / kapasitas):')
    for sid, s in summary.items():
        items = [b for b in buildings if b['satdikId'] == sid]
        unit, kamar, kap = len(items), sum(b['jumlahKamar'] for b in items), sum(b['kapasitas'] for b in items)
        aktif = sum(b['kapasitas'] for b in items if b['status'] != 'Tidak Dipakai')
        s['kapasitasAktif'] = r2(aktif)
        s['jumlahTidakDipakai'] = sum(1 for b in items if b['status'] == 'Tidak Dipakai')
        s['jumlahPerluRenovasi'] = sum(1 for b in items if b['status'] == 'Perlu Renovasi')
        flag = 'OK ' if (unit == s['jumlahAsrama'] and kamar == s['jumlahKamar'] and abs(kap - s['kapasitas']) < 5) else 'CEK'
        print(f'  {flag} {sid:24s} rekap {s["jumlahAsrama"]:>3}/{s["jumlahKamar"]:>4}/{s["kapasitas"]:>8.1f}'
              f'  detail {unit:>3}/{kamar:>4}/{kap:>8.1f}')

    dataset = {
        'meta': {
            'sumber': os.path.basename(XLSX),
            'tanggalData': '2025-07-05',
            'standarRuang': '4 m² per orang',
            'jumlahSatdik': len(summary),
            'jumlahGedung': len(buildings),
        },
        'summary': list(summary.values()),
        'buildings': buildings,
    }

    with open(OUT_JSON, 'w', encoding='utf-8') as f:
        json.dump(dataset, f, ensure_ascii=False, indent=2)

    js = (
        '/**\n'
        ' * ============================================================================\n'
        ' * Sarana dan Prasarana Satuan Pendidikan KP — Dataset Ketersediaan Ruang Asrama Taruna (16 Satdik)\n'
        ' * ============================================================================\n'
        f' * Sumber : Excel/{os.path.basename(XLSX)}\n'
        ' * FILE INI DIHASILKAN OTOMATIS oleh Database/import_asrama.py — jangan diedit manual.\n'
        ' * Jalankan ulang skrip tersebut bila file Excel diperbarui.\n'
        ' */\n'
        '(function (window) {\n'
        "  'use strict';\n"
        f'  window.SARPRAS_ASRAMA = {json.dumps(dataset, ensure_ascii=False, indent=2)};\n'
        '})(window);\n'
    )
    with open(OUT_JS, 'w', encoding='utf-8') as f:
        f.write(js)

    print(f'\nSelesai: {len(summary)} satdik, {len(buildings)} gedung asrama.')
    print(f'  -> {os.path.relpath(OUT_JSON, ROOT)}')
    print(f'  -> {os.path.relpath(OUT_JS, ROOT)}')


if __name__ == '__main__':
    main()
