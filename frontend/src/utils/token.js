export const setToken = (access, refresh) => {
  localStorage.setItem("access", access);
  localStorage.setItem("refresh", refresh);
};

export const getToken = () => {
  return localStorage.getItem("access");
};

export const getRefresh = () => {
  return localStorage.getItem("refresh");
};

export const removeToken = () => {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
};