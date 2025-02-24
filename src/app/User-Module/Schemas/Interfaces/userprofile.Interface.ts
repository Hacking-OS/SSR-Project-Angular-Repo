export interface profile {
  id: number;
  name: string;
  image: string;
  email: string;
  status: boolean;
  role: string;
  phone: string;
  loggedIn: Date;
  message?: string;
}



 interface updateProfile {
  updated: Readonly<updateParams>;
  message: string;
  error: boolean;
}

interface updateParams {
  name: string;
  email: string;
}

export type updateProfileWithoutError = Omit<updateProfile, 'error'>;
export type updateProfileWithoutUpdated = Omit<updateProfile, 'updated'>;
