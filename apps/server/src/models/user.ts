import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
class User {
  @prop({
    type: String,
    required: true,
  })
  username: string;

  @prop({
    type: String,
    required: true,
  })
  hashedPassword: string;
}

export default getModelForClass(User);