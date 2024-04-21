import QuizHandsTableLineCell from './QuizHandsTableLineCell'
interface handObj {
  rowCount: string
  position: string
  hand: string[]
}

interface QuizHandsTableLineProps {
  handObj: handObj
  key: string | number
}
//...................................................................................
//.  Main Line
//...................................................................................
export default function QuizHandsTableLine({ handObj, key }: QuizHandsTableLineProps): JSX.Element {
  //
  //  Destructure props
  //
  const { position, hand } = handObj
  //
  //  Strip 'n' and replace with null
  //
  for (let i = 0; i < 4; i++) {
    if (hand[i] === 'n' || hand[i] === 'N') hand[i] = ''
  }
  //...................................................................................
  //.  Render the form
  //...................................................................................
  return (
    <tr key={key}>
      <QuizHandsTableLineCell cellValue={position} />
      <QuizHandsTableLineCell cellValue={hand[0]} />
      <QuizHandsTableLineCell cellValue={hand[1]} />
      <QuizHandsTableLineCell cellValue={hand[2]} />
      <QuizHandsTableLineCell cellValue={hand[3]} />
    </tr>
  )
}
