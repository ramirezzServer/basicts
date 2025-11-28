import React from 'react'

type ToastProps = {
  message: string | null
  onClose: () => void
}

const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  if (!message) return null

  return (
    <div className="toast" onClick={onClose}>
      {message}
    </div>
  )
}

export default Toast
