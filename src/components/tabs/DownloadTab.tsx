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
  ValidationFinding,
  AnalysisFinding,
  BriefingSummary,
} from '../../types/bmn';
import { exportToWord, exportToExcel } from '../../utils/exportDocs';
import {
  FileText,
  FileSpreadsheet,
  Printer,
  Download,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

interface Props {
  meta: ReportMeta;
  neracaRows: AkunNeracaRow[];
  mutasiRows: AkunMutasiRow[];
  assetRows: AssetItemRow[];
  persediaanRows: PersediaanRow[];
  comparisonRows: ComparisonRow[];
  trendRows: TrendRow[];
  pspRows: StatusPenggunaanRow[];
  validationFindings: ValidationFinding[];
  findings: AnalysisFinding[];
  briefing: BriefingSummary;
  narasiBabE: string;
}

export const DownloadTab: React.FC<Props> = (props) => {
  const [isExportingWord, setIsExportingWord] = useState(false);
  const [isExportingExcel, setIsExportingExcel] = useState(false);
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);

  const handleWordExport = async () => {
    try {
      setIsExportingWord(true);
      await exportToWord(props);
      setExportSuccess('Berkas Word (.docx) berhasil dibuat dan diunduh.');
      setTimeout(() => setExportSuccess(null), 4000);
    } catch (err: any) {
      alert('Gagal mengekspor Word: ' + err.message);
    } finally {
      setIsExportingWord(false);
    }
  };

  const handleExcelExport = () => {
    try {
      setIsExportingExcel(true);
      exportToExcel(props);
      setExportSuccess('Buku Kerja Excel (.xlsx) dengan 8 sheet berhasil diunduh.');
      setTimeout(() => setExportSuccess(null), 4000);
    } catch (err: any) {
      alert('Gagal mengekspor Excel: ' + err.message);
    } finally {
      setIsExportingExcel(false);
    }
  };

  const handlePrintPdf = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Intro Header */}
      <div className="bg-white border border-[#C8D6E5] rounded-2xl p-6 shadow-xs">
        <span className="text-xs font-semibold text-[#0D6E8A] uppercase tracking-wider">
          FR-07: Ekspor Dokumen & Pelaporan Resmi
        </span>
        <h2 className="text-xl font-bold text-[#1B3A6B] mt-0.5">
          Unduh Draf Laporan BMN pada LBP
        </h2>
        <p className="text-xs text-slate-600 mt-1">
          Draf laporan dapat diunduh dalam format Microsoft Word (.docx), Excel (.xlsx), atau dicetak sebagai PDF. Seluruh berkas bertanda &quot;DRAF, belum disahkan&quot;.
        </p>
      </div>

      {/* Success Notification */}
      {exportSuccess && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-4 flex items-center space-x-3 text-xs font-semibold text-emerald-800 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{exportSuccess}</span>
        </div>
      )}

      {/* Export Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Microsoft Word */}
        <div className="bg-white rounded-2xl border border-[#C8D6E5] p-6 shadow-xs hover:border-[#1B3A6B] transition space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#1B3A6B] flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Dokumen Word (.docx)</h3>
              <p className="text-xs text-slate-500 mt-1">
                Laporan lengkap terstruktur (Bab A s.d. G, Nota Dinas, Tabel Rincian, dan Blok Pengesahan).
              </p>
            </div>
            <ul className="text-[11px] text-slate-600 space-y-1 list-disc pl-4">
              <li>Header Kementerian resmi</li>
              <li>Tabel format baku DJKN</li>
              <li>Watermark Draf Pengesahan</li>
            </ul>
          </div>

          <button
            onClick={handleWordExport}
            disabled={isExportingWord}
            className="w-full py-2.5 px-4 rounded-xl bg-[#1B3A6B] hover:bg-[#152e55] text-white text-xs font-semibold transition flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
          >
            {isExportingWord ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Menyusun Dokumen...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Unduh Dokumen Word (.docx)</span>
              </>
            )}
          </button>
        </div>

        {/* Card 2: Excel Spreadsheet */}
        <div className="bg-white rounded-2xl border border-[#C8D6E5] p-6 shadow-xs hover:border-emerald-600 transition space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Buku Kerja Excel (.xlsx)</h3>
              <p className="text-xs text-slate-500 mt-1">
                Seluruh tabel komputasi, rincian SIMAN, mutasi akun SAKTI, dan hasil validasi.
              </p>
            </div>
            <ul className="text-[11px] text-slate-600 space-y-1 list-disc pl-4">
              <li>8 lembar kerja terpisah</li>
              <li>Kolom jejak sumber baris</li>
              <li>Katalog kodefikasi lengkap</li>
            </ul>
          </div>

          <button
            onClick={handleExcelExport}
            disabled={isExportingExcel}
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold transition flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>Unduh Buku Excel (.xlsx)</span>
          </button>
        </div>

        {/* Card 3: PDF / Cetak Langsung */}
        <div className="bg-white rounded-2xl border border-[#C8D6E5] p-6 shadow-xs hover:border-[#0D6E8A] transition space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-[#0D6E8A] flex items-center justify-center">
              <Printer className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Cetak Langsung / PDF</h3>
              <p className="text-xs text-slate-500 mt-1">
                Format tata letak bersih untuk dicetak pada kertas A4 atau disimpan sebagai PDF browser.
              </p>
            </div>
            <ul className="text-[11px] text-slate-600 space-y-1 list-disc pl-4">
              <li>Tata letak siap cetak</li>
              <li>Bebas tombol antarmuka</li>
              <li>Format dokumen resmi</li>
            </ul>
          </div>

          <button
            onClick={handlePrintPdf}
            className="w-full py-2.5 px-4 rounded-xl bg-[#0D6E8A] hover:bg-[#0a576e] text-white text-xs font-semibold transition flex items-center justify-center gap-2 shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>Buka Dialog Cetak / Simpan PDF</span>
          </button>
        </div>
      </div>

      {/* Compliance Warning */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 flex items-start space-x-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold">Ketentuan Pengesahan LBP (Compliance):</p>
          <p className="text-slate-700 leading-relaxed">
            Semua hasil ekspor berlabel &quot;DRAF, belum disahkan&quot;. Petugas BMN wajib memverifikasi angka-angka tersebut sebelum menyerahkan kepada Kuasa Pengguna Barang (Kepala Balai) untuk penandatanganan dan pembubuhan cap dinas basah atau sertifikat elektronik BSrE.
          </p>
        </div>
      </div>
    </div>
  );
};
