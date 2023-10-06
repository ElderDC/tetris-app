import React from 'react';
import classNames from 'classnames';
import { Icon, Ripple } from '@/components/ui/atoms';

type Handler = (event: React.MouseEvent) => void;

type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps {
  block?: boolean;
  children?: undefined | React.ReactNode | React.ReactNode[];
  color?: string;
  rounded?: boolean;
  className?: string;
  disabled?: boolean;
  href?: string;
  ghost?: boolean;
  loading?: boolean;
  outlined?: boolean;
  size?: ButtonSize;
  style?: React.CSSProperties;
  icon?: boolean;
  text?: boolean;
  target?: string;
  type?: 'button' | 'submit' | 'reset' | undefined;
  onClick?: Handler;
  onDoubleClick?: Handler;
  onMouseDown?: Handler;
  onMouseUp?: Handler;
}

const noop = (): false => {
  return false;
};

const sizeOptions: Record<ButtonSize, string> = {
  xs: 'btn-xs',
  sm: 'btn-sm',
  md: 'btn-md',
  lg: 'btn-lg',
  xl: 'btn-xl',
};

const Button = React.forwardRef(function Button(props: ButtonProps, ref) {
  const {
    block = false,
    children = '',
    color,
    rounded,
    className,
    disabled = false,
    href,
    ghost = false,
    loading = false,
    outlined = false,
    size = 'md',
    style,
    icon = false,
    text = false,
    target,
    type = 'button',
    onClick = noop,
    onDoubleClick = noop,
    onMouseDown = noop,
    onMouseUp = noop,
  } = props;

  const getButtonSize = (size: ButtonSize): string => {
    return sizeOptions[size];
  };
  const handleClick = (event: React.MouseEvent): void => {
    if (disabled) return;
    onClick(event);
  };
  const handleDoubleClick = (event: React.MouseEvent): void => {
    if (disabled) return;
    onDoubleClick(event);
  };
  const handleMouseDown = (event: React.MouseEvent): void => {
    if (disabled) return;
    onMouseDown(event);
  };
  const handleMouseUp = (event: React.MouseEvent): void => {
    if (disabled) return;
    onMouseUp(event);
  };

  const btnClass = classNames('btn', className, getButtonSize(size), {
    'btn-block': block,
    'btn-rounded': rounded,
    'btn-ghost': ghost,
    'btn-outlined': outlined,
    'btn-icon': icon,
    'btn-text': text,
    'btn-disabled': disabled || loading,
    'overflow-hidden': true,
    relative: true,
    [`bg-${color}`]: color && !ghost && !outlined && !text,
    [`text-${color}`]: color && (ghost || outlined || text),
  });

  const loadingComponent = <Icon className="animate-spin">sync</Icon>;

  if (href) {
    return (
      <a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        target={target}
        className={btnClass}
        style={style}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        {loading ? loadingComponent : children}
        <Ripple />
      </a>
    );
  }

  return (
    <button
      ref={ref as React.RefObject<HTMLButtonElement>}
      className={btnClass}
      style={style}
      type={type}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      {loading ? loadingComponent : children}
      <Ripple />
    </button>
  );
});

export default Button;
