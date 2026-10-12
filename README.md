# DeezNutz login

A small full-stack login page. Express serves the frontend and exposes the login API. PostgreSQL is optional locally and supported in production.

## Run locally

1. Install Node.js 18 or newer.
2. Run `npm install`.
3. Copy `.env.example` to `.env` and set a long `JWT_SECRET`.
4. Run `npm start`.
5. Open http://localhost:3000.

Without `DATABASE_URL`, the app uses a local demo account:

- Email: `demo@example.com`
- Password: `demo1234`

## Connect a database

This app uses PostgreSQL through the `pg` package. Create a PostgreSQL database, then set its connection string in `.env`:

```env
DATABASE_URL=postgres://user:password@host:5432/database
```

On startup the server creates the `users` table and seeds the demo account if it does not exist. For a real app, add a registration endpoint, validate input more strictly, use migrations, and replace the demo seed with a controlled admin/bootstrap process.

## Deploy with Render

1. Push this folder to a GitHub repository.
2. In Render, choose **New > PostgreSQL** and create a database.
3. Choose **New > Web Service**, connect the repository, and use:
   - Build command: `npm install`
   - Start command: `npm start`
4. In the web service Environment settings, add `JWT_SECRET` with a long random value.
5. Add `DATABASE_URL` by linking the Render PostgreSQL database, or paste the database's **Internal Database URL**.
6. Deploy. Render provides the public URL after the build completes.

The server reads Render's `PORT` automatically. Keep the database private and use the internal URL when both services live in Render.

### Birthday login

The home route is a single-account login page. Set these environment variables in Render to choose the credentials:

```env
LOGIN_USERNAME=kyren
LOGIN_PASSWORD=marble-orbit-583!
```

If they are not set, local development defaults to the values above. Successful login opens `/landing`; the letter remains at `/letter`.
