export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: Address;
  phone: string;
  website: string;
  company: Company;
  
}

export interface Address {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo: Geo;
}


export interface Geo {
  lat: string;
  lng: string;
}

export interface Company {
  name: string;
  catchPhrase: string;
  bs: string;
}

export interface Post {
  id: number;
  userId:number;
  title: string;
  body: string;
  comments: Comment[];
}

export interface Comment {
  id: number;
  postId:number;
  name: string;
  email: string;
  body: string;
}
