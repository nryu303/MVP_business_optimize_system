"use server";

import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { revalidatePath } from "next/cache";

export async function clearLogAction(): Promise<void> {
  const LOG_PATH = resolve(process.cwd(), ".received-log.jsonl");
  await writeFile(LOG_PATH, "", "utf-8");
  revalidatePath("/dummy-log");
}
