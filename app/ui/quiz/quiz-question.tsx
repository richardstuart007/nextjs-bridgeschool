import { QuestionsTable } from '@/app/lib/definitions'

interface RadioGroupProps {
  question: QuestionsTable
  quizQuestion: number
  quizTotal: number
}

export default function QuizQuestion(props: RadioGroupProps): JSX.Element {
  //...................................................................................
  //.  Main Line
  //...................................................................................
  //
  //  Deconstruct params
  //
  const { question, quizQuestion, quizTotal = 0 } = props
  //
  //  Deconstruct row
  //
  const { qowner, qgroup, qqid } = question
  //
  //  Question Info
  //
  let QuestionInfo = `${qowner}/${qgroup} ${quizQuestion}/${quizTotal} (${qqid})`
  //...................................................................................
  //.  Render the form
  //...................................................................................
  return (
    <>
      <p>{QuestionInfo}</p>
    </>
  )
}
