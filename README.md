# Gender Classification API

This is a simple backend API that takes a name and predicts gender by calling the Genderize.io API.

## Live URL
**https://gender-classifier-api-beta.vercel.app**

## Endpoint
**GET** `/api/classify?name={name}`

### Example Request (with Sally)
https://gender-classifier-api-beta.vercel.app/api/classify?name=Sally
text### Success Response Example
```json
{
  "status": "success",
  "data": {
    "name": "Sally",
    "gender": "female",
    "probability": 0.92,
    "sample_size": 12345,
    "is_confident": true,
    "processed_at": "2026-04-12T15:00:00Z"
  }
}
Error Responses

400 Bad Request: When name is missing or empty
422 Unprocessable Entity: When name is not a string
When no prediction is available:JSON{
  "status": "error",
  "message": "No prediction available for the provided name"
}

Features

Calls the Genderize.io external API
Renames count to sample_size
Calculates is_confident: true only when probability ≥ 0.7 AND sample_size ≥ 100
Adds processed_at with current UTC time on every request
Has CORS header (Access-Control-Allow-Origin: *)
Proper validation and error handling for all cases

How to Run Locally

Install dependencies:Bashnpm install
Run the server:Bashnode index.js
Test it:
Open your browser and go to:
http://localhost:3000/api/classify?name=Sally

Tech Stack

Node.js
Express.js
Axios

This project was built for the Stage 0 (Backend) API Integration & Data Processing Assessment.