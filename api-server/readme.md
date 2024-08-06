# Usage manual

## Starting guide

##### 1. Create file ".env"

```shell
# Fill CUBO_TOKEN in .env file:
CUBO_TOKEN=<type> <token>

# Token variants:
#
# CUBO_TOKEN=AccountUser JhY2NvdW50X2lkIjoxOCwiXyI6...
# CUBO_TOKEN=AccountModule JhY2NvdW50X2lkIjoxOCwiXyI6...
# CUBO_TOKEN=Account JhY2NvdW50X2lkIjoxOCwiXyI6...
# CUBO_TOKEN=Module JhY2NvdW50X2lkIjoxOCwiXyI6...

# Fill database connetion props in .env file:
CUBO_DB_HOST=
CUBO_DB_PORT=
CUBO_DB_USER=
CUBO_DB_PASSWORD=
CUBO_DB_DATABASE=
CUBO_DB_SCHEMA=
```

##### 2. Edit file "types.ts" in root and copy it into directory "src/cubo"

##### 3. Run web-server:

```shell
# On host
yarn install
yarn serve

# In docker container
docker compose up
```

##### 4. Create database "cubo" and insert dump through Adminer
```shell
# Follow URL http://localhost:8098/ (Adminer)
# 1. Create database with name "cubo"
# 2. Insert dump from file "dump.sql"
```

### To test API, follow this URL: [http://localhost:8099/rest/users](http://localhost:8099/rest/users)