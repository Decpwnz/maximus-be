const winston = require('winston');

const { User, Employee, Employer } = require('../models/User');

const logger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),
  ],
});

const seedDatabase = async () => {
  try {
    await Promise.all([
      User.deleteMany({}),
      Employee.deleteMany({}),
      Employer.deleteMany({}),
    ])
      .then(() => logger.info('Deleting database data'));

    const john = new Employee({ workplaceNumber: 1, lunchTime: 1 });
    const eva = new Employer({ availableHours: { start: 1, end: 2 } });

    await john.save();
    await eva.save();

    const employeeJohn = new User({
      type: 'Employee', name: 'John Wick', salary: 343, employee: john.id,
    });

    const employerEva = new User({
      type: 'Employer', name: 'Eva Bird', salary: 889, employer: eva.id,
    });

    await employeeJohn.save();
    await employerEva.save();

    logger.info('Database populated with initial data.');
  } catch (error) {
    logger.error('An error occurred while populating the database:', error);
  }
};

module.exports = seedDatabase;
