(function () {
  function readProducts() {
    const stored = localStorage.getItem(SHOP_STORAGE_KEYS.products);
    return stored ? JSON.parse(stored) : SHOP_PRODUCTS;
  }

  function saveProducts(products) {
    localStorage.setItem(SHOP_STORAGE_KEYS.products, JSON.stringify(products));
  }

  function readCart() {
    const stored = localStorage.getItem(SHOP_STORAGE_KEYS.cart);
    return stored ? JSON.parse(stored) : [];
  }

  function saveCart(cart) {
    localStorage.setItem(SHOP_STORAGE_KEYS.cart, JSON.stringify(cart));
    updateCartBadge();
  }

  function readOrders() {
    const stored = localStorage.getItem(SHOP_STORAGE_KEYS.orders);
    return stored ? JSON.parse(stored) : [];
  }

  function saveOrders(orders) {
    localStorage.setItem(SHOP_STORAGE_KEYS.orders, JSON.stringify(orders));
  }

  function formatMoney(value) {
    return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(value);
  }

  function updateCartBadge() {
    const count = readCart().reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll("[data-cart-count]").forEach((node) => {
      node.textContent = count;
    });
  }

  function addToCart(productId, quantity) {
    const cart = readCart();
    const existing = cart.find((item) => item.id === productId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({ id: productId, quantity });
    }
    saveCart(cart);
  }

  function getCartLines() {
    const products = readProducts();
    return readCart()
      .map((item) => {
        const product = products.find((entry) => entry.id === item.id);
        return product ? { ...product, quantity: item.quantity, lineTotal: product.price * item.quantity } : null;
      })
      .filter(Boolean);
  }

  function renderShop() {
    const target = document.querySelector("[data-shop-list]");
    if (!target) return;

    target.innerHTML = readProducts().map((product) => `
      <article class="shop-card">
        <div class="tile-image img-produkte" aria-hidden="true"></div>
        <div class="shop-card-body">
          <span class="tag">${product.category}</span>
          <h3>${product.name}</h3>
          <p>${product.teaser}</p>
          <strong>${formatMoney(product.price)}</strong>
          <div class="shop-actions">
            <a class="button" href="produkt.html?id=${product.id}">Details</a>
            <button class="button ghost" type="button" data-add-to-cart="${product.id}">In den Warenkorb</button>
          </div>
        </div>
      </article>
    `).join("");
  }

  function renderProduct() {
    const target = document.querySelector("[data-product-detail]");
    if (!target) return;

    const id = new URLSearchParams(window.location.search).get("id") || SHOP_PRODUCTS[0].id;
    const product = readProducts().find((entry) => entry.id === id) || readProducts()[0];

    target.innerHTML = `
      <div class="text">
        <p class="eyebrow">${product.category}</p>
        <h1>${product.name}</h1>
        <p>${product.description}</p>
        <div class="facts">
          <div class="fact"><strong>${formatMoney(product.price)}</strong>Nettopreis</div>
          <div class="fact"><strong>${product.leadTime}</strong>Lieferzeit</div>
          <div class="fact"><strong>CE</strong>Dokumentation</div>
        </div>
        <h2>Ausstattung</h2>
        <ul class="list">${product.specs.map((spec) => `<li>${spec}</li>`).join("")}</ul>
        <div class="shop-actions">
          <button class="button" type="button" data-add-to-cart="${product.id}">In den Warenkorb</button>
          <a class="button ghost" href="shop.html">Zurueck zum Shop</a>
        </div>
      </div>
      <div class="page-image img-produkte" role="img" aria-label="${product.name}"></div>
    `;
  }

  function renderCart() {
    const target = document.querySelector("[data-cart]");
    if (!target) return;

    const lines = getCartLines();
    if (!lines.length) {
      target.innerHTML = `<div class="empty-state"><h2>Ihr Warenkorb ist leer.</h2><p>Waehlen Sie im Shop eine Maschine aus, um eine Bestellung vorzubereiten.</p><a class="button" href="shop.html">Zum Shop</a></div>`;
      return;
    }

    const total = lines.reduce((sum, line) => sum + line.lineTotal, 0);
    target.innerHTML = `
      <div class="cart-lines">
        ${lines.map((line) => `
          <div class="cart-line">
            <div>
              <strong>${line.name}</strong>
              <span>${line.category} · ${formatMoney(line.price)}</span>
            </div>
            <div class="quantity-control">
              <button type="button" data-qty="${line.id}" data-delta="-1">-</button>
              <span>${line.quantity}</span>
              <button type="button" data-qty="${line.id}" data-delta="1">+</button>
            </div>
            <strong>${formatMoney(line.lineTotal)}</strong>
          </div>
        `).join("")}
      </div>
      <div class="cart-summary">
        <span>Zwischensumme</span>
        <strong>${formatMoney(total)}</strong>
        <a class="button" href="bezahlen.html">Zur Bezahlseite</a>
      </div>
    `;
  }

  function renderCheckout() {
    const target = document.querySelector("[data-checkout]");
    if (!target) return;

    const lines = getCartLines();
    const total = lines.reduce((sum, line) => sum + line.lineTotal, 0);
    target.innerHTML = `
      <div class="checkout-grid">
        <form class="contact-form" data-checkout-form>
          <h2>Bestelldaten</h2>
          <label for="customer-name">Name *</label>
          <input id="customer-name" name="name" type="text" autocomplete="name" required>
          <label for="customer-email">E-Mail *</label>
          <input id="customer-email" name="email" type="email" autocomplete="email" required>
          <label for="company">Firma</label>
          <input id="company" name="company" type="text" autocomplete="organization">
          <label for="address">Lieferadresse *</label>
          <textarea id="address" name="address" rows="4" required></textarea>
          <button class="button form-button" type="submit">Mit Kreditkarte bezahlen</button>
          <p class="form-note">Bei Deployment wird eine Stripe-Checkout-Sitzung erzeugt. Lokal wird eine Demo-Bestellung gespeichert.</p>
        </form>
        <aside class="contact-box">
          <strong>Bestelluebersicht</strong>
          ${lines.length ? lines.map((line) => `<p>${line.quantity} x ${line.name}<br>${formatMoney(line.lineTotal)}</p>`).join("") : "<p>Der Warenkorb ist leer.</p>"}
          <strong>Gesamt: ${formatMoney(total)}</strong>
        </aside>
      </div>
    `;
  }

  async function handleCheckoutSubmit(event) {
    const form = event.target.closest("[data-checkout-form]");
    if (!form) return;
    event.preventDefault();

    const lines = getCartLines();
    if (!lines.length) {
      window.location.href = "shop.html";
      return;
    }

    const data = Object.fromEntries(new FormData(form).entries());
    const order = {
      id: `ZX-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: "Bezahlt",
      customer: data,
      items: lines,
      total: lines.reduce((sum, line) => sum + line.lineTotal, 0)
    };

    try {
      const response = await fetch("/.netlify/functions/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order)
      });

      if (response.ok) {
        const payload = await response.json();
        if (payload.url) {
          window.location.href = payload.url;
          return;
        }
      }
    } catch (error) {
      console.info("Stripe endpoint not available locally, using demo order.", error);
    }

    const orders = readOrders();
    orders.unshift(order);
    saveOrders(orders);
    saveCart([]);
    window.location.href = `erfolg.html?order=${order.id}`;
  }

  function renderAdminProducts() {
    const target = document.querySelector("[data-admin-products]");
    if (!target) return;
    const products = readProducts();
    target.innerHTML = `
      <div class="admin-list">
        ${products.map((product) => `
          <div class="admin-row">
            <div><strong>${product.name}</strong><span>${product.category} · ${formatMoney(product.price)}</span></div>
            <button class="button ghost" type="button" data-remove-product="${product.id}">Entfernen</button>
          </div>
        `).join("")}
      </div>
      <form class="contact-form" data-product-form>
        <h2>Produkt einpflegen</h2>
        <label>Name *</label><input name="name" required>
        <label>Kategorie *</label><input name="category" required>
        <label>Preis in EUR *</label><input name="price" type="number" min="1" required>
        <label>Lieferzeit</label><input name="leadTime" value="10-14 Wochen">
        <label>Kurzbeschreibung *</label><textarea name="teaser" rows="3" required></textarea>
        <button class="button form-button" type="submit">Produkt speichern</button>
      </form>
    `;
  }

  function renderAdminOrders() {
    const target = document.querySelector("[data-admin-orders]");
    if (!target) return;
    const orders = readOrders();
    target.innerHTML = orders.length ? `
      <div class="admin-list">
        ${orders.map((order) => `
          <div class="admin-row">
            <div>
              <strong>${order.id}</strong>
              <span>${order.customer.name} · ${order.customer.email} · ${formatMoney(order.total)} · ${order.status}</span>
            </div>
            <select data-order-status="${order.id}">
              <option ${order.status === "Bezahlt" ? "selected" : ""}>Bezahlt</option>
              <option ${order.status === "In Bearbeitung" ? "selected" : ""}>In Bearbeitung</option>
              <option ${order.status === "Versendet" ? "selected" : ""}>Versendet</option>
              <option ${order.status === "Abgeschlossen" ? "selected" : ""}>Abgeschlossen</option>
            </select>
          </div>
        `).join("")}
      </div>
    ` : `<div class="empty-state"><h2>Keine offenen Bestellungen.</h2><p>Demo-Bestellungen erscheinen hier nach einem lokalen Checkout.</p></div>`;
  }

  document.addEventListener("click", (event) => {
    const addButton = event.target.closest("[data-add-to-cart]");
    if (addButton) {
      addToCart(addButton.dataset.addToCart, 1);
      addButton.textContent = "Hinzugefuegt";
      setTimeout(() => { addButton.textContent = "In den Warenkorb"; }, 1200);
    }

    const quantityButton = event.target.closest("[data-qty]");
    if (quantityButton) {
      const cart = readCart();
      const item = cart.find((entry) => entry.id === quantityButton.dataset.qty);
      if (item) {
        item.quantity += Number(quantityButton.dataset.delta);
        saveCart(cart.filter((entry) => entry.quantity > 0));
        renderCart();
      }
    }

    const removeButton = event.target.closest("[data-remove-product]");
    if (removeButton) {
      saveProducts(readProducts().filter((product) => product.id !== removeButton.dataset.removeProduct));
      renderAdminProducts();
    }
  });

  document.addEventListener("submit", (event) => {
    handleCheckoutSubmit(event);

    const productForm = event.target.closest("[data-product-form]");
    if (productForm) {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(productForm).entries());
      const products = readProducts();
      products.push({
        id: data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
        name: data.name,
        category: data.category,
        price: Number(data.price),
        leadTime: data.leadTime || "auf Anfrage",
        teaser: data.teaser,
        description: data.teaser,
        specs: ["Kundenspezifische Ausstattung", "Technische Klaerung nach Anfrage"]
      });
      saveProducts(products);
      productForm.reset();
      renderAdminProducts();
    }
  });

  document.addEventListener("change", (event) => {
    const statusSelect = event.target.closest("[data-order-status]");
    if (statusSelect) {
      const orders = readOrders();
      const order = orders.find((entry) => entry.id === statusSelect.dataset.orderStatus);
      if (order) {
        order.status = statusSelect.value;
        saveOrders(orders);
      }
    }
  });

  renderShop();
  renderProduct();
  renderCart();
  renderCheckout();
  renderAdminProducts();
  renderAdminOrders();
  updateCartBadge();
}());
