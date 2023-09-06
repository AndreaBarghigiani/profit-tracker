// Utils
import { api } from "@/utils/api";

// Types
import type { ReactElement } from "react";
import { Role } from "@prisma/client";

// Components

const OnlyAdmin = ({ children }: { children: ReactElement }) => {
  const { data: userRole } = api.user.getRole.useQuery();

  return !!userRole?.role && userRole.role === Role.ADMIN ? children : null;
};

export default OnlyAdmin;
