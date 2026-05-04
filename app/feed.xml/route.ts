export async function GET() {
  const baseUrl = "https://astrosure.in"
  const blogPosts = [
    {
      title: "Understanding Your Birth Chart",
      description: "Learn how to read and interpret your Kundali chart for personal insights",
      pubDate: new Date("2024-01-15"),
      slug: "understanding-birth-chart",
    },
    {
      title: "Manglik Dosha: Myth vs Reality",
      description: "Comprehensive guide to Manglik Dosha and its impact on relationships",
      pubDate: new Date("2024-01-20"),
      slug: "manglik-dosha-guide",
    },
    {
      title: "Panchang Calendar Explained",
      description: "How to use Panchang for finding auspicious times and muhurat",
      pubDate: new Date("2024-01-25"),
      slug: "panchang-calendar-guide",
    },
  ]

  const rssContent = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>AstroSure Blog - Vedic Astrology Insights</title>
    <link>${baseUrl}/blog</link>
    <description>Latest articles and guides on Vedic astrology, Kundali analysis, and spiritual insights</description>
    <language>en-in</language>
    <copyright>© 2024 AstroSure. All rights reserved.</copyright>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <ttl>1440</ttl>
    ${blogPosts
      .map(
        (post) => `
    <item>
      <title>${post.title}</title>
      <link>${baseUrl}/blog/${post.slug}</link>
      <description>${post.description}</description>
      <pubDate>${post.pubDate.toUTCString()}</pubDate>
      <guid>${baseUrl}/blog/${post.slug}</guid>
    </item>
      `
      )
      .join("")}
  </channel>
</rss>`

  return new Response(rssContent, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  })
}

