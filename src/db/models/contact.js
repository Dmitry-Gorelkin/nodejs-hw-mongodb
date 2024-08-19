import { model, Schema } from 'mongoose';
import { KEY_CONTACT_TYPE, KEY_CONTACT_TYPE_DEFAULT } from '../../constants/contacts.js';

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
      default: KEY_CONTACT_TYPE_DEFAULT,
    },
    isFavourite: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: Schema.Types.ObjectId,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Contact = model('Contact', contactsSchema);
