import { lusitana } from '@/app/ui/fonts'
import SummaryGraphs from '@/app/ui/dashboard/summary/summary'

export default async function Page() {
  return (
    <main className='h-screen flex flex-col p-2 md:p-6'>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>Dashboard</h1>
      {/* <div className='flex-grow' style={{ height: 'calc(100% - 150px)' }}> */}
      <div className='flex-grow'>
        <SummaryGraphs />
      </div>
    </main>
  )
}
