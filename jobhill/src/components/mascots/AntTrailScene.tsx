// components/mascots/AntTrailScene.tsx
'use client';

import { useId } from 'react';
import { MascotSvg, type MascotProps } from './MascotSvg';

/*
 * Escena del sendero: una fila de hormigas (algunas cargando hojas) camina hacia el bosque.
 * Las hormigas siguen el sendero con <animateMotion> y se encogen con la distancia.
 * Con "reducir movimiento" o animated={false} se muestra una versión estática.
 */

const PALETTES = {
  dusk: { sky1: '#3f74ab', sky2: '#9db8d4', moon: '#fde8c3', halo: '#fff4dc', far: '#6c96c0', mid: '#4f7fb0', bigtree: '#1f4671', hill1: '#3c6b9b', hill2: '#2f5d8d', hill3: '#28527f', road: '#5585b5', roadEdge: '#4776a6', ant: '#1c3456', star: '#ffffff', leaf: '#5cc23a', leafVein: '#3e9a24', fly: '#ffe9a3' },
  night: { sky1: '#11294a', sky2: '#2a5b8a', moon: '#cfe4f5', halo: '#9cc6ea', far: '#24507d', mid: '#1d4570', bigtree: '#123358', hill1: '#1f4a76', hill2: '#1a4069', hill3: '#15375d', road: '#2b5c8c', roadEdge: '#22507e', ant: '#0b1a2e', star: '#e6f1fb', leaf: '#43c437', leafVein: '#2b9a22', fly: '#d8f59a' },
} as const;

export type TrailScenePalette = keyof typeof PALETTES;
type Colors = (typeof PALETTES)[TrailScenePalette];

const TRAIL = 'M -80 950 C 190 915, 445 885, 610 805 C 690 762, 745 712, 830 664';
const ROAD = 'M -100 880 C 180 850, 420 830, 580 760 C 660 722, 720 680, 830 636 L 830 694 C 770 740, 720 800, 640 850 C 480 950, 220 990, -100 1010 Z';
const ROAD_EDGE = 'M -100 880 C 180 850, 420 830, 580 760 C 660 722, 720 680, 830 636';
const FAR_PINES = 'M-22.1 523.5 L-4.2 576.8 L-40.0 576.8 Z M-22.1 549.6 L3.9 609.9 L-48.1 609.9 Z M-22.1 575.6 L12.0 643.0 L-56.3 643.0 Z M-26.0 630.0 h7.8 v14.2 h-7.8 Z M-0.1 517.8 L18.1 572.1 L-18.4 572.1 Z M-0.1 544.3 L26.4 605.8 L-26.7 605.8 Z M-0.1 570.9 L34.7 639.6 L-35.0 639.6 Z M-4.1 626.3 h8.0 v14.5 h-8.0 Z M24.7 518.7 L42.2 570.8 L7.2 570.8 Z M24.7 544.1 L50.2 603.2 L-0.8 603.2 Z M24.7 569.6 L58.1 635.6 L-8.7 635.6 Z M20.9 622.9 h7.6 v13.9 h-7.6 Z M54.2 531.5 L69.9 578.1 L38.5 578.1 Z M54.2 554.3 L77.0 607.1 L31.4 607.1 Z M54.2 577.1 L84.1 636.1 L24.3 636.1 Z M50.8 624.7 h6.8 v12.4 h-6.8 Z M79.1 524.1 L95.9 574.2 L62.2 574.2 Z M79.1 548.6 L103.6 605.4 L54.6 605.4 Z M79.1 573.1 L111.3 636.6 L46.9 636.6 Z M75.4 624.3 h7.4 v13.4 h-7.4 Z M101.7 541.1 L117.4 588.0 L85.9 588.0 Z M101.7 564.1 L124.6 617.2 L78.7 617.2 Z M101.7 587.0 L131.8 646.4 L71.6 646.4 Z M98.2 634.9 h6.9 v12.5 h-6.9 Z M130.9 550.3 L145.4 593.2 L116.5 593.2 Z M130.9 571.3 L151.9 619.9 L109.9 619.9 Z M130.9 592.3 L158.5 646.7 L103.4 646.7 Z M127.8 636.2 h6.3 v11.5 h-6.3 Z M149.6 537.9 L164.6 582.7 L134.5 582.7 Z M149.6 559.8 L171.5 610.6 L127.7 610.6 Z M149.6 581.7 L178.3 638.5 L120.8 638.5 Z M146.3 627.5 h6.6 v11.9 h-6.6 Z M175.7 554.6 L188.3 592.0 L163.2 592.0 Z M175.7 572.9 L194.0 615.3 L157.4 615.3 Z M175.7 591.1 L199.7 638.5 L151.7 638.5 Z M173.0 629.4 h5.5 v10.0 h-5.5 Z M208.8 562.6 L220.6 597.9 L196.9 597.9 Z M208.8 579.9 L226.0 619.8 L191.6 619.8 Z M208.8 597.1 L231.4 641.8 L186.2 641.8 Z M206.2 633.1 h5.2 v9.4 h-5.2 Z M231.7 563.2 L243.4 598.0 L220.0 598.0 Z M231.7 580.2 L248.7 619.7 L214.6 619.7 Z M231.7 597.2 L254.0 641.3 L209.3 641.3 Z M229.1 632.8 h5.1 v9.3 h-5.1 Z M249.8 567.2 L260.2 598.4 L239.3 598.4 Z M249.8 582.5 L265.0 617.8 L234.5 617.8 Z M249.8 597.7 L269.7 637.2 L229.8 637.2 Z M247.5 629.5 h4.6 v8.3 h-4.6 Z M282.2 568.3 L292.7 599.6 L271.7 599.6 Z M282.2 583.6 L297.4 619.0 L266.9 619.0 Z M282.2 598.9 L302.2 638.5 L262.1 638.5 Z M279.9 630.8 h4.6 v8.3 h-4.6 Z M306.0 571.9 L316.0 601.5 L296.1 601.5 Z M306.0 586.4 L320.5 619.9 L291.6 619.9 Z M306.0 600.8 L325.0 638.3 L287.1 638.3 Z M303.9 631.0 h4.3 v7.9 h-4.3 Z M333.5 572.1 L343.3 601.3 L323.7 601.3 Z M333.5 586.4 L347.8 619.4 L319.3 619.4 Z M333.5 600.6 L352.2 637.6 L314.8 637.6 Z M331.4 630.4 h4.3 v7.8 h-4.3 Z M355.9 586.4 L364.7 612.5 L347.1 612.5 Z M355.9 599.2 L368.7 628.8 L343.1 628.8 Z M355.9 612.0 L372.7 645.1 L339.1 645.1 Z M354.0 638.7 h3.8 v7.0 h-3.8 Z M382.8 596.1 L390.3 618.5 L375.2 618.5 Z M382.8 607.1 L393.7 632.4 L371.8 632.4 Z M382.8 618.0 L397.1 646.3 L368.4 646.3 Z M381.1 640.8 h3.3 v6.0 h-3.3 Z M400.4 594.3 L407.8 616.3 L393.0 616.3 Z M400.4 605.1 L411.1 629.9 L389.7 629.9 Z M400.4 615.8 L414.5 643.6 L386.3 643.6 Z M398.8 638.2 h3.2 v5.9 h-3.2 Z M425.8 580.1 L434.0 604.6 L417.6 604.6 Z M425.8 592.1 L437.8 619.8 L413.9 619.8 Z M425.8 604.0 L441.5 635.0 L410.1 635.0 Z M424.0 629.0 h3.6 v6.5 h-3.6 Z M457.0 576.7 L466.7 605.6 L447.3 605.6 Z M457.0 590.8 L471.1 623.5 L442.9 623.5 Z M457.0 604.9 L475.6 641.5 L438.5 641.5 Z M454.9 634.5 h4.2 v7.7 h-4.2 Z M484.5 580.5 L493.9 608.3 L475.2 608.3 Z M484.5 594.1 L498.1 625.7 L470.9 625.7 Z M484.5 607.7 L502.4 643.0 L466.7 643.0 Z M482.5 636.2 h4.1 v7.4 h-4.1 Z M506.1 569.6 L516.7 601.1 L495.6 601.1 Z M506.1 585.0 L521.5 620.6 L490.8 620.6 Z M506.1 600.4 L526.3 640.2 L486.0 640.2 Z M503.8 632.5 h4.6 v8.4 h-4.6 Z M534.1 559.1 L546.3 595.4 L521.9 595.4 Z M534.1 576.8 L551.8 617.9 L516.4 617.9 Z M534.1 594.6 L557.3 640.5 L510.8 640.5 Z M531.4 631.6 h5.3 v9.7 h-5.3 Z M557.0 572.0 L567.6 603.7 L546.3 603.7 Z M557.0 587.5 L572.5 623.4 L541.5 623.4 Z M557.0 603.0 L577.3 643.1 L536.6 643.1 Z M554.6 635.4 h4.6 v8.5 h-4.6 Z M581.8 554.2 L595.3 594.5 L568.2 594.5 Z M581.8 573.9 L601.5 619.6 L562.0 619.6 Z M581.8 593.6 L607.7 644.8 L555.9 644.8 Z M578.8 634.9 h5.9 v10.8 h-5.9 Z M602.4 558.4 L615.1 596.0 L589.8 596.0 Z M602.4 576.8 L620.8 619.5 L584.0 619.5 Z M602.4 595.2 L626.6 642.9 L578.3 642.9 Z M599.7 633.7 h5.5 v10.0 h-5.5 Z M624.3 547.4 L637.7 587.3 L610.9 587.3 Z M624.3 566.9 L643.8 612.1 L604.8 612.1 Z M624.3 586.4 L649.9 636.9 L598.7 636.9 Z M621.3 627.2 h5.8 v10.6 h-5.8 Z M650.4 556.5 L663.5 595.5 L637.3 595.5 Z M650.4 575.5 L669.5 619.8 L631.3 619.8 Z M650.4 594.6 L675.5 644.1 L625.4 644.1 Z M647.5 634.5 h5.7 v10.4 h-5.7 Z M675.6 544.5 L689.8 586.9 L661.3 586.9 Z M675.6 565.2 L696.3 613.3 L654.8 613.3 Z M675.6 585.9 L702.7 639.6 L648.4 639.6 Z M672.4 629.3 h6.2 v11.3 h-6.2 Z M709.5 541.9 L724.2 585.8 L694.7 585.8 Z M709.5 563.4 L730.9 613.1 L688.0 613.1 Z M709.5 584.8 L737.6 640.4 L681.3 640.4 Z M706.2 629.6 h6.4 v11.7 h-6.4 Z M730.6 529.8 L747.8 581.1 L713.4 581.1 Z M730.6 554.9 L755.7 613.1 L705.5 613.1 Z M730.6 580.0 L763.5 645.0 L697.7 645.0 Z M726.8 632.4 h7.5 v13.7 h-7.5 Z M759.4 529.6 L775.9 578.8 L742.8 578.8 Z M759.4 553.7 L783.4 609.5 L735.3 609.5 Z M759.4 577.8 L790.9 640.1 L727.8 640.1 Z M755.8 628.0 h7.2 v13.1 h-7.2 Z M778.3 523.1 L796.8 578.2 L759.8 578.2 Z M778.3 550.1 L805.2 612.5 L751.4 612.5 Z M778.3 577.0 L813.6 646.7 L743.0 646.7 Z M774.3 633.3 h8.1 v14.7 h-8.1 Z M800.8 521.8 L818.2 573.6 L783.4 573.6 Z M800.8 547.1 L826.1 605.7 L775.5 605.7 Z M800.8 572.4 L834.0 637.9 L767.6 637.9 Z M797.0 625.3 h7.6 v13.8 h-7.6 Z M -20 628 L 820 628 L 820 780 L -20 780 Z';
const MID_PINES = 'M-10.2 413.7 L27.8 538.1 L-48.2 538.1 Z M-10.2 474.5 L45.1 615.4 L-65.4 615.4 Z M-10.2 535.3 L62.3 692.8 L-82.7 692.8 Z M-18.5 662.4 h16.6 v33.2 h-16.6 Z M21.2 417.5 L58.6 540.1 L-16.3 540.1 Z M21.2 477.5 L75.6 616.4 L-33.3 616.4 Z M21.2 537.4 L92.7 692.7 L-50.4 692.7 Z M13.0 662.8 h16.3 v32.7 h-16.3 Z M57.0 449.5 L90.1 557.7 L24.0 557.7 Z M57.0 502.4 L105.1 625.1 L8.9 625.1 Z M57.0 555.3 L120.2 692.4 L-6.1 692.4 Z M49.8 666.0 h14.4 v28.9 h-14.4 Z M92.8 453.0 L125.4 559.7 L60.2 559.7 Z M92.8 505.2 L140.2 626.0 L45.4 626.0 Z M92.8 557.3 L155.0 692.4 L30.6 692.4 Z M85.7 666.3 h14.2 v28.4 h-14.2 Z M128.3 450.0 L161.3 558.0 L95.3 558.0 Z M128.3 502.8 L176.3 625.2 L80.3 625.2 Z M128.3 555.6 L191.3 692.4 L65.3 692.4 Z M121.1 666.0 h14.4 v28.8 h-14.4 Z M161.4 477.5 L190.6 573.1 L132.2 573.1 Z M161.4 524.3 L203.9 632.6 L118.9 632.6 Z M161.4 571.0 L217.2 692.1 L105.6 692.1 Z M155.0 668.8 h12.7 v25.5 h-12.7 Z M188.6 487.2 L216.5 578.4 L160.8 578.4 Z M188.6 531.8 L229.2 635.2 L148.1 635.2 Z M188.6 576.4 L241.9 692.0 L135.4 692.0 Z M182.6 669.7 h12.2 v24.3 h-12.2 Z M231.4 494.9 L258.2 582.7 L204.5 582.7 Z M231.4 537.8 L270.4 637.3 L192.3 637.3 Z M231.4 580.8 L282.6 692.0 L180.1 692.0 Z M225.5 670.5 h11.7 v23.4 h-11.7 Z M573.6 496.5 L600.2 583.6 L547.0 583.6 Z M573.6 539.1 L612.3 637.8 L534.9 637.8 Z M573.6 581.6 L624.4 691.9 L522.8 691.9 Z M567.8 670.7 h11.6 v23.2 h-11.6 Z M602.8 496.5 L629.4 583.6 L576.2 583.6 Z M602.8 539.1 L641.5 637.8 L564.1 637.8 Z M602.8 581.7 L653.6 691.9 L552.0 691.9 Z M597.0 670.7 h11.6 v23.2 h-11.6 Z M639.6 490.7 L667.0 580.4 L612.2 580.4 Z M639.6 534.6 L679.5 636.2 L599.8 636.2 Z M639.6 578.4 L691.9 692.0 L587.3 692.0 Z M633.6 670.1 h12.0 v23.9 h-12.0 Z M666.8 477.5 L696.0 573.1 L637.6 573.1 Z M666.8 524.3 L709.3 632.6 L624.3 632.6 Z M666.8 571.0 L722.6 692.1 L611.0 692.1 Z M660.4 668.8 h12.7 v25.5 h-12.7 Z M701.9 458.7 L733.8 562.8 L670.1 562.8 Z M701.9 509.6 L748.2 627.5 L655.7 627.5 Z M701.9 560.5 L762.7 692.3 L641.2 692.3 Z M695.0 666.9 h13.9 v27.8 h-13.9 Z M734.6 440.3 L769.0 552.7 L700.3 552.7 Z M734.6 495.2 L784.6 622.6 L684.7 622.6 Z M734.6 550.2 L800.2 692.5 L669.1 692.5 Z M727.1 665.0 h15.0 v30.0 h-15.0 Z M769.8 436.0 L804.7 550.3 L734.9 550.3 Z M769.8 491.9 L820.6 621.4 L719.0 621.4 Z M769.8 547.8 L836.5 692.5 L703.2 692.5 Z M762.2 664.6 h15.2 v30.5 h-15.2 Z M806.4 418.6 L843.7 540.7 L769.0 540.7 Z M806.4 478.3 L860.7 616.7 L752.1 616.7 Z M806.4 538.0 L877.6 692.7 L735.1 692.7 Z M798.2 662.9 h16.3 v32.6 h-16.3 Z';

/** [x, y, radio, retraso] */
const STARS = [[30, 370, 1.5, 0.6], [207, 159, 1.2, 0.5], [672, 417, 1.4, 1.9], [77, 61, 1.2, 1.1], [657, 85, 0.8, 3.8], [422, 79, 1.5, 0.1], [422, 411, 1.8, 2.8], [214, 167, 1.0, 3.1], [425, 332, 1.2, 0.9], [643, 414, 1.8, 3.2], [648, 316, 1.1, 2.1], [287, 32, 0.8, 1.1], [212, 297, 1.9, 1.8], [741, 415, 1.9, 1.5], [182, 111, 1.0, 0.8], [497, 380, 1.8, 1.9], [519, 340, 0.9, 2.6], [720, 333, 1.7, 1.9], [149, 336, 1.2, 3.2], [768, 178, 1.3, 3.8], [575, 88, 1.0, 0.6], [716, 343, 1.0, 3.3], [775, 283, 1.2, 2.2], [112, 26, 2.0, 2.6], [421, 393, 1.3, 3.5], [654, 104, 1.1, 1.2]];
/** [x, y, retraso] */
const FIREFLIES = [[228, 792, 1.6], [353, 674, 5.5], [308, 759, 3.5], [693, 749, 5.5], [411, 778, 3.1], [73, 754, 1.1], [63, 848, 1.0], [391, 829, 3.3], [288, 775, 3.3]];
/** Posiciones de la versión estática: [x, y, ángulo, escala] */
const STATIC_ANTS = [[-22.3, 942.5, -7.4, 0.599], [73.8, 929.9, -7.7, 0.563], [179.3, 915.1, -8.5, 0.524], [284.6, 898.0, -10.1, 0.485], [398.6, 874.9, -13.0, 0.429], [510.7, 844.3, -18.1, 0.353], [618.3, 800.5, -29.0, 0.278], [716.2, 737.7, -34.8, 0.204]];

const ANT_COUNT = 9;
const DURATION = 27; // segundos que tarda una hormiga en recorrer el sendero

const LEGS_FAR = [
  ['a', 'M103 56 L120 64 L131 88', '103px 56px'],
  ['b', 'M97 58 L103 72 L103 90', '97px 58px'],
  ['a', 'M91 56 L72 64 L60 88', '91px 56px'],
] as const;
const LEGS_NEAR = [
  ['b', 'M100 56 L116 64 L125 89', '100px 56px'],
  ['a', 'M94 58 L98 72 L96 90', '94px 58px'],
  ['b', 'M88 56 L68 64 L54 89', '88px 56px'],
] as const;

/** Hormiga en silueta. Origen = sus patas, mirando a la derecha. */
function TrailAnt({ c, leaf }: { c: Colors; leaf: boolean }) {
  return (
    <g transform="translate(-92 -90)">
      <g fill="none" stroke={c.ant} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.75">
        {LEGS_FAR.map(([k, d, o], i) => (
          <path key={i} className={`jm-leg jm-leg-${k}`} style={{ transformOrigin: o }} d={d} />
        ))}
      </g>
      <g fill="none" stroke={c.ant} strokeWidth="4" strokeLinecap="round">
        <path d="M117 28 Q110 10 97 7" />
        <path d="M125 27 Q124 9 113 2" />
      </g>
      <g fill={c.ant}>
        <ellipse cx="48" cy="47" rx="30" ry="20" transform="rotate(-10 48 47)" />
        <ellipse cx="79" cy="51" rx="8" ry="5.5" />
        <ellipse cx="94" cy="49" rx="15" ry="10" />
        <ellipse cx="123" cy="40" rx="19" ry="15" />
      </g>
      <g fill="none" stroke={c.ant} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
        {LEGS_NEAR.map(([k, d, o], i) => (
          <path key={i} className={`jm-leg jm-leg-${k}`} style={{ transformOrigin: o }} d={d} />
        ))}
      </g>
      {leaf && (
        <g className="jt-leaf" style={{ transformOrigin: '136px 44px' }}>
          <path d="M136 44 C 128 26, 116 8, 102 -6" fill="none" stroke={c.leafVein} strokeWidth="3" strokeLinecap="round" />
          <path d="M104 -4 C 60 -6, 26 -50, 34 -112 C 100 -106, 134 -54, 104 -4 Z" fill={c.leaf} />
          <path d="M103 -6 C 80 -40, 58 -74, 38 -108" fill="none" stroke={c.leafVein} strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
        </g>
      )}
    </g>
  );
}

interface AntTrailSceneProps extends MascotProps {
  /** dusk = atardecer (login), night = noche (registro) */
  palette?: TrailScenePalette;
}

export default function AntTrailScene({ palette = 'dusk', ...props }: AntTrailSceneProps) {
  const uid = useId().replace(/:/g, '');
  const c = PALETTES[palette];
  const [moonX, moonY] = palette === 'dusk' ? [470, 215] : [420, 160];

  return (
    <MascotSvg {...props} name="trail" viewBox="0 0 800 1000" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={`jt-sky-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={c.sky1} />
          <stop offset="0.65" stopColor={c.sky2} />
        </linearGradient>
        <radialGradient id={`jt-halo-${uid}`}>
          <stop offset="0" stopColor={c.halo} stopOpacity="0.55" />
          <stop offset="1" stopColor={c.halo} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`jt-fly-${uid}`}>
          <stop offset="0" stopColor={c.fly} />
          <stop offset="1" stopColor={c.fly} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* cielo, estrellas y luna */}
      <rect width="800" height="1000" fill={`url(#jt-sky-${uid})`} />
      {STARS.map(([x, y, r, d], i) => (
        <circle key={i} className="jt-star" style={{ animationDelay: `-${d}s` }} cx={x} cy={y} r={r} fill={c.star} />
      ))}
      <circle className="jt-halo" style={{ transformOrigin: `${moonX}px ${moonY}px` }} cx={moonX} cy={moonY} r="150" fill={`url(#jt-halo-${uid})`} />
      <circle cx={moonX} cy={moonY} r="64" fill={c.moon} />

      {/* bosque y colinas */}
      <path d={FAR_PINES} fill={c.far} opacity="0.85" />
      <path d="M0 590 C 140 620, 290 700, 410 706 C 550 712, 680 630, 800 596 L 800 1000 L 0 1000 Z" fill={c.hill1} />
      <path d={MID_PINES} fill={c.mid} />
      <g fill={c.bigtree}>
        <path d="M48 760 C 60 560, 70 380, 84 230 L 122 230 C 112 380, 108 560, 118 760 Z" />
        <path d="M92 360 C 60 320, 30 300, 0 300 L 0 280 C 40 280, 80 300, 104 330 Z" />
        <path d="M104 320 C 140 280, 180 260, 220 250 L 224 268 C 186 280, 150 300, 116 340 Z" />
        <circle cx="60" cy="130" r="120" /><circle cx="200" cy="110" r="95" /><circle cx="-20" cy="230" r="90" /><circle cx="150" cy="190" r="70" />
        <path d="M712 760 C 704 560, 696 380, 690 210 L 726 210 C 732 380, 744 560, 760 760 Z" />
        <path d="M700 320 C 670 290, 640 270, 600 262 L 598 282 C 636 290, 664 306, 690 336 Z" />
        <path d="M722 300 C 750 270, 780 260, 800 258 L 800 278 C 782 282, 756 294, 730 324 Z" />
        <circle cx="760" cy="110" r="110" /><circle cx="640" cy="90" r="80" /><circle cx="820" cy="220" r="80" />
      </g>
      <path d="M0 730 C 220 700, 470 760, 640 820 C 700 840, 760 860, 800 880 L 800 1000 L 0 1000 Z" fill={c.hill2} />

      {/* sendero */}
      <path d={ROAD} fill={c.road} />
      <path d={ROAD_EDGE} fill="none" stroke={c.roadEdge} strokeWidth="4" opacity="0.6" />
      <path d="M 360 1000 C 520 940, 700 880, 800 860 L 800 1000 Z" fill={c.hill3} />

      {/* hormigas en movimiento (1 de cada 3 carga una hoja) */}
      <g className="jt-moving">
        {Array.from({ length: ANT_COUNT }, (_, i) => {
          const begin = `${(-(i * DURATION) / ANT_COUNT).toFixed(2)}s`;
          const dur = `${DURATION}s`;
          return (
            <g key={i}>
              <animateMotion dur={dur} begin={begin} repeatCount="indefinite" rotate="auto" path={TRAIL} />
              <g>
                <animateTransform attributeName="transform" type="scale" values="0.62;0.46;0.24;0.12" keyTimes="0;0.45;0.8;1" dur={dur} begin={begin} repeatCount="indefinite" />
                <animate attributeName="opacity" values="1;1;0" keyTimes="0;0.88;1" dur={dur} begin={begin} repeatCount="indefinite" />
                <TrailAnt c={c} leaf={i % 3 === 1} />
              </g>
            </g>
          );
        })}
      </g>

      {/* versión estática */}
      <g className="jt-static">
        {STATIC_ANTS.map(([x, y, a, s], i) => (
          <g key={i} transform={`translate(${x} ${y}) rotate(${a}) scale(${s})`}>
            <TrailAnt c={c} leaf={i % 3 === 1} />
          </g>
        ))}
      </g>

      {/* luciérnagas */}
      {FIREFLIES.map(([x, y, d], i) => (
        <circle key={i} className="jt-fly" style={{ animationDelay: `-${d}s` }} cx={x} cy={y} r="7" fill={`url(#jt-fly-${uid})`} />
      ))}
    </MascotSvg>
  );
}
