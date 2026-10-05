# BigMart Auth API Contract

## 1. Registration
- **Endpoint**: `POST /api/v1/auth/register`
- **Body**: `{ name, email, password }`
- **Response**: 
  ```json
  {
    "success": true,
    "message": "Registration successful. Please check your email to verify your account.",
    "data": {
      "user": { ... }
    }
  }
  ```
- **Error Response**: 400 Bad Request if validation fails, 409 Conflict if email exists.

## 2. Login
- **Endpoint**: `POST /api/v1/auth/login`
- **Body**: `{ email, password }`
- **Response**: 
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "accessToken": "...",
      "user": { ... }
    }
  }
  ```
- **Cookie Behavior**: Sets `refreshToken` HTTP-only cookie.

## 3. Logout
- **Endpoint**: `POST /api/v1/auth/logout`
- **Body**: none
- **Response**: 
  ```json
  {
    "success": true,
    "message": "Logged out successfully"
  }
  ```
- **Cookie Behavior**: Clears `refreshToken` HTTP-only cookie.

## 4. Current User (Me)
- **Endpoint**: `GET /api/v1/auth/me`
- **Headers**: `Authorization: Bearer <accessToken>`
- **Response**: 
  ```json
  {
    "success": true,
    "data": {
      "user": { ... }
    }
  }
  ```

## 5. Refresh Token
- **Endpoint**: `POST /api/v1/auth/refresh`
- **Body**: none (uses HTTP-only cookie)
- **Response**:
  ```json
  {
    "success": true,
    "message": "Token refreshed successfully",
    "data": {
      "accessToken": "..."
    }
  }
  ```

## 6. Email Verification
- **Endpoint**: `GET /api/v1/auth/verify-email?token=<token>`
- **Response**: JSON indicating success.

## 7. Resend Verification
- **Endpoint**: `POST /api/v1/auth/resend-verification`
- **Body**: `{ email }`
- **Response**: JSON indicating success.

## 8. Google OAuth
- **Start**: `GET /api/v1/auth/google` (Redirects user to Google)
- **Callback**: `GET /api/v1/auth/google/callback`
- **Callback Behavior**: 
  - On Success: Sets `refreshToken` cookie and redirects to `{FRONTEND_URL}/oauth/success?token={accessToken}`.
  - On Failure: Redirects to `{FRONTEND_URL}/login?error={errorMessage}`.
