# API Specification

## Base URL

```
http://localhost:3000/api/v1
```

## Authentication

All endpoints except `/auth/login` and `/auth/register` require a Bearer token:

```
Authorization: Bearer <access_token>
```

## Endpoints

### Auth

| Method | Path | Description |
|--------|------|-------------|
| POST | /auth/login | Login with email/password |
| POST | /auth/register | Register new user |
| POST | /auth/refresh | Refresh access token |

### Patients

| Method | Path | Description | Roles |
|--------|------|-------------|-------|
| POST | /patients | Create patient | clinician+ |
| GET | /patients | List patients | caregiver+ |
| GET | /patients/:id | Get patient | caregiver+ |
| GET | /patients/:id/profile | Full profile with family | caregiver+ |
| PUT | /patients/:id | Update patient | clinician+ |

### Sessions

| Method | Path | Description | Roles |
|--------|------|-------------|-------|
| POST | /sessions/start | Start new session | patient+ |
| POST | /sessions/:id/complete | Complete session | patient+ |
| GET | /sessions/history | Session history | patient+ |
| GET | /sessions/:id | Get session detail | patient+ |

### Exercises

| Method | Path | Description | Roles |
|--------|------|-------------|-------|
| POST | /exercises/result | Record exercise result | patient+ |
| GET | /exercises/types | List exercise types | patient+ |

### Families

| Method | Path | Description | Roles |
|--------|------|-------------|-------|
| GET | /families/:patientId/members | List family members | patient+ |
| POST | /families/:patientId/members | Add family member | family+ |
| PUT | /families/members/:id | Update family member | family+ |
| DELETE | /families/members/:id | Remove family member | family+ |

### Memories

| Method | Path | Description | Roles |
|--------|------|-------------|-------|
| GET | /memories/:patientId | List memories | patient+ |
| POST | /memories | Create memory | patient+ |
| PUT | /memories/:id | Update memory | patient+ |
| DELETE | /memories/:id | Delete memory | family+ |

### Analytics

| Method | Path | Description | Roles |
|--------|------|-------------|-------|
| GET | /analytics/cognitive-trends | Score trends | caregiver+ |
| GET | /analytics/engagement | Engagement metrics | caregiver+ |

## Response Format

All responses follow:

```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "pageSize": 20,
    "totalCount": 100,
    "totalPages": 5
  }
}
```

Error responses:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request",
    "details": { "email": ["Required"] }
  }
}
```
