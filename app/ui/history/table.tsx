import { BookQuiz, QuizReview } from '@/app/ui/general/buttons'
import { fetchFilteredHistory } from '@/app/lib/data'

export default async function HistoryTable({
  query,
  currentPage
}: {
  query: string
  currentPage: number
}) {
  const history = await fetchFilteredHistory(query, currentPage)

  return (
    <div className='mt-2 md:mt-6 flow-root'>
      <div className='inline-block min-w-full align-middle'>
        <div className='rounded-lg bg-gray-50 p-2 md:pt-0'>
          <table className='min-w-full text-gray-900 table-fixed'>
            <thead className='rounded-lg text-left  font-normal text-xs md:text-sm'>
              <tr>
                <th scope='col' className='px-2 py-2 font-medium text-left'>
                  Title
                </th>
                <th scope='col' className='px-2 py-2 font-medium text-left'>
                  Points
                </th>
                <th scope='col' className='px-2 py-2 font-medium text-left'>
                  Max
                </th>
                <th scope='col' className='px-2 py-2 font-medium text-left'>
                  Percentage
                </th>
                <th scope='col' className='px-2 py-2 font-medium text-centre'>
                  Review
                </th>
                <th scope='col' className='px-2 py-2 font-medium text-centre hidden md:block'>
                  Questions
                </th>

                <th scope='col' className='px-2 py-2 font-medium text-centre'>
                  Quiz
                </th>
              </tr>
            </thead>
            <tbody className='bg-white'>
              {history?.map(history => (
                <tr
                  key={history.r_hid}
                  className='w-full border-b py-2 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg'
                >
                  <td className='px-2 py-1 text-xs md:text-sm'>{history.ogtitle}</td>
                  <td className='px-2 py-1 text-xs md:text-sm hidden md:table-cell'>
                    {history.r_totalpoints}
                  </td>
                  <td className='px-2 py-1 text-xs md:text-sm hidden md:table-cell'>
                    {history.r_maxpoints}
                  </td>
                  <td className='px-2 py-1 text-xs md:text-sm hidden md:table-cell'>
                    {history.r_correctpercent}
                  </td>
                  <td className='px-2 text-centre'>
                    <QuizReview hid={history.r_hid} />
                  </td>
                  <td className='px-2 py-1 text-xs md:text-sm hidden md:table-cell'>
                    {history.r_questions}
                  </td>
                  <td className='px-2 text-centre'>
                    <BookQuiz gid={history.r_gid} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
