// ============ АДМИН ПАНЕЛЬ ============

// Инициализация админ панели
function initAdmin() {
  requireAdmin();
  loadDashboard();
  setupMenuListeners();
}

function setupMenuListeners() {
  document.querySelectorAll(".admin-menu a").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const sectionId =
        link.getAttribute("href").split("=")[1] ||
        link.textContent.toLowerCase().split(" ")[1];
      showSection(sectionId);
    });
  });
}

function showSection(sectionId, e) {
  if (e) e.preventDefault();

  // Скрываем все секции
  document.querySelectorAll(".admin-section").forEach((section) => {
    section.style.display = "none";
  });

  // Убираем активный класс с меню
  document.querySelectorAll(".admin-menu a").forEach((link) => {
    link.classList.remove("active");
  });

  // Показываем нужную секцию
  const section = document.getElementById(sectionId);
  if (section) {
    section.style.display = "block";

    // Добавляем активный класс
    const activeLink =
      document.querySelector(`.admin-menu a[href*="${sectionId}"]`) ||
      document.querySelector(`.admin-menu a`);
    if (activeLink) activeLink.classList.add("active");

    // Загружаем данные для секции
    if (sectionId === "jewelry") {
      loadJewelryTable();
    } else if (sectionId === "orders") {
      loadOrdersTable();
    }
  }
}

// ============ ДАШБОРД ============

async function loadDashboard() {
  try {
    const jewelryData = await API.getAllJewelry();
    const ordersData = await API.getAllOrders();

    document.getElementById("totalJewelry").textContent =
      jewelryData.jewelry.length;
    document.getElementById("totalOrders").textContent =
      ordersData.orders.length;

    const pendingTotal = ordersData.orders
      .filter((o) => o.status === "pending")
      .reduce((sum, o) => sum + o.totalPrice, 0);

    const paidTotal = ordersData.orders
      .filter((o) => o.status === "paid")
      .reduce((sum, o) => sum + o.totalPrice, 0);

    document.getElementById("pendingAmount").textContent = `${pendingTotal} ₽`;
    document.getElementById("paidAmount").textContent = `${paidTotal} ₽`;
  } catch (error) {
    console.error("Ошибка при загрузке дашборда:", error);
  }
}

// ============ УПРАВЛЕНИЕ УКРАШЕНИЯМИ ============

let currentEditingJewelry = null;

async function loadJewelryTable() {
  try {
    const data = await API.getAllJewelry();
    const table = document.getElementById("jewelryTable");

    table.innerHTML = data.jewelry
      .map(
        (item) => `
      <tr>
        <td>${item.name}</td>
        <td>${getMaterialName(item.material)}</td>
        <td>${getCategoryName(item.category)}</td>
        <td>${item.price} ₽</td>
        <td>${item.stock} шт</td>
        <td>
          <div class="action-buttons">
            <button class="btn btn-edit" onclick="editJewelry('${item._id}')">Изменить</button>
            <button class="btn btn-delete" onclick="deleteJewelry('${item._id}')">Удалить</button>
          </div>
        </td>
      </tr>
    `,
      )
      .join("");
  } catch (error) {
    console.error("Ошибка:", error);
    showNotification("Ошибка при загрузке украшений", "error");
  }
}

function showAddJewelryForm() {
  currentEditingJewelry = null;
  document.getElementById("jewelryId").value = "";
  document.getElementById("jewelryName").value = "";
  document.getElementById("jewelryPrice").value = "";
  document.getElementById("jewelryStock").value = "";
  document.getElementById("jewelryWeight").value = "";
  document.getElementById("jewelryMaterial").value = "";
  document.getElementById("jewelryCategory").value = "";
  document.getElementById("jewelryDescription").value = "";
  document.getElementById("jewelryImage").value = "";
  document.getElementById("jewelryForm").style.display = "block";
}

async function editJewelry(id) {
  try {
    const data = await API.getJewelryById(id);
    const item = data.jewelry;

    currentEditingJewelry = item;
    document.getElementById("jewelryId").value = item._id;
    document.getElementById("jewelryName").value = item.name;
    document.getElementById("jewelryPrice").value = item.price;
    document.getElementById("jewelryStock").value = item.stock;
    document.getElementById("jewelryWeight").value = item.weight;
    document.getElementById("jewelryMaterial").value = item.material;
    document.getElementById("jewelryCategory").value = item.category;
    document.getElementById("jewelryDescription").value =
      item.description || "";
    document.getElementById("jewelryImage").value = item.image || "";

    document.getElementById("jewelryForm").style.display = "block";
    document.querySelector(".form-actions button:first-child").textContent =
      "Обновить";
  } catch (error) {
    showNotification("Ошибка при загрузке украшения", "error");
  }
}

async function saveJewelry(e) {
  e.preventDefault();

  const jewelry = {
    name: document.getElementById("jewelryName").value,
    price: parseFloat(document.getElementById("jewelryPrice").value),
    stock: parseInt(document.getElementById("jewelryStock").value),
    weight: parseFloat(document.getElementById("jewelryWeight").value),
    material: document.getElementById("jewelryMaterial").value,
    category: document.getElementById("jewelryCategory").value,
    description: document.getElementById("jewelryDescription").value,
    image: document.getElementById("jewelryImage").value,
  };

  try {
    const id = document.getElementById("jewelryId").value;

    if (id) {
      await API.updateJewelry(id, jewelry);
      showNotification("✓ Украшение обновлено!");
    } else {
      await API.createJewelry(jewelry);
      showNotification("✓ Украшение добавлено!");
    }

    cancelEditJewelry();
    loadJewelryTable();
  } catch (error) {
    showNotification(error.message, "error");
  }
}

function cancelEditJewelry() {
  document.getElementById("jewelryForm").style.display = "none";
  currentEditingJewelry = null;
  document.querySelector(".form-actions button:first-child").textContent =
    "Сохранить";
}

async function deleteJewelry(id) {
  if (!confirm("Вы уверены, что хотите удалить это украшение?")) return;

  try {
    await API.deleteJewelry(id);
    showNotification("✓ Украшение удалено!");
    loadJewelryTable();
  } catch (error) {
    showNotification(error.message, "error");
  }
}

// ============ УПРАВЛЕНИЕ ЗАКАЗАМИ ============

async function loadOrdersTable() {
  try {
    const data = await API.getAllOrders();
    const table = document.getElementById("ordersTable");

    const statusEmoji = {
      pending: "⏳",
      paid: "✓",
      shipped: "📦",
      delivered: "✓",
      cancelled: "✗",
    };

    const statusText = {
      pending: "В ожидании",
      paid: "Оплачено",
      shipped: "Отправлено",
      delivered: "Доставлено",
      cancelled: "Отменено",
    };

    table.innerHTML = data.orders
      .map(
        (order) => `
      <tr>
        <td>${order._id.substring(0, 8)}</td>
        <td>${order.userId.name}</td>
        <td>${order.totalPrice} ₽</td>
        <td>
          <span class="order-status status-${order.status}">
            ${statusEmoji[order.status]} ${statusText[order.status]}
          </span>
        </td>
        <td>${new Date(order.createdAt).toLocaleDateString("ru-RU")}</td>
        <td>
          <div class="action-buttons">
            <button class="btn btn-view" onclick="viewOrder('${order._id}')">Просмотр</button>
            ${
              order.status !== "cancelled"
                ? `
              <button class="btn btn-edit" onclick="updateStatusModal('${order._id}')">Статус</button>
            `
                : ""
            }
          </div>
        </td>
      </tr>
    `,
      )
      .join("");
  } catch (error) {
    console.error("Ошибка:", error);
    showNotification("Ошибка при загрузке заказов", "error");
  }
}

function viewOrder(orderId) {
  API.getOrderById(orderId).then((data) => {
    const order = data.order;
    const modal = document.getElementById("productModal");
    const modalBody = document.getElementById("modalBody");

    let itemsHtml = order.items
      .map(
        (item) => `
      <tr>
        <td>${item.jewelryId.name}</td>
        <td>${item.quantity}</td>
        <td>${item.price} ₽</td>
        <td>${item.quantity * item.price} ₽</td>
      </tr>
    `,
      )
      .join("");

    modalBody.innerHTML = `
      <h2>Заказ #${order._id.substring(0, 8)}</h2>
      <div style="margin-bottom: 1.5rem;">
        <p><strong>Клиент:</strong> ${order.userId.name} (${order.userId.email})</p>
        <p><strong>Статус:</strong> <span class="order-status status-${order.status}"></span></p>
        <p><strong>Адрес доставки:</strong> ${order.shippingAddress}</p>
        <p><strong>Способ оплаты:</strong> ${order.paymentMethod}</p>
        <p><strong>Дата:</strong> ${new Date(order.createdAt).toLocaleDateString("ru-RU")}</p>
      </div>
      
      <h3>Товары</h3>
      <table class="admin-table" style="margin-bottom: 1.5rem;">
        <thead>
          <tr>
            <th>Товар</th>
            <th>Кол-во</th>
            <th>Цена</th>
            <th>Сумма</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>
      
      <div style="text-align: right; font-size: 1.3rem; margin-bottom: 1.5rem;">
        <strong>Итого: ${order.totalPrice} ₽</strong>
      </div>

      ${order.notes ? `<p><strong>Заметки:</strong> ${order.notes}</p>` : ""}
      
      <button class="btn btn-secondary btn-block" onclick="closeProductModal()">Закрыть</button>
    `;

    modal.style.display = "block";
  });
}

function updateStatusModal(orderId) {
  document.getElementById("statusOrderId").value = orderId;
  document.getElementById("statusModal").style.display = "block";
}

function closeStatusModal() {
  document.getElementById("statusModal").style.display = "none";
}

async function updateOrderStatus(e) {
  e.preventDefault();

  const orderId = document.getElementById("statusOrderId").value;
  const status = document.getElementById("statusSelect").value;

  try {
    await API.updateOrderStatus(orderId, status);
    closeStatusModal();
    showNotification("✓ Статус заказа обновлен!");
    loadOrdersTable();
    loadDashboard();
  } catch (error) {
    showNotification(error.message, "error");
  }
}

// Инициализация при загрузке страницы
if (window.location.pathname.includes("admin.html")) {
  document.addEventListener("DOMContentLoaded", initAdmin);
}
