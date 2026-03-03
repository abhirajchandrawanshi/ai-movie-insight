import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const imdbID = searchParams.get("id");

  if (!imdbID) {
    return NextResponse.json(
      { error: "No IMDb ID provided" },
      { status: 400 }
    );
  }

  try {
    // 🚀 Parallel fetch OMDb + TMDb Find
    const [movieRes, tmdbFindRes] = await Promise.all([
      fetch(
        `https://www.omdbapi.com/?i=${imdbID}&apikey=${process.env.OMDB_API_KEY}`,
        { next: { revalidate: 3600 } }
      ),
      fetch(
        `https://api.themoviedb.org/3/find/${imdbID}?api_key=${process.env.TMDB_API_KEY}&external_source=imdb_id`,
        { next: { revalidate: 3600 } }
      )
    ]);

    const movieData = await movieRes.json();
    const tmdbFindData = await tmdbFindRes.json();

    if (movieData.Response === "False") {
      return NextResponse.json(
        { error: "Movie not found" },
        { status: 404 }
      );
    }

    const tmdbID = tmdbFindData.movie_results?.[0]?.id ?? null;

    return NextResponse.json({
      title: movieData.Title,
      poster: movieData.Poster,
      year: movieData.Year,
      rating: movieData.imdbRating,
      plot: movieData.Plot,
      cast: movieData.Actors,
      tmdbID,
    });

  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch movie metadata" },
      { status: 500 }
    );
  }
}