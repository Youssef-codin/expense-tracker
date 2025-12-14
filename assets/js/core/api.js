import { API_BASE_URL } from './constants.js';

/**
 * Generic API client wrapper
 */
export class Api {
    /**
     * Helper to make requests
     * @param {string} endpoint - e.g. '/user/login.php'
     * @param {string} method - 'GET', 'POST', etc.
     * @param {Object} [body] - JSON body for the request
     * @returns {Promise<any>}
     */
    static async request(endpoint, method = 'GET', body = null) {
        const url = `${API_BASE_URL}${endpoint}`;
        
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
        };

        if (body) {
            options.body = JSON.stringify(body);
        }

        try {
            const response = await fetch(url, options);
            
            // Handle non-JSON responses (like 404 HTML pages)
            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                 throw new Error(`Server returned non-JSON response: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();

            // The API returns { success: boolean, data: ..., message: ... }
            // If success is false, we should throw to be handled by the caller
            if (!response.ok || (data.hasOwnProperty('success') && !data.success)) {
                throw new Error(data.message || `Request failed with status ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error(`API Error (${endpoint}):`, error);
            throw error;
        }
    }

    static async get(endpoint) {
        return this.request(endpoint, 'GET');
    }

    static async post(endpoint, body) {
        return this.request(endpoint, 'POST', body);
    }
}
