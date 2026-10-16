import React from 'react';
import { TrendRow, ComparisonRow, SourceRef } from '../../types/bmn';
import { formatRupiah, formatPersen } from '../../utils/terbilang';
import {
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  AlertCircle,
  FileSpreadsheet,
  CheckCircle,
} from 'lucide-react';

interface Props {
  trendRows: TrendRow[];
  comparisonRows: ComparisonRow[];
  hasPriorPeriodData: boolean;
  onInspectSource: (source: SourceRef) => void;
}

export const VarianceTab: React.FC<Props> = ({
  trendRows,
  comparisonRows,
  hasPriorPeriodData,
  onInspectSource,
}) => {
  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-white border border-[#C8D6E5] rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-[#0D6E8A] uppercase tracking-wider">
              FR-04: Analisis Selisih Antarperiode & Perbandingan Neraca
            </span>
            <h2 className="text-xl font-bold text-[#1B3A6B] mt-0.5">
              Perkembangan Nilai BMN & Rekonsiliasi Antar-Laporan
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Perhitungan selisih nominal dan persentase dihitung secara matematis oleh kode aplikasi sesuai formula resmi DJKN.
            </p>
          </div>

          <div>
            {hasPriorPeriodData ? (
              <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                <CheckCircle className="w-4 h-4 mr-1.5" /> Berkas Pembanding Tersedia
              </span>
            ) : (
              <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                <AlertCircle className="w-4 h-4 mr-1.5" /> Pembanding Periode Sebelumnya Tidak Tersedia
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Bagian 1: Perkembangan Nilai BMN Antar-Periode (G.1) */}
      <div className="bg-white rounded-2xl border border-[#C8D6E5] shadow-xs p-6 space-y-4">
        <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-[#1B3A6B] text-sm">
              1. Perkembangan Nilai BMN Beberapa Periode Terakhir (Tabel G.1)
            </h3>
            <p className="text-xs text-slate-500">
              Formula: Selisih (Rp) = Nilai Periode Ini - Nilai Periode Sebelumnya | Selisih (%) = (Selisih / Nilai Sebelumnya) &times; 100
            </p>
          </div>
        </div>

        <div className="overflow-x-auto border border-[#C8D6E5] rounded-xl">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#1B3A6B] text-white font-semibold">
              <tr>
                <th className="py-2.5 px-3">Periode Pelaporan</th>
                <th className="py-2.5 px-3 text-right">Nilai Total BMN (Rp)</th>
                <th className="py-2.5 px-3 text-right">Perkembangan Nominal</th>
                <th className="py-2.5 px-3 text-right">Perkembangan (%)</th>
                <th className="py-2.5 px-3">Faktor Kunci Perubahan</th>
                <th className="py-2.5 px-3">Rujukan Sumber</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {trendRows.map((t, idx) => {
                const isBase = idx === 0;
                const isIncrease = t.perkembanganRp > 0;
                const isDecrease = t.perkembanganRp < 0;

                return (
                  <tr key={t.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-3 font-semibold text-slate-800">{t.periode}</td>
                    <td className="py-3 px-3 text-right font-mono font-medium">{formatRupiah(t.nilaiBMN)}</td>
                    <td className="py-3 px-3 text-right font-mono font-bold">
                      {isBase ? (
                        <span className="text-slate-400">Tahun Dasar</span>
                      ) : isIncrease ? (
                        <span className="text-emerald-700 flex items-center justify-end gap-1">
                          <ArrowUpRight className="w-3.5 h-3.5" /> +{formatRupiah(t.perkembanganRp)}
                        </span>
                      ) : isDecrease ? (
                        <span className="text-rose-700 flex items-center justify-end gap-1">
                          <ArrowDownRight className="w-3.5 h-3.5" /> -{formatRupiah(Math.abs(t.perkembanganRp))}
                        </span>
                      ) : (
                        <span className="text-slate-600">Rp0 (Tetap)</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-[#0D6E8A]">
                      {isBase ? (
                        <span className="text-slate-400">0,00%</span>
                      ) : (
                        `${t.perkembanganPersen > 0 ? '+' : ''}${t.perkembanganPersen.toFixed(2)}%`
                      )}
                    </td>
                    <td className="py-3 px-3 text-slate-700 max-w-xs">{t.keterangan}</td>
                    <td className="py-3 px-3">
                      <button
                        onClick={() => onInspectSource(t.ref)}
                        className="inline-flex items-center text-[11px] font-mono text-[#0D6E8A] hover:underline bg-slate-50 px-2 py-0.5 rounded border border-slate-200"
                      >
                        <FileSpreadsheet className="w-3 h-3 mr-1" />
                        <span>{t.ref.file}</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bagian 2: Perbandingan Laporan Barang vs Laporan Keuangan (F.3.b) */}
      <div className="bg-white rounded-2xl border border-[#C8D6E5] shadow-xs p-6 space-y-4">
        <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-[#1B3A6B] text-sm">
              2. Perbandingan Nilai BMN pada Laporan Barang (LB) dan Laporan Keuangan (LK) (Tabel F.3.b)
            </h3>
            <p className="text-xs text-slate-500">
              Pencocokan antara catatan barang di SIMAN/UAKPB dengan catatan akuntansi neraca di SAKTI/UAKPA
            </p>
          </div>
        </div>

        <div className="overflow-x-auto border border-[#C8D6E5] rounded-xl">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#1B3A6B] text-white font-semibold">
              <tr>
                <th className="py-2.5 px-3">Akun Neraca</th>
                <th className="py-2.5 px-3 text-right">Laporan Barang (Rp)</th>
                <th className="py-2.5 px-3 text-right">Laporan Keuangan (Rp)</th>
                <th className="py-2.5 px-3 text-right">Selisih Nominal</th>
                <th className="py-2.5 px-3 text-right">Selisih (%)</th>
                <th className="py-2.5 px-3 text-center">Status Rekon</th>
                <th className="py-2.5 px-3">Penjelasan & Tindak Lanjut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {comparisonRows.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-3 font-semibold text-slate-800">{c.akunNeraca}</td>
                  <td className="py-3 px-3 text-right font-mono">{formatRupiah(c.laporanBarang)}</td>
                  <td className="py-3 px-3 text-right font-mono">{formatRupiah(c.laporanKeuangan)}</td>
                  <td className={`py-3 px-3 text-right font-mono font-bold ${c.selisih === 0 ? 'text-slate-600' : 'text-rose-600'}`}>
                    {formatRupiah(c.selisih)}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-slate-500">
                    {c.selisihPersen.toFixed(2)}%
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        c.status === 'SESUAI'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-rose-100 text-rose-800 border border-rose-200'
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-600 leading-relaxed text-[11px] max-w-sm">
                    {c.keterangan}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
