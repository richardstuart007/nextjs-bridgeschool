//
//  Sub Components
//
import React from 'react'
import QuizHandsTableLineCell from './QuizHandsTableLineCell'

export default function QuizHandsTableLine(props) {
  //
  //  Destructure props
  //
  const { handObj, rowCount } = props
  const { position, hand } = handObj
  //
  //  Strip 'n' and replace with null
  //
  for (let i = 0; i < 4; i++) {
    if (hand[i] === 'n' || hand[i] === 'N') hand[i] = null
  }
  //...................................................................................
  //.  Render the form
  //...................................................................................
  return (
    <tr key={rowCount}>
      <QuizHandsTableLineCell cellValue={position} />
      <QuizHandsTableLineCell cellValue={hand[0]} />
      <QuizHandsTableLineCell cellValue={hand[1]} />
      <QuizHandsTableLineCell cellValue={hand[2]} />
      <QuizHandsTableLineCell cellValue={hand[3]} />
    </tr>
  )
}
