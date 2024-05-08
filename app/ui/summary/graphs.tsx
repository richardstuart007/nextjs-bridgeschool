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
//
//  Register the components
//
ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend)
//
//  Simple Graph Interfaces
//
interface SimpleGraphData_INT {
  label: string
  data: number
}
interface SimpleGraphOptions_INT {
  graphLabel?: string
  backgroundColor?: string
}
//
//  Stacked Graph Interfaces
//
interface Datasets {
  label: string
  data: number[]
  backgroundColor: string
}

interface StackDataStructure {
  labels: string[]
  datasets: Datasets[]
}
//-------------------------------------------------------------------------------
//  Bar Chart component
//-------------------------------------------------------------------------------
export function StackedBarChart({
  StackedGraphData,
  Stacked
}: {
  StackedGraphData: StackDataStructure
  Stacked: boolean
}) {
  const options = {
    scales: {
      x: {
        stacked: Stacked,
        grid: {
          display: false // Remove x-axis gridlines
        }
      },
      y: {
        stacked: Stacked,
        grid: {
          display: false // Remove y-axis gridlines
        }
      }
    }
  }
  //
  //  Return the Bar component
  //
  return <Bar data={StackedGraphData} options={options} />
}
