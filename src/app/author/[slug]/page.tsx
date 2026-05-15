import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAuthorBySlug } from "@/lib/api";
import { AuthorView } from "./AuthorView";
import { loadAuthorPage } from "./loadAuthor";

export const revalidate = 600;

type Params = { slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const author = await getAuthorBySlug(slug);
  if (!author) return {};
  return {
    title: `บทความโดย ${author.name}`,
    description:
      author.description || `รวมบทความทั้งหมดที่เขียนโดย ${author.name}`,
  };
}

export default async function AuthorPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const data = await loadAuthorPage(slug, undefined);
  if (!data) notFound();
  return <AuthorView {...data} />;
}
