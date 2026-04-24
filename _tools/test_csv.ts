import iconv from "iconv-lite";
import {
  parseCsv,
  autoDetectMapping,
  validateRows,
  extractDomain,
} from "../apps/admin/src/lib/csv";

const sampleUtf8 = `会社名,問い合わせフォームURL,サイトURL,メールアドレス,業種
テスト株式会社,https://example.com/contact,https://example.com,info@example.com,IT
サンプル商事,https://sample.jp/inquiry,,contact@sample.jp,
,https://no-name.example.com/contact,,,
株式会社なし,invalid-url,,,`;

console.log("=== UTF-8 CSV ===");
const utf8Buf = Buffer.from("\uFEFF" + sampleUtf8, "utf-8");
const r1 = parseCsv(utf8Buf);
console.log("encoding:", r1.encoding);
console.log("headers:", r1.headers);
console.log("rows:", r1.rows.length);
const mapping1 = autoDetectMapping(r1.headers);
console.log("auto mapping:", mapping1);
const v1 = validateRows(r1.rows, mapping1);
console.log("valid:", v1.valid.length, "errors:", v1.errors.length);
console.log("sample valid[0]:", v1.valid[0]);
console.log("errors:", v1.errors);

console.log("\n=== Shift_JIS CSV ===");
const sjisBuf = iconv.encode(sampleUtf8, "shift_jis");
const r2 = parseCsv(sjisBuf);
console.log("encoding:", r2.encoding);
console.log("rows:", r2.rows.length);
const mapping2 = autoDetectMapping(r2.headers);
const v2 = validateRows(r2.rows, mapping2);
console.log("valid:", v2.valid.length, "errors:", v2.errors.length);
console.log("sample valid[0]:", v2.valid[0]);

console.log("\n=== extractDomain ===");
console.log(extractDomain("https://example.com/contact"));
console.log(extractDomain("https://sub.sample.co.jp/form?x=1"));
console.log(extractDomain("invalid"));
