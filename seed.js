require("dotenv").config();
const mongoose = require("mongoose");
const Jewelry = require("./src/models/Jewelry");
const User = require("./src/models/User");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB подключена");
  } catch (error) {
    console.error("Ошибка подключения:", error);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  try {
    // Очищаем БД
    await Jewelry.deleteMany({});
    await User.deleteMany({});

    // Создаем админа
    const admin = new User({
      name: "Администратор",
      email: "admin@jewelry.com",
      password: "admin123",
      role: "admin",
    });
    await admin.save();
    console.log("✓ Админ создан");

    const customer = new User({
      name: "Иван Покупатель",
      email: "customer@jewelry.com",
      password: "customer123",
      role: "customer",
    });
    await customer.save();
    console.log("Покупатель создан");

    const jewelry = [
      {
        name: "Кольцо с бриллиантом",
        description:
          "Элегантное кольцо из белого золота с бриллиантом высокого качества",
        price: 15000,
        material: "gold",
        category: "ring",
        weight: 5.2,
        stock: 10,
      },
      {
        name: "Серебристое ожерелье",
        description: "Изящное ожерелье из серебра с цепью толщиной 2мм",
        price: 3500,
        material: "silver",
        category: "necklace",
        weight: 8.5,
        stock: 15,
      },
      {
        name: "Браслет из платины",
        description:
          "Браслет из чистой платины, идеален для каждодневного ношения",
        price: 25000,
        material: "platinum",
        category: "bracelet",
        weight: 12.0,
        stock: 5,
      },
      {
        name: "Золотые серьги",
        description: "Парные золотые серьги с жемчугом",
        price: 8000,
        material: "gold",
        category: "earring",
        weight: 3.5,
        stock: 20,
      },
      {
        name: "Серебряная брошь",
        description: "Красивая брошь в форме цветка из серебра",
        price: 2500,
        material: "silver",
        category: "brooch",
        weight: 6.2,
        stock: 12,
      },
      {
        name: "Платиновое кольцо",
        description: "Современное минималистичное кольцо из платины",
        price: 20000,
        material: "platinum",
        category: "ring",
        weight: 8.0,
        stock: 7,
      },
    ];

    await Jewelry.insertMany(jewelry);
    console.log(`✓ ${jewelry.length} украшений создано`);

    console.log("\nТестовые данные загружены:");
    console.log("Админ: admin@jewelry.com / admin123");
    console.log("Покупатель: customer@jewelry.com / customer123");

    process.exit(0);
  } catch (error) {
    console.error("Ошибка при загрузке данных:", error);
    process.exit(1);
  }
};

connectDB().then(() => seedDatabase());