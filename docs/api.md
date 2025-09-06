# API Documentation - AI Interview Platform

## Base URL
```
http://localhost:3000/api
```

## Authentication
Currently, no authentication is required. All endpoints are public.

## Rate Limiting
- General endpoints: 100 requests per 15 minutes
- AI endpoints: 20 requests per 15 minutes
- Evaluation endpoints: 10 requests per hour

## Endpoints

### Health Check
```http
GET /health
```

Returns the health status of the application.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-01-06T10:30:00.000Z",
  "uptime": 3600,
  "database": {
    "status": "healthy",
    "timestamp": "2025-01-06T10:30:00.000Z"
  },
  "environment": "development"
}
```

### Interviews

#### Start Interview
```http
POST /api/interviews/start
```

Starts a new interview session.

**Request Body:**
```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "jobProfile": "Atendente de Suporte ao Cliente"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "interviewId": "uuid",
    "initialMessage": "Olá! Sou um cliente insatisfeito...",
    "candidate": {
      "id": "uuid",
      "name": "João Silva",
      "email": "joao@example.com"
    }
  }
}
```

#### Send Message
```http
POST /api/interviews/{id}/message
```

Sends a message to an active interview.

**Request Body:**
```json
{
  "message": "Olá, como posso ajudar?"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "reply": "Minha internet está muito lenta..."
  }
}
```

#### Get Interview
```http
GET /api/interviews/{id}
```

Retrieves interview details.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "candidateId": "uuid",
    "jobProfile": "Atendente de Suporte ao Cliente",
    "status": "IN_PROGRESS",
    "chatHistory": [
      {
        "role": "assistant",
        "content": "Olá! Sou um cliente insatisfeito..."
      },
      {
        "role": "user",
        "content": "Olá, como posso ajudar?"
      }
    ],
    "startedAt": "2025-01-06T10:30:00.000Z",
    "completedAt": null,
    "candidate": {
      "id": "uuid",
      "name": "João Silva",
      "email": "joao@example.com"
    },
    "evaluation": null
  }
}
```

#### Complete Interview
```http
POST /api/interviews/{id}/complete
```

Completes an interview and generates an AI evaluation.

**Response:**
```json
{
  "success": true,
  "data": {
    "evaluation": {
      "id": "uuid",
      "interviewId": "uuid",
      "overallScore": 8.5,
      "evaluationData": {
        "scores": {
          "empathy": {
            "score": 9,
            "justification": "Demonstrou empatia ao reconhecer a frustração do cliente..."
          },
          "problemSolving": {
            "score": 8,
            "justification": "Identificou o problema rapidamente..."
          },
          "communication": {
            "score": 9,
            "justification": "Comunicação clara e objetiva..."
          },
          "toneOfVoice": {
            "score": 8,
            "justification": "Tom profissional e prestativo..."
          },
          "efficiency": {
            "score": 8,
            "justification": "Resolveu o problema de forma eficiente..."
          }
        },
        "summary": {
          "strength": "Excelente comunicação e empatia",
          "developmentArea": "Pode melhorar na resolução de problemas complexos"
        }
      },
      "createdAt": "2025-01-06T10:35:00.000Z"
    },
    "overallScore": 8.5
  },
  "message": "Entrevista finalizada e avaliada com sucesso"
}
```

#### Get Interview Statistics
```http
GET /api/interviews/statistics
```

Retrieves interview statistics.

**Response:**
```json
{
  "success": true,
  "data": {
    "totalInterviews": 150,
    "completedInterviews": 120,
    "averageScore": 7.8,
    "scoreDistribution": [
      {
        "overallScore": 8.0,
        "_count": {
          "overallScore": 25
        }
      }
    ]
  }
}
```

### RH Dashboard

#### Get Dashboard Data
```http
GET /api/rh/dashboard
```

Retrieves all evaluated interviews for the RH dashboard.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "candidateId": "uuid",
      "jobProfile": "Atendente de Suporte ao Cliente",
      "status": "EVALUATED",
      "startedAt": "2025-01-06T10:30:00.000Z",
      "completedAt": "2025-01-06T10:35:00.000Z",
      "candidate": {
        "name": "João Silva",
        "email": "joao@example.com"
      },
      "evaluation": {
        "overallScore": 8.5,
        "createdAt": "2025-01-06T10:35:00.000Z",
        "evaluationData": {
          "scores": { ... },
          "summary": { ... }
        }
      }
    }
  ],
  "count": 1
}
```

#### Get Interview Details
```http
GET /api/rh/interviews/{id}
```

Retrieves detailed interview information for RH.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "candidateId": "uuid",
    "jobProfile": "Atendente de Suporte ao Cliente",
    "status": "EVALUATED",
    "chatHistory": [ ... ],
    "startedAt": "2025-01-06T10:30:00.000Z",
    "completedAt": "2025-01-06T10:35:00.000Z",
    "candidate": {
      "id": "uuid",
      "name": "João Silva",
      "email": "joao@example.com"
    },
    "evaluation": {
      "id": "uuid",
      "interviewId": "uuid",
      "overallScore": 8.5,
      "evaluationData": { ... },
      "createdAt": "2025-01-06T10:35:00.000Z"
    }
  }
}
```

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "error": "Error message",
  "details": "Additional error details (optional)"
}
```

### Common HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error

### Validation Errors

When validation fails, the response includes detailed error information:

```json
{
  "success": false,
  "error": "Validation failed",
  "details": "Nome deve ter entre 2 e 100 caracteres, Email deve ter um formato válido"
}
```

## Rate Limiting Headers

When rate limiting is applied, the following headers are included in the response:

- `X-RateLimit-Limit` - Maximum number of requests allowed
- `X-RateLimit-Remaining` - Number of requests remaining
- `X-RateLimit-Reset` - Time when the rate limit resets (Unix timestamp)

## Examples

### Complete Interview Flow

1. **Start Interview**
```bash
curl -X POST http://localhost:3000/api/interviews/start \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com",
    "jobProfile": "Atendente de Suporte ao Cliente"
  }'
```

2. **Send Messages**
```bash
curl -X POST http://localhost:3000/api/interviews/{interviewId}/message \
  -H "Content-Type: application/json" \
  -d '{"message": "Olá, como posso ajudar?"}'
```

3. **Complete Interview**
```bash
curl -X POST http://localhost:3000/api/interviews/{interviewId}/complete
```

4. **Get Dashboard Data**
```bash
curl -X GET http://localhost:3000/api/rh/dashboard
```
