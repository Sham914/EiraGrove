export interface SiteConfig {
  name: string;
  tagline: string;
  location: string;
  region: string;
  whatsapp: {
    number: string;
    message: string;
    label: string;
  };
  meta: {
    title: string;
    description: string;
  };
}

export const siteConfig: SiteConfig = {
  name: "Eira Grove",
  tagline: "Where the mountains meet stillness",
  location: "Kakkadampoyil",
  region: "Kerala, India",
  whatsapp: {
    number: "919876543210",
    message: "Hello, I would like to enquire about Eira Grove.",
    label: "Book via WhatsApp",
  },
  meta: {
    title: "Eira Grove | Luxury Resort in Kakkadampoyil",
    description:
      "A cinematic journey through Eira Grove — an upcoming luxury resort nestled in the misty highlands of Kakkadampoyil.",
  },
};
