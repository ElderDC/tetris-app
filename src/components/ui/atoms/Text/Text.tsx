import React from 'react';
import classNames from 'classnames';

type TextVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'subtitle1'
  | 'subtitle2'
  | 'body1'
  | 'body2'
  | 'caption'
  | 'button'
  | 'overline'
  | 'xxs';

type TextWeight =
  | 'extralight'
  | 'light'
  | 'normal'
  | 'medium'
  | 'semibold'
  | 'bold'
  | 'extrabold'
  | 'black';

type TextTransform = 'none' | 'capitalize' | 'uppercase' | 'lowercase' | 'normal';

const variantOptions: Record<TextVariant, string> = {
  h1: 'text-9xl',
  h2: 'text-8xl',
  h3: 'text-6xl',
  h4: 'text-5xl',
  h5: 'text-4xl',
  h6: 'text-2xl',
  subtitle1: 'text-xl',
  subtitle2: 'text-lg',
  body1: 'text-md',
  body2: 'text-sm',
  button: 'text-sm',
  caption: 'text-xs',
  overline: 'text-xs',
  xxs: 'text-2xs',
};

const weightOptions: Record<TextWeight, string> = {
  extralight: 'font-extralight',
  light: 'font-light',
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
  extrabold: 'font-extrabold',
  black: 'font-black',
};

const transformOptions: Record<TextTransform, string> = {
  none: '',
  capitalize: 'capitalize',
  uppercase: 'uppercase',
  lowercase: 'lowercase',
  normal: 'normal-case',
};

interface TextProps {
  children?: React.ReactNode | React.ReactNode[];
  className?: string;
  variant?: TextVariant;
  style?: React.CSSProperties;
  transform?: TextTransform;
  weight?: TextWeight;
}

const Text = React.forwardRef<HTMLElement, TextProps>(function Text(props, ref) {
  const { className, children, style, variant, transform, weight } = props;

  const getTextVariant = (variant?: TextVariant): string => {
    if (!variant) return '';
    return variantOptions[variant];
  };
  const getTextTransform = (transform?: TextTransform): string => {
    if (!transform) return '';
    return transformOptions[transform];
  };
  const getTextWeight = (weight?: TextWeight): string => {
    if (!weight) return '';
    return weightOptions[weight];
  };

  const textClass = classNames(
    className,
    getTextVariant(variant),
    getTextWeight(weight),
    getTextTransform(transform),
  );

  return (
    <span className={textClass} style={style} ref={ref}>
      {children}
    </span>
  );
});

export default Text;
