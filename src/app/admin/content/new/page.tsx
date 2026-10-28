import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth";
import { storage } from "@/lib/storage";
import { AdminNavbar } from "@/components/admin/AdminNavbar";
import { ContentCardForm } from "@/components/admin/ContentCardForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Tambah Content Card — Admin Studio",
};

export default async function NewContentCardPage() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect("/admin/login");
  }

  const allProjects = storage.getProjects({ includeDrafts: true });

  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      <AdminNavbar />
      <main className="flex-grow py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ContentCardForm projects={allProjects} />
        </div>
      </main>
    </div>
  );
}
