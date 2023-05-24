// Utils
import { formatDate, currencyConverter } from "@/utils/string";

// Types
import type { Hodl, Token } from "@prisma/client";

// Components
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { MoreVertical, Plus } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipProvider,
  TooltipContent,
} from "@/components/ui/tooltip";

type PositionCartProps = Hodl & {
  token: Token;
};
const PositionCard = ({ position }: { position: PositionCartProps }) => {
  return (
    <Card className="w-full">
      <div className="flex items-center gap-4">
        <CardHeader className="flex-1">
          <CardTitle className="flex justify-between">
            {position.token.name}
            <p>{currencyConverter(position.currentEvaluation)}</p>
          </CardTitle>
          <CardDescription className="flex justify-between">
            <time
              className="text-xs"
              dateTime={formatDate.format(position.createdAt)}
            >
              {formatDate.format(position.createdAt)}
            </time>
            <span>
              Holding:{" "}
              <strong>
                {position.currentAmount} {position.token.symbol}
              </strong>
            </span>
          </CardDescription>
        </CardHeader>
        <div className="ml-auto text-right">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  className={buttonVariants({ variant: "ghost" })}
                  href={`/hodl/add/${position.id}`}
                >
                  <Plus className="h-4 w-4" />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add transaction</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Button variant={"ghost"}>
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default PositionCard;
