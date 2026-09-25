import {format, parseISO} from 'date-fns'

// e.g. "Aug 8, 2026"
export function formatDate(date: string, pattern = 'LLL d, yyyy') {
  return format(parseISO(date), pattern)
}
