# WebTeamProject2

## **`React forum`**

## Project Description

React forum is a collaborative task built with React where users can share experience, React programming tips, and engage in discussions about topics related to React. The platform allows users to create, read, update, and delete posts, as well as comment on and like posts from other users.

## Hosted Project

The project is hosted online at: [https://example.com](https://example.com)

## GitHub Repository

The source code for this project can be found at: [https://github.com/Reactorite/WebTeamProject2](https://github.com/Reactorite/WebTeamProject2)

## Setup and Run Locally

### Prerequisites

- Node.js (v14 or higher)
- Firebase CLI
- Git

### Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Reactorite/WebTeamProject2.git
   cd WebTeamProject2
   ```
2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Run the project:**

   ```bash
   npm start
   ```

4. **Open your browser and navigate to:**
   http://localhost:3000

## Database Schema

**Comments**

```json
{
  "comment": {
    "author": "string",
    "content": "string",
    "createdOn": "string (date)",
    "id": "string",
    "postId": "string"
  }
}
```

**Posts**

```json
{
  "post": {
    "author": "string",
    "commentsCounter": "number",
    "content": "string",
    "createdOn": "string (date)",
    "id": "string",
    "title": "string"
  }
}
```

**Users**

```json
  "user": {
    "createdOn": "string (date)",
    "email": "string",
    "firstName": "string",
    "handle": "string",
    "isAdmin": "boolean",
    "isBlocked": "boolean",
    "isOwner": "boolean",
    "lastName": "string",
    "profilePictureURL": "string",
    "uid": "string"
  }
```
