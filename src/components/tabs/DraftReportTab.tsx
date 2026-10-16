import React, { useState } from 'react';
import {
  ReportMeta,
  AkunNeracaRow,
  AkunMutasiRow,
  AssetItemRow,
  PersediaanRow,
  ComparisonRow,
  TrendRow,
  StatusPenggunaanRow,
  SourceRef,
} from '../../types/bmn';
import { formatRupiah, terbilang } from '../../utils/terbilang';
import { fixedSectionsData } from '../../data/sampleBmnData';
import { KopSurat } from '../KopSurat';
import {
  Edit3,
  FileText,
  Building,
  Check,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  ShieldAlert,
  Info,
} from 'lucide-react';

interface Props {
  meta: ReportMeta;
  onUpdateMeta: (meta: ReportMeta) => void;
  neracaRows: AkunNeracaRow[];
  onUpdateNeracaRow: (row: AkunNeracaRow) => void;
  mutasiRows: AkunMutasiRow[];
  onUpdateMutasiRow: (row: AkunMutasiRow) => void;
  assetRows: AssetItemRow[];
  persediaanRows: PersediaanRow[];
  comparisonRows: ComparisonRow[];
  trendRows: TrendRow[];
  pspRows: StatusPenggunaanRow[];
  narasiBabE: string;
  onUpdateNarasiBabE: (narasi: string) => void;
  onInspectSource: (source: SourceRef) => void;
}

export const DraftReportTab: React.FC<Props> = ({
  meta,
  onUpdateMeta,
  neracaRows,
  onUpdateNeracaRow,
  mutasiRows,
  onUpdateMutasiRow,
  assetRows,
  persediaanRows,
  comparisonRows,
  trendRows,
  pspRows,
  narasiBabE,
  onUpdateNarasiBabE,
  onInspectSource,
}) => {
  const [showNotaDinas, setShowNotaDinas] = useState(true);
  const [isEditingMeta, setIsEditingMeta] = useState(false);
  const [editableCells, setEditableCells] = useState(false);

  const totalIntra = neracaRows.reduce((acc, r) => acc + r.intraRp, 0);
  const totalEkstra = neracaRows.reduce((acc, r) => acc + r.ekstraRp, 0);
  const totalGabungan = neracaRows.reduce((acc, r) => acc + r.gabunganRp, 0);
  const totalPenyusutan = neracaRows.reduce((acc, r) => acc + r.akumPenyusutanTotal, 0);
  const totalNilaiBuku = neracaRows.reduce((acc, r) => acc + r.nilaiBuku, 0);

  // Group asset items per bidang
  const peralatanMesinAssets = assetRows.filter((a) => a.bidang === 'Peralatan dan Mesin');
  const gedungAssets = assetRows.filter((a) => a.bidang === 'Gedung dan Bangunan');
  const jaringanAssets = assetRows.filter((a) => a.bidang === 'Jalan, Irigasi, Jaringan');
  const lainnyaAssets = assetRows.filter((a) => a.bidang === 'Aset Tetap Lainnya' || a.bidang === 'Aset Tak Berwujud');

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Top Controller Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#C8D6E5] shadow-xs flex flex-wrap items-center justify-between gap-3 sticky top-[105px] z-20 backdrop-blur-md bg-white/95 no-print">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold uppercase text-slate-500">Mode Antarmuka:</span>
          <button
            onClick={() => setEditableCells(!editableCells)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition ${
              editableCells
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{editableCells ? 'Mode Edit Tabel Aktif' : 'Aktifkan Edit Tabel Langsung'}</span>
          </button>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <button
            onClick={() => setShowNotaDinas(!showNotaDinas)}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition flex items-center gap-1"
          >
            <span>{showNotaDinas ? 'Sembunyikan Nota Dinas' : 'Tampilkan Nota Dinas'}</span>
            {showNotaDinas ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => setIsEditingMeta(!isEditingMeta)}
            className="px-3 py-1.5 bg-blue-50 text-[#1B3A6B] hover:bg-blue-100 font-medium rounded-lg transition"
          >
            {isEditingMeta ? 'Selesai Ubah Entitas' : 'Ubah Nama Satker / Periode'}
          </button>
        </div>
      </div>

      {/* Optional Metadata Editor Drawer */}
      {isEditingMeta && (
        <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-5 space-y-4 no-print">
          <h4 className="text-xs font-bold text-[#1B3A6B] uppercase tracking-wider">
            Pengaturan Entitas & Periode Pelaporan (Bab A & Blok Pengesahan)
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Nama Satuan Kerja</label>
              <input
                type="text"
                value={meta.namaSatker}
                onChange={(e) => onUpdateMeta({ ...meta, namaSatker: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-800"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Kode Satker</label>
              <input
                type="text"
                value={meta.kodeSatker}
                onChange={(e) => onUpdateMeta({ ...meta, kodeSatker: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-800 font-mono"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Periode Laporan</label>
              <input
                type="text"
                value={meta.periode}
                onChange={(e) => onUpdateMeta({ ...meta, periode: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-800"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Tempat & Tanggal Laporan</label>
              <input
                type="text"
                value={meta.tanggalLaporan}
                onChange={(e) => onUpdateMeta({ ...meta, tanggalLaporan: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-800"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Pejabat Penatausahaan BMN</label>
              <input
                type="text"
                value={meta.pejabatPenatausahaan}
                onChange={(e) => onUpdateMeta({ ...meta, pejabatPenatausahaan: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-800"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Penanggung Jawab Laporan BMN</label>
              <input
                type="text"
                value={meta.penanggungJawab}
                onChange={(e) => onUpdateMeta({ ...meta, penanggungJawab: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-800"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Kuasa Pengguna Barang (Kepala Balai)</label>
              <input
                type="text"
                value={meta.kuasaPenggunaBarang}
                onChange={(e) => onUpdateMeta({ ...meta, kuasaPenggunaBarang: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-800"
              />
            </div>
          </div>
        </div>
      )}

      {/* Dokumen Resmi Mulai di Sini */}
      <div className="bg-white rounded-2xl border border-[#C8D6E5] shadow-lg p-6 sm:p-12 space-y-8 text-slate-900 font-sans print:shadow-none print:border-none print:p-0">
        {/* KOP SURAT RESMI SESUAI TEMPLATE ACUAN GAMBAR KOMDIGI */}
        <div className="w-full">
          <KopSurat />
          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 px-1">
            <span>Kode Satuan Kerja: <strong className="font-mono text-slate-800">{meta.kodeSatker}</strong></span>
            <span className="inline-block px-2.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 font-bold text-[11px]">
              DRAF LAPORAN BMN — BELUM DISAHKAN
            </span>
          </div>
        </div>

        {/* NOTA DINAS PENGANTAR (OPSIONAL SESUAI FORMAT ACUAN) */}
        {showNotaDinas && (
          <div className="bg-[#F4F6F9] border border-[#C8D6E5] rounded-xl p-6 space-y-4">
            <div className="border-b border-slate-300 pb-3 flex items-center justify-between">
              <h3 className="font-bold text-[#1B3A6B] text-sm tracking-wider uppercase">
                Nota Dinas Pengantar Laporan BMN (Opsional)
              </h3>
              <span className="text-[11px] text-slate-500 italic">
                Nomor, paraf, dan tanda tangan dikosongkan untuk diisi petugas
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 text-xs">
              <div className="flex">
                <span className="w-24 font-semibold text-slate-600">Nomor</span>
                <span className="font-mono text-slate-800">: {meta.nomorNotaDinas || '(Dikosongkan untuk petugas)'}</span>
              </div>
              <div className="flex">
                <span className="w-24 font-semibold text-slate-600">Tanggal</span>
                <span className="text-slate-800">: {meta.tanggalNotaDinas || '(Dikosongkan untuk petugas)'}</span>
              </div>
              <div className="flex">
                <span className="w-24 font-semibold text-slate-600">Kepada</span>
                <span className="text-slate-800 font-medium">: Kuasa Pengguna Barang ({meta.kuasaPenggunaBarang})</span>
              </div>
              <div className="flex">
                <span className="w-24 font-semibold text-slate-600">Dari</span>
                <span className="text-slate-800 font-medium">: Pejabat Penatausahaan BMN ({meta.pejabatPenatausahaan})</span>
              </div>
              <div className="flex sm:col-span-2">
                <span className="w-24 font-semibold text-slate-600">Hal</span>
                <span className="text-slate-800 font-medium">: {meta.halNotaDinas}</span>
              </div>
              <div className="flex sm:col-span-2">
                <span className="w-24 font-semibold text-slate-600">Lampiran</span>
                <span className="text-slate-800">: {meta.lampiranNotaDinas}</span>
              </div>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed pt-2 border-t border-slate-200">
              Bersama ini kami sampaikan Draf Laporan Barang Milik Negara pada Laporan Barang Kuasa Pengguna (LBP) {meta.namaSatker} {meta.periode} yang telah divalidasi dan dicocokkan dengan data SAKTI dan SIMAN.
            </p>

            <div className="flex justify-end pt-2 text-xs">
              <div className="text-center w-64">
                <p className="font-semibold text-slate-700">Pejabat Penatausahaan BMN,</p>
                <div className="h-14 border border-dashed border-slate-300 rounded my-2 flex items-center justify-center text-[10px] text-slate-400 italic">
                  [Paraf Fisik Petugas]
                </div>
                <p className="font-bold text-slate-800">{meta.pejabatPenatausahaan}</p>
                <p className="text-[11px] text-slate-500 font-mono">NIP. {meta.nipPejabatPenatausahaan || '........................'}</p>
              </div>
            </div>
          </div>
        )}

        {/* JUDUL LAPORAN ACUAN */}
        <div className="text-center space-y-2 py-4">
          <h2 className="text-xl sm:text-2xl font-black text-[#1B3A6B] tracking-tight uppercase">
            Laporan Barang Milik Negara
          </h2>
          <h3 className="text-base sm:text-lg font-bold text-slate-800 uppercase tracking-wide">
            Pada Laporan Barang Kuasa Pengguna
          </h3>
          <p className="text-sm font-semibold text-[#0D6E8A]">
            Periode: {meta.periode}
          </p>
        </div>

        {/* ================= BAB A. PENDAHULUAN (KONTEN TETAP) ================= */}
        <section className="space-y-4">
          <div className="bg-[#1B3A6B] text-white px-4 py-2 rounded-lg font-bold text-sm tracking-wide">
            {fixedSectionsData.babA.judul}
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed pl-2">
            <div>
              <h4 className="font-bold text-slate-900 mb-1.5">1. Dasar Hukum</h4>
              <ol className="list-decimal list-outside pl-5 space-y-1 text-slate-700 text-xs">
                {fixedSectionsData.babA.dasarHukum.map((dh, idx) => (
                  <li key={idx} className="leading-relaxed">{dh}</li>
                ))}
              </ol>
            </div>

            <div className="pt-2">
              <h4 className="font-bold text-slate-900 mb-1">2. Entitas Pelaporan</h4>
              <p className="text-xs">
                Nama Satuan Kerja: <strong>{meta.namaSatker}</strong> (Kode Satker: <span className="font-mono font-bold text-[#1B3A6B]">{meta.kodeSatker}</span>), berada di bawah naungan Kementerian Komunikasi dan Digital Republik Indonesia.
              </p>
            </div>

            <div className="pt-2">
              <h4 className="font-bold text-slate-900 mb-1">3. Periode Laporan</h4>
              <p className="text-xs">
                Laporan BMN ini disusun untuk <strong>{meta.periode}</strong>, menyajikan posisi saldo awal, mutasi tambah, mutasi kurang, saldo akhir, akumulasi penyusutan, dan nilai buku BMN baik yang tercatat secara intrakomptabel maupun ekstrakomptabel.
              </p>
            </div>
          </div>
        </section>

        {/* ================= BAB B. KEBIJAKAN PENATAUSAHAAN BMN (KONTEN TETAP) ================= */}
        <section className="space-y-4">
          <div className="bg-[#1B3A6B] text-white px-4 py-2 rounded-lg font-bold text-sm tracking-wide">
            {fixedSectionsData.babB.judul}
          </div>

          <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed pl-2">
            <div>
              <h4 className="font-bold text-slate-900 mb-1">1. Kebijakan Penggolongan dan Kodefikasi</h4>
              <p className="text-xs leading-relaxed">{fixedSectionsData.babB.penggolongan}</p>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-1">2. Kebijakan Kapitalisasi</h4>
              <p className="text-xs leading-relaxed">{fixedSectionsData.babB.kebijakanKapitalisasi}</p>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-2">3. Kriteria Kondisi Barang</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {fixedSectionsData.babB.kriteriaKondisi.map((k) => (
                  <div key={k.kode} className="bg-[#F4F6F9] border border-[#C8D6E5] rounded-lg p-3 text-xs">
                    <span className="font-bold text-[#1B3A6B] block mb-1">
                      Kondisi {k.nama} ({k.kode})
                    </span>
                    <p className="text-slate-600 leading-normal">{k.kriteria}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ================= BAB C. KEBIJAKAN REKONSILIASI (KONTEN TETAP) ================= */}
        <section className="space-y-3">
          <div className="bg-[#1B3A6B] text-white px-4 py-2 rounded-lg font-bold text-sm tracking-wide">
            {fixedSectionsData.babC.judul}
          </div>
          <div className="text-xs text-slate-700 leading-relaxed pl-2">
            <p>{fixedSectionsData.babC.isi}</p>
          </div>
        </section>

        {/* ================= BAB D. KEBIJAKAN PENYUSUTAN BMN (KONTEN TETAP) ================= */}
        <section className="space-y-4">
          <div className="bg-[#1B3A6B] text-white px-4 py-2 rounded-lg font-bold text-sm tracking-wide">
            {fixedSectionsData.babD.judul}
          </div>
          <div className="space-y-3 text-xs text-slate-700 leading-relaxed pl-2">
            <p>{fixedSectionsData.babD.isi}</p>

            <h4 className="font-bold text-slate-900 pt-1">Tabel Masa Manfaat Kelompok Aset Tetap</h4>
            <div className="overflow-x-auto border border-[#C8D6E5] rounded-lg">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#F4F6F9] text-slate-700 font-bold border-b border-[#C8D6E5]">
                  <tr>
                    <th className="py-2 px-3 w-12">No</th>
                    <th className="py-2 px-3">Kelompok Aset Tetap</th>
                    <th className="py-2 px-3 w-48">Masa Manfaat (Tahun)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {fixedSectionsData.babD.tabelMasaManfaat.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-2 px-3 text-slate-500">{idx + 1}</td>
                      <td className="py-2 px-3 font-medium text-slate-800">{item.kelompok}</td>
                      <td className="py-2 px-3 font-mono text-[#0D6E8A] font-semibold">{item.masaManfaat}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ================= BAB E. PENDEKATAN PENYUSUNAN LAPORAN ================= */}
        <section className="space-y-4">
          <div className="bg-[#1B3A6B] text-white px-4 py-2 rounded-lg font-bold text-sm tracking-wide flex items-center justify-between">
            <span>E. PENDEKATAN PENYUSUNAN LAPORAN</span>
            <span className="text-[10px] font-normal text-blue-200">Dihitung Kode & Narasi Model</span>
          </div>

          <div className="bg-blue-50/50 border border-blue-200 rounded-xl p-4 text-xs sm:text-sm text-slate-800 leading-relaxed space-y-3">
            <p className="font-medium text-[#1B3A6B]">
              {narasiBabE || (
                `Total nilai Barang Milik Negara (BMN) gabungan yang dikelola oleh ${meta.namaSatker} per akhir ${meta.periode} adalah sebesar ${formatRupiah(totalGabungan)} (${terbilang(totalGabungan)}). Posisi nilai ini terdiri dari aset intrakomptabel sebesar ${formatRupiah(totalIntra)} dan aset ekstrakomptabel sebesar ${formatRupiah(totalEkstra)}. Akumulasi penyusutan hingga periode laporan tercatat sebesar ${formatRupiah(totalPenyusutan)}, sehingga menghasilkan total Nilai Buku BMN sebesar ${formatRupiah(totalNilaiBuku)}.`
              )}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-blue-200 text-xs">
              <div className="bg-white p-2.5 rounded-lg border border-blue-100">
                <span className="text-[10px] font-semibold text-slate-500 uppercase">Total Gabungan</span>
                <p className="font-mono font-bold text-[#1B3A6B] text-sm mt-0.5">{formatRupiah(totalGabungan)}</p>
                <p className="text-[10px] text-slate-500 italic mt-0.5">{terbilang(totalGabungan)}</p>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-blue-100">
                <span className="text-[10px] font-semibold text-slate-500 uppercase">Intrakomptabel</span>
                <p className="font-mono font-bold text-slate-800 text-sm mt-0.5">{formatRupiah(totalIntra)}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{((totalIntra / (totalGabungan || 1)) * 100).toFixed(2)}% dari total</p>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-blue-100">
                <span className="text-[10px] font-semibold text-slate-500 uppercase">Akum. Penyusutan</span>
                <p className="font-mono font-bold text-rose-700 text-sm mt-0.5">{formatRupiah(totalPenyusutan)}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Metode Garis Lurus</p>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-blue-100">
                <span className="text-[10px] font-semibold text-slate-500 uppercase">Nilai Buku Bersih</span>
                <p className="font-mono font-bold text-emerald-700 text-sm mt-0.5">{formatRupiah(totalNilaiBuku)}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Nilai - Akum. Susut</p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= BAB F. RINGKASAN BMN TAHUN ANGGARAN ================= */}
        <section className="space-y-6">
          <div className="bg-[#1B3A6B] text-white px-4 py-2 rounded-lg font-bold text-sm tracking-wide">
            F. RINGKASAN BMN TAHUN ANGGARAN
          </div>

          {/* F.1 & F.2 Ringkasan Mutasi per Akun */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 text-sm">
                F.1 Saldo Awal dan F.2 Ringkasan Mutasi per Akun
              </h4>
              <span className="text-xs text-slate-500 italic">
                Klik angka bergaris bawah untuk melihat jejak sumber data
              </span>
            </div>

            <div className="overflow-x-auto border border-[#C8D6E5] rounded-xl shadow-xs">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#1B3A6B] text-white font-semibold">
                  <tr>
                    <th className="py-2.5 px-3 w-10 text-center">No</th>
                    <th className="py-2.5 px-3">Kode Akun</th>
                    <th className="py-2.5 px-3">Uraian Akun BMN</th>
                    <th className="py-2.5 px-3 text-right">Saldo Awal (Rp)</th>
                    <th className="py-2.5 px-3 text-right">Mutasi Tambah (Rp)</th>
                    <th className="py-2.5 px-3 text-right">Mutasi Kurang (Rp)</th>
                    <th className="py-2.5 px-3 text-right">Saldo Akhir (Rp)</th>
                    <th className="py-2.5 px-3">Sebab Mutasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {mutasiRows.map((r, idx) => (
                    <tr key={r.id} className="hover:bg-slate-50 transition">
                      <td className="py-2.5 px-3 text-center text-slate-500">{idx + 1}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-700">{r.kodeAkun}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-800">{r.akun}</td>
                      <td className="py-2.5 px-3 text-right font-mono">
                        <button
                          onClick={() => onInspectSource(r.ref)}
                          className="hover:text-[#0D6E8A] hover:underline cursor-pointer"
                        >
                          {formatRupiah(r.saldoAwal)}
                        </button>
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-emerald-700">
                        <button
                          onClick={() => onInspectSource(r.ref)}
                          className="hover:underline cursor-pointer"
                        >
                          {formatRupiah(r.mutasiTambah)}
                        </button>
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-rose-700">
                        <button
                          onClick={() => onInspectSource(r.ref)}
                          className="hover:underline cursor-pointer"
                        >
                          {formatRupiah(r.mutasiKurang)}
                        </button>
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-[#1B3A6B]">
                        <button
                          onClick={() => onInspectSource(r.ref)}
                          className="hover:underline cursor-pointer"
                        >
                          {formatRupiah(r.saldoAkhir)}
                        </button>
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 text-[11px] leading-relaxed max-w-xs">
                        {r.sebabMutasi}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Rincian Persediaan (Tabel Persediaan berkolom: Saldo Awal, Mutasi, Saldo Akhir) */}
          <div className="space-y-2 pt-2">
            <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wider text-[#0D6E8A]">
              Rincian Buku Persediaan (Barang Habis Pakai & Pelatihan)
            </h5>
            <div className="overflow-x-auto border border-[#C8D6E5] rounded-xl shadow-xs">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#F4F6F9] text-slate-700 font-semibold border-b border-[#C8D6E5]">
                  <tr>
                    <th className="py-2 px-3">Kode Barang</th>
                    <th className="py-2 px-3">Uraian Barang Persediaan</th>
                    <th className="py-2 px-3 text-right">Saldo Awal (Rp)</th>
                    <th className="py-2 px-3 text-right">Mutasi Tambah (Rp)</th>
                    <th className="py-2 px-3 text-right">Mutasi Kurang (Rp)</th>
                    <th className="py-2 px-3 text-right">Saldo Akhir (Rp)</th>
                    <th className="py-2 px-3">Satuan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {persediaanRows.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="py-2 px-3 font-mono text-slate-600">{p.kode}</td>
                      <td className="py-2 px-3 font-medium text-slate-800">{p.uraian}</td>
                      <td className="py-2 px-3 text-right font-mono">{formatRupiah(p.saldoAwal)}</td>
                      <td className="py-2 px-3 text-right font-mono text-emerald-700">{formatRupiah(p.mutasiTambah)}</td>
                      <td className="py-2 px-3 text-right font-mono text-rose-700">{formatRupiah(p.mutasiKurang)}</td>
                      <td className="py-2 px-3 text-right font-mono font-bold text-[#1B3A6B]">{formatRupiah(p.saldoAkhir)}</td>
                      <td className="py-2 px-3 text-slate-600">{p.satuan}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Rincian Peralatan dan Mesin & Aset Tetap (Tabel berkolom: Kode, Uraian, Kuantitas, Nilai, Akum. Susut, Nilai Buku) */}
          <div className="space-y-2 pt-2">
            <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wider text-[#0D6E8A]">
              Rincian Aset Peralatan dan Mesin & Gedung Bangunan (Sampling Data SIMAN)
            </h5>
            <div className="overflow-x-auto border border-[#C8D6E5] rounded-xl shadow-xs">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#F4F6F9] text-slate-700 font-semibold border-b border-[#C8D6E5]">
                  <tr>
                    <th className="py-2 px-3">Kode BMN</th>
                    <th className="py-2 px-3">Uraian / Spesifikasi Aset</th>
                    <th className="py-2 px-3 text-center">Kuantitas</th>
                    <th className="py-2 px-3 text-right">Nilai Perolehan (Rp)</th>
                    <th className="py-2 px-3 text-right">Akum. Penyusutan (Rp)</th>
                    <th className="py-2 px-3 text-right">Nilai Buku (Rp)</th>
                    <th className="py-2 px-3 text-center">Kondisi</th>
                    <th className="py-2 px-3 text-center">Status PSP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {assetRows.map((a) => (
                    <tr key={a.id} className="hover:bg-slate-50">
                      <td className="py-2 px-3 font-mono text-slate-600 text-[11px]">{a.kode}</td>
                      <td className="py-2 px-3 font-medium text-slate-800">{a.uraian}</td>
                      <td className="py-2 px-3 text-center font-mono">{a.kuantitas} {a.satuan}</td>
                      <td className="py-2 px-3 text-right font-mono font-medium">{formatRupiah(a.nilai)}</td>
                      <td className="py-2 px-3 text-right font-mono text-rose-700">{formatRupiah(a.akPenyusutan)}</td>
                      <td className="py-2 px-3 text-right font-mono font-bold text-[#1B3A6B]">{formatRupiah(a.nilaiBuku)}</td>
                      <td className="py-2 px-3 text-center">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            a.kondisi === 'B'
                              ? 'bg-emerald-100 text-emerald-800'
                              : a.kondisi === 'RR'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {a.kondisi}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-center">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                            a.statusPSP === 'SUDAH'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {a.statusPSP}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* F.3.a BMN pada Laporan Barang Kuasa Pengguna per Akun Neraca */}
          <div className="space-y-3 pt-4">
            <h4 className="font-bold text-slate-900 text-sm">
              F.3.a BMN pada Laporan Barang Kuasa Pengguna per Akun Neraca
            </h4>
            <div className="overflow-x-auto border border-[#C8D6E5] rounded-xl shadow-xs">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#1B3A6B] text-white font-semibold">
                  <tr>
                    <th className="py-2.5 px-3">Kode</th>
                    <th className="py-2.5 px-3">Akun Neraca</th>
                    <th className="py-2.5 px-3 text-right">Intrakomptabel (Rp)</th>
                    <th className="py-2.5 px-3 text-right">%</th>
                    <th className="py-2.5 px-3 text-right">Ekstrakomptabel (Rp)</th>
                    <th className="py-2.5 px-3 text-right">%</th>
                    <th className="py-2.5 px-3 text-right">Gabungan (Rp)</th>
                    <th className="py-2.5 px-3 text-right">%</th>
                    <th className="py-2.5 px-3 text-right">Akum. Susut (Rp)</th>
                    <th className="py-2.5 px-3 text-right">Nilai Buku (Rp)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {neracaRows.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50 transition">
                      <td className="py-2.5 px-3 font-mono text-slate-600">{r.kodeAkun}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-800">{r.akunNeraca}</td>
                      <td className="py-2.5 px-3 text-right font-mono">
                        <button onClick={() => onInspectSource(r.ref)} className="hover:underline">
                          {formatRupiah(r.intraRp)}
                        </button>
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-slate-500">{r.persenIntra.toFixed(2)}%</td>
                      <td className="py-2.5 px-3 text-right font-mono">
                        <button onClick={() => onInspectSource(r.ref)} className="hover:underline">
                          {formatRupiah(r.ekstraRp)}
                        </button>
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-slate-500">{r.persenEkstra.toFixed(2)}%</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-[#1B3A6B]">
                        <button onClick={() => onInspectSource(r.ref)} className="hover:underline">
                          {formatRupiah(r.gabunganRp)}
                        </button>
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-[#1B3A6B]">{r.persenGabungan.toFixed(2)}%</td>
                      <td className="py-2.5 px-3 text-right font-mono text-rose-700">{formatRupiah(r.akumPenyusutanTotal)}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-800">{formatRupiah(r.nilaiBuku)}</td>
                    </tr>
                  ))}
                  {/* Total Row */}
                  <tr className="bg-slate-100 font-bold border-t-2 border-slate-300">
                    <td colSpan={2} className="py-3 px-3 text-slate-900 uppercase">
                      Total BMN Gabungan
                    </td>
                    <td className="py-3 px-3 text-right font-mono">{formatRupiah(totalIntra)}</td>
                    <td className="py-3 px-3 text-right font-mono">100,00%</td>
                    <td className="py-3 px-3 text-right font-mono">{formatRupiah(totalEkstra)}</td>
                    <td className="py-3 px-3 text-right font-mono">100,00%</td>
                    <td className="py-3 px-3 text-right font-mono text-[#1B3A6B] text-sm">{formatRupiah(totalGabungan)}</td>
                    <td className="py-3 px-3 text-right font-mono text-[#1B3A6B]">100,00%</td>
                    <td className="py-3 px-3 text-right font-mono text-rose-800">{formatRupiah(totalPenyusutan)}</td>
                    <td className="py-3 px-3 text-right font-mono text-emerald-900 text-sm">{formatRupiah(totalNilaiBuku)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* F.3.b Perbandingan Laporan Barang dan Laporan Keuangan */}
          <div className="space-y-3 pt-4">
            <h4 className="font-bold text-slate-900 text-sm">
              F.3.b Perbandingan Nilai BMN pada Laporan Barang dan Laporan Keuangan
            </h4>
            <div className="overflow-x-auto border border-[#C8D6E5] rounded-xl shadow-xs">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#F4F6F9] text-slate-800 font-semibold border-b border-[#C8D6E5]">
                  <tr>
                    <th className="py-2.5 px-3">Akun Neraca</th>
                    <th className="py-2.5 px-3 text-right">Laporan Barang (SIMAN)</th>
                    <th className="py-2.5 px-3 text-right">Laporan Keuangan (SAKTI)</th>
                    <th className="py-2.5 px-3 text-right">Selisih (Rp)</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                    <th className="py-2.5 px-3">Keterangan / Tindak Lanjut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {comparisonRows.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-semibold text-slate-800">{c.akunNeraca}</td>
                      <td className="py-2.5 px-3 text-right font-mono">{formatRupiah(c.laporanBarang)}</td>
                      <td className="py-2.5 px-3 text-right font-mono">{formatRupiah(c.laporanKeuangan)}</td>
                      <td className={`py-2.5 px-3 text-right font-mono font-bold ${c.selisih === 0 ? 'text-slate-600' : 'text-rose-600'}`}>
                        {formatRupiah(c.selisih)}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            c.status === 'SESUAI'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {c.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 text-[11px]">{c.keterangan}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ================= BAB G. INFORMASI BMN LAINNYA ================= */}
        <section className="space-y-6">
          <div className="bg-[#1B3A6B] text-white px-4 py-2 rounded-lg font-bold text-sm tracking-wide">
            G. INFORMASI BMN LAINNYA
          </div>

          {/* G.1 Perkembangan Nilai BMN Beberapa Periode Terakhir */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-sm">
              1. Perkembangan Nilai BMN Beberapa Periode Terakhir (G.1)
            </h4>
            <div className="overflow-x-auto border border-[#C8D6E5] rounded-xl shadow-xs">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#F4F6F9] text-slate-800 font-semibold border-b border-[#C8D6E5]">
                  <tr>
                    <th className="py-2.5 px-3">Periode Laporan</th>
                    <th className="py-2.5 px-3 text-right">Nilai BMN (Rp)</th>
                    <th className="py-2.5 px-3 text-right">Perkembangan Rupiah</th>
                    <th className="py-2.5 px-3 text-right">Perkembangan (%)</th>
                    <th className="py-2.5 px-3">Faktor Penyebab & Keterangan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {trendRows.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-semibold text-slate-800">{t.periode}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-medium">{formatRupiah(t.nilaiBMN)}</td>
                      <td className="py-2.5 px-3 text-right font-mono text-emerald-700">
                        {t.perkembanganRp > 0 ? `+${formatRupiah(t.perkembanganRp)}` : formatRupiah(t.perkembanganRp)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-[#0D6E8A]">
                        {t.perkembanganPersen > 0 ? `+${t.perkembanganPersen.toFixed(2)}%` : `${t.perkembanganPersen.toFixed(2)}%`}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 text-[11px]">{t.keterangan}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* G.2 Informasi Pengelolaan BMN (PSP & Koreksi) */}
          <div className="space-y-3 pt-2">
            <h4 className="font-bold text-slate-900 text-sm">
              2. Informasi Pengelolaan BMN (Status Penggunaan / PSP) (G.2)
            </h4>
            <div className="overflow-x-auto border border-[#C8D6E5] rounded-xl shadow-xs">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#F4F6F9] text-slate-800 font-semibold border-b border-[#C8D6E5]">
                  <tr>
                    <th className="py-2.5 px-3">Kelompok Aset Neraca</th>
                    <th className="py-2.5 px-3 text-right">Sudah Ditetapkan PSP (Rp)</th>
                    <th className="py-2.5 px-3 text-right">Belum Ditetapkan PSP (Rp)</th>
                    <th className="py-2.5 px-3 text-right">Total Nilai (Rp)</th>
                    <th className="py-2.5 px-3 text-right">Rasio PSP Tuntas (%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {pspRows.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-semibold text-slate-800">{p.akun}</td>
                      <td className="py-2.5 px-3 text-right font-mono text-emerald-700">{formatRupiah(p.sudahDitetapkanRp)}</td>
                      <td className="py-2.5 px-3 text-right font-mono text-amber-700">{formatRupiah(p.belumDitetapkanRp)}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-medium">{formatRupiah(p.totalRp)}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-[#1B3A6B]">{p.persenSudah.toFixed(2)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ================= BLOK PENGESAHAN (KOSONGKAN TANDA TANGAN) ================= */}
        <section className="pt-8 border-t border-slate-300 space-y-6">
          <div className="flex justify-end text-xs text-slate-700">
            <p>
              {meta.tempatLaporan}, {meta.tanggalLaporan}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-800">
            {/* Penanggung Jawab Laporan BMN */}
            <div className="space-y-1">
              <p className="font-bold text-slate-900">Penanggung Jawab Laporan BMN,</p>
              <p className="text-slate-600">Pejabat Pembuat Komitmen (PPK)</p>
              <div className="h-20 border border-dashed border-slate-300 rounded my-2 flex items-center justify-center text-[10px] text-slate-400 italic">
                (Tanda Tangan & Paraf Fisik)
              </div>
              <p className="font-bold text-slate-900">{meta.penanggungJawab}</p>
              <p className="text-slate-600 font-mono text-[11px]">NIP. {meta.nipPenanggungJawab || '........................................'}</p>
            </div>

            {/* Pejabat Penatausahaan BMN */}
            <div className="space-y-1 text-left md:text-center">
              <p className="font-bold text-slate-900">Pejabat Penatausahaan BMN,</p>
              <p className="text-slate-600">Pengelola Penatausahaan</p>
              <div className="h-20 border border-dashed border-slate-300 rounded my-2 flex items-center justify-center text-[10px] text-slate-400 italic">
                (Paraf Fisik)
              </div>
              <p className="font-bold text-slate-900">{meta.pejabatPenatausahaan}</p>
              <p className="text-slate-600 font-mono text-[11px]">NIP. {meta.nipPejabatPenatausahaan || '........................................'}</p>
            </div>

            {/* Kuasa Pengguna Barang */}
            <div className="space-y-1 text-left md:text-right">
              <p className="font-bold text-slate-900">Kuasa Pengguna Barang,</p>
              <p className="text-slate-600">Kepala {meta.namaSatker}</p>
              <div className="h-20 border border-dashed border-slate-300 rounded my-2 flex items-center justify-center text-[10px] text-slate-400 italic">
                (Tanda Tangan & Cap Dinas Resmi)
              </div>
              <p className="font-bold text-slate-900">{meta.kuasaPenggunaBarang}</p>
              <p className="text-slate-600 font-mono text-[11px]">NIP. {meta.nipKuasaPengguna}</p>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-[11px] text-amber-900 flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              Batasan Hukum: Aplikasi ini hanya menyusun DRAF. Persetujuan dan pengesahan sah dilakukan secara fisik atau melalui tanda tangan elektronik pejabat yang berwenang.
            </span>
          </div>
        </section>
      </div>
    </div>
  );
};
