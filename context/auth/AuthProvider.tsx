import { FC, useReducer, useEffect, PropsWithChildren } from "react";

import { useSession,signOut } from "next-auth/react"
import { AuthContext, authReducer } from "./";
import Cookies from "js-cookie";
import axios from "axios";

import { tesloApi } from "../../api";
import { IUser } from "../../interfaces";
import { useRouter } from "next/router";

export interface AuthState {
  isLoggedIn: boolean;
  user?: IUser;
}

const AUTH_INITIAL_STATE: AuthState = {
  isLoggedIn: false,
  user: undefined,
};

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, AUTH_INITIAL_STATE);

  const router = useRouter();
  const { data, status } = useSession();

  useEffect(() => {

    if(status === 'authenticated'){
      
     dispatch({ type: "[Auth] - Login", payload: data?.user as IUser});
    }

  }, [status, data])

  // useEffect(() => {
  //   checkToken();
  // }, []);

  const checkToken = async () => {

    if(!Cookies.get("token") === undefined) return;
    try {
      const { data } = await tesloApi.get("/user/validate-token");

      const { token, user } = data;

      Cookies.set("token", token);
      dispatch({ type: "[Auth] - Login", payload: user });
    } catch (error) {
      Cookies.remove("token");
    }
  };

  const loginUser = async (
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      const { data } = await tesloApi.post("/user/login", { email, password });

      const { token, user } = data;

      Cookies.set("token", token);
      dispatch({ type: "[Auth] - Login", payload: user });

      return true;
    } catch (error) {
      return false;
    }
  };

  const registerUser = async (
    name: string,
    email: string,
    password: string
  ): Promise<{ hasError: boolean; message?: string }> => {
    try {
      const { data } = await tesloApi.post("/user/register", {
        name,
        email,
        password,
      });
      const { token, user } = data;
      Cookies.set("token", token);
      dispatch({ type: "[Auth] - Login", payload: user });
      return {
        hasError: false,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          hasError: true,
          message: error.response?.data.message,
        };
      }

      return {
        hasError: true,
        message: "No se pudo registrar el usuario intente mas tarde",
      };
    }
  };


  const logout = () => {
    Cookies.remove("cart");
    Cookies.remove('firstName');
    Cookies.remove('lastName');
    Cookies.remove('address');
    Cookies.remove('address2');
    Cookies.remove('zip');
    Cookies.remove('city');
    Cookies.remove('country');
    Cookies.remove('phone');

    signOut();

  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        loginUser,
        registerUser,
        logout,
        //methods
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
