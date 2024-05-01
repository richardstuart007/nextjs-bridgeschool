'use client'

import { useState } from 'react'
import { QuestionsTable, UsershistoryTable } from '@/app/lib/definitions'
import QuizQuestion from '@/app/ui/quiz-question/quiz-question'
import QuizBidding from '@/app/ui/quiz-question/quiz-bidding/QuizBidding'
import QuizHands from '@/app/ui/quiz-question/quiz-hands/QuizHands'
import { QuizReviewNext, QuizReviewPrevious } from '@/app/ui/quiz-review/buttons'
import QuizReviewChoice from './quiz-review-choice'

interface QuestionsFormProps {
  history: UsershistoryTable
  questions: QuestionsTable[]
}
//...................................................................................
//.  Main Line
//...................................................................................
export default function QuestionsForm(props: QuestionsFormProps): JSX.Element {
  const { questions, history } = props
  const r_ans = history.r_ans
  const quizTotal = r_ans.length
  //
  //  Define the State variables
  //
  const [index, setIndex] = useState(0)
  const [question, setQuestion] = useState(questions[index])
  const [ans, setAns] = useState(r_ans[index])

  const handleNext = () => {
    const next = index + 1
    if (next < questions.length) {
      setIndex(next)
      setQuestion(questions[next])
      setAns(r_ans[next])
    }
  }

  const handlePrevious = () => {
    if (index > 0) {
      const next = index - 1
      setIndex(next)
      setQuestion(questions[next])
      setAns(r_ans[next])
    }
  }
  //...................................................................................
  //.  Render the form
  //...................................................................................
  return (
    <>
      <QuizQuestion question={question} quizQuestion={index + 1} quizTotal={quizTotal} />
      <QuizBidding question={question} />
      <QuizHands question={question} />
      <QuizReviewChoice question={question} correctAnswer={0} selectedAnswer={ans} />

      <div className='flex bg-gray-50 px-3 h-5'>
        {index > 0 ? <QuizReviewPrevious onPreviousQuestion={handlePrevious} /> : null}
        {index + 1 < questions.length ? <QuizReviewNext onNextQuestion={handleNext} /> : null}
      </div>
    </>
  )
}
