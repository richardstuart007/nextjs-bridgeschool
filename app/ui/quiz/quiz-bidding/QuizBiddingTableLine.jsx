//
//  Sub Components
//
import QuizBiddingTableLineCell from './QuizBiddingTableLineCell'
//...................................................................................
//.  Main Line
//...................................................................................
export default function QuizBiddingTableLine(props) {
  //
  //  Destructure props
  //
  const { round, roundCount } = props
  //
  //  round into Object
  //
  const roundBid = {
    north: null,
    east: null,
    south: null,
    west: null
  }
  if (round[0]) roundBid.north = round[0].bqid
  if (round[1]) roundBid.east = round[1].bqid
  if (round[2]) roundBid.south = round[2].bqid
  if (round[3]) roundBid.west = round[3].bqid
  //
  //  round into Object
  //
  const roundSuit = {
    north: null,
    east: null,
    south: null,
    west: null
  }
  if (round[0]) roundSuit.north = round[0].suit
  if (round[1]) roundSuit.east = round[1].suit
  if (round[2]) roundSuit.south = round[2].suit
  if (round[3]) roundSuit.west = round[3].suit
  //...................................................................................
  //.  Render the form
  //...................................................................................
  return (
    <tr key={roundCount}>
      <QuizBiddingTableLineCell bqid={roundBid.north} suit={roundSuit.north} />
      <QuizBiddingTableLineCell bqid={roundBid.east} suit={roundSuit.east} />
      <QuizBiddingTableLineCell bqid={roundBid.south} suit={roundSuit.south} />
      <QuizBiddingTableLineCell bqid={roundBid.west} suit={roundSuit.west} />
    </tr>
  )
}
