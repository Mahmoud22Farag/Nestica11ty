import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default function () {
  const categories = JSON.parse(
    readFileSync(join(__dirname, "categories.json"), "utf-8")
  );
  return categories.filter(
    (cat) => cat.is_active !== false && cat.show_on_home === true
  );
}
