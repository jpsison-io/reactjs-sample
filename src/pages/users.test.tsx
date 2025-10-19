import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import UsersPage from './users'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { AlertDialogProps, ButtonProps, UsersTableProps } from '@/components'
import { mockUsers } from '@/api/mocks/users'

jest.mock('@/hooks/redux', () => ({
  useAppDispatch: jest.fn(() => jest.fn()),
  useAppSelector: jest.fn(),
}))

jest.mock('@/features/users/userSlice', () => ({
  fetchUsers: jest.fn(() => ({ type: 'users/fetchUsers' })),
  clearUsers: jest.fn(() => ({ type: 'users/clearUsers' })),
  deleteUser: jest.fn((id: number) => ({ type: 'users/deleteUser', payload: id })),
}))

const mockButton = jest.fn()
const mockUsersTable = jest.fn()
const mockAlertDialog = jest.fn()

jest.mock('@/components', () => ({
  Button: (props: ButtonProps) => {
    mockButton(props)
    return <button onClick={props.onClick} data-testid={`button-${props.text.toLowerCase().replace(/\s+/g, '-')}`}>{props.text}</button>
  },
  UsersTable: (props: UsersTableProps) => {
    mockUsersTable(props)
    return <div data-testid="users-table">UsersTable Component</div>
  },
  AlertDialog: (props: AlertDialogProps) => {
    mockAlertDialog(props)
    return props.isOpen ? <div data-testid="alert-dialog">AlertDialog Component</div> : null
  },
}))

const mockDispatch = jest.fn()
const mockUseAppSelector = useAppSelector as jest.MockedFunction<typeof useAppSelector>

describe(UsersPage, () => {
  const testUsers = mockUsers.slice(0, 2)

  beforeEach(() => {
    jest.clearAllMocks()

    mockButton.mockClear()
    mockUsersTable.mockClear()
    mockAlertDialog.mockClear()
    
    mockUseAppSelector.mockReturnValue({
      users: [],
      loading: false,
    });

    (useAppDispatch as jest.MockedFunction<typeof useAppDispatch>).mockReturnValue(mockDispatch)
  })

  it('should render the page title', () => {
    render(<UsersPage />)
    
    expect(screen.getByText('users.title')).toBeInTheDocument()
  })

  it('should dispatch fetchUsers on mount', () => {
    render(<UsersPage />)
    
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'users/fetchUsers' })
  })

  it('should render fetch users button with correct props when not loading', () => {
    mockUseAppSelector.mockReturnValue({
      users: [],
      loading: false,
    })
    
    render(<UsersPage />)
    
    expect(mockButton).toHaveBeenCalledWith(
      expect.objectContaining({
        text: 'users.fetchUsers',
        color: 'primary'
      })
    )
  })

  it('should render loading button when loading', () => {
    mockUseAppSelector.mockReturnValue({
      users: [],
      loading: true,
    })
    
    render(<UsersPage />)
    
    expect(mockButton).toHaveBeenCalledWith(
      expect.objectContaining({
        text: 'common.loading',
        color: 'primary'
      })
    )
  })

  it('should render clear users button with correct props', () => {
    render(<UsersPage />)
    
    expect(mockButton).toHaveBeenCalledWith(
      expect.objectContaining({
        text: 'users.clearUsers',
        color: 'danger'
      })
    )
  })

  it('should pass correct props to UsersTable', () => {
    mockUseAppSelector.mockReturnValue({
      users: testUsers,
      loading: false,
    })
    
    render(<UsersPage />)
    
    expect(mockUsersTable).toHaveBeenCalledWith({
      users: testUsers,
      loading: false,
      onDeleteUser: expect.any(Function)
    })
  })

  it('should dispatch fetchUsers when fetch button is clicked and no users exist', async () => {
    const user = userEvent.setup()
    mockUseAppSelector.mockReturnValue({
      users: [],
      loading: false,
    })
    
    render(<UsersPage />)
    
    await user.click(screen.getByTestId('button-users.fetchusers'))
    
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'users/fetchUsers' })
  })

  it('should show warning dialog when fetch button is clicked and users exist', async () => {
    const user = userEvent.setup()
    mockUseAppSelector.mockReturnValue({
      users: testUsers,
      loading: false,
    })
    
    render(<UsersPage />)
    
    await user.click(screen.getByTestId('button-users.fetchusers'))
    
    expect(mockAlertDialog).toHaveBeenCalledWith(
      expect.objectContaining({
        isOpen: true,
        title: 'common.warning',
        message: 'users.warningMessage',
        hideCancel: true
      })
    )
  })

  it('should dispatch clearUsers when clear button is clicked', async () => {
    const user = userEvent.setup()
    mockUseAppSelector.mockReturnValue({
      users: testUsers,
      loading: false,
    })
    
    render(<UsersPage />)
    
    await user.click(screen.getByTestId('button-users.clearusers'))
    
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'users/clearUsers' })
  })

  it('should show delete confirmation dialog when delete user handler is called', () => {
    mockUseAppSelector.mockReturnValue({
      users: testUsers,
      loading: false,
    })
    
    render(<UsersPage />)
    
    const usersTableProps = mockUsersTable.mock.calls[0][0] as UsersTableProps
    
    act(() => {
      usersTableProps.onDeleteUser?.(1)
    })
    
    const lastAlertCall = mockAlertDialog.mock.calls[mockAlertDialog.mock.calls.length - 1][0]
    expect(lastAlertCall).toMatchObject({
      isOpen: true,
      title: 'users.deleteUser',
      message: 'users.deleteConfirmMessage',
      confirmText: 'common.delete',
      cancelText: 'common.cancel',
      confirmColor: 'danger'
    })
  })

  it('should dispatch deleteUser when delete confirmation is confirmed', () => {
    mockUseAppSelector.mockReturnValue({
      users: testUsers,
      loading: false,
    })
    
    render(<UsersPage />)
    
    const usersTableProps = mockUsersTable.mock.calls[0][0] as UsersTableProps
    
    act(() => {
      usersTableProps.onDeleteUser?.(1)
    })
    
    const deleteDialogProps = mockAlertDialog.mock.calls[mockAlertDialog.mock.calls.length - 1][0] as AlertDialogProps
    
    act(() => {
      deleteDialogProps.onConfirm?.()
    })
    
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'users/deleteUser', payload: 1 })
    expect(mockDispatch).toHaveBeenCalledTimes(2)
  })

  it('should close delete confirmation dialog when cancel is clicked', () => {
    mockUseAppSelector.mockReturnValue({
      users: testUsers,
      loading: false,
    })
    
    render(<UsersPage />)
    
    const usersTableProps = mockUsersTable.mock.calls[0][0] as UsersTableProps
    
    act(() => {
      usersTableProps.onDeleteUser?.(1)
    })
    
    const deleteDialogProps = mockAlertDialog.mock.calls[mockAlertDialog.mock.calls.length - 1][0] as AlertDialogProps
    
    act(() => {
      deleteDialogProps.onCancel?.()
    })
    
    const lastAlertCall = mockAlertDialog.mock.calls[mockAlertDialog.mock.calls.length - 1][0] as AlertDialogProps
    expect(lastAlertCall.isOpen).toBe(false)
  })

  it('should close warning dialog when OK is clicked', () => {
    mockUseAppSelector.mockReturnValue({
      users: testUsers,
      loading: false,
    })
    
    render(<UsersPage />)
    
    const fetchButtonProps = mockButton.mock.calls.find(call => 
      call[0].text === 'users.fetchUsers'
    )?.[0] as ButtonProps
    
    act(() => {
      fetchButtonProps?.onClick?.()
    })
    
    const warningDialogProps = mockAlertDialog.mock.calls[mockAlertDialog.mock.calls.length - 1][0] as AlertDialogProps 
    
    act(() => {
      warningDialogProps.onConfirm?.()
    })
    
    const lastAlertCall = mockAlertDialog.mock.calls[mockAlertDialog.mock.calls.length - 1][0] as AlertDialogProps
    expect(lastAlertCall.isOpen).toBe(false)
  })

  it('should show users count when users are available', () => {
    mockUseAppSelector.mockReturnValue({
      users: testUsers,
      loading: false,
    })
    
    render(<UsersPage />)
    
    expect(screen.getByText('users.usersAvailable')).toBeInTheDocument()
  })

  it('should not show users count when loading', () => {
    mockUseAppSelector.mockReturnValue({
      users: testUsers,
      loading: true,
    })
    
    render(<UsersPage />)
    
    expect(screen.queryByText('users.usersAvailable')).not.toBeInTheDocument()
  })

  it('should handle empty users array', () => {
    mockUseAppSelector.mockReturnValue({
      users: [],
      loading: false,
    })
    
    render(<UsersPage />)
    
    expect(screen.getByText('users.usersAvailable')).toBeInTheDocument()
  })
})