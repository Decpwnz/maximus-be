const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  salary: {
    type: Number,
    required: true,
    min: 0,
  },
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
  employer: { type: mongoose.Schema.Types.ObjectId, ref: 'Employer' },
});

const EmployeeSchema = mongoose.Schema({
  workplaceNumber: {
    type: Number,
    required: true,
  },
  lunchTime: {
    type: Number,
    required: true,
  },
});

const EmployerSchema = mongoose.Schema({
  availableHours: {
    type: {
      start: {
        type: Number,
        required: true,
      },
      end: {
        type: Number,
        required: true,
      },
    },
    required: true,
  },
});

const User = mongoose.model('User', UserSchema);
const Employee = mongoose.model('Employee', EmployeeSchema);
const Employer = mongoose.model('Employer', EmployerSchema);

module.exports = {
  User,
  Employee,
  Employer,
};
