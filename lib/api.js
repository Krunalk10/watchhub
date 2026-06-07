// Simple in-memory storage for demo purposes
const users = new Map();

/**
 * Validates user credentials
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<{id: string, email: string}|null>} User object or null if invalid
 */
export async function validateAuth(email, password) {
  return new Promise((resolve, reject) => {
    try {
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      const user = Array.from(users.values()).find(u => u.email === email);
      
      if (!user) {
        console.log('[v0] User not found:', email);
        resolve(null);
        return;
      }
      
      // In production, use proper password hashing with bcrypt or argon2
      if (user.password !== password) {
        console.log('[v0] Invalid password for user:', email);
        resolve(null);
        return;
      }
      
      console.log('[v0] User validated:', email);
      resolve({ id: user.id, email: user.email });
    } catch (error) {
      console.error('[v0] Auth validation error:', error instanceof Error ? error.message : String(error));
      reject(error);
    }
  });
}

/**
 * Registers a new user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<{id: string, email: string}|null>} User object or null if user exists
 */
export async function registerUser(email, password) {
  return new Promise((resolve, reject) => {
    try {
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      // Check if user already exists
      const existingUser = Array.from(users.values()).find(u => u.email === email);
      if (existingUser) {
        console.log('[v0] User already exists:', email);
        resolve(null);
        return;
      }
      
      const id = `user_${Date.now()}`;
      users.set(id, { id, email, password });
      
      console.log('[v0] User registered:', email);
      resolve({ id, email });
    } catch (error) {
      console.error('[v0] User registration error:', error instanceof Error ? error.message : String(error));
      reject(error);
    }
  });
}

/**
 * Gets user by ID
 * @param {string} id - User ID
 * @returns {Promise<Object|undefined>} User object or undefined
 */
export async function getUserById(id) {
  return new Promise((resolve, reject) => {
    try {
      if (!id) {
        throw new Error('User ID is required');
      }

      const user = users.get(id);
      if (!user) {
        console.log('[v0] User not found with ID:', id);
      }
      resolve(user);
    } catch (error) {
      console.error('[v0] Get user error:', error instanceof Error ? error.message : String(error));
      reject(error);
    }
  });
}
