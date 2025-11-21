# FoodTrack Backend API

Backend REST API for FoodTrack - Sistema de controle de compras de alimentos.

## Technologies

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MS SQL Server
- **Validation**: Zod

## Project Structure

```
backend/
├── migrations/              # SQL migration files
├── src/
│   ├── api/                # API controllers
│   │   └── v1/            # API version 1
│   │       ├── external/  # Public endpoints
│   │       └── internal/  # Authenticated endpoints
│   ├── config/            # Configuration
│   ├── middleware/        # Express middleware
│   ├── migrations/        # Migration runner
│   ├── routes/            # Route definitions
│   ├── services/          # Business logic
│   └── utils/             # Utility functions
└── dist/                  # Compiled output
```

## Getting Started

### Prerequisites

- Node.js 18+
- MS SQL Server
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
```

3. Update `.env` with your database credentials:
```
DB_SERVER=localhost
DB_PORT=1433
DB_USER=sa
DB_PASSWORD=your_password
DB_NAME=foodtrack
PROJECT_ID=foodtrack
```

### Development

Run development server with hot reload:
```bash
npm run dev
```

The API will be available at `http://localhost:3000/api/v1`

### Database Migrations

Migrations run automatically on server startup. To run manually:
```bash
npm run migrate
```

### Building for Production

```bash
npm run build
npm start
```

## API Endpoints

### Health Check
- `GET /health` - Server health status

### API Version 1
- Base URL: `/api/v1`
- External (public): `/api/v1/external`
- Internal (authenticated): `/api/v1/internal`

## Environment Variables

| Variable | Description | Default |
|----------|-------------|----------|
| NODE_ENV | Environment | development |
| PORT | Server port | 3000 |
| DB_SERVER | Database server | localhost |
| DB_PORT | Database port | 1433 |
| DB_NAME | Database name | foodtrack |
| DB_USER | Database user | sa |
| DB_PASSWORD | Database password | - |
| PROJECT_ID | Project identifier | foodtrack |

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run migrate` - Run database migrations
- `npm test` - Run tests
- `npm run lint` - Lint code
- `npm run lint:fix` - Fix linting issues

## License

ISC