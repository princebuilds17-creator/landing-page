import { redirect, notFound } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth";
import { storage } from "@/lib/storage";
import { AdminNavbar } from "@/components/admin/AdminNavbar";
import { ContentCardForm } from "@/components/admin/ContentCardForm";

export const dynamic = "force-dynamic";

interface EditContentCardPageProps {
  params: Promise<{ id: string }>;
}

export const metadata = {
  title: "Edit Content Card — Admin Studio",
};

export default async function EditContentCardPage({ params }: EditContentCardPageProps) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect("/admin/login");
  }

  const { id } = await params;
  const card = storage.getContentCardById(id);
  if (!card) {
    notFound();
  }

  const allProjects = storage.getProjects({ includeDrafts: true });

  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      <AdminNavbar />
      <main className="flex-grow py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ContentCardForm initialData={card} projects={allProjects} isEditing={true} />
        </div>
      </main>
    </div>
  );
}
