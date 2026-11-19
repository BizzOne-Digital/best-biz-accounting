import { DEFAULT_SERVICES } from "@/content/defaults";
import { adminRoute, ok } from "@/lib/admin-api";
import { isSmtpConfigured } from "@/lib/mailer";
import { ContactInquiry, Service, StoredUpload, Testimonial } from "@/models";


export const GET = adminRoute(async () => {
  const [inquiries, newInquiries, published, drafts, servicesTotal, activeServices, uploads, recentInquiries, recentTestimonials] =
    await Promise.all([
      ContactInquiry.countDocuments(),
      ContactInquiry.countDocuments({ status: "new" }),
      Testimonial.countDocuments({ published: true }),
      Testimonial.countDocuments({ published: false }),
      Service.countDocuments(),
      Service.countDocuments({ published: true }),
      StoredUpload.countDocuments(),
      ContactInquiry.find().sort({ createdAt: -1 }).limit(5).select("fullName service status createdAt").lean(),
      Testimonial.find().sort({ updatedAt: -1 }).limit(3).select("clientName published updatedAt").lean(),
    ]);

  const activity = [
    ...recentInquiries.map((i) => ({
      type: "inquiry",
      id: String(i._id),
      text: `New inquiry from ${i.fullName} (${i.service})`,
      status: i.status,
      at: i.createdAt,
    })),
    ...recentTestimonials.map((t) => ({
      type: "testimonial",
      id: String(t._id),
      text: `Testimonial from ${t.clientName} ${t.published ? "published" : "saved as draft"}`,
      status: t.published ? "published" : "draft",
      at: t.updatedAt,
    })),
  ].sort((a, b) => new Date(b.at as Date).getTime() - new Date(a.at as Date).getTime());

  return ok({
    stats: {
      inquiries,
      newInquiries,
      publishedTestimonials: published,
      draftTestimonials: drafts,
      activeServices: servicesTotal === 0 ? DEFAULT_SERVICES.length : activeServices,
      uploads,
    },
    smtpConfigured: isSmtpConfigured(),
    activity,
  });
});
