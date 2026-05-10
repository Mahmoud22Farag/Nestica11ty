const CART_KEY = "nesticaCart";
const SITE_PREFIX = "/Nestica11ty";

function assetUrl(path) {
  if (!path) return `${SITE_PREFIX}/assets/images/products/default-product.jpeg`;

  if (path.startsWith("http")) return path;
  if (path.startsWith(SITE_PREFIX)) return path;

  if (path.startsWith("/")) {
    return `${SITE_PREFIX}${path}`;
  }

  return `${SITE_PREFIX}/${path}`;
}

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
  renderCart();
}

function addToCart(product) {
  const cart = getCart();

  const existing = cart.find(
    (item) => String(item.id) === String(product.id) && !item.notes
  );

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      ...product,
      quantity: 1,
      requestType: "same",
      notes: ""
    });
  }

  saveCart(cart);

  alert(
    document.documentElement.lang === "en"
      ? "Added to cart"
      : "تمت الإضافة للسلة"
  );
}

function addProductDetailsToCart(product) {
  const quantity = Math.max(
    1,
    Number(document.getElementById("quantity")?.value || 1)
  );

  const requestType =
    document.querySelector('input[name="requestType"]:checked')?.value || "same";

  const notes = document.getElementById("notes")?.value || "";

  const cart = getCart();

  cart.push({
    ...product,
    quantity,
    requestType,
    notes
  });

  saveCart(cart);

  alert(
    document.documentElement.lang === "en"
      ? "Added to cart"
      : "تمت الإضافة للسلة"
  );
}

function updateCartCount() {
  const count = getCart().reduce(
    (sum, item) => sum + Number(item.quantity || 1),
    0
  );

  const el = document.getElementById("cartCount");

  if (el) el.textContent = count;
}

function updateQty(index, qty) {
  const cart = getCart();

  if (!cart[index]) return;

  cart[index].quantity = Math.max(1, Number(qty || 1));

  saveCart(cart);
}

function removeCartItem(index) {
  const cart = getCart();

  cart.splice(index, 1);

  saveCart(cart);
}

function clearCart() {
  localStorage.removeItem(CART_KEY);
  updateCartCount();
  renderCart();
}

function renderCart() {
  const holder = document.getElementById("cartItems");

  if (!holder) return;

  const empty = document.getElementById("emptyCart");
  const totalEl = document.getElementById("cartTotal");
  const cart = getCart();

  holder.innerHTML = "";

  if (!cart.length) {
    empty?.classList.remove("d-none");

    if (totalEl) totalEl.textContent = "0 EGP";

    return;
  }

  empty?.classList.add("d-none");

  let total = 0;

  cart.forEach((item, index) => {
    const lineTotal =
      Number(item.price || 0) * Number(item.quantity || 1);

    total += lineTotal;

    const div = document.createElement("div");

    div.className =
      "cart-item card border-0 shadow-sm rounded-4 p-3 mb-3";

    div.innerHTML = `
      <div class="d-flex gap-3 align-items-center">
        <img
          src="${assetUrl(item.image || item.main_image || "/assets/images/products/default-product.jpeg")}"
          alt="${item.name || ""}"
          class="cart-item-img rounded-3"
          onerror="this.onerror=null;this.src='${assetUrl("/assets/images/products/default-product.jpeg")}';"
        >

        <div class="flex-grow-1">
          <h4 class="fw-bold mb-1">${item.name || ""}</h4>

          <p class="mb-2">${Number(item.price || 0).toLocaleString("en-US")} EGP</p>

          ${
            item.notes
              ? `<p class="small text-muted mb-2">${item.notes}</p>`
              : ""
          }

          <div class="d-flex align-items-center gap-2">
            <input
              type="number"
              min="1"
              value="${item.quantity || 1}"
              class="form-control form-control-sm"
              style="width:90px"
              onchange="updateQty(${index}, this.value)"
            >

            <button
              type="button"
              class="btn btn-sm btn-outline-danger"
              onclick="removeCartItem(${index})"
            >
              🗑
            </button>
          </div>
        </div>

        <strong>${lineTotal.toLocaleString("en-US")} EGP</strong>
      </div>
    `;

    holder.appendChild(div);
  });

  if (totalEl) {
    totalEl.textContent = `${total.toLocaleString("en-US")} EGP`;
  }
}

function sendCartToWhatsApp(phone) {
  const cart = getCart();
  const isEnglish = document.documentElement.lang === "en";

  if (!cart.length) {
    alert(isEnglish ? "Cart is empty" : "السلة فارغة");
    return;
  }

  const nameInput = document.getElementById("customerName");
  const phoneInput = document.getElementById("customerPhone");
  const addressInput = document.getElementById("customerAddress");

  const name = nameInput?.value.trim() || "";
  const customerPhone = phoneInput?.value.trim() || "";
  const address = addressInput?.value.trim() || "";

  if (!name || !customerPhone || !address) {
    alert(
      isEnglish
        ? "Please fill in your name, phone number, and address before sending your order."
        : "من فضلك اكتب الاسم ورقم الهاتف والعنوان قبل إرسال الطلب على واتساب."
    );

    if (!name) {
      nameInput?.focus();
    } else if (!customerPhone) {
      phoneInput?.focus();
    } else {
      addressInput?.focus();
    }

    return;
  }

  const digitsOnly = customerPhone.replace(/\D/g, "");

  if (digitsOnly.length < 8) {
    alert(
      isEnglish
        ? "Please enter a valid phone number."
        : "من فضلك اكتب رقم هاتف صحيح."
    );

    phoneInput?.focus();

    return;
  }

  let message = `New Nestica Order\nName: ${name}\nPhone: ${customerPhone}\nAddress: ${address}\n\n`;

  let total = 0;

  cart.forEach((item, i) => {
    const line =
      Number(item.price || 0) * Number(item.quantity || 1);

    total += line;

    message += `${i + 1}) ${item.name}\nQty: ${item.quantity}\nPrice: ${Number(item.price || 0).toLocaleString("en-US")} EGP\nRequest: ${item.requestType || "same"}\nNotes: ${item.notes || "-"}\n\n`;
  });

  message += `Total: ${total.toLocaleString("en-US")} EGP`;

  window.open(
    `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
    "_blank"
  );
}