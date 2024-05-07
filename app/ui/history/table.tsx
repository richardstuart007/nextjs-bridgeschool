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
          {/** -------------------------------------------------------------------- */}
          {/** Desktop Table                                                        */}
          {/** -------------------------------------------------------------------- */}
          <table className='min-w-full text-gray-900 table-fixed hidden sm:table'>
            <thead className='rounded-lg text-left  font-normal text-sm'>
              <tr>
                <th scope='col' className='px-2 py-2 font-medium text-left '>
                  ID
                </th>
                <th scope='col' className='px-2 py-2 font-medium text-left'>
                  Title
                </th>
                <th scope='col' className='px-2 py-2 font-medium text-left '>
                  User
                </th>
                <th scope='col' className='px-2 py-2 font-medium text-left '>
                  Points
                </th>
                <th scope='col' className='px-2 py-2 font-medium text-left '>
                  Max
                </th>
                <th scope='col' className='px-2 py-2 font-medium text-left '>
                  %
                </th>
                <th scope='col' className='px-2 py-2 font-medium text-centre'>
                  Review
                </th>
                <th scope='col' className='px-2 py-2 font-medium text-centre '>
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
                  <td className='px-2 py-2 text-sm '>{history.r_hid}</td>
                  <td className='px-2 py-2 text-sm '>{history.ogtitle}</td>
                  <td className='px-2 py-2 text-sm '>{history.r_uid}</td>
                  <td className='px-2 py-2 text-sm '>{history.r_totalpoints}</td>
                  <td className='px-2 py-2 text-sm '>{history.r_maxpoints}</td>
                  <td className='px-2 py-2 text-sm '>{history.r_correctpercent}</td>
                  <td className='px-2 py-2 '>
                    <QuizReview hid={history.r_hid} />
                  </td>
                  <td className='px-2 py-2 text-sm '>{history.r_questions}</td>
                  <td className='px-2 py-2'>
                    <BookQuiz gid={history.r_gid} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/** -------------------------------------------------------------------- */}
          {/** Mobile Table                                                         */}
          {/** -------------------------------------------------------------------- */}
          <table className='min-w-full text-gray-900 table-fixed sm:hidden'>
            <thead className='rounded-lg text-left  font-normal text-xs'>
              <tr>
                <th scope='col' className='px-2 py-2 font-medium text-left inline-block'>
                  Title
                </th>
                <th scope='col' className='px-2 py-2 font-medium text-centre'>
                  Review
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
                  <td className='px-2 py-2 text-xs'>{history.ogtitle}</td>
                  <td className='px-2 py-2 '>
                    <QuizReview hid={history.r_hid} />
                  </td>
                  <td className='px-2 py-2'>
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