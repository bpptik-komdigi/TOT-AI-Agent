import React, { useState } from 'react';
import { ValidationFinding, SourceRef } from '../../types/bmn';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Filter,
  FileSpreadsheet,
  ShieldCheck,
  Search,
} from 'lucide-react';

interface Props {
  findings: ValidationFinding[];
  onInspectSource: (source: SourceRef) => void;
}

export const ValidationTab: React.FC<Props> = ({ findings, onInspectSource }) => {
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'PASS' | 'WARNING' | 'FAIL'>('ALL');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const passCount = findings.filter((f) => f.status === 'PASS').length;
  const warningCount = findings.filter((f) => f.status === 'WARNING').length;
  const failCount = findings.filter((f) => f.status === 'FAIL').length;
  const totalCount = findings.length;

  const categories = Array.from(new Set(findings.map((f) => f.kategori)));

  const filtered = findings.filter((f) => {
    if (filterStatus !== 'ALL' && f.status !== filterStatus) return false;
    if (filterCategory !== 'ALL' && f.kategori !== filterCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        f.uraian.toLowerCase().includes(q) ||
        f.aturan.toLowerCase().includes(q) ||
        f.file.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-white border border-[#C8D6E5] rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-[#0D6E8A] uppercase tracking-wider">
            FR-03: Validasi & Pencocokan Deterministic
          </span>
          <h2 className="text-xl font-bold text-[#1B3A6B] mt-0.5">
            Hasil Uji Keseimbangan & Konsistensi Data BMN
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Seluruh saldo, nilai buku, gabungan, persentase, terbilang, dan kondisi dihitung menggunakan logika kode deterministik tanpa tebakan model AI.
          </p>
        </div>

        {/* Counter Badges */}
        <div className="flex items-center gap-2">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-3.5 py-2 text-center">
            <span className="text-[10px] font-bold text-emerald-700 uppercase">Lulus</span>
            <div className="text-xl font-black text-emerald-800">{passCount}</div>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-3.5 py-2 text-center">
            <span className="text-[10px] font-bold text-amber-700 uppercase">Peringatan</span>
            <div className="text-xl font-black text-amber-800">{warningCount}</div>
          </div>
          <div className="bg-rose-50 border border-rose-200 rounded-xl px-3.5 py-2 text-center">
            <span className="text-[10px] font-bold text-rose-700 uppercase">Selisih/Fail</span>
            <div className="text-xl font-black text-rose-800">{failCount}</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#F4F6F9] border border-[#C8D6E5] rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-slate-600 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter Status:
          </span>
          {(['ALL', 'FAIL', 'WARNING', 'PASS'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                filterStatus === st
                  ? 'bg-[#1B3A6B] text-white'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              {st === 'ALL' ? `Semua (${totalCount})` : st === 'FAIL' ? `Selisih (${failCount})` : st === 'WARNING' ? `Peringatan (${warningCount})` : `Lulus (${passCount})`}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-700 text-xs"
          >
            <option value="ALL">Semua Kategori Pemeriksaan</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Cari uraian atau berkas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-800 text-xs w-48 sm:w-64"
            />
          </div>
        </div>
      </div>

      {/* Findings Table */}
      <div className="bg-white rounded-xl border border-[#C8D6E5] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#1B3A6B] text-white font-semibold">
              <tr>
                <th className="py-2.5 px-3 w-24">Status</th>
                <th className="py-2.5 px-3 w-32">Kategori</th>
                <th className="py-2.5 px-3">Uraian & Aturan Validasi</th>
                <th className="py-2.5 px-3 text-right">Ditemukan</th>
                <th className="py-2.5 px-3 text-right">Seharusnya</th>
                <th className="py-2.5 px-3">Rujukan Sumber</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.map((f) => (
                <tr key={f.id} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-3">
                    {f.status === 'PASS' ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> PASS
                      </span>
                    ) : f.status === 'WARNING' ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                        <AlertTriangle className="w-3 h-3 mr-1" /> WARNING
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                        <XCircle className="w-3 h-3 mr-1" /> FAIL
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-700">
                    {f.kategori}
                  </td>
                  <td className="py-3 px-3 space-y-0.5">
                    <p className="font-medium text-slate-900">{f.uraian}</p>
                    <p className="text-[11px] text-slate-500 italic">Formula: {f.aturan}</p>
                    <p className="text-[11px] text-[#0D6E8A]">{f.dampak}</p>
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-slate-800">
                    {f.nilaiDitemukan}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-medium text-emerald-700">
                    {f.nilaiDiharapkan}
                  </td>
                  <td className="py-3 px-3">
                    <button
                      onClick={() =>
                        onInspectSource({
                          file: f.file,
                          sheet: f.sheet,
                          baris: f.baris,
                          keterangan: f.uraian,
                        })
                      }
                      className="inline-flex items-center text-[11px] font-mono text-[#0D6E8A] hover:text-[#1B3A6B] hover:underline bg-slate-50 px-2 py-1 rounded border border-slate-200"
                    >
                      <FileSpreadsheet className="w-3 h-3 mr-1 text-slate-500" />
                      <span>{f.file} [{f.sheet}:{f.baris}]</span>
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                    Tidak ada temuan validasi yang cocok dengan kriteria filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
