import 'dotenv/config';
import express from 'express';
import { pinoHttp } from 'pino-http';
import cors from 'cors';
import { Contact } from './db/models/contact.js';

const PORT = process.env.PORT || 3000;
const app = express();
const logger = pinoHttp({
  transport: {
    target: 'pino-pretty',
  },
});

export const setupServer = () => {
  app.use(cors());
  app.use(logger);

  app.get('/', (req, res) => {
    res.json({
      message: 'Hello world!',
    });
  });

  app.get('/contact', async (req, res) => {
    try {
      const contacts = await Contact.find();

      res.json({
        status: 200,
        message: 'Successfully found contacts!',
        data: contacts,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: 'Contacts not found',
      });
    }
  });

  app.get('/contact/:contactId', async (req, res) => {
    const { contactId } = req.params;

    try {
      const contact = await Contact.findById(contactId);

      if (!contact) {
        res.status(404).json({
          message: 'Contact not found',
        });
        return;
      }

      res.json({
        status: 200,
        message: `Successfully found contact with id: ${contactId}!`,
        data: contact,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: 'Contact not found',
      });
    }
  });

  app.use('*', (req, res, next) => {
    res.status(404).json({
      message: 'Route not found',
    });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
