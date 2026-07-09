import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ChevronLeft, ChevronRight, Loader2, Calendar, Mail } from 'lucide-react';
import {
  appointmentFormSchema,
  appointmentFormDefaultValues,
  type AppointmentFormValues,
} from '@/lib/validation/campaignFormSchema';
import { submitAppointment } from '@/lib/api/publicCampaign.api';
import { getApiErrorCode, getApiErrorMessage } from '@/lib/api/client';
import { formatBengaliDayMonth, formatBengaliTime, toBengaliDigits } from '@/lib/bengaliDate';
import type { PublicCampaign, SlotsForDateResult } from '@/lib/api/types';
import type { CampaignContent } from '@/content/campaigns/rabies-2026.content';
import StepGuardianInfo from './StepGuardianInfo';
import StepPetInfo from './StepPetInfo';
import StepHealthInfo from './StepHealthInfo';
import StepSchedule from './StepSchedule';
import StepReviewConsent from './StepReviewConsent';
import StepPayment from './StepPayment';

interface AppointmentFormProps {
  campaign: PublicCampaign;
  content: CampaignContent;
}

const STEPS: { id: string; title: string; fields: (keyof AppointmentFormValues)[] }[] = [
  { id: 'guardian', title: 'অভিভাবক', fields: ['guardianName', 'mobileNumber', 'alternateMobileNumber', 'email'] },
  { id: 'pet', title: 'প্রাণী', fields: ['petName', 'animalType', 'breed', 'gender', 'age', 'weight', 'colorMarkings'] },
  { id: 'health', title: 'স্বাস্থ্য', fields: ['previousVaccinationInfo', 'currentHealthStatus'] },
  { id: 'schedule', title: 'সময়', fields: ['appointmentDate', 'slotNumber', 'hearAboutCampaign'] },
  { id: 'review', title: 'সম্মতি', fields: ['consentAcknowledged'] },
  { id: 'payment', title: 'পেমেন্ট', fields: ['paymentReference', 'paymentConfirmedByUser'] },
];

const AppointmentForm = ({ campaign, content }: AppointmentFormProps) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [successData, setSuccessData] = useState<{ date: string; time: string; slotNumber: number } | null>(null);
  const queryClient = useQueryClient();

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: appointmentFormDefaultValues,
    mode: 'onTouched',
  });

  const selectedDate = form.watch('appointmentDate');
  const selectedSlot = form.watch('slotNumber');
  const slotsData = queryClient.getQueryData<SlotsForDateResult>(['public-slots', campaign.slug, selectedDate]);
  const selectedSlotTime = slotsData?.slots.find((s) => s.slotNumber === selectedSlot)?.startTime;

  const mutation = useMutation({
    mutationFn: () => {
      const values = form.getValues();
      return submitAppointment(campaign.slug, {
        guardianName: values.guardianName,
        mobileNumber: values.mobileNumber,
        alternateMobileNumber: values.alternateMobileNumber || undefined,
        email: values.email,
        petName: values.petName,
        animalType: values.animalType,
        breed: values.breed || undefined,
        gender: values.gender,
        age: values.age,
        weight: values.weight,
        colorMarkings: values.colorMarkings,
        previousVaccinationInfo: values.previousVaccinationInfo,
        currentHealthStatus: values.currentHealthStatus,
        appointmentDate: values.appointmentDate,
        hearAboutCampaign: values.hearAboutCampaign,
        slotNumber: values.slotNumber,
        consentAcknowledged: true,
        paymentReference: values.paymentReference,
        paymentConfirmedByUser: true,
      });
    },
    onSuccess: (data) => {
      setSuccessData({ date: data.appointmentDate, time: data.appointmentTime, slotNumber: data.slotNumber });
      toast.success('আপনার অ্যাপয়েন্টমেন্ট সফলভাবে জমা হয়েছে!');
    },
    onError: (error) => {
      const errorCode = getApiErrorCode(error);
      const message = getApiErrorMessage(error, 'অ্যাপয়েন্টমেন্ট জমা দিতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');

      if (errorCode === 'SLOT_TAKEN' || errorCode === 'SLOT_BLOCKED' || errorCode === 'SLOT_TIME_PASSED') {
        toast.error(message);
        form.resetField('slotNumber', { defaultValue: undefined });
        queryClient.invalidateQueries({ queryKey: ['public-slots', campaign.slug, selectedDate] });
        setStepIndex(3);
        return;
      }

      toast.error(message);
    },
  });

  const goNext = async () => {
    const fields = STEPS[stepIndex].fields;
    const valid = await form.trigger(fields, { shouldFocus: true });
    if (!valid) return;
    setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
    window.scrollTo({ top: document.getElementById('appointment-form')?.offsetTop ?? 0, behavior: 'smooth' });
  };

  const goBack = () => {
    setStepIndex((i) => Math.max(i - 1, 0));
  };

  const onSubmit = form.handleSubmit(() => mutation.mutate());

  if (successData) {
    return (
      <div className="bg-white rounded-[32px] border border-[#1a3d1a]/[0.06] shadow-[0_30px_80px_-20px_rgba(26,61,26,0.3)] p-10 md:p-12 text-center animate-hero-scale-in">
        <div className="mx-auto w-16 h-16 rounded-full bg-[#EFFDF0] flex items-center justify-center mb-6 shadow-sm">
          <CheckCircle2 className="w-9 h-9 text-[#1a3d1a]" />
        </div>
        <h3 className="font-serif-display text-2xl md:text-3xl text-[#1a3d1a] mb-3">
          অ্যাপয়েন্টমেন্ট নিশ্চিত হয়েছে!
        </h3>
        <p className="text-[#1a3d1a]/60 mb-7 leading-relaxed">
          আপনার অ্যাপয়েন্টমেন্ট অনুরোধ গ্রহণ করা হয়েছে। নিচের সময়ে ভেন্যুতে উপস্থিত হন।
        </p>
        <div className="inline-flex items-center gap-2 bg-[#1a3d1a] text-white rounded-full px-6 py-3 font-semibold shadow-md">
          <Calendar className="w-4 h-4" />
          {formatBengaliDayMonth(successData.date)}, {formatBengaliTime(successData.time)} (স্লট #
          {toBengaliDigits(successData.slotNumber)})
        </div>

        <div className="mt-7 flex items-start gap-3 bg-[#F7FFF8] border border-[#1a3d1a]/[0.08] rounded-[16px] p-4 text-left">
          <Mail className="w-5 h-5 text-[#E86A10] flex-shrink-0 mt-0.5" />
          <p className="text-sm text-[#1a3d1a]/70 leading-relaxed">
            আপনার ইমেইলে একটি নিশ্চিতকরণ বার্তা পাঠানো হয়েছে, অনুগ্রহ করে ইমেইল চেক করুন। পেমেন্ট যাচাই হওয়ার পর
            (সাধারণত ২৪ ঘণ্টার মধ্যে) আরেকটি ইমেইলে আপনার অ্যাপয়েন্টমেন্ট টিকিট (PDF) পাঠানো হবে — সেটি ডাউনলোড
            করে সাথে নিয়ে আসুন।
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[32px] border border-[#1a3d1a]/[0.06] shadow-[0_30px_80px_-20px_rgba(26,61,26,0.3)] p-6 md:p-10">
      {/* Progress */}
      <div className="flex items-center justify-between mb-10">
        {STEPS.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1 last:flex-none">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 transition-all duration-300 ${
                index < stepIndex
                  ? 'bg-[#1a3d1a] text-white shadow-md'
                  : index === stepIndex
                    ? 'bg-[#E86A10] text-white shadow-md scale-110'
                    : 'bg-[#EFFDF0] text-[#1a3d1a]/40'
              }`}
            >
              {index < stepIndex ? <CheckCircle2 className="w-4 h-4" /> : toBengaliDigits(index + 1)}
            </div>
            <span
              className={`hidden md:inline text-xs ml-2 mr-2 whitespace-nowrap font-medium ${
                index <= stepIndex ? 'text-[#1a3d1a]' : 'text-[#1a3d1a]/40'
              }`}
            >
              {step.title}
            </span>
            {index < STEPS.length - 1 && (
              <div
                className={`h-0.5 flex-1 mx-1 rounded-full transition-colors duration-500 ${
                  index < stepIndex ? 'bg-[#1a3d1a]' : 'bg-[#1a3d1a]/10'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <FormProvider {...form}>
        <form onSubmit={onSubmit} className="space-y-8">
          {stepIndex === 0 && <StepGuardianInfo />}
          {stepIndex === 1 && <StepPetInfo />}
          {stepIndex === 2 && <StepHealthInfo />}
          {stepIndex === 3 && <StepSchedule campaign={campaign} />}
          {stepIndex === 4 && <StepReviewConsent content={content} selectedSlotTime={selectedSlotTime} />}
          {stepIndex === 5 && <StepPayment campaign={campaign} />}

          <div className="flex items-center justify-between pt-6 border-t border-[#1a3d1a]/[0.08]">
            <Button
              type="button"
              variant="outline"
              onClick={goBack}
              disabled={stepIndex === 0 || mutation.isPending}
              className="rounded-full border-[#1a3d1a]/20 text-[#1a3d1a] hover:bg-[#1a3d1a]/5 hover:text-[#1a3d1a] px-5 transition-all duration-300"
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> পূর্ববর্তী
            </Button>

            {stepIndex < STEPS.length - 1 ? (
              <Button
                type="button"
                onClick={goNext}
                className="bg-[#1a3d1a] hover:bg-[#2a5a2a] text-white rounded-full px-6 shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                পরবর্তী <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={mutation.isPending}
                className="bg-[#E86A10] hover:bg-[#d45e0d] text-white rounded-full px-7 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> জমা হচ্ছে...
                  </>
                ) : (
                  'অ্যাপয়েন্টমেন্ট নিশ্চিত করুন'
                )}
              </Button>
            )}
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default AppointmentForm;
