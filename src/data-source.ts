import { DataSource } from 'typeorm';

import { User } from './user/user.entity';
import { Post } from './post/post.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'test',
  password: 'test',
  database: 'test',
  entities: [User, Post],
  migrations: ['src/migration/*.ts'],
  synchronize: false,
});
