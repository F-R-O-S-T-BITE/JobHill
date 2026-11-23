// components/mascots/AntWorking.tsx
'use client';

import { useId } from 'react';
import { MascotSvg, type MascotProps } from './MascotSvg';

/** Escena del hero: la hormiga trabajando en su laptop, con café y hojas flotando. */
export default function AntWorking(props: MascotProps) {
  const leafId = `jm-leaf-${useId().replace(/:/g, '')}`;

  return (
    <MascotSvg {...props} name="working" viewBox="0 0 500 480">
      <defs>
        <g id={leafId}>
          <path d="M0 0 C 8 -20, 36 -32, 64 -26 C 60 -4, 34 14, 0 0 Z"/>
          <path d="M2 -1 C 22 -10, 40 -16, 60 -24" fill="none" stroke="#ffffff" strokeOpacity="0.45" strokeWidth="2" strokeLinecap="round"/>
        </g>
      </defs>

      {/* decorative leaves & dots */}
      <g fill="#4aa0e3">
        <g className="jm-float jm-float-1"><use href={`#${leafId}`} transform="translate(50 100) rotate(-55) scale(1.05)"/></g>
        <g className="jm-float jm-float-2"><use href={`#${leafId}`} transform="translate(380 50) rotate(40) scale(0.95)"/></g>
        <g className="jm-float jm-float-3"><use href={`#${leafId}`} transform="translate(440 150) rotate(-60) scale(0.7)" fill="#2b86d3"/></g>
        <g className="jm-float jm-float-2"><use href={`#${leafId}`} transform="translate(60 340) rotate(25) scale(0.8)"/></g>
        <g className="jm-float jm-float-1"><use href={`#${leafId}`} transform="translate(110 388) rotate(-40) scale(0.55)" fill="#2b86d3"/></g>
        <g className="jm-float jm-float-3"><use href={`#${leafId}`} transform="translate(440 400) rotate(-55) scale(0.9)"/></g>
        <g className="jm-float jm-float-1"><use href={`#${leafId}`} transform="translate(150 455) rotate(-20) scale(0.95)"/></g>
      </g>
      <circle cx="28" cy="152" r="7" fill="#2b86d3"/>
      <circle cx="455" cy="40" r="7" fill="#7db9ea"/>

      {/* chair */}
      <g fill="#6f97bd">
        <rect x="358" y="205" width="80" height="118" rx="14" transform="rotate(8 398 264)"/>
        <rect x="318" y="312" width="124" height="24" rx="11" fill="#5f87ae"/>
        <rect x="376" y="334" width="10" height="44" fill="#4f79a4"/>
        <path d="M334 388 L 384 376 L 432 388" fill="none" stroke="#4f79a4" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="334" cy="394" r="7" fill="#3f6993"/><circle cx="432" cy="394" r="7" fill="#3f6993"/><circle cx="384" cy="388" r="6" fill="#3f6993"/>
      </g>

      {/* desk */}
      <g fill="#7fa3c6">
        <rect x="34" y="300" width="9" height="104" rx="4" transform="rotate(6 38 352)"/>
        <rect x="180" y="300" width="9" height="96" rx="4"/>
        <rect x="262" y="300" width="9" height="104" rx="4" transform="rotate(-5 266 352)"/>
        <rect x="14" y="284" width="282" height="18" rx="5" fill="#8aaccd"/>
      </g>

      {/* mug + steam */}
      <g>
        <path className="jm-steam jm-steam-1" d="M45 228 C 38 218, 52 210, 45 198" fill="none" stroke="#9cc6ea" strokeWidth="4" strokeLinecap="round"/>
        <path className="jm-steam jm-steam-2" d="M60 228 C 53 218, 67 210, 60 198" fill="none" stroke="#9cc6ea" strokeWidth="4" strokeLinecap="round"/>
        <rect x="34" y="236" width="38" height="48" rx="6" fill="#2f7fd0"/>
        <path d="M72 248 C 88 248, 88 272, 72 272" fill="none" stroke="#2f7fd0" strokeWidth="7"/>
      </g>

      {/* laptop */}
      <g>
        <path d="M78 196 L 168 192 L 196 276 L 104 282 Z" fill="#5d82aa"/>
        <path d="M84 202 L 163 198 L 188 270 L 108 275 Z" fill="#6b90b8"/>
        <circle className="jm-glow" cx="134" cy="237" r="9" fill="#a9c8e6"/>
        <rect x="100" y="273" width="160" height="11" rx="3" fill="#4d7299"/>
      </g>

      {/* ANT */}
      {/* back leg */}
      <path d="M362 292 C 338 300, 316 306, 306 318 C 302 340, 304 362, 306 380" fill="none" stroke="#1563b8" strokeWidth="17" strokeLinecap="round" strokeLinejoin="round"/>
      <ellipse cx="296" cy="386" rx="18" ry="8" fill="#1563b8"/>
      {/* abdomen */}
      <ellipse cx="380" cy="270" rx="56" ry="50" fill="#2a83d4"/>
      {/* thorax */}
      <ellipse cx="318" cy="234" rx="30" ry="40" fill="#2479cb" transform="rotate(25 318 234)"/>
      {/* front leg */}
      <path d="M352 300 C 330 314, 310 318, 296 326 C 292 346, 292 364, 292 384" fill="none" stroke="#1a6cc2" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round"/>
      <ellipse cx="280" cy="390" rx="19" ry="8.5" fill="#1a6cc2"/>
      {/* back arm (typing) */}
      <g className="jm-type jm-type-b">
        <path d="M308 222 C 290 240, 268 252, 238 262 L 212 266" fill="none" stroke="#1563b8" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
      {/* neck */}
      <path d="M280 178 C 286 194, 296 206, 308 214" fill="none" stroke="#1d70c4" strokeWidth="24" strokeLinecap="round"/>
      {/* head */}
      <g className="jm-nod" style={{ transformOrigin: '296px 200px' }}>
        <g className="jm-antennae" style={{ transformOrigin: '268px 128px' }} fill="none" stroke="#2a8fdd" strokeWidth="7" strokeLinecap="round">
          <path d="M256 128 C 252 108, 244 92, 230 84"/>
          <path d="M284 124 C 292 104, 300 92, 312 84"/>
        </g>
        <ellipse cx="266" cy="162" rx="50" ry="38" fill="#2a8fdd" transform="rotate(-18 266 162)"/>
        <ellipse className="jm-eye" style={{ transformOrigin: '258px 152px' }} cx="258" cy="152" rx="5.5" ry="8.5" fill="#0b3f75"/>
        <path d="M232 182 C 242 192, 260 194, 274 186" fill="none" stroke="#0b3f75" strokeWidth="4.5" strokeLinecap="round"/>
      </g>
      {/* front arm (typing) */}
      <g className="jm-type jm-type-a">
        <path d="M320 232 C 300 252, 278 262, 250 268 L 222 272" fill="none" stroke="#1f78cd" strokeWidth="15" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
    </MascotSvg>
  );
}
