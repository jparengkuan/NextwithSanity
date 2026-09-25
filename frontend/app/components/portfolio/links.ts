export function isExternalUrl(href: string) {
  return /^https?:\/\//.test(href)
}

// A nav item counts as current on its own page and on any page below it (/blogs → /blogs/post)
export function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`)
}

// 1 → "01", as used for project and menu numbering
export function formatIndex(n: number) {
  return String(n).padStart(2, '0')
}
