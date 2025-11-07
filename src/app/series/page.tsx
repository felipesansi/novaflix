"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Image from "next/image";

const API_KEY = "593491a8";

async function getMediaDetails(id: string) {
  try {
    const response = await axios.get("https://www.omdbapi.com/", {
      params: { apikey: API_KEY, i: id },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar detalhes:", error);
    return null;
  }
}

async function getSeasonEpisodes(id: string, season: number | null) {
  if (season === null) {
    return [];
  }
  try {
    const response = await axios.get("https://www.omdbapi.com/", {
      params: { apikey: API_KEY, i: id, Season: season },
    });
    return response.data.Episodes;
  } catch (error) {
    console.error(`Erro ao buscar episódios da temporada ${season}:`, error);
    return [];
  }
}

export default function SeriePage() {
  const params = useParams();
  const id = params.id as string;
  const [media, setMedia] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState<number | null>(null);
  const [episodes, setEpisodes] = useState<any[]>([]);

  useEffect(() => {
    if (id) {
      async function loadMedia() {
        setLoading(true);
        const details = await getMediaDetails(id);
        setMedia(details);
        setLoading(false);
        if (details && details.Type === "series") {
          setSelectedSeason(1);
        }
      }
      loadMedia();
    }
  }, [id]);

  useEffect(() => {
    if (selectedSeason !== null && id) {
      async function loadEpisodes() {
        const seasonEpisodes = await getSeasonEpisodes(id, selectedSeason);
        setEpisodes(seasonEpisodes);
      }
      loadEpisodes();
    }
  }, [selectedSeason, id]);

  function openPlayer(episode?: any) {
    let playerUrl = "";
    let episodeTitle = "";

    if (media.Type === "series" && episode) {
      playerUrl = `https://playerflixapi.com/serie/${id}/${selectedSeason}/${episode.Episode}`;
      episodeTitle = episode.Title;
    } else if (media.Type === "movie") {
      playerUrl = `https://playerflixapi.com/filme/${id}`;
      episodeTitle = media.Title;
    } else {
      return;
    }

    const w = 1000;
    const h = 700;
    const left = window.screenX + (window.innerWidth - w) / 2;
    const top = window.screenY + (window.innerHeight - h) / 2;

    const newWin = window.open(
      "",
      `_blank`,
      `toolbar=0,location=0,status=0,menubar=0,scrollbars=0,resizable=1,width=${w},height=${h},top=${top},left=${left}`
    );

    if (!newWin) {
      alert("Pop-up bloqueado. Permita pop-ups para este site e tente novamente.");
      return;
    }

    const html = `<!doctype html>
      <html lang="pt-BR">
      <head>
        <meta charset="utf-8" />
        <title>Player - ${episodeTitle}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>html,body{height:100%;margin:0;background:#000}iframe{width:100%;height:100%;border:0}</style>
      </head>
      <body>
        <iframe src="${playerUrl}" frameborder="0" allowfullscreen allow="fullscreen"></iframe>
      </body>
      </html>`;

    newWin.document.open();
    newWin.document.write(html);
    newWin.document.close();
    newWin.focus();
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (!media) {
    return (
      <div className="flex justify-center items-center h-screen bg-black text-white">
        <p className="text-2xl">Não foi possível carregar o conteúdo.</p>
      </div>
    );
  }

  const seasonCount = media.totalSeasons ? parseInt(media.totalSeasons, 10) : 0;

  return (
    <div className="min-h-screen bg-black font-sans text-white p-8">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3">
            {media.Poster && media.Poster !== "N/A" ? (
              <Image
                src={media.Poster}
                alt={media.Title}
                width={300}
                height={450}
                className="rounded-lg"
              />
            ) : (
              <div className="w-[300px] h-[450px] bg-zinc-800 flex items-center justify-center rounded-lg">
                <span className="text-zinc-500">Sem Imagem</span>
              </div>
            )}
          </div>
          <div className="md:w-2/3">
            <h1 className="text-4xl font-bold mb-4">{media.Title}</h1>
            <p className="text-zinc-400 mb-4">{media.Plot}</p>
            <div className="flex gap-4 text-zinc-300 mb-8">
              <span>{media.Year}</span>
              <span>{media.Runtime}</span>
              <span>{media.Genre}</span>
              <span className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.539 1.118l-3.368-2.448a1 1 0 00-1.175 0l-3.368 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.34 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z" />
                </svg>
                {media.imdbRating}
              </span>
            </div>
            {media.Type === "movie" && (
              <button
                onClick={() => openPlayer()}
                className="bg-yellow-500 text-black font-bold py-3 px-6 rounded-lg hover:bg-yellow-600 transition-colors duration-300"
              >
                Assistir
              </button>
            )}
          </div>
        </div>

        {media.Type === "series" && seasonCount > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4">Temporadas</h2>
            <div className="flex flex-wrap gap-2 mb-8">
              {Array.from({ length: seasonCount }, (_, i) => i + 1).map(
                (season) => (
                  <button
                    key={season}
                    onClick={() => setSelectedSeason(season)}
                    className={`px-4 py-2 rounded-full transition-colors duration-300 ${
                      selectedSeason === season
                        ? "bg-yellow-500 text-black"
                        : "bg-zinc-800 hover:bg-zinc-700"
                    }`}
                  >
                    Temporada {season}
                  </button>
                )
              )}
            </div>

            {episodes.length > 0 && (
              <div>
                <h3 className="text-xl font-bold mb-4">
                  Episódios - Temporada {selectedSeason}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {episodes.map((episode) => (
                    <button
                      key={episode.imdbID}
                      onClick={() => openPlayer(episode)}
                      className="bg-zinc-800 p-4 rounded-lg text-left hover:bg-zinc-700 transition-colors duration-300"
                    >
                      <h4 className="font-bold">{episode.Title}</h4>
                      <p className="text-sm text-zinc-400">Episódio {episode.Episode}</p>
                      <p className="text-sm text-zinc-400">Avaliação: {episode.imdbRating}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}