import Contact from "../models/Contact.js";

// Create Contact
export const createContact = async (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !phone || !message) {
    return res.status(400).json({
      success: false,
      message: "Name, email, phone, and message are required fields",
    });
  }

  try {
    const newContact = new Contact({
      name,
      email,
      phone,
      message,
    });

    await newContact.save();

    res.status(201).json({
      success: true,
      message: "Contact created successfully",
      data: newContact,
    });
  } catch (error) {
    console.error(error.message);

    res.status(500).json({
      success: false,
      message: "Failed to create contact",
    });
  }
};

// Get all contacts
export const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find();

    res.status(200).json({
      success: true,
      count: contacts.length,
      message: "Contacts retrieved successfully",
      data: contacts,
    });
  } catch (err) {
    console.error(err.message);

    res.status(500).json({
      success: false,
      message: "Failed to get contacts",
    });
  }
};

// Get single contact
export const getSingleContact = async (req, res) => {
  const id = req.params.id;

  try {
    const contact = await Contact.findById(id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Contact retrieved successfully",
      data: contact,
    });
  } catch (err) {
    console.error(err.message);

    res.status(500).json({
      success: false,
      message: "Failed to get the contact",
    });
  }
};