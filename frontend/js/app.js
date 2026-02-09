// ============ ГЛАВНОЕ ПРИЛОЖЕНИЕ ============

// Загрузка каталога
async function loadCatalog() {
  try {
    const data = await API.getAllJewelry();
    displayProducts(data.jewelry);
  } catch (error) {
    console.error("Ошибка:", error);
    showNotification("Ошибка при загрузке товаров", "error");
  }
}

// Отображение товаров
function displayProducts(jewelry) {
  const container =
    document.getElementById("productsGrid") ||
    document.getElementById("featuredProducts");
  const emptyState = document.getElementById("emptyState");

  if (!container) return;

  if (!jewelry || jewelry.length === 0) {
    container.innerHTML = "";
    if (emptyState) emptyState.style.display = "block";
    return;
  }

  if (emptyState) emptyState.style.display = "none";

  container.innerHTML = jewelry
    .map(
      (item) => `
    <div class="product-card" onclick="openProductModal('${item._id}')">
      <div class="product-image">
        <img src="${item.image || getPlaceholderImage(item.category, item.name)}" 
             alt="${item.name}"
             onerror="this.src='${getPlaceholderImage(item.category, item.name)}'">
      </div>
      <div class="product-info">
        <div class="product-category">${getCategoryName(item.category)}</div>
        <div class="product-name">${item.name}</div>
        <div class="product-description">${item.description || "Изысканное украшение"}</div>
        <div class="product-specs">
          <div>💎 ${getMaterialName(item.material)} • ${item.weight}г</div>
          <div>${item.stock > 0 ? "✓ В наличии" : "✗ Нет в наличии"}</div>
        </div>
        <div class="product-footer">
          <div class="product-price">${item.price} ₽</div>
          <div class="product-actions">
            <button class="btn btn-primary btn-small" 
                    onclick="addToCart({id: '${item._id}', name: '${item.name}', price: ${item.price}, quantity: 1}); event.stopPropagation();"
                    ${item.stock <= 0 ? "disabled" : ""}>
              Купить
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
    )
    .join("");
}

// Модаль товара
function openProductModal(jewelryId) {
  API.getJewelryById(jewelryId)
    .then((data) => {
      const item = data.jewelry;
      const modal = document.getElementById("productModal");
      const modalBody = document.getElementById("modalBody");

      modalBody.innerHTML = `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
        <div>
          <img src="${item.image || getPlaceholderImage(item.category, item.name)}" 
               alt="${item.name}"
               style="width: 100%; border-radius: 10px; object-fit: cover;"
               onerror="this.src='${getPlaceholderImage(item.category, item.name)}'">
        </div>
        <div>
          <div style="color: var(--primary-color); text-transform: uppercase; font-weight: 600; margin-bottom: 0.5rem;">
            ${getCategoryName(item.category)}
          </div>
          <h2 style="margin-bottom: 1rem; color: var(--dark-color);">${item.name}</h2>
          <p style="color: #666; margin-bottom: 1rem; line-height: 1.6;">${item.description || "Прекрасное украшение из благородных материалов"}</p>
          
          <div style="background: var(--light-color); padding: 1rem; border-radius: 5px; margin-bottom: 1.5rem;">
            <div style="margin-bottom: 0.5rem;"><strong>Материал:</strong> ${getMaterialName(item.material)}</div>
            <div style="margin-bottom: 0.5rem;"><strong>Вес:</strong> ${item.weight} г</div>
            <div><strong>Наличие:</strong> ${item.stock > 0 ? `✓ ${item.stock} шт` : "✗ Нет в наличии"}</div>
          </div>

          <div style="font-size: 2.5rem; font-weight: 700; color: var(--primary-color); margin-bottom: 2rem;">
            ${item.price} ₽
          </div>

          ${
            item.stock > 0
              ? `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <button class="btn btn-primary btn-block" 
                      onclick="addToCart({id: '${item._id}', name: '${item.name}', price: ${item.price}, quantity: 1}); closeProductModal(); return false;">
                Добавить в корзину
              </button>
              <button class="btn btn-secondary btn-block" onclick="closeProductModal()">Закрыть</button>
            </div>
          `
              : `
            <button class="btn btn-secondary btn-block" onclick="closeProductModal()">Закрыть</button>
          `
          }
        </div>
      </div>
    `;

      modal.style.display = "block";
    })
    .catch((err) => {
      showNotification("Ошибка при загрузке товара", "error");
    });
}

function closeProductModal() {
  document.getElementById("productModal").style.display = "none";
}

// Закрытие модали по клику на фон
window.onclick = function (event) {
  const modal = document.getElementById("productModal");
  if (event.target === modal) {
    modal.style.display = "none";
  }
};

// Фильтрация товаров (для каталога)
let allJewelry = [];

async function loadAllProducts() {
  try {
    const data = await API.getAllJewelry();
    allJewelry = data.jewelry;
    filterProducts();
  } catch (error) {
    console.error("Ошибка:", error);
  }
}

function filterProducts() {
  if (!allJewelry.length) return;

  const category = document.querySelector(
    'input[name="category"]:checked',
  )?.value;
  const materials = Array.from(
    document.querySelectorAll('input[name="material"]:checked'),
  ).map((el) => el.value);
  const maxPrice = parseInt(
    document.getElementById("priceFilter")?.value || 100000,
  );

  let filtered = allJewelry;

  // Фильтр по категории
  if (category && category !== "all") {
    filtered = filtered.filter((item) => item.category === category);
  }

  // Фильтр по материалу
  if (materials.length > 0) {
    filtered = filtered.filter((item) => materials.includes(item.material));
  }

  // Фильтр по цене
  filtered = filtered.filter((item) => item.price <= maxPrice);

  displayProducts(filtered);
}

function resetFilters() {
  document.querySelectorAll('input[name="category"]').forEach((el) => {
    el.checked = el.value === "all";
  });
  document.querySelectorAll('input[name="material"]').forEach((el) => {
    el.checked = false;
  });
  document.getElementById("priceFilter").value = 100000;
  document.getElementById("priceValue").textContent = "100000";
  filterProducts();
}

// Сортировка товаров
function sortProducts() {
  if (!allJewelry.length) return;

  const sortValue = document.getElementById("sortSelect")?.value;
  let sorted = [...allJewelry];

  switch (sortValue) {
    case "price-low":
      sorted.sort((a, b) => a.price - b.price);
      break;
    case "price-high":
      sorted.sort((a, b) => b.price - a.price);
      break;
    case "newest":
      sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      break;
  }

  displayProducts(sorted);
}

// Фильтр по категории (на главной)
function filterByCategory(category) {
  window.location.href = `catalog.html?category=${category}`;
}

// ============ АУТЕНТИФИКАЦИЯ ============

async function register(e) {
  e.preventDefault();

  const name = document.getElementById("registerName").value;
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;
  const password2 = document.getElementById("registerPassword2").value;

  if (password !== password2) {
    showNotification("Пароли не совпадают", "error");
    return;
  }

  try {
    const data = await API.register(name, email, password);
    setToken(data.token);
    setUser(data.user);
    showNotification("✓ Регистрация успешна!");
    setTimeout(() => {
      window.location.href = "index.html";
    }, 1000);
  } catch (error) {
    showNotification(error.message, "error");
  }
}

async function login(e) {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  try {
    const data = await API.login(email, password);
    setToken(data.token);
    setUser(data.user);
    showNotification("✓ Вы вошли в аккаунт!");

    // Редирект в зависимости от роли
    setTimeout(() => {
      if (data.user.role === "admin") {
        window.location.href = "admin.html";
      } else {
        window.location.href = "index.html";
      }
    }, 1000);
  } catch (error) {
    showNotification(error.message, "error");
  }
}

// ============ ПРОФИЛЬ ============

async function updateProfile(e) {
  e.preventDefault();

  const updates = {
    name: document.getElementById("profileName").value,
    phone: document.getElementById("profilePhone").value,
    address: document.getElementById("profileAddress").value,
  };

  try {
    await API.updateProfile(updates);
    const user = getUser();
    user.name = updates.name;
    setUser(user);
    showNotification("✓ Профиль обновлен!");
  } catch (error) {
    showNotification(error.message, "error");
  }
}

// Проверка авторизации на защищенных страницах
function requireAuth() {
  const user = getUser();
  if (!user) {
    window.location.href = "auth.html";
  }
  return user;
}

function requireAdmin() {
  const user = getUser();
  if (!user || user.role !== "admin") {
    window.location.href = "index.html";
  }
  return user;
}
