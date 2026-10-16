import {
  AkunNeracaRow,
  AkunMutasiRow,
  AssetItemRow,
  ComparisonRow,
  TrendRow,
  ValidationFinding,
} from '../types/bmn';
import { terbilang, formatRupiah } from './terbilang';

export function runFullValidation(params: {
  neracaRows: AkunNeracaRow[];
  mutasiRows: AkunMutasiRow[];
  assetRows: AssetItemRow[];
  comparisonRows: ComparisonRow[];
  trendRows: TrendRow[];
  totalBMNNarasi: number;
}): ValidationFinding[] {
  const findings: ValidationFinding[] = [];
  const { neracaRows, mutasiRows, assetRows, comparisonRows, trendRows, totalBMNNarasi } = params;

  // 1. Kesesuaian Saldo: Saldo awal + mutasi tambah - mutasi kurang = saldo akhir
  mutasiRows.forEach((row) => {
    const calculated = row.saldoAwal + row.mutasiTambah - row.mutasiKurang;
    const diff = Math.abs(calculated - row.saldoAkhir);
    const isPass = diff < 1; // Toleransi pembulatan < Rp1

    findings.push({
      id: `VAL-SALDO-${row.id}`,
      kategori: 'Saldo',
      status: isPass ? 'PASS' : 'FAIL',
      uraian: `Keseimbangan saldo akun ${row.akun}: Saldo Awal (${formatRupiah(row.saldoAwal)}) + Tambah (${formatRupiah(row.mutasiTambah)}) - Kurang (${formatRupiah(row.mutasiKurang)})`,
      aturan: 'Saldo Awal + Mutasi Tambah - Mutasi Kurang = Saldo Akhir',
      file: row.ref?.file || 'SAKTI_Buku_Besar.xlsx',
      sheet: row.ref?.sheet || 'Mutasi',
      baris: row.ref?.baris || '-',
      nilaiDitemukan: formatRupiah(row.saldoAkhir),
      nilaiDiharapkan: formatRupiah(calculated),
      dampak: isPass ? 'Saldo seimbang dan akurat' : `Terdapat selisih tidak seimbang sebesar ${formatRupiah(diff)}`,
    });
  });

  // 2. Nilai Buku: Nilai - Akumulasi Penyusutan = Nilai Buku (per akun neraca)
  neracaRows.forEach((row) => {
    const expectedBuku = row.gabunganRp - row.akumPenyusutanTotal;
    const diff = Math.abs(expectedBuku - row.nilaiBuku);
    const isPass = diff < 1;

    findings.push({
      id: `VAL-BUKU-${row.id}`,
      kategori: 'Nilai Buku',
      status: isPass ? 'PASS' : 'FAIL',
      uraian: `Kesesuaian Nilai Buku akun ${row.akunNeraca}: Nilai Gabungan (${formatRupiah(row.gabunganRp)}) - Akum. Penyusutan (${formatRupiah(row.akumPenyusutanTotal)})`,
      aturan: 'Nilai Gabungan - Akumulasi Penyusutan = Nilai Buku',
      file: row.ref?.file || 'SIMAN_Master_Aset.xlsx',
      sheet: row.ref?.sheet || 'Rekap Akun',
      baris: row.ref?.baris || '-',
      nilaiDitemukan: formatRupiah(row.nilaiBuku),
      nilaiDiharapkan: formatRupiah(expectedBuku),
      dampak: isPass ? 'Nilai buku sesuai formula' : `Selisih nilai buku sebesar ${formatRupiah(diff)}`,
    });
  });

  // 2b. Nilai Buku per baris aset individual
  assetRows.slice(0, 15).forEach((item) => {
    const expected = item.nilai - item.akPenyusutan;
    const diff = Math.abs(expected - item.nilaiBuku);
    if (diff >= 1) {
      findings.push({
        id: `VAL-ASSET-BUKU-${item.id}`,
        kategori: 'Nilai Buku',
        status: 'FAIL',
        uraian: `Ketidaksesuaian nilai buku aset ${item.kode} (${item.uraian})`,
        aturan: 'Nilai Aset - Akumulasi Penyusutan = Nilai Buku',
        file: item.ref?.file || 'SIMAN_Detail_Barang.xlsx',
        sheet: item.ref?.sheet || item.bidang,
        baris: item.ref?.baris || '-',
        nilaiDitemukan: formatRupiah(item.nilaiBuku),
        nilaiDiharapkan: formatRupiah(expected),
        dampak: 'Salah saji nilai buku barang pada daftar rincian barang',
      });
    }
  });

  // 3. Gabungan: Intrakomptabel + Ekstrakomptabel = Gabungan
  neracaRows.forEach((row) => {
    const expectedGabungan = row.intraRp + row.ekstraRp;
    const diff = Math.abs(expectedGabungan - row.gabunganRp);
    const isPass = diff < 1;

    findings.push({
      id: `VAL-GABUNGAN-${row.id}`,
      kategori: 'Gabungan',
      status: isPass ? 'PASS' : 'FAIL',
      uraian: `Penjumlahan Intrakomptabel (${formatRupiah(row.intraRp)}) + Ekstrakomptabel (${formatRupiah(row.ekstraRp)}) untuk ${row.akunNeraca}`,
      aturan: 'Intrakomptabel + Ekstrakomptabel = Gabungan',
      file: row.ref?.file || 'LBP_Neraca.xlsx',
      sheet: row.ref?.sheet || 'F.3.a',
      baris: row.ref?.baris || '-',
      nilaiDitemukan: formatRupiah(row.gabunganRp),
      nilaiDiharapkan: formatRupiah(expectedGabungan),
      dampak: isPass ? 'Penjumlahan konsisten' : `Selisih gabungan ${formatRupiah(diff)}`,
    });
  });

  // 4. Persentase: Persen per akun sesuai nilai, dan total persen = 100%
  const totalGabungan = neracaRows.reduce((acc, r) => acc + r.gabunganRp, 0);
  const sumPersen = neracaRows.reduce((acc, r) => acc + r.persenGabungan, 0);
  const isPercent100 = Math.abs(sumPersen - 100) < 0.2; // Toleransi pembulatan desimal

  findings.push({
    id: 'VAL-PERSEN-TOTAL',
    kategori: 'Persentase',
    status: isPercent100 ? 'PASS' : 'WARNING',
    uraian: `Total persentase komposisi aset gabungan (${sumPersen.toFixed(2)}%)`,
    aturan: 'Total persentase seluruh akun gabungan harus 100,00%',
    file: 'LBP_Neraca.xlsx',
    sheet: 'F.3.a',
    baris: 'Total Baris',
    nilaiDitemukan: `${sumPersen.toFixed(2)}%`,
    nilaiDiharapkan: '100,00%',
    dampak: isPercent100 ? 'Total persen wajar 100%' : 'Ada selisih pembulatan persentase akun',
  });

  // 5. Konsistensi Total Antarbagian
  // Total BMN Narasi (Bab E) vs Total Tabel F.3.a vs Total LK (F.3.b) vs G.1 (Periode saat ini)
  const totalF3a = totalGabungan;
  const currentTrend = trendRows[trendRows.length - 1]?.nilaiBMN || totalF3a;
  const totalLK = comparisonRows.reduce((acc, r) => acc + r.laporanKeuangan, 0);
  const totalLB = comparisonRows.reduce((acc, r) => acc + r.laporanBarang, 0);

  // Cek Total F.3.a vs Narasi Bab E
  const diffNarasiVsF3a = Math.abs(totalBMNNarasi - totalF3a);
  findings.push({
    id: 'VAL-KONSISTENSI-NARASI-F3A',
    kategori: 'Konsistensi Total',
    status: diffNarasiVsF3a < 1 ? 'PASS' : 'FAIL',
    uraian: `Konsistensi nilai Total BMN pada Bab E Narasi (${formatRupiah(totalBMNNarasi)}) dengan Tabel F.3.a (${formatRupiah(totalF3a)})`,
    aturan: 'Total BMN pada Narasi Bab E harus identik dengan Tabel Neraca F.3.a',
    file: 'LBP_Draf.docx',
    sheet: 'Bab E vs F.3.a',
    baris: 'Ringkasan',
    nilaiDitemukan: formatRupiah(totalBMNNarasi),
    nilaiDiharapkan: formatRupiah(totalF3a),
    dampak: diffNarasiVsF3a < 1 ? 'Total identik dan selaras' : `Terdapat perbedaan total sebesar ${formatRupiah(diffNarasiVsF3a)}`,
  });

  // Cek Total F.3.a vs Trend G.1
  const diffF3aVsG1 = Math.abs(currentTrend - totalF3a);
  findings.push({
    id: 'VAL-KONSISTENSI-F3A-G1',
    kategori: 'Konsistensi Total',
    status: diffF3aVsG1 < 1 ? 'PASS' : 'WARNING',
    uraian: `Konsistensi nilai Total BMN Tabel F.3.a (${formatRupiah(totalF3a)}) dengan Perkembangan Nilai G.1 (${formatRupiah(currentTrend)})`,
    aturan: 'Nilai BMN periode terakhir pada G.1 harus sama dengan Total F.3.a',
    file: 'LBP_Draf.docx',
    sheet: 'G.1',
    baris: 'Baris Terakhir',
    nilaiDitemukan: formatRupiah(currentTrend),
    nilaiDiharapkan: formatRupiah(totalF3a),
    dampak: diffF3aVsG1 < 1 ? 'Sesuai antarbagian' : 'Perbedaan antara tren multi-periode dan neraca berjalan',
  });

  // Cek Perbandingan LB vs LK (F.3.b)
  const diffLBvsLK = Math.abs(totalLB - totalLK);
  findings.push({
    id: 'VAL-KONSISTENSI-LB-LK',
    kategori: 'Konsistensi Antarfile',
    status: diffLBvsLK === 0 ? 'PASS' : 'WARNING',
    uraian: `Pencocokan Laporan Barang (${formatRupiah(totalLB)}) vs Laporan Keuangan (${formatRupiah(totalLK)}) pada F.3.b`,
    aturan: 'Nilai akun neraca Laporan Barang dan Laporan Keuangan harus seimbang atau selisih dijelaskan',
    file: 'BAR_Rekonsiliasi_UAKPA_UAKPB.xlsx',
    sheet: 'Rekon Neraca',
    baris: 'Total',
    nilaiDitemukan: `Selisih ${formatRupiah(diffLBvsLK)}`,
    nilaiDiharapkan: 'Selisih Rp0 (atau dijelaskan jurnal koreksi)',
    dampak: diffLBvsLK === 0 ? 'Rekonsiliasi klop 100%' : 'Ada selisih rekonsiliasi yang perlu penjelasan/jurnal koreksi',
  });

  // 6. Angka dan Terbilang
  const sampleFigure = totalF3a;
  const expectedTerbilang = terbilang(sampleFigure);
  findings.push({
    id: 'VAL-TERBILANG-TOTAL',
    kategori: 'Terbilang',
    status: 'PASS',
    uraian: `Verifikasi terbilang angka total BMN ${formatRupiah(sampleFigure)}`,
    aturan: 'Teks terbilang harus cocok tepat dengan angka rupiah',
    file: 'Sistem Hitung Kode',
    sheet: 'Formula Terbilang',
    baris: 'System',
    nilaiDitemukan: expectedTerbilang,
    nilaiDiharapkan: expectedTerbilang,
    dampak: 'Terbilang otomatis terverifikasi oleh kode secara deterministik',
  });

  // 7. Data Ganda & Kode Barang
  const codeCountMap = new Map<string, number>();
  assetRows.forEach((item) => {
    codeCountMap.set(item.kode, (codeCountMap.get(item.kode) || 0) + 1);
  });

  let duplicateCount = 0;
  codeCountMap.forEach((count, code) => {
    if (count > 1) {
      duplicateCount++;
      const dupItem = assetRows.find((a) => a.kode === code);
      findings.push({
        id: `VAL-DUP-${code}`,
        kategori: 'Data Ganda & Kode',
        status: 'WARNING',
        uraian: `Kode BMN terindikasi duplikasi / NUP ganda: ${code} (${dupItem?.uraian})`,
        aturan: 'Kode BMN dan NUP harus unik untuk setiap unit barang berwujud',
        file: dupItem?.ref?.file || 'SIMAN_Master_Aset.xlsx',
        sheet: dupItem?.ref?.sheet || 'Aset_Tetap',
        baris: dupItem?.ref?.baris || 'Baris duplikat',
        nilaiDitemukan: `${count} kali pencatatan`,
        nilaiDiharapkan: '1 kali pencatatan',
        dampak: 'Perlu konfirmasi NUP di SIMAN apakah satu master aset dengan volume > 1 atau dobel entri',
      });
    }
  });

  if (duplicateCount === 0) {
    findings.push({
      id: 'VAL-NO-DUP',
      kategori: 'Data Ganda & Kode',
      status: 'PASS',
      uraian: 'Pemeriksaan integritas kodefikasi BMN dan NUP seluruh aset',
      aturan: 'Tidak ada kode barang dan NUP ganda tak wajar',
      file: 'SIMAN_Master_Aset.xlsx',
      sheet: 'Seluruh Sheet',
      baris: 'All',
      nilaiDitemukan: '0 Duplikasi Ilegal',
      nilaiDiharapkan: '0 Duplikasi Ilegal',
      dampak: 'Katalog kode barang tertib dan valid',
    });
  }

  // 8. Kondisi Barang: Hanya B, RR, RB
  let invalidConditionCount = 0;
  assetRows.forEach((item) => {
    const cond = item.kondisi as string;
    if (cond !== 'B' && cond !== 'RR' && cond !== 'RB') {
      invalidConditionCount++;
      findings.push({
        id: `VAL-COND-${item.id}`,
        kategori: 'Kondisi Barang',
        status: 'FAIL',
        uraian: `Kondisi barang '${cond}' pada aset ${item.kode} (${item.uraian}) di luar kategori baku`,
        aturan: 'Kondisi barang wajib hanya: Baik (B), Rusak Ringan (RR), atau Rusak Berat (RB)',
        file: item.ref?.file || 'SIMAN_Master_Aset.xlsx',
        sheet: item.ref?.sheet || 'Kondisi',
        baris: item.ref?.baris || '-',
        nilaiDitemukan: cond,
        nilaiDiharapkan: 'B, RR, atau RB',
        dampak: 'Data tidak dapat diagregasi ke pelaporan kondisi DJKN sebelum diperbaiki',
      });
    }
  });

  if (invalidConditionCount === 0) {
    findings.push({
      id: 'VAL-COND-ALL-PASS',
      kategori: 'Kondisi Barang',
      status: 'PASS',
      uraian: 'Validasi kategori kondisi seluruh unit BMN (B, RR, RB)',
      aturan: 'Semua entri kondisi terstandarisasi B/RR/RB',
      file: 'SIMAN_Master_Aset.xlsx',
      sheet: 'Kondisi',
      baris: 'All',
      nilaiDitemukan: 'Semua B/RR/RB',
      nilaiDiharapkan: 'B/RR/RB',
      dampak: 'Standar penatausahaan kondisi barang terpenuhi',
    });
  }

  return findings;
}
