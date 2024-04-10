export class UserSignUpRequest {
  accountId: string;
  password: string;
}

export class UserSignInRequest {
  accountId: string;
  password: string;
}

export class TokenResponse {
  accessToken: string;
}

export class UserResponse {
  userList: UserElement[];
}

export class UserElement {
  accountId: string;
  password: string;
}

export class UpdateUserAccountIdRequest {
  accountId: string;
}
