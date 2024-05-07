'use client'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend)

interface TopResult {
  label: string
  data: number
}

interface RecentResult {
  label: string
  data: number
}
//-------------------------------------------------------------------------------
//  Top Results Graph component
//-------------------------------------------------------------------------------
export function TopResultsGraph({ topResultsData }: { topResultsData: TopResult[] }) {
  //
  //  Prepare the passed data for the chart
  //
  const labels = topResultsData.map(result => result.label)
  const data = topResultsData.map(result => result.data)
  //
  //  Define the chart data
  //
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Percentage',
        data,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }
    ]
  }
  const options = {
    scales: {
      x: {
        grid: {
          display: false // Remove x-axis gridlines
        }
      },
      y: {
        grid: {
          display: false // Remove y-axis gridlines
        }
      }
    }
  }

  return <Bar data={chartData} options={options} />
}
//-------------------------------------------------------------------------------
//  Recent Results Graph component
//-------------------------------------------------------------------------------
export function RecentResultsGraph({ recentResultsData }: { recentResultsData: RecentResult[] }) {
  //
  //  Prepare the passed data for the chart
  //
  const labels = recentResultsData.map(result => result.label)
  const data = recentResultsData.map(result => result.data)
  //
  //  Define the chart data
  //
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Percentage',
        data,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }
    ]
  }
  const options = {
    scales: {
      x: {
        grid: {
          display: false // Remove x-axis gridlines
        }
      },
      y: {
        grid: {
          display: false // Remove y-axis gridlines
        }
      }
    }
  }

  return <Bar data={chartData} options={options} />
}
