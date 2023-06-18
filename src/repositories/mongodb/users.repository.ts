import { Collection } from 'mongodb';
import { logMethod } from '../../decorators';
import { UserEnum, UserModel } from '../../models';
import { IMongoProvider } from '../../providers';

export type FindUserFilter = {
  initialDate?: Date;
  finalDate?: Date;
};

export type PaginationParams = {
  offset: number;
  limit: number;
};

export interface IUserRepository {
  findByDateInterval(filter: FindUserFilter, pagination?: PaginationParams): Promise<UserModel[]>;
  findOne(filter: Partial<UserModel>, projection?: Record<string, number>): Promise<UserModel | null>;
}

export class UserRepository implements IUserRepository {
  private readonly userCollection = UserEnum.COLLECTION;

  constructor(private readonly mongoProvider: IMongoProvider) {}

  @logMethod()
  public async findByDateInterval(filter: FindUserFilter, pagination?: PaginationParams): Promise<UserModel[]> {
    const userCollection: Collection<UserModel> = this.mongoProvider.collection(this.userCollection);
    const { finalDate, initialDate } = filter;

    const query = userCollection
      .aggregate()
      .match({ created_at: { $gte: new Date(initialDate), $lte: new Date(finalDate) } })
      .project({ cpf_plain: 1 });

    if (pagination?.offset) {
      query.skip(pagination?.offset);
    }

    if (pagination?.limit) {
      query.limit(pagination?.limit);
    }

    return query.toArray();
  }

  @logMethod()
  public async findOne(filter: Partial<UserModel>, projection?: Record<string, number>): Promise<UserModel | null> {
    const userCollection: Collection<UserModel> = this.mongoProvider.collection(this.userCollection);
    return userCollection.findOne(filter, { projection });
  }
}
