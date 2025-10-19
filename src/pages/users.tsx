import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { fetchUsers, clearUsers, deleteUser } from '@/features/users/userSlice'
import './users.css'
import { Button, UsersTable, AlertDialog } from '@/components'

function UsersPage() {
  const dispatch = useAppDispatch()
  const { users, loading } = useAppSelector((state) => state.users)
  const { t } = useTranslation()
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean
    userId: number | null
    userName: string
  }>({
    isOpen: false,
    userId: null,
    userName: '',
  })

  const [alertDialog, setAlertDialog] = useState<{
    isOpen: boolean
  }>({
    isOpen: false,
  })

  useEffect(() => {
    dispatch(fetchUsers())
  }, [dispatch])

  const handleClick = () => {
    if (users.length === 0) {
      dispatch(fetchUsers())
    } else {
      setAlertDialog({
        isOpen: true
      })
    }
  }

  const handleClear = () => {
    dispatch(clearUsers())
  }

  const handleDeleteUser = (userId: number) => {
    const user = users.find(u => u.id === userId)
    if (user) {
      setConfirmDialog({
        isOpen: true,
        userId: userId,
        userName: user.name,
      })
    }
  }

  const handleConfirmDelete = () => {
    if (confirmDialog.userId) {
      dispatch(deleteUser(confirmDialog.userId))
      setConfirmDialog({
        isOpen: false,
        userId: null,
        userName: '',
      })
    }
  }

  const handleCancelDelete = () => {
    setConfirmDialog({
      isOpen: false,
      userId: null,
      userName: '',
    })
  }

  const handleAlert = () => {
    setAlertDialog({
      isOpen: false,
    })
  }

  return (
    <div className="app">
      <h1>{t('users.title')}</h1>

      <div className="button-container">
        <Button 
            text={loading ? t('common.loading') : t('users.fetchUsers')} 
            color="primary" 
            onClick={handleClick} 
            />
            <Button text={t('users.clearUsers')} color="danger" onClick={handleClear} />
        </div>
      <UsersTable users={users} loading={loading} onDeleteUser={handleDeleteUser} />
      { !loading && (<h4>{t('users.usersAvailable', { count: users.length })}</h4>) }
      
      <AlertDialog
        isOpen={alertDialog.isOpen}
        title={t('common.warning')}
        message={t('users.warningMessage')}
        onConfirm={handleAlert}
        onCancel={handleAlert}
        hideCancel={true}
      />

      <AlertDialog
        isOpen={confirmDialog.isOpen}
        title={t('users.deleteUser')}
        message={t('users.deleteConfirmMessage', { userName: confirmDialog.userName })}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        confirmText={t('common.delete')}
        cancelText={t('common.cancel')}
        confirmColor="danger"
      />
    </div>
  )
}

export default UsersPage