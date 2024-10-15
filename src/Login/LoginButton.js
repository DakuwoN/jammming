import React, { useEffect, useState } from "react";
import Spotify from "../Spotify/Spotify";
import loginStyles from "./LoginButton.module.css";
import { Button } from "@mui/material";

function LoginButton() {
  const [accessToken, setAccessToken] = useState("");

  useEffect(() => {
    const fetchToken = async () => {
      if (!accessToken) {
        try {
          const token = await Spotify.getAccessToken();
          setAccessToken(token);
        } catch (error) {
          console.error("Error fetching access token:", error);
        }
      }
    };

    fetchToken();
  }, [accessToken]);

  const handleLogin = async () => {
    try {
      await Spotify.getAccessToken();
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <>
      <Button
        className={loginStyles.loginButton}
        onClick={handleLogin}
        variant="contained"
      >
        Login with Spotify!
      </Button>
    </>
  );
}

export default LoginButton;
