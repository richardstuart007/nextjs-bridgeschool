//...................................................................................
//.  Main Line
//...................................................................................
export default function QuizBiddingTableHeader() {
  //...................................................................................
  //.  Render the form
  //...................................................................................
  return (
    <thead className='rounded-lg text-left text-sm font-normal'>
      <tr>
        <th scope='col' className='px-4  font-medium'>
          North
        </th>
        <th scope='col' className='px-4  font-medium'>
          East
        </th>
        <th scope='col' className='px-4  font-medium'>
          South
        </th>
        <th scope='col' className='px-4  font-medium'>
          West
        </th>
      </tr>
    </thead>
  )
}
