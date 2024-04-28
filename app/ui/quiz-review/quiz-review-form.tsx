'use client'

import { useState } from 'react'
import { QuestionsTable } from '@/app/lib/definitions'
import QuizQuestion from '@/app/ui/quiz-question/quiz-question'
import QuizBidding from '@/app/ui/quiz-question/quiz-bidding/QuizBidding'
import QuizHands from '@/app/ui/quiz-question/quiz-hands/QuizHands'
import { QuizReviewNext, QuizReviewPrevious } from '@/app/ui/quiz-review/buttons'
import { useRouter } from 'next/navigation'

interface QuestionsFormProps {
  questions: QuestionsTable[]
}
//...................................................................................
//.  Main Line
//...................................................................................
export default function QuestionsForm(props: QuestionsFormProps): JSX.Element {
  //
  //  Go back
  //
  const router = useRouter()
  //
  //  Define the State variables
  //
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [question, setQuestion] = useState(props.questions[currentQuestionIndex])

  const handleNextQuestion = () => {
    const nextQuestionIndex = currentQuestionIndex + 1
    if (nextQuestionIndex < props.questions.length) {
      setCurrentQuestionIndex(nextQuestionIndex)
      setQuestion(props.questions[nextQuestionIndex])
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      const nextQuestionIndex = currentQuestionIndex - 1
      setCurrentQuestionIndex(nextQuestionIndex)
      setQuestion(props.questions[nextQuestionIndex])
    }
  }
  //...................................................................................
  //.  Render the form
  //...................................................................................
  return (
    <>
      <QuizQuestion question={question} quizQuestion={1} quizTotal={2} />
      <QuizBidding question={question} />
      <QuizHands question={question} />

      <div className='flex bg-gray-50 px-3 h-5'>
        {currentQuestionIndex > 0 ? (
          <QuizReviewPrevious onPreviousQuestion={handlePreviousQuestion} />
        ) : null}

        {currentQuestionIndex + 1 < props.questions.length ? (
          <QuizReviewNext onNextQuestion={handleNextQuestion} />
        ) : null}
      </div>
    </>
  )
}
