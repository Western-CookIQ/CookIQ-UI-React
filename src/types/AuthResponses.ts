type $metadata = {
  httpStatusCode: number;
  requestId: string;
  attempts: number;
  totalRetryDelay: number;
};

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
};
