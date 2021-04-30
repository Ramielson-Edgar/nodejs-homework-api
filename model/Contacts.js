const fs = require("fs").promises;
const path = require("path");
const contactPath = path.join(__dirname, "./contacts.json");
const contacts = fs.readFile(contactPath);
const shortid = require("shortid");

class ContactsRepositories {
  async listContacts() {
    const allcontacts = await contacts;
    const parse = JSON.parse(allcontacts);
    return parse;
  }

  async getContactById(contactId) {
    const allcontacts = await this.listContacts();
    const getId = allcontacts.find((el) => String(el.id) === contactId);
    return getId;
  }

  async addContact(name, email, phone) {
    const allcontacts = await this.listContacts();
    const incomingData = { id: shortid.generate(), name, email, phone };

    const data = JSON.stringify([...allcontacts, incomingData]);
    fs.writeFile(contactPath, data, (err) => {
      err && console.log(err.message);
    });

    return incomingData;
  }

  async removeContact(contactId) {
    const list = await this.listContacts();
    const getContact = await this.getContactById(contactId);
    const removeContactById = list.filter(({ id }) => String(id) !== contactId);

    fs.writeFile(contactPath, JSON.stringify(getContact), (err) => {
      err && console.log(err.message);
    });

    return removeContactById;
  }

  async updateContact(contactId, name, email, phone) {
    const list = await this.listContacts();
    const contactById = await this.getContactById(contactId);
    const updater = { name, email, phone };
    const updatedContact = Object.assign(contactById, updater);

    const updateContactList = list.map((contact) => {
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
