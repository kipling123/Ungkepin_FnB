export const Input = ({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  error,
  prefix,
  multiline = false,
  rows = 4,
  className = '',
  ...props
}) => {
  const fieldClass = `w-full px-4 py-3.5 border border-gray-100 rounded-2xl bg-gray-50/50 text-gray-900 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500/50 focus:bg-white placeholder:text-gray-400 ${
    prefix ? 'pl-[4.5rem]' : ''
  } ${error ? 'border-red-500 focus:ring-red-100 focus:border-red-500' : ''} ${className}`;

  return (
    <div className="flex flex-col gap-2">
      {label ? (
        <label className="text-[11px] font-black uppercase tracking-[0.15em] text-gray-400 ml-1">{label}</label>
      ) : null}
      <div className="relative flex items-center">
        {prefix ? (
          <span className="pointer-events-none absolute left-3 z-[1] rounded-xl bg-white border border-gray-100 px-2.5 py-1.5 text-xs font-black text-gray-900 shadow-sm">
            {prefix}
          </span>
        ) : null}
        {multiline ? (
          <textarea
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            rows={rows}
            className={`${fieldClass} min-h-[120px] resize-none`}
            {...props}
          />
        ) : (
          <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className={fieldClass}
            {...props}
          />
        )}
      </div>
      {error ? <span className="text-[10px] font-bold text-red-500 ml-1 mt-0.5">{error}</span> : null}
    </div>
  );
};
