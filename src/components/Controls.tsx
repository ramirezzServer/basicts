import React from 'react'
import type { TimeRange } from '../utils/api'

type ControlsProps = {
  timeRange: TimeRange
  onTimeRangeChange: (range: TimeRange) => void
}

const Controls: React.FC<ControlsProps> = ({ timeRange, onTimeRangeChange }) => {
  // tambah 180 (6 bulan)
  const ranges: TimeRange[] = [1, 7, 30, 90, 180]

  function getLabel(v: TimeRange) {
    if (v === 1) return '1D'
    if (v === 7) return '7D'
    if (v === 30) return '30D'
    if (v === 90) return '90D'
    return '6M' // 180 hari
  }

  return (
    <div className="toolbar">
      <div>
        <span className="label">Time range:</span>
        <div className="segmented">
          {ranges.map((v) => (
            <button
              key={v}
              className={v === timeRange ? 'active' : ''}
              onClick={() => onTimeRangeChange(v)}
            >
              {getLabel(v)}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Controls
