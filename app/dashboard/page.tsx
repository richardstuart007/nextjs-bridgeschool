import { lusitana } from '@/app/ui/fonts'
import SummaryGraphs from '@/app/ui/summary/summary'

export default async function Page() {
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>Dashboard</h1>
      <SummaryGraphs />
    </main>
  )
}
