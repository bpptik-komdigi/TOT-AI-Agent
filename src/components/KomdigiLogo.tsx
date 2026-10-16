import React from 'react';

/**
 * KomdigiLogo: Komponen Vektor SVG Resmi Kementerian Komunikasi dan Digital RI
 * Direproduksi secara presisi dari file acuan: LOGO KOMDIGI-VERTICAL 2.png
 */
export const KomdigiLogo: React.FC<{
  className?: string;
  size?: number;
  showText?: boolean;
}> = ({ className = '', size = 110, showText = true }) => {
  return (
    <svg
      viewBox="0 0 520 540"
      width={size}
      height={showText ? (size * 540) / 520 : (size * 360) / 520}
      className={`select-none ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* ================= SIMBOL LOGO KOMDIGI ================= */}
      <g id="komdigi-symbol">
        {/* 1. Kotak Merah Marun (Kiri Atas) */}
        <rect
          x="154"
          y="42"
          width="40"
          height="40"
          rx="7"
          fill="#8A1C24"
        />

        {/* 2. Bentuk Biru Tua / Ocean Blue (S-Shape Kiri & Bawah) */}
        {/* Segmen Utama Biru dengan kurva lengkung organik mulus */}
        <path
          d="
            M 194 90
            H 236
            C 246 90, 252 96, 252 106
            V 140
            C 252 150, 244 158, 234 158
            H 214
            C 188 158, 168 178, 168 204
            V 224
            C 168 234, 160 242, 150 242
            H 136
            C 126 242, 120 234, 120 224
            V 172
            C 120 162, 128 154, 138 154
            H 162
            C 174 154, 184 144, 184 132
            V 102
            C 184 95.4, 188.5 90, 194 90
            Z
          "
          fill="#0067A5"
        />
        {/* Segmen Bawah Bentuk Biru Tua */}
        <path
          d="
            M 168 204
            C 168 178, 188 158, 214 158
            H 232
            C 244 158, 254 168, 254 180
            V 220
            C 254 246, 274 266, 300 266
            H 306
            C 316 266, 322 274, 322 284
            V 324
            C 322 334, 314 342, 304 342
            H 252
            C 242 342, 234 334, 234 324
            V 288
            C 234 276, 224 266, 212 266
            H 188
            C 177 266, 168 257, 168 246
            V 204
            Z
          "
          fill="#0067A5"
        />

        {/* 3. Bentuk Cyan / Biru Muda (S-Shape Kanan & Atas) */}
        <path
          d="
            M 276 0
            H 318
            C 328 0, 334 6, 334 16
            V 56
            C 334 82, 354 102, 380 102
            H 386
            C 396 102, 402 110, 402 120
            V 160
            C 402 170, 394 178, 384 178
            H 332
            C 322 178, 314 170, 314 160
            V 124
            C 314 112, 304 102, 292 102
            H 268
            C 257 102, 248 93, 248 82
            V 40
            C 248 30, 256 22, 266 22
            H 290
            C 302 22, 312 12, 312 0
            L 276 0
            Z
          "
          fill="#00A3E0"
        />
        {/* Segmen Tengah Bawah Cyan */}
        <path
          d="
            M 248 82
            C 248 93, 257 102, 268 102
            H 292
            C 304 102, 314 112, 314 124
            V 160
            C 314 186, 294 206, 268 206
            H 262
            C 252 206, 246 198, 246 188
            V 148
            C 246 138, 254 130, 264 130
            H 288
            C 300 130, 310 120, 310 108
            V 82
            C 310 75.4, 305.5 70, 300 70
            H 266
            C 256 70, 248 76, 248 82
            Z
          "
          fill="#00A3E0"
        />

        {/* 4. Kotak Kuning / Amber (Kanan Bawah) */}
        <rect
          x="334"
          y="238"
          width="40"
          height="40"
          rx="7"
          fill="#EBA814"
        />
      </g>

      {/* ================= TIPOGRAFI RESMI "KOMDIGI" ================= */}
      {/* Warna abu-abu gelap charcoal (#4E5155) tanpa garis bawah, dengan D digital */}
      {showText && (
        <g id="komdigi-text" fill="#4E5155">
          {/* Huruf K */}
          <path d="M 0 405 H 17 V 454 L 54 405 H 77 L 38 456 L 79 514 H 56 L 17 460 V 514 H 0 Z" />

          {/* Huruf O */}
          <path d="M 125 405 C 151 405, 168 421, 168 459.5 C 168 498, 151 514, 125 514 C 99 514, 82 498, 82 459.5 C 82 421, 99 405, 125 405 Z M 125 423 C 111 423, 102 434, 102 459.5 C 102 485, 111 496, 125 496 C 139 496, 148 485, 148 459.5 C 148 434, 139 423, 125 423 Z" />

          {/* Huruf M */}
          <path d="M 182 405 H 205 L 227 469 L 249 405 H 272 V 514 H 254 V 438 L 234 496 H 220 L 200 438 V 514 H 182 Z" />

          {/* Huruf D (Ciri Khas Digital Notch KOMDIGI pada Kiri Bawah) */}
          <path d="M 288 405 H 328 C 354 405, 370 422, 370 459.5 C 370 497, 354 514, 328 514 H 288 V 494 H 325 C 341 494, 350 483, 350 459.5 C 350 436, 341 425, 325 425 H 306 V 479 H 288 V 405 Z" />

          {/* Huruf I */}
          <path d="M 386 405 H 404 V 514 H 386 Z" />

          {/* Huruf G */}
          <path d="M 474 405 C 500 405, 516 422, 516 459.5 V 514 H 498 V 459.5 C 498 436, 489 425, 474 425 C 459 425, 450 436, 450 459.5 C 450 483, 459 494, 474 494 C 485 494, 492 489, 495 479 H 470 V 461 H 516 V 465 C 516 498, 500 514, 474 514 C 448 514, 431 497, 431 459.5 C 431 422, 448 405, 474 405 Z" />

          {/* Huruf I */}
          <path d="M 532 405 H 550 V 514 H 532 Z" />
        </g>
      )}
    </svg>
  );
};
