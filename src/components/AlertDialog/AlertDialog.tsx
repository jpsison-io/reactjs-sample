import React from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '../Button'
import './AlertDialog.css'

export interface AlertDialogProps {
  isOpen: boolean
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
  confirmText?: string
  cancelText?: string
  hideCancel?: boolean
  confirmColor?: 'primary' | 'danger'
}

export const AlertDialog: React.FC<AlertDialogProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  hideCancel = false,
  confirmText,
  cancelText,
  confirmColor = 'primary',
}) => {
  const { t } = useTranslation()
  
  // Use provided text or fallback to translations
  const finalConfirmText = confirmText || t('common.ok')
  const finalCancelText = cancelText || t('common.cancel')
  if (!isOpen) {
    return null
  }

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onCancel()
    }
  }

  return (
    <div className="alert-dialog-overlay" onClick={handleOverlayClick}>
      <div className="alert-dialog" role="dialog">
        <div className="alert-dialog-header">
          <h3 className="alert-dialog-title" >{title}</h3>
        </div>
        
        <div className="alert-dialog-body">
          <p className="alert-dialog-message">{message}</p>
        </div>
        
        <div className="alert-dialog-footer">
          {!hideCancel && (
            <Button
              text={finalCancelText}
              onClick={onCancel}
            />
          )}
          <Button
            text={finalConfirmText}
            color={confirmColor}
            onClick={onConfirm}
          />
        </div>
      </div>
    </div>
  )
}

export default AlertDialog
