import {
  fetchTopResultsData,
  fetchRecentResultsData1,
  fetchRecentResultsData5
} from '@/app/lib/data'
import { StackedBarChart } from './graphs'
import { UsershistoryTopResults, UsershistoryRecentResults } from '@/app/lib/definitions'
//
//  Graph Interfaces
//
interface Datasets {
  label: string
  data: number[]
  backgroundColor: string
}
interface GraphStructure {
  labels: string[]
  datasets: Datasets[]
}
//--------------------------------------------------------------------------------
export default async function SummaryGraphs() {
  //
  //  Fetch the data
  //
  const [dataTop, dataRecent1]: [UsershistoryTopResults[], UsershistoryRecentResults[]] =
    await Promise.all([fetchTopResultsData(), fetchRecentResultsData1()])
  //
  //  Extract the user IDs and get the data for the last 5 results for each user
  //
  const userIds: number[] = dataRecent1.map(item => item.r_uid)
  const dataRecent5: UsershistoryRecentResults[] = await fetchRecentResultsData5(userIds)
  //
  // TOP graph
  //
  const TopGraphData: GraphStructure = topGraph(dataTop)
  //
  // Recent graph
  //
  const RecentGraphData: GraphStructure = recentGraph(dataRecent1, dataRecent5)
  //--------------------------------------------------------------------------------
  //  Generate the data for the TOP results graph
  //--------------------------------------------------------------------------------
  function topGraph(dataTop: { u_name: string; percentage: number }[]): GraphStructure {
    //
    //  Derive the names and percentages from the data
    //
    const names: string[] = dataTop.map(item => item.u_name)
    const percentages: number[] = dataTop.map(item => item.percentage)
    //
    //  Datasets
    //
    const GraphData: GraphStructure = {
      labels: names,
      datasets: [
        {
          label: 'Percentage',
          data: percentages,
          backgroundColor: 'rgba(75, 192, 192, 0.6)'
        }
      ]
    }
    return GraphData
  }
  //--------------------------------------------------------------------------------
  //  Generate the data for the RECENT results graph
  //--------------------------------------------------------------------------------
  function recentGraph(
    dataRecent1: UsershistoryRecentResults[],
    dataRecent5: UsershistoryRecentResults[]
  ): GraphStructure {
    //
    //  Derive the names
    //
    const names: string[] = dataRecent1.map(item => item.u_name)
    const individualPercentages: number[] = dataRecent1.map(item => item.r_correctpercent)
    //
    //  Derive percentages from the data
    //
    // const userIds: number[] = dataRecent1.map(item => item.r_uid)
    const averagePercentages: number[] = calculatePercentages(dataRecent5, userIds)
    //
    //  Datasets
    //
    const GraphData: GraphStructure = {
      labels: names,
      datasets: [
        {
          label: 'Latest Percentage',
          data: individualPercentages,
          backgroundColor: 'rgba(75, 192, 192, 0.6)'
        },
        {
          label: 'Average Percentage',
          data: averagePercentages,
          backgroundColor: 'rgba(192, 75, 192, 0.6)'
        }
      ]
    }
    return GraphData
  }
  //--------------------------------------------------------------------------------
  //  Calculate the average and individual percentages for each user
  //--------------------------------------------------------------------------------
  function calculatePercentages(
    dataRecent5: UsershistoryRecentResults[],
    userIds: number[]
  ): number[] {
    //
    //  Calculate average percentages for each user
    //
    const averagePercentages: number[] = [0, 0, 0, 0, 0]
    //
    //  Process each record
    //
    let currentUid = 0
    let sumTotalPoints = 0
    let sumMaxPoints = 0
    for (const record of dataRecent5) {
      const { r_uid, r_totalpoints, r_maxpoints } = record
      //
      //  CHANGE of user ID          OR
      //  LAST record in the data
      //
      if (currentUid !== r_uid || dataRecent5.indexOf(record) === dataRecent5.length - 1) {
        //
        //  If not first record
        //
        if (currentUid !== 0) {
          //
          //  Update the average percentage for the user
          //
          const averagePercentage = Math.round((100 * sumTotalPoints) / sumMaxPoints)
          const index = userIds.indexOf(currentUid)
          averagePercentages[index] = averagePercentage
          //
          //  Reset the sum and count for the next user
          //
          sumTotalPoints = 0
          sumMaxPoints = 0
        }
        //
        //  Current user
        //
        currentUid = r_uid
      }
      //
      //  Increment the sum and count
      //
      sumTotalPoints += r_totalpoints
      sumMaxPoints += r_maxpoints
    }
    //
    //  End of data
    //
    const averagePercentage = Math.round((100 * sumTotalPoints) / sumMaxPoints)
    const index = userIds.indexOf(currentUid)
    averagePercentages[index] = averagePercentage
    //
    //  Return the average percentages
    //
    return averagePercentages
  }
  //--------------------------------------------------------------------------------
  return (
    <div className='flex flex-col gap-10'>
      <div className='max-w-full bg-gray-100 md:max-w-2xl   '>
        <h2>Top Results</h2>
        <StackedBarChart StackedGraphData={TopGraphData} Stacked={false} />
      </div>
      <div className='max-w-full bg-gray-100 md:max-w-2xl '>
        <h2>Recent Results</h2>
        <StackedBarChart StackedGraphData={RecentGraphData} Stacked={false} />
      </div>
    </div>
  )
}
