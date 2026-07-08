import { HelpCircle } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import type { CampaignContent } from '@/content/campaigns/rabies-2026.content';

interface CampaignFaqProps {
  content: CampaignContent;
}

const CampaignFaq = ({ content }: CampaignFaqProps) => {
  return (
    <section id="faq" className="relative bg-white py-24 overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute top-16 -right-28 w-[22rem] h-[22rem] rounded-full bg-[#EFFDF0] blur-2xl"
      />

      <div className="relative container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-up">
          <span className="inline-flex items-center gap-1.5 bg-[#EFFDF0] border border-[#1a3d1a]/10 rounded-full px-4 py-1.5 text-xs font-semibold text-[#1a3d1a] mb-6">
            <HelpCircle className="w-3.5 h-3.5 text-[#E86A10]" />
            জিজ্ঞাসা
          </span>
          <h2 className="font-serif-display text-[#1a3d1a] tracking-tight leading-[1.12] text-[clamp(28px,4vw,48px)] mb-5">
            সচরাচর জিজ্ঞাসিত <span className="text-[#E86A10]">প্রশ্ন</span>
          </h2>
          <p className="text-[#1a3d1a]/60 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            আপনার প্রশ্নের উত্তর না পেলে সরাসরি আমাদের সাথে যোগাযোগ করুন।
          </p>
        </div>

        <div className="max-w-3xl mx-auto animate-fade-up delay-200">
          <Accordion
            type="single"
            collapsible
            className="bg-white rounded-[28px] border border-[#1a3d1a]/[0.08] shadow-[0_20px_50px_-15px_rgba(26,61,26,0.15)] px-6 md:px-8"
          >
            {content.faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`faq-${index}`}
                className="border-[#1a3d1a]/[0.08]"
              >
                <AccordionTrigger className="text-left font-semibold text-[#1a3d1a] hover:text-[#E86A10] hover:no-underline py-5 [&>svg]:text-[#1a3d1a]/40">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-[#1a3d1a]/60 leading-relaxed text-[15px]">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default CampaignFaq;
