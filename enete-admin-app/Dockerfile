# Используем за основу образ Node.js
FROM node:latest

# Установка директории внутри контейнера
WORKDIR /usr/src/app/enete-admin

# Копирование зависимостей
COPY package*.json ./

# Установка зависимостей
RUN npm install

# Копирование всего остального приложения
COPY . .

# Сборка приложения
RUN npm run build

# Открываем порт, который будет использоваться для доступа к приложению
EXPOSE 4200

# Команда для запуска Angular приложения
CMD ["npm", "start"]