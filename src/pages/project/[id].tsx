// Utils
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import { formatDate } from "@/utils/string";
import { columns } from "@/components/custom/Projects/Table/columns";

// Types
import type { NextPage } from "next";

// Components
import { Trash } from "lucide-react";
import Heading from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/custom/Projects/Table/data-table";
import ProjectStats from "@/components/custom/ProjectStats";
import LastProjectTransaction from "@/components/custom/LastProjectTransaction";

const ProjectPage: NextPage = () => {
  const router = useRouter();

  const { data: project, isLoading } = api.project.get.useQuery(
    { projectId: router.query.id as string },
    { enabled: !!router.query.id },
  );

  const {
    data: transactions,
    isLoading: isLoadingTransactions,
    isSuccess: isTransactionsSuccess,
  } = api.transaction.list.useQuery(
    {
      projectId: router.query.id as string,
      orderBy: "desc",
    },
    { enabled: !!router.query.id },
  );

  const { mutate: deleteProject } = api.project.delete.useMutation({
    onSuccess: async () => {
      await router.push(`/dashboard/`);
    },
  });

  if (isLoading) return <div>Loading...</div>;

  if (!project) return <div>Project not found</div>;

  return (
    <div className="space-y-4">
      <header>
        <Heading size={"page"} gradient="gold" spacing={"massive"}>
          {project.name}
        </Heading>

        <p className="text-center text-sm">
          Created at: {formatDate(project.createdAt)}
        </p>

        <p className="text-center">{project.description}</p>
      </header>

      <article>
        <header className="flex items-center">
          <Heading as="h2" size="h2">
            Project Details
          </Heading>
          <div className="ml-auto text-right text-sm">
            <Button
              variant="ghost-danger"
              onClick={() => deleteProject(project.id)}
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete Project
            </Button>
          </div>
        </header>

        <ProjectStats project={project} />

        <LastProjectTransaction className="mb-8 mt-3" project={project} />

        {isTransactionsSuccess && (
          <DataTable columns={columns} data={transactions} project={project} />
        )}
      </article>
    </div>
  );
};

export default ProjectPage;
