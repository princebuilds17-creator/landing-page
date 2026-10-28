import { redirect, notFound } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth";
import { storage } from "@/lib/storage";
import { AdminNavbar } from "@/components/admin/AdminNavbar";
import { ProjectForm } from "@/components/admin/ProjectForm";

export const dynamic = "force-dynamic";

interface EditProjectPageProps {
  params: Promise<{ id: string }>;
}

export const metadata = {
  title: "Edit Proyek — Admin Studio",
};

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect("/admin/login");
  }

  const { id } = await params;
  const project = storage.getProjectById(id);
  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      <AdminNavbar />
      <main className="flex-grow py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProjectForm initialData={project} isEditing={true} />
        </div>
      </main>
    </div>
  );
}
