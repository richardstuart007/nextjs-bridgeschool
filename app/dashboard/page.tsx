import { lusitana } from '@/app/ui/fonts'
import SummaryGraphs from '@/app/ui/dashboard/summary/summary'

export default async function Page() {
  return (
    <main className='h-screen flex flex-col p-4'>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>Dashboard</h1>
      <div className='flex-grow'>
        <SummaryGraphs />
      </div>
    </main>
  )
}
