#!/usr/bin/env node

import app from '../src/app';
import http from 'node:http';
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT || '3000';
const server = http.createServer(app);
server.listen(port);
