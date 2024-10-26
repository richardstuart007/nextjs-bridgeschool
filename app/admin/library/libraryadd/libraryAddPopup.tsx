'use client'
import Popup from '@/app/ui/utils/popup'
import Form from '@/app/admin/library/libraryadd/libraryAdd'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export default function EditPopup({ isOpen, onClose }: Props) {
  //
  // Close the popup on success
  //
  const handleSuccess = () => {
    onClose()
  }
  return (
    <Popup isOpen={isOpen} onClose={onClose}>
      <Form onSuccess={handleSuccess} shouldCloseOnUpdate={true} />
    </Popup>
  )
}
