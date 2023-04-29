// Components
import LayoutDashboard from "@/components/layoutDashboard";

// Types
import type { NextPageWithLayout } from "../_app";

const Transaction: NextPageWithLayout = () => {
  return (
    <>
      <h1 className="text-3xl font-semibold">Transactions</h1>
      <p>
        This is the list of all your transactions that happen in your portfolio.
      </p>
    </>
  );
};

Transaction.getLayout = function getLayout(page: React.ReactElement) {
  return <LayoutDashboard>{page}</LayoutDashboard>;
};

export default Transaction;
