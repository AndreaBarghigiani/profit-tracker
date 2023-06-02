// Utils
import { api } from "@/utils/api";
import { formatDate, uppercaseFirst } from "@/utils/string";
import clsx from "clsx";

// Types
import type { Project } from "@prisma/client";

// Components
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const LastProjectTransaction = ({
  project,
  className,
}: {
  project: Project;
  className: string;
}) => {
  const { data: lastTx, isSuccess: isSuccessLastTransaction } =
    api.transaction.lastTransaction.useQuery(
      { projectId: project.id, projectAccruing: project.accruing },
      { enabled: !!project }
    );

  const classes = clsx("w-full", {
    [className]: !!className,
  });
  return (
    <Card className={classes}>
      {isSuccessLastTransaction && (
        <>
          <CardHeader>
            <CardTitle className="flex justify-between">
              Last Transaction
              <time className="text-xs" dateTime={lastTx.createdAt.toString()}>
                {formatDate(lastTx?.createdAt)}
              </time>
            </CardTitle>
            <CardDescription className="flex justify-between">
              Type: {lastTx ? uppercaseFirst(lastTx.type) : "unknown"}
              <time className="text-xs" dateTime={formatDate(new Date())}>
                Current: {formatDate(new Date())}
              </time>
            </CardDescription>
          </CardHeader>
          <CardContent>
            Amount: <strong>${lastTx.amount}</strong>
          </CardContent>
        </>
      )}
    </Card>
  );
};
export default LastProjectTransaction;
