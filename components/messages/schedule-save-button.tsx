import { forwardRef } from "react"
import { IconDeviceFloppy } from "@tabler/icons-react"

interface ScheduleSaveButtonProps {
  onClick: () => void
  size?: number
}

export const ScheduleSaveButton = forwardRef<
  HTMLDivElement,
  ScheduleSaveButtonProps
>(({ onClick, size = 18 }, ref) => {
  return (
    <div
      ref={ref}
      className="cursor-pointer hover:opacity-50"
      onClick={onClick}
    >
      <IconDeviceFloppy size={size} />
    </div>
  )
})

ScheduleSaveButton.displayName = "ScheduleSaveButton"
