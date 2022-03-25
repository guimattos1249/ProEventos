# ProEventos
## Aprendizado C# e Angular

# ProEventosApp

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.2.16.

## Development server

Run `npm start` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

Run `dotnet watch run` for a dev server. Navigate to `https://localhost:5001/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## DotNet Commands

`dotnet watch run` - Start server
`dotnet ef migrations add InitialCreate` - Generate migrations
`dotnet ef database update` - Update database

`dotnet new sln -n ProEventos` - Create solution to associate projects
`dotnet new classlib -n ProEventos.Persistence` - Create Persistence project
`dotnet new classlib -n ProEventos.Domain` - Create Domain project
`dotnet new classlib -n ProEventos.Application` - Create Application project

`dotnet sln ProEventos.sln add ProEventos.Application` - Do this to all projects. Added Projects to Solution

`dotnet add ProEventos.API/ProEventos.API.csproj reference ProEventos.Application` - References Application in API (Do this to all references needs).
