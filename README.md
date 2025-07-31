# Desk Booking Application

Project for learning Angular, developed based on Radency's first-stage test task.

## 🐳 Docker

### Up

```sh
docker-compose up --build
# dev
docker-compose -f docker-compose.dev.yml up --build
```

> Be sure to fill in the `backend/src/Api/appsettings.json` file!

### Down

```sh
docker-compose down
# dev
docker-compose -f docker-compose.dev.yml down
```

### Run database only

```sh
# up
docker-compose -f docker-compose.dev.yml up postgres pgadmin4
# down
docker-compose -f docker-compose.dev.yml down postgres pgadmin4
```

### Watch logs

```sh
docker logs backend --follow
```

### Connect to container

```sh
docker exec -it backend bash
```

## 🔗 Local Development Links

- Backend: [http://localhost:5000/api](http://localhost:5000/api)
- Frontend: [http://localhost:4200](http://localhost:4200)
- pgAdmin 4: [http://localhost:5050](http://localhost:5050)
