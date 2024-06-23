import Track from "../Track/Track";

// Component that renders the search results and allows adding tracks to the playlist
function Tracklist({ tracks, playlistTracks, addTrackToPlaylist }) {
  // Filter out the tracks that are already in the playlist
  let songsAdded = tracks.filter(
    (track) =>
      !playlistTracks.some((playlistTrack) => track.id === playlistTrack.id)
  );

  return (
    <>
      {/* Map through the filtered tracks and render Track components */}
      {songsAdded.map((track, index) => (
        <Track
          key={index}
          songInfo={track}
          addTrackToPlaylist={addTrackToPlaylist}
          // Determine if the track is already in the playlist for styling
          isRemovable={playlistTracks.some(
            (playlistTrack) => playlistTrack.id === track.id
          )}
        />
      ))}
    </>
  );
}

export default Tracklist;
