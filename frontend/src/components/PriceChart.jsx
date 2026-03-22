import { useRef, useEffect, useState } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler)

const MONTHS = ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb']

export default function PriceChart({ prices = [], lowestIdx = 6 }) {
  const chartRef = useRef(null)

  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)

  const data = {
    labels: MONTHS.slice(0, prices.length),
    datasets: [
      {
        data: prices,
        borderColor: '#06B6D4',
        borderWidth: 2,
        pointRadius: prices.map((_, i) => i === lowestIdx ? 6 : 3),
        pointBackgroundColor: prices.map((_, i) => i === lowestIdx ? '#10B981' : '#06B6D4'),
        pointBorderColor: prices.map((_, i) => i === lowestIdx ? '#10B981' : 'transparent'),
        pointBorderWidth: 2,
        fill: true,
        backgroundColor: (ctx) => {
          const canvas = ctx.chart.ctx
          const gradient = canvas.createLinearGradient(0, 0, 0, 200)
          gradient.addColorStop(0, 'rgba(6,182,212,0.2)')
          gradient.addColorStop(1, 'rgba(6,182,212,0)')
          return gradient
        },
        tension: 0.4,
      }
    ]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1500,
      easing: 'easeInOutQuart',
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(5, 0, 30, 0.95)',
        borderColor: 'rgba(6,182,212,0.3)',
        borderWidth: 1,
        titleColor: '#F8FAFC',
        bodyColor: '#94A3B8',
        titleFont: { family: 'Sora', size: 12, weight: '600' },
        bodyFont: { family: 'JetBrains Mono', size: 13 },
        callbacks: {
          label: (ctx) => ` ₹${ctx.raw.toLocaleString()}`,
          title: (items) => {
            const i = items[0].dataIndex
            return i === lowestIdx ? '🟢 Lowest Price' : MONTHS[i]
          }
        },
        padding: 12,
        cornerRadius: 12,
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.04)', drawBorder: false },
        ticks: { color: '#94A3B8', font: { family: 'Inter', size: 11 } },
        border: { display: false },
      },
      y: {
        grid: { color: 'rgba(255,255,255,0.04)', drawBorder: false },
        ticks: {
          color: '#94A3B8',
          font: { family: 'JetBrains Mono', size: 11 },
          callback: (v) => '₹' + (v / 1000).toFixed(0) + 'k',
        },
        border: { display: false },
        min: Math.max(0, minPrice * 0.92),
        max: maxPrice * 1.05,
      }
    }
  }

  return (
    <div style={{ height: 200, position: 'relative' }}>
      <Line ref={chartRef} data={data} options={options} />
    </div>
  )
}
