// Components
import Footer from "@/components/footer";

const LayoutMarketing = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {children}
      <Footer />
    </>
  );
};

export default LayoutMarketing;
