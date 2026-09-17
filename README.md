# Dynamic Survey System

A full-stack survey application built with Angular, Spring Boot, and MySQL.

The system provides both a user-facing survey flow and an admin interface for survey management. Users can complete surveys and view results, while administrators can create surveys, manage questions and options, preview surveys, and review statistics.

This project was built as a learning project to practice frontend-backend integration, REST API development with Spring Boot, and database integration with MySQL.

## Tech Stack

- **Frontend:** Angular
- **Backend:** Java / Spring Boot / REST API
- **Database:** MySQL
- **Data Visualization:** Chart.js
- **Version Control:** Git / GitHub

## Features

### User

- Browse available surveys
- Complete surveys
- Support for single-choice, multiple-choice, and text questions
- Review answers before submission
- Submit responses
- View survey statistics and results

### Admin

- View and manage surveys
- Create, edit, and delete surveys
- Create and edit questions and options
- Preview surveys before publishing
- View survey statistics and results
- Prevent question and option updates after responses have been submitted to maintain data consistency

## Project Structure

```text
survey-project/
├── frontend/    # Angular frontend
└── backend/     # Spring Boot REST API
```

## Main Routes

### Admin

| Route | Description |
| --- | --- |
| `/admin/surveys` | Survey management |
| `/admin/surveys/new` | Create a new survey |
| `/admin/surveys/:id/edit` | Edit survey information |
| `/admin/surveys/:id/questions` | Edit questions and options |
| `/admin/surveys/:id/preview` | Preview survey |

### User

| Route | Description |
| --- | --- |
| `/surveys` | Survey list |
| `/surveys/:id` | Complete a survey |
| `/surveys/:id/confirm` | Review answers |
| `/surveys/:id/done` | Submission complete |
| `/surveys/:id/results` | View survey results |

When the results page is accessed from the admin interface, `?from=admin` is included to provide navigation back to the admin page.

## Local Setup

### 1. MySQL

Create the database:

```sql
CREATE DATABASE dynamic_surveys;
```

### 2. Backend Configuration

Database credentials are stored only in a local configuration file and are not committed to GitHub.

Create:

```text
backend/src/main/resources/application-local.properties
```

Example:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/dynamic_surveys?useSSL=false&serverTimezone=Asia/Taipei&characterEncoding=utf8
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.profiles.active=local
```

`application-local.properties` is excluded from version control through `.gitignore`.

## Future Improvements

- Search and filtering
- Authentication and authorization
- UI/UX improvements
