'use client'

import { useState } from 'react'
import { QuestionsTable } from '@/app/lib/definitions'
import QuizQuestion from '@/app/ui/quiz-question/quiz-question'
import QuizBidding from '@/app/ui/quiz-question/quiz-bidding/QuizBidding'
import QuizHands from '@/app/ui/quiz-question/quiz-hands/QuizHands'
import QuizChoice from './quiz-choice'
import { QuizSubmit } from '@/app/ui/quiz/buttons'
import { useRouter } from 'next/navigation'
import { writeUsershistory } from '@/app/lib/actions'
import type { NewUsershistoryTable, BSsessionTable } from '@/app/lib/definitions'
import { getSession_BS_session } from '@/app/lib/utilsClient'

interface QuestionsFormProps {
  questions: QuestionsTable[]
}
//...................................................................................
//.  Main Line
//...................................................................................
export default function QuestionsForm(props: QuestionsFormProps): JSX.Element {
  //
  //  Deconstruct props
  //
  const questions = props.questions
  const quizTotal = questions.length
  //
  //  Go back
  //
  const router = useRouter()
  //
  //  Define the State variables
  //
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [question, setQuestion] = useState(questions[currentQuestionIndex])
  const [answer, setAnswer] = useState<number[]>([])
  const [showSubmit, setShowSubmit] = useState(false)
  //...................................................................................
  //.  Next Question
  //...................................................................................
  function handleNextQuestion() {
    const nextQuestionIndex = currentQuestionIndex + 1
    if (nextQuestionIndex < questions.length) {
      setCurrentQuestionIndex(nextQuestionIndex)
      setQuestion(questions[nextQuestionIndex])
      return
    }
    //
    //  Quiz completed
    //
    handleQuizCompleted()
  }
  //...................................................................................
  //.  Quiz Completed
  //...................................................................................
  async function handleQuizCompleted() {
    //
    //  Initialise the results
    //
    let r_qid: number[] = []
    let r_points: number[] = []
    let r_totalpoints = 0
    let r_maxpoints = 0
    let r_correctpercent = 0
    //
    // Get the answered questions
    //
    const answeredQuestions = questions.slice(0, answer.length)
    //
    //  Loop through the answered questions
    //
    answeredQuestions.forEach((question, i) => {
      r_qid.push(question.qqid)

      const p = answer[i]
      const points = question.qpoints[p]
      if (points !== undefined) {
        r_points.push(points)
        r_totalpoints += points
      }
      //
      //  Max points
      //
      r_maxpoints += Math.max(...question.qpoints)
    })

    if (r_maxpoints !== 0) {
      r_correctpercent = Math.ceil((r_totalpoints * 100) / r_maxpoints)
    }
    //
    //  Get session info
    //
    const userSession: BSsessionTable | null = getSession_BS_session()
    if (!userSession) throw new Error('No user session found')
    //
    // Create a NewUsersHistoryTable object
    //
    const NewUsershistoryTable: NewUsershistoryTable = {
      r_datetime: new Date().toISOString().replace('T', ' ').replace('Z', '').substring(0, 23),
      r_owner: question.qowner,
      r_group: question.qgroup,
      r_questions: answer.length,
      r_qid: r_qid,
      r_ans: answer,
      r_uid: userSession.usid,
      r_points: r_points,
      r_maxpoints: r_maxpoints,
      r_totalpoints: r_totalpoints,
      r_correctpercent: r_correctpercent,
      r_gid: question.qgid,
      r_sid: userSession.usid
    }
    const historyRecord = await writeUsershistory(NewUsershistoryTable)
    //
    //  Go to the quiz review page
    //
    const { r_hid } = historyRecord
    router.push(`/dashboard/quiz-review/${r_hid}/quiz-review`)
  }
  //...................................................................................
  //.  Render the form
  //...................................................................................
  return (
    <>
      <QuizQuestion question={question} quizQuestion={1} quizTotal={quizTotal} />
      <QuizBidding question={question} />
      <QuizHands question={question} />
      <QuizChoice question={question} setAnswer={setAnswer} setShowSubmit={setShowSubmit} />
      {showSubmit ? (
        <div className='whitespace-nowrap px-3 h-5'>
          <QuizSubmit onNextQuestion={handleNextQuestion} />
        </div>
      ) : null}
    </>
  )
}
