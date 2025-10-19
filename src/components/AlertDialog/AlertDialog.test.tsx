import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AlertDialog } from './AlertDialog'

jest.mock('../Button', () => ({
  Button: ({ text, onClick, color }: { text: string; onClick: () => void; color?: string }) => (
    <button onClick={onClick} data-testid={`button-${text.toLowerCase()}`} data-color={color}>
      {text}
    </button>
  ),
}))

describe(AlertDialog, () => {
  const defaultProps = {
    isOpen: true,
    title: 'Sample Title',
    message: 'Sample message content',
    onConfirm: jest.fn(),
    onCancel: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render when isOpen is true', () => {
    render(<AlertDialog {...defaultProps} />)
    
    expect(screen.getByText('Sample Title')).toBeInTheDocument()
    expect(screen.getByText('Sample message content')).toBeInTheDocument()
  })

  it('should NOT render when isOpen is false', () => {
    render(<AlertDialog {...defaultProps} isOpen={false} />)
    
    expect(screen.queryByText('Sample Title')).not.toBeInTheDocument()
    expect(screen.queryByText('Sample message content')).not.toBeInTheDocument()
  })

  it('should render with custom title and message', () => {
    render(
      <AlertDialog
        {...defaultProps}
        title="Custom Title"
        message="Custom message"
      />
    )
    
    expect(screen.getByText('Custom Title')).toBeInTheDocument()
    expect(screen.getByText('Custom message')).toBeInTheDocument()
  })

  it('should render both confirm and cancel buttons by default', () => {
    render(<AlertDialog {...defaultProps} />)
    
    expect(screen.getByTestId('button-common.cancel')).toBeInTheDocument()
    expect(screen.getByTestId('button-common.ok')).toBeInTheDocument()
  })

  it('should render only confirm button when hideCancel is true', () => {
    render(<AlertDialog {...defaultProps} hideCancel={true} />)
    
    expect(screen.queryByTestId('button-common.cancel')).not.toBeInTheDocument()
    expect(screen.getByTestId('button-common.ok')).toBeInTheDocument()
  })

  it('should use custom button text when provided', () => {
    render(
      <AlertDialog
        {...defaultProps}
        confirmText="Custom Confirm"
        cancelText="Custom Cancel"
      />
    )
    
    expect(screen.getByTestId('button-custom cancel')).toBeInTheDocument()
    expect(screen.getByTestId('button-custom confirm')).toBeInTheDocument()
  })

  it('should apply correct color to confirm button', () => {
    render(<AlertDialog {...defaultProps} confirmColor="danger" />)
    
    const confirmButton = screen.getByTestId('button-common.ok')
    expect(confirmButton).toHaveAttribute('data-color', 'danger')
  })

  it('should default to primary color for confirm button', () => {
    render(<AlertDialog {...defaultProps} />)
    
    const confirmButton = screen.getByTestId('button-common.ok')
    expect(confirmButton).toHaveAttribute('data-color', 'primary')
  })

  it('should call onConfirm when confirm button is clicked', async () => {
    const user = userEvent.setup()
    const onConfirm = jest.fn()
    
    render(<AlertDialog {...defaultProps} onConfirm={onConfirm} />)
    
    const confirmButton = screen.getByTestId('button-common.ok')
    await user.click(confirmButton)
    
    expect(onConfirm).toHaveBeenCalledTimes(1)
  })

  it('should call onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup()
    const onCancel = jest.fn()
    
    render(<AlertDialog {...defaultProps} onCancel={onCancel} />)
    
    const cancelButton = screen.getByTestId('button-common.cancel')
    await user.click(cancelButton)
    
    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('should call onCancel when clicking outside the dialog', async () => {
    const user = userEvent.setup()
    const onCancel = jest.fn()
    
    render(<AlertDialog {...defaultProps} onCancel={onCancel} />)
    
    const overlay = screen.getByRole('dialog').parentElement
    if (overlay) {
      await user.click(overlay)
      expect(onCancel).toHaveBeenCalledTimes(1)
    }
  })

  it('should not call onCancel when clicking inside the dialog', async () => {
    const user = userEvent.setup()
    const onCancel = jest.fn()
    
    render(<AlertDialog {...defaultProps} onCancel={onCancel} />)
    
    const dialog = screen.getByRole('dialog')
    await user.click(dialog)
    
    expect(onCancel).not.toHaveBeenCalled()
  })
})
