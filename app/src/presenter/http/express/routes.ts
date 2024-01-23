/* eslint-disable @typescript-eslint/no-var-requires */
import express from 'express';
const routes = express.Router();

/* PLOP_INJECT_ROUTES */
import app from './routes/_app';
app(routes);

import account from './routes/_account';
account(routes);

import user from './routes/_user';
user(routes);

import organizations from './routes/_organization';
organizations(routes);

import members from './routes/_members';
members(routes);

export { routes };
