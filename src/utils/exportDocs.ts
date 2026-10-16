import * as XLSX from 'xlsx';
import {
  Document,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle,
  HeadingLevel,
  Packer,
  Header,
} from 'docx';
import {
  ReportMeta,
  AkunNeracaRow,
  AkunMutasiRow,
  AssetItemRow,
  PersediaanRow,
  ComparisonRow,
  TrendRow,
  StatusPenggunaanRow,
  ValidationFinding,
  AnalysisFinding,
  BriefingSummary,
} from '../types/bmn';
import { formatRupiah, terbilang } from './terbilang';
import { fixedSectionsData } from '../data/sampleBmnData';

export function exportToExcel(params: {
  meta: ReportMeta;
  neracaRows: AkunNeracaRow[];
  mutasiRows: AkunMutasiRow[];
  assetRows: AssetItemRow[];
  persediaanRows: PersediaanRow[];
  comparisonRows: ComparisonRow[];
  trendRows: TrendRow[];
  pspRows: StatusPenggunaanRow[];
  validationFindings: ValidationFinding[];
  briefing: BriefingSummary;
}) {
  const wb = XLSX.utils.book_new();

  // 1. Ringkasan Neraca (F.3.a)
  const neracaData = params.neracaRows.map((r, i) => ({
    No: i + 1,
    'Kode Akun': r.kodeAkun,
    'Akun Neraca': r.akunNeraca,
    'Intrakomptabel (Rp)': r.intraRp,
    'Persen Intra (%)': r.persenIntra,
    'Ekstrakomptabel (Rp)': r.ekstraRp,
    'Persen Ekstra (%)': r.persenEkstra,
    'Gabungan (Rp)': r.gabunganRp,
    'Persen Gabungan (%)': r.persenGabungan,
    'Akum. Penyusutan Total (Rp)': r.akumPenyusutanTotal,
    'Nilai Buku (Rp)': r.nilaiBuku,
    Sumber: `${r.ref.file} [${r.ref.sheet}:${r.ref.baris}]`,
  }));
  const wsNeraca = XLSX.utils.json_to_sheet(neracaData);
  XLSX.utils.book_append_sheet(wb, wsNeraca, 'F3a_Neraca_BMN');

  // 2. Saldo dan Mutasi (F.1 & F.2)
  const mutasiData = params.mutasiRows.map((r, i) => ({
    No: i + 1,
    'Kode Akun': r.kodeAkun,
    'Uraian Akun': r.akun,
    'Saldo Awal (Rp)': r.saldoAwal,
    'Mutasi Tambah (Rp)': r.mutasiTambah,
    'Mutasi Kurang (Rp)': r.mutasiKurang,
    'Saldo Akhir (Rp)': r.saldoAkhir,
    'Sebab Mutasi': r.sebabMutasi,
    Sumber: `${r.ref.file} [${r.ref.sheet}:${r.ref.baris}]`,
  }));
  const wsMutasi = XLSX.utils.json_to_sheet(mutasiData);
  XLSX.utils.book_append_sheet(wb, wsMutasi, 'F1_F2_Mutasi_Akun');

  // 3. Rincian Aset SIMAN
  const assetData = params.assetRows.map((r, i) => ({
    No: i + 1,
    'Kode Barang': r.kode,
    'Uraian Spesifikasi': r.uraian,
    Bidang: r.bidang,
    Kuantitas: r.kuantitas,
    Satuan: r.satuan,
    'Nilai Perolehan (Rp)': r.nilai,
    'Akum. Penyusutan (Rp)': r.akPenyusutan,
    'Nilai Buku (Rp)': r.nilaiBuku,
    Kondisi: r.kondisi,
    'Status PSP': r.statusPSP,
    'No SK PSP': r.noSKPSP || '-',
    Sumber: `${r.ref.file} [${r.ref.sheet}:${r.ref.baris}]`,
  }));
  const wsAsset = XLSX.utils.json_to_sheet(assetData);
  XLSX.utils.book_append_sheet(wb, wsAsset, 'Rincian_Aset_SIMAN');

  // 4. Persediaan
  const persediaanData = params.persediaanRows.map((r, i) => ({
    No: i + 1,
    'Kode Barang': r.kode,
    'Uraian Persediaan': r.uraian,
    'Saldo Awal (Rp)': r.saldoAwal,
    'Mutasi Tambah (Rp)': r.mutasiTambah,
    'Mutasi Kurang (Rp)': r.mutasiKurang,
    'Saldo Akhir (Rp)': r.saldoAkhir,
    Satuan: r.satuan,
    Sumber: `${r.ref.file} [${r.ref.sheet}:${r.ref.baris}]`,
  }));
  const wsPersediaan = XLSX.utils.json_to_sheet(persediaanData);
  XLSX.utils.book_append_sheet(wb, wsPersediaan, 'Persediaan');

  // 5. Perbandingan LB vs LK (F.3.b)
  const compData = params.comparisonRows.map((r, i) => ({
    No: i + 1,
    'Akun Neraca': r.akunNeraca,
    'Laporan Barang (Rp)': r.laporanBarang,
    'Laporan Keuangan (Rp)': r.laporanKeuangan,
    'Selisih (Rp)': r.selisih,
    'Selisih (%)': r.selisihPersen,
    Keterangan: r.keterangan,
    Status: r.status,
    Sumber: `${r.ref.file} [${r.ref.sheet}:${r.ref.baris}]`,
  }));
  const wsComp = XLSX.utils.json_to_sheet(compData);
  XLSX.utils.book_append_sheet(wb, wsComp, 'F3b_LB_vs_LK');

  // 6. Trend G.1
  const trendData = params.trendRows.map((r, i) => ({
    No: i + 1,
    Periode: r.periode,
    'Nilai BMN (Rp)': r.nilaiBMN,
    'Perkembangan (Rp)': r.perkembanganRp,
    'Perkembangan (%)': r.perkembanganPersen,
    Keterangan: r.keterangan,
  }));
  const wsTrend = XLSX.utils.json_to_sheet(trendData);
  XLSX.utils.book_append_sheet(wb, wsTrend, 'G1_Perkembangan_BMN');

  // 7. PSP Status (G.2)
  const pspData = params.pspRows.map((r, i) => ({
    No: i + 1,
    'Akun / Kelompok': r.akun,
    'Sudah PSP (Rp)': r.sudahDitetapkanRp,
    'Belum PSP (Rp)': r.belumDitetapkanRp,
    'Total (Rp)': r.totalRp,
    'Rasio PSP (%)': r.persenSudah,
  }));
  const wsPSP = XLSX.utils.json_to_sheet(pspData);
  XLSX.utils.book_append_sheet(wb, wsPSP, 'G2_Status_Penggunaan');

  // 8. Hasil Validasi
  const valData = params.validationFindings.map((r, i) => ({
    No: i + 1,
    Kategori: r.kategori,
    Status: r.status,
    Uraian: r.uraian,
    Aturan: r.aturan,
    'Nilai Ditemukan': r.nilaiDitemukan,
    'Nilai Diharapkan': r.nilaiDiharapkan,
    Lokasi: `${r.file} [${r.sheet}:${r.baris}]`,
    Dampak: r.dampak,
  }));
  const wsVal = XLSX.utils.json_to_sheet(valData);
  XLSX.utils.book_append_sheet(wb, wsVal, 'Hasil_Validasi_Sistem');

  const fileName = `DRAF_LBP_BMN_${params.meta.kodeSatker}_${params.meta.tahunAnggaran}.xlsx`;
  XLSX.writeFile(wb, fileName);
}

export async function exportToWord(params: {
  meta: ReportMeta;
  neracaRows: AkunNeracaRow[];
  mutasiRows: AkunMutasiRow[];
  assetRows: AssetItemRow[];
  persediaanRows: PersediaanRow[];
  comparisonRows: ComparisonRow[];
  trendRows: TrendRow[];
  pspRows: StatusPenggunaanRow[];
  findings: AnalysisFinding[];
  briefing: BriefingSummary;
  narasiBabE: string;
}) {
  const { meta, neracaRows, mutasiRows, assetRows, persediaanRows, comparisonRows, trendRows, pspRows, briefing, narasiBabE } = params;

  const totalGabungan = neracaRows.reduce((a, b) => a + b.gabunganRp, 0);
  const totalBuku = neracaRows.reduce((a, b) => a + b.nilaiBuku, 0);
  const totalPenyusutan = neracaRows.reduce((a, b) => a + b.akumPenyusutanTotal, 0);

  const cellBorder = {
    top: { style: BorderStyle.SINGLE, size: 1, color: 'C8D6E5' },
    bottom: { style: BorderStyle.SINGLE, size: 1, color: 'C8D6E5' },
    left: { style: BorderStyle.SINGLE, size: 1, color: 'C8D6E5' },
    right: { style: BorderStyle.SINGLE, size: 1, color: 'C8D6E5' },
  };

  const doc = new Document({
    sections: [
      {
        properties: {},
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: 'DRAF, BELUM DISAHKAN — ASISTEN ANALISIS LBP BMN BPT KOMDIGI',
                    size: 16,
                    color: '990000',
                    bold: true,
                  }),
                ],
              }),
            ],
          }),
        },
        children: [
          // Kop Surat Resmi Sesuai Gambar Referensi
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 100, after: 40 },
            children: [
              new TextRun({
                text: 'KEMENTERIAN KOMUNIKASI DAN DIGITAL RI',
                bold: true,
                size: 26,
                font: 'Arial',
                color: '2B2B2B',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 40 },
            children: [
              new TextRun({
                text: 'BADAN PENGEMBANGAN SUMBER DAYA MANUSIA KOMUNIKASI DAN DIGITAL',
                bold: true,
                size: 19,
                font: 'Arial',
                color: '333333',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 50 },
            children: [
              new TextRun({
                text: 'BALAI PELATIHAN TALENTA KOMUNIKASI DAN DIGITAL',
                bold: true,
                size: 24,
                font: 'Arial',
                color: '2B2B2B',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: 'Jl. Sekolah Hijau Kav. 2, Jababeka, Kab. Bekasi 17530, Telp. (021) 28645000, bpt.komdigi.go.id',
                size: 16,
                font: 'Arial',
                color: '3A3A3A',
              }),
            ],
          }),
          // Garis Horizontal Ganda Pembatas Resmi
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 250 },
            border: {
              bottom: { style: BorderStyle.DOUBLE, size: 18, color: '2B2B2B' },
            },
            children: [new TextRun({ text: '' })],
          }),

          // Nota Dinas
          new Paragraph({
            alignment: AlignmentType.CENTER,
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
            children: [new TextRun({ text: 'NOTA DINAS PENGANTAR', bold: true, size: 24, color: '1B3A6B' })],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Nomor        : ', bold: true }),
              new TextRun({ text: meta.nomorNotaDinas || 'ND-...../BPT.1/PL.02.01/...../2026' }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Tanggal      : ', bold: true }),
              new TextRun({ text: meta.tanggalNotaDinas || '.................... 2026' }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Kepada       : ', bold: true }),
              new TextRun({ text: meta.kepadaNotaDinas }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Dari         : ', bold: true }),
              new TextRun({ text: meta.dariNotaDinas }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Hal          : ', bold: true }),
              new TextRun({ text: meta.halNotaDinas }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Lampiran     : ', bold: true }),
              new TextRun({ text: meta.lampiranNotaDinas }),
            ],
          }),
          new Paragraph({
            spacing: { before: 150, after: 300 },
            children: [
              new TextRun({
                text:
                  'Bersama ini kami sampaikan Draf Laporan Barang Milik Negara pada Laporan Barang Kuasa Pengguna (LBP) Balai Pengembangan Talenta Komunikasi dan Digital ' +
                  meta.periode +
                  ' untuk diteliti dan diproses lebih lanjut sesuai dengan ketentuan penatausahaan BMN yang berlaku.',
              }),
            ],
          }),

          // Judul Laporan Utama
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 300, after: 150 },
            children: [
              new TextRun({
                text: 'LAPORAN BARANG MILIK NEGARA\nPADA LAPORAN BARANG KUASA PENGGUNA',
                bold: true,
                size: 26,
                color: '1B3A6B',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
            children: [
              new TextRun({
                text: `PERIODE ${meta.periode.toUpperCase()}`,
                bold: true,
                size: 22,
              }),
            ],
          }),

          // Bab A
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 100 },
            children: [new TextRun({ text: fixedSectionsData.babA.judul, bold: true, color: '1B3A6B' })],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '1. Dasar Hukum', bold: true }),
            ],
          }),
          ...fixedSectionsData.babA.dasarHukum.map(
            (dh, idx) =>
              new Paragraph({
                spacing: { after: 50 },
                children: [new TextRun({ text: `${String.fromCharCode(97 + idx)}. ${dh}` })],
              })
          ),
          new Paragraph({
            spacing: { before: 100 },
            children: [
              new TextRun({ text: '2. Entitas Pelaporan', bold: true }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `Nama Satuan Kerja : ${meta.namaSatker}\nKode Satuan Kerja : ${meta.kodeSatker}\nKementerian       : Kementerian Komunikasi dan Digital` }),
            ],
          }),
          new Paragraph({
            spacing: { before: 100, after: 200 },
            children: [
              new TextRun({ text: '3. Periode Pelaporan', bold: true }),
            ],
          }),
          new Paragraph({
            spacing: { after: 200 },
            children: [
              new TextRun({ text: `Laporan BMN ini disusun untuk ${meta.periode}, mencakup pencatatan intrakomptabel dan ekstrakomptabel.` }),
            ],
          }),

          // Bab B
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 100 },
            children: [new TextRun({ text: fixedSectionsData.babB.judul, bold: true, color: '1B3A6B' })],
          }),
          new Paragraph({
            spacing: { after: 100 },
            children: [
              new TextRun({ text: '1. Kebijakan Penggolongan dan Kodefikasi: ', bold: true }),
              new TextRun({ text: fixedSectionsData.babB.penggolongan }),
            ],
          }),
          new Paragraph({
            spacing: { after: 100 },
            children: [
              new TextRun({ text: '2. Kebijakan Kapitalisasi BMN: ', bold: true }),
              new TextRun({ text: fixedSectionsData.babB.kebijakanKapitalisasi }),
            ],
          }),
          new Paragraph({
            spacing: { after: 200 },
            children: [
              new TextRun({ text: '3. Kriteria Kondisi Barang: ', bold: true }),
              new TextRun({ text: 'Kondisi barang dicatat secara baku menjadi 3 (tiga) kategori: Baik (B), Rusak Ringan (RR), dan Rusak Berat (RB).' }),
            ],
          }),

          // Bab C
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 100 },
            children: [new TextRun({ text: fixedSectionsData.babC.judul, bold: true, color: '1B3A6B' })],
          }),
          new Paragraph({
            spacing: { after: 200 },
            children: [new TextRun({ text: fixedSectionsData.babC.isi })],
          }),

          // Bab D
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 100 },
            children: [new TextRun({ text: fixedSectionsData.babD.judul, bold: true, color: '1B3A6B' })],
          }),
          new Paragraph({
            spacing: { after: 200 },
            children: [new TextRun({ text: fixedSectionsData.babD.isi })],
          }),

          // Bab E
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 100 },
            children: [new TextRun({ text: 'E. PENDEKATAN PENYUSUNAN LAPORAN', bold: true, color: '1B3A6B' })],
          }),
          new Paragraph({
            spacing: { after: 150 },
            children: [
              new TextRun({
                text:
                  narasiBabE ||
                  `Total nilai Barang Milik Negara (BMN) yang dikelola oleh Balai Pengembangan Talenta Komunikasi dan Digital pada akhir ${meta.periode} tercatat sebesar ${formatRupiah(
                    totalGabungan
                  )} (${terbilang(totalGabungan)}). Nilai tersebut terdiri atas BMN Intrakomptabel sebesar ${formatRupiah(
                    neracaRows.reduce((a, b) => a + b.intraRp, 0)
                  )} dan BMN Ekstrakomptabel sebesar ${formatRupiah(
                    neracaRows.reduce((a, b) => a + b.ekstraRp, 0)
                  )}. Akumulasi penyusutan hingga periode ini mencapai ${formatRupiah(totalPenyusutan)}, sehingga Nilai Buku BMN adalah ${formatRupiah(
                    totalBuku
                  )}.`,
              }),
            ],
          }),

          // Bab F
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 100 },
            children: [new TextRun({ text: 'F. RINGKASAN BMN TAHUN ANGGARAN', bold: true, color: '1B3A6B' })],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'F.1 Saldo Awal dan Ringkasan Mutasi BMN', bold: true }),
            ],
          }),
          new Paragraph({
            spacing: { after: 150 },
            children: [
              new TextRun({
                text: `Berikut adalah ringkasan pergerakan mutasi BMN berdasarkan data transaksi SAKTI dan SIMAN untuk ${meta.periode}:`,
              }),
            ],
          }),

          // Tabel Mutasi
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ borders: cellBorder, children: [new Paragraph({ children: [new TextRun({ text: 'No', bold: true })] })] }),
                  new TableCell({ borders: cellBorder, children: [new Paragraph({ children: [new TextRun({ text: 'Uraian Akun', bold: true })] })] }),
                  new TableCell({ borders: cellBorder, children: [new Paragraph({ children: [new TextRun({ text: 'Saldo Awal (Rp)', bold: true })] })] }),
                  new TableCell({ borders: cellBorder, children: [new Paragraph({ children: [new TextRun({ text: 'Mutasi Tambah (Rp)', bold: true })] })] }),
                  new TableCell({ borders: cellBorder, children: [new Paragraph({ children: [new TextRun({ text: 'Mutasi Kurang (Rp)', bold: true })] })] }),
                  new TableCell({ borders: cellBorder, children: [new Paragraph({ children: [new TextRun({ text: 'Saldo Akhir (Rp)', bold: true })] })] }),
                ],
              }),
              ...mutasiRows.map(
                (r, idx) =>
                  new TableRow({
                    children: [
                      new TableCell({ borders: cellBorder, children: [new Paragraph({ text: String(idx + 1) })] }),
                      new TableCell({ borders: cellBorder, children: [new Paragraph({ text: r.akun })] }),
                      new TableCell({ borders: cellBorder, children: [new Paragraph({ text: formatRupiah(r.saldoAwal) })] }),
                      new TableCell({ borders: cellBorder, children: [new Paragraph({ text: formatRupiah(r.mutasiTambah) })] }),
                      new TableCell({ borders: cellBorder, children: [new Paragraph({ text: formatRupiah(r.mutasiKurang) })] }),
                      new TableCell({ borders: cellBorder, children: [new Paragraph({ text: formatRupiah(r.saldoAkhir) })] }),
                    ],
                  })
              ),
            ],
          }),

          // F.3.a Neraca
          new Paragraph({
            spacing: { before: 200, after: 100 },
            children: [
              new TextRun({ text: 'F.3.a BMN pada Laporan Barang Kuasa Pengguna per Akun Neraca', bold: true }),
            ],
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ borders: cellBorder, children: [new Paragraph({ children: [new TextRun({ text: 'Kode', bold: true })] })] }),
                  new TableCell({ borders: cellBorder, children: [new Paragraph({ children: [new TextRun({ text: 'Akun Neraca', bold: true })] })] }),
                  new TableCell({ borders: cellBorder, children: [new Paragraph({ children: [new TextRun({ text: 'Intra (Rp)', bold: true })] })] }),
                  new TableCell({ borders: cellBorder, children: [new Paragraph({ children: [new TextRun({ text: 'Ekstra (Rp)', bold: true })] })] }),
                  new TableCell({ borders: cellBorder, children: [new Paragraph({ children: [new TextRun({ text: 'Gabungan (Rp)', bold: true })] })] }),
                  new TableCell({ borders: cellBorder, children: [new Paragraph({ children: [new TextRun({ text: '%', bold: true })] })] }),
                  new TableCell({ borders: cellBorder, children: [new Paragraph({ children: [new TextRun({ text: 'Akum. Susut (Rp)', bold: true })] })] }),
                  new TableCell({ borders: cellBorder, children: [new Paragraph({ children: [new TextRun({ text: 'Nilai Buku (Rp)', bold: true })] })] }),
                ],
              }),
              ...neracaRows.map(
                (r) =>
                  new TableRow({
                    children: [
                      new TableCell({ borders: cellBorder, children: [new Paragraph({ text: r.kodeAkun })] }),
                      new TableCell({ borders: cellBorder, children: [new Paragraph({ text: r.akunNeraca })] }),
                      new TableCell({ borders: cellBorder, children: [new Paragraph({ text: formatRupiah(r.intraRp) })] }),
                      new TableCell({ borders: cellBorder, children: [new Paragraph({ text: formatRupiah(r.ekstraRp) })] }),
                      new TableCell({ borders: cellBorder, children: [new Paragraph({ text: formatRupiah(r.gabunganRp) })] }),
                      new TableCell({ borders: cellBorder, children: [new Paragraph({ text: `${r.persenGabungan.toFixed(2)}%` })] }),
                      new TableCell({ borders: cellBorder, children: [new Paragraph({ text: formatRupiah(r.akumPenyusutanTotal) })] }),
                      new TableCell({ borders: cellBorder, children: [new Paragraph({ text: formatRupiah(r.nilaiBuku) })] }),
                    ],
                  })
              ),
            ],
          }),

          // F.3.b Perbandingan LB vs LK
          new Paragraph({
            spacing: { before: 200, after: 100 },
            children: [
              new TextRun({ text: 'F.3.b Perbandingan Nilai BMN pada Laporan Barang dan Laporan Keuangan', bold: true }),
            ],
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ borders: cellBorder, children: [new Paragraph({ children: [new TextRun({ text: 'Akun Neraca', bold: true })] })] }),
                  new TableCell({ borders: cellBorder, children: [new Paragraph({ children: [new TextRun({ text: 'Laporan Barang', bold: true })] })] }),
                  new TableCell({ borders: cellBorder, children: [new Paragraph({ children: [new TextRun({ text: 'Laporan Keuangan', bold: true })] })] }),
                  new TableCell({ borders: cellBorder, children: [new Paragraph({ children: [new TextRun({ text: 'Selisih', bold: true })] })] }),
                  new TableCell({ borders: cellBorder, children: [new Paragraph({ children: [new TextRun({ text: 'Status & Keterangan', bold: true })] })] }),
                ],
              }),
              ...comparisonRows.map(
                (r) =>
                  new TableRow({
                    children: [
                      new TableCell({ borders: cellBorder, children: [new Paragraph({ text: r.akunNeraca })] }),
                      new TableCell({ borders: cellBorder, children: [new Paragraph({ text: formatRupiah(r.laporanBarang) })] }),
                      new TableCell({ borders: cellBorder, children: [new Paragraph({ text: formatRupiah(r.laporanKeuangan) })] }),
                      new TableCell({ borders: cellBorder, children: [new Paragraph({ text: formatRupiah(r.selisih) })] }),
                      new TableCell({ borders: cellBorder, children: [new Paragraph({ text: `${r.status} - ${r.keterangan}` })] }),
                    ],
                  })
              ),
            ],
          }),

          // Bab G
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 100 },
            children: [new TextRun({ text: 'G. INFORMASI BMN LAINNYA', bold: true, color: '1B3A6B' })],
          }),
          new Paragraph({
            children: [new TextRun({ text: '1. Perkembangan Nilai BMN Beberapa Periode Terakhir', bold: true })],
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ borders: cellBorder, children: [new Paragraph({ children: [new TextRun({ text: 'Periode', bold: true })] })] }),
                  new TableCell({ borders: cellBorder, children: [new Paragraph({ children: [new TextRun({ text: 'Nilai BMN (Rp)', bold: true })] })] }),
                  new TableCell({ borders: cellBorder, children: [new Paragraph({ children: [new TextRun({ text: 'Perkembangan (Rp)', bold: true })] })] }),
                  new TableCell({ borders: cellBorder, children: [new Paragraph({ children: [new TextRun({ text: 'Perkembangan (%)', bold: true })] })] }),
                  new TableCell({ borders: cellBorder, children: [new Paragraph({ children: [new TextRun({ text: 'Keterangan', bold: true })] })] }),
                ],
              }),
              ...trendRows.map(
                (r) =>
                  new TableRow({
                    children: [
                      new TableCell({ borders: cellBorder, children: [new Paragraph({ text: r.periode })] }),
                      new TableCell({ borders: cellBorder, children: [new Paragraph({ text: formatRupiah(r.nilaiBMN) })] }),
                      new TableCell({ borders: cellBorder, children: [new Paragraph({ text: formatRupiah(r.perkembanganRp) })] }),
                      new TableCell({ borders: cellBorder, children: [new Paragraph({ text: `${r.perkembanganPersen.toFixed(2)}%` })] }),
                      new TableCell({ borders: cellBorder, children: [new Paragraph({ text: r.keterangan })] }),
                    ],
                  })
              ),
            ],
          }),

          new Paragraph({
            spacing: { before: 150, after: 100 },
            children: [new TextRun({ text: '2. Informasi Pengelolaan BMN (Status Penggunaan / PSP)', bold: true })],
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ borders: cellBorder, children: [new Paragraph({ children: [new TextRun({ text: 'Kelompok Aset', bold: true })] })] }),
                  new TableCell({ borders: cellBorder, children: [new Paragraph({ children: [new TextRun({ text: 'Sudah PSP (Rp)', bold: true })] })] }),
                  new TableCell({ borders: cellBorder, children: [new Paragraph({ children: [new TextRun({ text: 'Belum PSP (Rp)', bold: true })] })] }),
                  new TableCell({ borders: cellBorder, children: [new Paragraph({ children: [new TextRun({ text: 'Rasio PSP (%)', bold: true })] })] }),
                ],
              }),
              ...pspRows.map(
                (r) =>
                  new TableRow({
                    children: [
                      new TableCell({ borders: cellBorder, children: [new Paragraph({ text: r.akun })] }),
                      new TableCell({ borders: cellBorder, children: [new Paragraph({ text: formatRupiah(r.sudahDitetapkanRp) })] }),
                      new TableCell({ borders: cellBorder, children: [new Paragraph({ text: formatRupiah(r.belumDitetapkanRp) })] }),
                      new TableCell({ borders: cellBorder, children: [new Paragraph({ text: `${r.persenSudah.toFixed(2)}%` })] }),
                    ],
                  })
              ),
            ],
          }),

          // Blok Pengesahan (Kosong untuk ditandatangani manual oleh pejabat berwenang)
          new Paragraph({
            spacing: { before: 400 },
            alignment: AlignmentType.RIGHT,
            children: [new TextRun({ text: `${meta.tempatLaporan}, ${meta.tanggalLaporan}` })],
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({ children: [new TextRun({ text: 'Penanggung Jawab Laporan BMN,\nPejabat Pembuat Komitmen (PPK)', bold: true })] }),
                      new Paragraph({ spacing: { before: 800 }, text: `(${meta.penanggungJawab || 'Firman Ahmad'})` }),
                      new Paragraph({ text: `NIP. ${meta.nipPenanggungJawab || '........................................'}` }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Pejabat Penatausahaan BMN,\nPengelola BMN', bold: true })] }),
                      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 800 }, text: `(${meta.pejabatPenatausahaan || 'Erni Rachmawati Thalib'})` }),
                      new Paragraph({ alignment: AlignmentType.CENTER, text: `NIP. ${meta.nipPejabatPenatausahaan || '........................................'}` }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'Kuasa Pengguna Barang,\nKepala Balai Pelatihan Talenta Komunikasi dan Digital', bold: true })] }),
                      new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { before: 800 }, text: `(${meta.kuasaPenggunaBarang || 'Hamdani Pratama'})` }),
                      new Paragraph({ alignment: AlignmentType.RIGHT, text: `NIP. ${meta.nipKuasaPengguna || '........................................'}` }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const fileName = `DRAF_LBP_BMN_${meta.kodeSatker}_${meta.tahunAnggaran}.docx`;
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
