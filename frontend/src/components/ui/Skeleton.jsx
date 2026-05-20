import React from 'react'
import { cn } from '@/utils/cn'

export const Skeleton = ({
  className = '',
  circle = false
}) => {
  return (
    <div
      className={cn(
        'bg-surface-elevated/45 animate-pulse',
        circle ? 'rounded-full' : 'rounded-xl',
        className
      )}
    />
  )
}
