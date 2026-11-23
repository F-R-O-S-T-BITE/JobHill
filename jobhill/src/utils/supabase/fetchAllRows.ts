// utils/supabase/fetchAllRows.ts

/**
 * Supabase (PostgREST) devuelve como máximo `max_rows` filas por consulta
 * (2500 en este proyecto). Sin paginar, las listas grandes se cortan sin avisar.
 *
 * `buildQuery` debe crear una consulta NUEVA en cada llamada (los builders no se
 * pueden reutilizar) y tener un orden estable para que las páginas no se repitan.
 * La primera página pide el conteo exacto y el resto se piden en paralelo.
 */
export const PAGE_SIZE = 1000

type QueryResult<T> = { data: T[] | null; error: unknown; count?: number | null }

interface RangeableQuery<T> extends PromiseLike<QueryResult<T>> {
  range(from: number, to: number): PromiseLike<QueryResult<T>>
}

export async function fetchAllRows<T>(
  buildQuery: (withCount: boolean) => RangeableQuery<T>
): Promise<{ data: T[]; error: unknown; count: number }> {
  const first = await buildQuery(true).range(0, PAGE_SIZE - 1)
  if (first.error) return { data: [], error: first.error, count: 0 }

  const rows: T[] = [...(first.data ?? [])]
  const total = typeof first.count === 'number' ? first.count : null

  if (total !== null) {
    const pageCount = Math.ceil(total / PAGE_SIZE)
    if (pageCount > 1) {
      const pages = await Promise.all(
        Array.from({ length: pageCount - 1 }, (_, i) => {
          const from = (i + 1) * PAGE_SIZE
          return buildQuery(false).range(from, from + PAGE_SIZE - 1)
        })
      )
      for (const page of pages) {
        if (page.error) return { data: [], error: page.error, count: 0 }
        rows.push(...(page.data ?? []))
      }
    }
    return { data: rows, error: null, count: total }
  }

  // Sin conteo: seguir pidiendo hasta recibir una página incompleta
  let from = PAGE_SIZE
  let lastPageSize = rows.length
  while (lastPageSize === PAGE_SIZE) {
    const page = await buildQuery(false).range(from, from + PAGE_SIZE - 1)
    if (page.error) return { data: [], error: page.error, count: 0 }
    const pageRows = page.data ?? []
    rows.push(...pageRows)
    lastPageSize = pageRows.length
    from += PAGE_SIZE
  }
  return { data: rows, error: null, count: rows.length }
}
