// components/mascots/MascotSvg.tsx
import './mascots.css';

export interface MascotProps {
  className?: string;
  /** Anima la mascota (por defecto true). Siempre se respeta "reducir movimiento". */
  animated?: boolean;
  /** Texto accesible. Si no se pasa, la ilustración es decorativa (aria-hidden). */
  title?: string;
}

interface MascotSvgProps extends MascotProps {
  viewBox: string;
  name: string;
  preserveAspectRatio?: string;
  children: React.ReactNode;
}

export function MascotSvg({ className = '', animated = true, title, viewBox, name, preserveAspectRatio, children }: MascotSvgProps) {
  return (
    <svg
      viewBox={viewBox}
      preserveAspectRatio={preserveAspectRatio}
      xmlns="http://www.w3.org/2000/svg"
      className={`jm-mascot jm-${name} ${animated ? '' : 'jm-static'} ${className}`}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {title && <title>{title}</title>}
      {children}
    </svg>
  );
}
