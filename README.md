## Instalación rápida desde el bash

`$ npm install` instalación para las dependencias

## Configuración de las variables de entorno

crear el archivo dev.env a partir del dev.env.template los cuales estan en la ruta del proyecto. Para este escenario, el dev.env se ha integredo en el repositorio.

## Configuración de las variables de entorno para docker

Agregar las variable de entorno de dev.env a `./docker-secrets`.

## Inicio de los contenedores

```bash
# Iniciar los contenedores desde el bash
$ docker-compose up
```

## Correr migraciones en caso de haber más microservicios

```bash
# Correr las migraciones
```
