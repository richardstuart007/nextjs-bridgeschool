import { fetchTopResultsData, fetchRecentResultsData } from '@/app/lib/data'
import { StackedBarChart } from './graphs'
import { UsershistoryTopResults, UsershistoryRecentResults } from '@/app/lib/definitions'
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

export default async function SummaryGraphs() {
  //
  //  Fetch the data
  //
  const [dataTop, dataRecent]: [UsershistoryTopResults[], UsershistoryRecentResults[]] =
    await Promise.all([fetchTopResultsData(), fetchRecentResultsData()])
  //
  // TOP
  //
  const namesTop: string[] = dataTop.map(item => item.u_name)
  const percentagesTop: number[] = dataTop.map(item => item.percentage)
  //
  //  Datasets
  //
  const StackedGraphDataTop: StackDataStructure = {
    labels: namesTop,
    datasets: [
      {
        label: 'Percentage',
        data: percentagesTop,
        backgroundColor: 'rgba(75, 192, 192, 0.6)'
      }
    ]
  }
  //
  // Recent
  //
  const names: string[] = dataRecent.map(item => item.u_name)
  const percentages: number[] = dataRecent.map(item => item.r_correctpercent)
  //
  //  Datasets
  //
  const StackedGraphData: StackDataStructure = {
    labels: names,
    datasets: [
      {
        label: 'Percentage',
        data: percentages,
        backgroundColor: 'rgba(75, 192, 192, 0.6)'
      },
      {
        label: 'Count',
        data: [12, 19, 3, 7, 79],
        backgroundColor: 'rgba(192, 75, 192, 0.6)'
      }
    ]
  }
  return (
    <div className='flex flex-col gap-10'>
      <div className='max-w-full bg-gray-100 md:max-w-2xl   '>
        <h2>Top Results</h2>
        <StackedBarChart StackedGraphData={StackedGraphDataTop} Stacked={false} />
      </div>
      <div className='max-w-full bg-gray-100 md:max-w-2xl '>
        <h2>Recent Results</h2>
        <StackedBarChart StackedGraphData={StackedGraphData} Stacked={false} />
      </div>
    </div>
  )
}
