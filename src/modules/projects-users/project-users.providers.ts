import { ProjectsUsers } from './project-users.entity';

export const projectUsersProviders = [
  {
    provide: 'PROJECT-USERS_REPOSITORY',
    useValue: ProjectsUsers,
  },
];
