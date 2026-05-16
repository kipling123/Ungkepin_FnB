import { Plus, Minus } from 'lucide-react';

export const Counter = ({ value, onChange, min = 1, max = 50 }) => {
  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  return (
    <div className="inline-flex items-center gap-4 rounded-full border border-gray-200 bg-white px-2 py-1.5 shadow-sm">
      <button
        type="button"
        onClick={handleDecrement}
        disabled={value <= min}
        className="flex h-7 w-7 items-center justify-center rounded-full text-orange-500 transition-colors hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Kurangi"
      >
        <Minus size={16} strokeWidth={3} />
      </button>

      <span className="min-w-[1rem] text-center text-sm font-black text-gray-900">{value}</span>

      <button
        type="button"
        onClick={handleIncrement}
        disabled={value >= max}
        className="flex h-7 w-7 items-center justify-center rounded-full text-orange-500 transition-colors hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Tambah"
      >
        <Plus size={16} strokeWidth={3} />
      </button>
    </div>
  );
};
