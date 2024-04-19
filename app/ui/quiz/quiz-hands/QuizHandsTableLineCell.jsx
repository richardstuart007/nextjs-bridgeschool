//...................................................................................
//.  Main Line
//...................................................................................
export default function QuizHandsTableLineCell(props) {
  //
  //  Destructure props
  //
  const { cellValue } = props
  //...................................................................................
  //.  Render the form
  //...................................................................................
  return (
    <>
      <td className='whitespace-nowrap'>
        <div className='flex items-center justify-center'>{cellValue}</div>
      </td>
    </>
  )
}
