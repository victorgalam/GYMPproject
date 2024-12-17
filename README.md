# GYMP Project

A modern gym management application built with React and Node.js.

## Prerequisites

- Node.js 18.x
- npm 10.x
- MongoDB database

## Local Development

1. Clone the repository:
```bash
git clone [your-repo-url]
cd GYMPproject
```

2. Install dependencies:
```bash
npm run install-all
```

3. Create a `.env` file in the root directory using `.env.example` as a template.

4. Start the development server:
```bash
# Start backend server
cd server
npm run dev

# In a new terminal, start frontend
cd front
npm start
```

## Heroku Deployment

1. Install the Heroku CLI and login:
```bash
heroku login
```

2. Create a new Heroku app:
```bash
heroku create
```

3. Set environment variables:
```bash
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_jwt_secret
heroku config:set NODE_ENV=production
```

4. Deploy to Heroku:
```bash
git push heroku main
```

5. Open the app:
```bash
heroku open
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
MONGODB_URI=your_mongodb_uri_here

# JWT Configuration
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=24h

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

## Project Structure

```
GYMPproject/
├── front/                 # React frontend
│   ├── src/
│   ├── public/
│   └── package.json
├── server/               # Node.js backend
│   ├── api/
│   ├── config/
│   ├── server.js
│   └── package.json
├── package.json
└── README.md
```

## Features

- User authentication and authorization
- Workout management
- Personal details tracking
- Workout completion tracking
- Google Calendar integration
- Responsive design

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
