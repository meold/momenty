import { faker } from '@faker-js/faker';
import { sequelize } from './models/index.mjs';

var data = [];
for(var i = 0 ; i < 497 ; i++){
  data.push({
    name: faker.name.findName(),
    email: faker.internet.email(),
    title: faker.name.jobTitle()
  });
}

await sequelize.models.User.bulkCreate(data);

await sequelize.close();
