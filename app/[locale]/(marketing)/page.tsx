import { Hero } from "@/components/landing/hero";
import { ProductDemo } from "@/components/landing/product-demo";
import { WhyThisWorks } from "@/components/landing/why-this-works";
import { Benefits } from "@/components/landing/benefits";
import { HowItWorks } from "@/components/landing/how-it-works";
import { ExampleCards } from "@/components/landing/example-cards";
import { Comparison } from "@/components/landing/comparison";
import { SocialProof } from "@/components/landing/social-proof";
import { Roadmap } from "@/components/landing/roadmap";
import { PricingSection } from "@/components/landing/pricing-section";
import { FAQ } from "@/components/landing/faq";
import { CTASection } from "@/components/landing/cta-section";
import { JsonLd } from "@/components/json-ld";
import { siteConfig } from "@/config/site";

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: siteConfig.name,
          url: siteConfig.url,
          description: siteConfig.description,
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: siteConfig.name,
          url: siteConfig.url,
          logo: `${siteConfig.url}/logo.png`,
          sameAs: [siteConfig.links.twitter],
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: siteConfig.name,
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          description: siteConfig.description,
          url: siteConfig.url,
          offers: [
            {
              "@type": "Offer",
              name: "Free",
              price: "0",
              priceCurrency: "EUR",
              description: "2 credits included at signup — no credit card required.",
            },
            {
              "@type": "Offer",
              name: "Starter",
              price: "9",
              priceCurrency: "EUR",
              description: "5 full analysis credits. One-time payment, credits never expire.",
            },
            {
              "@type": "Offer",
              name: "Explorer",
              price: "19",
              priceCurrency: "EUR",
              description: "15 full analysis credits. One-time payment, credits never expire.",
            },
            {
              "@type": "Offer",
              name: "Founder",
              price: "49",
              priceCurrency: "EUR",
              description: "Unlimited analyses forever. One-time payment, lifetime access.",
            },
          ],
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "What is PainRadar?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "PainRadar is a SaaS idea discovery platform that analyzes online discussions from Reddit, forums, and review sites to find recurring pain points and product opportunities. It scores each opportunity for demand, urgency, competition, and monetization potential.",
              },
            },
            {
              "@type": "Question",
              name: "How does PainRadar find SaaS ideas?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "PainRadar scans Reddit threads, community forums, and review platforms like G2 and Capterra to extract real customer complaints. It clusters recurring frustrations, scores them for market opportunity, and generates AI-ready product ideas with MVP scope and positioning angles.",
              },
            },
            {
              "@type": "Question",
              name: "Who is PainRadar for?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "PainRadar is designed for indie hackers, solo founders, and product teams who want to find validated SaaS ideas without hours of manual research. It helps you discover real pain points people are already complaining about before you build anything.",
              },
            },
            {
              "@type": "Question",
              name: "What sources does PainRadar analyze?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "PainRadar pulls real discussions from Reddit, community forums, and review sites like G2, Capterra, and Trustpilot. New sources are continuously added to keep the analysis fresh.",
              },
            },
            {
              "@type": "Question",
              name: "How much does PainRadar cost?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "PainRadar uses a credit-based model with no subscription. You get 2 free credits at signup. Paid packs are one-time payments: Starter (€9, 5 credits), Explorer (€19, 15 credits), and Founder (€49, unlimited analyses forever). Credits never expire.",
              },
            },
            {
              "@type": "Question",
              name: "How is PainRadar different from manual market research?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Manual market research means spending hours scrolling through forums and reviews, then organizing findings by hand. PainRadar automates the entire process: it surfaces patterns across thousands of discussions, quantifies the opportunity, and delivers product ideas and SEO angles in seconds.",
              },
            },
          ],
        }}
      />
      <Hero />
      <ProductDemo />
      <WhyThisWorks />
      <Benefits />
      <HowItWorks />
      <ExampleCards />
      <Comparison />
      <SocialProof />
      <Roadmap />
      <PricingSection />
      <FAQ />
      <CTASection />
    </>
  );
}
