// components/mascots/AntMarching.tsx

import { MascotSvg, type MascotProps } from './MascotSvg';

/** Hormiga caminando de perfil. Ideal para el carrusel de logos, cargas y placeholders. */
export default function AntMarching(props: MascotProps) {
  return (
    <MascotSvg {...props} name="march" viewBox="0 0 160 100">
      <g className="jm-march-body">
        {/* far legs */}
        <g fill="none" stroke="#5aa5e6" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
          <path className="jm-leg jm-leg-b" style={{ transformOrigin: '103px 56px' }} d="M103 56 L120 64 L131 88"/>
          <path className="jm-leg jm-leg-a" style={{ transformOrigin: '97px 58px' }} d="M97 58 L103 72 L103 90"/>
          <path className="jm-leg jm-leg-b" style={{ transformOrigin: '91px 56px' }} d="M91 56 L72 64 L60 88"/>
        </g>
        {/* antennae */}
        <g className="jm-antennae" style={{ transformOrigin: '120px 28px' }} fill="none" stroke="#1d6fc2" strokeWidth="4" strokeLinecap="round">
          <path d="M117 28 Q110 10 97 7"/>
          <path d="M125 27 Q124 9 113 2"/>
        </g>
        {/* abdomen, petiole, thorax, head */}
        <ellipse cx="48" cy="47" rx="30" ry="20" fill="#2a86d6" transform="rotate(-10 48 47)"/>
        <ellipse cx="79" cy="51" rx="8" ry="5.5" fill="#1d6fc2"/>
        <ellipse cx="94" cy="49" rx="15" ry="10" fill="#1d6fc2"/>
        <ellipse cx="123" cy="40" rx="19" ry="15" fill="#2a86d6"/>
        <ellipse className="jm-eye" style={{ transformOrigin: '129px 36px' }} cx="129" cy="36" rx="3.2" ry="4.2" fill="#0d3f75"/>
        {/* near legs */}
        <g fill="none" stroke="#1d6fc2" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round">
          <path className="jm-leg jm-leg-a" style={{ transformOrigin: '100px 56px' }} d="M100 56 L116 64 L125 89"/>
          <path className="jm-leg jm-leg-b" style={{ transformOrigin: '94px 58px' }} d="M94 58 L98 72 L96 90"/>
          <path className="jm-leg jm-leg-a" style={{ transformOrigin: '88px 56px' }} d="M88 56 L68 64 L54 89"/>
        </g>
      </g>
    </MascotSvg>
  );
}
