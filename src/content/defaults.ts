/**
 * Default website content. The admin portal stores overrides in MongoDB (PageContent),
 * which are merged over these defaults. Only verified business facts appear here.
 */

export const DEFAULT_SETTINGS = {
  siteName: "Best Biz Accounting",
  ownerName: "Angela Rotvik",
  phone: "(403) 617-2677",
  email: "angela@bestbizaccounting.ca",
  serviceArea: "Remote Bookkeeping Services",
  logoUrl: "/brand/bba-logo.png",
  faviconUrl: "",
  footerDescription:
    "Reliable, accurate remote bookkeeping support for small businesses, backed by over 20 years of bookkeeping experience.",
  seoTitle: "Best Biz Accounting | Remote Bookkeeping Services",
  seoDescription:
    "Best Biz Accounting provides reliable remote bookkeeping services for small businesses. With over 20 years of experience, Angela Rotvik offers support with payroll, reconciliations, GST, and more.",
  ogImageUrl: "/images/hero-desk.webp",
  privacyPolicyUrl: "",
  social: { facebook: "", instagram: "", linkedin: "" },
};

export type SiteSettingsData = typeof DEFAULT_SETTINGS;

type TitleText = { title: string; text: string };

export const DEFAULT_PAGES = {
  home: {
    hero: {
      eyebrow: "Professional Bookkeeping Services",
      heading: "You can count on us!!!",
      description:
        "Reliable, accurate, and remote bookkeeping support for small businesses, so you can focus on growing your business.",
      image: "/images/hero-desk.webp",
      primaryCta: "Our Services",
      secondaryCta: "Contact Us",
    },
    trust: {
      visible: true,
      items: [
        { title: "20+ Years", text: "of Experience" },
        { title: "Small Business", text: "Focused" },
        { title: "Remote & Flexible", text: "Service" },
        { title: "Accurate & Reliable", text: "Support" },
      ] as TitleText[],
    },
    servicesPreview: {
      visible: true,
      eyebrow: "Our Services",
      heading: "Comprehensive Bookkeeping Services for Your Business",
      description:
        "We handle the day-to-day financial tasks so you can have clear, up-to-date records and peace of mind.",
      ctaLabel: "View All Services",
      offerTitle: "Need Bookkeeping Support?",
      offerText:
        "Tell us about your business and we'll help you explore the bookkeeping services that fit your needs.",
      offerCta: "Request a Consultation",
    },
    about: {
      visible: true,
      eyebrow: "About Best Biz Accounting",
      heading: "Experienced Bookkeeping Support You Can Rely On",
      body: "With over 20 years of bookkeeping experience, Angela Rotvik provides dependable financial recordkeeping support to businesses across a variety of industries. From couriers and manufacturers to rental businesses and fuel supply companies, Best Biz Accounting understands the importance of accurate and organized bookkeeping.",
      image: "/images/workspace-bright.webp",
      badge: "20+ Years",
      highlights: [
        "Practical, hands-on bookkeeping experience",
        "Support built around small businesses",
        "Convenient remote service",
        "Organized, up-to-date financial records",
        "Experience across multiple industries",
      ],
      ctaLabel: "Learn More About Us",
    },
    whyChoose: {
      visible: true,
      eyebrow: "Why Choose Us",
      heading: "Why Small Businesses Choose Best Biz Accounting",
      items: [
        { title: "20+ Years of Experience", text: "Practical bookkeeping experience across different business environments." },
        { title: "Reliable Recordkeeping", text: "Organized financial records and careful attention to detail." },
        { title: "Remote Bookkeeping Support", text: "Convenient bookkeeping assistance without the need for an in-person office visit." },
        { title: "Personalized Service", text: "Bookkeeping support tailored to each business's actual needs." },
      ] as TitleText[],
    },
    industries: {
      visible: true,
      eyebrow: "Industry Experience",
      heading: "Bookkeeping Experience Across Different Industries",
      intro: "Angela has supported the bookkeeping needs of businesses in a range of industries, including:",
      items: [
        { title: "Courier Businesses", text: "Recordkeeping for delivery and courier operations." },
        { title: "Manufacturing Companies", text: "Bookkeeping support for production-based businesses." },
        { title: "Rental Businesses", text: "Organized records for rental income and expenses." },
        { title: "Fuel Supply Companies", text: "Bookkeeping experience with fuel supply operations." },
        { title: "Other Small Businesses", text: "Everyday bookkeeping for a variety of small businesses." },
      ] as TitleText[],
    },
    process: {
      visible: true,
      eyebrow: "How It Works",
      heading: "Getting Started Is Simple",
      intro: "Remote bookkeeping support, set up around your business in a few straightforward steps.",
      items: [
        { title: "Reach Out", text: "Call, email, or send a message through the contact form to start the conversation." },
        { title: "Discuss Your Needs", text: "We talk through your records, current workload, and the services your business needs." },
        { title: "Get a Personalized Quote", text: "You receive pricing based on your actual bookkeeping requirements, not a one-size-fits-all package." },
        { title: "Stay Organized", text: "Your books are kept accurate and up to date remotely, so you can focus on running your business." },
      ] as TitleText[],
    },
    faq: {
      visible: true,
      eyebrow: "FAQ",
      heading: "Frequently Asked Questions",
      intro: "Answers to common questions about working with Best Biz Accounting.",
      items: [
        {
          question: "Do I need to meet in person?",
          answer: "No. Best Biz Accounting provides remote bookkeeping services, so you can get reliable support without an in-person office visit.",
        },
        {
          question: "How much do your bookkeeping services cost?",
          answer: "Pricing is personalized. Every business has different records, volume, and needs, so contact Angela to discuss your situation and request a quote.",
        },
        {
          question: "What bookkeeping services do you offer?",
          answer: "Services include accounts payable, accounts receivable, bank reconciliations, inventory tracking and balancing, payroll support (including T4s, ROEs, and remittances), and GST filing and remittance support.",
        },
        {
          question: "What types of businesses do you work with?",
          answer: "Best Biz Accounting focuses on small businesses. Angela has bookkeeping experience with couriers, manufacturers, rental businesses, fuel supply companies, and other small businesses.",
        },
        {
          question: "Do you provide tax or legal advice?",
          answer: "Our services focus on bookkeeping and recordkeeping support. For tax planning or legal advice, we recommend consulting a qualified tax or legal professional.",
        },
        {
          question: "How do I get started?",
          answer: "Call (403) 617-2677, email angela@bestbizaccounting.ca, or send a message through the contact form. We'll discuss your needs and next steps.",
        },
      ] as Array<{ question: string; answer: string }>,
    },
    testimonials: {
      visible: true,
      eyebrow: "Testimonials",
      heading: "What Our Clients Say",
      ctaLabel: "View Testimonials",
    },
    cta: {
      visible: true,
      heading: "Ready to Simplify Your Bookkeeping?",
      description:
        "Let's discuss your business's bookkeeping needs and how Best Biz Accounting can help you stay organized.",
      primaryLabel: "Contact Angela",
    },
  },
  services: {
    hero: {
      eyebrow: "Our Services",
      heading: "Professional Bookkeeping Services",
      subtitle: "Reliable support for your business's everyday financial recordkeeping needs.",
      image: "/images/bookkeeping-documents.webp",
    },
    intro: {
      heading: "Everyday Bookkeeping, Handled With Care",
      text: "Each service below focuses on keeping your records accurate, organized, and current. Services are provided remotely and can be combined to suit your business.",
    },
    pricing: {
      visible: true,
      heading: "Bookkeeping Solutions Tailored to Your Business",
      description:
        "Every business has different bookkeeping requirements. Contact Angela to discuss your records, workload, and services needed.",
      ctaLabel: "Request a Personalized Quote",
    },
    cta: {
      visible: true,
      heading: "Let's Get Your Books Organized",
      text: "Reach out to talk through your bookkeeping needs.",
      buttonLabel: "Contact Us",
    },
  },
  about: {
    hero: {
      eyebrow: "About Us",
      heading: "About Best Biz Accounting",
      subtitle: "Experienced, dependable bookkeeping support for small businesses.",
      image: "/images/office-window.webp",
    },
    intro: {
      eyebrow: "Meet the Owner",
      heading: "Meet Angela Rotvik",
      body: "Angela Rotvik is the owner of Best Biz Accounting and brings over 20 years of bookkeeping experience to every client relationship.\n\nOver the years, Angela has supported businesses in a variety of industries, including couriers, manufacturers, rental businesses, and fuel supply companies. That experience has built a practical understanding of how accurate, organized records help a business run smoothly.\n\nToday, Best Biz Accounting provides remote bookkeeping support for small businesses, so owners can stay on top of their finances without needing an in-person office visit.",
      image: "/images/workspace-bright.webp",
      industries: ["Couriers", "Manufacturers", "Rental Businesses", "Fuel Supply Companies"],
    },
    approach: {
      visible: true,
      eyebrow: "Our Approach",
      heading: "How We Support Your Business",
      items: [
        { title: "Accuracy", text: "Careful, detail-oriented work so your records reflect what is really happening in your business." },
        { title: "Reliability", text: "Consistent, dependable support you can count on, month after month." },
        { title: "Organization", text: "Clean, well-maintained records that are easy to review when you need them." },
        { title: "Clear Communication", text: "Straightforward updates and answers, without unnecessary jargon." },
        { title: "Business-Focused Support", text: "Bookkeeping that fits how your business actually operates." },
      ] as TitleText[],
    },
    highlight: {
      visible: true,
      heading: "20+ Years of Bookkeeping Experience",
      text: "Two decades of hands-on bookkeeping across different industries and business sizes.",
    },
    cta: {
      visible: true,
      heading: "Let's Talk About Your Business",
      text: "Tell us about your bookkeeping needs and we'll take it from there.",
      buttonLabel: "Get in Touch",
    },
  },
  testimonials: {
    hero: {
      eyebrow: "Testimonials",
      heading: "Client Testimonials",
      subtitle: "Feedback from businesses we've had the opportunity to support.",
    },
    empty: {
      title: "Client feedback is coming soon",
      text: "We're gathering feedback from the businesses we support. In the meantime, we'd be happy to talk with you directly about how we can help.",
    },
    cta: {
      visible: true,
      heading: "Ready to Simplify Your Bookkeeping?",
      text: "Let's discuss your business's bookkeeping needs.",
      buttonLabel: "Contact Us",
    },
  },
  contact: {
    hero: {
      eyebrow: "Contact",
      heading: "Let's Talk About Your Bookkeeping Needs",
      subtitle: "Have a question or need bookkeeping support? We'd be happy to hear from you.",
    },
    form: {
      heading: "Send a Message",
      intro: "Fill out the form and Angela will get back to you as soon as possible.",
      successMessage: "Thank you for reaching out. Your message has been received and Angela will be in touch soon.",
    },
  },
};

export type PagesData = typeof DEFAULT_PAGES;
export type PageKey = keyof PagesData;
export const PAGE_KEYS = Object.keys(DEFAULT_PAGES) as PageKey[];

export const DEFAULT_SERVICES = [
  {
    title: "Accounts Payable",
    slug: "accounts-payable",
    icon: "file-text",
    summary: "Keep supplier bills organized and payables up to date.",
    description: "We help keep track of what your business owes, so bills are recorded accurately and nothing slips through the cracks.",
    bullets: ["Organizing supplier bills", "Tracking outstanding payables", "Maintaining payable records"],
  },
  {
    title: "Accounts Receivable",
    slug: "accounts-receivable",
    icon: "receipt",
    summary: "Stay on top of customer invoices and outstanding balances.",
    description: "We help you see who owes your business money and keep customer invoice records clear and current.",
    bullets: ["Organizing customer invoices", "Monitoring outstanding receivables", "Maintaining receivable records"],
  },
  {
    title: "Bank Reconciliations",
    slug: "bank-reconciliations",
    icon: "landmark",
    summary: "Make sure your records match your bank statements.",
    description: "Regular reconciliations confirm that your books agree with your bank and help catch discrepancies early.",
    bullets: ["Reconciling accounts", "Reviewing discrepancies", "Maintaining organized financial records"],
  },
  {
    title: "Inventory Tracking & Balancing",
    slug: "inventory-tracking",
    shortTitle: "Inventory Tracking",
    icon: "boxes",
    summary: "Keep inventory records consistent and balanced.",
    description: "We support accurate inventory records so your stock levels and books stay aligned.",
    bullets: ["Tracking inventory records", "Supporting inventory reconciliation", "Maintaining consistent inventory reporting"],
  },
  {
    title: "Payroll — T4, ROE & Remittances",
    slug: "payroll",
    shortTitle: "Payroll",
    icon: "users",
    summary: "Payroll bookkeeping support, including T4s, ROEs, and remittances.",
    description: "We help keep payroll records accurate and organized, including year-end and employment-related paperwork.",
    bullets: ["Payroll bookkeeping support", "T4 preparation support", "ROE-related processing", "Payroll remittance recordkeeping"],
  },
  {
    title: "GST Filing & Remittances",
    slug: "gst-filing",
    shortTitle: "GST Filing",
    icon: "file-badge",
    summary: "Organized GST records with filing and remittance support.",
    description: "We help organize your GST records and support the filing and remittance process.",
    bullets: ["GST record organization", "Filing support", "Remittance support"],
  },
];
