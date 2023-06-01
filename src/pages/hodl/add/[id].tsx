// Utils
import { api } from "@/utils/api";
import { prisma } from "@/server/db";
import { getHodl } from "@/server/api/routers/hodl";
import { clsx } from "clsx";
import AddHodlPositionForm from "@/components/addHodlPositionForm";

// Types
import type {
  InferGetServerSidePropsType,
  GetServerSidePropsContext,
  NextPage,
} from "next";

// Components
import Heading from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipProvider,
  TooltipContent,
} from "@/components/ui/tooltip";
import { RefreshCcw } from "lucide-react";

const AddHodlPosition: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ tokenId, hodlId }) => {
  const utils = api.useContext();

  const {
    data: token,
    isLoading: isTokenLoading,
    isSuccess: isTokenSuccess,
  } = api.token.get.useQuery({
    tokenId,
  });

  const { mutateAsync: updatePrice, isLoading: isPriceLoading } =
    api.token.updatePrice.useMutation({
      onSuccess: async () => {
        await utils.token.get.invalidate();
      },
    });

  const iconClass = clsx("h-4 w-4 text-stone-400", {
    "animate-spin": isPriceLoading,
  });

  return (
    <div>
      <Heading size="page" gradient="gold" spacing="massive">
        Your positions for {isTokenLoading ? "..." : token?.name}
      </Heading>
      <p className="mb-4 text-center text-lg text-stone-400">
        Are you buying or selling?
      </p>

      <Heading size="h3" className="text-center text-stone-400">
        Current evaluation
      </Heading>

      <section className="mb-4 flex items-center justify-center gap-4">
        <p className="text-center text-stone-400">
          1 {token?.name} = ${token?.latestPrice}
        </p>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              {isTokenSuccess && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => updatePrice({ tokenId: token.coingecko_id })}
                >
                  <RefreshCcw className={iconClass} />
                </Button>
              )}
            </TooltipTrigger>
            <TooltipContent className="border-foreground/20">
              <p>Update price</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </section>
      {isTokenSuccess && (
        <AddHodlPositionForm type="full" hodlId={hodlId} tokenId={tokenId} />
      )}
    </div>
  );
};

export default AddHodlPosition;

export async function getServerSideProps(
  context: GetServerSidePropsContext<{ id: string }>
) {
  if (!context.params?.id) return;

  const hodl = await getHodl({
    hodlId: context.params.id,
    prisma,
  });

  return {
    props: {
      tokenId: hodl.tokenId,
      hodlId: context.params.id,
    },
  };
}
