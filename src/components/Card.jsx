export const Card = ({ children, className = '' }) => {
  return (
    <div className={`rounded-2xl border border-gray-100 bg-white p-5 shadow-sm ${className}`}>
      {children}
    </div>
  );
};

export const SelectCard = ({
  selected,
  onClick,
  icon: Icon,
  label,
  subtitle,
  subtitleTone = 'default',
  className = '',
}) => {
  const subtitleClass =
    subtitleTone === 'fee'
      ? 'text-gray-600'
      : subtitleTone === 'accent'
        ? selected
          ? 'text-orange-500'
          : 'text-gray-500'
        : selected
          ? 'text-orange-500'
          : 'text-gray-500';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-[132px] w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 p-4 transition-all duration-200 ${
        selected
          ? 'border-orange-500 bg-orange-50/40 shadow-sm'
          : 'border-gray-100 bg-white hover:border-gray-200'
      } ${className}`}
    >
      {Icon ? (
        <Icon size={28} className={selected ? 'text-orange-500' : 'text-gray-500'} strokeWidth={2} />
      ) : null}
      <span className={`text-center text-sm font-bold ${selected ? 'text-gray-900' : 'text-gray-800'}`}>
        {label}
      </span>
      {subtitle ? <span className={`text-center text-xs font-semibold ${subtitleClass}`}>{subtitle}</span> : null}
    </button>
  );
};
