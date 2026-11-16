/**
 * Validates admin page-content input against the shape of the defaults.
 * Unknown keys are dropped, types must match, strings are length-capped,
 * and image fields only accept site paths or https URLs.
 */
type Plain = Record<string, unknown>;
const isObj = (v: unknown): v is Plain => typeof v === "object" && v !== null && !Array.isArray(v);

export type ShapeResult = { ok: true; value: unknown } | { ok: false; error: string };

const MAX_STRING = 4000;

function checkString(path: string, key: string, v: unknown): string {
  if (typeof v !== "string") throw new Error(`${path} must be text`);
  const s = v.trim();
  if (s.length > MAX_STRING) throw new Error(`${path} is too long`);
  if (key === "image" && s && !s.startsWith("/") && !s.startsWith("https://")) {
    throw new Error(`${path} must be an uploaded image or https URL`);
  }
  return s;
}

function walk(shape: unknown, input: unknown, path: string, key: string): unknown {
  if (typeof shape === "string") return checkString(path, key, input);
  if (typeof shape === "boolean") {
    if (typeof input !== "boolean") throw new Error(`${path} must be true/false`);
    return input;
  }
  if (typeof shape === "number") {
    if (typeof input !== "number" || !Number.isFinite(input)) throw new Error(`${path} must be a number`);
    return input;
  }
  if (Array.isArray(shape)) {
    if (!Array.isArray(input)) throw new Error(`${path} must be a list`);
    if (input.length > 30) throw new Error(`${path} has too many items`);
    const itemShape = shape[0];
    return input.map((item, i) => walk(itemShape, item, `${path}[${i + 1}]`, key));
  }
  if (isObj(shape)) {
    if (!isObj(input)) throw new Error(`${path || "content"} must be an object`);
    const out: Plain = {};
    for (const k of Object.keys(shape)) {
      if (input[k] === undefined) continue;
      out[k] = walk(shape[k], input[k], path ? `${path}.${k}` : k, k);
    }
    return out;
  }
  throw new Error(`Unsupported field at ${path}`);
}

export function validateAgainstShape(shape: unknown, input: unknown): ShapeResult {
  try {
    return { ok: true, value: walk(shape, input, "", "") };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Invalid content" };
  }
}
