export interface LoginScenario {
  description: string;
  username: string;
  password: string;
  expectSuccess: boolean;
  expectedMessage: string;
}

export const loginScenarios: LoginScenario[] = [
  {
    description: 'valid credentials',
    username: 'tomsmith',
    password: 'SuperSecretPassword!',
    expectSuccess: true,
    expectedMessage: 'You logged into a secure area!',
  },
  {
    description: 'invalid username',
    username: 'wronguser',
    password: 'SuperSecretPassword!',
    expectSuccess: false,
    expectedMessage: 'Your username is invalid!',
  },
  {
    description: 'invalid password',
    username: 'tomsmith',
    password: 'wrongpassword',
    expectSuccess: false,
    expectedMessage: 'Your password is invalid!',
  },
];
