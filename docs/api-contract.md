# API Contract: Issues API

## 1. Issue Data Dictionary

| Field | Type | Owner | Rules |
|---|---|---|---|
| id | string | Server | Unique, required in stored and returned issues, immutable. |
| title | string | Client | Required; trim whitespace; 3–100 characters after trimming. |
| description | string | Client | Required; trim whitespace; 5–500 characters after trimming. |
| priority | string | Client | Required; Low, Medium or High. |
| status | string | Server / controlled update | Open or Resolved. New issues start as Open. |
| createdAt | string | Server | ISO 8601 timestamp; generated on creation; immutable. |

Enum values are case-sensitive.
The API returns JSON with Content-Type: application/json.

## 2. View All Issues

- Method: GET
- Path: /api/issues
- Request body: none
- Success: 200 OK
- Response: an array of complete issues.

Example response:

```json
[
  {
    "id": "ISS-101",
    "title": "Unable to access Wi-Fi",
    "description": "Connection fails in the teaching lab.",
    "priority": "High",
    "status": "Open",
    "createdAt": "2026-09-01T09:00:00.000Z"
  }
]
```

If no issues exist, return 200 OK with:

```json
[]
```

Possible errors:
- 500 INTERNAL_ERROR: unable to read the stored data.

## 3. Create an Issue

- Method: POST
- Path: /api/issues
- Required request header: Content-Type: application/json
- Request body: a JSON object containing title, description and priority.

Example request:

```json
{
  "title": "Projector not detected",
  "description": "Laptop cannot detect the classroom projector.",
  "priority": "Medium"
}
```

Validation:
- The body must be a JSON object, not an array or null.
- All three required fields must be strings.
- Apply the length and allowed-value rules in the data dictionary.
- Whitespace-only titles and descriptions are invalid.
- The server generates id and createdAt and sets status to Open.
- Extra fields, including client-supplied id, status and createdAt,
  are ignored and are not copied into the stored issue.

Success: 201 Created with the complete new issue.
The id and timestamp below are illustrative server-generated values.

```json
{
  "id": "b99e730e-555c-4e7f-b9e8-7864bb43a870",
  "title": "Projector not detected",
  "description": "Laptop cannot detect the classroom projector.",
  "priority": "Medium",
  "status": "Open",
  "createdAt": "2026-10-12T20:00:00.000Z"
}
```

Possible errors:
- 400 VALIDATION_ERROR: malformed JSON, invalid body or invalid fields.
- 415 UNSUPPORTED_MEDIA_TYPE: request content type is not application/json.
- 500 INTERNAL_ERROR: unexpected storage or server failure.

## 4. Change Issue Status

- Method: PATCH
- Path: /api/issues/{id}/status
- The {id} identifies the issue to update.
- Required request header: Content-Type: application/json
- Request body: a JSON object containing status.

Example request:

```json
{
  "status": "Resolved"
}
```

Validation:
- The body must be a JSON object.
- status is required and must be the string Open or Resolved.
- Validate the body before attempting the update.
- Return 404 if a valid request targets an unknown issue id.
- Ignore extra fields; update only status.
- Keep id, title, description, priority and createdAt unchanged.
- Setting the existing status again is allowed and returns 200.

Success: 200 OK with the complete updated issue.

```json
{
  "id": "ISS-101",
  "title": "Unable to access Wi-Fi",
  "description": "Connection fails in the teaching lab.",
  "priority": "High",
  "status": "Resolved",
  "createdAt": "2026-09-01T09:00:00.000Z"
}
```

Possible errors:
- 400 VALIDATION_ERROR: malformed JSON, invalid body or invalid status.
- 404 ISSUE_NOT_FOUND: no issue matches the supplied id.
- 415 UNSUPPORTED_MEDIA_TYPE: request content type is not application/json.
- 500 INTERNAL_ERROR: unexpected storage or server failure.

## 5. Consistent Error Responses

Every error response uses an error object with code and message.

### 400 Bad Request

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Title must contain between 3 and 100 characters."
  }
}
```

### 404 Not Found

```json
{
  "error": {
    "code": "ISSUE_NOT_FOUND",
    "message": "The requested issue does not exist."
  }
}
```

### 415 Unsupported Media Type

```json
{
  "error": {
    "code": "UNSUPPORTED_MEDIA_TYPE",
    "message": "Content-Type must be application/json."
  }
}
```

### 500 Internal Server Error

```json
{
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "Something went wrong. Please try again later."
  }
}
```

Validation messages describe the specific failed rule.
Internal error details are logged on the server, not returned to clients.