import React from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend)

type ChartProps = {
  labels: string[]
  data: number[]
  coinName: string
}

const Chart: React.FC<ChartProps> = ({ labels, data, coinName }) => {
  const chartData = {
    labels,
    datasets: [
      {
        label: `${coinName} price (USD)`,
        data,
        // warna garis & area biar lebih kontras sama background
        borderColor: 'rgba(34, 197, 94, 0.85)',        // hijau neon dikit
        backgroundColor: 'rgba(34, 197, 94, 0.12)',    // fill tipis
        pointRadius: 0,
        pointHitRadius: 6,
        borderWidth: 2,
        tension: 0.25
      }
    ]
  }

  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#e5e7eb', // teks legend terang
          font: {
            size: 11
          }
        }
      },
      tooltip: {
        titleColor: '#e5e7eb',
        bodyColor: '#e5e7eb',
        backgroundColor: 'rgba(15,23,42,0.95)',
        borderColor: 'rgba(148,163,184,0.4)',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        ticks: {
          maxTicksLimit: 8,
          color: '#9ca3af', // warna label sumbu X
          font: {
            size: 10
          }
        },
        grid: {
          color: 'rgba(148,163,184,0.12)' // garis grid halus
        }
      },
      y: {
        ticks: {
          color: '#9ca3af', // label sumbu Y
          font: {
            size: 10
          }
        },
        grid: {
          color: 'rgba(148,163,184,0.12)'
        }
      }
    }
  }

  return (
    <div className="chart-container">
      <Line data={chartData} options={options} />
    </div>
  )
}

export default Chart
