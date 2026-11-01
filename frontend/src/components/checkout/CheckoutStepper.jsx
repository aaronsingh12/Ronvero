import { CheckIcon } from '../ui/Icons.jsx';
import { cn } from '../../utils/cn.js';

const STEPS = ['Address', 'Shipping', 'Payment', 'Review'];

export default function CheckoutStepper({ currentStep }) {
  return (
    <div className="mb-10 flex items-center">
      {STEPS.map((label, i) => {
        const stepNum = i + 1;
        const isDone = stepNum < currentStep;
        const isActive = stepNum === currentStep;
        return (
          <div key={label} className="flex flex-1 items-center last:flex-none">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-mono text-xs',
                  isDone && 'bg-graphite text-chalk',
                  isActive && 'bg-ember text-chalk',
                  !isDone && !isActive && 'bg-graphite/10 text-char/50'
                )}
              >
                {isDone ? <CheckIcon size={14} /> : stepNum}
              </div>
              <span className={cn('hidden font-body text-sm sm:inline', isActive ? 'text-char' : 'text-char/50')}>
                {label}
              </span>
            </div>
            {stepNum < STEPS.length && <div className={cn('mx-3 h-px flex-1', isDone ? 'bg-graphite' : 'bg-graphite/10')} />}
          </div>
        );
      })}
    </div>
  );
}
