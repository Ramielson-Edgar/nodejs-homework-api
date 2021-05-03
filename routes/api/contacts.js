const express = require("express");
const router = express.Router();
const crt = require("../controls/Controls");
const {
  validateCreat,
  validateUpdate,
  validateUpdateStatus,
} = require("../validate/validate");

router.get("/", crt.getListContacts);
router.get("/:contactId", crt.getContactById);
router.post("/", validateCreat, crt.creat);
router.delete("/:contactId", crt.removeContact);
router.put("/:contactId", validateUpdate, crt.updateContact);
router.patch(
  "/:contactId/favorite",
  validateUpdateStatus,
  crt.updateStatusContact
);

module.exports = router;
