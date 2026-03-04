import { useState } from "react";

export function useMovieSearch() {
  const [imdbID, setImdbID] = useState("");

  function handleChange(id: string) {
    setImdbID(id);
  }

  return {
    imdbID,
    handleChange,
  };
}