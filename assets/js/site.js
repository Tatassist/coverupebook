(() => {
  const offer = {
    launchSale: false,
    regularPrice: "$297",
    launchPrice: "$197",
    totalValue: "$999",
    checkoutUrl: "#checkout",
    ...window.TATASSIST_OFFER
  };

  const params = new URLSearchParams(window.location.search);
  const launchSale = params.get("launch") === "1" || offer.launchSale;
  const activePrice = launchSale ? offer.launchPrice : offer.regularPrice;

  document.body.classList.toggle("sale-active", launchSale);

  document.querySelectorAll("[href='#checkout']").forEach((link) => {
    link.setAttribute("href", offer.checkoutUrl);
  });

  document.querySelectorAll("[data-regular-price]").forEach((node) => {
    node.textContent = offer.regularPrice;
  });

  document.querySelectorAll("[data-total-value]").forEach((node) => {
    node.textContent = offer.totalValue;
  });

  document.querySelectorAll("[data-price-display]").forEach((node) => {
    node.innerHTML = launchSale
      ? `<span>Launch Price: ${offer.launchPrice}</span> <s>Regular Price: ${offer.regularPrice}</s>`
      : offer.regularPrice;
  });

  document.querySelectorAll("[data-checkout-price]").forEach((node) => {
    node.innerHTML = launchSale
      ? `<span class="price-note">Launch Price</span><span class="price-main">${offer.launchPrice}</span><s>Regular Price: ${offer.regularPrice}</s>`
      : `<span class="price-main">${offer.regularPrice}</span>`;
  });

  document.querySelectorAll("[data-checkout-headline]").forEach((node) => {
    node.textContent = `Get the Complete Cover-Up Toolkit for ${activePrice}.`;
  });

  document.querySelectorAll("[data-cta='header-buy']").forEach((node) => {
    node.textContent = launchSale ? "Get Launch Price" : "Get the Toolkit";
  });

  document.querySelectorAll("[data-cta='hero-buy']").forEach((node) => {
    node.textContent = `Get the Toolkit for ${activePrice}`;
  });

  document.querySelectorAll("[data-cta='final-buy']").forEach((node) => {
    node.textContent = `Get the Toolkit for ${activePrice}`;
  });

  document.querySelectorAll("[data-cta]").forEach((node) => {
    node.dataset.offerPrice = activePrice;
    node.dataset.product = "complete-cover-up-toolkit";
  });
})();
