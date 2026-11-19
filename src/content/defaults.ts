/**
 * Default website content. The admin portal stores overrides in MongoDB (PageContent),
 * which are merged over these defaults. Only verified business facts appear here.
 */

export const DEFAULT_SETTINGS = {
  siteName: "Best Biz Accounting",
  ownerName: "The BBA Team",
  phone: "(403) 617-2677",
  email: "angela@bestbizaccounting.ca",
  serviceArea: "Flexible Bookkeeping Services",
  logoUrl: "/brand/bba-logo.png",
  faviconUrl: "",
  footerDescription:
    "Reliable, accurate bookkeeping support for small businesses, backed by over 20 years of bookkeeping experience.",
  seoTitle: "Best Biz Accounting | Bookkeeping Services for Small Businesses",
  seoDescription:
    "Best Biz Accounting provides reliable bookkeeping services for small businesses. With over 20 years of experience, the BBA team offers support with payroll, reconciliations, GST, and more.",
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
        "Reliable, accurate, and flexible bookkeeping support for small businesses, so you can focus on growing your business.",
      image: "/images/hero-desk.webp",
      primaryCta: "Our Services",
      secondaryCta: "Contact Us",
    },
    trust: {
      visible: true,
      items: [
        { title: "20+ Years", text: "of Experience" },
        { title: "Small Business", text: "Focused" },
        { title: "Flexible", text: "Service Options" },
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
      body: "With over 20 years of bookkeeping experience, the BBA team provides dependable financial recordkeeping support to businesses across a variety of industries. From couriers and manufacturers to rental businesses and fuel supply companies, Best Biz Accounting understands the importance of accurate and organized bookkeeping.",
      image: "/images/workspace-bright.webp",
      badge: "20+ Years",
      highlights: [
        "Practical, hands-on bookkeeping experience",
        "Support built around small businesses",
        "Flexible service tailored to your needs",
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
        { title: "Flexible Bookkeeping Support", text: "Convenient bookkeeping assistance, available remotely or tailored to how your business works." },
        { title: "Personalized Service", text: "Bookkeeping support tailored to each business's actual needs." },
      ] as TitleText[],
    },
    industries: {
      visible: true,
      eyebrow: "Industry Experience",
      heading: "Bookkeeping Experience Across Different Industries",
      intro: "The BBA team has supported the bookkeeping needs of businesses in a range of industries, including:",
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
      intro: "Bookkeeping support, set up around your business in a few straightforward steps.",
      items: [
        { title: "Reach Out", text: "Call, email, or send a message through the contact form to start the conversation." },
        { title: "Discuss Your Needs", text: "We talk through your records, current workload, and the services your business needs." },
        { title: "Get a Personalized Quote", text: "You receive pricing based on your actual bookkeeping requirements, not a one-size-fits-all package." },
        { title: "Stay Organized", text: "Your books are kept accurate and up to date, so you can focus on running your business." },
      ] as TitleText[],
    },
    faq: {
      visible: true,
      eyebrow: "FAQ",
      heading: "Frequently Asked Questions",
      intro: "Answers to common questions about working with Best Biz Accounting.",
      items: [
        {
          question: "Can I request an office visit?",
          answer: "Yes. We tailor our services to your needs. Contact us to discuss what works best for your business.",
        },
        {
          question: "How much do your bookkeeping services cost?",
          answer: "Pricing is personalized. Every business has different records, volume, and needs, so contact us to discuss your situation and request a quote.",
        },
        {
          question: "What bookkeeping services do you offer?",
          answer: "Services include accounts payable, accounts receivable, bank reconciliations, inventory tracking and balancing, payroll support (including T4s, ROEs, and remittances), GST filing and remittance support, NUANS and new business name searches, annual corporate filing, and data migration.",
        },
        {
          question: "What types of businesses do you work with?",
          answer: "Best Biz Accounting focuses on small businesses. The BBA team has bookkeeping experience with couriers, manufacturers, rental businesses, fuel supply companies, and other small businesses.",
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
      primaryLabel: "Contact Us",
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
      text: "Each service below focuses on keeping your records accurate, organized, and current. Services can be combined and tailored to suit your business.",
    },
    pricing: {
      visible: true,
      heading: "Bookkeeping Solutions Tailored to Your Business",
      description:
        "Every business has different bookkeeping requirements. Contact us to discuss your records, workload, and services needed.",
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
      subtitle: "Experienced, dependable, and reliable bookkeeping support for small businesses.",
      image: "/images/office-window.webp",
    },
    intro: {
      eyebrow: "Who We Are",
      heading: "Meet the BBA Team",
      body: "Best Biz Accounting brings over 20 years of bookkeeping experience to every client relationship.\n\nOver the years, the BBA team has supported businesses in a variety of industries, including couriers, manufacturers, rental businesses, and fuel supply companies. That experience has built a practical understanding of how accurate, organized records help a business run smoothly.\n\nToday, Best Biz Accounting provides flexible bookkeeping support for small businesses, tailored to the way each business works, so owners can stay on top of their finances.",
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
      intro: "Fill out the form and our team will get back to you as soon as possible.",
      successMessage: "Thank you for reaching out. Your message has been received and our team will be in touch soon.",
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
  {
    title: "NUANS Business Name Search",
    slug: "nuans-business-name-search",
    shortTitle: "NUANS Name Search",
    icon: "search",
    summary: "NUANS name search reports to check a proposed business name.",
    description: "Before you register or incorporate, a NUANS report helps show whether a proposed business name may conflict with existing names and trademarks.",
    bullets: ["Requesting NUANS name search reports", "Reviewing the search results with you", "Support before you register or incorporate"],
  },
  {
    title: "Annual Corporate Filing",
    slug: "annual-corporate-filing",
    shortTitle: "Annual Corporate Filing",
    icon: "building",
    summary: "Help keeping your corporation's annual filings current.",
    description: "We help you keep up with your corporation's annual filing requirements so your records stay current and in good standing.",
    bullets: ["Annual return filing support", "Tracking filing deadlines", "Organized corporate records"],
  },
  {
    title: "New Business Name Search",
    slug: "new-business-name-search",
    shortTitle: "Business Name Search",
    icon: "clipboard",
    summary: "Support checking name availability for a new business.",
    description: "Starting something new? We help you check whether the business name you have in mind is available before you move forward.",
    bullets: ["Business name availability checks", "Reviewing name options with you", "Support before registering your business"],
  },
  {
    title: "Data Migration",
    slug: "data-migration",
    shortTitle: "Data Migration",
    icon: "database",
    summary: "Move your financial records into a new bookkeeping system.",
    description: "Changing bookkeeping systems? We help transfer your existing financial data and check that everything carries over accurately.",
    bullets: ["Transferring existing financial data", "Reviewing migrated records for accuracy", "Organized setup in your new system"],
  },
];

/** Real, client-provided testimonials (verbatim). Imported into the database on first admin visit. */
export const DEFAULT_TESTIMONIALS = [
  {
    seedKey: "julie-lemon-2023",
    clientName: "Julie M. Lemon, M.S., BCBA",
    businessName: "Management Consultant, LNN Protection",
    content:
      "I can't say enough wonderful things about Angela and the services she provides. She is organized, thorough and expedient with all aspects of our accounting needs. I can't imagine using anyone else to support us with current and future business endeavors!",
    rating: null as number | null,
    date: "2023-12-23",
    published: true,
    featured: true,
  },
  {
    seedKey: "mark-macdonald-2024",
    clientName: "Mark Macdonald",
    businessName: "President & CEO, Enhance ICD (Canada) Inc.",
    content:
      "Angela Rotvik and Best Biz have been our primary source of bookkeeping and inventory management since July 2016. The comprehensive and efficient support we have received has been better than all prior service providers. Such hard work and dedication are a rare commodity these days.",
    rating: null as number | null,
    date: "2024-01-09",
    published: true,
    featured: true,
  },
];
