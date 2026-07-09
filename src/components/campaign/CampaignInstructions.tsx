import { ClipboardList } from 'lucide-react';
import { toBengaliDigits } from '@/lib/bengaliDate';
import type { CampaignContent } from '@/content/campaigns/rabies-2026.content';

interface CampaignInstructionsProps {
  content: CampaignContent;
}

const CampaignInstructions = ({ content }: CampaignInstructionsProps) => {
  return (
    <section className="relative bg-[#FFFFFF] py-24 overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -right-24 w-[26rem] h-[26rem] rounded-full bg-[#1a3d1a]/[0.05] blur-3xl"
      />

      <div className="relative container mx-auto px-4">
        <div className="text-center mb-14 animate-fade-up">
          <span className="inline-flex items-center gap-1.5 bg-white border border-[#1a3d1a]/10 shadow-sm rounded-full px-4 py-1.5 text-xs font-semibold text-[#1a3d1a] mb-6">
            <ClipboardList className="w-3.5 h-3.5 text-[#E86A10]" />
            প্রস্তুতি
          </span>
          <h2 className="font-serif-display text-[#1a3d1a] tracking-tight leading-[1.12] text-[clamp(28px,4vw,48px)] mb-5">
            গুরুত্বপূর্ণ <span className="text-[#E86A10]">নির্দেশনা</span>
          </h2>
          <p className="text-[#1a3d1a]/60 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            টিকাদান কার্যক্রম মসৃণভাবে সম্পন্ন করতে অনুগ্রহ করে নিচের
            নির্দেশনাগুলো অনুসরণ করুন।
          </p>
        </div>

        <div className="max-w-3xl mx-auto grid gap-4">
          {content.instructions.map((instruction, index) => (
            <div
              key={index}
              className="flex items-start gap-5 bg-white rounded-[24px] border border-[#1a3d1a]/[0.06] shadow-[0_15px_40px_-15px_rgba(26,61,26,0.12)] p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_25px_50px_-15px_rgba(26,61,26,0.2)] animate-fade-up"
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              <div className="w-11 h-11 rounded-full bg-[#E86A10]/10 flex items-center justify-center flex-shrink-0">
                <span className="font-serif-display text-[#E86A10] text-lg">
                  {toBengaliDigits(String(index + 1).padStart(2, '0'))}
                </span>
              </div>
              <p className="text-[#1a3d1a]/75 leading-relaxed pt-2">
                {instruction}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CampaignInstructions;
