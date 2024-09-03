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
      enum: [KEY_CONTACT_TYPE.home, KEY_CONTACT_TYPE.personal, KEY_CONTACT_TYPE.work],
      default: KEY_CONTACT_TYPE_DEFAULT,
    },
    isFavourite: {
      type: Boolean,
      default: false,
    },
    photo: {
      type: String,
      default: null,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Contact = model('Contact', contactsSchema);
