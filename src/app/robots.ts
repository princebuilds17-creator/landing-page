import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/projects", "/projects/*"],
        disallow: ["/admin", "/admin/*", "/api/*"],
      },
    ],
    sitemap: "https://princelab.id/sitemap.xml",
  };
}
