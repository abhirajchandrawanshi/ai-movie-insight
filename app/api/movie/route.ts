import { NextResponse } from "next/server";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";

const apiKey = process.env.TMDB_API_KEY;

if (!apiKey) {
  throw new Error("TMDB_API_KEY is missing in environment variables");
}

async function fetchFromTMDB(endpoint: string, retries = 3) {
  const apiKey = process.env.TMDB_API_KEY;
  const url = `${TMDB_BASE_URL}${endpoint}${endpoint.includes("?") ? "&" : "?"}api_key=${apiKey}`;

  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url);

      if (!res.ok) {
        console.warn("TMDB returned error:", endpoint);
        return null;
      }

      return await res.json();
    } catch (err) {
      console.error(`TMDB fetch failed (attempt ${i + 1})`, endpoint);

      if (i === retries - 1) {
        console.error("Final TMDB failure:", endpoint);
        return null;
      }

      // wait before retry
      await new Promise((r) => setTimeout(r, 500));
    }
  }

  return null;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const imdbID = searchParams.get("id"); // e.g. tt0133093

  if (!imdbID) {
    return NextResponse.json({ error: "Missing IMDb ID" }, { status: 400 });
  }

  try {
    // STEP 2 - Convert IMDb ID to TMDB Movie ID
const findData = await fetchFromTMDB(`/find/${imdbID}?external_source=imdb_id`);

if (!findData) {
  return NextResponse.json(
    { error: "TMDB service temporarily unavailable" },
    { status: 503 }
  );
}

const tmdbID = findData.movie_results?.[0]?.id;

    // Parallel fetch the rest using the TMDB ID
   const results = await Promise.allSettled([
  fetchFromTMDB(`/movie/${tmdbID}`),
  fetchFromTMDB(`/movie/${tmdbID}/credits`),
  fetchFromTMDB(`/movie/${tmdbID}/videos`),
  fetchFromTMDB(`/movie/${tmdbID}/similar`),
]);


const movieDetails =
  results[0].status === "fulfilled" ? results[0].value : null;

const creditsData =
  results[1].status === "fulfilled" ? results[1].value : { cast: [] };

const videosData =
  results[2].status === "fulfilled" ? results[2].value : { results: [] };

const similarData =
  results[3].status === "fulfilled" ? results[3].value : { results: [] };

  if (!movieDetails) {
  return NextResponse.json(
    { error: "Movie details unavailable from TMDB" },
    { status: 500 }
  );
}

    // Data Processing & Mapping
    const movie = {
      title: movieDetails.title,
      overview: movieDetails.overview,
      poster_path: movieDetails.poster_path ? `https://image.tmdb.org/t/p/w500${movieDetails.poster_path}` : null,
      backdrop_path: movieDetails.backdrop_path ? `https://image.tmdb.org/t/p/original${movieDetails.backdrop_path}` : null,
      release_date: movieDetails.release_date,
      vote_average: movieDetails.vote_average,
      genres: movieDetails.genres?.map((g: any) => g.name) || [],
      tmdbID: tmdbID.toString(),
    };

    const cast = (creditsData.cast || [])
      .slice(0, 8)
      .map((actor: any) => ({
        name: actor.name,
        character: actor.character,
        profile_path: actor.profile_path ? `https://image.tmdb.org/t/p/w500${actor.profile_path}` : null,
      }));

const videos = videosData?.results || [];

const trailerObj =
  videos.find((v: any) => v.type === "Trailer" && v.site === "YouTube") ||
  videos.find((v: any) => v.type === "Teaser" && v.site === "YouTube") ||
  videos.find((v: any) => v.type === "Featurette" && v.site === "YouTube") ||
  videos.find((v: any) => v.site === "YouTube");

const trailer = trailerObj?.key || null;

const similarMovies = await Promise.all(
  (similarData.results || [])
    .slice(0, 4)
    .map(async (m: any) => {
      const ext = await fetchFromTMDB(`/movie/${m.id}/external_ids`);

      return {
        imdbID: ext?.imdb_id || null,
        title: m.title,
        posterPath: m.poster_path
          ? `https://image.tmdb.org/t/p/w500${m.poster_path}`
          : null,
        releaseDate: m.release_date || "",
        voteAverage: m.vote_average || 0,
      };
    })
);
    // STEP 7 - Combine Response
    return NextResponse.json({
      movie,
      cast,
      trailer,
      similarMovies,
    });

  } catch (error: any) {
    console.error("Movie API Error:", error);
    return NextResponse.json({ error: "Failed to fetch necessary movie data", details: String(error) }, { status: 500 });
  }
}
