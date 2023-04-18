import {
  getModelForClass,
  modelOptions,
  prop,
  Ref,
} from '@typegoose/typegoose';
import { User } from './user';

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class Post {
  @prop({
    type: String,
  })
  title: string;

  @prop({
    type: String,
  })
  content: string;

  @prop({ ref: () => User })
  user: Ref<User> | null;
}

export default getModelForClass(Post);
