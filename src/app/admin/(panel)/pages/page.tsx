import type { Metadata } from "next";
import { PageEditor } from "@/components/admin/page-editor";

export const metadata: Metadata = { title: "Pages" };

export default function Page() {
  return <PageEditor />;
}
