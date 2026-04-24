import { appendFile, readFile } from "node:fs/promises";
import { resolve } from "node:path";

const LOG_PATH = resolve(process.cwd(), ".received-log.jsonl");

export type ReceivedEntry = {
  timestamp: string;
  formId: string;
  userAgent: string | null;
  ip: string | null;
  data: Record<string, string>;
};

export async function logDummySubmission(
  formId: string,
  req: Request,
): Promise<ReceivedEntry> {
  const fd = await req.formData();
  const data: Record<string, string> = {};
  for (const [k, v] of fd.entries()) {
    data[k] = typeof v === "string" ? v : `<file:${v.name}>`;
  }
  const entry: ReceivedEntry = {
    timestamp: new Date().toISOString(),
    formId,
    userAgent: req.headers.get("user-agent"),
    ip:
      req.headers.get("x-forwarded-for") ??
      req.headers.get("x-real-ip") ??
      null,
    data,
  };

  console.log(
    `\n[dummy-${formId}] received @ ${entry.timestamp}`,
    `\n  UA: ${entry.userAgent}`,
    `\n  data:`,
    data,
  );
  try {
    await appendFile(LOG_PATH, JSON.stringify(entry) + "\n", "utf-8");
  } catch (e) {
    console.error(
      `[dummy-${formId}] log write error:`,
      (e as Error).message,
    );
  }
  return entry;
}

export async function readLog(): Promise<ReceivedEntry[]> {
  try {
    const txt = await readFile(LOG_PATH, "utf-8");
    return txt
      .split("\n")
      .filter((l) => l.trim())
      .map((l) => {
        try {
          return JSON.parse(l) as ReceivedEntry;
        } catch {
          return null;
        }
      })
      .filter((e): e is ReceivedEntry => e !== null);
  } catch {
    return [];
  }
}
