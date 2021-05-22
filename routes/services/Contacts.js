const { ContactsRepositories } = require("../../model");

class ContactsServices {
  constructor() {
    this.repositories = {
      contacts: new ContactsRepositories(),
    };
  }

  async getContacts() {
    return await this.repositories.contacts.listContacts();
  }

  async getById(contactId) {
    return await this.repositories.contacts.getContactById(contactId);
  }

  async creatContact(name, email, phone) {
    return await this.repositories.contacts.addContact(name, email, phone);
  }

  async remove(contactId) {
    return await this.repositories.contacts.removeContact(contactId);
  }

  async update(contactId, name, email, phone) {
    return await this.repositories.contacts.updateContact(
      contactId,
      name,
      email,
      phone
    );
  }
}

module.exports = ContactsServices;
