// components/mascots/AntTracker.tsx

import { MascotSvg, type MascotProps } from './MascotSvg';

/** Hormiga junto a su tabla de aplicaciones: las filas se van marcando y la planta crece. Para la sección del tracker. */
export default function AntTracker(props: MascotProps) {
  return (
    <MascotSvg {...props} name="tracker" viewBox="0 0 500 490">
      {/* plant */}
      <g className="jm-plant" style={{ transformOrigin: '142px 258px' }}>
        <path d="M142 258 C 140 230, 142 205, 152 180 C 158 165, 166 150, 178 138" fill="none" stroke="#2a7fd0" strokeWidth="7" strokeLinecap="round"/>
        <g className="jm-leaf-l" style={{ transformOrigin: '143px 212px' }}>
          <path d="M143 212 C 120 214, 86 200, 70 156 C 108 150, 136 172, 143 212 Z" fill="#3a92dc"/>
          <path d="M141 209 C 120 196, 98 180, 76 160" fill="none" stroke="#2477c9" strokeWidth="3" strokeLinecap="round"/>
        </g>
        <g className="jm-leaf-s" style={{ transformOrigin: '150px 228px' }}>
          <path d="M150 228 C 158 206, 180 194, 206 196 C 200 218, 178 230, 150 228 Z" fill="#3a92dc"/>
          <path d="M152 226 C 168 214, 184 205, 202 198" fill="none" stroke="#2477c9" strokeWidth="2.5" strokeLinecap="round"/>
        </g>
        <g className="jm-leaf-b" style={{ transformOrigin: '156px 182px' }}>
          <path d="M156 182 C 140 150, 160 98, 226 84 C 232 140, 200 182, 156 182 Z" fill="#3594e0"/>
          <path d="M158 178 C 176 150, 196 118, 222 90" fill="none" stroke="#2477c9" strokeWidth="3" strokeLinecap="round"/>
        </g>
      </g>

      {/* table */}
      <rect x="15" y="256" width="244" height="214" rx="8" fill="#4a92d6"/>
      <path d="M23 256 H251 A8 8 0 0 1 259 264 V296 H15 V264 A8 8 0 0 1 23 256 Z" fill="#2b78c8"/>
      <rect x="15" y="296" width="244" height="3" fill="#2b78c8" opacity="0.5"/>
      <g className="jm-rows">
        <rect className="jm-row jm-row-1" x="15" y="299" width="244" height="36" fill="#ffffff"/>
        <rect className="jm-row jm-row-2" x="15" y="340" width="244" height="36" fill="#ffffff"/>
        <rect className="jm-row jm-row-3" x="15" y="381" width="244" height="36" fill="#ffffff"/>
        <rect className="jm-row jm-row-4" x="15" y="422" width="244" height="40" fill="#ffffff"/>
      </g>
      <g fill="#7fb4e6">
        <rect x="15" y="335" width="244" height="5"/>
        <rect x="15" y="376" width="244" height="5"/>
        <rect x="15" y="417" width="244" height="5"/>
        <rect x="76" y="296" width="5" height="174"/>
      </g>
      {/* checks */}
      <g fill="none" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
        <path className="jm-check jm-check-1" style={{ transformOrigin: '46px 317px' }} d="M36 317 L43 324 L56 310"/>
        <path className="jm-check jm-check-2" style={{ transformOrigin: '46px 358px' }} d="M36 358 L43 365 L56 351"/>
        <path className="jm-check jm-check-3" style={{ transformOrigin: '46px 399px' }} d="M36 399 L43 406 L56 392"/>
      </g>
      {/* bars (fake text) */}
      <g fill="#ffffff" opacity="0.55">
        <rect x="96" y="312" width="110" height="9" rx="4.5"/>
        <rect x="96" y="353" width="84" height="9" rx="4.5"/>
        <rect x="96" y="394" width="126" height="9" rx="4.5"/>
        <rect x="96" y="437" width="70" height="9" rx="4.5"/>
      </g>

      {/* grass */}
      <g className="jm-grass" style={{ transformOrigin: '255px 470px' }} fill="#2f86d6">
        <path d="M238 470 C 232 452, 230 440, 232 428 C 242 440, 248 454, 250 470 Z"/>
        <path d="M250 470 C 254 450, 262 436, 278 426 C 274 444, 266 458, 262 470 Z"/>
        <path d="M246 470 C 246 456, 244 444, 240 436 C 250 444, 256 458, 256 470 Z" fill="#2575c6"/>
      </g>

      {/* ANT */}
      {/* legs */}
      <path d="M360 330 C 352 360, 340 400, 334 458" fill="none" stroke="#2a7fd0" strokeWidth="20" strokeLinecap="round"/>
      <ellipse cx="322" cy="464" rx="24" ry="9" fill="#2a7fd0"/>
      <path d="M398 370 C 402 400, 404 430, 406 458" fill="none" stroke="#2477c9" strokeWidth="20" strokeLinecap="round"/>
      <ellipse cx="416" cy="464" rx="22" ry="9" fill="#2477c9"/>
      {/* abdomen */}
      <ellipse cx="406" cy="332" rx="60" ry="54" fill="#3a92dc" transform="rotate(-20 406 332)"/>
      {/* back arm */}
      <path d="M398 222 C 432 246, 452 296, 442 352" fill="none" stroke="#2170c2" strokeWidth="18" strokeLinecap="round"/>
      {/* thorax */}
      <ellipse cx="372" cy="252" rx="40" ry="50" fill="#2a7fd0" transform="rotate(-12 372 252)"/>
      <path d="M342 292 C 360 300, 392 300, 414 288" fill="none" stroke="#1d6bbd" strokeWidth="10" strokeLinecap="round"/>
      {/* front arm (taps the table) */}
      <g className="jm-tap-arm" style={{ transformOrigin: '338px 238px' }}>
        <path d="M340 236 C 318 248, 300 254, 270 252 L 246 250" fill="none" stroke="#2f88d8" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M222 252 C 220 240, 232 236, 246 238 C 258 240, 262 252, 256 260 C 248 266, 226 266, 222 252 Z" fill="#2f88d8"/>
      </g>
      {/* neck */}
      <path d="M344 196 C 350 208, 362 214, 376 214" fill="none" stroke="#1d6bbd" strokeWidth="22" strokeLinecap="round"/>
      {/* head */}
      <g className="jm-nod" style={{ transformOrigin: '360px 208px' }}>
        <g className="jm-antennae" style={{ transformOrigin: '352px 100px' }} fill="none" stroke="#3594e0" strokeWidth="8" strokeLinecap="round">
          <path d="M332 100 C 330 78, 320 58, 306 48"/>
          <path d="M370 96 C 382 78, 388 62, 378 48"/>
        </g>
        <ellipse cx="336" cy="152" rx="72" ry="54" fill="#3594e0" transform="rotate(-22 336 152)"/>
        <ellipse className="jm-eye" style={{ transformOrigin: '334px 147px' }} cx="334" cy="147" rx="7.5" ry="11" fill="#0b3f75"/>
        <path d="M282 186 C 292 194, 310 194, 322 182" fill="none" stroke="#0b3f75" strokeWidth="5" strokeLinecap="round"/>
      </g>
    </MascotSvg>
  );
}
