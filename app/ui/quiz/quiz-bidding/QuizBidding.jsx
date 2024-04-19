import QuizBiddingTableHeader from './QuizBiddingTableHeader'
import QuizBiddingTableLine from './QuizBiddingTableLine'
//...................................................................................
//.  Main Line
//...................................................................................
export default function QuizBidding({ question }) {
  //
  //  No Bidding, return
  //
  if (!question.qrounds) return null
  //
  //  Process each Round
  //
  const Rounds = question.qrounds
  let RoundCount = 0
  let roundsbidObjArray = []
  Rounds.forEach(round => {
    //
    //  Process each bqid for a round - Create roundBidsArray
    //
    let bidObjArray = []
    round.forEach(bqid => {
      //
      //  Fill bidObj (bqid/suit)
      //
      const bidObj = {
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
          bidObj.bqid = null
          bidObj.suit = null
          break
        //  Nothing
        case 'n':
          bidObj.bqid = null
          bidObj.suit = null
          break
        //  Nothing
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
    const objTemp = {
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
    <>
      <QuizBiddingTableHeader />
      {roundsbidObjArray.map(objTemp => (
        <QuizBiddingTableLine
          key={objTemp.roundCount}
          roundCount={objTemp.roundCount}
          round={objTemp.innerArray}
        />
      ))}
    </>
  )
}
