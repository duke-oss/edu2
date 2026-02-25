export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-base-200 flex items-center justify-center px-4 py-12">
      {children}
    </div>
  );
}
