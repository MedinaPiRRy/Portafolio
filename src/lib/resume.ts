import { existsSync } from "node:fs";
import { join } from "node:path";

export const hasResume = existsSync(join(process.cwd(), "public/resume.pdf"));

if (!hasResume) {
  console.warn(
    "\n[resume] public/resume.pdf is missing: the 'Download resume' button is hidden until you add it.\n",
  );
}
