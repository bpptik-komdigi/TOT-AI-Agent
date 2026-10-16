import React, { useState, useRef } from 'react';
import { UploadedFileItem } from '../../types/bmn';
import {
  UploadCloud,
  FileSpreadsheet,
  FileText,
  AlertCircle,
  CheckCircle2,
  Trash2,
  Play,
  Sparkles,
  ShieldAlert,
  Info,
} from 'lucide-react';

interface Props {
  uploadedFiles: UploadedFileItem[];
  onFilesSelected: (files: FileList | File[]) => void;
  onRemoveFile: (id: string) => void;
  onRunAnalysis: () => void;
  onLoadSampleData: () => void;
  isAnalyzing: boolean;
  analysisProgress: number;
}

export const UploadTab: React.FC<Props> = ({
  uploadedFiles,
  onFilesSelected,
  onRemoveFile,
  onRunAnalysis,
  onLoadSampleData,
  isAnalyzing,
  analysisProgress,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesSelected(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getBadgeType = (type: UploadedFileItem['recognizedType']) => {
    switch (type) {
      case 'SIMAN_ASET':
        return { label: 'SIMAN Master Aset', color: 'bg-blue-100 text-blue-800 border-blue-200' };
      case 'SALDO_MUTASI':
        return { label: 'SAKTI Mutasi & Saldo', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
      case 'PERSEDIAAN':
        return { label: 'Buku Persediaan', color: 'bg-purple-100 text-purple-800 border-purple-200' };
      case 'REKONSILIASI':
        return { label: 'BAR Rekonsiliasi (UAKPA/B)', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' };
      case 'LBP_LALU':
        return { label: 'LBP Pembanding Lalu', color: 'bg-amber-100 text-amber-800 border-amber-200' };
      case 'LAPORAN_KEUANGAN':
        return { label: 'Laporan Keuangan (LK)', color: 'bg-teal-100 text-teal-800 border-teal-200' };
      case 'TEMPLATE':
        return { label: 'Template LBP Resmi', color: 'bg-slate-100 text-slate-800 border-slate-200' };
      default:
        return { label: 'Dokumen Pendukung', color: 'bg-gray-100 text-gray-800 border-gray-200' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Intro Banner */}
      <div className="bg-gradient-to-r from-[#1B3A6B] to-[#0D6E8A] text-white rounded-2xl p-6 shadow-md">
        <div className="max-w-3xl space-y-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-xs">
            FR-01: Unggah & Pengenalan Multi-Format
          </span>
          <h2 className="text-2xl font-bold tracking-tight">
            Unggah Berkas Bahan Laporan Barang Kuasa Pengguna (LBP)
          </h2>
          <p className="text-sm text-blue-100 leading-relaxed">
            Petugas non-teknis cukup mengunggah berkas Excel (.xlsx, .xls), CSV, atau PDF dari sistem SIMAN, SAKTI, Persediaan, dan BAR Rekonsiliasi. Sistem otomatis membaca, mengklasifikasi tipe dokumen, memvalidasi keseimbangan angka, dan memetakan ke draf LBP.
          </p>
        </div>
      </div>

      {/* Drag and Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
          isDragOver
            ? 'border-[#0D6E8A] bg-blue-50/70 scale-[1.005]'
            : 'border-[#C8D6E5] hover:border-[#1B3A6B] bg-white hover:bg-slate-50/60'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".xlsx,.xls,.csv,.pdf"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              onFilesSelected(e.target.files);
            }
          }}
        />

        <div className="mx-auto w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-[#1B3A6B] mb-4 shadow-inner">
          <UploadCloud className="w-8 h-8 text-[#0D6E8A]" />
        </div>

        <h3 className="text-lg font-semibold text-slate-800">
          Tarik dan lepas beberapa berkas ke sini, atau klik untuk memilih
        </h3>
        <p className="text-xs text-slate-500 mt-1.5 max-w-md mx-auto">
          Mendukung berkas Excel (.xlsx, .xls), CSV, dan PDF. Beberapa berkas dapat diunggah sekaligus. Berkas yang gagal dibaca akan ditandai tanpa menghentikan pemrosesan berkas lainnya.
        </p>

        {/* Format categories pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-4 pt-4 border-t border-slate-100">
          <span className="text-[11px] font-medium text-slate-400">Dikenali Otomatis:</span>
          {['SIMAN Master Aset', 'SAKTI Mutasi Saldo', 'Persediaan', 'Rekonsiliasi UAKPA/B', 'LBP Tahun Lalu', 'Laporan Keuangan'].map((cat) => (
            <span
              key={cat}
              className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium"
            >
              {cat}
            </span>
          ))}
        </div>
      </div>

      {/* Quick Test Demo Button Card */}
      {uploadedFiles.length === 0 && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className="p-2 bg-emerald-500 text-white rounded-lg shrink-0 mt-0.5">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-emerald-900">Uji Coba Langsung dengan Data Contoh Fiktif</h4>
              <p className="text-xs text-emerald-700 mt-0.5">
                Ingin melihat cara kerja tanpa mengunggah berkas nyata? Muat paket data fiktif BPT Komdigi TA 2025 lengkap dengan 5 berkas simulasi untuk menguji validasi, perbandingan, dan draf laporan dalam hitungan detik.
              </p>
            </div>
          </div>
          <button
            onClick={onLoadSampleData}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shrink-0 transition shadow-sm flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>Muat Data Contoh BPT Komdigi</span>
          </button>
        </div>
      )}

      {/* Uploaded Files Table */}
      {uploadedFiles.length > 0 && (
        <div className="bg-white rounded-xl border border-[#C8D6E5] shadow-xs overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">
                Daftar Berkas Terunggah ({uploadedFiles.length} berkas)
              </h3>
              <p className="text-xs text-slate-500">
                Pemeriksaan format dan integritas baris data
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={onRunAnalysis}
                disabled={isAnalyzing}
                className="inline-flex items-center px-4 py-2 bg-[#1B3A6B] hover:bg-[#152e55] text-white text-xs font-semibold rounded-lg shadow-sm transition disabled:opacity-50 gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Menganalisis ({analysisProgress}%)...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    <span>Mulai Analisis & Susun LBP</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Progress bar if analyzing */}
          {isAnalyzing && (
            <div className="w-full bg-slate-200 h-1.5">
              <div
                className="bg-[#0D6E8A] h-1.5 transition-all duration-300"
                style={{ width: `${analysisProgress}%` }}
              />
            </div>
          )}

          <div className="divide-y divide-slate-100 max-h-[380px] overflow-y-auto">
            {uploadedFiles.map((file) => {
              const badge = getBadgeType(file.recognizedType);
              const isPdf = file.name.endsWith('.pdf');
              return (
                <div
                  key={file.id}
                  className="p-4 flex items-center justify-between hover:bg-slate-50/80 transition"
                >
                  <div className="flex items-center space-x-3.5 min-w-0">
                    <div
                      className={`p-2 rounded-lg shrink-0 ${
                        isPdf ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {isPdf ? (
                        <FileText className="w-5 h-5" />
                      ) : (
                        <FileSpreadsheet className="w-5 h-5" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="font-semibold text-xs text-slate-800 truncate max-w-xs sm:max-w-md">
                          {file.name}
                        </p>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${badge.color}`}
                        >
                          {badge.label}
                        </span>
                      </div>

                      <div className="flex items-center space-x-3 text-[11px] text-slate-500 mt-1">
                        <span>{formatFileSize(file.size)}</span>
                        <span>•</span>
                        <span>
                          {file.status === 'PARSED'
                            ? `${file.recordsCount} baris data terbaca`
                            : file.status === 'PARSING'
                            ? 'Sedang membaca...'
                            : 'Gagal diproses'}
                        </span>
                      </div>

                      {file.errorMessage && (
                        <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{file.errorMessage}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {file.status === 'PARSED' ? (
                      <span className="p-1 rounded-full text-emerald-600 bg-emerald-50" title="Valid">
                        <CheckCircle2 className="w-5 h-5" />
                      </span>
                    ) : file.status === 'ERROR' ? (
                      <span className="p-1 rounded-full text-rose-600 bg-rose-50" title="Gagal Baca">
                        <AlertCircle className="w-5 h-5" />
                      </span>
                    ) : null}

                    <button
                      onClick={() => onRemoveFile(file.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition"
                      title="Hapus berkas"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Security & Confidentiality Notice (NFR-03) */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-600 flex items-start space-x-3">
        <ShieldAlert className="w-4 h-4 text-[#1B3A6B] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-slate-800">
            Kepatuhan Keamanan Data BMN (NFR-03):
          </p>
          <p className="text-slate-600 leading-relaxed">
            Data Barang Milik Negara bersifat internal instansi BPT Komdigi. Seluruh pemrosesan dilakukan per sesi di memori aplikasi tanpa penyimpanan basis data permanen. Tidak ada kredensial sistem atau API key yang terekspos ke antarmuka pengguna.
          </p>
        </div>
      </div>
    </div>
  );
};
