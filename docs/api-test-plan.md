# Issues API Test Plan

## Purpose

These tests define the expected API behaviour.
Run them after implementing the API routes in Lab 4.

Current status: Not run — API routes are not implemented yet.

## Valid Test Data

- title: Projector not detected
- description: Laptop cannot detect the classroom projector.
- priority: Medium

For POST and PATCH requests, use:
Content-Type: application/json
unless the test specifies another content type.

## Test Cases

| ID | Request / Scenario | Expected Result |
|---|---|---|
| T01 | GET /api/issues | 200; JSON array of complete issues. |
| T02 | POST /api/issues with valid test data | 201; complete issue with a generated id, createdAt and status Open. |
| T03 | POST with title missing | 400; VALIDATION_ERROR. |
| T04 | POST with priority Critical | 400; VALIDATION_ERROR. |
| T05 | PATCH /api/issues/{id}/status for an existing issue with status Resolved | 200; complete updated issue with status Resolved. |
| T06 | PATCH an existing issue with status Deleted | 400; VALIDATION_ERROR. |
| T07 | PATCH an unknown id with valid status Open | 404; ISSUE_NOT_FOUND. |
| T08 | GET /api/issues when the store is empty | 200; empty array []. |
| T09 | POST valid data plus client-supplied id, status and createdAt | 201; supplied server-owned fields ignored; server generates id and createdAt and sets status Open. |
| T10 | POST with title Hi | 400; VALIDATION_ERROR. |
| T11 | POST with a whitespace-only title | 400; VALIDATION_ERROR. |
| T12 | POST with description shorter than 5 characters | 400; VALIDATION_ERROR. |
| T13 | POST with title longer than 100 characters | 400; VALIDATION_ERROR. |
| T14 | POST with description longer than 500 characters | 400; VALIDATION_ERROR. |
| T15 | POST valid data with surrounding whitespace in title and description | 201; returned and stored text is trimmed. |
| T16 | POST or PATCH with malformed JSON and application/json content type | 400; VALIDATION_ERROR. |
| T17 | POST or PATCH with text/plain content type | 415; UNSUPPORTED_MEDIA_TYPE. |
| T18 | PATCH an existing issue with status missing | 400; VALIDATION_ERROR. |
| T19 | POST with a numeric title | 400; VALIDATION_ERROR. |
| T20 | PATCH a Resolved issue with status Open | 200; issue reopened; other fields unchanged. |
| T21 | GET when the storage read fails unexpectedly in a controlled test | 500; INTERNAL_ERROR; no stack trace or internal path in response. |
| T22 | POST with valid title and description but priority missing | 400; VALIDATION_ERROR. |
| T23 | POST with valid title and priority but description missing | 400; VALIDATION_ERROR. |
| T24 | POST or PATCH with an array or null as the JSON body | 400; VALIDATION_ERROR. |

## Verification

For each test, record:
- Actual HTTP status code.
- Actual response body.
- Pass or fail.
- Screenshot or saved response.

All error responses must contain:
- error.code
- error.message

For successful creates and updates, verify the stored data too.
Use a backup or isolated test data for tests that modify storage.