// Utils
import { api } from "@/utils/api";
import { currencyConverter } from "@/utils/string";

// Components
import Heading from "@/components/ui/heading";

const WalletInfo = () => {
  const { data: userStats, isSuccess: isUserStatsSuccess } =
    api.wallet.getUserStats.useQuery();

  return (
    <div className="p-2">
      <Heading size="h4">General Info</Heading>
      {isUserStatsSuccess && (
        <ul>
          <li>
            <strong>Total:</strong>{" "}
            {currencyConverter({
              amount: userStats.wallet.total,
              showSign: true,
            })}
          </li>
          <li>
            <strong>Total Deposits:</strong>{" "}
            {currencyConverter({
              amount: userStats.wallet.totalDeposit,
              showSign: true,
            })}
          </li>
          <li>
            <strong>Total Withdraw:</strong>{" "}
            {currencyConverter({
              amount: userStats.wallet.totalWithdraw,
              showSign: true,
            })}
          </li>
        </ul>
      )}
    </div>
  );
};

export default WalletInfo;
