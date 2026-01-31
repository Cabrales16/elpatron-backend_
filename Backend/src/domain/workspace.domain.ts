export enum WorkspaceState {
  ACTIVE = 'ACTIVE',
  RESTRICTED = 'RESTRICTED',
  BLOCKED = 'BLOCKED',
}

export interface IWorkspace {
  id: string;
  userId: string;
  state: WorkspaceState;
  provider: string;
  lastCheckAt: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IWorkspaceRepository {
  create(data: Omit<IWorkspace, 'id' | 'createdAt' | 'updatedAt'>): Promise<IWorkspace>;
  findById(id: string): Promise<IWorkspace | null>;
  findByUserId(userId: string): Promise<IWorkspace | null>;
  findAll(): Promise<IWorkspace[]>;
  update(id: string, data: Partial<IWorkspace>): Promise<IWorkspace>;
  updateState(userId: string, state: WorkspaceState): Promise<IWorkspace>;
}
