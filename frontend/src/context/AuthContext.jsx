import { createContext, useEffect, useReducer } from "react";

const normalizeUser = (user) => {
  if (!user || typeof user !== "object") return null;

  return {
    ...user,
    username:
      user.username ||
      user.fullName ||
      user.name ||
      user.email?.split("@")[0] ||
      "User",
  };
};

const getStoredUser = () => {
  try {
    const storedUser = localStorage.getItem("user");

    if (!storedUser || storedUser === "undefined") {
      localStorage.removeItem("user");
      return null;
    }

    return normalizeUser(JSON.parse(storedUser));
  } catch (error) {
    localStorage.removeItem("user");
    return null;
  }
};

const initial_state = {
  user: getStoredUser(),
  loading: false,
  error: null,
};

export const AuthContext = createContext(initial_state);

const AuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return {
        user: null,
        loading: true,
        error: null,
      };

    case "LOGIN_SUCCESS":
      return {
        user: normalizeUser(action.payload),
        loading: false,
        error: null,
      };

    case "LOGIN_FAILURE":
      return {
        user: null,
        loading: false,
        error: action.payload,
      };

    case "REGISTER_SUCCESS":
      return {
        user: null,
        loading: false,
        error: null,
      };

    case "REGISTER_FAILURE":
      return {
        user: null,
        loading: false,
        error: action.payload,
      };

    case "LOGOUT":
      localStorage.removeItem("user");
      return {
        user: null,
        loading: false,
        error: null,
      };

    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, initial_state);

  useEffect(() => {
    const normalizedUser = normalizeUser(state.user);

    if (normalizedUser) {
      localStorage.setItem("user", JSON.stringify(normalizedUser));
    } else {
      localStorage.removeItem("user");
    }
  }, [state.user]);

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        loading: state.loading,
        error: state.error,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};