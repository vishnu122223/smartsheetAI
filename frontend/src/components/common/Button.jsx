import React from 'react';

const Button = ({
  children,
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  variant = 'primary',
  size = 'md',
}) => {
  const variantStyles = {
    primary: 'btn-primary',
    secondary: 'btn-ghost',
    outline: 'btn-ghost',
    danger: 'btn-danger',
  };

  const sizeStyles = {
    sm: 'btn-sm',
    md: '',
    lg: 'btn-lg',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={['btn', variantStyles[variant] || '', sizeStyles[size] || '', className]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </button>
  );
};

export default Button;
