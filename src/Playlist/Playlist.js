import Track from "../Track/Track";
import React from "react";
import Spotify from "../Spotify/Spotify";
import playlistStyles from "./Playlist.module.css";
import { Button } from "@mui/material";

// Playlist component that displays and manages the user's playlist
function Playlist({
  playlistName,
  setPlaylistName,
  tracks,
  addTrackToPlaylist,
  removeTrackFromPlaylist,
  clearPlaylist,
}) {
  // Handles the playlist name change
  function handleChange({ target }) {
    setPlaylistName(target.value);
    // console.log("New Playlist Name:", target.value);
  }

  // Function to get the URIs of tracks in the playlist
  const getTrackURIs = (tracks) => {
    return tracks.map((track) => track.uri);
  };

  // Function to handle saving the playlist to Spotify
  function handleSaveToSpotify() {
    const trackURIs = getTrackURIs(tracks);
    // const accessToken = Spotify.getAccessToken();
    const accessToken = Spotify.getAccessToken();

    // Data for creating the Spotify playlist
    const playlistData = {
      name: playlistName,
      description: "My awesome playlist", // You can customize the description
      public: true, // Set to true for a public playlist, false for private
    };

    // Save the playlist to Spotify using the Spotify API
    Spotify.savePlaylistToSpotify(playlistData, trackURIs, accessToken)
      .then(() => {
        clearPlaylist(); // Call the function after saving the playlist to reset the state
      })
      .catch((error) => {
        console.error("Error saving playlist:", error);
      });
  }

  return (
    <div className="playlist-container">
      {/* Input field for editing the playlist name */}
      <input type="text" value={playlistName} onChange={handleChange} />

      {/* Playlist name with specific styling */}
      {/* <h2 className="playlist-name">{playlistName}</h2> */}

      {/* Button to save the playlist to Spotify */}
      <Button variant="contained" onClick={handleSaveToSpotify}>
        Save To Spotify
      </Button>
      <div className={playlistStyles.playlistResults}>
        {/* Map through the tracks and render Track components */}
        {tracks.map((track, index) => (
          <Track
            key={index}
            songInfo={track}
            addTrackToPlaylist={addTrackToPlaylist}
            removeTrackFromPlaylist={removeTrackFromPlaylist}
            isRemovable={true}
          />
        ))}
      </div>
    </div>
  );
}

// Export the Playlist component as a memoized component
export default React.memo(Playlist);
