const prisma = require("../utils/prisma");

class UserService {
  async createUser(userData) {
    return prisma.user.create({
      data: userData,
    });
  }

  async getUserById(id) {
    return prisma.user.findUnique({
      where: { id: parseInt(id) },
    });
  }

  async getUserByEmail(email) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async updateUser(id, userData) {
    return prisma.user.update({
      where: { id: parseInt(id) },
      data: userData,
    });
  }

  async deleteUser(id) {
    return prisma.user.delete({
      where: { id: parseInt(id) },
    });
  }

  async getAllUsers() {
    return prisma.user.findMany();
  }
}

module.exports = new UserService();
