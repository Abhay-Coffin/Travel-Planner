import express from "express";

import {
  createContact,
  getAllContacts,
  getSingleContact,
} from "../controllers/contactController.js";

import verifyToken, {
  verifyAdmin,
} from "../utils/verifyToken.js";

const contactRoute = express.Router();

// Create contact message
contactRoute.post("/", createContact);

// Get single contact (Admin only)
contactRoute.get(
  "/:id",
  verifyToken,
  verifyAdmin,
  getSingleContact
);

// Get all contacts (Admin only)
contactRoute.get(
  "/",
  verifyToken,
  verifyAdmin,
  getAllContacts
);

export default contactRoute;