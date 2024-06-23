import SearchBar from "./SearchBar/SearchBar";
import SearchResults from "./SearchResults/SearchResults";
import Playlist from "./Playlist/Playlist";
import LoginButton from "./Login/LoginButton";
import Spotify from "./Spotify/Spotify";
import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import appStyles from "./App.module.css";
import searchStyles from "./SearchResults/SearchResults.module.css";
import footerStyles from "./App.module.css";

function App() {
  const [accessToken, setAccessToken] = useState("");

  useEffect(() => {
    if (!accessToken) {
      const token = Spotify.getAccessToken();
      setAccessToken(token);
    }
  }, [accessToken]);

  // State for the playlist
  const [playlistName, setPlaylistName] = useState("Create New Playlist");
  const [playlistTracks, setPlaylistTracks] = useState([]);

  // Function to clear the playlist
  function clearPlaylist() {
    // Reset playlist-related state variables
    setPlaylistName("Enter Playlist Name");
    setPlaylistTracks([]);
    // Add any other playlist-related state variables you need to reset
  }

  // Function to add a song to the playlist
  const addTrackToPlaylist = (track) => {
    // Check if the track is already in the playlist
    const isTrackInPlaylist = playlistTracks.some(
      (playlistTrack) => playlistTrack.id === track.id
    );

    // If the track is not in the playlist, add it
    if (!isTrackInPlaylist) {
      setPlaylistTracks((prevTracks) => [...prevTracks, track]);
    }
  };

  // Function to remove a track from the playlist
  const removeTrackFromPlaylist = (track) => {
    setPlaylistTracks((prevTracks) =>
      prevTracks.filter((t) => t.id !== track.id)
    );
  };

  // State for search results
  const [results, setResults] = useState([]);

  // Function to handle search results
  const handleSearch = (searchTerm) => {
    // Your Spotify access token

    Spotify.getAccessToken();

    // Fetch search results from Spotify API
    fetch(`https://api.spotify.com/v1/search?q=${searchTerm}&type=track`, {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    })
      .then(
        (response) => {
          // Check if the response is successful
          if (response.ok) {
            return response.json();
          }
          // Throw an error if the request fails
          throw new Error("Request failed");
        },
        (networkError) => console.log(networkError.message)
      )
      .then((jsonResponse) => {
        // Code to execute after receiving the JSON response
        if (jsonResponse.tracks) {
          // Extract track data from the JSON response
          let trackData = jsonResponse.tracks.items.map((track) => ({
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri,
            preview: track.preview_url,
          }));

          // Set the search results state
          setResults(trackData);
        } else {
          // If there are no tracks, set an empty array for results
          setResults([]);
        }
      });
  };

  return (
    <>
      <Grid container spacing={4} xs={12} className={appStyles.gridContainer}>
        <Grid item xs={12}>
          <div className={appStyles.headerWrapper}>
            <div className={appStyles.headerTop}>
              <div>
                <h1>Jammming</h1>
              </div>
            </div>
            <div className={appStyles.headerBottom}>
              <p>
                Search for a song, if you like it, add it to your playlist, and
                then save your playlist to Spotify. <br />
                Note: You must Login to create a playlist, you must also Create
                a Playlist name to save to Spotify.
              </p>

              <LoginButton />
            </div>
          </div>
        </Grid>
        <div className={appStyles.gridCentered}>
          <Grid item xs={6} className="grid1">
            <SearchBar onSearch={handleSearch} />
            <div className={searchStyles.searchContainer}>
              <SearchResults
                results={results}
                playlistTracks={playlistTracks}
                addTrackToPlaylist={addTrackToPlaylist}
              />
            </div>
          </Grid>

          <Grid item xs={6} className="grid2">
            <Playlist
              playlistName={playlistName}
              setPlaylistName={setPlaylistName}
              tracks={playlistTracks}
              addTrackToPlaylist={addTrackToPlaylist}
              removeTrackFromPlaylist={removeTrackFromPlaylist}
              accessToken={accessToken}
              clearPlaylist={clearPlaylist}
            />
          </Grid>
        </div>
      </Grid>

      <footer className={footerStyles.footerContent}>
        Designed by: <a href="https://dakuwon.github.io"> Matthew McCane</a>{" "}
        &copy; 2024
      </footer>
    </>
  );
}

// Export the App component as the default export
export default App;
