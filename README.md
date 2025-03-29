# Authentication with JWT access and refresh tokens

This is a fullstack tech-demo project for [React](https://react.dev/) as a frontend library and
[Hono](https://hono.dev/) as a backend framework, with postgres database.

The App apply a jwt authentication strategy with access and refresh tokens using secure axios instance and interceptors to requests and responses.

Besides React following libraries are used in the client part of the project:

- [Axios](https://www.npmjs.com/package/axios)
- [React Hook Form](https://www.npmjs.com/package/react-hook-form)
- [Zod](https://zod.dev/)
- [React Hot Toast](https://www.npmjs.com/package/react-hot-toast)
- [Lucide React](https://www.npmjs.com/package/lucide-react)

React project is bootstraped by [Vite](https://vite.dev/).
CSS styling is done via [daisyUI](https://daisyui.com/).

Also in the server part of the project following libraries are used:

- [Prisma](https://www.npmjs.com/package/prisma)
- [Zod](https://zod.dev/)
- [Bcryptjs](https://www.npmjs.com/package/bcryptjs)

No additional library is used for jwt functionality because Hono has builtin [JWT Authentication Helper](https://hono.dev/docs/helpers/jwt).

## Getting Started

You will need a node.js runtime environment:

- [Node.js](https://nodejs.org/en/)

and docker-compose for running the postgres database and adminer (db viewer) in the container:

- [Docker Compose Install](https://docs.docker.com/compose/install/)

## Next

Clone or download repository

## Client:

Open terminal in the project client folder...

- copy .env.example and rename to .env and write down required information value(s)

Run fronted packages installation:

```bash
npm install
```

## Server:

Open terminal in the project server folder...

- copy .env.example and rename to .env and write down required information values,
- usually for access token value is some short period of time before token is expired and some longer time period for the refresh token
- the POSTGRES_USER, POSTGRES_PASSWORD, and POSTGRES_DB keys will be read in the docker-compose.yml file also

- write same values for the USER,PASSWORD,DATABASE in the DATABASE_URL key needed for the
  prisma connection string.

Run backend packages installation:

```bash
npm install
```

## Database

- to run docker-compose write following command, it will pull postgres and adminer images from docker hub and
  start in the detached mode, and also it will create local persistent postgres volume:

```bash
docker-compose up -d
```

To stop docker services write command:

```bash
docker-compose down
```

## Prisma ORM

- to create the database according to schema.prisma file write (case for the local dev and no migrations files):

```bash
npx prisma db push
```

## Adminer

For the adminer open [http://localhost:8080](http://localhost:8080) with your browser to see the adminer login page,
the server name in the login page is the name of the postgres service from docker-compose.yml file, so pg_jwt_auth

## Prisma Studio

Or maybe to check prisma studio, write following command:

```bash
npx prisma studio
```

open [http://localhost:5555](http://localhost:5555) with your browser to see the prisma studio.

## App

Open terminal in the project server folder...

```bash
docker-compose up -d
npm run dev
```

Open terminal in the project client folder...

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) with your browser to see the app,
after successfull login server sends to client access token with user info and sets refresh token as httponly cookie.

On every future request axios interceptor adds access token as Bearer token value before request hits api endpoint,
when access token is expired, server respond with 401 or 403 status and axios response interceptor calls refresh token route
to fetch a new access token (only if refresh token is still valid).

Refresh token cookie and data is deleted when user signs out...
