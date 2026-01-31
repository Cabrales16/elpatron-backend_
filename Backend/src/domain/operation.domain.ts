export enum OperationStatus {
  NEW = 'NEW',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
  BLOCKED = 'BLOCKED',
}

export interface IOperation {
  id: string;
  title: string;
  description?: string;
  status: OperationStatus;
  assigneeUserId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOperationRepository {
  create(data: Omit<IOperation, 'id' | 'createdAt' | 'updatedAt'>): Promise<IOperation>;
  findById(id: string): Promise<IOperation | null>;
  findAll(filters?: { status?: OperationStatus; assigneeUserId?: string }): Promise<IOperation[]>;
  update(id: string, data: Partial<IOperation>): Promise<IOperation>;
  delete(id: string): Promise<void>;
}
