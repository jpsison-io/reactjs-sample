import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '.'

describe(Button, () => {
  const defaultProps = {
    text: 'Sample Button',
    onClick: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render with default props', () => {
    render(<Button {...defaultProps} />)

    expect(screen.getByText('Sample Button')).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('should render with custom text', () => {
    render(<Button text="Custom Button Text" onClick={jest.fn()} />)
    
    expect(screen.getByText('Custom Button Text')).toBeInTheDocument()
  })

  it('should apply primary color by default', () => {
    render(<Button {...defaultProps} />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('btn')
    expect(button).toHaveClass('btn--primary')
  })

  it('should apply danger color when specified', () => {
    render(<Button {...defaultProps} color="danger" />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('btn')
    expect(button).toHaveClass('btn--danger')
  })

  it('should call onClick when button is clicked', async () => {
    const user = userEvent.setup()
    const onClick = jest.fn()
    
    render(<Button {...defaultProps} onClick={onClick} />)
    
    const button = screen.getByRole('button')
    await user.click(button)
    
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('should apply correct CSS classes for all color variants', () => {
    const { rerender } = render(<Button text="Primary" color="primary" onClick={jest.fn()} />)
    
    let button = screen.getByRole('button')
    expect(button).toHaveClass('btn--primary')
    
    rerender(<Button text="Danger" color="danger" onClick={jest.fn()} />)
    
    button = screen.getByRole('button')
    expect(button).toHaveClass('btn--danger')
  })

  it('should handle color prop changes', () => {
    const { rerender } = render(<Button text="Test" color="primary" onClick={jest.fn()} />)
    
    let button = screen.getByRole('button')
    expect(button).toHaveClass('btn--primary')
    expect(button).not.toHaveClass('btn--danger')
    
    rerender(<Button text="Test" color="danger" onClick={jest.fn()} />)
    
    button = screen.getByRole('button')
    expect(button).toHaveClass('btn--danger')
    expect(button).not.toHaveClass('btn--primary')
  })
})
