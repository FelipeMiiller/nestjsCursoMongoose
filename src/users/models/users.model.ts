import { Document } from 'mongoose';

export interface User extends Document {
  name: string;
  email: string;
  password: string;
}

export interface UserToken {
  id: string;
  name: string;
  email: string;
  token: string;
}
