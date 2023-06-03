// Utils
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import clsx from "clsx";
import { formatDate, currencyConverter } from "@/utils/string";

// Types
import type { Hodl, Token } from "@prisma/client";

// Components
import Image from "next/image";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { buttonVariants, Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Trash2, RefreshCcw } from "lucide-react";
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
  const utils = api.useContext();
  const router = useRouter();
  const { mutate: deletePosition, isLoading: isDeletingPosition } =
    api.hodl.delete.useMutation({
      onSuccess: async () => {
        await utils.wallet.get.invalidate().then(async () => {
          await router.push(`/dashboard/`);
        });
      },
    });

  const iconClass = clsx("h-4 w-4", {
    "animate-spin": isDeletingPosition,
  });
  return (
    <Card className="w-full">
      <div className="flex items-center gap-4 px-4">
        {position.token?.iconUrl ? (
          <Image
            src={position.token.iconUrl}
            alt={position.token.name}
            className="rounded-full"
            width={40}
            height={40}
          />
        ) : null}
        <CardHeader className="flex-1 px-0">
          <CardTitle className="flex justify-between">
            <Link href={`/hodl/${position.id}/`}>{position.token.name}</Link>
            <p>{currencyConverter({ amount: position.currentEvaluation })}</p>
          </CardTitle>
          <CardDescription className="flex justify-between">
            <time className="text-xs" dateTime={formatDate(position.createdAt)}>
              {formatDate(position.createdAt)}
            </time>
            <span>
              Holding:{" "}
              <strong>
                {position.currentAmount} {position.token.symbol?.toUpperCase()}
              </strong>
            </span>
          </CardDescription>
        </CardHeader>
        <div className="ml-auto text-right">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  className={buttonVariants({ variant: "ghost", size: "sm" })}
                  href={`/hodl/add/${position.id}`}
                >
                  <Plus className="h-4 w-4" />
                </Link>
              </TooltipTrigger>
              <TooltipContent className="border-foreground/20">
                <p>Add transaction</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deletePosition(position.id)}
                >
                  {isDeletingPosition ? (
                    <RefreshCcw className={iconClass} />
                  ) : (
                    <Trash2 className={iconClass} />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent className="border-foreground/20">
                <p>Delete position</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </Card>
  );
};

export default PositionCard;
