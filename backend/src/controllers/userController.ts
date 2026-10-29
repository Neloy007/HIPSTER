import { Request, Response } from "express";
import { getAllCustomers } from "../services/userService";


/* =========================================================
   GET ALL CUSTOMERS
========================================================= */

export async function getCustomers(
  req: Request,
  res: Response
): Promise<void> {

  try {

    const customers =
      await getAllCustomers();


    res.status(200).json({
      success: true,

      data: {
        customers,
      },
    });

  } catch (error) {

    console.error(
      "Get customers error:",
      error
    );


    res.status(500).json({
      success: false,

      message:
        "Unable to retrieve customers.",
    });

  }
}