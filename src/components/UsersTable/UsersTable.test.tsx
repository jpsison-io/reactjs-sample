import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { UsersTable } from './UsersTable'
import { User } from '../../types'

jest.mock('../Button', () => ({
  Button: ({ text, onClick, color }: { text: string; onClick: () => void; color?: string }) => (
    <button onClick={onClick} data-testid={`button-${text.toLowerCase()}`} data-color={color}>
      {text}
    </button>
  ),
}))

describe(UsersTable, () => {
  const mockUsers: User[] = [
    {
      id: 1,
      name: "Leanne Graham",
      username: "Bret",
      email: "Sincere@april.biz",
      address: {
        street: "Kulas Light",
        suite: "Apt. 556",
        city: "Gwenborough",
        zipcode: "92998-3874",
        geo: {
          lat: "-37.3159",
          lng: "81.1496"
        }
      },
      phone: "1-770-736-8031 x56442",
      website: "hildegard.org",
      company: {
        name: "Romaguera-Crona",
        catchPhrase: "Multi-layered client-server neural-net",
        bs: "harness real-time e-markets"
      }
    },
    {
      id: 2,
      name: "Ervin Howell",
      username: "Antonette",
      email: "Shanna@melissa.tv",
      address: {
        street: "Victor Plains",
        suite: "Suite 879",
        city: "Wisokyburgh",
        zipcode: "90566-7771",
        geo: {
          lat: "-43.9509",
          lng: "-34.4618"
        }
      },
      phone: "010-692-6593 x09125",
      website: "anastasia.net",
      company: {
        name: "Deckow-Crist",
        catchPhrase: "Proactive didactic contingency",
        bs: "synergize scalable supply-chains"
      }
    }
  ]

  const defaultProps = {
    users: mockUsers,
    loading: false,
    onDeleteUser: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render users data correctly', () => {
    render(<UsersTable {...defaultProps} />)
    
    // verify first user data set
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('Leanne Graham')).toBeInTheDocument()
    expect(screen.getByText('Bret')).toBeInTheDocument()
    expect(screen.getByText('Sincere@april.biz')).toBeInTheDocument()
    expect(screen.getByText('1-770-736-8031 x56442')).toBeInTheDocument()
    expect(screen.getByText('hildegard.org')).toBeInTheDocument()
    expect(screen.getByText('Gwenborough')).toBeInTheDocument()
    expect(screen.getByText('Romaguera-Crona')).toBeInTheDocument()
    
    // verify second user data set
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('Ervin Howell')).toBeInTheDocument()
    expect(screen.getByText('Antonette')).toBeInTheDocument()
    expect(screen.getByText('Shanna@melissa.tv')).toBeInTheDocument()
    expect(screen.getByText('010-692-6593 x09125')).toBeInTheDocument()
    expect(screen.getByText('anastasia.net')).toBeInTheDocument()
    expect(screen.getByText('Wisokyburgh')).toBeInTheDocument()
    expect(screen.getByText('Deckow-Crist')).toBeInTheDocument()
  })

  it('should render email links correctly', () => {
    render(<UsersTable {...defaultProps} />)
    
    const emailLinks = screen.getAllByRole('link')
    const emailLink = emailLinks.find(link => link.getAttribute('href') === 'mailto:Sincere@april.biz')
    
    expect(emailLink).toBeInTheDocument()
    expect(emailLink).toHaveAttribute('href', 'mailto:Sincere@april.biz')
  })

  it('should render website links correctly', () => {
    render(<UsersTable {...defaultProps} />)
    
    const websiteLinks = screen.getAllByRole('link')
    const websiteLink = websiteLinks.find(link => link.getAttribute('href') === 'https://hildegard.org')
    
    expect(websiteLink).toBeInTheDocument()
    expect(websiteLink).toHaveAttribute('href', 'https://hildegard.org')
  })

  it('should show loading state when loading is true', () => {
    render(<UsersTable {...defaultProps} loading={true} />)
    
    expect(screen.getByText('users.loadingUsers')).toBeInTheDocument()
    expect(screen.getByText('users.loadingUsers')).toHaveClass('loading-text')
    
    // should not show user data when loading
    expect(screen.queryByText('Leanne Graham')).not.toBeInTheDocument()
    expect(screen.queryByText('Ervin Howell')).not.toBeInTheDocument()
  })

  it('should not show loading state when loading is false', () => {
    render(<UsersTable {...defaultProps} loading={false} />)
    
    expect(screen.queryByText('users.loadingUsers')).not.toBeInTheDocument()
    expect(screen.getByText('Leanne Graham')).toBeInTheDocument()
  })

  it('should show empty state when no users and not loading', () => {
    render(<UsersTable {...defaultProps} users={[]} loading={false} />)
    
    expect(screen.getByText('users.noUsersAvailable')).toBeInTheDocument()
    expect(screen.getByText('users.noUsersAvailable')).toHaveClass('no-users')
    
    // should not show loading state
    expect(screen.queryByText('users.loadingUsers')).not.toBeInTheDocument()
  })

  it('should not show empty state when loading', () => {
    render(<UsersTable {...defaultProps} users={[]} loading={true} />)
    
    expect(screen.queryByText('users.noUsersAvailable')).not.toBeInTheDocument()
    expect(screen.getByText('users.loadingUsers')).toBeInTheDocument()
  })

  it('should render delete buttons when onDeleteUser is provided', () => {
    render(<UsersTable {...defaultProps} />)
    
    const deleteButtons = screen.getAllByTestId('button-common.delete')
    expect(deleteButtons).toHaveLength(2) // One for each user
    
    deleteButtons.forEach(button => {
      expect(button).toHaveAttribute('data-color', 'danger')
    })
  })

  it('should not render delete buttons when onDeleteUser is not provided', () => {
    render(<UsersTable {...defaultProps} onDeleteUser={undefined} />)
    
    expect(screen.queryByTestId('button-common.delete')).not.toBeInTheDocument()
  })

  it('should call onDeleteUser with correct user ID when delete button is clicked', async () => {
    const user = userEvent.setup()
    const onDeleteUser = jest.fn()
    
    render(<UsersTable {...defaultProps} onDeleteUser={onDeleteUser} />)
    
    const deleteButtons = screen.getAllByTestId('button-common.delete')
    await user.click(deleteButtons[0]) // click first user's delete button
    
    expect(onDeleteUser).toHaveBeenCalledTimes(1)
    expect(onDeleteUser).toHaveBeenCalledWith(1) // first user's id
  })

  it('should call onDeleteUser with correct user ID for each user', async () => {
    const user = userEvent.setup()
    const onDeleteUser = jest.fn()
    
    render(<UsersTable {...defaultProps} onDeleteUser={onDeleteUser} />)
    
    const deleteButtons = screen.getAllByTestId('button-common.delete')
    
    // click first user's delete button
    await user.click(deleteButtons[0])
    expect(onDeleteUser).toHaveBeenCalledWith(1)
    
    // click second user's delete button
    await user.click(deleteButtons[1])
    expect(onDeleteUser).toHaveBeenCalledWith(2)
  })

  it('should handle empty users array', () => {
    render(<UsersTable {...defaultProps} users={[]} />)
    
    expect(screen.getByText('users.noUsersAvailable')).toBeInTheDocument()
    expect(screen.queryByTestId('button-common.delete')).not.toBeInTheDocument()
  })
  
})
