import { createContext, useEffect, useState } from "react";
import { IToast, IUser, UserContextType } from "../v-mirror.interfaces";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const BASE_URL =
  process.env.NODE_ENV === "production" ? "" : "http://localhost:4000";

export const UserContext = createContext<UserContextType>({
  user: {
    email: "",
    password: "",
    name: "",
  },
  screenshots: [],
  handleLogin: function (value: IUser): void {
    throw new Error("Function not implemented.");
  },
  handleLogout: function (): void {
    throw new Error("Function not implemented.");
  },
  handleSignup: function (value: IUser): void {
    throw new Error("Function not implemented.");
  },
  setUser: function (value: IUser): void {
    throw new Error("Function not implemented.");
  },
  handleToast: function (value: IToast): void {
    throw new Error("Function not implemented.");
  },
  getAccessToken: function (): string {
    throw new Error("Function not implemented.");
  },
  isUserLoggedIn: function (): boolean {
    throw new Error("Function not implemented.");
  },
  getScreenshots: function (): void {
    throw new Error("Function not implemented.");
  },
  uploadScreenshot: function (formData: FormData): void {
    throw new Error("Function not implemented.");
  }
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const toast = useToast();
  const navigate = useNavigate();

  const [user, setUser] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [screenshots, setScreenshots] = useState([]);

  useEffect(() => {
    fetchProfileFromLocalStorage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = async (userLoginDetail: IUser) => {
    try {
      const res = await axios.post(`${BASE_URL}/user/login`, userLoginDetail);

      if (res.status === 200 && res.data?.success === true) {
        setUser(res.data?.user);
        setLocalStorageItem("email", res.data?.user.email);
        setLocalStorageItem("password", res.data?.user.password);
        setLocalStorageItem("name", res.data?.user.name);
        setLocalStorageItem("isLoggedIn", "true");
        handleToast({
          title: res.data?.message,
          isError: false,
        });
        navigate("/products");
      }
    } catch (error: any) {
      handleToast({
        title:
          error.response.data?.message || "An error occurred during login.",
        isError: true,
      });
    }
  };

  const setLocalStorageItem = (key: string, value: string): void => {
    window.localStorage.setItem(key, value);
  };

  const getLocalStorageItem = (key: string): string => {
    return window.localStorage.getItem(key) ?? "";
  };

  const fetchProfileFromLocalStorage = () => {
    if (getLocalStorageItem("isLoggedIn") === "true") {
      setUser({
        email: getLocalStorageItem("email"),
        password: getLocalStorageItem("password"),
        name: getLocalStorageItem("name"),
      });
    }
  };

  const removeLocalStorageItem = (key: string): void => {
    return window.localStorage.removeItem(key);
  };

  const handleSignup = async (userSignupDetail: IUser) => {
    try {
      const res = await axios.post(`${BASE_URL}/user/signup`, userSignupDetail);
      if (res.status === 200 && res.data?.success === true) {
        setUser(res.data?.user);
        setLocalStorageItem("email", user.email);
        setLocalStorageItem("password", user.password);
        setLocalStorageItem("name", user.name);
        setLocalStorageItem("isLoggedIn", "true");
        handleToast({
          title: res.data?.message,
          isError: false,
        });
        navigate("/products");
      }
    } catch (error: any) {
      handleToast({
        title:
          error.response.data?.message || "An error occurred during signup.",
        isError: true,
      });
    }
  };

  const handleLogout = async () => {
    setUser({ email: "", password: "", name: "" });
    removeLocalStorageItem("email");
    removeLocalStorageItem("password");
    removeLocalStorageItem("name");
    setLocalStorageItem("isLoggedIn", "false");
    handleToast({
      title: "User Logged Out",
      isError: false,
    });
    navigate("/");
  };

  const handleToast = (toastDetails: IToast) => {
    toast({
      title: toastDetails.title,
      description: toastDetails.description,
      status: toastDetails.isError ? "error" : "success",
      duration: 1000,
      isClosable: true,
      position: "top-right",
    });
  };

  const getAccessToken = (): string => {
    const email = getLocalStorageItem("email");
    const password = getLocalStorageItem("password");
    return btoa(`${email}:${password}`);
  };

  const isUserLoggedIn = (): boolean => {
    let loggedInStatus = false;
    if (
      getLocalStorageItem("isLoggedIn") === "true" &&
      getLocalStorageItem("email") !== "" &&
      getLocalStorageItem("password") !== ""
    )
      loggedInStatus = true;
    return loggedInStatus;
  };

  const getScreenshots = async () => {
    try {
      const accessToken = getAccessToken();
      const res = await axios.get(`${BASE_URL}/user/screenshot`, {
        headers: {
          Authorization: `Basic ${accessToken}`,
        },
      });
      if (res.status === 200 && res.data?.success === true) {
        setScreenshots(res.data?.screenshots);
      }
    } catch (error: any) {
      handleToast({
        title: error.response?.data?.message || "An error occurred.",
        isError: true,
      });
    }
  };

  const uploadScreenshot = async (formData: FormData) => {
    try {
      const accessToken = getAccessToken();
      const res = await axios.post(`${BASE_URL}/user/screenshot`, formData, {
        headers: {
          Authorization: `Basic ${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.status === 200 && res.data?.success === true) {
        handleToast({
          title: res.data?.message || "An error occurred.",
          isError: false,
        });
        getScreenshots();
      }
    } catch (error: any) {
      handleToast({
        title: error.response.data?.message || "An error occurred.",
        isError: true,
      });
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        handleLogin,
        handleSignup,
        handleToast,
        handleLogout,
        getAccessToken,
        isUserLoggedIn,
        getScreenshots,
        screenshots,
        uploadScreenshot
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
