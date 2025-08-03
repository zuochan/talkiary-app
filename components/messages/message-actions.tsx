import { ChatbotUIContext } from "@/context/context"
import { IconCheck, IconCopy, IconEdit, IconRepeat } from "@tabler/icons-react"
import { FC, useContext, useEffect, useState } from "react"
import { WithTooltip } from "../ui/with-tooltip"
import { ScheduleSaveButton } from "./schedule-save-button"

export const MESSAGE_ICON_SIZE = 18

interface MessageActionsProps {
  isAssistant: boolean
  isLast: boolean
  isEditing: boolean
  isHovering: boolean
  onCopy: () => void
  onEdit: () => void
  onRegenerate: () => void
  schedule?: { time: string; activity: string; note?: string }[]
  onSaveSchedule?: () => void
}

export const MessageActions: FC<MessageActionsProps> = ({
  isAssistant,
  isLast,
  isEditing,
  isHovering,
  onCopy,
  onEdit,
  onRegenerate,
  schedule,
  onSaveSchedule
}) => {
  const { isGenerating } = useContext(ChatbotUIContext)

  const [showCopyCheck, setShowCopyCheck] = useState(false)
  const [showSaveCheck, setShowSaveCheck] = useState(false)

  const handleCopy = () => {
    onCopy()
    setShowCopyCheck(true)
  }

  const handleSaveScheduleClick = () => {
    if (onSaveSchedule) {
      onSaveSchedule()
    }
    setShowSaveCheck(true)
  }

  const handleForkChat = async () => {}

  useEffect(() => {
    if (showCopyCheck) {
      const timer = setTimeout(() => {
        setShowCopyCheck(false)
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [showCopyCheck])

  useEffect(() => {
    if (showSaveCheck) {
      const timer = setTimeout(() => {
        setShowSaveCheck(false)
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [showSaveCheck])

  return (isLast && isGenerating) || isEditing ? null : (
    <div className="text-muted-foreground flex items-center space-x-2">
      {/* {((isAssistant && isHovering) || isLast) && (
        <WithTooltip
          delayDuration={1000}
          side="bottom"
          display={<div>Fork Chat</div>}
          trigger={
            <IconGitFork
              className="cursor-pointer hover:opacity-50"
              size={MESSAGE_ICON_SIZE}
              onClick={handleForkChat}
            />
          }
        />
      )} */}

      {!isAssistant && isHovering && (
        <WithTooltip
          delayDuration={1000}
          side="bottom"
          display={<div>Edit</div>}
          trigger={
            <div className="cursor-pointer hover:opacity-50" onClick={onEdit}>
              <IconEdit size={MESSAGE_ICON_SIZE} />
            </div>
          }
        />
      )}

      {(isHovering || isLast) && (
        <WithTooltip
          delayDuration={1000}
          side="bottom"
          display={<div>Copy</div>}
          trigger={
            showCopyCheck ? (
              <IconCheck size={MESSAGE_ICON_SIZE} />
            ) : (
              <div
                className="cursor-pointer hover:opacity-50"
                onClick={handleCopy}
              >
                <IconCopy size={MESSAGE_ICON_SIZE} />
              </div>
            )
          }
        />
      )}

      {isAssistant && isLast && schedule && schedule.length > 0 && (
        <WithTooltip
          delayDuration={1000}
          side="bottom"
          display={<div>Save Schedule</div>}
          trigger={
            showSaveCheck ? (
              <IconCheck size={MESSAGE_ICON_SIZE} />
            ) : (
              <ScheduleSaveButton
                size={MESSAGE_ICON_SIZE}
                onClick={handleSaveScheduleClick}
              />
            )
          }
        />
      )}

      {isLast && (
        <WithTooltip
          delayDuration={1000}
          side="bottom"
          display={<div>Regenerate</div>}
          trigger={
            <div
              className="cursor-pointer hover:opacity-50"
              onClick={onRegenerate}
            >
              <IconRepeat size={MESSAGE_ICON_SIZE} />
            </div>
          }
        />
      )}

      {/* {1 > 0 && isAssistant && <MessageReplies />} */}
    </div>
  )
}
