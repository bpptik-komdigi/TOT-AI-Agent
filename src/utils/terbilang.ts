/**
 * Konversi angka ke terbilang Bahasa Indonesia secara deterministik (kode murni, bukan model).
 * Sesuai aturan penatausahaan BMN Kementerian Keuangan / DJKN.
 */

const SATUAN = ['', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan', 'Sembilan', 'Sepuluh', 'Sebelas'];

function konversiRatusan(n: number): string {
  let hasil = '';

  if (n >= 100) {
    const ratus = Math.floor(n / 100);
    if (ratus === 1) {
      hasil += 'Seratus ';
    } else {
      hasil += `${SATUAN[ratus]} Ratus `;
    }
    n %= 100;
  }

  if (n >= 20) {
    const puluh = Math.floor(n / 10);
    hasil += `${SATUAN[puluh]} Puluh `;
    n %= 10;
    if (n > 0) {
      hasil += `${SATUAN[n]} `;
    }
  } else if (n > 0) {
    hasil += `${SATUAN[n]} `;
  }

  return hasil.trim();
}

export function terbilang(nominal: number): string {
  if (isNaN(nominal)) return 'Nilai Tidak Valid';
  if (nominal === 0) return 'Nol Rupiah';

  let angka = Math.abs(Math.round(nominal));
  let hasil = '';

  const triliun = Math.floor(angka / 1000000000000);
  angka %= 1000000000000;

  const milyar = Math.floor(angka / 1000000000);
  angka %= 1000000000;

  const juta = Math.floor(angka / 1000000);
  angka %= 1000000;

  const ribu = Math.floor(angka / 1000);
  angka %= 1000;

  const sisa = angka;

  if (triliun > 0) {
    hasil += `${konversiRatusan(triliun)} Triliun `;
  }

  if (milyar > 0) {
    hasil += `${konversiRatusan(milyar)} Milyar `;
  }

  if (juta > 0) {
    hasil += `${konversiRatusan(juta)} Juta `;
  }

  if (ribu > 0) {
    if (ribu === 1 && triliun === 0 && milyar === 0 && juta === 0) {
      hasil += 'Seribu ';
    } else {
      hasil += `${konversiRatusan(ribu)} Ribu `;
    }
  }

  if (sisa > 0) {
    hasil += `${konversiRatusan(sisa)} `;
  }

  const teksTerbilang = (nominal < 0 ? 'Minus ' : '') + hasil.trim() + ' Rupiah';
  return teksTerbilang;
}

export function formatRupiah(nilai: number | null | undefined): string {
  if (nilai === null || nilai === undefined || isNaN(nilai)) {
    return 'tidak ditemukan';
  }
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(nilai);
}

export function formatNominal(nilai: number | null | undefined): string {
  if (nilai === null || nilai === undefined || isNaN(nilai)) {
    return 'tidak ditemukan';
  }
  return new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(nilai);
}

export function formatPersen(nilai: number | null | undefined, digit = 2): string {
  if (nilai === null || nilai === undefined || isNaN(nilai)) {
    return '0,00%';
  }
  return (
    new Intl.NumberFormat('id-ID', {
      minimumFractionDigits: digit,
      maximumFractionDigits: digit,
    }).format(nilai) + '%'
  );
}
