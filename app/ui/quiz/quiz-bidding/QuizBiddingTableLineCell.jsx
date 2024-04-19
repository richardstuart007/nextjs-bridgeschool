//
//  Libraries
//
import Image from 'next/image'
//...................................................................................
//.  Main Line
//...................................................................................
export default function QuizBiddingTableLineCell(props) {
  //
  //  Destructure props
  //
  const { bqid, suit } = props
  //...................................................................................
  //.  Render the form
  //...................................................................................
  return (
    <>
      <td className='whitespace-nowrap'>
        <div className='flex items-center justify-center'>
          {/*  Bid                                                                               */}
          {bqid}

          {/*  Suit Symbol                                                                               */}
          {suit !== null && (
            <div>
              {suit === 'S' ? (
                <Image src='/suits/spade.svg' width={15} height={15} alt='spade' />
              ) : suit === 'H' ? (
                <Image src='/suits/heart.svg' width={15} height={15} alt='heart' />
              ) : suit === 'D' ? (
                <Image src='/suits/diamond.svg' width={15} height={15} alt='diamond' />
              ) : suit === 'C' ? (
                <Image src='/suits/club.svg' width={15} height={15} alt='club' />
              ) : null}
            </div>
          )}
        </div>
      </td>
    </>
  )
}
