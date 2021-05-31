const User = require("./Shemas/user");

class UserRepositories {
  async findById(contactId) {
    return await User.findById({ _id: contactId });
  }

  async findByEmail(email) {
    return await User.findOne({ email });
  }

  async create(userOptions) {
    const user = new User(userOptions);
    return await user.save();
  }

  async updateToken(contactId, token) {
    return await User.updateOne({ _id: contactId }, { token });
  }

  async updateSubscription(contactId, subscription) {
    return await User.findByIdAndUpdate(
      { _id: contactId },
      { ...subscription },
      { new: true }
    );
  }

  async updateAvatar(contactId, avatarUrl) {
    return await User.findByIdAndUpdate(
      { _id: contactId },
      { avatarUrl },
      { new: true }
    );
  }

  async updateVerifyToken(contactId, verify, verifyToken) {
    return await User.findByIdAndUpdate(
      { _id: contactId },
      { verify, verifyTokenEmail: verifyToken }
    );
  }

  async findByVerifyTokenEmail(token) {
    return await User.findOneAndUpdate({ verifyTokenEmail: token });
  }
}

module.exports = UserRepositories;
