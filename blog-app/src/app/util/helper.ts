import { HttpHeaders } from "@angular/common/http";

interface AuthHeaders {
    headers: HttpHeaders;
  }

/**
 * Generates HTTP headers with Bearer token authorization
 * @returns Object containing HttpHeaders with Authorization
 * @throws Error if no access token is found
 */
export function getAuthorizationHeaders(): AuthHeaders {
    const token = localStorage.getItem('access_token');
    
    if (!token) {
      throw new Error('No access token found in localStorage');
    }
  
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      })
    };
  }
  