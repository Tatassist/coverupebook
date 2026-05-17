(() => {
  const offer = {
    regularPrice: "$297",
    totalValue: "$999",
    checkoutUrl: "#checkout",
    ...window.TATASSIST_OFFER
  };

  const activePrice = offer.regularPrice;

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
    node.textContent = activePrice;
  });

  document.querySelectorAll("[data-checkout-price]").forEach((node) => {
    node.innerHTML = `<span class="price-note">You pay</span><span class="price-main">${activePrice}</span>`;
  });

  document.querySelectorAll("[data-checkout-headline]").forEach((node) => {
    node.textContent = `Get the Complete Cover-Up Toolkit for ${activePrice}.`;
  });

  document.querySelectorAll("[data-cta='header-buy']").forEach((node) => {
    node.textContent = "Get the Toolkit";
  });

  document.querySelectorAll("[data-cta='hero-buy']").forEach((node) => {
    node.textContent = `Get the Cover-Up Workflow - ${activePrice}`;
  });

  document.querySelectorAll("[data-cta='final-buy']").forEach((node) => {
    node.textContent = `Get the Cover-Up Workflow - ${activePrice}`;
  });

  document.querySelectorAll("[data-cta]").forEach((node) => {
    node.dataset.offerPrice = activePrice;
    node.dataset.product = "complete-cover-up-toolkit";
  });
})();
