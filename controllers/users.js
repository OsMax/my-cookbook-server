const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Jimp = require("jimp");
const fs = require("fs/promises");
const path = require("path");
const { nanoid } = require("nanoid");

const { User } = require("../models/user");

const uploadImage = require("../helpers/cloudinary/cloudinaryAPI");

const {
  ctrlWrapper,
  HttpError,
  emailSend,
  passwordLetter,
} = require("../helpers");

const { SECRET_KEY } = process.env;

// REGISTER
// ================================================================================================

const register = async (req, res, next) => {
  const { password, email } = req.body;

  const hashPassword = await bcrypt.hash(password, 10);

  if (!req.body.name) {
    req.body.name = "Anonim";
  }
  console.log(req.body);
  console.log(req.file);
  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL: "",
  });
  const { id } = await User.findOne({ email });
  const token = jwt.sign({ id }, SECRET_KEY, { expiresIn: "3d" });
  await User.findByIdAndUpdate(id, { token });

  const user = {
    id: newUser.id,
    email: newUser.email,
    name: newUser.name,
  };

  if (req.file) {
    const { path: tempUpload, originalname } = req.file;
    const fileName = originalname.split(".");
    const newFileName = path.join("temp", `${id}` + "." + `${fileName[1]}`);

    await Jimp.read(tempUpload).then((ava) =>
      ava.resize(250, 250).write(newFileName)
    );
    await fs.unlink(tempUpload);

    const avatar = await uploadImage(newFileName);
    await fs.unlink(newFileName);

    await User.findByIdAndUpdate(id, { avatarURL: avatar.url });
    user.avatarURL = avatar.url;
  }
  res.status(201).json({
    token,
    user,
  });
};

const test = async (req, res) => {
  if (req.file) {
    console.log(req.file);
  }
  console.log(req.body);
};

// LOGIN
// ================================================================================================
const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw HttpError(401, "Email or password is wrong");
  }
  const { id } = user;

  const token = jwt.sign({ id }, SECRET_KEY, { expiresIn: "3d" });

  await User.findByIdAndUpdate(id, { token });

  res.status(200).json({
    token,
    user: {
      _id: user.id,
      email: user.email,
      name: user.name,
      gender: user.gender,
      avatarURL: user.avatarURL,
      startDay: user.startDay,
    },
  });
};

// LOGOUT
// ================================================================================================
const logout = async (req, res) => {
  const { id } = req.user;
  await User.findByIdAndUpdate(id, { token: "" });
  res.status(204).send();
};

// CURRENT_USER
// ================================================================================================
const getCurrent = async (req, res) => {
  const user = req.user;
  res.json({
    user: {
      _id: user.id,
      email: user.email,
      name: user.name,
      gender: user.gender,
      avatarURL: user.avatarURL,
      startDay: user.startDay,
    },
  });
};

// AVATAR
// ================================================================================================
const changeAvatar = async (req, res) => {
  const { _id } = req.user;

  if (!req.file) throw HttpError(400);

  const { path: tempUpload, originalname } = req.file;
  const fileName = originalname.split(".");
  const newFileName = path.join("temp", `${_id}` + "." + `${fileName[1]}`);

  await Jimp.read(tempUpload).then((ava) =>
    ava.resize(250, 250).write(newFileName)
  );
  await fs.unlink(tempUpload);

  const avatar = await uploadImage(newFileName);
  await fs.unlink(newFileName);

  await User.findByIdAndUpdate(_id, { avatarURL: avatar.url });

  res.json({ avatarURL: avatar.url });
};

// EDIT_INFORMATION
// ==================================================================================================
const editUserInfo = async (req, res) => {
  const keys = Object.keys(req.body);
  if (keys.length === 0) {
    throw HttpError(400);
  }
  const newUserInfo = req.body;
  if (req.body.newPassword) {
    if (!req.body.password) {
      throw HttpError(401, "Current password is empty");
    }
    if (!(await bcrypt.compare(req.body.password, req.user.password))) {
      throw HttpError(401, "Somthing wrong!");
    }
    const hashPassword = await bcrypt.hash(req.body.newPassword, 10);
    newUserInfo.password = hashPassword;
  } else {
    delete newUserInfo.password;
  }
  const { _id } = req.user;
  const user = await User.findByIdAndUpdate(
    _id,
    { ...newUserInfo },
    {
      new: true,
    }
  );
  res.status(200).json({
    user: {
      _id: user.id,
      email: user.email,
      name: user.name,
      gender: user.gender,
      norm: user.norm,
      avatarURL: user.avatarURL,
      startDay: user.startDay,
    },
  });
};

// FORGOT PASSWORD EMAIL
// ==================================================================================================
const restoreMail = async (req, res) => {
  const { email } = req.body;

  const verificationToken = nanoid();
  const user = await User.findOneAndUpdate({ email }, { verificationToken });
  if (!user) {
    throw HttpError(401, "Wrong email");
  }

  const emailToPassword = passwordLetter(email, verificationToken);
  await emailSend(emailToPassword);
  res.status(201).json({ email });
};

// RESTORE PASSWORD
// ==================================================================================================
const restorePassword = async (req, res) => {
  const { verificationToken } = req.params;
  const { password } = req.body;

  const user = await User.findOne({ verificationToken });
  if (!user) {
    throw HttpError(401, "Wrong link");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  await User.findByIdAndUpdate(
    { _id: user.id },
    {
      verificationToken: null,
      password: hashPassword,
    }
  );
  res.status(201).json({ user: { id: user.id, email: user.email } });
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  changeAvatar: ctrlWrapper(changeAvatar),
  editUserInfo: ctrlWrapper(editUserInfo),
  restoreMail: ctrlWrapper(restoreMail),
  restorePassword: ctrlWrapper(restorePassword),
  test,
};
