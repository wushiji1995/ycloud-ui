import "@/assets/iconfont/iconfont.css"

import type { IconFontName } from "@/lib/iconfont"
import { cn } from "@/lib/utils"

type IconFontIconProps = {
  name: IconFontName
  label?: string
  className?: string
}

export function IconFontIcon({ name, label, className }: IconFontIconProps) {
  return (
    <i
      aria-hidden={label ? undefined : "true"}
      aria-label={label}
      className={cn("iconfont", `icon-${name}`, className)}
      role={label ? "img" : undefined}
    />
  )
}
