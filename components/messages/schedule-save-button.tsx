import { FC } from "react"
import { IconDeviceFloppy } from "@tabler/icons-react"

interface ScheduleSaveButtonProps {
  onClick: () => void
  size?: number
}

export const ScheduleSaveButton: FC<ScheduleSaveButtonProps> = ({
  onClick,
  size = 18
}) => {
  return (
    <IconDeviceFloppy
      className="cursor-pointer hover:opacity-50"
      size={size}
      onClick={onClick}
    />
  )
}
