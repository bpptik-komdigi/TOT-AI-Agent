import React, { useState } from 'react';
import { BriefingSummary, SourceRef } from '../../types/bmn';
import {
  FileText,
  Printer,
  Copy,
  Check,
  Clock,
  Sparkles,
  AlertOctagon,
  TrendingUp,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';
import { KopSurat } from '../KopSurat';

interface Props {
  briefing: BriefingSummary;
  onInspectSourceText: (text: string) => void;
}

export const BriefingTab: React.FC<Props> = ({ briefing, onInspectSourceText }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyText = () => {
    const textContent = `
=== ${briefing.judul} ===

ANGKA KUNCI:
${briefing.angkaKunci.map((k) => `- ${k.label}: ${k.nilai} (${k.keterangan})`).join('\n')}

PERUBAHAN UTAMA:
${briefing.perubahanUtama.map((p) => `- ${p}`).join('\n')}

TEMUAN UTAMA:
${briefing.temuanUtama.map((t) => `- ${t}`).join('\n')}

HAL YANG MEMERLUKAN KEPUTUSAN PIMPINAN:
${briefing.butuhKeputusanPimpinan.map((d) => `[Urgensi ${d.urgensi}] ${d.isu}\n  Opsi Tindakan: ${d.opsiKeputusan}`).join('\n\n')}

Status: DRAF, belum disahkan
    `.trim();

    navigator.clipboard.writeText(textContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Actions */}
      <div className="bg-white border border-[#C8D6E5] rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-[#0D6E8A] uppercase tracking-wider">
              FR-06: Lembar Eksekutif Pimpinan
            </span>
            <span className="inline-flex items-center text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
              <Clock className="w-3 h-3 mr-1" /> Waktu Baca &lt; 5 Menit
            </span>
          </div>
          <h2 className="text-xl font-bold text-[#1B3A6B] mt-0.5">
            Ringkasan Briefing Pimpinan (1 Halaman)
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Dirancang khusus untuk Kepala Satker dan pejabat penandatangan sebelum menandatangani pengesahan LBP.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopyText}
            className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 transition flex items-center gap-1.5 border border-slate-200"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-600" />}
            <span>{copied ? 'Tersalin' : 'Salin Teks'}</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#1B3A6B] hover:bg-[#152e55] text-white transition flex items-center gap-1.5 shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Halaman Ini</span>
          </button>
        </div>
      </div>

      {/* Briefing Sheet (One Pager Card) */}
      <div className="bg-white rounded-2xl border-2 border-[#1B3A6B] p-6 sm:p-10 shadow-lg space-y-6 print:border-none print:shadow-none print:p-0">
        {/* Kop Surat Resmi Komdigi */}
        <KopSurat />

        {/* Header Briefing */}
        <div className="border-b-2 border-slate-200 pb-3 text-center space-y-1">
          <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded uppercase tracking-wider">
            DRAF RINGKASAN — BELUM DISAHKAN
          </span>
          <h3 className="text-base sm:text-xl font-black text-[#1B3A6B] uppercase tracking-tight pt-1">
            {briefing.judul}
          </h3>
          <p className="text-xs text-slate-600">
            Balai Pelatihan Talenta Komunikasi dan Digital • Kementerian Komunikasi dan Digital RI
          </p>
        </div>

        {/* 1. Angka Kunci */}
        <div className="space-y-3">
          <h4 className="text-xs font-black text-[#1B3A6B] uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#0D6E8A]" />
            <span>1. Angka Kunci (Key Figures)</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {briefing.angkaKunci.map((ak, idx) => (
              <div
                key={idx}
                className="bg-[#F4F6F9] border border-[#C8D6E5] rounded-xl p-3.5 space-y-1"
              >
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  {ak.label}
                </span>
                <div className="text-base sm:text-lg font-black text-[#1B3A6B] font-mono leading-tight">
                  {ak.nilai}
                </div>
                {ak.terbilang && (
                  <p className="text-[10px] text-slate-600 italic leading-tight">
                    ({ak.terbilang})
                  </p>
                )}
                <p className="text-[11px] text-slate-600 pt-1 border-t border-slate-200/60">
                  {ak.keterangan}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Perubahan Utama dari Periode Sebelumnya */}
        <div className="space-y-2 pt-2">
          <h4 className="text-xs font-black text-[#1B3A6B] uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#0D6E8A]" />
            <span>2. Perubahan Signifikan dari Periode Sebelumnya</span>
          </h4>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
            {briefing.perubahanUtama.map((pu, idx) => (
              <div key={idx} className="flex items-start space-x-2 text-xs text-slate-800">
                <span className="text-[#0D6E8A] font-bold mt-0.5">•</span>
                <p className="leading-relaxed">{pu}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Temuan Utama */}
        <div className="space-y-2 pt-2">
          <h4 className="text-xs font-black text-[#1B3A6B] uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#0D6E8A]" />
            <span>3. Temuan Utama Penatausahaan</span>
          </h4>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
            {briefing.temuanUtama.map((tu, idx) => (
              <div key={idx} className="flex items-start space-x-2 text-xs text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed">{tu}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Hal yang Memerlukan Keputusan Pimpinan */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-black text-rose-900 uppercase tracking-wider flex items-center gap-1.5">
            <AlertOctagon className="w-4 h-4 text-rose-600" />
            <span>4. Hal yang Memerlukan Keputusan / Tindak Lanjut Pimpinan</span>
          </h4>
          <div className="space-y-2.5">
            {briefing.butuhKeputusanPimpinan.map((dk, idx) => (
              <div
                key={idx}
                className="bg-rose-50/60 border border-rose-200 rounded-xl p-4 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs">
                    {idx + 1}. {dk.isu}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      dk.urgensi === 'Tinggi'
                        ? 'bg-rose-200 text-rose-900'
                        : 'bg-amber-200 text-amber-900'
                    }`}
                  >
                    Urgensi: {dk.urgensi}
                  </span>
                </div>
                <div className="text-xs text-slate-700 bg-white/80 p-2.5 rounded border border-rose-100">
                  <span className="font-semibold text-rose-900 block mb-0.5">Rekomendasi Tindakan:</span>
                  <p>{dk.opsiKeputusan}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Note */}
        <div className="border-t border-slate-200 pt-4 text-[11px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            Sumber Data: SAKTI BMN, SIMAN Master Aset, BAR Rekonsiliasi UAKPA/B (Audited)
          </p>
          <p className="font-medium">
            Disiapkan oleh Tim Pengelola BMN BPT Komdigi
          </p>
        </div>
      </div>
    </div>
  );
};
