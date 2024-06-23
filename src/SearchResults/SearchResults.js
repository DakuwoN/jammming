import Tracklist from "../Tracklist/Tracklist";

// Component to display the search results
function SearchResults({ results, playlistTracks, addTrackToPlaylist }) {
  return (
    <>
      {/* Render the Tracklist component with search results */}
      <Tracklist
        tracks={results}
        addTrackToPlaylist={addTrackToPlaylist}
        playlistTracks={playlistTracks}
      />
    </>
  );
}

// Export the SearchResults component as the default export
export default SearchResults;
