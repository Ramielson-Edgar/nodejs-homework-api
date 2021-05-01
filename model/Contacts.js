const fs = require("fs").promises;
const path = require("path");
const contactPath = path.join(__dirname, "./contacts.json");
const contacts = fs.readFile(contactPath);
const shortid = require("shortid");

class ContactsRepositories {
  async listContacts() {
    const allContacts = await contacts;
    const parse = JSON.parse(allContacts);
    return parse;
  }

  async getContactById(contactId) {
    const allContacts = await this.listContacts();
    const contact = allContacts.find(({ id }) => String(id) === contactId);
    return contact;
  }

  async addContact(name, email, phone) {
    const allContacts = await this.listContacts();
    const incomingData = { id: shortid.generate(), name, email, phone };

    fs.writeFile(
      contactPath,
      JSON.stringify([...allContacts, incomingData]),
      (err) => {
        err && console.log(err.message);
      }
    );

    return incomingData;
  }

  async removeContact(contactId) {
    const allContacts = await this.listContacts();
    const contact = await this.getContactById(contactId);
    const newContacts = allContacts.filter(
      ({ id }) => String(id) !== contactId
    );

    fs.writeFile(contactPath, JSON.stringify(contact), (err) => {
      err && console.log(err.message);
    });

    return newContacts;
  }

  async updateContact(contactId, name, email, phone) {
    const allContacts = await this.listContacts();
    const contact = await this.getContactById(contactId);
    const updater = { name, email, phone };
    const updatedContact = Object.assign(contact, updater);

    const updateContactList = allContacts.map((contact) => {
      return String(contact.id) === contactId ? updatedContact : contact;
    });

    await fs.writeFile(
      contactPath,
      JSON.stringify(updateContactList, null, "\t")
    );
    return updatedContact;
  }
}

module.exports = ContactsRepositories;
