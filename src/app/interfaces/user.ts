export interface User {
  _id: string;
  firstName: string,
  lastName: string,
  email: string
  phoneNumber: string,
  password: string,
  role?: 'ADMIN' | 'USER'
}
