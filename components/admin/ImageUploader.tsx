'use client'

import { useState } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface ImageUploaderProps {
  value?: string
  onChange: (url: string) => void
  onRemove?: () => void
  disabled?: boolean
  className?: string
}

export default function ImageUploader({
  value,
  onChange,
  onRemove,
  disabled,
  className,
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)

    try {
      // TODO: Implement actual upload with Uploadthing
      // For now, create a local URL
      const url = URL.createObjectURL(file)
      onChange(url)
    } catch (error) {
      console.error('Upload error:', error)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className={cn('space-y-4', className)}>
      {value ? (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted">
          <Image
            src={value}
            alt="Upload preview"
            fill
            className="object-cover"
          />
          {!disabled && (
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute right-2 top-2"
              onClick={() => {
                onRemove?.()
                onChange('')
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ) : (
        <label
          className={cn(
            'flex aspect-video w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 transition-colors hover:border-muted-foreground/50',
            disabled && 'cursor-not-allowed opacity-50'
          )}
        >
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={disabled || isUploading}
          />
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            {isUploading ? (
              <>
                <Upload className="h-8 w-8 animate-pulse" />
                <p className="text-sm">Uploading...</p>
              </>
            ) : (
              <>
                <ImageIcon className="h-8 w-8" />
                <p className="text-sm">Click to upload image</p>
                <p className="text-xs">PNG, JPG, GIF up to 10MB</p>
              </>
            )}
          </div>
        </label>
      )}
    </div>
  )
}
