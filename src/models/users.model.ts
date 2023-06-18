import { ObjectID } from 'mongodb';

export type UserModel = {
  _id: ObjectID;
  id: string;
  email: string;
  name: string;
  cpf_plain: string;
};

export enum UserEnum {
  COLLECTION = 'users',
}
