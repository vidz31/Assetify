import React, { useEffect, useState } from 'react'

export const AnimatedCounter = ({
  value = 0,
  prefix = '',
  suffix = '',
  decimals = 0,
  duration = 1000,
  className = ''
}) => {
  const [displayValue, setDisplayValue] = useState(value)

  useEffect(() => {
    let startTimestamp = null
    const startValue = displayValue

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp
      const progress = Math.min((timestamp - startTimestamp) / duration, 1)
      
      // Easing out quadratic
      const easeProgress = progress * (2 - progress)
      
      const current = startValue + (value - startValue) * easeProgress
      setDisplayValue(current)

      if (progress < 1) {
        window.requestAnimationFrame(step)
      } else {
        setDisplayValue(value)
      }
    }

    window.requestAnimationFrame(step)
  }, [value, duration])

  return (
    <span className={className}>
      {prefix}
      {displayValue.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      })}
      {suffix}
    </span>
  )
}
