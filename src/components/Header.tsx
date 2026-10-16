import React from 'react';
import {
  Timer,
  FileCheck2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Building2,
  Clock,
  CheckCircle,
} from 'lucide-react';
import { KomdigiLogo } from './KomdigiLogo';

interface Props {
  elapsedSeconds: number;
  isStopwatchRunning: boolean;
  onResetStopwatch: () => void;
  onLoadSampleData: () => void;
  onClearData: () => void;
  hasData: boolean;
}

export const Header: React.FC<Props> = ({
  elapsedSeconds,
  isStopwatchRunning,
  onResetStopwatch,
  onLoadSampleData,
  onClearData,
  hasData,
}) => {
  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const minutesElapsed = elapsedSeconds / 60;
  // Baseline is 120 minutes. Target is <= 15 minutes. Minimal target is <= 60 minutes (50% reduction).
  const isTargetMet = minutesElapsed <= 15;
  const isMinimalMet = minutesElapsed <= 60;

  return (
    <header className="bg-white border-b border-[#C8D6E5] sticky top-0 z-40 shadow-xs">
      {/* Top Banner: Status DRAF - BELUM DISAHKAN */}
      <div className="bg-amber-500 text-slate-900 px-4 py-1 text-center font-bold text-xs tracking-wider flex items-center justify-center space-x-2 border-b border-amber-600/30">
        <AlertTriangle className="w-4 h-4 text-slate-950 animate-pulse" />
        <span>STATUS: DRAF — BELUM DISAHKAN (Verifikasi Petugas & Pengesahan Pejabat Wajib Dilakukan)</span>
        <AlertTriangle className="w-4 h-4 text-slate-950 animate-pulse" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Logo & Entity Identity */}
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-xl bg-white border border-[#C8D6E5] flex items-center justify-center shadow-md shadow-blue-900/5 p-1">
              <KomdigiLogo size={38} showText={false} />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold text-[#1B3A6B] tracking-tight">
                  Asisten Analisis LBP BMN
                </h1>
                <span className="bg-blue-100 text-[#0D6E8A] text-xs font-semibold px-2 py-0.5 rounded-full border border-blue-200">
                  v1.2 Audited
                </span>
              </div>
              <p className="text-xs text-slate-600 flex items-center gap-1.5 mt-0.5">
                <span className="font-medium text-slate-700">Balai Pelatihan Talenta Komunikasi dan Digital</span>
                <span className="text-slate-300">•</span>
                <span>Satker 651234</span>
                <span className="text-slate-300">•</span>
                <span>LBP BMN Semesteran & Tahunan</span>
              </p>
            </div>
          </div>

          {/* Stopwatch & Speed Benchmark KPI */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-[#F4F6F9] border border-[#C8D6E5] rounded-xl px-3.5 py-1.5 flex items-center space-x-3 shadow-inner">
              <div className="flex items-center space-x-2">
                <div
                  className={`p-1.5 rounded-lg ${
                    isStopwatchRunning ? 'bg-amber-100 text-amber-700 animate-pulse' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  <Timer className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <span>Stopwatch Proses</span>
                    {isStopwatchRunning && (
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    )}
                  </div>
                  <div className="font-mono text-lg font-bold text-[#1B3A6B] leading-none">
                    {formatTime(elapsedSeconds)}
                  </div>
                </div>
              </div>

              <div className="border-l border-slate-300 pl-3 hidden sm:block">
                <div className="text-[10px] text-slate-500 font-medium">Target vs Baseline:</div>
                <div className="flex items-center space-x-1.5 text-xs font-semibold">
                  {elapsedSeconds === 0 ? (
                    <span className="text-slate-500">Mulai saat file diunggah</span>
                  ) : isTargetMet ? (
                    <span className="text-emerald-700 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Target &le;15m Tercapai (-87.5%)
                    </span>
                  ) : isMinimalMet ? (
                    <span className="text-amber-700 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Target Minimal &le;60m (-50%)
                    </span>
                  ) : (
                    <span className="text-rose-600">Melampaui 60m</span>
                  )}
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={onLoadSampleData}
                className="inline-flex items-center px-3 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-xs gap-1.5"
                title="Muat data fiktif BPT Komdigi TA 2025 untuk uji coba instan"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Muat Data Contoh</span>
              </button>

              {hasData && (
                <button
                  onClick={onClearData}
                  className="inline-flex items-center px-2.5 py-2 text-xs font-semibold rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 transition gap-1"
                  title="Bersihkan data sesi saat ini"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Reset Sesi</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
