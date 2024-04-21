import QuizBiddingTableHeader from './QuizBiddingTableHeader'
import QuizBiddingTableLine from './QuizBiddingTableLine'
import { QuestionsTable } from '@/app/lib/definitions'

interface BidObj {
  bqid: string | null
  suit: string | null
}

interface RoundObj {
  roundCount: string
  innerArray: BidObj[]
}

interface QuizBiddingProps {
  question: QuestionsTable
}

export default function QuizBidding({ question }: QuizBiddingProps): JSX.Element | null {
  //
  //  No Bidding, return
  //
  if (!question.qrounds) return null
  //
  //  Process each Round
  //
  const Rounds = question.qrounds
  let RoundCount = 0
  let roundsbidObjArray: RoundObj[] = []
  Rounds.forEach(round => {
    //
    //  Process each bqid for a round - Create roundBidsArray
    //
    let bidObjArray: BidObj[] = []
    round.forEach(bqid => {
      //
      //  Fill bidObj (bqid/suit)
      //
      const bidObj: BidObj = {
        bqid: '',
        suit: ''
      }
      const level = bqid.substr(0, 1)
      switch (level) {
        // Pass
        case 'P':
          bidObj.bqid = 'Pass'
          bidObj.suit = null
          break
        // Question
        case '?':
          bidObj.bqid = bqid
          bidObj.suit = null
          break
        // Double
        case 'X':
          bidObj.bqid = bqid
          bidObj.suit = null
          break
        //  Nothing
        case ' ':
        case 'n':
        case 'N':
          bidObj.bqid = null
          bidObj.suit = null
          break
        default:
          //  No Trump
          if (bqid.substr(1, 1) === 'N') {
            bidObj.bqid = bqid
            bidObj.suit = null
          }
          //  Suit
          else {
            bidObj.bqid = level
            bidObj.suit = bqid.substr(1, 1)
          }
          break
      }
      //
      //  Load bidObj to bidObjArray
      //
      bidObjArray.push(bidObj)
    })
    //
    //  Prefix bidObj with round number
    //
    const objTemp: RoundObj = {
      roundCount: '',
      innerArray: []
    }
    RoundCount++
    objTemp.roundCount = 'Round' + RoundCount.toString()
    objTemp.innerArray = bidObjArray
    //
    //  Load to all rounds (bidObj)
    //
    roundsbidObjArray.push(objTemp)
  })
  //...................................................................................
  //.  Render the form
  //...................................................................................
  return (
    <div className='rounded-md bg-gray-50 p-4 md:p-6'>
      <p className='text-lg font-semibold text-left'>Bidding</p>
      <table>
        <QuizBiddingTableHeader />
        {roundsbidObjArray.map(objTemp => (
          <QuizBiddingTableLine key={objTemp.roundCount} round={objTemp} />
        ))}
      </table>
    </div>
  )
}
