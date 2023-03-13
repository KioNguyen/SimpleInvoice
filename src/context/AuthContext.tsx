import { createContext, Dispatch, useEffect, useReducer } from "react";
import * as AuthenService from "../hooks/auth";

const localUser = localStorage.getItem("user")
interface IUserDispatch {
  payload?: any;
  type?: string;
}
const INITIAL_STATE = {
  user: localUser ? JSON.parse(localUser) : null,
  loading: false,
  error: null,
  openLogin: false,
  dispatch: ((args: IUserDispatch) => undefined) as Dispatch<IUserDispatch>
};

export const AuthContext = createContext(INITIAL_STATE);

const AuthReducer = (state, action) => {
  switch (action.type) {
    case "TRIGGER_LOGIN":
      return {
        user: null,
        loading: false,
        error: null,
        openLogin: true
      };
    case "LOGIN_START":
      return {
        user: null,
        loading: true,
        error: null,
        openLogin: false
      };
    case "LOGIN_SUCCESS":
      return {
        user: action.payload,
        loading: false,
        error: null,
        openLogin: false
      };
    case "LOGIN_FAILURE":
      return {
        user: null,
        loading: false,
        error: action.payload,
        openLogin: false
      };
    case "LOGOUT":
      return {
        user: null,
        loading: false,
        error: null,
        openLogin: false
      };
    default:
      return state;
  }
};

const isValidToken = async (tokenInfor, callbackErr): Promise<void> => {
  try {
    const res = await AuthenService.checkJWT(tokenInfor);
  } catch (err) {
    callbackErr()
  }
}

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);
  localStorage.setItem("user", JSON.stringify(state.user));
  useEffect(() => {
    if (state.user) {
      isValidToken({
        apiToken: state.user.apiToken,
        access_token: state.user.access_token
      }, () => dispatch({ type: "LOGOUT" }));
    }
  }, [state.user]);

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        loading: state.loading,
        error: state.error,
        openLogin: state.openLogin,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
