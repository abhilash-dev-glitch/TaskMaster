# Deployment URL: https://taskmasterapp-2gq4.onrender.com
# MERN Task Manager

A full-stack task management application built with the MERN stack (MongoDB, Express.js, React.js, Node.js). This application allows users to manage their tasks with features like task creation, updating, deletion, and insightful analytics.

## Features

- User authentication (register, login, profile management)
- Create, read, update, and delete tasks
- Task filtering and sorting
- Task prioritization (low, medium, high)
- Task status tracking (todo, in-progress, completed)
- Task due dates and labels
- Dashboard with task insights and analytics
- Responsive design
- Secure authentication with JWT

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher) or yarn
- MongoDB (local or cloud instance)
- Postman (for API testing)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/mern-task-manager.git
cd mern-task-manager
```

### 2. Install Dependencies

#### Backend Dependencies

```bash
cd server
npm install
```

### 3. Environment Variables

Create a `.env` file in the `server` directory and add the following:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

### 4. Start the Backend Server

```bash
# From the server directory
npm run server
```

The backend server will start on `http://localhost:5000`

## API Documentation

### Base URL
`http://localhost:5000/api`

### Authentication

#### Register a New User
- **URL**: `/users`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```

#### Login User
- **URL**: `/users/login`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response**: Returns a JWT token that needs to be included in the `Authorization` header for protected routes.

### Tasks

#### Get All Tasks
- **URL**: `/tasks`
- **Method**: `GET`
- **Query Parameters**:
  - `status`: Filter by status (todo, in-progress, completed)
  - `priority`: Filter by priority (low, medium, high)
  - `sort`: Sort by field (dueDate-asc, dueDate-desc, priority-asc, priority-desc)
  - `search`: Search in title and description

#### Create a New Task
- **URL**: `/tasks`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "title": "Complete project",
    "description": "Finish the MERN task manager project",
    "status": "in-progress",
    "priority": "high",
    "dueDate": "2023-12-31T23:59:59.000Z",
    "labels": ["work", "important"]
  }
  ```

#### Get Task Insights
- **URL**: `/tasks/insights`
- **Method**: `GET`
- **Response**: Returns task statistics and analytics

## Postman Collection

You can import the following collection into Postman for testing the API:

1. Open Postman
2. Click on "Import"
3. Select the "Raw text" tab
4. Paste the following JSON and click "Continue":

```json
{
  "info": {
    "_postman_id": "a1b2c3d4-e5f6-7890",
    "name": "MERN Task Manager API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Register User",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n    \"name\": \"Test User\",\n    \"email\": \"test@example.com\",\n    \"password\": \"password123\"\n}"
            },
            "url": {
              "raw": "http://localhost:5000/api/users",
              "protocol": "http",
              "host": ["localhost"],
              "port": "5000",
              "path": ["api", "users"]
            }
          }
        },
        {
          "name": "Login User",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n    \"email\": \"test@example.com\",\n    \"password\": \"password123\"\n}"
            },
            "url": {
              "raw": "http://localhost:5000/api/users/login",
              "protocol": "http",
              "host": ["localhost"],
              "port": "5000",
              "path": ["api", "users", "login"]
            }
          }
        }
      ]
    },
    {
      "name": "Tasks",
      "item": [
        {
          "name": "Create Task",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              },
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n    \"title\": "Complete project",\n    \"description\": "Finish the MERN task manager project",\n    \"status\": \"in-progress\",\n    \"priority\": \"high\",\n    \"dueDate\": \"2023-12-31T23:59:59.000Z\",\n    \"labels\": [\"work\", \"important\"]\n}"
            },
            "url": {
              "raw": "http://localhost:5000/api/tasks",
              "protocol": "http",
              "host": ["localhost"],
              "port": "5000",
              "path": ["api", "tasks"]
            }
          }
        },
        {
          "name": "Get All Tasks",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "http://localhost:5000/api/tasks",
              "protocol": "http",
              "host": ["localhost"],
              "port": "5000",
              "path": ["api", "tasks"],
              "query": [
                {
                  "key": "status",
                  "value": "in-progress"
                },
                {
                  "key": "priority",
                  "value": "high"
                },
                {
                  "key": "sort",
                  "value": "dueDate-asc"
                }
              ]
            }
          }
        },
        {
          "name": "Get Task Insights",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "http://localhost:5000/api/tasks/insights",
              "protocol": "http",
              "host": ["localhost"],
              "port": "5000",
              "path": ["api", "tasks", "insights"]
            }
          }
        }
      ]
    }
  ],
  "variable": [
    {
      "key": "token",
      "value": "your_jwt_token_here"
    }
  ]
}
```

## Testing the API

1. **Register a New User**
   - Use the "Register User" request to create a new account
   - Save the returned token for subsequent requests

2. **Login**
   - Use the "Login User" request to get a new token
   - Update the `token` variable in the Postman collection with the received token

3. **Create Tasks**
   - Use the "Create Task" request to add new tasks
   - Try creating tasks with different statuses and priorities

4. **View Tasks**
   - Use the "Get All Tasks" request to view your tasks
   - Experiment with different query parameters to filter and sort tasks

5. **View Insights**
   - Use the "Get Task Insights" request to view task statistics

## Environment Variables

### Development
- `NODE_ENV=development`
- `PORT=5000`
- `MONGODB_URI=mongodb://localhost:27017/taskmanager`
- `JWT_SECRET=your_jwt_secret_key_here`

### Production
For production, make sure to:
- Set `NODE_ENV=production`
- Use a strong `JWT_SECRET`
- Set up a production MongoDB URI
- Enable CORS for your frontend domain
- Use environment variables for sensitive information

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
