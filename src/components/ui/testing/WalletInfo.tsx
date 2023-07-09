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
      <Heading size="h4" className="mb-0">
        General Info
      </Heading>
      <p className="mb-4 text-xs text-dog-400">
        Section added just for testing purposes
      </p>
      {isUserStatsSuccess && (
        <>
          <ul>
            <li>
              <strong>Exposure:</strong>{" "}
              {currencyConverter({
                amount: userStats.totals.exposure,
                showSign: true,
              })}
            </li>
            <li>
              <strong>Liquid Funds:</strong>{" "}
              {currencyConverter({
                amount: userStats.wallet.liquidFunds,
                showSign: true,
              })}
            </li>
            <li>
              <strong>Profits:</strong>{" "}
              {currencyConverter({
                amount: userStats.totals.profits,
                showSign: true,
              })}
            </li>
          </ul>
          {/* <Heading size="h4" className="mb-0">
            Interests
          </Heading>
          <ul>
            <li>
              <strong>Total Withdraw:</strong>{" "}
              {currencyConverter({
                amount: userStats.wallet.profits,
                showSign: true,
              })}
            </li>
          </ul> */}
        </>
      )}
    </div>
  );
};

export default WalletInfo;
