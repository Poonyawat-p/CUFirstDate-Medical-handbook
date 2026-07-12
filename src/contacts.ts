import contactsJson from './contacts.json';

export interface Contact {
  name: string;
  phone: string;
  description: string;
}

export const contactsData: Contact[] = contactsJson;

