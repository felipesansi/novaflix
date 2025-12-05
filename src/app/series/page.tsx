"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";

const CHAVE_API_TMDB = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const URL_IMAGEM_POSTER = "https://image.tmdb.org/t/p/w500";
const IMAGEM_PLACEHOLDER = "https://placehold.co/300x450/18181b/ffffff?text=Sem+Poster";

interface Serie {
  id: number;
  name: string;
  first_air_date: string;
  overview: string;
  poster_path: string | null;
  vote_average: number;
}

async function buscarSeriesPopulares(): Promise<Serie[]> {
  try {
    const response = await axios.get(`${BASE_URL}/tv/popular`, {
      params: { api_key: CHAVE_API_TMDB, language: "pt-BR" },
    });
    return response.data.results;
  } catch (error) {
    console.error("Erro ao buscar séries populares:", error);
    return [];
  }
}

async function buscarSeriesMaisBemAvaliadas(): Promise<Serie[]> {
  try {
    const response = await axios.get(`${BASE_URL}/tv/top_rated`, {
      params: { api_key: CHAVE_API_TMDB, language: "pt-BR" },
    });
    return response.data.results;
  } catch (error) {
    console.error("Erro ao buscar séries mais bem avaliadas:", error);
    return [];
  }
}

export default function SeriePage() {
  const [seriesPopulares, setSeriesPopulares] = useState<Serie[]>([]);
  const [seriesMaisBemAvaliadas, setSeriesMaisBemAvaliadas] = useState<Serie[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadSeries() {
      setLoading(true);
      const [populares, maisBemAvaliadas] = await Promise.all([
        buscarSeriesPopulares(),
        buscarSeriesMaisBemAvaliadas(),
      ]);
      setSeriesPopulares(populares);
      setSeriesMaisBemAvaliadas(maisBemAvaliadas);
      setLoading(false);
    }
    loadSeries();
  }, []);

  function verDetalhes(id: number) {
    router.push(`/watch/${id}`);
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black font-sans text-white p-8">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold mb-8">Séries</h1>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Séries Populares</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {seriesPopulares.map((serie) => (
              <div
                key={serie.id}
                className="relative overflow-hidden rounded-lg shadow-lg cursor-pointer group"
                onClick={() => verDetalhes(serie.id)}
              >
                {serie.poster_path ? (
                  <Image
                    src={`${URL_IMAGEM_POSTER}${serie.poster_path}`}
                    alt={serie.name}
                    width={300}
                    height={450}
                    className="rounded-lg w-full h-auto"
                  />
                ) : (
                  <div className="w-full h-[450px] bg-zinc-800 flex items-center justify-center rounded-lg">
                    <span className="text-zinc-500">Sem Imagem</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex flex-col justify-end p-4 transition-all">
                  <h3 className="text-sm font-bold truncate">{serie.name}</h3>
                  <p className="text-xs text-zinc-300">
                    {serie.first_air_date?.substring(0, 4) || "N/A"}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-yellow-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.539 1.118l-3.368-2.448a1 1 0 00-1.175 0l-3.368 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.34 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z" />
                    </svg>
                    <span className="text-xs">{serie.vote_average.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Séries Mais Bem Avaliadas</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {seriesMaisBemAvaliadas.map((serie) => (
              <div
                key={serie.id}
                className="relative overflow-hidden rounded-lg shadow-lg cursor-pointer group"
                onClick={() => verDetalhes(serie.id)}
              >
                {serie.poster_path ? (
                  <Image
                    src={`${URL_IMAGEM_POSTER}${serie.poster_path}`}
                    alt={serie.name}
                    width={300}
                    height={450}
                    className="rounded-lg w-full h-auto"
                  />
                ) : (
                  <div className="w-full h-[450px] bg-zinc-800 flex items-center justify-center rounded-lg">
                    <span className="text-zinc-500">Sem Imagem</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex flex-col justify-end p-4 transition-all">
                  <h3 className="text-sm font-bold truncate">{serie.name}</h3>
                  <p className="text-xs text-zinc-300">
                    {serie.first_air_date?.substring(0, 4) || "N/A"}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-yellow-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.539 1.118l-3.368-2.448a1 1 0 00-1.175 0l-3.368 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.34 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z" />
                    </svg>
                    <span className="text-xs">{serie.vote_average.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}