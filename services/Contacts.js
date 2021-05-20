const { ContactsRepositories } = require("../model");

class ContactsServices {
  constructor() {
    this.repositories = {
      contacts: new ContactsRepositories(),
    };
  }

  async getContacts(userId, query) {
    return await this.repositories.contacts.listContacts(userId, query);
  }

  async getById(userId, contactId) {
    return await this.repositories.contacts.getContactById(userId, contactId);
  }

  async creatContact(userId, body) {
    return await this.repositories.contacts.addContact(userId, body);
  }

  async remove(userId, contactId) {
    return await this.repositories.contacts.removeContact(userId, contactId);
  }

  async update(userId, contactId, body) {
    return await this.repositories.contacts.updateContact(
      userId,
      contactId,
      body
    );
  }

  async updateStatus(userId, contactId, body) {
    return await this.repositories.contacts.updateStatusContact(
      userId,
      contactId,
      body
    );
  }
}

module.exports = ContactsServices;
