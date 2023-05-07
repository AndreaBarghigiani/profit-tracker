// Components
import Header from "@/components/header";
import Footer from "@/components/footer";

const LayoutMarketing = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
};

export default LayoutMarketing;
