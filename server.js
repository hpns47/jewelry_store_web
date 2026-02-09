require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/database");

// Роуты
const authRoutes = require("./src/routes/authRoutes");
const jewelryRoutes = require("./src/routes/jewelryRoutes");
const orderRoutes = require("./src/routes/orderRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Подключаемся к БД
connectDB();

// API маршруты
app.use("/api/auth", authRoutes);
app.use("/api/jewelry", jewelryRoutes);
app.use("/api/orders", orderRoutes);

// Базовый маршрут
app.get("/", (req, res) => {
  res.json({
    message: "✨ Добро пожаловать в API ювелирного магазина",
    version: "1.0.0",
  });
});

// Обработка 404
app.use((req, res) => {
  res.status(404).json({ message: "Маршрут не найден" });
});

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || "Внутренняя ошибка сервера",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
});