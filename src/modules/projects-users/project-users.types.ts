export enum ProjectUserRole {
  Owner = 'owner',
  Write = 'write',
  Read = 'read',
}

export interface ProjectUserData {
  projectId: string;
  userId: string;
  role: ProjectUserRole;
}
