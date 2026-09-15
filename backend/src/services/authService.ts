import bcrypt from "bcryptjs";
import User, { IUser } from "../models/User";

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export const registerUser = async (
  data: RegisterData
): Promise<IUser> => {
  const { name, email, password } = data;

  const normalizedEmail = email.toLowerCase().trim();

  const existingUser = await User.findOne({
    email: normalizedEmail,
  });

  if (existingUser) {
    throw new Error("An account with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password: hashedPassword,
  });

  return user;
};