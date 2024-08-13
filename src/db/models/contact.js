import mongoose, { Schema } from 'mongoose';
import { KEY_CONTACT_TYPE } from '../../constants/contacts.js';

const contactsSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      default: null,
    },
    contactType: {
      type: String,
      required: true,
      enum: KEY_CONTACT_TYPE,
      default: KEY_CONTACT_TYPE[0],
    },
    isFavourite: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Contact = mongoose.model('Contact', contactsSchema);
