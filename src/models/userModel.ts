import mongoose, { Schema, Document } from 'mongoose';

// Define the User document interface
export interface UserDocument extends Document {
  phoneNumber: string;
  password: string;
  profileUrl?: string;
  username:String;
  is_admin?:boolean,
  token?:String,
}
// Create the User schema
const userSchema = new Schema<UserDocument>({
  username:{
    type:String,
    required:true
  },
  phoneNumber: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
    required:true,
    validate: {
      validator: (value: string) => {
        // Validate phone number format using a regular expression
        return /^\d{10}$/.test(value);
      },
      message: 'Invalid phone number format',
    },
  },
  password: {
    type: String,
    required: true,
  },
  profileUrl: {
    type: String,
    trim: true,
  },
  is_admin: {
      type: Boolean,
      default: false,
    },
  token: { type: String },
});

// Create the User model
const UserModel = mongoose.model<UserDocument>('User', userSchema);

export default UserModel;