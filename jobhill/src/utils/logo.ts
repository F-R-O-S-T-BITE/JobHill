// utils/logo.ts

/**
 * Los íconos de Brandfetch son cuadrados (128x128) y ya traen su propio fondo,
 * así que pueden llenar todo el recuadro. Otros logos (Wikimedia, LinkedIn, etc.)
 * pueden ser horizontales: esos se ajustan completos con un pequeño margen.
 */
export function isSquareLogo(url?: string | null): boolean {
  return !!url && url.includes('cdn.brandfetch.io') && url.includes('/icon');
}

export function logoImageClass(url?: string | null): string {
  return isSquareLogo(url) ? 'h-full w-full object-cover' : 'h-full w-full object-contain p-1.5';
}
