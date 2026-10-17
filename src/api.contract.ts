import { initContract } from '@ts-rest/core';
import { authContract } from './modules/auth/auth.contract.js';
import { usersContract } from './modules/users/users.contract.js';

const c = initContract();

export const apiContract = c.router({
  auth: authContract,
  users: usersContract,
});
