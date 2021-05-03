const { getColletction } = require("../routes/helpers/statusCode");
const db = require("./db/db");
const { ObjectID } = require("mongodb");

class ContactsRepositories {
  async listContacts() {
    const colletction = await getColletction(db, "contacts");
    const result = await colletction.find().toArray();
    return result;
  }

  async getContactById(contactId) {
    const colletction = await getColletction(db, "contacts");
    const objectId = new ObjectID(contactId);
    const [contact] = await colletction.find({ _id: objectId }).toArray();
    return contact;
  }

  async addContact(body) {
    const colletction = await getColletction(db, "contacts");
    const incomingData = {
      ...body,
      ...(body.favorite ? {} : { favorite: false }),
    };
    const {
      ops: [result],
    } = await colletction.insertOne(incomingData);
    return result;
  }

  async removeContact(contactId) {
    const colletction = await getColletction(db, "contacts");
    const objectId = new ObjectID(contactId);
    const { value: result } = await colletction.findOneAndDelete({
      _id: objectId,
    });
    return result;
  }

  async updateContact(contactId, body) {
    const colletction = await getColletction(db, "contacts");
    const objectId = new ObjectID(contactId);

    const { value: result } = await colletction.findOneAndUpdate(
      { _id: objectId },
      { $set: { ...body } },
      { returnOriginal: false }
    );

    return result;
  }

  async updateStatusContact(contactId, body) {
    const colletction = await getColletction(db, "contacts");
    const objectId = new ObjectID(contactId);

    const { value: result } = await colletction.findOneAndUpdate(
      { _id: objectId },
      { $set: body },
      { returnOriginal: false }
    );
    console.log(result);
    return result;
  }
}

module.exports = ContactsRepositories;
