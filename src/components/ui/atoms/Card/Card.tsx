import React from 'react';
import classNames from 'classnames';

interface CardProps {
  bgColor?: string;
  bgImage?: boolean;
  children?: undefined | React.ReactNode | React.ReactNode[];
  className?: string;
  densed?: boolean;
  outlined?: boolean;
  rounded?: boolean;
  shadow?: boolean;
  side?: boolean;
  style?: React.CSSProperties;
  onClick?: (event: React.MouseEvent) => void;
  onDoubleClick?: (event: React.MouseEvent) => void;
  onMouseDown?: (event: React.MouseEvent) => void;
  onMouseUp?: (event: React.MouseEvent) => void;
}
const Card = React.forwardRef(function Card(
  props: CardProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const {
    bgColor = 'background-100',
    bgImage,
    children,
    className,
    densed,
    outlined,
    rounded,
    shadow,
    side,
    style,
    onClick = () => {},
    onDoubleClick = () => {},
    onMouseDown = () => {},
    onMouseUp = () => {},
  } = props;

  const handleClick = (event: React.MouseEvent): void => {
    onClick(event);
  };
  const handleDoubleClick = (event: React.MouseEvent): void => {
    onDoubleClick(event);
  };
  const handleMouseDown = (event: React.MouseEvent): void => {
    onMouseDown(event);
  };
  const handleMouseUp = (event: React.MouseEvent): void => {
    onMouseUp(event);
  };

  const cardClass = classNames('card', className, {
    'card-side': side,
    'card-densed': densed,
    'card-outlined': outlined,
    'card-rounded': rounded,
    'image-full': bgImage,
    'shadow-xl': shadow,
    [`bg-${bgColor}`]: true,
  });

  return (
    <div
      ref={ref}
      className={cardClass}
      style={style}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      {children}
    </div>
  );
});

export default Card;
