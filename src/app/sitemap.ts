import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://randomholiday.org/",
      lastModified: new Date(),
    },
    {
      url: "https://randomholiday.org/info",
      lastModified: new Date(),
    },
  ];
}
