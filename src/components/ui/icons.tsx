import {
  BookOpen,
  Boxes,
  Briefcase,
  Building2,
  Calculator,
  ChartColumn,
  ClipboardList,
  Database,
  FileBadge,
  FileSpreadsheet,
  FileText,
  Landmark,
  PiggyBank,
  ReceiptText,
  Search,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";

/** Icons an admin can assign to a service. Keys are stored in the database. */
export const SERVICE_ICONS: Record<string, { label: string; Icon: LucideIcon }> = {
  "file-text": { label: "Document", Icon: FileText },
  receipt: { label: "Receipt", Icon: ReceiptText },
  landmark: { label: "Bank", Icon: Landmark },
  boxes: { label: "Inventory", Icon: Boxes },
  users: { label: "People", Icon: Users },
  "file-badge": { label: "Filing", Icon: FileBadge },
  calculator: { label: "Calculator", Icon: Calculator },
  spreadsheet: { label: "Spreadsheet", Icon: FileSpreadsheet },
  chart: { label: "Chart", Icon: ChartColumn },
  clipboard: { label: "Checklist", Icon: ClipboardList },
  wallet: { label: "Wallet", Icon: Wallet },
  savings: { label: "Savings", Icon: PiggyBank },
  briefcase: { label: "Briefcase", Icon: Briefcase },
  book: { label: "Ledger", Icon: BookOpen },
  search: { label: "Search", Icon: Search },
  building: { label: "Corporation", Icon: Building2 },
  database: { label: "Data", Icon: Database },
};

export function ServiceIcon({ name, className }: { name: string; className?: string }) {
  const Icon = SERVICE_ICONS[name]?.Icon ?? FileText;
  return <Icon className={className} aria-hidden="true" strokeWidth={1.6} />;
}
