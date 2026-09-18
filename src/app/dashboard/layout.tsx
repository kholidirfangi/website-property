import DashboardSidebar from "./DashboardSidebar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-gray-100 md:flex">
      <DashboardSidebar />

      <main className="min-w-0 flex-1">
        {children}
      </main>
    </div>
  );
}