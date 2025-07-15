
export const cleanupAuthState = () => {
  // Clear all auth-related items from localStorage
  const keysToRemove = [];
  
  // Check for any supabase auth keys
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.startsWith('supabase.auth.') || key.includes('sb-'))) {
      keysToRemove.push(key);
    }
  }
  
  // Remove the keys
  keysToRemove.forEach(key => {
    localStorage.removeItem(key);
  });
  
  // Also clear session storage
  if (typeof sessionStorage !== 'undefined') {
    const sessionKeysToRemove = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && (key.startsWith('supabase.auth.') || key.includes('sb-'))) {
        sessionKeysToRemove.push(key);
      }
    }
    sessionKeysToRemove.forEach(key => {
      sessionStorage.removeItem(key);
    });
  }
};
