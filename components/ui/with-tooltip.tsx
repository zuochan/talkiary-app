import { forwardRef } from "react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "./tooltip"

interface WithTooltipProps {
  display: React.ReactNode
  trigger: React.ReactNode

  delayDuration?: number
  side?: "left" | "right" | "top" | "bottom"
  asChild?: boolean
}

export const WithTooltip = forwardRef<HTMLButtonElement, WithTooltipProps>(
  (
    { display, trigger, delayDuration = 500, side = "right", asChild = false },
    ref
  ) => {
    return (
      <TooltipProvider delayDuration={delayDuration}>
        <Tooltip>
          <TooltipTrigger asChild={asChild} ref={asChild ? undefined : ref}>
            {trigger}
          </TooltipTrigger>

          <TooltipContent side={side}>{display}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }
)

WithTooltip.displayName = "WithTooltip"
