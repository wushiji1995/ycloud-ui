export const iconFontNames = [
  "soho_1",
  "soho_11",
  "soho_12",
  "soho_13",
  "sohu_1",
  "freebuf",
  "freebuf_2",
  "freebuf1",
  "soho",
  "freebuf2",
  "soho1",
  "in",
  "a-ycloudlogosingle",
  "CRMguanli",
] as const

export type IconFontName = (typeof iconFontNames)[number]
