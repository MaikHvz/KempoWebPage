
export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('isAdmin') === 'true';
};

export const login = (password: string): boolean => {
  // En un caso real, esto se validaría contra un backend o Firebase Auth
  if (password === 'admin123' || password === 'kempo2024') { 
    localStorage.setItem('isAdmin', 'true');
    return true;
  }
  return false;
};

export const logout = () => {
  localStorage.removeItem('isAdmin');
};
