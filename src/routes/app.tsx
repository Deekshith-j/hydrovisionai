import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppSidebar } from "@/components/hv/AppSidebar";
import { TopHeader } from "@/components/hv/TopHeader";

export const Route = createFileRoute("/app")({
  head: () => ({
    meta: [
      { title: "HydroVision AI · Water Intelligence Console" },
      {
        name: "description",
        content: "Real-time water quality monitoring, AI prediction, and geospatial intelligence.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AppLayout,
});

function AppLayout() {
  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopHeader />
        <main className="mx-auto w-full max-w-[1600px] flex-1 px-4 py-6 sm:px-6 sm:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
