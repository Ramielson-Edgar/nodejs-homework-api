const express = require("express");
const router = express.Router();
const crt = require("../controls/contacts");
const {
  validateCreat,
  validateUpdate,
  validateUpdateStatus,
  validateObjectId,
  validateQueryContacts,
} = require("./validate/contacts");
const guard = require("../helpers/guard");

router.get("/", guard, validateQueryContacts, crt.getListContacts);
router.get("/:contactId", guard, validateObjectId, crt.getContactById);
router.post("/", guard, validateCreat, crt.creat);
router.delete("/:contactId", guard, crt.removeContact);
router.put("/:contactId", guard, validateUpdate, crt.updateContact);
router.patch(
  "/:contactId/favorite",
  guard,
  validateUpdateStatus,
  crt.updateStatusContact
);

module.exports = router;
