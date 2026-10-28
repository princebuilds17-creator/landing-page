import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth";
import { AdminNavbar } from "@/components/admin/AdminNavbar";
import { ProjectForm } from "@/components/admin/ProjectForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Tambah Proyek Baru — Admin Studio",
};

export default async function NewProjectPage() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      <AdminNavbar />
      <main className="flex-grow py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProjectForm />
        </div>
      </main>
    </div>
  );
}
