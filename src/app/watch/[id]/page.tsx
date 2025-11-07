"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Image from "next/image";

const CHAVE_API_TMDB = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const CHAVE_API_OMDB = process.env.NEXT_PUBLIC_OMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const BASE_URL_IMAGEM = "https://image.tmdb.org/t/p/original";
const URL_IMAGEM_POSTER = "https://image.tmdb.org/t/p/w500";
const IMAGEM_PLACEHOLDER = "https://placehold.co/300x450/18181b/ffffff?text=Sem+Poster";

async function buscarDetalhesMidia(id: string) {
  try {
    let response;
    let tipoDeMidia = 'movie';
    try {
      response = await axios.get(`${BASE_URL}/movie/${id}`.trim(), {
        params: { api_key: CHAVE_API_TMDB, language: "pt-BR", append_to_response: 'external_ids' },
      });
    } catch (error) {
      response = await axios.get(`${BASE_URL}/tv/${id}`.trim(), {
        params: { api_key: CHAVE_API_TMDB, language: "pt-BR", append_to_response: 'external_ids' },
      });
      tipoDeMidia = 'series';
    }

    const item = response.data;
    return {
      imdbID: item.external_ids.imdb_id,
      Title: item.title || item.name,
      Year: (item.release_date || item.first_air_date || "").substring(0, 4),
      Plot: item.overview,
      Poster: item.poster_path ? `${URL_IMAGEM_POSTER}${item.poster_path}` : IMAGEM_PLACEHOLDER,
      Backdrop: item.backdrop_path ? `${BASE_URL_IMAGEM}${item.backdrop_path}` : null,
      Runtime: item.runtime ? `${item.runtime} min` : (item.episode_run_time && item.episode_run_time.length > 0 ? `${item.episode_run_time[0]} min` : 'N/A'),
      Genre: item.genres.map((g: any) => g.name).join(', '),
      imdbRating: item.vote_average ? item.vote_average.toFixed(1) : 'N/A',
      Type: tipoDeMidia,
      totalSeasons: item.number_of_seasons,
    };
  } catch (error) {
    console.error("Erro ao buscar detalhes:", error);
    return null;
  }
}

async function buscarEpisodiosTemporada(id: string, season: number) {
  try {
    const response = await axios.get("https://www.omdbapi.com/", {
      params: { apikey: CHAVE_API_OMDB, i: id, Season: season },
    });
    return response.data.Episodes;
  } catch (error) {
    console.error(`Erro ao buscar episódios da temporada ${season}:`, error);
    return [];
  }
}

export default function PaginaAssistir() {
  const parametros = useParams();
  const id = parametros.id as string;
  const [midia, definirMidia] = useState<any>(null);
  const [idImdb, definirIdImdb] = useState<string | null>(null);
  const [carregando, definirCarregando] = useState(true);
  const [temporadaSelecionada, definirTemporadaSelecionada] = useState<number | null>(null);
  const [episodios, definirEpisodios] = useState<any[]>([]);

  useEffect(() => {
    if (id) {
      async function carregarMidia() {
        definirCarregando(true);
        const detalhes = await buscarDetalhesMidia(id);
        definirMidia(detalhes);
        if (detalhes && detalhes.imdbID) {
          definirIdImdb(detalhes.imdbID);
        }
        definirCarregando(false);
        if (detalhes && detalhes.Type === "series") {
          definirTemporadaSelecionada(1);
        }
      }
      carregarMidia();
    }
  }, [id]);

  useEffect(() => {
    if (temporadaSelecionada !== null && idImdb) {
      async function carregarEpisodios() {
        if (temporadaSelecionada !== null) {
          const episodiosDaTemporada = await buscarEpisodiosTemporada(idImdb!, temporadaSelecionada);
          definirEpisodios(episodiosDaTemporada);
        }
      }
      carregarEpisodios();
    }
  }, [temporadaSelecionada, idImdb]);

  function abrirPlayer(tipoDeMidia: string, idDaMidia: string, temporada?: number, episodio?: number) {
    let urlPlayer = '';
    if (tipoDeMidia === 'movie') {
      urlPlayer = `https://playerflixapi.com/filme/${idDaMidia}`;
    } else {
      if (temporada !== undefined && episodio !== undefined) {
        urlPlayer = `https://playerflixapi.com/serie/${idDaMidia}/${temporada}/${episodio}`;
      } else {
        console.error("Temporada ou episódio indefinido para série.");
        return;
      }
    }

    const w = 1000;
    const h = 700;
    const left = window.screenX + (window.innerWidth - w) / 2;
    const top = window.screenY + (window.innerHeight - h) / 2;

    const novaJanela = window.open(
      "",
      `_blank`,
      `toolbar=0,location=0,status=0,menubar=0,scrollbars=0,resizable=1,width=${w},height=${h},top=${top},left=${left}`
    );

    if (!novaJanela) {
      alert("Pop-up bloqueado. Permita pop-ups para este site e tente novamente.");
      return;
    }

    const html = `<!doctype html>
      <html lang="pt-BR">
      <head>
        <meta charset="utf-8" />
        <title>Player</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>html,body{height:100%;margin:0;background:#000}iframe{width:100%;height:100%;border:0}</style>
      </head>
      <body>
        <iframe src="${urlPlayer}" frameborder="0" allowfullscreen allow="fullscreen"></iframe>
      </body>
      </html>`;

    novaJanela.document.open();
    novaJanela.document.write(html);
    novaJanela.document.close();
    novaJanela.focus();
  }

  if (carregando) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (!midia) {
    return (
      <div className="flex justify-center items-center h-screen bg-black text-white">
        <p className="text-2xl">Não foi possível carregar o conteúdo.</p>
      </div>
    );
  }

  const contagemTemporadas = midia.totalSeasons ? parseInt(midia.totalSeasons, 10) : 0;

  return (
    <div className="min-h-screen bg-black font-sans text-white">
      <div
        className="relative h-[600px] -mx-8 -mt-8"
        style={{
          backgroundImage: `url(${midia.Backdrop})`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black"></div>
        <div className="absolute bottom-0 left-0 p-8">
          <h1 className="text-5xl font-bold mb-4">{midia.Title}</h1>
          <div className="flex items-center gap-4 text-zinc-300 mb-4">
            <span className="flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-yellow-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.539 1.118l-3.368-2.448a1 1 0 00-1.175 0l-3.368 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.34 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z" />
              </svg>
              {midia.imdbRating}
            </span>
            <span>{midia.Year}</span>
            <span>{midia.Runtime}</span>
          </div>
          <p className="text-lg max-w-3xl mb-8">{midia.Plot}</p>
          {midia.Type === "movie" && (
            <button
              onClick={() => abrirPlayer('movie', id)}
              className="bg-white text-black px-8 py-3 font-bold rounded-lg hover:bg-gray-200 transition-colors"
            >
              Assistir
            </button>
          )}
        </div>
      </div>

      <div className="p-8">
        <p className="text-zinc-400 mb-8">
          <span className="font-bold text-white">Gênero:</span> {midia.Genre}
        </p>

        {midia.Type === "series" && contagemTemporadas > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4">Temporadas</h2>
            <div className="flex flex-wrap gap-2 mb-8">
              {Array.from({ length: contagemTemporadas }, (_, i) => i + 1).map(
                (temporada) => (
                  <button
                    key={temporada}
                    onClick={() => definirTemporadaSelecionada(temporada)}
                    className={`px-4 py-2 rounded-full transition-colors duration-300 ${
                      temporadaSelecionada === temporada
                        ? "bg-yellow-500 text-black"
                        : "bg-zinc-800 hover:bg-zinc-700"
                    }`}
                  >
                    Temporada {temporada}
                  </button>
                )
              )}
            </div>

            {episodios.length > 0 && (
              <div>
                <h3 className="text-xl font-bold mb-4">
                  Episódios - Temporada {temporadaSelecionada}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {episodios.map((episodio) => (
                    <button
                      key={episodio.imdbID}
                      onClick={() => abrirPlayer(
                        'series',
                        id,
                        temporadaSelecionada !== null ? temporadaSelecionada : undefined,
                        parseInt(episodio.Episode, 10)
                      )}
                      className="bg-zinc-800 p-4 rounded-lg text-left hover:bg-zinc-700 transition-colors duration-300"
                    >
                      <h4 className="font-bold">{episodio.Title}</h4>
                      <p className="text-sm text-zinc-400">
                        Episódio {episodio.Episode}
                      </p>
                      <p className="text-sm text-zinc-400">
                        Avaliação: {episodio.imdbRating}
                      </p>
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
