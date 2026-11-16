export type ServiceItem = {
  _id: string;
  title: string;
  slug: string;
  shortTitle?: string;
  summary?: string;
  description?: string;
  bullets: string[];
  icon: string;
  imageUrl?: string;
  order: number;
  published: boolean;
};

export type TestimonialItem = {
  _id: string;
  clientName: string;
  businessName?: string;
  content: string;
  rating?: number | null;
  date?: string | null;
  published: boolean;
  featured: boolean;
  order: number;
};

export type InquiryItem = {
  _id: string;
  fullName: string;
  businessName?: string;
  email: string;
  phone?: string;
  service?: string;
  message: string;
  status: "new" | "read" | "responded";
  emailStatus: "sent" | "failed" | "not_configured";
  createdAt: string;
};
