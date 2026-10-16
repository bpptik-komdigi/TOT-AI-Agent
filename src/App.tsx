import React, { useState, useEffect, useRef } from 'react';
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
  UploadedFileItem,
  SourceRef,
} from './types/bmn';
import {
  initialMeta,
  sampleUploadedFiles,
  sampleNeracaRows,
  sampleMutasiRows,
  sampleAssetItems,
  samplePersediaanItems,
  sampleComparisonRows,
  sampleTrendRows,
  sampleStatusPenggunaan,
  sampleAnalysisFindings,
  sampleBriefingSummary,
} from './data/sampleBmnData';
import { runFullValidation } from './utils/validation';
import { parseUploadedFile } from './utils/fileParser';
import { Header } from './components/Header';
import { SourceInspectorModal } from './components/SourceInspectorModal';
import { UploadTab } from './components/tabs/UploadTab';
import { DraftReportTab } from './components/tabs/DraftReportTab';
import { ValidationTab } from './components/tabs/ValidationTab';
import { VarianceTab } from './components/tabs/VarianceTab';
import { FindingsTab } from './components/tabs/FindingsTab';
import { BriefingTab } from './components/tabs/BriefingTab';
import { DownloadTab } from './components/tabs/DownloadTab';
import { EvaluationTab } from './components/tabs/EvaluationTab';

import {
  UploadCloud,
  FileText,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  FileCheck,
  Download,
  Award,
} from 'lucide-react';

type TabType =
  | 'unggah'
  | 'draf'
  | 'validasi'
  | 'selisih'
  | 'temuan'
  | 'briefing'
  | 'unduh'
  | 'evaluasi';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('draf');

  // Metadata & Records State
  const [meta, setMeta] = useState<ReportMeta>(initialMeta);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFileItem[]>(sampleUploadedFiles);
  const [neracaRows, setNeracaRows] = useState<AkunNeracaRow[]>(sampleNeracaRows);
  const [mutasiRows, setMutasiRows] = useState<AkunMutasiRow[]>(sampleMutasiRows);
  const [assetRows, setAssetRows] = useState<AssetItemRow[]>(sampleAssetItems);
  const [persediaanRows, setPersediaanRows] = useState<PersediaanRow[]>(samplePersediaanItems);
  const [comparisonRows, setComparisonRows] = useState<ComparisonRow[]>(sampleComparisonRows);
  const [trendRows, setTrendRows] = useState<TrendRow[]>(sampleTrendRows);
  const [pspRows, setPspRows] = useState<StatusPenggunaanRow[]>(sampleStatusPenggunaan);
  const [narasiBabE, setNarasiBabE] = useState<string>('');

  // AI & Analytics State
  const [findings, setFindings] = useState<AnalysisFinding[]>(sampleAnalysisFindings);
  const [briefing, setBriefing] = useState<BriefingSummary>(sampleBriefingSummary);
  const [validationFindings, setValidationFindings] = useState<ValidationFinding[]>([]);

  // Stopwatch & Workflow State
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(312); // Sample: 5m 12s
  const [isStopwatchRunning, setIsStopwatchRunning] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisProgress, setAnalysisProgress] = useState<number>(0);

  // Inspector Modal State
  const [inspectedSource, setInspectedSource] = useState<SourceRef | null>(null);

  // Stopwatch timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isStopwatchRunning) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isStopwatchRunning]);

  // Recalculate deterministic validation whenever data updates
  useEffect(() => {
    const totalBMN = neracaRows.reduce((a, b) => a + b.gabunganRp, 0);
    const results = runFullValidation({
      neracaRows,
      mutasiRows,
      assetRows,
      comparisonRows,
      trendRows,
      totalBMNNarasi: totalBMN,
    });
    setValidationFindings(results);
  }, [neracaRows, mutasiRows, assetRows, comparisonRows, trendRows]);

  // Load Sample Data (BPT Komdigi TA 2025 Audited)
  const handleLoadSampleData = () => {
    setMeta(initialMeta);
    setUploadedFiles(sampleUploadedFiles);
    setNeracaRows(sampleNeracaRows);
    setMutasiRows(sampleMutasiRows);
    setAssetRows(sampleAssetItems);
    setPersediaanRows(samplePersediaanItems);
    setComparisonRows(sampleComparisonRows);
    setTrendRows(sampleTrendRows);
    setPspRows(sampleStatusPenggunaan);
    setFindings(sampleAnalysisFindings);
    setBriefing(sampleBriefingSummary);
    setElapsedSeconds(328); // 5 menit 28 detik (< 15 menit, 87.5% hemat waktu)
    setIsStopwatchRunning(false);
    setActiveTab('draf');
  };

  // Clear / Reset Session
  const handleClearData = () => {
    setUploadedFiles([]);
    setNeracaRows([]);
    setMutasiRows([]);
    setAssetRows([]);
    setPersediaanRows([]);
    setComparisonRows([]);
    setTrendRows([]);
    setPspRows([]);
    setFindings([]);
    setValidationFindings([]);
    setElapsedSeconds(0);
    setIsStopwatchRunning(false);
    setActiveTab('unggah');
  };

  // Handle User File Uploads
  const handleFilesSelected = async (fileList: FileList | File[]) => {
    const filesArray = Array.from(fileList);
    if (!isStopwatchRunning && elapsedSeconds === 0) {
      setIsStopwatchRunning(true);
    }

    const newUploadedFiles: UploadedFileItem[] = [...uploadedFiles];

    for (const f of filesArray) {
      const parsed = await parseUploadedFile(f);
      newUploadedFiles.push(parsed.fileItem);
    }

    setUploadedFiles(newUploadedFiles);
  };

  const handleRemoveFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  // Run AI & Code Analysis Engine
  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisProgress(10);
    setIsStopwatchRunning(true);

    try {
      setAnalysisProgress(30);

      // Call server Gemini API proxy
      const response = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entityMeta: {
            namaSatker: meta.namaSatker,
            kodeSatker: meta.kodeSatker,
            periode: meta.periode,
          },
          summaryData: {
            neraca: neracaRows,
            mutasi: mutasiRows,
          },
          trendData: trendRows,
          validationIssues: validationFindings.filter((v) => v.status !== 'PASS'),
        }),
      });

      setAnalysisProgress(75);

      if (response.ok) {
        const json = await response.json();
        if (json.success && json.data) {
          if (json.data.narasiBabE) {
            setNarasiBabE(json.data.narasiBabE);
          }
          if (json.data.findings && Array.isArray(json.data.findings)) {
            setFindings(json.data.findings);
          }
          if (json.data.briefing) {
            setBriefing(json.data.briefing);
          }
        }
      }

      setAnalysisProgress(100);
      setTimeout(() => {
        setIsAnalyzing(false);
        setIsStopwatchRunning(false); // Stop stopwatch when analysis finishes!
        setActiveTab('draf');
      }, 500);
    } catch (err) {
      console.error('Error during analysis:', err);
      setIsAnalyzing(false);
      setIsStopwatchRunning(false);
      setActiveTab('draf');
    }
  };

  const handleInspectSourceText = (rujukan: string) => {
    const parts = rujukan.split(',');
    const fileName = parts[0]?.trim() || 'Dokumen Sumber';
    const sheet = parts[1]?.trim() || 'Sheet Utama';
    const baris = parts[2]?.trim() || 'Baris Terverifikasi';

    setInspectedSource({
      file: fileName,
      sheet,
      baris,
      keterangan: rujukan,
    });
  };

  const warningCount = validationFindings.filter((v) => v.status !== 'PASS').length;

  return (
    <div className="min-h-screen bg-[#F4F6F9] text-slate-900 flex flex-col font-sans">
      {/* Top Header */}
      <Header
        elapsedSeconds={elapsedSeconds}
        isStopwatchRunning={isStopwatchRunning}
        onResetStopwatch={() => {
          setElapsedSeconds(0);
          setIsStopwatchRunning(false);
        }}
        onLoadSampleData={handleLoadSampleData}
        onClearData={handleClearData}
        hasData={uploadedFiles.length > 0}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Navigation Tabs (8 Workflow Tabs as defined in PRD Section 11) */}
        <div className="bg-white rounded-xl border border-[#C8D6E5] shadow-xs p-1.5 flex items-center overflow-x-auto no-scrollbar gap-1 no-print">
          {[
            { id: 'unggah', label: '1. Unggah Berkas', icon: UploadCloud, count: uploadedFiles.length },
            { id: 'draf', label: '2. Draf Laporan BMN', icon: FileText },
            { id: 'validasi', label: '3. Validasi & Rekonsiliasi', icon: CheckCircle2, count: warningCount > 0 ? warningCount : undefined, countColor: 'bg-amber-100 text-amber-900' },
            { id: 'selisih', label: '4. Selisih Antarperiode', icon: TrendingUp },
            { id: 'temuan', label: '5. Temuan & Kendala', icon: AlertTriangle, count: findings.length },
            { id: 'briefing', label: '6. Briefing Pimpinan', icon: FileCheck },
            { id: 'unduh', label: '7. Unduh Draf', icon: Download },
            { id: 'evaluasi', label: '8. Evaluasi Kelayakan', icon: Award },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? 'bg-[#1B3A6B] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-teal-300' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : tab.countColor || 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Contents */}
        <div className="pb-12">
          {activeTab === 'unggah' && (
            <UploadTab
              uploadedFiles={uploadedFiles}
              onFilesSelected={handleFilesSelected}
              onRemoveFile={handleRemoveFile}
              onRunAnalysis={handleRunAnalysis}
              onLoadSampleData={handleLoadSampleData}
              isAnalyzing={isAnalyzing}
              analysisProgress={analysisProgress}
            />
          )}

          {activeTab === 'draf' && (
            <DraftReportTab
              meta={meta}
              onUpdateMeta={setMeta}
              neracaRows={neracaRows}
              onUpdateNeracaRow={(row) =>
                setNeracaRows((prev) => prev.map((r) => (r.id === row.id ? row : r)))
              }
              mutasiRows={mutasiRows}
              onUpdateMutasiRow={(row) =>
                setMutasiRows((prev) => prev.map((r) => (r.id === row.id ? row : r)))
              }
              assetRows={assetRows}
              persediaanRows={persediaanRows}
              comparisonRows={comparisonRows}
              trendRows={trendRows}
              pspRows={pspRows}
              narasiBabE={narasiBabE}
              onUpdateNarasiBabE={setNarasiBabE}
              onInspectSource={(source) => setInspectedSource(source)}
            />
          )}

          {activeTab === 'validasi' && (
            <ValidationTab
              findings={validationFindings}
              onInspectSource={(source) => setInspectedSource(source)}
            />
          )}

          {activeTab === 'selisih' && (
            <VarianceTab
              trendRows={trendRows}
              comparisonRows={comparisonRows}
              hasPriorPeriodData={uploadedFiles.some((f) => f.recognizedType === 'LBP_LALU')}
              onInspectSource={(source) => setInspectedSource(source)}
            />
          )}

          {activeTab === 'temuan' && (
            <FindingsTab
              findings={findings}
              onInspectSourceText={handleInspectSourceText}
            />
          )}

          {activeTab === 'briefing' && (
            <BriefingTab
              briefing={briefing}
              onInspectSourceText={handleInspectSourceText}
            />
          )}

          {activeTab === 'unduh' && (
            <DownloadTab
              meta={meta}
              neracaRows={neracaRows}
              mutasiRows={mutasiRows}
              assetRows={assetRows}
              persediaanRows={persediaanRows}
              comparisonRows={comparisonRows}
              trendRows={trendRows}
              pspRows={pspRows}
              validationFindings={validationFindings}
              findings={findings}
              briefing={briefing}
              narasiBabE={narasiBabE}
            />
          )}

          {activeTab === 'evaluasi' && (
            <EvaluationTab elapsedSeconds={elapsedSeconds} />
          )}
        </div>
      </main>

      {/* Source Provenance Modal */}
      <SourceInspectorModal
        source={inspectedSource}
        onClose={() => setInspectedSource(null)}
      />
    </div>
  );
}
