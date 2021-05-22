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


  async creatContact(body) {
    return await this.repositories.contacts.addContact(body);

 

  async remove(contactId) {
    return await this.repositories.contacts.removeContact(contactId);
  }


  async update(contactId, body) {
    return await this.repositories.contacts.updateContact(contactId, body);
  }

  async updateStatus(contactId, body) {
    return await this.repositories.contacts.updateStatusContact(
      contactId,
      body
    );
  }
}

module.exports = ContactsServices;
