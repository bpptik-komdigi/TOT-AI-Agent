import React, { useState } from 'react';
import { AnalysisFinding, SourceRef } from '../../types/bmn';
import {
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  Filter,
  ShieldAlert,
  ArrowRight,
  FileSpreadsheet,
  Tag,
} from 'lucide-react';

interface Props {
  findings: AnalysisFinding[];
  onInspectSourceText: (rujukan: string) => void;
}

export const FindingsTab: React.FC<Props> = ({ findings, onInspectSourceText }) => {
  const [filterLabel, setFilterLabel] = useState<'ALL' | 'Baru' | 'Berulang'>('ALL');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'Fakta' | 'Dugaan'>('ALL');

  const filtered = findings.filter((f) => {
    if (filterLabel !== 'ALL' && f.label !== filterLabel) return false;
    if (filterStatus !== 'ALL' && f.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-white border border-[#C8D6E5] rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-[#0D6E8A] uppercase tracking-wider">
            FR-05: Kesimpulan Temuan & Kendala Penatausahaan BMN
          </span>
          <h2 className="text-xl font-bold text-[#1B3A6B] mt-0.5">
            Daftar Temuan Analitik & Tindak Lanjut
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Mengidentifikasi temuan Baru vs Berulang, membedakan Fakta terukur dengan Dugaan hipotesis, dan mencantumkan rujukan berkas serta tingkat keyakinan.
          </p>
        </div>

        {/* AI Guardrail Info Badge */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-slate-700 flex items-start space-x-2 max-w-sm">
          <ShieldAlert className="w-4 h-4 text-[#1B3A6B] shrink-0 mt-0.5" />
          <p className="text-[11px] leading-tight">
            <strong>AI Safety Guardrails:</strong> Setiap penyebab yang belum terverifikasi 100% dari dokumen pendukung wajib ditandai sebagai <em>Dugaan</em>, bukan Fakta.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-[#F4F6F9] border border-[#C8D6E5] rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-3">
          <span className="font-semibold text-slate-600 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter Siklus:
          </span>
          {(['ALL', 'Baru', 'Berulang'] as const).map((lbl) => (
            <button
              key={lbl}
              onClick={() => setFilterLabel(lbl)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                filterLabel === lbl
                  ? 'bg-[#1B3A6B] text-white'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              {lbl === 'ALL' ? 'Semua Temuan' : lbl === 'Baru' ? 'Temuan Baru' : 'Temuan Berulang'}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <span className="font-semibold text-slate-600">Status Validitas:</span>
          {(['ALL', 'Fakta', 'Dugaan'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1 rounded-lg font-semibold transition text-xs ${
                filterStatus === st
                  ? 'bg-[#0D6E8A] text-white'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              {st === 'ALL' ? 'Semua Status' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Findings Cards List */}
      <div className="space-y-4">
        {filtered.map((finding) => (
          <div
            key={finding.id}
            className="bg-white rounded-xl border border-[#C8D6E5] p-5 shadow-xs hover:shadow-md transition space-y-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <span
                  className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                    finding.label === 'Baru'
                      ? 'bg-blue-100 text-blue-800 border border-blue-200'
                      : 'bg-amber-100 text-amber-800 border border-amber-200'
                  }`}
                >
                  {finding.label === 'Baru' ? '★ Temuan Baru' : '⟳ Temuan Berulang'}
                </span>

                <span
                  className={`px-2 py-0.5 rounded text-xs font-medium ${
                    finding.status === 'Fakta'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-indigo-100 text-indigo-800'
                  }`}
                >
                  Status: {finding.status}
                </span>

                <span className="text-xs text-slate-500">
                  Keyakinan:{' '}
                  <strong
                    className={
                      finding.tingkatKeyakinan === 'Tinggi'
                        ? 'text-emerald-700'
                        : finding.tingkatKeyakinan === 'Sedang'
                        ? 'text-amber-700'
                        : 'text-slate-600'
                    }
                  >
                    {finding.tingkatKeyakinan}
                  </strong>
                </span>
              </div>

              <div className="text-[11px] font-mono text-slate-500">
                ID: {finding.id}
              </div>
            </div>

            <p className="text-sm text-slate-800 leading-relaxed font-medium">
              {finding.uraian}
            </p>

            {finding.rekomendasi && (
              <div className="bg-slate-50 border-l-2 border-[#0D6E8A] p-2.5 rounded-r-lg text-xs text-slate-700">
                <span className="font-semibold text-[#1B3A6B] block mb-0.5">Rekomendasi Tindak Lanjut:</span>
                <p>{finding.rekomendasi}</p>
              </div>
            )}

            <div className="flex items-center justify-between pt-2 text-xs text-slate-500 border-t border-slate-100">
              <div className="flex items-center space-x-1.5 font-mono text-[11px] text-slate-600">
                <FileSpreadsheet className="w-3.5 h-3.5 text-[#0D6E8A]" />
                <span>Rujukan: {finding.rujukan}</span>
              </div>

              <button
                onClick={() => onInspectSourceText(finding.rujukan)}
                className="text-[#0D6E8A] hover:text-[#1B3A6B] font-semibold flex items-center gap-1 hover:underline"
              >
                <span>Periksa Rujukan</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="bg-white rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-400 text-xs">
            Tidak ada temuan yang sesuai dengan filter.
          </div>
        )}
      </div>
    </div>
  );
};
