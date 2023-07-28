// Utils
import { prisma } from "@/server/db";
import { getToken } from "@/server/api/routers/token";

// Types
import type {
  InferGetServerSidePropsType,
  GetServerSidePropsContext,
  NextPage,
} from "next";

// Components
import AddCustomTokenForm from "@/components/ui/custom/AddCustomTokenForm";
import Heading from "@/components/ui/heading";

const AddHodlPosition = () => {
  return (
    <div>
      <Heading size="page" gradient="gold" spacing="massive">
        Custom Token
      </Heading>

      <div className="mx-auto w-2/3">
        <AddCustomTokenForm />
      </div>
    </div>
  );
};

export default AddHodlPosition;
