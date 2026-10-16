export interface SourceRef {
  file: string;
  sheet: string;
  baris: number | string;
  kode?: string;
  keterangan?: string;
}

export interface ReportMeta {
  namaSatker: string;
  kodeSatker: string;
  periode: string; // e.g., "Tahun Anggaran 2025 (Audited)" atau "Semester I Tahun Anggaran 2026"
  tahunAnggaran: number;
  semester: 'I' | 'II' | 'Tahunan';
  tanggalLaporan: string;
  tempatLaporan: string;
  pejabatPenatausahaan: string; // Erni Rachmawati Thalib
  penanggungJawab: string; // Firman Ahmad
  kuasaPenggunaBarang: string; // Hamdani Pratama
  nipKuasaPengguna: string;
  nipPenanggungJawab: string;
  nipPejabatPenatausahaan: string;
  // Nota Dinas fields
  nomorNotaDinas: string;
  tanggalNotaDinas: string;
  kepadaNotaDinas: string;
  dariNotaDinas: string;
  halNotaDinas: string;
  lampiranNotaDinas: string;
}

export interface AkunNeracaRow {
  id: string;
  kodeAkun: string;
  akunNeraca: string;
  intraRp: number;
  ekstraRp: number;
  gabunganRp: number;
  persenIntra: number;
  persenEkstra: number;
  persenGabungan: number;
  akumPenyusutanIntra: number;
  akumPenyusutanEkstra: number;
  akumPenyusutanTotal: number;
  nilaiBuku: number;
  ref: SourceRef;
}

export interface AkunMutasiRow {
  id: string;
  kodeAkun: string;
  akun: string;
  saldoAwal: number;
  mutasiTambah: number;
  mutasiKurang: number;
  saldoAkhir: number;
  sebabMutasi: string;
  ref: SourceRef;
}

export interface AssetItemRow {
  id: string;
  kode: string;
  uraian: string;
  kuantitas: number;
  satuan: string;
  nilai: number;
  akPenyusutan: number;
  nilaiBuku: number;
  bidang: 'Peralatan dan Mesin' | 'Gedung dan Bangunan' | 'Jalan, Irigasi, Jaringan' | 'Aset Tetap Lainnya' | 'KDP' | 'Aset Tak Berwujud';
  kondisi: 'B' | 'RR' | 'RB';
  statusPSP: 'SUDAH' | 'BELUM';
  noSKPSP?: string;
  tahunPerolehan?: number;
  ref: SourceRef;
}

export interface PersediaanRow {
  id: string;
  kode: string;
  uraian: string;
  saldoAwal: number;
  mutasiTambah: number;
  mutasiKurang: number;
  saldoAkhir: number;
  satuan: string;
  ref: SourceRef;
}

export interface ComparisonRow {
  id: string;
  akunNeraca: string;
  laporanBarang: number;
  laporanKeuangan: number;
  selisih: number;
  selisihPersen: number;
  keterangan: string;
  status: 'SESUAI' | 'SELISIH';
  ref: SourceRef;
}

export interface TrendRow {
  id: string;
  periode: string;
  nilaiBMN: number;
  perkembanganRp: number;
  perkembanganPersen: number;
  keterangan: string;
  ref: SourceRef;
}

export interface StatusPenggunaanRow {
  id: string;
  akun: string;
  sudahDitetapkanRp: number;
  belumDitetapkanRp: number;
  totalRp: number;
  persenSudah: number;
  ref: SourceRef;
}

export interface ValidationFinding {
  id: string;
  kategori: 'Saldo' | 'Nilai Buku' | 'Gabungan' | 'Persentase' | 'Konsistensi Total' | 'Terbilang' | 'Data Ganda & Kode' | 'Kondisi Barang' | 'Konsistensi Antarfile';
  status: 'PASS' | 'WARNING' | 'FAIL';
  uraian: string;
  aturan: string;
  file: string;
  sheet: string;
  baris: string | number;
  nilaiDitemukan: string;
  nilaiDiharapkan: string;
  dampak: string;
}

export interface AnalysisFinding {
  id: string;
  label: 'Baru' | 'Berulang';
  uraian: string;
  rujukan: string;
  status: 'Fakta' | 'Dugaan';
  tingkatKeyakinan: 'Tinggi' | 'Sedang' | 'Rendah';
  rekomendasi?: string;
}

export interface BriefingDecision {
  isu: string;
  opsiKeputusan: string;
  urgensi: 'Tinggi' | 'Sedang';
}

export interface BriefingSummary {
  judul: string;
  angkaKunci: Array<{
    label: string;
    nilai: string;
    terbilang?: string;
    keterangan: string;
    ref?: SourceRef;
  }>;
  perubahanUtama: string[];
  temuanUtama: string[];
  butuhKeputusanPimpinan: BriefingDecision[];
}

export interface UploadedFileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'PARSED' | 'ERROR' | 'PARSING';
  recognizedType: 'SALDO_MUTASI' | 'SIMAN_ASET' | 'PERSEDIAAN' | 'REKONSILIASI' | 'LBP_LALU' | 'LAPORAN_KEUANGAN' | 'TEMPLATE' | 'LAINNYA';
  recordsCount: number;
  errorMessage?: string;
  dataSnippet?: any[];
}

export interface EvaluationCriteria {
  kecepatan: number; // Bobot 25%
  akurasi: number; // Bobot 30%
  kelengkapan: number; // Bobot 15%
  kualitas: number; // Bobot 15%
  kepatuhan: number; // Bobot 15%
  catatanPetugas: string;
  namaPenilai: string;
  tanggalPenilaian: string;
}
