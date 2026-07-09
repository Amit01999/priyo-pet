import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { Loader2, CalendarCheck } from 'lucide-react';
import CampaignHeader from '@/components/campaign/CampaignHeader';
import CampaignHero from '@/components/campaign/CampaignHero';
import CampaignInfo from '@/components/campaign/CampaignInfo';
import CampaignSchedule from '@/components/campaign/CampaignSchedule';
import CampaignVenue from '@/components/campaign/CampaignVenue';
import CampaignInstructions from '@/components/campaign/CampaignInstructions';
import CampaignFaq from '@/components/campaign/CampaignFaq';
import AppointmentForm from '@/components/campaign/AppointmentForm/AppointmentForm';
import Footer from '@/components/Footer';
import { fetchCampaign } from '@/lib/api/publicCampaign.api';
import { getCampaignContent } from '@/content/campaigns/registry';
import NotFound from './NotFound';

const CampaignLanding = () => {
  const { slug = '' } = useParams<{ slug: string }>();
  const content = getCampaignContent(slug);

  const {
    data: campaign,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['public-campaign', slug],
    queryFn: () => fetchCampaign(slug),
    enabled: Boolean(content),
    retry: 1,
  });

  if (!content) return <NotFound />;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#EFFDF0]">
        <Loader2 className="w-8 h-8 animate-spin text-[#1a3d1a]" />
      </div>
    );
  }

  if (isError || !campaign) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-[#EFFDF0] font-hero-inter">
        <h1 className="font-serif-display text-2xl md:text-3xl text-[#1a3d1a] mb-3">
          ক্যাম্পেইন তথ্য লোড করা যায়নি
        </h1>
        <p className="text-[#1a3d1a]/60">
          অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EFFDF0] font-hero-inter">
      <Helmet>
        <title>{content.seo.title}</title>
        <meta name="description" content={content.seo.description} />
      </Helmet>

      <CampaignHeader />
      <CampaignHero campaign={campaign} content={content} />
      <CampaignInfo campaign={campaign} content={content} />
      <CampaignSchedule campaign={campaign} />

      <CampaignInstructions content={content} />

      <section
        id="appointment-form"
        className="relative bg-[#F7FFF8] py-24 scroll-mt-20 overflow-hidden"
      >
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none opacity-20 mix-blend-multiply bg-cover bg-center z-0"
          style={{ backgroundImage: "url('/hero-bg.png')" }}
        />

        <div className="relative z-10 container mx-auto px-4">
          <div className="text-center mb-5 animate-fade-up">
            <span className="inline-flex items-center gap-1.5 bg-white border border-[#1a3d1a]/10 shadow-sm rounded-full px-4 py-1.5 text-xs font-semibold text-[#1a3d1a] mb-6">
              <CalendarCheck className="w-3.5 h-3.5 text-[#E86A10]" />
              বুকিং
            </span>
            <h2 className="font-serif-display text-[#1a3d1a] tracking-tight leading-[1.12] text-[clamp(28px,4vw,48px)] mb-5">
              অ্যাপয়েন্টমেন্ট <span className="text-[#E86A10]">বুক করুন</span>
            </h2>
            <p className="text-[#1a3d1a]/60 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              নিচের ফর্মটি পূরণ করে আপনার পোষা প্রাণীর জন্য একটি নির্দিষ্ট সময়
              স্লট বুক করুন।
            </p>
          </div>
          <div className=" mb-12 flex justify-center animate-fade-up">
            <div className="inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-2 rounded-full border border-[#1a3d1a]/10 bg-white/80 px-5 py-3 shadow-sm backdrop-blur-sm">
              <span className="font-medium text-[#1a3d1a]/70">
                সেবা সংক্রান্ত তথ্য
              </span>

              <span className="hidden h-4 w-px bg-[#1a3d1a]/15 sm:block" />

              <span className="font-semibold text-[#1a3d1a]">
                ভ্যাকসিন:
                <span className="ml-1 text-green-700">সম্পূর্ণ বিনামূল্যে</span>
              </span>

              <span className="hidden h-4 w-px bg-[#1a3d1a]/15 sm:block" />

              <span className="font-semibold text-[#1a3d1a]">
                ইনজেকশন প্রদান চার্জ:
                <span className="ml-1 text-[#E86A10]">৳৭০</span>
              </span>
            </div>
          </div>
          <div className="max-w-2xl mx-auto">
            <AppointmentForm campaign={campaign} content={content} />
          </div>
        </div>
      </section>
      <CampaignFaq content={content} />
      <CampaignVenue campaign={campaign} />
      <Footer />

      <a
        href="https://wa.me/message/K23L24PEUFQZJ1"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp-এ চ্যাট করুন"
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] shadow-[0_10px_30px_-6px_rgba(37,211,102,0.65)] transition-all duration-300 hover:scale-110 hover:shadow-[0_15px_40px_-6px_rgba(37,211,102,0.75)]"
      >
        <svg
          viewBox="0 0 448 512"
          className="w-7 h-7 fill-white"
          aria-hidden="true"
        >
          <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222c0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222c0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2c0-101.7 82.8-184.5 184.6-184.5c49.3 0 95.6 19.2 130.4 54.1c34.8 34.9 56.2 81.2 56.1 130.5c0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18c-5.1-1.9-8.8-2.8-12.5 2.8c-3.7 5.6-14.3 18-17.6 21.8c-3.2 3.7-6.5 4.2-12 1.4c-32.6-16.3-54-29.1-75.5-66c-5.7-9.8 5.7-9.1 16.3-30.3c1.8-3.7.9-6.9-.5-9.7c-1.4-2.8-12.5-30.1-17.1-41.2c-4.5-10.8-9.1-9.3-12.5-9.5c-3.2-.2-6.9-.2-10.6-.2c-3.7 0-9.7 1.4-14.8 6.9c-5.1 5.6-19.4 19-19.4 46.3c0 27.3 19.9 53.7 22.6 57.4c2.8 3.7 39.1 59.7 94.8 83.8c35.2 15.2 49 16.5 66.6 13.9c10.7-1.6 32.8-13.4 37.4-26.4c4.6-13 4.6-24.1 3.2-26.4c-1.3-2.5-5-3.9-10.5-6.6z" />
        </svg>
      </a>
    </div>
  );
};

export default CampaignLanding;
