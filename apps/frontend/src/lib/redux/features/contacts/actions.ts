/**
 * Byimaan
 */

import { fetchContacts } from "./slice";

const apiEndpoint = '/api/bchat/contacts'

export const fetchContactsAction = (endpoint=apiEndpoint) => fetchContacts(apiEndpoint);