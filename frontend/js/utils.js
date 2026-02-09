// ============ UTILITIES ============

// LocalStorage операции
function setToken(token) {
  localStorage.setItem("token", token);
}

function getToken() {
  return localStorage.getItem("token");
}

function setUser(user) {
  localStorage.setItem("user", JSON.stringify(user));
}

function getUser() {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("cart");
  window.location.href = "index.html";
}

// Корзина
function getCart() {
  const cart = localStorage.getItem("cart");
  return cart ? JSON.parse(cart) : [];
}

function setCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

function addToCart(item) {
  const cart = getCart();
  const existing = cart.find((c) => c.id === item.id);

  if (existing) {
    existing.quantity += item.quantity || 1;
  } else {
    cart.push({ ...item, quantity: item.quantity || 1 });
  }

  setCart(cart);
  showNotification(`${item.name} добавлено в корзину`);
}

function removeFromCart(itemId) {
  const cart = getCart().filter((c) => c.id !== itemId);
  setCart(cart);
}

function clearCart() {
  localStorage.removeItem("cart");
  updateCartCount();
}

function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const countEl = document.getElementById("cartCount");

  if (countEl) {
    if (count > 0) {
      countEl.textContent = count;
      countEl.style.display = "flex";
    } else {
      countEl.style.display = "none";
    }
  }
}

// Уведомления
function showNotification(message, type = "success") {
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// UI обновления
function updateNavUI() {
  const user = getUser();
  const token = getToken();
  const loginLink = document.getElementById("loginLink");
  const logoutLink = document.getElementById("logoutLink");
  const profileLink = document.getElementById("profileLink");
  const cartLink = document.getElementById("cartLink");

  if (token && user) {
    if (loginLink) loginLink.style.display = "none";
    if (logoutLink) logoutLink.style.display = "block";
    if (profileLink) {
      if (user.role === "admin") {
        profileLink.href = "admin.html";
        profileLink.textContent = "⚙️ Админ панель";
      } else {
        profileLink.href = "profile.html";
        profileLink.textContent = "👤 Профиль";
      }
    }
    if (cartLink) {
      cartLink.onclick = (e) => {
        e.preventDefault();
        window.location.href = "checkout.html";
      };
    }
  } else {
    if (loginLink) loginLink.style.display = "block";
    if (logoutLink) logoutLink.style.display = "none";
    if (profileLink) {
      profileLink.href = "auth.html";
      profileLink.textContent = "👤 Профиль";
    }
    if (cartLink) {
      cartLink.onclick = (e) => {
        e.preventDefault();
        window.location.href = "auth.html";
      };
    }
  }

  updateCartCount();
}

// Форматирование
function formatPrice(price) {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    minimumFractionDigits: 0,
  }).format(price);
}

function getMaterialName(material) {
  const names = {
    gold: "Золото",
    silver: "Серебро",
    platinum: "Платина",
    bronze: "Бронза",
  };
  return names[material] || material;
}

function getCategoryName(category) {
  const names = {
    ring: "Кольцо",
    necklace: "Ожерелье",
    bracelet: "Браслет",
    earring: "Серьга",
    brooch: "Брошь",
  };
  return names[category] || category;
}

// Плейсхолдер изображений
function getPlaceholderImage(category, name) {
  const categoryEmoji = {
    ring: "💍",
    necklace: "📿",
    bracelet: "⌚",
    earring: "✨",
    brooch: "⚜️",
  };

  return `https://via.placeholder.com/300x300?text=${encodeURIComponent(name)}&bg=f5deb3&fg=8b7355`;
}

// Валидация
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Инициализация при загрузке страницы
document.addEventListener("DOMContentLoaded", updateNavUI);
