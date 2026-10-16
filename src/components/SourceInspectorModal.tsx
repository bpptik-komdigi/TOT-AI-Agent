import React from 'react';
import { SourceRef } from '../types/bmn';
import { X, FileSpreadsheet, CheckCircle2, ShieldCheck, MapPin } from 'lucide-react';

interface Props {
  source: SourceRef | null;
  onClose: () => void;
}

export const SourceInspectorModal: React.FC<Props> = ({ source, onClose }) => {
  if (!source) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="bg-[#1B3A6B] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 bg-white/10 rounded-lg">
              <FileSpreadsheet className="w-5 h-5 text-teal-300" />
            </div>
            <div>
              <h3 className="font-semibold text-base leading-tight">Jejak Sumber Data (Provenance)</h3>
              <p className="text-xs text-blue-200">Keterlacakan angka ke dokumen sumber BMN</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="bg-[#F4F6F9] border border-[#C8D6E5] rounded-lg p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Nama File Sumber</span>
                <p className="font-mono text-sm font-semibold text-[#1B3A6B] mt-0.5 break-all">
                  {source.file}
                </p>
              </div>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800">
                <CheckCircle2 className="w-3 h-3 mr-1" /> Terverifikasi
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Sheet / Lembar</span>
                <p className="font-mono text-sm font-semibold text-slate-800 mt-0.5">
                  {source.sheet}
                </p>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Nomor Baris</span>
                <p className="font-mono text-sm font-semibold text-slate-800 mt-0.5">
                  Baris {source.baris}
                </p>
              </div>
            </div>

            {source.kode && (
              <div className="pt-2 border-t border-slate-200">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Kode Akun / BMN</span>
                <p className="font-mono text-sm font-semibold text-[#0D6E8A] mt-0.5">
                  {source.kode}
                </p>
              </div>
            )}

            {source.keterangan && (
              <div className="pt-2 border-t border-slate-200">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Catatan Entri</span>
                <p className="text-xs text-slate-700 mt-0.5 leading-relaxed">
                  {source.keterangan}
                </p>
              </div>
            )}
          </div>

          <div className="flex items-start space-x-3 text-xs text-slate-600 bg-blue-50 border border-blue-200 rounded-lg p-3">
            <ShieldCheck className="w-4 h-4 text-[#0D6E8A] shrink-0 mt-0.5" />
            <p>
              Prinsip <strong>NFR-04 Transparansi</strong>: 100% angka kunci terhubung langsung ke berkas mentah. Tidak ada angka yang dihasilkan tanpa referensi data.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium bg-[#1B3A6B] text-white rounded-lg hover:bg-[#152e55] transition shadow-xs"
          >
            Tutup Pemeriksa Sumber
          </button>
        </div>
      </div>
    </div>
  );
};
