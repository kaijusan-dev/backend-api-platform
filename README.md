# Backend API Platform

**Backend API Platform** — это backend-проект на TypeScript, построенный на Express. Проект предназначен для практики разработки и развёртывания REST API с использованием PostgreSQL, Prisma, Redis и Docker.

## Стек технологий

- **Backend:** Node.js + Express + TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Validation:** Zod
- **Cache:** Redis
- **Logging:** Pino
- **API Documentation:** OpenAPI + Scalar
- **DevOps:** Docker + Docker Compose
- **Web Server:** Nginx
- **HTTPS:** Let's Encrypt + Certbot
- **CI:** GitHub Actions

## Основные возможности

- REST API для управления пользователями (CRUD).
- Валидация входных данных с помощью Zod.
- Пагинация, фильтрация и сортировка пользователей.
- Работа с PostgreSQL через Prisma ORM.
- Структурированное логирование запросов и ошибок.
- Генерация OpenAPI-спецификации и документация API через Scalar.
- Разделение development- и production-конфигураций Docker.
- Обратный прокси и HTTPS через Nginx.
- Резервное копирование PostgreSQL с помощью `pg_dump`.

## Настройка проекта

Проект использует переменные окружения для настройки приложения и подключения к сервисам.

Создайте `.env` на основе `.env.example`:

```bash
cp .env.example .env
```

Настройте необходимые переменные окружения перед запуском проекта.

## Запуск проекта

### Локально через Docker

#### Dev

Сборка и запуск контейнеров:

```bash
docker compose -f docker-compose-dev.yaml up --build -d
```

Для повторного запуска без пересборки можно убрать флаг `--build`.

#### Prod

Сборка и запуск production-конфигурации:

```bash
docker compose -f docker-compose-prod.yaml up --build -d
```

Production-конфигурация использует Nginx для обработки внешних HTTP/HTTPS-запросов.

После настройки домена и SSL приложение доступно по адресу:

- **API:** `https://ваш-домен`
- **API Documentation:** `https://ваш-домен/docs`

Для локального запуска используйте адреса и порты, указанные в соответствующем Compose-файле.

## Команды Docker

```bash
# Запустить development-окружение
docker compose -f docker-compose-dev.yaml up --build -d

# Запустить production-окружение
docker compose -f docker-compose-prod.yaml up --build -d

# Остановить контейнеры
docker compose -f docker-compose-dev.yaml down
docker compose -f docker-compose-prod.yaml down

# Посмотреть список контейнеров
docker compose -f docker-compose-dev.yaml ps
docker compose -f docker-compose-prod.yaml ps

# Посмотреть логи приложения
docker logs -f backend-api-app

# Посмотреть логи Nginx
docker logs -f backend-api-nginx
```

## Документация API

OpenAPI-спецификация генерируется на основе контрактов API и схем валидации. Для просмотра документации используется Scalar.

После запуска приложения документация доступна по адресу:

```text
https://ваш-домен/docs
```

## Работа с базой данных

Для взаимодействия с PostgreSQL используется Prisma ORM.

Prisma отвечает за работу с моделями данных и миграциями базы данных.

Миграции необходимо применять в соответствии с используемым окружением и настройками проекта.

## Резервное копирование базы данных

Для создания резервной копии PostgreSQL используется скрипт:

```bash
./scripts/backup-db.sh
```

Скрипт создаёт SQL-дамп базы данных с временной меткой в имени файла.

Резервные копии сохраняются в директории `backups/`:

```text
backups/
├── db-YYYY-MM-DD_HH-MM-SS.sql
└── ...
```

## Получение SSL-сертификата

Для первоначального получения SSL-сертификата Let's Encrypt используется скрипт `scripts/init-ssl.sh`.

Перед запуском необходимо:
- Настроить DNS-записи домена и `www`, направив их на IP-адрес сервера.
- Запустить Nginx и убедиться, что он обрабатывает HTTP-запросы проверки Let's Encrypt.

Запуск скрипта:

```bash
chmod +x scripts/init-ssl.sh
./scripts/init-ssl.sh example.com admin@example.com
```

Скрипт запускает Certbot через Docker Compose и получает SSL-сертификат для указанного домена и его поддомена `www`.

После получения сертификата убедитесь, что Nginx использует его в HTTPS-конфигурации, и перезапустите или перезагрузите Nginx при необходимости.

## HTTPS и Nginx

В production-окружении Nginx работает как reverse proxy и направляет запросы к backend-приложению.

Для HTTPS используется сертификат Let's Encrypt, а Certbot отвечает за проверку необходимости продления сертификата.

## Архитектура приложения

Проект построен по клиент-серверной архитектуре (REST API).

### 1. Backend

- Обработка HTTP-запросов через Express.
- Валидация данных с помощью Zod.
- Выполнение бизнес-логики.
- Взаимодействие с PostgreSQL через Prisma.
- Логирование запросов и ошибок.
- Предоставление REST API и документации OpenAPI.

### 2. Database

PostgreSQL используется для постоянного хранения данных. Prisma ORM обеспечивает доступ к базе данных и управление схемой через миграции.

### 3. Infrastructure

Docker Compose управляет сервисами приложения. Nginx обеспечивает внешний доступ к backend, а Certbot используется для обслуживания SSL-сертификатов.

## CI

GitHub Actions используется для автоматической проверки проекта. В CI выполняются проверки линтинга, тестов и сборки приложения.