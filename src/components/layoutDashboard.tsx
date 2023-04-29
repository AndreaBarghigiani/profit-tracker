const LayoutDashboard = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen gap-4">
      <aside>This is a test</aside>
      <main className="flex-1">{children}</main>
    </div>
  );
};

export default LayoutDashboard;
