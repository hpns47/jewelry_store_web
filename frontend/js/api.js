// ============ API ============
const API = {
  BASE_URL: "http://localhost:5000/api",

  // Аутентификация
  async register(name, email, password) {
    const res = await fetch(`${this.BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  async login(email, password) {
    const res = await fetch(`${this.BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  async getProfile(userId) {
    const token = getToken();
    const res = await fetch(`${this.BASE_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  async updateProfile(updates) {
    const token = getToken();
    const res = await fetch(`${this.BASE_URL}/auth/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  // Украшения
  async getAllJewelry() {
    const res = await fetch(`${this.BASE_URL}/jewelry`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  async getJewelryById(id) {
    const res = await fetch(`${this.BASE_URL}/jewelry/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  async getByCategory(category) {
    const res = await fetch(`${this.BASE_URL}/jewelry/category/${category}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  async createJewelry(jewelry) {
    const token = getToken();
    const res = await fetch(`${this.BASE_URL}/jewelry`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(jewelry),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  async updateJewelry(id, jewelry) {
    const token = getToken();
    const res = await fetch(`${this.BASE_URL}/jewelry/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(jewelry),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  async deleteJewelry(id) {
    const token = getToken();
    const res = await fetch(`${this.BASE_URL}/jewelry/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  // Заказы
  async createOrder(order) {
    const token = getToken();
    const res = await fetch(`${this.BASE_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(order),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  async getMyOrders() {
    const token = getToken();
    const res = await fetch(`${this.BASE_URL}/orders/my-orders`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  async getOrderById(id) {
    const token = getToken();
    const res = await fetch(`${this.BASE_URL}/orders/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  async getAllOrders() {
    const token = getToken();
    const res = await fetch(`${this.BASE_URL}/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  async updateOrderStatus(id, status) {
    const token = getToken();
    const res = await fetch(`${this.BASE_URL}/orders/${id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  async cancelOrder(id) {
    const token = getToken();
    const res = await fetch(`${this.BASE_URL}/orders/${id}/cancel`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },
};
