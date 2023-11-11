require("dotenv").config({ path: "./config/config.env" });
const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
router.post("/login");
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  //check all the missing fields
  if (!name || !email || !password)
    return res
      .status(400)
      .json({ error: `Please enter all the required fields.` });

  //name validations
  if (name.length > 25)
    return res
      .status(400)
      .json({ error: "Name can only be less than 25 characters" });

  //email validations
  const emailReg =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (!emailReg.test(email))
    return res
      .status(400)
      .json({ error: "Please enter a valid email address" });

  //password validation

  if (password < 6)
    return res
      .status(400)
      .json({ error: "Password must greater than 6 characters" });

  try {
    const doesUserAlreadyExists = await User.findOne({ email });
    const hashPassword = await bcrypt.hash(password, 12);
    const newUser = new User({ name, email, password: hashPassword });

    if (doesUserAlreadyExists)
      return res.status(400).json({
        error: `A user with the email[${email}] already exists, try different email`,
      });

    //save user
    const result = await newUser.save();

    result._doc.password = undefined;

    return res.status(201).json({ ...result._doc });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res
      .status(400)
      .json({ error: "please enter all the required fields!" });

  //email validations
  const emailReg =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (!emailReg.test(email))
    return res
      .status(400)
      .json({ error: "Please enter a valid email address" });

  try {
    const doesUserExists = await User.findOne({ email });

    if (!doesUserExists)
      return res.status(400).json({ error: "Invalid email or password!" });
    //if user available
    const doesPasswordMatch = await bcrypt.compare(
      password,
      doesUserExists.password
    );

    if (!doesPasswordMatch)
      return res.status(400).json({ error: "Invalid email or password!" });
    const payload = { _id: doesUserExists._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      //expiresIn: "1h",
    });

    const user = { ...doesUserExits._doc, password: undefined };
    return res.status(200).json({ token, user });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});


router.get("/me", auth, async (req, res) => {
  return res.status(200).json({ ...req.user._doc });
});

module.exports = router;
