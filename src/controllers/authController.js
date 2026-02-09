const User = require("../models/User");
const { generateToken } = require("../utils/jwt");

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email уже зарегистрирован" });
    }

    const userRole = role === "admin" ? "admin" : "customer";

    const user = new User({
      name,
      email,
      password,
      role: userRole,
    });

    await user.save();

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      message: "Пользователь зарегистрирован",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Ошибка при регистрации", error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email и пароль обязательны" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Пользователь не найден" });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Неверный пароль" });
    }

    const token = generateToken(user._id, user.role);

    res.json({
      message: "Успешный вход",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Ошибка при входе", error: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    res.json({ user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Ошибка при получении профиля", error: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { name, phone, address },
      { new: true, runValidators: true },
    );

    res.json({
      message: "Профиль обновлен",
      user,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Ошибка при обновлении профиля", error: error.message });
  }
};

module.exports = { register, login, getProfile, updateProfile };
