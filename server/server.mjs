import http from 'node:http';
import { handleApiRequest } from './api.mjs';

const PORT = process.env.PORT || 3001;

const server = http.createServer((req, res) => {
  handleApiRequest(req, res);
});

server.listen(PORT, () => {
  console.log(`Backend API with SQLite running on http://localhost:${PORT}`);
});
