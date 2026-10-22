const { users } = require('../models/userModel');

exports.findByEmail = async (email) => {
  return users.find(u => u.email === email);
};

exports.findById = async (id) => {
  return users.find(u => u.id === id);
};

exports.create = async (newUser) => {
  users.push(newUser);
  return newUser;
};

exports.findAll = async () => {
  return users;
};