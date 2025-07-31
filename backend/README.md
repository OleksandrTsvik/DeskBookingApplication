# DeskBookingApplication/backend

## 🚀 How-to run

1. Install .NET 9.0.
2. Install required dependencies:

```sh
dotnet restore
dotnet build
```

3. In the `src/Api` folder, fill in the `appsettings.json` file.
4. Run:

```sh
cd src/Api
dotnet watch --no-hot-reload
```

## 💾 Useful commands

### Create EF migration

```sh
dotnet ef migrations add InitialCreate -s src/Api -p src/Infrastructure
```

### List EF migrations

```sh
dotnet ef migrations list -s src/Api -p src/Infrastructure
```

### Remove last EF migration

```sh
dotnet ef migrations remove -s src/Api -p src/Infrastructure
```

> When used, the `--force` flag will remove the migration regardless of whether it has already been applied to the database.

### Updates the database to the last migration or to a specified migration

```sh
dotnet ef database update -s src/Api -p src/Infrastructure
# or
dotnet ef database update <MIGRATION> -s src/Api -p src/Infrastructure
```

> \<MIGRATION\> - The target migration. Migrations may be identified by name or by ID. The number 0 is a special case that means before the first migration and causes all migrations to be reverted. If no migration is specified, the command defaults to the last migration.

### Drop database

```sh
dotnet ef database drop -s src/Api -p src/Infrastructure
```

### Possible to fix backend errors in vscode

```sh
cd src/Api
dotnet restore
dotnet build
```

### Сreate solution and projects

```sh
dotnet new list

dotnet new sln
dotnet new webapi -n Api
dotnet new classlib -n Domain
dotnet new classlib -n Infrastructure
```

### Add projects to the solution

```sh
dotnet sln add src/Api/Api.csproj
dotnet sln add src/Domain/Domain.csproj
dotnet sln add src/Infrastructure/Infrastructure.csproj

dotnet sln list
```

### Add project references

```sh
cd src/Api
dotnet add reference ../Infrastructure/Infrastructure.csproj
cd ../Infrastructure
dotnet add reference ../Domain/Domain.csproj
```

## 🚢 Docker Hub

### Docker build

```sh
docker build . -t oleksandrtsvik/desk-booking-app:latest
```

### Push images to a repository

```sh
docker login
docker push oleksandrtsvik/desk-booking-app:latest
```
