import React, { useEffect, useState } from "react";
import Spotify from "../Spotify/Spotify";
import loginStyles from "./LoginButton.module.css";
import { Button } from "@mui/material";

function LoginButton() {
  const [accessToken, setAccessToken] = useState("");

  useEffect(() => {
    if (!accessToken) {
      const token = Spotify.getAccessToken();
      setAccessToken(token);
    }
  }, [accessToken]);

  return (
    <>
      {/* Button to trigger the Spotify login process */}
      <Button
        className={loginStyles.loginButton}
        onClick={Spotify.getAccessToken}
        variant="contained"
      >
        Login with Spotify!
      </Button>
    </>
  );
}

export default LoginButton;
