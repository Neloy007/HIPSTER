import User, {
  IUser,
  UserRole,
} from "../models/User";


/* =========================================================
   GET ALL CUSTOMERS
========================================================= */

export async function getAllCustomers(): Promise<IUser[]> {
  const customers = await User.find({
    role: UserRole.CUSTOMER,
  })
    .select(
      "_id name email role isActive createdAt updatedAt"
    )
    .sort({
      createdAt: -1,
    });

  return customers;
}