import type { Metadata } from "next";
import { NotificationsPageContent } from "./_components/notifications-page-content";

export const metadata: Metadata = {
  title: "Notificaciones",
};

export default function NotificationsPage() {
  return <NotificationsPageContent />;
}
