import QuizHandsTableHeader from './QuizHandsTableHeader'
import QuizHandsTableLine from './QuizHandsTableLine'
//...................................................................................
//.  Main Line
//...................................................................................
export default function QuizHands({ question }) {
  //
  //  No Hands
  //
  if (!question.qnorth && !question.qeast && !question.qsouth && !question.qwest) return null

  //
  //  Build HandObj Array - N/E/S/W
  //
  let HandObjArray = []
  let RowCount = 0
  //
  //  North
  //
  if (question.qnorth) {
    RowCount++
    const handObj = {
      rowCount: 'RowCount' + RowCount.toString(),
      position: 'North',
      hand: []
    }
    handObj.hand = [...question.qnorth]
    HandObjArray.push(handObj)
  }
  //
  //  East
  //
  if (question.qeast) {
    RowCount++
    const handObj = {
      rowCount: 'RowCount' + RowCount.toString(),
      position: 'East',
      hand: []
    }
    handObj.hand = [...question.qeast]
    HandObjArray.push(handObj)
  }
  //
  //  South
  //
  if (question.qsouth) {
    RowCount++
    const handObj = {
      rowCount: 'RowCount' + RowCount.toString(),
      position: 'South',
      hand: []
    }
    handObj.hand = [...question.qsouth]
    HandObjArray.push(handObj)
  }
  //
  //  West
  //
  if (question.qwest) {
    RowCount++
    const handObj = {
      rowCount: 'RowCount' + RowCount.toString(),
      position: 'West',
      hand: []
    }
    handObj.hand = [...question.qwest]
    HandObjArray.push(handObj)
  }
  //...................................................................................
  //.  Render the form
  //...................................................................................
  return (
    <>
      <QuizHandsTableHeader />
      {HandObjArray.map(handObj => (
        <QuizHandsTableLine key={handObj.rowCount} handObj={handObj} rowCount={handObj.rowCount} />
      ))}
    </>
  )
}
