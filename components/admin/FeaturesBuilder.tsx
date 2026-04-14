'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, X, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Feature {
  textPt: string
  textEn: string
  included: boolean
}

interface FeaturesBuilderProps {
  value: Feature[]
  onChange: (features: Feature[]) => void
  disabled?: boolean
}

export default function FeaturesBuilder({
  value,
  onChange,
  disabled,
}: FeaturesBuilderProps) {
  const [newFeaturePt, setNewFeaturePt] = useState('')
  const [newFeatureEn, setNewFeatureEn] = useState('')

  const addFeature = () => {
    if (newFeaturePt.trim() && newFeatureEn.trim()) {
      onChange([
        ...value,
        {
          textPt: newFeaturePt.trim(),
          textEn: newFeatureEn.trim(),
          included: true,
        },
      ])
      setNewFeaturePt('')
      setNewFeatureEn('')
    }
  }

  const removeFeature = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  const toggleIncluded = (index: number) => {
    onChange(
      value.map((feature, i) =>
        i === index ? { ...feature, included: !feature.included } : feature
      )
    )
  }

  return (
    <div className="space-y-4">
      {/* Existing features */}
      <div className="space-y-2">
        {value.map((feature, index) => (
          <div
            key={index}
            className={cn(
              'flex items-center gap-2 rounded-lg border p-3',
              !feature.included && 'opacity-50'
            )}
          >
            <button
              type="button"
              onClick={() => toggleIncluded(index)}
              disabled={disabled}
              className={cn(
                'flex h-5 w-5 items-center justify-center rounded border transition-colors',
                feature.included
                  ? 'border-brand-teal bg-brand-teal text-white'
                  : 'border-muted-foreground'
              )}
            >
              {feature.included && <Check className="h-3 w-3" />}
            </button>
            <div className="flex-1">
              <p className="text-sm font-medium">{feature.textPt}</p>
              <p className="text-xs text-muted-foreground">{feature.textEn}</p>
            </div>
            {!disabled && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeFeature(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </div>

      {/* Add new feature */}
      {!disabled && (
        <div className="space-y-2 rounded-lg border p-4">
          <Label>Add Feature</Label>
          <div className="space-y-2">
            <Input
              placeholder="Feature in Portuguese"
              value={newFeaturePt}
              onChange={(e) => setNewFeaturePt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addFeature()
                }
              }}
            />
            <Input
              placeholder="Feature in English"
              value={newFeatureEn}
              onChange={(e) => setNewFeatureEn(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addFeature()
                }
              }}
            />
            <Button
              type="button"
              onClick={addFeature}
              className="w-full"
              disabled={!newFeaturePt.trim() || !newFeatureEn.trim()}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Feature
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
