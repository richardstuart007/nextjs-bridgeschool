'use client'
//
//  Libraries
//
import { useState } from 'react'
import { QuestionsTable } from '@/app/lib/definitions'
import QuizQuestion from './quiz-question'
import QuizBidding from './quiz-bidding/QuizBidding'
import QuizHands from './quiz-hands/QuizHands'
import QuizChoice from './quiz-choice'
import { QuizSubmit } from '@/app/ui/quiz/buttons'

interface QuestionsFormProps {
  questions: QuestionsTable[]
}
//...................................................................................
//.  Main Line
//...................................................................................
export default function QuestionsForm(props: QuestionsFormProps): JSX.Element {
  //
  //  Define the State variables
  //
  const [question, setquestion] = useState(props.questions[2])
  const [value, setValue] = useState(0)
  const [id, setId] = useState('')
  const [showSubmit, setShowSubmit] = useState(false)
  //...................................................................................
  //.  Render the form
  //...................................................................................
  console.log('showSubmit', showSubmit)
  return (
    <>
      <div className='rounded-md bg-gray-50 p-4 md:p-6'>
        <p>id {question.qqid}</p>
      </div>
      <div className='rounded-md bg-gray-50 p-4 md:p-6'>
        <p>owner {question.qowner}</p>
      </div>
      <div className='rounded-md bg-gray-50 p-4 md:p-6'>
        <p>group {question.qgroup}</p>
      </div>
      <QuizQuestion question={question} quizQuestion={1} quizTotal={2} />
      <QuizBidding question={question} />
      <QuizHands question={question} />
      <QuizChoice
        question={question}
        setValue={setValue}
        setId={setId}
        setShowSubmit={setShowSubmit}
      />

      {showSubmit ? (
        <div className='whitespace-nowrap px-3 h-5'>
          <QuizSubmit />
        </div>
      ) : null}
    </>
  )
}
