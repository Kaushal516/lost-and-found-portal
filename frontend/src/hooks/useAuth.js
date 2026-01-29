import{ jwtDecode } from "jwt-decode";

const useAuth = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return {
      isAuthenticated: false,
      isAdmin: false,
      user: null
    };
  }

  try {
    const decoded = jwtDecode(token);

    return {
      isAuthenticated: true,
      isAdmin: decoded.type === "admin",
      user: decoded
    };
  } catch {
    return {
      isAuthenticated: false,
      isAdmin: false,
      user: null
    };
  }
};

export default useAuth;
