'use client'
import Popup from '@/app/ui/utils/popup'
import Form from '@/app/admin/users/userEdit'
import { UsersTable } from '@/app/lib/definitions'

interface UserEditProps {
  userRecord: UsersTable | null
  isOpen: boolean
  onClose: () => void
}

export default function UserEditPopup({ userRecord, isOpen, onClose }: UserEditProps) {
  return (
    <Popup isOpen={isOpen} onClose={onClose}>
      {userRecord && <Form UserRecord={userRecord} />}
    </Popup>
  )
}
