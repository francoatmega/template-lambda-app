import { InsertOneWriteOpResult, ObjectId } from 'mongodb';
import { IMongoProvider } from '../../providers';

type Timestamps = 'createdAt' | 'updatedAt' | 'created_at' | 'updated_at';

type BaseModel = {
  _id: string | ObjectId;
};

export type Filter<T extends BaseModel> = Omit<Partial<T>, Timestamps>;
export type Insert<T extends BaseModel> = Omit<T, Timestamps | '_id'>;
export type Update<T extends BaseModel> = Omit<Partial<T> & BaseModel, Timestamps>;
export type Projection<T> = Partial<Record<keyof T, boolean>>;

export interface IBaseRepository<T extends BaseModel> {
  insert(item: Insert<T>): Promise<InsertOneWriteOpResult<T>>;
  findOne(filterParams: Filter<T>, projection?: Projection<T>): Promise<Partial<T> | void>;
  updateOne(item: Update<T>): Promise<void>;
}

export class BaseRepository<T extends BaseModel> implements IBaseRepository<T> {
  private readonly createdAtField: string;

  private readonly updatedAtField: string;

  constructor(
    protected readonly mongoProvider: IMongoProvider,
    protected readonly collectionName: string,
    legacyCollection = false,
  ) {
    this.createdAtField = legacyCollection ? 'created_at' : 'createdAt';
    this.updatedAtField = legacyCollection ? 'updated_at' : 'updatedAt';
  }

  public async insert(item: Insert<T>): Promise<InsertOneWriteOpResult<T>> {
    const collection = this.mongoProvider.collection(this.collectionName);

    return collection.insertOne({
      ...item,
      [this.createdAtField]: new Date(),
      [this.updatedAtField]: new Date(),
    });
  }

  public async findOne(filterParams: Filter<T>, projection?: Projection<T>): Promise<Partial<T> | void> {
    const { _id: id, ...filter } = filterParams;
    const collection = this.mongoProvider.collection(this.collectionName);

    return collection.findOne(
      {
        ...(id && { _id: new ObjectId(id) }),
        ...filter,
      },
      { projection },
    );
  }

  public async updateOne(item: Update<T>): Promise<void> {
    const { _id: id, ...set } = item;
    const collection = this.mongoProvider.collection(this.collectionName);

    await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...set,
          [this.updatedAtField]: new Date(),
        },
      },
    );
  }
}
