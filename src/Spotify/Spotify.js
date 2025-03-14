const clientId = process.env.REACT_APP_CLIENT_ID;
const redirectUri = process.env.REACT_APP_REDIRECT_URI;


const Spotify = {
  // Retrieves the access token from the URL or redirects to Spotify login
  getAccessToken() {
    return new Promise((resolve, reject) => {
     
      const storedAccessToken = localStorage.getItem("accessToken");
      const storedExpirationTime = localStorage.getItem("expirationTime");

      if (
        storedAccessToken &&
        storedExpirationTime &&
        Date.now() < storedExpirationTime
      ) {
        resolve(storedAccessToken);
        return;
      }

      const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
      const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

      if (accessTokenMatch && expiresInMatch) {
        const accessToken = accessTokenMatch[1];
        const expiresIn = Number(expiresInMatch[1]);
        this.setAccessToken(accessToken, expiresIn);
        window.history.pushState("Access Token", null, "/");
        resolve(accessToken);
      } else {
        const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=user-read-private user-read-email playlist-modify-public playlist-modify-private&redirect_uri=${encodeURIComponent(
          redirectUri
        )}`;

        window.location = accessUrl;
        // Since we're redirecting, we don't resolve or reject here
      }
    });
  },

  // Sets the access token and its expiration time in your app
  setAccessToken(accessToken, expiresIn) {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("expirationTime", Date.now() + expiresIn * 1000);
  },

  // Checks if the access token is valid based on its expiration time
  isAccessTokenValid() {
    const accessToken = localStorage.getItem("accessToken");
    const expirationTime = localStorage.getItem("expirationTime");
    return accessToken && expirationTime && Date.now() < expirationTime;
  },

  // Saves the playlist to Spotify, including playlist details and track URIs
  async savePlaylistToSpotify(playlistData, trackURIs, accessToken) {
    try {
      if (!accessToken) {
        accessToken = await this.getAccessToken();
      }

      // Fetch user data to get the user ID
      const userResponse = await fetch("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!userResponse.ok) {
        throw new Error("Unable to fetch user data");
      }

      // Parse user data and extract user ID
      const jsonResponse = await userResponse.json();
      const userId = jsonResponse.id;

      if (!userId) {
        throw new Error("Unable to retrieve user ID");
      }

      // Create a new playlist for the user
      const playlistResponse = await fetch(
        `https://api.spotify.com/v1/users/${userId}/playlists`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(playlistData),
        }
      );
      console.log("Client ID:", clientId);
      console.log("Redirect URI:", redirectUri);

      // Handle errors in creating the playlist
      if (!playlistResponse.ok) {
        const errorResponse = await playlistResponse.json();
        console.error("Error creating playlist:", errorResponse);

        // Log specific details about the error
        if (errorResponse.error) {
          console.error("Error details:", errorResponse.error);
        }

        throw new Error("Unable to create playlist");
      }

      // Parse the response and get the playlist ID
      const playlistJsonResponse = await playlistResponse.json();
      const playlistId = playlistJsonResponse.id;

      // Add tracks to the created playlist
      if (playlistId) {
        const addTracksResponse = await fetch(
          `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ uris: trackURIs }),
          }
        );

        // Handle errors in adding tracks to the playlist
        if (!addTracksResponse.ok) {
          throw new Error("Unable to add tracks to the playlist");
        }

        console.log("Playlist saved successfully!");
      }
    } catch (error) {
      console.error("Error:", error.message);
      // Add the following lines:
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
      }
      // Handle the error, but don't call savePlaylistToSpotify again
    }
  },
};

export default Spotify;
