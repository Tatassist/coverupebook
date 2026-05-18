import { createPublicKey, verify } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

function base64urlToBuffer(value) {
  return Buffer.from(value.replace(/-/g, "+").replace(/_/g, "/"), "base64");
}

const jws = (await readFile(path.join(rootDir, ".well-known", "tatassist-entity-claims.jws"), "utf8")).trim();
const [header, payload, signature] = jws.split(".");
if (!header || !payload || !signature) {
  throw new Error("Signed claim file is not a compact JWS.");
}

const publicJwk = JSON.parse(
  await readFile(path.join(rootDir, ".well-known", "tatassist-public-key.json"), "utf8")
);
const publicKey = createPublicKey({ key: publicJwk, format: "jwk" });
const verified = verify(null, Buffer.from(`${header}.${payload}`), publicKey, base64urlToBuffer(signature));

if (!verified) {
  throw new Error("Entity claim signature failed verification.");
}

const decodedPayload = JSON.parse(base64urlToBuffer(payload).toString("utf8"));
console.log(`Verified ${decodedPayload.claims.length} signed entity claims for ${decodedPayload.subject}.`);
