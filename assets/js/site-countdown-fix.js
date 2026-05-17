(() => {
  const offer = {
    regularPrice: "$297",
    totalValue: "$999",
    checkoutUrl: "#checkout",
    launchEndsAt: "2026-05-25T06:59:59Z",
    ...window.TATASSIST_OFFER
  };

  const activePrice = offer.regularPrice;
  const deadline = Date.parse(offer.launchEndsAt || "2026-05-25T06:59:59Z");

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

  const pad = (value) => String(value).padStart(2, "0");

  const renderCountdown = () => {
    if (Number.isNaN(deadline)) {
      document.querySelectorAll("[data-countdown-compact]").forEach((node) => {
        node.textContent = "Launch special active";
      });
      return;
    }

    const remaining = Math.max(0, deadline - Date.now());
    const totalSeconds = Math.floor(remaining / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    document.querySelectorAll("[data-countdown-days]").forEach((node) => {
      node.textContent = pad(days);
    });
    document.querySelectorAll("[data-countdown-hours]").forEach((node) => {
      node.textContent = pad(hours);
    });
    document.querySelectorAll("[data-countdown-minutes]").forEach((node) => {
      node.textContent = pad(minutes);
    });
    document.querySelectorAll("[data-countdown-seconds]").forEach((node) => {
      node.textContent = pad(seconds);
    });
    document.querySelectorAll("[data-countdown-compact]").forEach((node) => {
      node.textContent = remaining > 0 ? `${days}d ${pad(hours)}h ${pad(minutes)}m` : "Ending now";
    });
  };

  renderCountdown();
  window.setInterval(renderCountdown, 1000);
})();
