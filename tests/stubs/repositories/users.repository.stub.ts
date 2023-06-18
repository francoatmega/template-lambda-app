import { UserModel } from '../../../src/models';
import { FindUserFilter, IUserRepository, PaginationParams } from '../../../src/repositories/mongodb';

jest.mock('../../../src/repositories/mongodb/users.repository.ts', () => ({
  __esModule: true,
  UsersRepository: jest.fn().mockImplementation(() => ({
    findByDateInterval: jest.fn(),
    findOne: jest.fn(),
  })),
}));

const userRepositoryMockedMethods = {
  findByDateInterval: jest.fn(),
  findOne: jest.fn(),
};

const makeUsersRepositoryStub = (): IUserRepository => {
  class UsersRepositoryStub implements IUserRepository {
    public async findByDateInterval(_filter: FindUserFilter, _pagination?: PaginationParams): Promise<UserModel[]> {
      return userRepositoryMockedMethods.findByDateInterval();
    }

    public async findOne(filter: Partial<UserModel>, projection?: Record<string, number>): Promise<UserModel | null> {
      return userRepositoryMockedMethods.findOne(filter, projection);
    }
  }

  return new UsersRepositoryStub();
};

export { userRepositoryMockedMethods, makeUsersRepositoryStub };
