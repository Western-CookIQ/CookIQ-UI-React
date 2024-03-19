import { $metadata } from "./utils";

export type LoginResponse = {
  sessionToken: string;
};

export type RegisterResponse = {
  UserConfirmed: boolean;
  UserSub: string;
  Username: string;
  $metadata: $metadata;
};

export type ConfirmationResponse = {
  $metadata: $metadata;
};

export type ResendConfirmationResponse = {
  $metadata: $metadata;
};

export type ForgotPasswordResponse = {
  $metadata: $metadata;
};

export type UpdatePasswordResponse = {
  $metadata: $metadata;
};

export type GetUserResponse = {
  email: string;
  fName: string;
  lName: string;
  picture: string;
  is_public: string;
};

export type UserPreview = {
  sub: string;
  name: string;
};

export type SearchUserResponse = {
  $metadata: $metadata;
  Users: UserPreview[] | [];
  PaginationToken?: string;
};
