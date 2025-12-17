/**
 * Decode JWT access token and check if it's expired
 * Note: Refresh token is a random string stored in database, 
 * its expiration can only be checked via backend API responses (401/404)
 * @param {string} token - JWT access token string
 * @returns {boolean} - true if token is expired or invalid, false if valid
 */
export const isTokenExpired = (token) => {
  if (!token || typeof token !== 'string') {
    return true;
  }

  try {
    // JWT tokens have 3 parts separated by dots: header.payload.signature
    const parts = token.split('.');
    if (parts.length !== 3) {
      return true; // Invalid token format
    }

    // Decode the payload (second part)
    const payload = parts[1];
    
    // Add padding if needed (base64url may not have padding)
    const paddedPayload = payload + '='.repeat((4 - (payload.length % 4)) % 4);
    
    // Decode base64
    const decodedPayload = atob(paddedPayload.replace(/-/g, '+').replace(/_/g, '/'));
    const parsedPayload = JSON.parse(decodedPayload);

    // Check if token has expiration claim
    if (!parsedPayload.exp) {
      // If no expiration claim, consider it invalid (should have exp)
      return true;
    }

    // exp is in seconds, Date.now() is in milliseconds
    const expirationTime = parsedPayload.exp * 1000;
    const currentTime = Date.now();

    // Check if token is expired (with 5 second buffer to account for clock skew)
    return currentTime >= (expirationTime - 5000);
  } catch (error) {
    // If decoding fails, consider token invalid/expired
    console.warn('Error decoding token:', error);
    return true;
  }
};

