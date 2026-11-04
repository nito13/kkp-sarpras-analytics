"""
Konverter Standar Minimal & Realisasi Sarpras Prodi (Excel) -> Dataset SIM-SARPRAS KKP
======================================================================================
Membaca file  Excel/Data Contoh.xlsx  (12 sheet aktif per Bidang/Rumpun Prodi + komentar
audit XML xl/comments1.xml) lalu menghasilkan:

  1. Database/standar_data.json   -> dipakai Database/seed.php untuk mengisi tabel MySQL
  2. Services/standar-data.js     -> dataset fallback Zero-Build untuk Frontend (window.SARPRAS_STANDAR)

Hanya memakai pustaka standar Python (zipfile + xml.etree.ElementTree, tanpa openpyxl).
Jalankan dari root projek:   python Database/import_standar_sarpras.py
"""
import json
import os
import re
import zipfile
import xml.etree.ElementTree as ET
from datetime import date

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
XLSX_PATH = os.path.join(ROOT, 'Excel', 'Data Contoh.xlsx')
OUT_JSON = os.path.join(ROOT, 'Database', 'standar_data.json')
OUT_JS = os.path.join(ROOT, 'Services', 'standar-data.js')

NS = {'ns': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
REL_ID = '{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id'

# Pemetaan nama kampus pada header Excel (termasuk typo) -> ID Satdik di master data
CAMPUS_TO_SATDIK = {
    'oii kampus jakarta': 'poltek-aup',
    'oii kampus sidoarjo': 'poltek-kp-sidoarjo',
    'oii kamus sidoarjo': 'poltek-kp-sidoarjo',   # koreksi typo pada sheet Patologi
    'oii kampus bitung': 'poltek-kp-bitung',
    'oii kampus sorong': 'poltek-kp-sorong',
    'oii kampus karawang': 'poltek-kp-karawang',
    'oii kampus bone': 'poltek-kp-bone',
    'oii kampus kupang': 'poltek-kp-kupang',
    'oii kampus dumai': 'poltek-kp-dumai',
    'oii kampus pangandaran': 'poltek-kp-pangandaran',
    'oii kampus jembrana': 'poltek-kp-jembrana',
    'ak kp wakatobi': 'akkp-wakatobi',
}

# Metadata 12 Sheet Bidang / Rumpun Program Studi
SHEET_CONFIG = {
    'Sarpras Pasca AUP': {
        'id': 'pasca_aup',
        'code': 'PSC',
        'nama': 'Pascasarjana Terapan (AUP)',
        'categoryId': 'kelautan_konservasi',
        'prodi': ['Magister Terapan Usaha Perikanan (Pascasarjana AUP)'],
    },
    'Penangkapan Ikan': {
        'id': 'penangkapan_ikan',
        'code': 'PIK',
        'nama': 'Penangkapan Ikan',
        'categoryId': 'penangkapan_ikan',
        'prodi': ['Teknologi Penangkapan Ikan', 'Teknik Penangkapan Ikan', 'Perikanan Tangkap'],
    },
    'Permesinan Kapal': {
        'id': 'permesinan_kapal',
        'code': 'PMK',
        'nama': 'Permesinan Kapal',
        'categoryId': 'permesinan_mekanisasi',
        'prodi': ['Permesinan Perikanan', 'Permesinan Kapal'],
    },
    'Budidaya': {
        'id': 'budidaya',
        'code': 'BDP',
        'nama': 'Budidaya Perikanan',
        'categoryId': 'budidaya_perikanan',
        'prodi': ['Teknologi Akuakultur', 'Teknik Budidaya Perikanan', 'Budidaya Ikan'],
    },
    'Mekanisasi BD dan Pngolahan': {
        'id': 'mekanisasi_kp',
        'code': 'MKN',
        'nama': 'Mekanisasi Budidaya & Pengolahan',
        'categoryId': 'permesinan_mekanisasi',
        'prodi': ['Mekanisasi Perikanan'],
    },
    'Pengolahan': {
        'id': 'pengolahan',
        'code': 'PGH',
        'nama': 'Pengolahan Hasil Perikanan',
        'categoryId': 'pengolahan_hasil',
        'prodi': ['Teknologi Pengolahan Hasil Perikanan', 'Teknik Pengolahan Produk Perikanan', 'Pengolahan Hasil Laut'],
    },
    'Pengelolaan SD Perairan': {
        'id': 'pengelolaan_sdp',
        'code': 'SDP',
        'nama': 'Pengelolaan Sumberdaya Perairan',
        'categoryId': 'kelautan_konservasi',
        'prodi': ['Teknologi Pengelolaan Sumberdaya Perairan'],
    },
    'Patologi': {
        'id': 'patologi',
        'code': 'PTL',
        'nama': 'Penanganan Patologi Perikanan',
        'categoryId': 'budidaya_perikanan',
        'prodi': ['Teknik Penanganan Patologi Perikanan'],
    },
    'Penyuluhan': {
        'id': 'penyuluhan',
        'code': 'PNY',
        'nama': 'Penyuluhan Perikanan',
        'categoryId': 'sosial_pemberdayaan',
        'prodi': ['Penyuluhan Perikanan'],
    },
    'Agribisnis Perikanan': {
        'id': 'agribisnis',
        'code': 'AGR',
        'nama': 'Agribisnis Perikanan',
        'categoryId': 'agribisnis_perikanan',
        'prodi': ['Agribisnis Perikanan'],
    },
    'Kelautan': {
        'id': 'kelautan',
        'code': 'KLT',
        'nama': 'Teknik & Teknologi Kelautan',
        'categoryId': 'kelautan_konservasi',
        'prodi': ['Teknik Kelautan', 'Teknologi Kelautan'],
    },
    'Konservasi dan Ekowisata': {
        'id': 'konservasi_ekowisata',
        'code': 'KSV',
        'nama': 'Konservasi & Ekowisata Bahari',
        'categoryId': 'kelautan_konservasi',
        'prodi': ['Konservasi', 'Ekowisata Bahari'],
    },
}


def col_to_idx(col):
    n = 0
    for ch in col:
        n = n * 26 + (ord(ch) - ord('A') + 1)
    return n


def idx_to_col(idx):
    out = ''
    while idx > 0:
        idx, rem = divmod(idx - 1, 26)
        out = chr(65 + rem) + out
    return out


def clean_text(raw):
    if raw is None:
        return ''
    s = str(raw).replace('\xa0', ' ').replace('\t', ' ')
    s = re.sub(r'\s+', ' ', s).strip()
    return s


def clean_comment(raw):
    if not raw:
        return ''
    lines = [ln.strip() for ln in str(raw).splitlines() if ln.strip()]
    filtered = [
        ln for ln in lines
        if not ln.startswith('====')
        and not ln.startswith('ID#')
        and not ln.lower().startswith('openai')
    ]
    return clean_text(' '.join(filtered))


def parse_float(val):
    if val is None:
        return None
    s = str(val).replace('\xa0', '').replace(' ', '').strip()
    if s == '':
        return None
    try:
        return float(s)
    except ValueError:
        return None


def fmt_num(val):
    if val is None:
        return 0
    iv = int(round(val))
    if abs(val - iv) < 1e-6:
        return iv
    return round(val, 2)


def read_workbook_with_comments(path):
    sheets_data = []
    with zipfile.ZipFile(path, 'r') as z:
        shared = []
        if 'xl/sharedStrings.xml' in z.namelist():
            sroot = ET.fromstring(z.read('xl/sharedStrings.xml'))
            for si in sroot.findall('.//ns:si', NS):
                shared.append(''.join(t.text or '' for t in si.findall('.//ns:t', NS)))

        wb = ET.fromstring(z.read('xl/workbook.xml'))
        rels = ET.fromstring(z.read('xl/_rels/workbook.xml.rels'))
        targets = {r.attrib['Id']: r.attrib['Target'] for r in rels}

        for sh in wb.findall('.//ns:sheet', NS):
            sname = sh.attrib['name']
            target = targets[sh.attrib[REL_ID]].lstrip('/')
            if not target.startswith('xl/'):
                target = 'xl/' + target

            # Cek apakah sheet memiliki relasi ke file comments*.xml
            sheet_rels_path = os.path.dirname(target) + '/_rels/' + os.path.basename(target) + '.rels'
            sheet_rels_path = sheet_rels_path.replace('\\', '/')
            comments_map = {}
            if sheet_rels_path in z.namelist():
                sr_xml = ET.fromstring(z.read(sheet_rels_path))
                for rel in sr_xml:
                    rtype = rel.attrib.get('Type', '')
                    if 'comments' in rtype.lower():
                        ctarget = rel.attrib.get('Target', '')
                        # Resolve relative ../comments1.xml -> xl/comments1.xml
                        cpath = 'xl/' + ctarget.lstrip('./').replace('../', '')
                        if cpath in z.namelist():
                            croot = ET.fromstring(z.read(cpath))
                            for cm in croot.findall('.//ns:comment', NS):
                                cref = cm.attrib.get('ref', '')
                                ctxt = ''.join(t.text or '' for t in cm.findall('.//ns:t', NS))
                                cleaned = clean_comment(ctxt)
                                if cref and cleaned:
                                    comments_map[cref] = cleaned

            sroot = ET.fromstring(z.read(target))
            rows = {}
            for r in sroot.findall('.//ns:sheetData/ns:row', NS):
                rnum = int(r.attrib['r'])
                rcells = {}
                for c in r.findall('ns:c', NS):
                    cref = c.attrib['r']
                    col = re.match(r'([A-Z]+)', cref).group(1)
                    ctype = c.attrib.get('t')
                    v_el = c.find('ns:v', NS)
                    val = v_el.text if v_el is not None else ''
                    if ctype == 's' and val != '':
                        val = shared[int(val)]
                    elif ctype == 'inlineStr':
                        val = ''.join(t.text or '' for t in c.findall('.//ns:t', NS))
                    val_clean = clean_text(val)
                    if val_clean != '':
                        rcells[col] = val_clean
                if rcells:
                    rows[rnum] = rcells

            sheets_data.append((sname, rows, comments_map))
    return sheets_data


def main():
    if not os.path.exists(XLSX_PATH):
        raise SystemExit(f'File Excel tidak ditemukan: {XLSX_PATH}')

    sheets_data = read_workbook_with_comments(XLSX_PATH)

    bidang_list = []
    rekap_list = []
    items_list = []
    all_satdik_seen = []

    for sname, rows, comments_map in sheets_data:
        if sname not in SHEET_CONFIG or not rows:
            continue

        cfg = SHEET_CONFIG[sname]
        bidang_id = cfg['id']
        code_prefix = cfg['code']

        # Deteksi kolom awal ('A' atau 'B') dari 10 baris teratas
        start_col = 'B'
        for rnum in sorted(rows)[:10]:
            if rows[rnum].get('A', '').lower().startswith('no'):
                start_col = 'A'
                break

        s_idx = col_to_idx(start_col)
        no_col = start_col
        name_col = idx_to_col(s_idx + 1)
        vol_col = idx_to_col(s_idx + 2)
        sat_col = idx_to_col(s_idx + 3)

        # Petakan kolom kampus dari header tabel atas (baris 1..10)
        campus_cols = {}  # col_letter -> satdik_id
        note_cols = set()
        for rnum in sorted(rows)[:10]:
            for col, val in rows[rnum].items():
                low = val.lower()
                if low in CAMPUS_TO_SATDIK:
                    sid = CAMPUS_TO_SATDIK[low]
                    campus_cols[col] = sid
                    if sid not in all_satdik_seen:
                        all_satdik_seen.append(sid)
                elif low in ('catatan', 'deskripsi', 'keterangan'):
                    note_cols.add(col)

        # Deteksi juga kolom catatan di sub-header bagian B (mis. Status Eksisting / Deskripsi)
        max_campus_idx = max((col_to_idx(c) for c in campus_cols), default=s_idx + 4)
        for rnum in sorted(rows):
            rc = rows[rnum]
            if any(v in ('No.', 'No', 'Vol') for v in rc.values()):
                for col, val in rc.items():
                    cidx = col_to_idx(col)
                    if cidx > max_campus_idx and cidx <= 15:
                        if val.lower() in ('catatan', 'deskripsi', 'status eksisting'):
                            note_cols.add(col)

        ordered_campus_cols = sorted(campus_cols.items(), key=lambda x: col_to_idx(x[0]))
        satdik_ids = [sid for _, sid in ordered_campus_cols]

        current_sec = 'A'          # 'A' (Prasarana) atau 'B' (Sarana)
        current_sub_sec = 'A'      # 'A', 'B.1', 'B.2'
        parent_super_grp = ''      # mis. A.1 PRASARANA FUNGSI PERMESINAN KAPAL
        current_grp_code = ''      # mis. A.1.1 atau B.2.1
        current_grp_name = ''      # mis. WORKSHOP MESIN POKOK
        current_sub_room = ''      # mis. Ruang Praktikum / Ruang produksi
        current_item_cat = ''      # mis. Perabot / Peralatan
        group_notes = {}           # grp_code -> note text

        seq_a = 0
        seq_b = 0
        sheet_items = []

        for rnum in sorted(rows):
            rc = rows[rnum]
            c_no = rc.get(no_col, '')
            c_name = rc.get(name_col, '')

            # Kumpulkan komentar XML pada baris ini (jika ada)
            row_comments = []
            for col_let, sid in ordered_campus_cols:
                cref = f'{col_let}{rnum}'
                if cref in comments_map:
                    row_comments.append(comments_map[cref])

            # 1. Cek pergantian Seksi Utama A / B / B.1 / B.2
            if c_no in ('A.', 'A') and 'PRASARANA' in c_name.upper():
                current_sec = 'A'
                current_sub_sec = 'A'
                current_sub_room = ''
                current_item_cat = ''
                continue
            if c_no in ('B.', 'B') and 'SARANA' in c_name.upper():
                current_sec = 'B'
                current_sub_sec = 'B'
                parent_super_grp = ''
                current_sub_room = ''
                current_item_cat = ''
                continue
            if re.match(r'^B\.[12]\.?$', c_no) and 'SARANA' in c_name.upper():
                current_sec = 'B'
                current_sub_sec = c_no.rstrip('.')
                current_sub_room = ''
                current_item_cat = ''
                continue

            # 2. Lewati baris header tabel ('No.', 'Vol', 'Jenis Prasarana', dsb.)
            if c_no.lower() in ('no.', 'no') or rc.get(vol_col, '').lower() == 'vol':
                continue

            # 3. Cek baris Grup Induk (A.1, A.1.1, B.1.1, B.2.1.1, dst.)
            if re.match(r'^[AB]\.\d+(\.\d+)*\.?$', c_no):
                gcode = c_no.rstrip('.')
                parts = gcode.split('.')
                if len(parts) == 2 and current_sec == 'A' and sname == 'Permesinan Kapal':
                    # Di Permesinan Kapal, A.1 / A.2 / A.3 adalah fungsi induk di atas A.1.1
                    parent_super_grp = c_name
                    current_grp_code = gcode
                    current_grp_name = c_name
                elif len(parts) == 3 and current_sec == 'B' and sname in ('Penangkapan Ikan', 'Permesinan Kapal') and gcode.startswith('B.2.'):
                    parent_super_grp = c_name
                    current_grp_code = gcode
                    current_grp_name = c_name
                else:
                    current_grp_code = gcode
                    current_grp_name = c_name
                current_sub_room = ''
                current_item_cat = ''
                if row_comments:
                    group_notes[current_grp_code] = ' | '.join(row_comments)
                continue

            # 4. Cek sub-kategori 'A. Perabot' / 'B. Peralatan'
            if re.match(r'^[AB]\.?$', c_no) and c_name.lower() in ('perabot', 'peralatan'):
                current_item_cat = c_name.title()
                continue

            # 5. Cek sub-ruang berhuruf di kolom nama pada Seksi B (mis. 'a. Ruang Praktikum')
            std_vol = parse_float(rc.get(vol_col))
            has_any_campus_val = any(parse_float(rc.get(c)) is not None for c, _ in ordered_campus_cols)

            if current_sec == 'B' and c_no == '' and re.match(r'^[a-z]\.\s*', c_name):
                if not has_any_campus_val:
                    current_sub_room = re.sub(r'^[a-z]\.\s*', '', c_name).strip()
                    current_item_cat = ''
                    continue

            # 6. Cek baris induk ruang bernomor tanpa stdVol (mis. '9. Ruang produksi' di Budidaya)
            if std_vol is None:
                if re.match(r'^\d+(\.0|\.)?$', c_no) and c_name:
                    current_sub_room = c_name
                continue

            # 7. Baris Item Standar (Leaf Item) dengan std_vol numerik > 0
            satuan = rc.get(sat_col, 'Unit') or 'Unit'
            item_name = c_name
            item_no = c_no

            # Jika penomoran huruf menempel pada nama (mis. 'a. Wadah karantina' di Budidaya A.1)
            m_alpha = re.match(r'^([a-z])\.\s*(.+)$', item_name)
            if item_no == '' and m_alpha:
                item_no = m_alpha.group(1)
                item_name = m_alpha.group(2).strip()
            else:
                # Rapikan '1.0' -> '1', '1.' -> '1'
                m_num = re.match(r'^(\d+)(?:\.0|\.)?$', item_no)
                if m_num:
                    item_no = m_num.group(1)
                    if current_sec == 'A':
                        # Reset sub_room jika kembali ke item angka baru pada Seksi A
                        current_sub_room = ''

            if not item_name:
                continue

            # Ambil realisasi per kampus
            real_map = {}
            for col_let, sid in ordered_campus_cols:
                rv = parse_float(rc.get(col_let))
                real_map[sid] = fmt_num(rv) if rv is not None else 0

            # Ambil catatan / kode kondisi dari kolom catatan + komentar XML
            notes_parts = []
            kondisi_kode = ''
            for ncol in sorted(note_cols, key=col_to_idx):
                nval = rc.get(ncol, '').strip()
                if not nval:
                    continue
                up = nval.upper()
                if up in ('B', 'RR', 'RB'):
                    kondisi_kode = up
                elif up in ('ADA', 'TIDAK ADA'):
                    # Status Ada/Tidak Ada sudah tercermin dari angka realisasi, simpan hanya bila kontradiktif
                    pass
                else:
                    notes_parts.append(nval)
            if row_comments:
                notes_parts.extend(row_comments)

            ket_text = ' | '.join(dict.fromkeys(notes_parts))

            # Susun label sub-grup kontekstual (gabungan sub_room + Perabot/Peralatan bila ada)
            sub_parts = [p for p in (current_sub_room, current_item_cat) if p]
            sub_grp = ' — '.join(sub_parts)

            if current_sec == 'A':
                seq_a += 1
                item_id = f'{code_prefix}-A-{seq_a:03d}'
            else:
                seq_b += 1
                item_id = f'{code_prefix}-B-{seq_b:03d}'

            item_obj = {
                'id': item_id,
                'bidangId': bidang_id,
                'sec': current_sec,
                'subSec': current_sub_sec,
                'grpCode': current_grp_code or current_sec,
                'grpName': current_grp_name or ('PRASARANA' if current_sec == 'A' else 'SARANA'),
                'subGrp': sub_grp,
                'no': item_no,
                'nama': item_name,
                'stdVol': fmt_num(std_vol),
                'satuan': satuan,
                'real': real_map,
            }
            if kondisi_kode:
                item_obj['kondisi'] = kondisi_kode
            if ket_text:
                item_obj['ket'] = ket_text

            sheet_items.append(item_obj)
            items_list.append(item_obj)

        # Hitung rekapitulasi per (bidang, satdik)
        for sid in satdik_ids:
            p_tot = p_full = p_part = p_zero = 0
            s_tot = s_full = s_part = s_zero = 0
            p_score_sum = 0.0
            s_score_sum = 0.0
            std_vol_sum = 0.0
            real_vol_sum = 0.0

            for it in sheet_items:
                sv = float(it['stdVol'] or 0)
                rv = float(it['real'].get(sid, 0) or 0)
                std_vol_sum += sv
                real_vol_sum += rv
                ratio_item = 1.0 if (sv <= 0 and rv > 0) else (min(1.0, rv / sv) if sv > 0 else 0.0)

                if it['sec'] == 'A':
                    p_tot += 1
                    p_score_sum += ratio_item
                    if sv > 0 and rv >= sv:
                        p_full += 1
                    elif rv > 0:
                        p_part += 1
                    else:
                        p_zero += 1
                else:
                    s_tot += 1
                    s_score_sum += ratio_item
                    if sv > 0 and rv >= sv:
                        s_full += 1
                    elif rv > 0:
                        s_part += 1
                    else:
                        s_zero += 1

            tot_items = p_tot + s_tot
            tot_full = p_full + s_full
            tot_part = p_part + s_part
            tot_zero = p_zero + s_zero

            persen_p = round((p_score_sum / p_tot) * 100, 1) if p_tot > 0 else 0.0
            persen_s = round((s_score_sum / s_tot) * 100, 1) if s_tot > 0 else 0.0
            persen_all = round(((p_score_sum + s_score_sum) / tot_items) * 100, 1) if tot_items > 0 else 0.0

            rekap_list.append({
                'id': f'{code_prefix}-{sid}',
                'bidangId': bidang_id,
                'satdikId': sid,
                'prasaranaTotal': p_tot,
                'prasaranaTerpenuhi': p_full,
                'prasaranaSebagian': p_part,
                'prasaranaKosong': p_zero,
                'saranaTotal': s_tot,
                'saranaTerpenuhi': s_full,
                'saranaSebagian': s_part,
                'saranaKosong': s_zero,
                'totalItems': tot_items,
                'totalTerpenuhi': tot_full,
                'totalSebagian': tot_part,
                'totalKosong': tot_zero,
                'persenPrasarana': persen_p,
                'persenSarana': persen_s,
                'persenTotal': persen_all,
                'stdVolSum': fmt_num(std_vol_sum),
                'realVolSum': fmt_num(real_vol_sum),
            })

        bidang_list.append({
            'id': bidang_id,
            'code': code_prefix,
            'sheetName': sname,
            'nama': cfg['nama'],
            'categoryId': cfg['categoryId'],
            'prodi': cfg['prodi'],
            'satdikIds': satdik_ids,
            'prasaranaCount': seq_a,
            'saranaCount': seq_b,
            'totalItems': seq_a + seq_b,
            'groupNotes': group_notes,
        })

    total_p = sum(b['prasaranaCount'] for b in bidang_list)
    total_s = sum(b['saranaCount'] for b in bidang_list)
    total_cells = sum(b['totalItems'] * len(b['satdikIds']) for b in bidang_list)

    payload = {
        'meta': {
            'sumber': 'Data Contoh.xlsx',
            'tanggalData': str(date.today()),
            'jumlahBidang': len(bidang_list),
            'jumlahSatdik': len(all_satdik_seen),
            'satdikIds': all_satdik_seen,
            'totalPrasarana': total_p,
            'totalSarana': total_s,
            'totalItems': total_p + total_s,
            'totalTitikRealisasi': total_cells,
        },
        'bidang': bidang_list,
        'rekap': rekap_list,
        'items': items_list,
    }

    with open(OUT_JSON, 'w', encoding='utf-8') as f:
        json.dump(payload, f, ensure_ascii=False, separators=(',', ':'))

    js_header = (
        '/**\n'
        ' * ============================================================================\n'
        ' * SARPRAS KKP — Dataset Pemenuhan Standar Minimal Sarpras Prodi (Zero-Build)\n'
        ' * Sumber: Excel/Data Contoh.xlsx (12 Rumpun Prodi, 11 Satdik Pendidikan Tinggi)\n'
        ' * Dihasilkan otomatis oleh Database/import_standar_sarpras.py\n'
        ' * ============================================================================\n'
        ' */\n'
        '(function (window) {\n'
        "  'use strict';\n"
        '  window.SARPRAS_STANDAR = '
    )
    js_footer = ';\n})(window);\n'

    with open(OUT_JS, 'w', encoding='utf-8') as f:
        f.write(js_header)
        json.dump(payload, f, ensure_ascii=False, separators=(',', ':'))
        f.write(js_footer)

    json_kb = os.path.getsize(OUT_JSON) / 1024
    js_kb = os.path.getsize(OUT_JS) / 1024
    print(f'Berhasil mengekstrak {len(bidang_list)} bidang, {len(all_satdik_seen)} satdik, {len(rekap_list)} baris rekap.')
    print(f'Total item standar: {total_p + total_s} (Prasarana: {total_p}, Sarana: {total_s}), Titik realisasi: {total_cells}.')
    print(f'Ukuran output -> JSON: {json_kb:.1f} KB | JS: {js_kb:.1f} KB')
    for b in bidang_list:
        print(f"  - {b['nama']:34s} | Kampus={len(b['satdikIds'])} | A={b['prasaranaCount']:3d} | B={b['saranaCount']:3d} | Total={b['totalItems']:3d}")


if __name__ == '__main__':
    main()
