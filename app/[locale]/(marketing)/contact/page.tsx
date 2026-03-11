import type { Metadata } from "next";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { JsonLd } from "@/components/json-ld";
import { absoluteUrl } from "@/lib/utils";
import { ContactForm } from "@/components/contact-form";
import { Mail, MessageSquare, Bug } from "lucide-react";
import { useTranslations } from "next-intl";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with the PainRadar team. Send us your questions, feedback, or bug reports.",
};

export default function ContactPage() {
  const t = useTranslations("contact");

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      {
        "@type": "ListItem",
        position: 2,
        name: "Contact",
        item: absoluteUrl("/contact"),
      },
    ],
  };

  const reasons = [
    {
      icon: MessageSquare,
      title: t("general"),
      description: t("generalDesc"),
    },
    {
      icon: Mail,
      title: t("feedback"),
      description: t("feedbackDesc"),
    },
    {
      icon: Bug,
      title: t("bug"),
      description: t("bugDesc"),
    },
  ];

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[{ label: t("pageTitle") }]}
          className="mt-4 mb-10"
        />

        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t("pageTitle")}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {t("pageSubtitle")}
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl gap-12 lg:grid-cols-5">
          <div className="space-y-6 lg:col-span-2">
            {reasons.map((reason) => (
              <div key={reason.title} className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <reason.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">{reason.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {reason.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-3">
            <ContactForm />
          </div>
        </div>
      </div>
    </>
  );
}
