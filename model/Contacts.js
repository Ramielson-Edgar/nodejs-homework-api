const fs = require("fs").promises;
const path = require("path");
const contactPath = path.join(__dirname, "./contacts.json");
const contacts = fs.readFile(contactPath);
const shortid = require("shortid");

class ContactsRepositories {
  async listContacts() {
    return await contacts
      .then((data) => JSON.parse(data))
      .catch((err) => err.message);
  }

  async getContactById(contactId) {
    return await this.listContacts()
      .then((contacts) => contacts.find((el) => String(el.id) === contactId))
      .catch((error) => error.message);
  }

  async addContact(name, email, phone) {
    const data = await this.listContacts()
      .then((contact) => {
        const id = shortid.generate();
        const incomingData = { id, name, email, phone };

        const data = JSON.stringify([...contact, incomingData]);
        fs.writeFile(contactPath, data, (err) => {
          err && console.log(err.message);
        });

        return incomingData;
      })
      .catch((error) => error.message);

    return data;
  }

  async removeContact(contactId) {
    const list = await this.listContacts();
    const remove = this.getContactById(contactId);
    const contacts = list.filter(({ id }) => String(id) !== contactId);

    const data = JSON.stringify(contacts);
    fs.writeFile(contactPath, data, (err) => {
      err && console.log(err.message);
    });

    return remove;
  }

  async updateContact(contactId, name, email, phone) {
    const list = await this.listContacts();
    const updater = { name, email, phone };
    const updateContactlist = list.find(({ id }) => String(id) === contactId);
    Object.assign(updateContactlist, updater);
    await fs.writeFile(contactPath, JSON.stringify(list, null, "\t"));
    return updateContactlist;
  }
}

module.exports = ContactsRepositories;
