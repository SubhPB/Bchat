// Byimaan

import jwt from 'jsonwebtoken';
import { v4 } from 'uuid';

const base64Encode = (str: string): string => {
    return btoa(str);
}
  
const base64Decode = (str: string): string => {
    return atob(str);
};

const JWT = {
  encode: (payload: object, expiresInMinutes: number) => {
    const secretKey = process.env.JWT_URL_TOKEN_SECRET_KEY!;
    return jwt.sign(payload, secretKey, { algorithm: 'HS256', expiresIn: expiresInMinutes * 60 })
  }, 
  decode: (token: string) => {
    const secretKey = process.env.JWT_URL_TOKEN_SECRET_KEY!;

    try {
      return jwt.verify(token, secretKey)
    } catch {
      return null
    }
  }
};

const UUID = {
  generate: () => v4()
}

export {base64Encode, base64Decode, JWT, UUID}