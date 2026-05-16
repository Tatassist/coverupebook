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
