import { NextResponse } from 'next/server';
import { databases } from '@/Models/server/config';
import { db, questionCollection } from '@/Models/name';
import slugify from '@/utils/slugify';

export async function GET() {
  const questions = await databases.listDocuments(db, questionCollection, []);
  const urls = questions.documents.map(q =>
    `<url><loc>https://riverflows.vercel.app/questions/${q.$id}/${slugify(q.title)}</loc></url>`
  ).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url><loc>https://riverflows.vercel.app/</loc></url>
<url><loc>https://riverflows.vercel.app/questions</loc></url>
${urls}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
