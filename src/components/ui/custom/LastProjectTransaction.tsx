// Utils
import { api } from "@/utils/api";
import { formatDate, uppercaseFirst } from "@/utils/string";

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

const LastProjectTransaction = ({ project }: { project: Project }) => {
  const { data: lastTx, isSuccess: isSuccessLastTransaction } =
    api.transaction.lastTransaction.useQuery(
      { projectId: project.id, projectAccruing: project.accruing },
      { enabled: !!project }
    );

  return (
    <Card className="w-full">
      {isSuccessLastTransaction && (
        <>
          <CardHeader>
            <CardTitle className="flex justify-between">
              Last Transaction
              <time className="text-xs" dateTime={lastTx.createdAt.toString()}>
                {formatDate.format(lastTx?.createdAt)}
              </time>
            </CardTitle>
            <CardDescription className="flex justify-between">
              Type: {lastTx ? uppercaseFirst(lastTx.type) : "unknown"}
              <time
                className="text-xs"
                dateTime={formatDate.format(new Date())}
              >
                Current: {formatDate.format(new Date())}
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
