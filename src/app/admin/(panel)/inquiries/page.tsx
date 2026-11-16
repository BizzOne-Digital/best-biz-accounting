import type { Metadata } from "next";
import { InquiriesManager } from "@/components/admin/inquiries-manager";

export const metadata: Metadata = { title: "Contact Inquiries" };

export default function Page() {
  return <InquiriesManager />;
}
