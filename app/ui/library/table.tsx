import { BookView, BookQuiz } from '@/app/ui/library/buttons'
import { fetchFilteredLibrary } from '@/app/lib/data'

export default async function LibraryTable({
  query,
  currentPage
}: {
  query: string
  currentPage: number
}) {
  const library = await fetchFilteredLibrary(query, currentPage)

  return (
    <div className='mt-2 md:mt-6 flow-root'>
      <div className='inline-block min-w-full align-middle'>
        <div className='rounded-lg bg-gray-50 p-2 md:pt-0'>
          <table className='min-w-full text-gray-900 table-fixed'>
            <thead className='rounded-lg text-left  font-normal text-xs md:text-sm'>
              <tr>
                <th scope='col' className='px-2 py-2 font-medium text-left'>
                  Description
                </th>
                <th scope='col' className='px-2 py-2 font-medium text-centre'>
                  View
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
              {library?.map(library => (
                <tr
                  key={library.lrlid}
                  className='w-full border-b py-2 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg'
                >
                  <td className='px-2 py-1 text-xs md:text-sm'>{library.lrdesc}</td>
                  <td className='px-2 h-5 text-centre'>
                    <BookView lrtype={library.lrtype} lrlink={library.lrlink} />
                  </td>
                  <td className='px-2 py-1 text-xs md:text-sm hidden md:table-cell'>
                    {library.ogcntquestions}
                  </td>
                  <td className='px-2 text-centre'>
                    {library.ogcntquestions > 0 ? <BookQuiz lrgid={library.lrgid} /> : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/*--------------------------------------------------------------*/}
        </div>
      </div>
    </div>
  )
}
