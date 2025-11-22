import { Message } from '../types';

const STORAGE_KEY_MESSAGES = 'overseas_gas_messages';
const STORAGE_KEY_SESSION = 'overseas_gas_session_id';

// Generate a simple UUID
const generateUUID = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export const getSessionId = (): string => {
  let sessionId = localStorage.getItem(STORAGE_KEY_SESSION);
  if (!sessionId) {
    sessionId = generateUUID();
    localStorage.setItem(STORAGE_KEY_SESSION, sessionId);
  }
  return sessionId;
};

export const loadMessages = (): Message[] | null => {
  const stored = localStorage.getItem(STORAGE_KEY_MESSAGES);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Failed to parse messages", e);
      return null;
    }
  }
  return null;
};

export const saveMessages = (messages: Message[]): void => {
  localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(messages));
};

export const clearChatHistory = (): void => {
  localStorage.removeItem(STORAGE_KEY_MESSAGES);
  // We optionally keep the session ID, or clear it too. 
  // Usually better to keep session ID for analytics, but resetting it "restarts" the conversation completely.
  localStorage.removeItem(STORAGE_KEY_SESSION);
};

export const getCurrentTimestamp = (): string => {
  const now = new Date();
  return now.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
};