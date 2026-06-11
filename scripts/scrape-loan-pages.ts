/**
 * Rural Finance Hub Cambodia - Loan Product Page Scraper (pass 2)
 *
 * Reads scripts/output/site_content/<slug>.json (produced by
 * scrape-loan-products.ts), which contains links to individual loan/credit
 * product pages found on each institution's homepage. Fetches each of those
 * pages and extracts the main visible text (with nav/header/footer
 * stripped), so real interest rates, terms, and amounts can be read off
 * and turned into loanProducts.ts entries.
 *
 * Usage:
 *   npm run scrape:loan-pages                 # all institutions
 *   npm run scrape:loan-pages -- --slug=amk-microfinance
 *
 * Output:
 *   scripts/output/product_pages/<slug>.json
 */
import { readFile, writeFile, mkdir, readdir } from "fs/promises";
import path from "path";

import * as cheerio from "cheerio";

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

const SITE_CONTENT_DIR = path.join(__dirname, "output", "site_content");
const OUT_DIR = path.join(__dirname, "output", "product_pages");

interface SiteContent {
  slug: string;
  name: string;
  website: string;
  links: { href: string; text: string }[];
}

interface ProductPage {
  url: string;
  linkText: string;
  title: string | null;
  text: string | null;
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

function extractMainText(html: string): { title: string | null; text: string } {
  const $ = cheerio.load(html);
  $("script, style, noscript, header, footer, nav").remove();

  const title = $("title").first().text().trim() || null;
  const text = $("body").text().replace(/\s+/g, " ").trim();

  return { title, text };
}

function parseArgs() {
  const args = process.argv.slice(2);
  const slugArg = args.find((a) => a.startsWith("--slug="));
  return { slug: slugArg ? slugArg.split("=")[1] : undefined };
}

async function main() {
  const { slug } = parseArgs();

  await mkdir(OUT_DIR, { recursive: true });

  let files = await readdir(SITE_CONTENT_DIR);
  files = files.filter((f) => f.endsWith(".json"));
  if (slug) files = files.filter((f) => f === `${slug}.json`);

  let lastFatalError: string | null = null;
  process.on("uncaughtException", (err) => {
    lastFatalError = err instanceof Error ? err.message : String(err);
  });

  for (const file of files) {
    const raw = await readFile(path.join(SITE_CONTENT_DIR, file), "utf-8");
    const site: SiteContent = JSON.parse(raw);

    if (!site.links || site.links.length === 0) {
      continue;
    }

    // Dedupe by URL, keep first link text seen.
    const seen = new Map<string, string>();
    for (const link of site.links) {
      try {
        const url = new URL(link.href, site.website).toString();
        if (!seen.has(url)) seen.set(url, link.text);
      } catch {
        // ignore invalid hrefs
      }
    }

    console.log(`${site.name}: ${seen.size} product page(s)`);

    const pages: ProductPage[] = [];

    for (const [url, linkText] of seen) {
      lastFatalError = null;
      const page: ProductPage = { url, linkText, title: null, text: null };

      try {
        console.log(`  -> ${linkText} (${url})`);
        const html = await fetchHtml(url);
        const { title, text } = extractMainText(html);
        page.title = title;
        page.text = text;
      } catch (err) {
        page.error = err instanceof Error ? err.message : String(err);
      }

      if (!page.text && lastFatalError) {
        page.error = lastFatalError;
      }

      if (page.error) {
        console.error(`     failed: ${page.error}`);
      }

      pages.push(page);

      // Be polite to target servers.
      await new Promise((r) => setTimeout(r, 400));
    }

    await writeFile(
      path.join(OUT_DIR, `${site.slug}.json`),
      JSON.stringify(pages, null, 2)
    );
  }

  console.log(`\nDone. Review extracted pages in ${OUT_DIR}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
