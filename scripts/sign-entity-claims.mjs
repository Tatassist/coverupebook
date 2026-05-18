import { createHash, createPublicKey, generateKeyPairSync, sign } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createPrivateKey } from "node:crypto";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const claimsPath = path.join(rootDir, "data", "entity-claims.json");
const wellKnownDir = path.join(rootDir, ".well-known");
const secretsDir = path.join(rootDir, "secrets");
const privateKeyPath = path.join(secretsDir, "entity-claims-ed25519-private.pem");
const publicJwkPath = path.join(wellKnownDir, "tatassist-public-key.json");
const publicClaimsPath = path.join(wellKnownDir, "tatassist-entity-claims.json");
const signedClaimsPath = path.join(wellKnownDir, "tatassist-entity-claims.jws");

function base64url(input) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

await mkdir(wellKnownDir, { recursive: true });
await mkdir(secretsDir, { recursive: true });

let privateKeyPem;
let privateKey;
let publicKey;

if (existsSync(privateKeyPath)) {
  privateKeyPem = await readFile(privateKeyPath, "utf8");
  privateKey = createPrivateKey(privateKeyPem);
  if (privateKey.asymmetricKeyType !== "ed25519") {
    throw new Error("Existing private key is not an Ed25519 key.");
  }
} else {
  const keyPair = generateKeyPairSync("ed25519", {
    privateKeyEncoding: {
      type: "pkcs8",
      format: "pem"
    },
    publicKeyEncoding: {
      type: "spki",
      format: "pem"
    }
  });
  privateKeyPem = keyPair.privateKey;
  await writeFile(privateKeyPath, privateKeyPem, { mode: 0o600 });
  privateKey = createPrivateKey(privateKeyPem);
}
publicKey = createPublicKey(privateKey);

const claimsRaw = await readFile(claimsPath, "utf8");
const claims = JSON.parse(claimsRaw);
const claimsHash = createHash("sha256").update(claimsRaw).digest("hex");
const keyId = `tatassist-entity-claims-${createHash("sha256")
  .update(publicKey.export({ type: "spki", format: "der" }))
  .digest("hex")
  .slice(0, 16)}`;

const publicJwk = publicKey.export({ format: "jwk" });
delete publicJwk.d;
publicJwk.use = "sig";
publicJwk.alg = "EdDSA";
publicJwk.kid = keyId;

const publicManifest = {
  schemaVersion: claims.schemaVersion,
  issuer: claims.brand.name,
  subject: claims.brand.primaryProduct,
  canonicalUrl: claims.canonicalUrl,
  issuedAt: new Date().toISOString(),
  signature: {
    type: "JWS",
    algorithm: "EdDSA",
    keyId,
    publicKeyUrl: `${claims.canonicalUrl}.well-known/tatassist-public-key.json`,
    signedClaimsUrl: `${claims.canonicalUrl}.well-known/tatassist-entity-claims.jws`
  },
  claimsHash: {
    algorithm: "SHA-256",
    value: claimsHash
  },
  claims: claims.claims,
  unsupportedUntilEvidenceIsAdded: claims.unsupportedUntilEvidenceIsAdded
};

const header = {
  alg: "EdDSA",
  typ: "JWS",
  kid: keyId
};
const payload = publicManifest;
const encodedHeader = base64url(JSON.stringify(header));
const encodedPayload = base64url(JSON.stringify(payload));
const signature = sign(null, Buffer.from(`${encodedHeader}.${encodedPayload}`), privateKeyPem);
const jws = `${encodedHeader}.${encodedPayload}.${base64url(signature)}`;

await writeFile(publicJwkPath, `${JSON.stringify(publicJwk, null, 2)}\n`);
await writeFile(publicClaimsPath, `${JSON.stringify(publicManifest, null, 2)}\n`);
await writeFile(signedClaimsPath, `${jws}\n`);

console.log(`Wrote ${path.relative(rootDir, publicClaimsPath)}`);
console.log(`Wrote ${path.relative(rootDir, signedClaimsPath)}`);
console.log(`Wrote ${path.relative(rootDir, publicJwkPath)}`);
