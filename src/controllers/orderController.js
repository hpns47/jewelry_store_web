const Order = require("../models/Order");
const Jewelry = require("../models/Jewelry");

const createOrder = async (req, res) => {
  try {
    const { items, paymentMethod, shippingAddress, notes } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Выберите товары" });
    }

    if (!paymentMethod || !shippingAddress) {
      return res
        .status(400)
        .json({ message: "Укажите способ оплаты и адрес доставки" });
    }

    let totalPrice = 0;
    const orderItems = [];

    for (const item of items) {
      const jewelry = await Jewelry.findById(item.jewelryId);

      if (!jewelry) {
        return res
          .status(404)
          .json({ message: `Украшение не найдено: ${item.jewelryId}` });
      }

      if (jewelry.stock < item.quantity) {
        return res
          .status(400)
          .json({ message: `Недостаточно украшения: ${jewelry.name}` });
      }

      orderItems.push({
        jewelryId: jewelry._id,
        quantity: item.quantity,
        price: jewelry.price,
      });

      totalPrice += jewelry.price * item.quantity;
    }

    const order = new Order({
      userId: req.user.userId,
      items: orderItems,
      totalPrice,
      paymentMethod,
      shippingAddress,
      notes,
    });

    for (const item of items) {
      await Jewelry.findByIdAndUpdate(item.jewelryId, {
        $inc: { stock: -item.quantity },
      });
    }

    await order.save();

    res.status(201).json({
      message: "Заказ создан",
      order,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Ошибка при создании заказа", error: error.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.userId }).populate(
      "items.jewelryId",
    );

    res.json({
      count: orders.length,
      orders,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Ошибка при получении заказов", error: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "items.jewelryId",
    );

    if (!order) {
      return res.status(404).json({ message: "Заказ не найден" });
    }

    if (
      order.userId.toString() !== req.user.userId &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Доступ запрещен" });
    }

    res.json({ order });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Ошибка при получении заказа", error: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email phone")
      .populate("items.jewelryId", "name price");

    res.json({
      count: orders.length,
      orders,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Ошибка при получении заказов", error: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (
      !["pending", "paid", "shipped", "delivered", "cancelled"].includes(status)
    ) {
      return res.status(400).json({ message: "Неверный статус" });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    ).populate("items.jewelryId");

    if (!order) {
      return res.status(404).json({ message: "Заказ не найден" });
    }

    res.json({
      message: "Статус заказа обновлен",
      order,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Ошибка при обновлении заказа", error: error.message });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Заказ не найден" });
    }

    if (order.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Доступ запрещен" });
    }

    if (["shipped", "delivered"].includes(order.status)) {
      return res
        .status(400)
        .json({ message: "Невозможно отменить этот заказ" });
    }

    for (const item of order.items) {
      await Jewelry.findByIdAndUpdate(item.jewelryId, {
        $inc: { stock: item.quantity },
      });
    }

    order.status = "cancelled";
    await order.save();

    res.json({
      message: "Заказ отменен",
      order,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Ошибка при отмене заказа", error: error.message });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
};
