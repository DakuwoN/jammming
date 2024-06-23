import React, { useState } from "react";
import { Button } from "@mui/material";
import searchStyles from "./SearchBar.module.css";

// SearchBar component receives a callback function 'onSearch' as a prop
function SearchBar({ onSearch }) {
  // State to manage the input value for the search term
  const [searchTerm, setSearchTerm] = useState("");

  // Event handler for input change, updating the search term in the state
  const handleChange = ({ target }) => setSearchTerm(target.value);

  // Event handler for form submission, preventing default form behavior
  const handleSubmit = (event) => {
    event.preventDefault();
    // Invoke the 'onSearch' callback with the current search term
    onSearch(searchTerm);
  };

  // JSX rendering for the SearchBar component
  return (
    <>
      {/* Form element with an onSubmit handler */}
      <form onSubmit={handleSubmit}>
        {/* Input element controlled by 'searchTerm' state */}
        <input type="text" value={searchTerm} onChange={handleChange} />
        {/* Submit button for triggering the search */}
        <Button
          className={searchStyles.searchSong}
          variant="contained"
          type="submit"
        >
          Search
        </Button>
      </form>
    </>
  );
}

// Export the SearchBar component as the default export
export default SearchBar;
