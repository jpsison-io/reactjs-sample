import React from 'react'
import './Button.css'

export type ButtonColor = 'primary' | 'danger' 

export interface ButtonProps {
  text: string
  color?: ButtonColor
  onClick?: () => void
}

export const Button: React.FC<ButtonProps> = ({
  text,
  color = 'primary',
  onClick,
}) => {
  const buttonClasses = [
    'btn',
    `btn--${color}`,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      className={buttonClasses}
      onClick={onClick}
    >
      {text}
    </button>
  )
}

export default Button
