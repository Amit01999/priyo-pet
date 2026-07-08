import { cn } from '@/lib/utils';
import { toBengaliDigits, formatBengaliTime } from '@/lib/bengaliDate';
import type { SlotView } from '@/lib/api/types';
import { Lock, Unlock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BaseProps {
  slots: SlotView[];
}

interface SelectModeProps extends BaseProps {
  mode: 'select';
  selectedSlot: number | null;
  onSelect: (slotNumber: number) => void;
}

interface ManageModeProps extends BaseProps {
  mode: 'manage';
  onBlock: (slotNumber: number) => void;
  onUnblock: (slotNumber: number) => void;
  pendingSlot?: number | null;
}

type SlotGridProps = SelectModeProps | ManageModeProps;

const STATUS_STYLES: Record<SlotView['status'], string> = {
  available:
    'bg-white border-[#1a3d1a]/10 text-[#1a3d1a]/80 hover:border-[#1a3d1a] hover:bg-[#1a3d1a]/5 hover:-translate-y-0.5 hover:shadow-md',
  booked: 'bg-[#1a3d1a]/5 border-transparent text-[#1a3d1a]/30 cursor-not-allowed',
  blocked: 'bg-[#E86A10]/10 border-[#E86A10]/20 text-[#E86A10]/60 cursor-not-allowed',
  past: 'bg-transparent border-[#1a3d1a]/[0.06] text-[#1a3d1a]/25 cursor-not-allowed',
};

const SlotGrid = (props: SlotGridProps) => {
  const { slots, mode } = props;

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5" role="listbox" aria-label="সময় স্লট নির্বাচন">
      {slots.map((slot) => {
        const isSelected = mode === 'select' && props.selectedSlot === slot.slotNumber;

        if (mode === 'select') {
          const disabled = slot.status !== 'available';
          return (
            <button
              key={slot.slotNumber}
              type="button"
              role="option"
              aria-selected={isSelected}
              disabled={disabled}
              onClick={() => props.onSelect(slot.slotNumber)}
              className={cn(
                'relative rounded-xl border-2 px-2 py-2.5 text-sm font-semibold transition-all duration-300',
                isSelected
                  ? 'border-[#1a3d1a] bg-[#1a3d1a] text-white shadow-lg scale-105'
                  : STATUS_STYLES[slot.status]
              )}
              title={slot.status === 'blocked' ? 'এই স্লটটি বন্ধ রাখা হয়েছে' : undefined}
            >
              <span className="block">{formatBengaliTime(slot.startTime)}</span>
              <span className="block text-[10px] opacity-70 mt-0.5">
                {toBengaliDigits(slot.slotNumber)}
                {slot.status === 'booked' && ' · বুকড'}
                {slot.status === 'blocked' && ' · বন্ধ'}
                {slot.status === 'past' && ' · সময় শেষ'}
              </span>
            </button>
          );
        }

        const manageProps = props as ManageModeProps;
        const isPending = manageProps.pendingSlot === slot.slotNumber;
        return (
          <div
            key={slot.slotNumber}
            className={cn('relative rounded-xl border-2 px-2 py-2.5 text-sm', STATUS_STYLES[slot.status])}
          >
            <span className="block font-semibold">{formatBengaliTime(slot.startTime)}</span>
            <span className="block text-[10px] opacity-70 mt-0.5 mb-1.5">
              {toBengaliDigits(slot.slotNumber)}
              {slot.status === 'booked' && ' · বুকড'}
            </span>
            {slot.status !== 'booked' && slot.status !== 'past' && (
              <Button
                size="sm"
                variant="ghost"
                disabled={isPending}
                className="h-6 w-full px-1 text-[10px] gap-1"
                onClick={() =>
                  slot.status === 'blocked'
                    ? manageProps.onUnblock(slot.slotNumber)
                    : manageProps.onBlock(slot.slotNumber)
                }
              >
                {slot.status === 'blocked' ? (
                  <>
                    <Unlock className="w-3 h-3" /> খুলুন
                  </>
                ) : (
                  <>
                    <Lock className="w-3 h-3" /> বন্ধ করুন
                  </>
                )}
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default SlotGrid;
