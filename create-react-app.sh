#!/bin/sh

# Créer une nouvelle application React
npx create-react-app frontend

# Copier les fichiers créés dans le volume monté
cp -R frontend/* /usr/src/app/frontend/