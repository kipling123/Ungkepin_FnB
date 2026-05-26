
export const Stepper = ({ currentStep = 1, steps = ['DATA', 'KONFIRMASI', 'BAYAR'] }) => {
  return (
    <div className="relative bg-white px-10 py-6">
      {/* Background Line */}
      <div className="absolute left-[15%] right-[15%] top-[39px] h-[1.5px] bg-gray-100" />
      
      {/* Active Progress Line */}
      <div 
        className="absolute left-[15%] top-[39px] h-[1.5px] bg-[#92400E] transition-all duration-700" 
        style={{ width: `${Math.max(0, (currentStep - 1) * 35)}%` }}
      />
      
      <div className="relative flex justify-between">
        {steps.map((label, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;
          
          return (
            <div key={label} className="relative z-10 flex flex-col items-center gap-2.5">
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-black transition-all duration-500 ring-4 ring-white ${
                  isActive || isCompleted
                    ? 'bg-[#92400E] text-white shadow-sm' 
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {stepNumber}
              </div>
              <span
                className={`text-[9px] font-black uppercase tracking-[0.1em] transition-colors duration-500 ${
                  isActive ? 'text-[#92400E]' : 'text-gray-300'
                }`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
