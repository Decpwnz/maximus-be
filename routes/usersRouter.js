const express = require('express');

const { User, Employee, Employer } = require('../models/User');

const router = express.Router();

const MemberType = {
  Employee: 'Employee',
  Employer: 'Employer',
};

router.get('/', async (req, res) => {
  try {
    const users = await User.find().populate('employee employer');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const {
      type, name, salary, workplaceNumber, lunchTime, availableHours,
    } = req.body;

    let newUser;
    let newEmployee;
    let newEmployer;

    if (type === MemberType.Employee) {
      newEmployee = new Employee({ workplaceNumber, lunchTime });

      newUser = new User({
        type, name, salary, employee: newEmployee.id,
      });

      const savedEmployee = await newEmployee.save();
      newUser.employee = savedEmployee.id;
    }

    if (type === MemberType.Employer) {
      const { start, end } = availableHours;
      newEmployer = new Employer({
        availableHours: { start, end },
      });

      newUser = new User({
        type, name, salary, employer: newEmployer.id,
      });

      const savedEmployer = await newEmployer.save();
      newUser.employer = savedEmployer.id;
    }

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).populate('employee employer');
    if (!user) {
      return res.status(404).send('User not found');
    }
    return res.status(200).json(user);
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).send('User not found');
    }
    return res.status(204).send();
  } catch (err) {
    return res.json({ message: err });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      type, name, salary, lunchTime, workplaceNumber, availableHours,
    } = req.body;

    let updatedUser;
    let updatedEmployee;
    let updatedEmployer;

    if (type === MemberType.Employee) {
      updatedUser = await User.findByIdAndUpdate(
        id,
        { type, name, salary },
        { new: true },
      );

      updatedEmployee = await Employee.findByIdAndUpdate(
        updatedUser.employee,
        { lunchTime, workplaceNumber },
        { new: true },
      );
    } else if (type === MemberType.Employer) {
      updatedUser = await User.findByIdAndUpdate(
        id,
        { type, name, salary },
        { new: true },
      );

      updatedEmployer = await Employer.findByIdAndUpdate(
        updatedUser.employer,
        { availableHours },
        { new: true },
      );
    }

    if (!updatedUser) {
      return res.status(404).send('Employee or Employer not found');
    }

    return res.status(200).json({
      message: `Successfully updated: ${id}`,
      user: updatedUser,
      employee: updatedEmployee,
      employer: updatedEmployer,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.body;

    let updatedUser;
    let updatedEmployee;
    let updatedEmployer;

    if (type === MemberType.Employee) {
      updatedUser = await User.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      updatedEmployee = await Employee.findByIdAndUpdate(updatedUser.employee, req.body, {
        new: true,
      });
    }

    if (type === MemberType.Employer) {
      updatedUser = await User.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      updatedEmployer = await Employer.findByIdAndUpdate(updatedUser.employer, req.body, {
        new: true,
      });
    }

    if (!updatedUser) {
      return res.status(404).send('Employer or Employee not found');
    }
    return res.status(200).json({
      messsage: `Succesfully updated: ${id}`,
      user: updatedUser,
      employee: updatedEmployee,
      employer: updatedEmployer,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;
