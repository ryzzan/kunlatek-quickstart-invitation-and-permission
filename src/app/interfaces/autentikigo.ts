export interface IUser {
  _id: string;
  email: string,
  phoneNumber: string,
  googleId: string,
  appleId: string;
}
export interface IPerson {
  birthday: string;
  country: string;
  gender: string;
  mother: string;
  name: string;
  uniqueId: string;
  _id: string;
  userId: IUser;
}

export interface ICompany {
  birthday: string;
  cnae: any;
  corporateName: string;
  tradeName: string;
  email: string;
  responsible: string;
  uniqueId: string;
  _id: string;
  userId: IUser;
}
