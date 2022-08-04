import { Project } from './projects.entity';

export const projectProviders = [
  {
    provide: 'PROJECT_REPOSITORY',
    useValue: Project,
  },
];
