import QuizBiddingTableLineCell from './QuizBiddingTableLineCell'

interface BidObj {
  bqid: string | null
  suit: string | null
}

interface RoundObj {
  roundCount: string
  innerArray: BidObj[]
}

interface QuizBiddingTableLineProps {
  round: RoundObj
  key: string | number
}

//...................................................................................
//.  Main Line
//...................................................................................
export default function QuizBiddingTableLine(props: QuizBiddingTableLineProps): JSX.Element {
  const { round, key } = props
  //
  //  round into Object
  //
  const roundBid = {
    north: null as string | null,
    east: null as string | null,
    south: null as string | null,
    west: null as string | null
  }
  if (round.innerArray[0]) roundBid.north = round.innerArray[0].bqid
  if (round.innerArray[1]) roundBid.east = round.innerArray[1].bqid
  if (round.innerArray[2]) roundBid.south = round.innerArray[2].bqid
  if (round.innerArray[3]) roundBid.west = round.innerArray[3].bqid
  //
  //  round into Object
  //
  const roundSuit = {
    north: null as string | null,
    east: null as string | null,
    south: null as string | null,
    west: null as string | null
  }
  if (round.innerArray[0]) roundSuit.north = round.innerArray[0].suit
  if (round.innerArray[1]) roundSuit.east = round.innerArray[1].suit
  if (round.innerArray[2]) roundSuit.south = round.innerArray[2].suit
  if (round.innerArray[3]) roundSuit.west = round.innerArray[3].suit
  //...................................................................................
  //.  Render the form
  //...................................................................................
  return (
    <tr key={key}>
      <QuizBiddingTableLineCell bqid={roundBid.north} suit={roundSuit.north} />
      <QuizBiddingTableLineCell bqid={roundBid.east} suit={roundSuit.east} />
      <QuizBiddingTableLineCell bqid={roundBid.south} suit={roundSuit.south} />
      <QuizBiddingTableLineCell bqid={roundBid.west} suit={roundSuit.west} />
    </tr>
  )
}
