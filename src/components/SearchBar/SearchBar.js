import { React, useState } from "react";
import "./SearchBar.css";

const SearchBar = ({ searchTodo }) => {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    searchTodo(text);
  };

  return (
    <div>
      <input
        className="searchBar"
        type="text"
        placeholder="Search for task"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
        }}
      ></input>
      <button className="searchButton" onClick={handleSubmit}>
        Search
      </button>
    </div>
  );
};

export default SearchBar;
