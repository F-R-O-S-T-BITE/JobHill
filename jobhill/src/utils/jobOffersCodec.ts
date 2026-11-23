import type { Company, JobOfferResponse } from '@/interfaces/JobOffer';

/**
 * Formato compacto de /api/job-offers.
 *
 * Con miles de ofertas, repetir los nombres de campo en cada objeto y los mismos textos
 * (ubicaciones, categorías, modalidad, periodo) inflaba la respuesta hacia el límite de
 * 4.5 MB de las funciones de Vercel. Aquí cada oferta viaja como un arreglo en el orden
 * de JOB_FIELDS y los textos repetidos se mandan una sola vez en `strings`.
 * El cliente usa decodeJobOffers para volver a armar los objetos de siempre.
 */
export const JOB_FIELDS = [
  'id',
  'company_id',
  'job_title',
  'location',
  'modality',
  'period',
  'categories',
  'created_at',
  'application_link',
  'noSponsor',
  'usaCitizen',
  'emergingTalent',
  'newGrad',
  'relevance_tier',
  'is_favorite',
] as const;

type JobField = (typeof JOB_FIELDS)[number];

/** Campos que se mandan como índice (o lista de índices) de `strings` */
const STRING_FIELDS = new Set<JobField>(['modality', 'period']);
const STRING_LIST_FIELDS = new Set<JobField>(['location', 'categories']);
/** Campos que solo existen en el objeto cuando tienen valor */
const OPTIONAL_FIELDS = new Set<JobField>(['relevance_tier', 'is_favorite']);

export const JOB_OFFERS_FORMAT = 'compact-v1';

/** Empresa tal como sale de Supabase (logo_url puede venir vacío) */
type CompanyRow = Omit<Company, 'logo_url'> & { logo_url: string | null };

export interface CompactJobOffers {
  format: typeof JOB_OFFERS_FORMAT;
  fields: readonly string[];
  strings: string[];
  rows: unknown[][];
  companies: Record<number, CompanyRow>;
}

export function encodeJobOffers(
  jobs: Omit<JobOfferResponse, 'company'>[],
  companies: Record<number, CompanyRow>
): CompactJobOffers {
  const strings: string[] = [];
  const index = new Map<string, number>();
  const ref = (value: string) => {
    let i = index.get(value);
    if (i === undefined) {
      i = strings.length;
      strings.push(value);
      index.set(value, i);
    }
    return i;
  };

  const rows = jobs.map((job) =>
    JOB_FIELDS.map((field) => {
      const value = (job as Record<string, unknown>)[field];
      if (value === undefined || value === null) return null;
      if (STRING_FIELDS.has(field) && typeof value === 'string') return ref(value);
      if (STRING_LIST_FIELDS.has(field) && Array.isArray(value)) {
        return value.map((v) => (typeof v === 'string' ? ref(v) : v));
      }
      return value;
    })
  );

  return { format: JOB_OFFERS_FORMAT, fields: JOB_FIELDS, strings, rows, companies };
}

export function decodeJobOffers(data: CompactJobOffers): JobOfferResponse[] {
  const { fields, strings, rows, companies } = data;
  return rows.map((row) => {
    const job: Record<string, unknown> = {};
    fields.forEach((field, i) => {
      const raw = row[i];
      const key = field as JobField;
      if (raw === null || raw === undefined) {
        if (!OPTIONAL_FIELDS.has(key)) job[field] = null;
        return;
      }
      if (STRING_FIELDS.has(key) && typeof raw === 'number') job[field] = strings[raw];
      else if (STRING_LIST_FIELDS.has(key) && Array.isArray(raw)) {
        job[field] = raw.map((v) => (typeof v === 'number' ? strings[v] : v));
      } else job[field] = raw;
    });
    job.company = companies[job.company_id as number] as Company;
    return job as unknown as JobOfferResponse;
  });
}

export function isCompactJobOffers(data: unknown): data is CompactJobOffers {
  return !!data && (data as { format?: unknown }).format === JOB_OFFERS_FORMAT;
}
