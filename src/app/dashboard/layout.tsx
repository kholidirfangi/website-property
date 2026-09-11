import DashboardSidebar from "./DashboardSidebar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <DashboardSidebar />

      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}