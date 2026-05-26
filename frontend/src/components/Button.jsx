export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  shape = 'pill',
  className = '',
  ...props
}) => {
  const baseStyles =
    'font-semibold transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none';

  const shapes = {
    pill: 'rounded-full',
    rounded: 'rounded-xl',
  };

  const variants = {
    primary:
      'bg-orange-500 text-white shadow-md shadow-orange-500/25 hover:bg-orange-600 active:scale-[0.98]',
    secondary: 'bg-orange-50 text-orange-600 hover:bg-orange-100 active:scale-[0.98]',
    success:
      'bg-emerald-500 text-white shadow-md shadow-emerald-500/20 hover:bg-emerald-600 active:scale-[0.98]',
    outline:
      'border-2 border-[#c4a574] bg-white text-gray-900 hover:bg-amber-50/60 active:scale-[0.98]',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-3.5 text-base w-full',
  };

  return (
    <button
      className={`${baseStyles} ${shapes[shape] ?? shapes.pill} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
