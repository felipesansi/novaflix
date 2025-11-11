"use client";

import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { useRouter } from "next/navigation";
import { Navigation, Pagination } from "swiper/modules";

const CHAVE_API = process.env.NEXT_PUBLIC_TMDB_API_KEY;

const BASE_URL = "https://api.themoviedb.org/3";

const BASE_URL_IMAGEM = "https://image.tmdb.org/t/p/original";

const URL_IMAGEM_POSTER = "https://image.tmdb.org/t/p/w500";

const IMAGEM_PLACEHOLDER = "https://placehold.co/200x300/18181b/ffffff?text=Sem+Poster";



const mapearTmdbParaFormatoLocal = (item: any, tipoDeMidia: string) => {

  if (!item.id) return null;

  const id = item.id.toString();

  return {

    imdbID: id,

    Title: item.title || item.name || "Título Desconhecido",

    Year: (item.release_date || item.first_air_date || "").substring(0, 4) || "N/A",

    plot: item.overview || "Sinopse não disponível.",

    Poster: item.poster_path

      ? `${URL_IMAGEM_POSTER}${item.poster_path}`

      : IMAGEM_PLACEHOLDER,

    Backdrop: item.backdrop_path ? `${BASE_URL_IMAGEM}${item.backdrop_path}` : null,

    Type: tipoDeMidia,

  };

};



async function buscarEmAlta() {

  try {

    const resposta = await axios.get(`${BASE_URL}/trending/all/week`, {

      params: { api_key: CHAVE_API, language: "pt-BR" },

    });

    return resposta.data.results

      .map((item: any) => mapearTmdbParaFormatoLocal(item, item.media_type))

      .filter((i: any) => i !== null);

  } catch (error) {

    console.error("Erro ao buscar em alta:", error);

    return [];

  }

}



async function buscarFilmesMaisBemAvaliados() {

  try {

    const resposta = await axios.get(`${BASE_URL}/movie/top_rated`, {

      params: { api_key: CHAVE_API, language: "pt-BR" },

    });

    return resposta.data.results

      .map((item: any) => mapearTmdbParaFormatoLocal(item, 'movie'))

      .filter((i: any) => i !== null);

  } catch (error) {

    console.error("Erro ao buscar top rated movies:", error);

    return [];

  }

}



async function buscarFilmesPopulares() {

  try {

    const resposta = await axios.get(`${BASE_URL}/movie/popular`, {

      params: { api_key: CHAVE_API, language: "pt-BR" },

    });

    return resposta.data.results

      .map((item: any) => mapearTmdbParaFormatoLocal(item, 'movie'))

      .filter((i: any) => i !== null);

  } catch (error) {

    console.error("Erro ao buscar popular movies:", error);

    return [];

  }

}



async function buscarSeriesMaisBemAvaliadas() {

  try {

    const resposta = await axios.get(`${BASE_URL}/tv/top_rated`, {

      params: { api_key: CHAVE_API, language: "pt-BR" },

    });

    return resposta.data.results

      .map((item: any) => mapearTmdbParaFormatoLocal(item, 'series'))

      .filter((i: any) => i !== null);

  } catch (error) {

    console.error("Erro ao buscar top rated series:", error);

    return [];

  }

}



async function buscarSeriesPopulares() {

  try {

    const resposta = await axios.get(`${BASE_URL}/tv/popular`, {

      params: { api_key: CHAVE_API, language: "pt-BR" },

    });

    return resposta.data.results

      .map((item: any) => mapearTmdbParaFormatoLocal(item, 'series'))

      .filter((i: any) => i !== null);

  } catch (error) {

    console.error("Erro ao buscar popular series:", error);

    return [];

  }

}



async function buscarMidia(termo: string) {

  try {

    const response = await axios.get(`${BASE_URL}/search/multi`, {

      params: { api_key: CHAVE_API, language: "pt-BR", query: termo },

    });



    return response.data.results

      .filter((item: any) => item.media_type !== "person" && item.poster_path)

      .map((item: any) => mapearTmdbParaFormatoLocal(item, item.media_type))

      .filter((i: any) => i !== null);

  } catch (error) {

    console.error("Erro ao buscar:", error);

    return [];

  }

}

const BannerPrincipal = ({ item, aoAssistir }: { item: any, aoAssistir: (id: string) => void }) => {
  if (!item) return null;

  const roteador = useRouter();

  return (
    <div
      className="relative h-[550px] mb-8"
      style={{
        backgroundImage: `url(${item.Backdrop})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black"></div>
      <div className="absolute bottom-0 left-0 p-8 text-white">
        <h1 className="text-5xl font-bold mb-4">{item.Title}</h1>
        <p className="text-lg max-w-2xl mb-4">
          {item.plot.length > 150 ? `${item.plot.substring(0, 147)}...` : item.plot}
        </p>
        <button
          onClick={() => aoAssistir(item.imdbID)}
          className="bg-yellow-400 text-black px-8 py-3 font-bold rounded-lg hover:bg-yellow-500 transition-colors"
        >
          Assistir
        </button>
      </div>
    </div>
  );
};

const LinhaDeMidia = ({ title, media, aoClicarNoCartao }: { title: string, media: any[], aoClicarNoCartao: (id: string) => void }) => (
  <div className="mb-8">
    <h2 className="text-2xl font-bold mb-4 text-white">{title}</h2>
    <Swiper
      modules={[Navigation, Pagination]}
      navigation
      spaceBetween={15}
      slidesPerView={5}
      breakpoints={{
        320: { slidesPerView: 2 },
        640: { slidesPerView: 4 },
        1024: { slidesPerView: 6 },
      }}
    >
      {media.map((item) => (
        <SwiperSlide key={item.imdbID}>
          <div
            className="relative overflow-hidden rounded-lg shadow-lg cursor-pointer group h-full"
            onClick={() => aoClicarNoCartao(item.imdbID)}
          >
            <img
              src={item.Poster}
              alt={item.Title}
              className="object-cover w-full h-full"
              onError={(e) =>
                ((e.target as HTMLImageElement).src = IMAGEM_PLACEHOLDER)
              }
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-80 flex flex-col justify-end p-2 transition-all">
              <h3 className="text-sm font-bold truncate text-white">{item.Title}</h3>
              <p className="text-xs text-white">
                {item.Year} ({item.Type === "series" ? "Série" : "Filme"})
              </p>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  </div>
);

const Footer = () => (
  <footer className="text-center p-4 mt-8 text-zinc-500 text-sm">
    <p>Este site é um projeto de estudos e não possui fins lucrativos. Todos os dados e imagens são fornecidos pela API do The Movie Database (TMDb) e do OMDb.</p>
    <p>O desenvolvedor não se responsabiliza pelo uso indevido do conteúdo aqui apresentado.</p>
  </footer>
);

export default function Pagina() {
  const [emAlta, definirEmAlta] = useState<any[]>([]);
  const [filmesMaisBemAvaliados, definirFilmesMaisBemAvaliados] = useState<any[]>([]);
  const [filmesPopulares, definirFilmesPopulares] = useState<any[]>([]);
  const [seriesMaisBemAvaliadas, definirSeriesMaisBemAvaliadas] = useState<any[]>([]);
  const [seriesPopulares, definirSeriesPopulares] = useState<any[]>([]);
  const [resultadosBusca, definirResultadosBusca] = useState<any[]>([]);
  const [termoBusca, definirTermoBusca] = useState("");
  const [buscando, definirBuscando] = useState(false);
  const [carregando, definirCarregando] = useState(true);
  const roteador = useRouter();
  const referenciaTimeout = useRef<any>(null);

  useEffect(() => {
    async function carregar() {
      const [
        emAltaRes,
        filmesMaisBemAvaliadosRes,
        filmesPopularesRes,
        seriesMaisBemAvaliadasRes,
        seriesPopularesRes,
      ] = await Promise.all([
        buscarEmAlta(),
        buscarFilmesMaisBemAvaliados(),
        buscarFilmesPopulares(),
        buscarSeriesMaisBemAvaliadas(),
        buscarSeriesPopulares(),
      ]);

      definirEmAlta(emAltaRes);
      definirFilmesMaisBemAvaliados(filmesMaisBemAvaliadosRes);
      definirFilmesPopulares(filmesPopularesRes);
      definirSeriesMaisBemAvaliadas(seriesMaisBemAvaliadasRes);
      definirSeriesPopulares(seriesPopularesRes);
      definirCarregando(false);
    }
    if (!buscando) {
      carregar();
    }
  }, [buscando]);

  function verDetalhes(id: string) {
    roteador.push(`/watch/${id}`);
  }

  async function lidarComMudancaBusca(evento: React.ChangeEvent<HTMLInputElement>) {
    const termo = evento.target.value;
    definirTermoBusca(termo);

    if (referenciaTimeout.current) {
      clearTimeout(referenciaTimeout.current);
    }

    if (termo.length > 2) {
      definirBuscando(true);
      definirCarregando(true);
      referenciaTimeout.current = setTimeout(async () => {
        const resultados = await buscarMidia(termo);
        definirResultadosBusca(resultados);
        definirCarregando(false);
      }, 500);
    } else {
      definirBuscando(false);
      definirResultadosBusca([]);
    }
  }

  const itemPrincipal = emAlta.length > 0 ? emAlta[0] : null;

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="p-8">
        <input
          type="text"
          placeholder="Pesquisar..."
          className="w-full p-4 mb-8 rounded-lg bg-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          onChange={lidarComMudancaBusca}
          value={termoBusca}
        />

        {carregando && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-yellow-500"></div>
          </div>
        )}

        {buscando && !carregando && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {resultadosBusca.map((item) => (
              <div
                key={item.imdbID}
                className="relative overflow-hidden rounded-lg shadow-lg cursor-pointer group h-full"
                onClick={() => verDetalhes(item.imdbID)}
              >
                <img
                  src={item.Poster}
                  alt={item.Title}
                  className="object-cover w-full h-full"
                  onError={(e) =>
                    ((e.target as HTMLImageElement).src = IMAGEM_PLACEHOLDER)
                  }
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex flex-col justify-end p-2 transition-all">
                  <h3 className="text-sm font-bold truncate">{item.Title}</h3>
                  <p className="text-xs text-yellow-400">
                    {item.Year} ({item.Type === "series" ? "Série" : "Filme"})
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {!buscando && !carregando && (
          <>
            <BannerPrincipal item={itemPrincipal} aoAssistir={verDetalhes} />
            <LinhaDeMidia title="Em Alta" media={emAlta} aoClicarNoCartao={verDetalhes} />
            <LinhaDeMidia title="Filmes Populares" media={filmesPopulares} aoClicarNoCartao={verDetalhes} />
            <LinhaDeMidia title="Filmes Mais Bem Avaliados" media={filmesMaisBemAvaliados} aoClicarNoCartao={verDetalhes} />
            <LinhaDeMidia title="Séries Populares" media={seriesPopulares} aoClicarNoCartao={verDetalhes} />
            <LinhaDeMidia title="Séries Mais Bem Avaliadas" media={seriesMaisBemAvaliadas} aoClicarNoCartao={verDetalhes} />
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}
