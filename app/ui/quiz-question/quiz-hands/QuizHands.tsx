import QuizHandsTableHeader from './QuizHandsTableHeader'
import QuizHandsTableLine from './QuizHandsTableLine'
import { QuestionsTable } from '@/app/lib/definitions'

interface handObj {
  rowCount: string
  position: string
  hand: string[]
}

interface QuizHandsProps {
  question: QuestionsTable
}

export default function QuizHands({ question }: QuizHandsProps): JSX.Element | null {
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
    const handObj: handObj = {
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
    const handObj: handObj = {
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
    const handObj: handObj = {
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
    const handObj: handObj = {
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
    <div className='rounded-md bg-gray-50 p-4 md:p-6'>
      <p className='text-lg font-semibold text-left'>Hands</p>
      <table>
        <QuizHandsTableHeader />
        {HandObjArray.map(handObj => (
          <QuizHandsTableLine key={handObj.rowCount} handObj={handObj} />
        ))}
      </table>
    </div>
  )
}
