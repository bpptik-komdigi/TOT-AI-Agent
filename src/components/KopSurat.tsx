import React from 'react';
import { KomdigiLogo } from './KomdigiLogo';

export const KopSurat: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`w-full bg-white select-none ${className}`}>
      <div className="flex items-center justify-between pb-3 pt-1 px-1">
        {/* Logo Komdigi Resmi Vertikal Sesuai Berkas Acuan LOGO KOMDIGI-VERTICAL 2.png */}
        <div className="flex flex-col items-center justify-center shrink-0 pr-4 sm:pr-6">
          <KomdigiLogo size={108} showText={true} />
        </div>

        {/* Teks Identitas Instansi di Sisi Kanan Sesuai Gambar Referensi */}
        <div className="flex-1 text-left pl-2 sm:pl-3">
          <h2 className="text-[#2B2B2B] font-extrabold text-base sm:text-xl lg:text-[22px] tracking-wide leading-tight uppercase font-sans">
            Kementerian Komunikasi dan Digital RI
          </h2>
          <h3 className="text-[#333333] font-bold text-xs sm:text-sm lg:text-[15px] tracking-normal leading-tight uppercase mt-1 font-sans">
            Badan Pengembangan Sumber Daya Manusia Komunikasi dan Digital
          </h3>
          <h1 className="text-[#2B2B2B] font-extrabold text-sm sm:text-lg lg:text-[20px] tracking-tight leading-snug uppercase mt-1 font-sans">
            Balai Pelatihan Talenta Komunikasi dan Digital
          </h1>
          <p className="text-[#3A3A3A] font-normal text-[10px] sm:text-xs lg:text-[12px] leading-relaxed mt-1 font-sans">
            Jl. Sekolah Hijau Kav. 2, Jababeka, Kab. Bekasi 17530, Telp. (021) 28645000, bpt.komdigi.go.id
          </p>
        </div>
      </div>

      {/* Garis Horizontal Ganda Pembatas Resmi (Tebal di atas, Tipis di bawah) */}
      <div className="w-full mt-1">
        <div className="w-full h-[2.5px] bg-[#2B2B2B]" />
        <div className="w-full h-[1px] bg-[#2B2B2B] mt-[2px]" />
      </div>
    </div>
  );
};

/**
 * Menghasilkan data URL PNG resolusi tinggi dari Kop Surat resmi
 * untuk disematkan ke berkas Word (.docx), PDF, atau canvas cetak.
 */
export function generateKopSuratPngDataUrl(): Promise<string> {
  return new Promise((resolve) => {
    const width = 1600;
    const height = 280;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      resolve('');
      return;
    }

    // Latar belakang putih bersih
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);

    // ================= GAMBAR LOGO KOMDIGI VERTICAL =================
    const logoX = 45;
    const logoY = 15;

    // 1. Kotak Merah Marun (Kiri Atas)
    ctx.fillStyle = '#8A1C24';
    drawRoundedRect(ctx, logoX + 38, logoY + 14, 20, 20, 4);

    // 2. Biru Tua (Bawah & Kiri)
    ctx.fillStyle = '#0067A5';
    drawRoundedRect(ctx, logoX + 58, logoY + 36, 26, 26, 6);
    drawRoundedRect(ctx, logoX + 28, logoY + 64, 26, 26, 6);
    drawRoundedRect(ctx, logoX + 58, logoY + 92, 28, 28, 6);

    // 3. Cyan (Atas & Kanan)
    ctx.fillStyle = '#00A3E0';
    drawRoundedRect(ctx, logoX + 86, logoY + 6, 26, 26, 6);
    drawRoundedRect(ctx, logoX + 114, logoY + 34, 26, 26, 6);
    drawRoundedRect(ctx, logoX + 86, logoY + 64, 26, 26, 6);

    // 4. Amber Yellow
    ctx.fillStyle = '#EBA814';
    drawRoundedRect(ctx, logoX + 114, logoY + 94, 20, 20, 4);

    // Teks KOMDIGI di bawah logo (Tanpa underline, warna #4E5155 resmi)
    ctx.fillStyle = '#4E5155';
    ctx.font = 'bold 30px Arial, Helvetica, sans-serif';
    ctx.textAlign = 'center';
    ctx.letterSpacing = '3px';
    ctx.fillText('KOMDIGI', logoX + 78, logoY + 162);
    ctx.letterSpacing = '0px';

    // ================= TEKS IDENTITAS INSTANSI DI SISI KANAN =================
    const textX = 245;
    ctx.textAlign = 'left';

    // Baris 1: KEMENTERIAN KOMUNIKASI DAN DIGITAL RI
    ctx.fillStyle = '#2B2B2B';
    ctx.font = 'bold 34px Arial, Helvetica, sans-serif';
    ctx.fillText('KEMENTERIAN KOMUNIKASI DAN DIGITAL RI', textX, 58);

    // Baris 2: BADAN PENGEMBANGAN SUMBER DAYA MANUSIA KOMUNIKASI DAN DIGITAL
    ctx.fillStyle = '#333333';
    ctx.font = 'bold 23px Arial, Helvetica, sans-serif';
    ctx.fillText('BADAN PENGEMBANGAN SUMBER DAYA MANUSIA KOMUNIKASI DAN DIGITAL', textX, 98);

    // Baris 3: BALAI PELATIHAN TALENTA KOMUNIKASI DAN DIGITAL
    ctx.fillStyle = '#2B2B2B';
    ctx.font = 'bold 31px Arial, Helvetica, sans-serif';
    ctx.fillText('BALAI PELATIHAN TALENTA KOMUNIKASI DAN DIGITAL', textX, 144);

    // Baris 4: Alamat & Kontak
    ctx.fillStyle = '#3A3A3A';
    ctx.font = 'normal 19px Arial, Helvetica, sans-serif';
    ctx.fillText(
      'Jl. Sekolah Hijau Kav. 2, Jababeka, Kab. Bekasi 17530, Telp. (021) 28645000, bpt.komdigi.go.id',
      textX,
      186
    );

    // Garis Horizontal Ganda Pembatas Bawah (Tebal 4px + Tipis 1.5px)
    const lineY = 240;
    ctx.strokeStyle = '#2B2B2B';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(30, lineY);
    ctx.lineTo(width - 30, lineY);
    ctx.stroke();

    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(30, lineY + 6);
    ctx.lineTo(width - 30, lineY + 6);
    ctx.stroke();

    resolve(canvas.toDataURL('image/png'));
  });
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.fill();
}
