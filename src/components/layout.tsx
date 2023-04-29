// Components
import Header from "@/components/header";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      <main className="container mx-auto">{children}</main>
    </>
  );
};

export default Layout;
