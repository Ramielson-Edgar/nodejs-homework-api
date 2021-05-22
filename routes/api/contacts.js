const express = require("express");
const router = express.Router();
const controlersContacts = require("../controls/Controls");
const { validateCreat, validateUpdate } = require("../validate/validate");

router.get("/", controlersContacts.getListContacts);
router.get("/:contactId", controlersContacts.getContactById);
router.post("/", validateCreat, controlersContacts.creat);
router.delete("/:contactId", controlersContacts.removeContact);
router.put("/:contactId", validateUpdate, controlersContacts.updateContact);

module.exports = router;
