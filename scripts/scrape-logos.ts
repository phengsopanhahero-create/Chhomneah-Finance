/**
 * Rural Finance Hub Cambodia - Institution Logo Scraper
 *
 * Fetches each institution's official website (src/lib/data/institutions.ts)
 * and tries to locate its logo (header <img>, <link rel="icon">, or
 * Open Graph image), then downloads it to public/logos/<slug>.<ext>.
 *
 * Usage:
 *   npm run scrape:logos                 # all institutions
 *   npm run scrape:logos -- --type=mfi
 *   npm run scrape:logos -- --slug=aba-bank
 *
 * Output:
 *   public/logos/<slug>.<ext>
 *   scripts/output/logos.json  (summary of what was found/downloaded)
 */
import { writeFile, mkdir } from "fs/promises";
import path from "path";

import * as cheerio from "cheerio";

import { INSTITUTIONS, type InstitutionType } from "../src/lib/data/institutions";

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

const LOGOS_DIR = path.join(__dirname, "..", "public", "logos");
const OUTPUT_DIR = path.join(__dirname, "output");

interface LogoResult {
  slug: string;
  name: string;
  website: string;
  logoUrl: string | null;
  savedAs: string | null;
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

/** Pick the most likely logo image URL from the page's HTML. */
function findLogoUrl(html: string, baseUrl: string): string | null {
  const $ = cheerio.load(html);

  const candidates: { url: string; score: number }[] = [];

  const addCandidate = (url: string | undefined, score: number) => {
    if (!url) return;
    try {
      const resolved = new URL(url, baseUrl).toString();
      candidates.push({ url: resolved, score });
    } catch {
      // ignore invalid URLs
    }
  };

  // <img> tags whose src/alt/class/id hints at "logo"
  $("img").each((_, el) => {
    const src = $(el).attr("src") || $(el).attr("data-src");
    const attrs = [
      $(el).attr("alt"),
      $(el).attr("class"),
      $(el).attr("id"),
      src,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    if (attrs.includes("logo")) {
      addCandidate(src, 100);
    }
  });

  // Open Graph / Twitter image
  addCandidate($('meta[property="og:image"]').attr("content"), 60);
  addCandidate($('meta[name="twitter:image"]').attr("content"), 55);

  // Apple touch icon / high-res favicon
  $('link[rel*="apple-touch-icon"]').each((_, el) => {
    addCandidate($(el).attr("href"), 50);
  });
  $('link[rel*="icon"]').each((_, el) => {
    const href = $(el).attr("href");
    const sizes = $(el).attr("sizes") || "";
    const score = sizes.includes("192") || sizes.includes("512") ? 45 : 30;
    addCandidate(href, score);
  });

  if (candidates.length === 0) return null;

  candidates.sort((a, b) => b.score - a.score);
  return candidates[0].url;
}

function extensionFromContentType(contentType: string | null, url: string): string {
  if (contentType) {
    if (contentType.includes("png")) return "png";
    if (contentType.includes("jpeg") || contentType.includes("jpg")) return "jpg";
    if (contentType.includes("svg")) return "svg";
    if (contentType.includes("webp")) return "webp";
    if (contentType.includes("x-icon") || contentType.includes("vnd.microsoft.icon")) return "ico";
    if (contentType.includes("gif")) return "gif";
  }

  const extMatch = url.match(/\.([a-zA-Z0-9]+)(?:\?.*)?$/);
  const ext = extMatch?.[1]?.toLowerCase();
  if (ext && ["png", "jpg", "jpeg", "svg", "webp", "ico", "gif"].includes(ext)) {
    return ext === "jpeg" ? "jpg" : ext;
  }

  return "png";
}

async function downloadLogo(logoUrl: string, slug: string): Promise<string> {
  const res = await fetch(logoUrl, {
    headers: { "User-Agent": USER_AGENT },
    redirect: "follow",
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} for ${logoUrl}`);
  }

  const contentType = res.headers.get("content-type");
  const ext = extensionFromContentType(contentType, logoUrl);
  const buffer = Buffer.from(await res.arrayBuffer());

  const filename = `${slug}.${ext}`;
  await writeFile(path.join(LOGOS_DIR, filename), buffer);
  return filename;
}

function parseArgs() {
  const args = process.argv.slice(2);
  const typeArg = args.find((a) => a.startsWith("--type="));
  const slugArg = args.find((a) => a.startsWith("--slug="));
  return {
    type: typeArg ? (typeArg.split("=")[1] as InstitutionType) : undefined,
    slug: slugArg ? slugArg.split("=")[1] : undefined,
  };
}

async function main() {
  const { type, slug } = parseArgs();

  await mkdir(LOGOS_DIR, { recursive: true });
  await mkdir(OUTPUT_DIR, { recursive: true });

  let institutions = INSTITUTIONS;
  if (type) institutions = institutions.filter((i) => i.type === type);
  if (slug) institutions = institutions.filter((i) => i.slug === slug);

  const results: LogoResult[] = [];

  for (const institution of institutions) {
    const result: LogoResult = {
      slug: institution.slug,
      name: institution.name,
      website: institution.website,
      logoUrl: null,
      savedAs: null,
    };

    // Some sites trigger an internal undici parser assertion that escapes
    // normal try/catch as an uncaughtException - catch it here so one bad
    // site doesn't abort the whole batch.
    const onFatal = (err: unknown) => {
      result.error = err instanceof Error ? err.message : String(err);
    };
    process.once("uncaughtException", onFatal);

    try {
      console.log(`Fetching ${institution.name} (${institution.website})...`);
      const html = await fetchHtml(institution.website);
      const logoUrl = findLogoUrl(html, institution.website);

      if (!logoUrl) {
        result.error = "No logo found";
        console.warn(`  No logo found for ${institution.slug}`);
      } else {
        result.logoUrl = logoUrl;
        const savedAs = await downloadLogo(logoUrl, institution.slug);
        result.savedAs = savedAs;
        console.log(`  Saved ${savedAs}`);
      }
    } catch (err) {
      result.error = err instanceof Error ? err.message : String(err);
    } finally {
      process.removeListener("uncaughtException", onFatal);
    }

    if (result.error && !result.savedAs) {
      console.error(`  Error for ${institution.slug}: ${result.error}`);
    }

    results.push(result);
  }

  await writeFile(
    path.join(OUTPUT_DIR, "logos.json"),
    JSON.stringify(results, null, 2)
  );

  const ok = results.filter((r) => r.savedAs).length;
  console.log(`\nDone: ${ok}/${results.length} logos downloaded to public/logos/`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
