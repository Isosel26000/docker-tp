# Docker Todo List Application

Cette application Todo List utilise une architecture à trois niveaux avec MongoDB, une API backend Node.js, et un frontend React. Le tout est orchestré dans des conteneurs Docker.

## Prérequis

- Docker
- Docker Compose

## Installation

1. Clonez le dépôt GitHub :

    ```bash
    git clone https://github.com/Isosel26000/docker-tp.git
    cd docker-tp 
    ```

2. Créez et démarrez les conteneurs Docker :

    ```bash
    docker-compose up --build -d
    ```

## Accès aux services

### Frontend

L'interface frontend React est accessible via [http://localhost:3000](http://localhost:3000).

### API

L'API backend Node.js est accessible via [http://localhost:3001](http://localhost:3001).

### Mongo Express

Mongo Express, une interface web pour gérer MongoDB, est accessible via [http://localhost:8081](http://localhost:8081). Utilisez les informations d'identification suivantes pour vous connecter :

- **Nom d'utilisateur**: `admin`
- **Mot de passe**: `admin`

## Fonctionnalités

- **Ajouter un todo**: Utilisez l'interface frontend pour ajouter un nouveau todo.
- **Afficher les todos**: Les todos ajoutés sont affichés dans la liste.
- **Modifier un todo**: Cliquez sur le bouton "Edit" à côté d'un todo pour le modifier.
- **Supprimer un todo**: Cliquez sur le bouton "Delete" à côté d'un todo pour le supprimer.

## Configuration

### Fichier `docker-compose.yml`

Le fichier `docker-compose.yml` orchestre les différents services :

```yaml
version: '3.8'
services:
  mongodb:
    image: mongo:latest
    container_name: mongodb
    ports:
      - 27017:27017
    volumes:
      - mongo-data:/data/db
    networks:
      - app-network

  mongo-express:
    image: mongo-express:latest
    container_name: mongo-express
    depends_on:
      - mongodb
    environment:
      - ME_CONFIG_MONGODB_SERVER=mongodb
      - ME_CONFIG_BASICAUTH_USERNAME=admin
      - ME_CONFIG_BASICAUTH_PASSWORD=admin
    ports:
      - "8081:8081"
    networks:
      - app-network

  api:
    build: ./api
    container_name: api
    depends_on:
      - mongodb
    ports:
      - "3001:3001"
    networks:
      - app-network
    environment:
      - MONGO_URI=mongodb://mongodb:27017/todo

  frontend:
    build: ./frontend
    container_name: frontend
    ports:
      - "3000:3000"
    networks:
      - app-network

volumes:
  mongo-data:

networks:
  app-network:
