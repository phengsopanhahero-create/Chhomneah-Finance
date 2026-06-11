/**
 * Rural Finance Hub Cambodia - Official Website Content Scraper
 *
 * Fetches each institution's official website (src/lib/data/institutions.ts)
 * and extracts visible page text, including Khmer-script content, so it can
 * be reviewed and turned into loan_products rows (rates, terms, descriptions).
 *
 * Bank/MFI/wallet sites differ wildly in structure and many render rates via
 * client-side JS, so this script does NOT attempt to auto-fill interest
 * rates - it pulls raw text + any Khmer paragraphs for a human (or a follow-
 * up AI pass) to turn into structured loan_products rows.
 *
 * Usage:
 *   npm run scrape:products                 # all institutions
 *   npm run scrape:products -- --type=mfi
 *   npm run scrape:products -- --slug=aba-bank
 *
 * Output:
 *   scripts/output/site_content/<slug>.json
 */
import { config } from "dotenv";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

import * as cheerio from "cheerio";

config({ path: path.join(__dirname, "..", ".env.local") });
config();

import { INSTITUTIONS, type InstitutionType } from "../src/lib/data/institutions";

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

const KHMER_REGEX = /[ក-៿]/;

interface SiteContent {
  slug: string;
  name: string;
  website: string;
  fetchedAt: string;
  title: string | null;
  headings: string[];
  khmerParagraphs: string[];
  englishParagraphs: string[];
  links: { href: string; text: string }[];
  error?: string;
}

async function fetchHtml(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: { "User-Agent": USER_AGENT, "Accept-Language": "km,en;q=0.8" },
    redirect: "follow",
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} for ${url}`);
  }
  return res.text();
}

function extractContent(html: string): Omit<SiteContent, "slug" | "name" | "website" | "fetchedAt"> {
  const $ = cheerio.load(html);

  $("script, style, noscript").remove();

  const title = $("title").first().text().trim() || null;

  const headings: string[] = [];
  $("h1, h2, h3").each((_, el) => {
    const text = $(el).text().trim().replace(/\s+/g, " ");
    if (text) headings.push(text);
  });

  const khmerParagraphs = new Set<string>();
  const englishParagraphs = new Set<string>();

  $("p, li, td, span, div").each((_, el) => {
    const text = $(el).text().trim().replace(/\s+/g, " ");
    if (!text || text.length < 4 || text.length > 500) return;

    if (KHMER_REGEX.test(text)) {
      khmerParagraphs.add(text);
    } else if (/[a-zA-Z]/.test(text) && /(loan|rate|interest|%|deposit|account)/i.test(text)) {
      englishParagraphs.add(text);
    }
  });

  const links: { href: string; text: string }[] = [];
  $("a[href]").each((_, el) => {
    const text = $(el).text().trim().replace(/\s+/g, " ");
    const href = $(el).attr("href") ?? "";
    if (text && /loan|credit|product|rate|ប្រាក់កម្ចី|ឥណទាន/i.test(text)) {
      links.push({ href, text });
    }
  });

  return {
    title,
    headings: headings.slice(0, 30),
    khmerParagraphs: [...khmerParagraphs].slice(0, 100),
    englishParagraphs: [...englishParagraphs].slice(0, 100),
    links: links.slice(0, 30),
  };
}

function parseArgs() {
  const args = process.argv.slice(2);
  const typeArg = args.find((a) => a.startsWith("--type="))?.split("=")[1];
  const slugArg = args.find((a) => a.startsWith("--slug="))?.split("=")[1];

  return {
    type: typeArg as InstitutionType | undefined,
    slug: slugArg,
  };
}

async function main() {
  const { type, slug } = parseArgs();

  let institutions = INSTITUTIONS;
  if (type) institutions = institutions.filter((i) => i.type === type);
  if (slug) institutions = institutions.filter((i) => i.slug === slug);

  if (institutions.length === 0) {
    console.error("No institutions matched the given --type/--slug filters.");
    process.exit(1);
  }

  const outDir = path.join(__dirname, "output", "site_content");
  await mkdir(outDir, { recursive: true });

  console.log(`Fetching official websites for ${institutions.length} institution(s)...`);

  // Some sites trigger an internal undici parser assertion that escapes
  // normal try/catch as an uncaughtException on a later tick (after the
  // fetch already resolved/rejected) - swallow it globally so one bad site
  // doesn't abort the whole batch.
  let lastFatalError: string | null = null;
  process.on("uncaughtException", (err) => {
    lastFatalError = err instanceof Error ? err.message : String(err);
  });

  for (const institution of institutions) {
    console.log(`  -> ${institution.name} (${institution.website})`);
    const result: SiteContent = {
      slug: institution.slug,
      name: institution.name,
      website: institution.website,
      fetchedAt: new Date().toISOString(),
      title: null,
      headings: [],
      khmerParagraphs: [],
      englishParagraphs: [],
      links: [],
    };

    lastFatalError = null;
    try {
      const html = await fetchHtml(institution.website);
      Object.assign(result, extractContent(html));
      console.log(
        `     ok - ${result.khmerParagraphs.length} Khmer text blocks, ${result.links.length} relevant links`
      );
    } catch (err) {
      result.error = err instanceof Error ? err.message : String(err);
    }

    if (!result.title && lastFatalError) {
      result.error = lastFatalError;
    }

    if (result.error && !result.title) {
      console.error(`     failed: ${result.error}`);
    }

    const outFile = path.join(outDir, `${institution.slug}.json`);
    await writeFile(outFile, JSON.stringify(result, null, 2), "utf-8");

    // Be polite to target servers.
    await new Promise((r) => setTimeout(r, 500));
  }

  console.log(`\nDone. Review extracted content in ${outDir}`);
  console.log(
    "Use the Khmer text blocks and links to manually (or with an AI pass) build entries for " +
      "src/lib/data/loanProducts.ts and supabase/seed.sql."
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
