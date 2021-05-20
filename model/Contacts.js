const Contact = require("./Shemas/contacts");

class ContactsRepositories {
  async listContacts(userId, query) {
    const {
      sortBy,
      sortByDesc,
      filter,
      limit = 5,
      page = 0,
      favorite = false,
    } = query;
    const searchParams = { owner: userId };

    if (favorite !== null) searchParams.favorite = favorite;

    return await Contact.paginate(searchParams, {
      limit,
      page,
      filter,
      favorite,
      sort: {
        ...(sortBy ? { [`${sortBy}`]: 1 } : {}),
        ...(sortByDesc ? { [`${sortByDesc}`]: -1 } : {}),
      },
      select: filter ? filter.split("|").join(" ") : "",
      populate: {
        path: "owner",
        select: "email subscription -_id",
      },
    });
  }

  async getContactById(userId, contactId) {
    return await Contact.find({ _id: contactId, owner: userId }).populate({
      path: "owner",
      select: "email subscription -_id",
    });
  }

  async addContact(userId, body) {
    return await Contact.create({ ...body, owner: userId });
  }

  async removeContact(userId, contactId) {
    return await Contact.findByIdAndRemove({
      _id: contactId,
      owner: userId,
    });
  }

  async updateContact(userId, contactId, body) {
    return await Contact.findOneAndUpdate(
      { _id: contactId, owner: userId },
      { ...body },
      { new: true }
    );
  }

  async updateStatusContact(userId, contactId, body) {
    return await Contact.findOneAndUpdate(
      { _id: contactId, owner: userId },
      { ...body },
      { new: true }
    );
  }
}

module.exports = ContactsRepositories;
