const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export async function fetchFromTMDB(endpoint: string) {
  const apiKey = process.env.TMDB_API_KEY;

  const url = `${TMDB_BASE_URL}${endpoint}${
    endpoint.includes("?") ? "&" : "?"
  }api_key=${apiKey}`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("Failed to fetch from TMDB");
  }

  return res.json();
}