import TrackStyles from "./Track.module.css";
import { Button } from "@mui/material";

// Responsible for displaying track information
function Track({
  songInfo, // Information about the song (name, artist, album, etc.)
  addTrackToPlaylist, // Function to add the track to the playlist
  removeTrackFromPlaylist, // Function to remove the track from the playlist
  isRemovable, // Indicates whether the track is removable from the playlist
}) {
  console.log("Song Info: ", songInfo);
  // Handles click event when adding the track to the playlist
  function handleClick() {
    addTrackToPlaylist(songInfo);
  }

  // Handles click event when removing the track from the playlist
  function handleRemove() {
    removeTrackFromPlaylist(songInfo);
  }

  function playPreview(preview_url) {
    console.log("Preview URL: ", preview_url);
    if (preview_url) {
      let audio = new Audio(preview_url);
      audio.play();
    } else {
      console.log("No preview available for this track.");
    }
  }

  return (
    <>
      {/* Display track information */}
      <div className={TrackStyles.trackContainer}>
        <div className="trackinfo">
          <hr></hr>
          <p>
            <b>Song: {songInfo.name}</b>
          </p>
          <p>Artist: {songInfo.artist}</p>
          <p>Album: {songInfo.album}</p>
        </div>
        <hr></hr>

        {/* Render the appropriate button based on track removability */}
        {isRemovable ? (
          // Render "Remove Song" button for removable tracks
          <div className="removebutton">
            <Button onClick={handleRemove}>Remove Song</Button>
          </div>
        ) : (
          // Render "+" button for non-removable tracks
          <div className={TrackStyles.addbutton}>
            <Button type="submit" className="plusSign" onClick={handleClick}>
              +
            </Button>
            <Button
              type="playSong"
              className="play"
              onClick={() => playPreview(songInfo.preview_url)}
            >
              Play
            </Button>
          </div>
        )}
      </div>
    </>
  );
}

export default Track;
