import { ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function CustomHeader({
  title,
  subtitle,
  onBack,
  onSave,
  saveLabel = 'Save',
  isLoading = false,
  isDone = false,
  disabled = false,
  rightContent,
  children,
}: {
  title?: string
  subtitle?: string
  onBack?: () => void
  onSave?: () => void
  saveLabel?: string
  isLoading?: boolean
  isDone?: boolean
  disabled?: boolean
  rightContent?: React.ReactNode
  children?: React.ReactNode
}) {
  const navigate = useNavigate()

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      navigate(-1)
    }
  }

  return (
    <div className="h-[88px] p-6 pl-4 flex w-full items-center flex-row bg-background">
      <div className="flex flex-1 flex-row gap-4 items-center">
        <Button variant="ghost" size="icon" type="button" onClick={handleBack}>
          <ChevronLeft className="h-6 w-6" />
        </Button>

        {title ? (
          <div className="flex flex-col">
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold leading-tight">
              {title}
            </p>
            {subtitle && (
              <p className="text-xs sm:text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
        ) : null}
      </div>

      <div className="flex flex-row items-center gap-4">
        {children}
        {rightContent}
        {onSave &&
          (isDone ? (
            <Button
              variant="secondary"
              size="sm"
              type="button"
              onClick={() => navigate(-1)}
              disabled={isLoading}
            >
              Done
            </Button>
          ) : (
            <Button
              size="sm"
              type="button"
              onClick={onSave}
              disabled={isLoading || disabled}
            >
              {isLoading ? 'Saving...' : saveLabel}
            </Button>
          ))}
      </div>
    </div>
  )
}
