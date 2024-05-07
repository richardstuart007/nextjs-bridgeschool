import { fetchTopResultsData, fetchRecentResultsData } from '@/app/lib/data'
import { TopResultsGraph, RecentResultsGraph } from './graphs'

export default async function SummaryGraphs() {
  //
  //  Get the data
  //
  const [dataTop, dataRecent] = await Promise.all([fetchTopResultsData(), fetchRecentResultsData()])
  //
  // Transform the fetched data - TOP
  //
  const topResultsData = dataTop.map(item => ({
    label: item.u_name,
    data: item.percentage
  }))
  //
  // Transform the fetched data - Recent
  //
  const recentResultsData = dataRecent.map(item => ({
    label: item.u_name,
    data: item.r_correctpercent
  }))

  return (
    <div className='flex flex-col gap-10'>
      <div className='max-w-full bg-gray-100 md:max-w-2xl md:h-80'>
        <h2>Top 10 Results Graph</h2>
        {topResultsData.length > 0 && <TopResultsGraph topResultsData={topResultsData} />}
      </div>
      <div className='max-w-full bg-gray-100 md:max-w-2xl md:h-80'>
        <h2>Recent Results Graph</h2>
        {recentResultsData.length > 0 && (
          <RecentResultsGraph recentResultsData={recentResultsData} />
        )}
      </div>
    </div>
  )
}
