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
        <p className="text-[#1a3d1a]/60">অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।</p>
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
      <CampaignVenue campaign={campaign} />
      <CampaignInstructions content={content} />
      <CampaignFaq content={content} />

      <section
        id="appointment-form"
        className="relative bg-[#F7FFF8] py-24 scroll-mt-20 overflow-hidden"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -top-28 -left-28 w-[26rem] h-[26rem] rounded-full bg-[#E86A10]/[0.07] blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-28 -right-28 w-[26rem] h-[26rem] rounded-full bg-[#1a3d1a]/[0.06] blur-3xl"
        />

        <div className="relative container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-up">
            <span className="inline-flex items-center gap-1.5 bg-white border border-[#1a3d1a]/10 shadow-sm rounded-full px-4 py-1.5 text-xs font-semibold text-[#1a3d1a] mb-6">
              <CalendarCheck className="w-3.5 h-3.5 text-[#E86A10]" />
              বুকিং
            </span>
            <h2 className="font-serif-display text-[#1a3d1a] tracking-tight leading-[1.12] text-[clamp(28px,4vw,48px)] mb-5">
              অ্যাপয়েন্টমেন্ট <span className="text-[#E86A10]">বুক করুন</span>
            </h2>
            <p className="text-[#1a3d1a]/60 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              নিচের ফর্মটি পূরণ করে আপনার পোষা প্রাণীর জন্য একটি নির্দিষ্ট সময় স্লট বুক করুন।
            </p>
          </div>
          <div className="max-w-2xl mx-auto">
            <AppointmentForm campaign={campaign} content={content} />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CampaignLanding;
