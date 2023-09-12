# Template for TypeScript Vite client and Node Server

## Run Vite dev client

```
cd client
npx vite
```

## Build client and test "in place":

```
cd client
npm run build
cd dist && python3 -m http.server 8081
```

## Run server

```
cd server
npx nodemon
```

### Database (PostgreSQL)

Here is an example which uses Docker to run the DB locally:

- Create a `.env` file in the project root, and add the following contents to it:

```
PGHOST=localhost
PGPORT=5432
PGDATABASE=nb2
PGUSER=nb2
PGPASSWORD=nb2
```

We use [dotenv](https://github.com/motdotla/dotenv) for configuration, and the above
creates the DB configuration for us. Now we'll have to fetch and start the PostgreSQL
Docker image:

`podman run --name nothing-burger2-db -p 5432:5432 -e POSTGRES_DB=nb2 -e POSTGRES_USER=nb2 -e POSTGRES_PASSWORD=nb2 -d postgres:15.1`

(on Linux you have to prefix the command with sudo)

To access the database directly, first install the postgresql client. For example on Mac:

```
brew install postgresql@15
```

```
psql -d nb2 -h localhost -U nb2 -p 5432
```
