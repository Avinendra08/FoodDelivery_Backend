import jwt from "jsonwebtoken";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

export const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, phoneNumber, city, state, password } = req.body;
  if (!fullName || !email || !phoneNumber || !password || !city || !state) {
    res.status(400);
    throw new Error("All fields are required");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("Email already in use");
  }

  const user = await User.create({ fullName, email, phoneNumber, city, state, password });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  const accessToken = await user.generateAccessToken();

  res.status(201).json({
    message: "User registered successfully",
    user: {
      id: user._id,
      name: user.fullName,
      accessToken: accessToken,
    },
  });
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new Error(400, "email and password is required");
  }
  const user = await User.findOne({ email });

  if (!user || !(await user.isPasswordCorrect(password))) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  const accessToken = await user.generateAccessToken();
  res.status(201).json({
    message: "Login successful",
    user: {
      id: user._id,
      name: user.fullName,
      accessToken: accessToken,
    },
  });
});
