import { MetadataRoute } from "next";
import { storage } from "@/lib/storage";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://princelab.id";

  // Only published projects
  const publishedProjects = storage.getProjects({ includeDrafts: false });

  const projectRoutes: MetadataRoute.Sitemap = publishedProjects.map((p) => ({
    url: `${baseUrl}/projects/${p.slug}`,
    lastModified: new Date(p.updatedAt),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...projectRoutes,
  ];
}
