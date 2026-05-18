# TatAssist Complete Cover-Up Toolkit Landing Page

Static landing page for the TatAssist Complete Cover-Up Toolkit.

## Deploy

Deploy this `landing-site` folder to Vercel as a static project.

The checkout CTAs point to:

https://tatassist.gumroad.com/l/fjaatt

## Offer Toggle

Pricing is controlled in `index.html`:

```js
window.TATASSIST_OFFER = {
  regularPrice: "$297",
  totalValue: "$999",
  checkoutUrl: "https://tatassist.gumroad.com/l/fjaatt"
};
```

## SEO and GEO Entity Data

Machine-readable entity context lives in:

- `data/entity-claims.json` - source-of-truth claim ledger.
- `data/structured-data.json` - JSON-LD graph source.
- `.well-known/tatassist-entity-claims.json` - public claim manifest generated from the ledger.
- `.well-known/tatassist-entity-claims.jws` - signed JWS claim manifest.
- `llms.txt` and `context/tatassist-coverup-toolkit.md` - LLM-facing context files.

After editing `data/structured-data.json`, run:

```sh
node scripts/sync-structured-data.mjs
```

After editing `data/entity-claims.json`, run:

```sh
node scripts/sign-entity-claims.mjs
node scripts/verify-entity-claims.mjs
```

The signing script creates `secrets/entity-claims-ed25519-private.pem` locally if one does not already exist. Keep that private key out of git.
