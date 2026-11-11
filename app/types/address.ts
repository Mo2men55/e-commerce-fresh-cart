export interface Address {
  _id: string;
  name: string;
  details: string;
  phone: string;
  city: string;
}

export type AddressInput = Omit<Address, "_id">;

export interface AddressesResponse {
  results?: number;
  status?: string;
  message?: string;
  data: Address[];
}
