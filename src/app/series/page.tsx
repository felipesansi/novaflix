"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const TMDB_API_KEY = "593491a8";

export default function SeriePage() {
  const { id } = useParams();
  const [seriesInfo, setSeriesInfo] = useState<any>(null);

  useEffect(() => {
    async function loadSeries() {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/tv/${id}?api_key=${TMDB_API_KEY}&language=pt-BR`
        );
        const data = await res.json();
        setSeriesInfo(data);
      } catch (err) {
        console.error("Erro ao carregar série ➜", err);
      }
    }
    if (id) loadSeries();
  }, [id]);

  function assistirEpisodio(season: number, episode: number) {
    const url = `https://playerflixapi.com/serie/${id}/${season}/${episode}`;
    window.open(url, "_blank", "width=1000,height=700,toolbar=0,location=0");
  }

  if (!seriesInfo)
    return (
      <div className="text-white text-center mt-20">
        Carregando episódios...
      </div>
    );

  return (
    <div className="p-6 bg-black min-h-screen text-white">
      <h1 className="text-4xl font-bold text-yellow-500 mb-4">
        {seriesInfo.name}
      </h1>

      {seriesInfo.seasons.map((season: any) => (
        <div key={season.id} className="mb-8">
          <h2 className="text-2xl text-yellow-400 font-bold mb-3">
            Temporada {season.season_number}
          </h2>
          <div className="grid grid-cols-4 gap-3">
            {Array.from({ length: season.episode_count }).map((_, idx) => (
              <button
                key={idx}
                className="bg-zinc-700 hover:bg-yellow-500 hover:text-black py-2 px-3 rounded-lg"
                onClick={() =>
                  assistirEpisodio(season.season_number, idx + 1)
                }
              >
                Episódio {idx + 1}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
