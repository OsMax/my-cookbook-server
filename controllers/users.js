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
  const { file } = req;
  const info = JSON.parse(req.body.info);
  console.log(info.email);

  const hashPassword = await bcrypt.hash(info.password, 10);

  if (!info.name) {
    info.name = "Anonim";
  }

  const newUser = await User.create({
    ...info,
    password: hashPassword,
    avatarURL:
      "https://res.cloudinary.com/dykzy8ppw/image/upload/v1714261580/cookbook/avatarDefault.png",
  });
  // console.log(newUser.id);
  const { id } = newUser;

  const token = jwt.sign({ id }, SECRET_KEY, { expiresIn: "3d" });
  await User.findByIdAndUpdate(id, { token });

  const user = {
    id: newUser.id,
    email: newUser.email,
    name: newUser.name,
    avatarURL: newUser.avatarURL,
  };
  // console.log(newUser.token, user);

  if (file) {
    const { path: tempUpload, originalname } = req.file;
    const fileName = originalname.split(".");
    const newFileName = path.join(
      "temp",
      `${newUser.id}` + "." + `${fileName[1]}`
    );

    await Jimp.read(tempUpload).then((ava) =>
      ava.resize(250, 250).write(newFileName)
    );
    await fs.unlink(tempUpload);

    const avatar = await uploadImage(newFileName);
    await fs.unlink(newFileName);

    await User.findByIdAndUpdate(newUser.id, { avatarURL: avatar.url });
    user.avatarURL = avatar.url;
  }

  res.status(201).json({
    token,
    user,
  });
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

// EDIT
// ================================================================================================
const editUser = async (req, res) => {
  const { id } = req.user;
  const { file } = req;
  const { name, email, password } = JSON.parse(req.body.info);
  // console.log(name);
  const editUser = {};

  if (password) {
    const hashPassword = await bcrypt.hash(password, 10);
    editUser.password = hashPassword;
  }
  if (name) {
    editUser.name = name;
  }
  if (email) {
    editUser.email = email;
  }
  if (file) {
    const { path: tempUpload, originalname } = req.file;
    const fileName = originalname.split(".");
    const newFileName = path.join("temp", `${id}` + "." + `${fileName[1]}`);

    await Jimp.read(tempUpload).then((ava) =>
      ava.resize(250, 250).write(newFileName)
    );
    await fs.unlink(tempUpload);

    const avatar = await uploadImage(newFileName);
    await fs.unlink(newFileName);

    //  await User.findByIdAndUpdate(id, { avatarURL: avatar.url });
    editUser.avatarURL = avatar.url;
  }
  // console.log(editUser);
  const user = await User.findByIdAndUpdate(
    id,
    { ...editUser },
    {
      new: true,
    }
  );

  res.status(203).json({
    user: {
      _id: user.id,
      name: user.name,
      email: user.email,
      avatarURL: user.avatarURL,
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

const test = async (req, res) => {
  console.log("AVATAR");
  if (req.file) {
    console.log(req.file);
  }
  console.log(req.body);
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  editUser: ctrlWrapper(editUser),
  // editUserInfo: ctrlWrapper(editUserInfo),
  restoreMail: ctrlWrapper(restoreMail),
  restorePassword: ctrlWrapper(restorePassword),
  test,
};
