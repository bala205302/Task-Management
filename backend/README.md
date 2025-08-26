Backend API (Express + MongoDB)

Scripts
- dev: nodemon src/server.js
- start: node src/server.js

Environment
- Create a .env file with:
- PORT=5000
- MONGODB_URI=mongodb://127.0.0.1:27017/task_manager
- JWT_SECRET=please_change_me
- JWT_EXPIRES_IN=7d

Run
1) npm install
2) npm run dev

Endpoints (base: /api)
- POST /register
- POST /login
- GET /tasks (auth, ?page=&limit=&status=&q=)
- POST /tasks (auth)
- PUT /tasks/:id (auth)
- DELETE /tasks/:id (auth)


