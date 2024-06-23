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
export default function ReviewForm(props: QuestionsFormProps): JSX.Element {
  const { questions, history } = props
  const r_ans = history.r_ans
  const r_qid = history.r_qid
  const r_correctpercent = history.r_correctpercent
  const quizTotal = r_ans.length
  const questionIndex = questions.findIndex(q => q.qqid === r_qid[0])
  //
  //  Define the State variables
  //
  const [index, setIndex] = useState(0)
  const [question, setQuestion] = useState(questions[questionIndex])
  const [ans, setAns] = useState(r_ans[index])

  const handleNext = () => {
    const next = index + 1
    if (next < r_qid.length) {
      setIndex(next)
      const questionIndex = questions.findIndex(q => q.qqid === r_qid[next])
      setQuestion(questions[questionIndex])
      setAns(r_ans[next])
    }
  }
  const handlePrevious = () => {
    if (index > 0) {
      const next = index - 1
      setIndex(next)
      const questionIndex = questions.findIndex(q => q.qqid === r_qid[next])
      setQuestion(questions[questionIndex])
      setAns(r_ans[next])
    }
  }
  //...................................................................................
  //.  Render the form
  //...................................................................................
  return (
    <>
      <div className='rounded-md bg-gray-50 p-1 md:p-2'>
        <p className='text-lg font-semibold text-left'>Quiz Result {r_correctpercent}%</p>
      </div>
      <QuizQuestion question={question} quizQuestion={index + 1} quizTotal={quizTotal} />
      <QuizBidding question={question} />
      <QuizHands question={question} />
      <QuizReviewChoice question={question} correctAnswer={0} selectedAnswer={ans} />

      <div className='flex bg-gray-50 px-3 h-5'>
        {index > 0 ? <QuizReviewPrevious onPreviousQuestion={handlePrevious} /> : null}
        {index + 1 < r_ans.length ? <QuizReviewNext onNextQuestion={handleNext} /> : null}
      </div>
    </>
  )
}
