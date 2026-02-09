const Jewelry = require("../models/Jewelry");

const getAllJewelry = async (req, res) => {
  try {
    const jewelry = await Jewelry.find();
    res.json({
      count: jewelry.length,
      jewelry,
    });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Ошибка при получении украшений",
        error: error.message,
      });
  }
};

const getJewelryById = async (req, res) => {
  try {
    const jewelry = await Jewelry.findById(req.params.id);
    if (!jewelry) {
      return res.status(404).json({ message: "Украшение не найдено" });
    }
    res.json({ jewelry });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Ошибка при получении украшения",
        error: error.message,
      });
  }
};

const createJewelry = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      material,
      category,
      weight,
      stock,
      image,
    } = req.body;

    if (!name || !price || !material || !category || weight === undefined) {
      return res
        .status(400)
        .json({ message: "Заполните все обязательные поля" });
    }

    const jewelry = new Jewelry({
      name,
      description,
      price,
      material,
      category,
      weight,
      stock: stock || 0,
      image,
    });

    await jewelry.save();

    res.status(201).json({
      message: "Украшение создано",
      jewelry,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Ошибка при создании украшения", error: error.message });
  }
};

const updateJewelry = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      material,
      category,
      weight,
      stock,
      image,
    } = req.body;

    const jewelry = await Jewelry.findByIdAndUpdate(
      req.params.id,
      { name, description, price, material, category, weight, stock, image },
      { new: true, runValidators: true },
    );

    if (!jewelry) {
      return res.status(404).json({ message: "Украшение не найдено" });
    }

    res.json({
      message: "Украшение обновлено",
      jewelry,
    });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Ошибка при обновлении украшения",
        error: error.message,
      });
  }
};

const deleteJewelry = async (req, res) => {
  try {
    const jewelry = await Jewelry.findByIdAndDelete(req.params.id);
    if (!jewelry) {
      return res.status(404).json({ message: "Украшение не найдено" });
    }

    res.json({
      message: "Украшение удалено",
      jewelry,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Ошибка при удалении украшения", error: error.message });
  }
};

const getByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const jewelry = await Jewelry.find({ category });

    res.json({
      count: jewelry.length,
      jewelry,
    });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Ошибка при получении украшений",
        error: error.message,
      });
  }
};

module.exports = {
  getAllJewelry,
  getJewelryById,
  createJewelry,
  updateJewelry,
  deleteJewelry,
  getByCategory,
};
