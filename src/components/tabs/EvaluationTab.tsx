import React, { useState } from 'react';
import { EvaluationCriteria } from '../../types/bmn';
import {
  Award,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Save,
  HelpCircle,
  FileCheck,
  Clock,
  ShieldCheck,
} from 'lucide-react';

interface Props {
  elapsedSeconds: number;
}

export const EvaluationTab: React.FC<Props> = ({ elapsedSeconds }) => {
  const elapsedMinutes = Math.round(elapsedSeconds / 60);

  // Auto-suggest speed score based on elapsed minutes
  const getAutoSpeedScore = () => {
    if (elapsedMinutes <= 15) return 5;
    if (elapsedMinutes <= 30) return 4;
    if (elapsedMinutes <= 60) return 3;
    if (elapsedMinutes <= 90) return 2;
    return 1;
  };

  const [criteria, setCriteria] = useState<EvaluationCriteria>({
    kecepatan: getAutoSpeedScore(),
    akurasi: 5,
    kelengkapan: 5,
    kualitas: 5,
    kepatuhan: 5,
    catatanPetugas: 'Seluruh angka kunci terbukti 100% klop dengan lembar kerja SIMAN dan SAKTI. Stopwatch tercatat selesai dalam waktu sangat cepat.',
    namaPenilai: 'Petugas BMN BPT Komdigi',
    tanggalPenilaian: new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Calculate weighted score
  // Kecepatan 25%, Akurasi 30%, Kelengkapan 15%, Kualitas 15%, Kepatuhan 15%
  const skorAkhir =
    criteria.kecepatan * 0.25 +
    criteria.akurasi * 0.3 +
    criteria.kelengkapan * 0.15 +
    criteria.kualitas * 0.15 +
    criteria.kepatuhan * 0.15;

  // Syarat tambahan: kriteria Akurasi dan Kepatuhan harus bernilai minimal 4
  const isMandatoryPassed = criteria.akurasi >= 4 && criteria.kepatuhan >= 4;

  let kategoriKelayakan = 'Belum Layak';
  let badgeColor = 'bg-rose-100 text-rose-800 border-rose-300';
  let badgeIcon = <XCircle className="w-5 h-5 text-rose-600" />;

  if (skorAkhir >= 4.0 && isMandatoryPassed) {
    kategoriKelayakan = 'Layak Dipakai dengan Verifikasi Petugas';
    badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-300';
    badgeIcon = <CheckCircle className="w-5 h-5 text-emerald-600" />;
  } else if (skorAkhir >= 3.0) {
    kategoriKelayakan = !isMandatoryPassed
      ? 'Perlu Perbaikan (Akurasi & Kepatuhan harus minimal 4)'
      : 'Perlu Perbaikan Sebelum Dipakai';
    badgeColor = 'bg-amber-100 text-amber-800 border-amber-300';
    badgeIcon = <AlertTriangle className="w-5 h-5 text-amber-600" />;
  }

  const handleSaveEvaluation = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Intro Header */}
      <div className="bg-white border border-[#C8D6E5] rounded-2xl p-6 shadow-xs">
        <span className="text-xs font-semibold text-[#0D6E8A] uppercase tracking-wider">
          Bagian 16 PRD: Kriteria Evaluasi & Uji Kelayakan
        </span>
        <h2 className="text-xl font-bold text-[#1B3A6B] mt-0.5">
          Formulir Penilaian Hasil Kerja AI Agent oleh Petugas BMN
        </h2>
        <p className="text-xs text-slate-600 mt-1">
          Penilaian lima kriteria terbobot dengan skala 1 sampai 5. Menentukan apakah hasil otomatisasi LBP layak dipakai dengan verifikasi manusia.
        </p>
      </div>

      {/* Score Summary Banner */}
      <div className="bg-white rounded-2xl border-2 border-[#1B3A6B] p-6 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Hasil Skor Akhir Tertimbang (Maksimal 5,00)
          </span>
          <div className="flex items-baseline space-x-2">
            <span className="text-4xl sm:text-5xl font-black text-[#1B3A6B] font-mono">
              {skorAkhir.toFixed(2)}
            </span>
            <span className="text-base text-slate-400 font-semibold">/ 5,00</span>
          </div>
          <div className={`inline-flex items-center px-3 py-1 rounded-xl text-xs font-bold border ${badgeColor}`}>
            {badgeIcon}
            <span className="ml-1.5">{kategoriKelayakan}</span>
          </div>
        </div>

        <div className="border-t sm:border-t-0 sm:border-l border-slate-200 pt-4 sm:pt-0 sm:pl-6 space-y-2 text-xs">
          <div className="font-semibold text-slate-700">Aturan Kelulusan Resmi:</div>
          <ul className="space-y-1 text-slate-600">
            <li className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>&ge; 4,0: Layak dipakai dengan verifikasi</span>
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <span>3,0 s.d. 3,9: Perlu perbaikan</span>
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              <span>&lt; 3,0: Belum layak</span>
            </li>
            <li className="text-rose-700 font-semibold pt-1">
              * Kriteria Akurasi & Kepatuhan wajib minimal 4,0
            </li>
          </ul>
        </div>
      </div>

      {/* Criteria Evaluation Sliders */}
      <div className="bg-white rounded-2xl border border-[#C8D6E5] p-6 shadow-xs space-y-6">
        <h3 className="font-bold text-slate-900 text-sm border-b border-slate-200 pb-3">
          Parameter Penilaian Terbobot
        </h3>

        {/* 1. Kecepatan (25%) */}
        <div className="space-y-2 border-b border-slate-100 pb-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="font-bold text-slate-900 text-xs">
                1. Kecepatan Proses (Bobot 25%)
              </span>
              <p className="text-[11px] text-slate-500">
                Waktu dari file diunggah sampai hasil siap. Waktu stopwatch sesi ini:{' '}
                <strong>{elapsedMinutes} Menit</strong>.
              </p>
            </div>
            <span className="text-sm font-black font-mono text-[#1B3A6B] bg-blue-50 px-2 py-0.5 rounded">
              Skor: {criteria.kecepatan} / 5
            </span>
          </div>

          <div className="grid grid-cols-5 gap-1.5 pt-1">
            {[
              { val: 1, desc: '> 90 menit' },
              { val: 2, desc: '61 - 90 menit' },
              { val: 3, desc: '31 - 60 menit' },
              { val: 4, desc: '16 - 30 menit' },
              { val: 5, desc: '≤ 15 menit' },
            ].map((opt) => (
              <button
                key={opt.val}
                onClick={() => setCriteria({ ...criteria, kecepatan: opt.val })}
                className={`py-2 px-1 rounded-lg text-center transition border ${
                  criteria.kecepatan === opt.val
                    ? 'bg-[#1B3A6B] text-white border-[#1B3A6B] font-bold shadow-xs'
                    : 'bg-[#F4F6F9] hover:bg-slate-200 text-slate-700 border-slate-200 text-xs'
                }`}
              >
                <div className="text-xs">{opt.val}</div>
                <div className="text-[10px] opacity-80 leading-tight">{opt.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Akurasi Angka Kunci (30%) */}
        <div className="space-y-2 border-b border-slate-100 pb-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="font-bold text-slate-900 text-xs flex items-center gap-1">
                <span>2. Akurasi Angka Kunci (Bobot 30%)</span>
                <span className="text-rose-600 font-bold">*Wajib &ge;4</span>
              </span>
              <p className="text-[11px] text-slate-500">
                Kesesuaian saldo, mutasi, nilai buku, dan persentase dengan data sumber.
              </p>
            </div>
            <span className="text-sm font-black font-mono text-[#1B3A6B] bg-blue-50 px-2 py-0.5 rounded">
              Skor: {criteria.akurasi} / 5
            </span>
          </div>

          <div className="grid grid-cols-5 gap-1.5 pt-1">
            {[
              { val: 1, desc: '< 80% sesuai' },
              { val: 2, desc: '80% - 89%' },
              { val: 3, desc: '90% - 94%' },
              { val: 4, desc: '95% - 99%' },
              { val: 5, desc: '100% sesuai' },
            ].map((opt) => (
              <button
                key={opt.val}
                onClick={() => setCriteria({ ...criteria, akurasi: opt.val })}
                className={`py-2 px-1 rounded-lg text-center transition border ${
                  criteria.akurasi === opt.val
                    ? 'bg-[#1B3A6B] text-white border-[#1B3A6B] font-bold shadow-xs'
                    : 'bg-[#F4F6F9] hover:bg-slate-200 text-slate-700 border-slate-200 text-xs'
                }`}
              >
                <div className="text-xs">{opt.val}</div>
                <div className="text-[10px] opacity-80 leading-tight">{opt.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 3. Kelengkapan Format Draf (15%) */}
        <div className="space-y-2 border-b border-slate-100 pb-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="font-bold text-slate-900 text-xs">
                3. Kelengkapan dan Kesesuaian Format Draf LBP (Bobot 15%)
              </span>
              <p className="text-[11px] text-slate-500">
                Semua bab A sampai G, Nota Dinas, tabel teks, dan kolom sesuai acuan resmi TA 2025 Audited.
              </p>
            </div>
            <span className="text-sm font-black font-mono text-[#1B3A6B] bg-blue-50 px-2 py-0.5 rounded">
              Skor: {criteria.kelengkapan} / 5
            </span>
          </div>

          <div className="grid grid-cols-5 gap-1.5 pt-1">
            {[
              { val: 1, desc: '< 40% terisi' },
              { val: 2, desc: '40% - 69%' },
              { val: 3, desc: '70% - 84%' },
              { val: 4, desc: '85% - 94%' },
              { val: 5, desc: '≥ 95% benar' },
            ].map((opt) => (
              <button
                key={opt.val}
                onClick={() => setCriteria({ ...criteria, kelengkapan: opt.val })}
                className={`py-2 px-1 rounded-lg text-center transition border ${
                  criteria.kelengkapan === opt.val
                    ? 'bg-[#1B3A6B] text-white border-[#1B3A6B] font-bold shadow-xs'
                    : 'bg-[#F4F6F9] hover:bg-slate-200 text-slate-700 border-slate-200 text-xs'
                }`}
              >
                <div className="text-xs">{opt.val}</div>
                <div className="text-[10px] opacity-80 leading-tight">{opt.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 4. Kualitas Temuan & Kesimpulan (15%) */}
        <div className="space-y-2 border-b border-slate-100 pb-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="font-bold text-slate-900 text-xs">
                4. Kualitas Temuan dan Kesimpulan (Bobot 15%)
              </span>
              <p className="text-[11px] text-slate-500">
                Temuan relevan, berrujukan baris berkas, dan berlabel Baru / Berulang secara tepat.
              </p>
            </div>
            <span className="text-sm font-black font-mono text-[#1B3A6B] bg-blue-50 px-2 py-0.5 rounded">
              Skor: {criteria.kualitas} / 5
            </span>
          </div>

          <div className="grid grid-cols-5 gap-1.5 pt-1">
            {[
              { val: 1, desc: 'Tanpa rujukan' },
              { val: 2, desc: 'Rujukan parsial' },
              { val: 3, desc: 'Sebagian tepat' },
              { val: 4, desc: 'Mayoritas tepat' },
              { val: 5, desc: 'Semua relevan' },
            ].map((opt) => (
              <button
                key={opt.val}
                onClick={() => setCriteria({ ...criteria, kualitas: opt.val })}
                className={`py-2 px-1 rounded-lg text-center transition border ${
                  criteria.kualitas === opt.val
                    ? 'bg-[#1B3A6B] text-white border-[#1B3A6B] font-bold shadow-xs'
                    : 'bg-[#F4F6F9] hover:bg-slate-200 text-slate-700 border-slate-200 text-xs'
                }`}
              >
                <div className="text-xs">{opt.val}</div>
                <div className="text-[10px] opacity-80 leading-tight">{opt.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 5. Kepatuhan pada Batasan (15%) */}
        <div className="space-y-2 pb-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="font-bold text-slate-900 text-xs flex items-center gap-1">
                <span>5. Kepatuhan pada Batasan (Anti-Mengarang Data) (Bobot 15%)</span>
                <span className="text-rose-600 font-bold">*Wajib &ge;4</span>
              </span>
              <p className="text-[11px] text-slate-500">
                Nol angka halusinasi/karangan, sel kosong bertanda &quot;tidak ditemukan&quot;, dugaan ditandai dugaan.
              </p>
            </div>
            <span className="text-sm font-black font-mono text-[#1B3A6B] bg-blue-50 px-2 py-0.5 rounded">
              Skor: {criteria.kepatuhan} / 5
            </span>
          </div>

          <div className="grid grid-cols-5 gap-1.5 pt-1">
            {[
              { val: 1, desc: 'Ada halusinasi' },
              { val: 2, desc: 'Beberapa tebakan' },
              { val: 3, desc: 'Tanpa karangan' },
              { val: 4, desc: 'Disiplin draf' },
              { val: 5, desc: 'Nol karangan' },
            ].map((opt) => (
              <button
                key={opt.val}
                onClick={() => setCriteria({ ...criteria, kepatuhan: opt.val })}
                className={`py-2 px-1 rounded-lg text-center transition border ${
                  criteria.kepatuhan === opt.val
                    ? 'bg-[#1B3A6B] text-white border-[#1B3A6B] font-bold shadow-xs'
                    : 'bg-[#F4F6F9] hover:bg-slate-200 text-slate-700 border-slate-200 text-xs'
                }`}
              >
                <div className="text-xs">{opt.val}</div>
                <div className="text-[10px] opacity-80 leading-tight">{opt.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Evaluator Notes & Signature Form */}
      <div className="bg-white rounded-2xl border border-[#C8D6E5] p-6 shadow-xs space-y-4">
        <h3 className="font-bold text-slate-900 text-sm">
          Catatan Verifikasi Petugas Penilai
        </h3>

        <div className="space-y-3 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Catatan & Rekomendasi Petugas
            </label>
            <textarea
              rows={3}
              value={criteria.catatanPetugas}
              onChange={(e) => setCriteria({ ...criteria, catatanPetugas: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Nama Petugas Penilai
              </label>
              <input
                type="text"
                value={criteria.namaPenilai}
                onChange={(e) => setCriteria({ ...criteria, namaPenilai: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Tanggal Penilaian
              </label>
              <input
                type="text"
                value={criteria.tanggalPenilaian}
                onChange={(e) => setCriteria({ ...criteria, tanggalPenilaian: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
              />
            </div>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between border-t border-slate-200">
          {savedSuccess ? (
            <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
              <CheckCircle className="w-4 h-4" /> Penilaian evaluasi berhasil disimpan ke log sesi.
            </span>
          ) : (
            <span className="text-xs text-slate-500">
              Hasil penilaian akan disertakan dalam arsip telaah BMN.
            </span>
          )}

          <button
            onClick={handleSaveEvaluation}
            className="px-4 py-2 bg-[#1B3A6B] hover:bg-[#152e55] text-white text-xs font-semibold rounded-lg transition flex items-center gap-1.5 shadow-xs"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Evaluasi</span>
          </button>
        </div>
      </div>
    </div>
  );
};
