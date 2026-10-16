import * as XLSX from 'xlsx';
import { UploadedFileItem } from '../types/bmn';

export interface ParseResult {
  fileItem: UploadedFileItem;
  rows?: any[];
  detectedType: UploadedFileItem['recognizedType'];
  sheets?: string[];
  pdfAnalysis?: any;
}

export async function parseUploadedFile(file: File): Promise<ParseResult> {
  const fileId = `FILE-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const fileName = file.name;
  const extension = fileName.split('.').pop()?.toLowerCase() || '';

  if (extension === 'pdf') {
    // PDF processing via server-side Gemini
    try {
      const base64Data = await fileToBase64(file);
      const res = await fetch('/api/gemini/parse-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileBase64: base64Data.split(',')[1] || base64Data,
          mimeType: 'application/pdf',
          fileName,
        }),
      });

      const json = await res.json();
      if (!json.success) {
        throw new Error(json.error || 'Gagal memproses dokumen PDF');
      }

      const detectedType = json.data?.jenisDokumen === 'LBP_SEBELUMNYA'
        ? 'LBP_LALU'
        : json.data?.jenisDokumen === 'REKONSILIASI'
        ? 'REKONSILIASI'
        : 'SALDO_MUTASI';

      return {
        fileItem: {
          id: fileId,
          name: fileName,
          size: file.size,
          type: 'application/pdf',
          status: 'PARSED',
          recognizedType: detectedType,
          recordsCount: json.data?.tabelDitemukan?.[0]?.baris?.length || 1,
          dataSnippet: json.data?.tabelDitemukan || [],
        },
        detectedType,
        pdfAnalysis: json.data,
      };
    } catch (err: any) {
      return {
        fileItem: {
          id: fileId,
          name: fileName,
          size: file.size,
          type: 'application/pdf',
          status: 'ERROR',
          recognizedType: 'LAINNYA',
          recordsCount: 0,
          errorMessage: `Gagal membaca file PDF: ${err.message}. File ditandai untuk pemeriksaan manual.`,
        },
        detectedType: 'LAINNYA',
      };
    }
  }

  // Parse Excel (xlsx, xls) or CSV via client-side SheetJS
  try {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    const sheetNames = workbook.SheetNames;

    if (!sheetNames || sheetNames.length === 0) {
      throw new Error('Workbook tidak memiliki lembar kerja (sheet).');
    }

    const firstSheet = workbook.Sheets[sheetNames[0]];
    const rawJson: any[] = XLSX.utils.sheet_to_json(firstSheet, { defval: '' });

    // Recognize file type based on file name or column patterns
    const nameLower = fileName.toLowerCase();
    let recognized: UploadedFileItem['recognizedType'] = 'LAINNYA';

    if (nameLower.includes('siman') || nameLower.includes('master') || nameLower.includes('katalog') || nameLower.includes('nup')) {
      recognized = 'SIMAN_ASET';
    } else if (nameLower.includes('sakti') || nameLower.includes('mutasi') || nameLower.includes('buku_besar')) {
      recognized = 'SALDO_MUTASI';
    } else if (nameLower.includes('persediaan') || nameLower.includes('habis_pakai')) {
      recognized = 'PERSEDIAAN';
    } else if (nameLower.includes('rekon') || nameLower.includes('bar') || nameLower.includes('uakpa')) {
      recognized = 'REKONSILIASI';
    } else if (nameLower.includes('lbp') || nameLower.includes('audited') || nameLower.includes('pembanding') || nameLower.includes('2024')) {
      recognized = 'LBP_LALU';
    } else if (nameLower.includes('keuangan') || nameLower.includes('neraca_lk') || nameLower.includes('lra')) {
      recognized = 'LAPORAN_KEUANGAN';
    } else if (nameLower.includes('template')) {
      recognized = 'TEMPLATE';
    } else {
      // Analyze column headers
      const sampleRow = rawJson[0] ? Object.keys(rawJson[0]).join(' ').toLowerCase() : '';
      if (sampleRow.includes('nup') || sampleRow.includes('kondisi') || sampleRow.includes('penyusutan')) {
        recognized = 'SIMAN_ASET';
      } else if (sampleRow.includes('saldo awal') || sampleRow.includes('mutasi')) {
        recognized = 'SALDO_MUTASI';
      } else if (sampleRow.includes('satuan') && sampleRow.includes('persediaan')) {
        recognized = 'PERSEDIAAN';
      } else {
        recognized = 'SALDO_MUTASI';
      }
    }

    return {
      fileItem: {
        id: fileId,
        name: fileName,
        size: file.size,
        type: file.type || 'application/vnd.ms-excel',
        status: 'PARSED',
        recognizedType: recognized,
        recordsCount: rawJson.length,
        dataSnippet: rawJson.slice(0, 5),
      },
      detectedType: recognized,
      rows: rawJson,
      sheets: sheetNames,
    };
  } catch (err: any) {
    return {
      fileItem: {
        id: fileId,
        name: fileName,
        size: file.size,
        type: file.type,
        status: 'ERROR',
        recognizedType: 'LAINNYA',
        recordsCount: 0,
        errorMessage: `Gagal membaca file spreadsheet: ${err.message}`,
      },
      detectedType: 'LAINNYA',
    };
  }
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}
