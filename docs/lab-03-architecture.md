# Lab 3 — Cloud Issue Tracker Architecture

## 1. Application Goal

The application helps users report technical issues, view reported
issues and update their status.

The target architecture has three layers:
- Frontend: displays issues and collects user input.
- REST API: validates requests and controls issue operations.
- Data layer: reads and writes issues in backend/data/issues.json.

## 2. Functional Scope

- Create an issue with a title, description and priority.
- View all issues.
- Change an issue status between Open and Resolved.

## 3. Request Flow

### Create an Issue
1. The user completes the frontend form.
2. The frontend sends POST /api/issues with JSON data.
3. The API validates the title, description and priority.
4. The data service generates an id, sets status to Open,
   adds createdAt and saves the issue.
5. The API returns 201 Created with the complete issue.
6. The frontend displays the new issue.

### View Issues
1. The frontend sends GET /api/issues.
2. The API asks the data service to read the stored issues.
3. The API returns 200 OK with a JSON array.
4. The frontend displays the issues.
5. If no issues exist, the API returns an empty array.

### Change Issue Status
1. The user clicks the status button.
2. The frontend sends PATCH /api/issues/{id}/status.
3. The API validates the requested status.
4. The data service finds the issue and updates its status.
5. The API returns 200 OK with the updated issue.
6. An unknown issue id returns 404 Not Found.
7. An invalid status returns 400 Bad Request.

## 4. Trust Boundaries

The browser and all incoming HTTP requests are untrusted.
Users can modify requests outside the frontend form.

The API must validate input even when frontend validation exists.
The browser must not access the data file directly.

The server controls id, initial status and createdAt.
The client supplies title, description and priority.

Error responses must not expose stack traces or internal file paths.
The frontend uses textContent to display user-provided text safely.

## Current Implementation

The frontend still uses its own temporary in-memory array.
Lab 3 introduces the API design and the JSON-file data service.
API routes and frontend integration are not implemented yet.