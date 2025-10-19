import React from 'react'
import { useTranslation } from 'react-i18next'
import { User } from '../../types'
import { Button } from '../Button'
import './UsersTable.css'

export interface UsersTableProps {
  users: User[]
  loading: boolean
  onDeleteUser?: (userId: number) => void
  className?: string
}

export const UsersTable: React.FC<UsersTableProps> = ({
  users,
  loading,
  onDeleteUser,
  className = '',
}) => {
  const { t } = useTranslation()
  const tableClasses = [
    'users-table',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    
    <div className="table-container">
      <table className={tableClasses}>
        <thead>
          <tr>
            <th>{t('table.id')}</th>
            <th>{t('table.name')}</th>
            <th>{t('table.username')}</th>
            <th>{t('table.email')}</th>
            <th>{t('table.phone')}</th>
            <th>{t('table.website')}</th>
            <th>{t('table.city')}</th>
            <th>{t('table.company')}</th>
            <th>{t('table.actions')}</th>
          </tr>
        </thead>
        <tbody>
          {!loading && users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.username}</td>
              <td>
                <a href={`mailto:${user.email}`} rel="noreferrer">
                  {user.email}
                </a>
              </td>
              <td>{user.phone}</td>
              <td>
                <a 
                  href={`https://${user.website}`} 
                  target="_blank" 
                  rel="noreferrer"
                >
                  {user.website}
                </a>
              </td>
              <td>{user.address.city}</td>
              <td>{user.company.name}</td>
              <td className="actions-cell">
                {onDeleteUser && (
                  <Button
                    text={t('common.delete')}
                    color="danger"
                    onClick={() => onDeleteUser(user.id)}
                  />
                )}
              </td>
            </tr>
          ))}
          {!loading && users.length === 0 && (
            <tr>
              <td colSpan={9} className="no-users">{t('users.noUsersAvailable')}</td>
            </tr>
          )}
          {loading && (
            <tr>
              <td colSpan={9}>
                <div className="loading-container">
                  <div className="loading-spinner"></div>
                  <div className="loading-text">{t('users.loadingUsers')}</div>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default UsersTable
