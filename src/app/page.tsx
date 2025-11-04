"use client";

import Image from "next/image";
import axios from "axios";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

const API_KEY = "593491a8"; // OMDb

async function buscarFilmesRecentes() {
  const anoAtual = new Date().getFullYear();
  const filmesTotais: any[] = [];

  try {
    for (let pagina = 1; pagina <= 5; pagina++) {
      const response = await axios.get("https://www.omdbapi.com/", {
        params: {
          apikey: API_KEY,
          y: anoAtual,
          s: "a",
          page: pagina,
        },
      });

      if (response.data.Response === "True") {
        filmesTotais.push(...response.data.Search);
      }
    }
  } catch (error) {
    console.error("Erro ao buscar filmes do ano:", error);
  }

  return filmesTotais.slice(0, 60);
}

async function buscarFilmes(termo: string) {
  try {
    const response = await axios.get("https://www.omdbapi.com/", {
      params: { apikey: API_KEY, s: termo },
    });

    return response.data.Response === "True" ? response.data.Search : [];
  } catch (error) {
    console.error("Erro ao buscar:", error);
    return [];
  }
}

export default function Home() {
  const [filmes, setFilmes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const timeoutRef = useRef<any>(null);
  const router = useRouter();

  useEffect(() => {
    async function carregar() {
      setLoading(true);
      const res = await buscarFilmesRecentes();
      setFilmes(res);
      setLoading(false);
    }
    carregar();
  }, []);

  async function handleBuscar(e: React.ChangeEvent<HTMLInputElement>) {
    const termo = e.target.value;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setLoading(true);

    timeoutRef.current = setTimeout(async () => {
      if (termo.length > 2) {
        const resultado = await buscarFilmes(termo);
        setFilmes(resultado);
      } else if (termo.length === 0) {
        const res = await buscarFilmesRecentes();
        setFilmes(res);
      }
      setLoading(false);
    }, 600);
  }

  function assistirMidia(id: string, tipo: string) {
    // Se for series (OMDb retorna "series"), navegamos para a página que lista temporadas.
    if (tipo === "series") {
      router.push(`/watch/${id}`);
      return;
    }

    // Se for filme, abrir player diretamente (novo tab com iframe)
    const playerUrl = `https://playerflixapi.com/filme/${id}`;
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
        <title>Player - ${id}</title>
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

  return (
    <div className="min-h-screen bg-black font-sans text-white">
      <main className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-yellow-500 tracking-wider">Nova Flix</h1>
          <p className="mt-3 text-lg text-zinc-400">Explore um universo de filmes e séries.</p>
        </header>

        <div className="flex justify-center mb-12">
          <input
            type="text"
            placeholder="Buscar por título..."
            className="w-full max-w-2xl p-4 bg-zinc-800 text-white border-2 border-zinc-700 rounded-full focus:outline-none focus:border-yellow-500 transition-colors duration-300"
            onChange={handleBuscar}
          />
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-yellow-500" />
          </div>
        ) : filmes.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {filmes.map((filme) => (
              <div key={filme.imdbID} className="group relative overflow-hidden rounded-lg shadow-lg transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl cursor-pointer">
                <Image
                  src={filme.Poster && filme.Poster !== "N/A" ? filme.Poster : "/no-image.jpg"}
                  alt={filme.Title}
                  width={200}
                  height={300}
                  className="object-cover w-full h-full"
                />

                <div className="absolute bottom-0 left-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black w-full">
                  <h3 className="text-md font-bold">{filme.Title}</h3>
                  <p className="text-sm text-yellow-400">{filme.Year}</p>

                  <button
                    className="mt-2 px-4 py-2 bg-yellow-500 text-black rounded-full hover:bg-yellow-400 transition-colors duration-300"
                    onClick={() => assistirMidia(filme.imdbID, filme.Type)}
                  >
                    Assistir
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-zinc-500 mt-20">
            <p className="text-2xl">Nenhum resultado encontrado.</p>
          </div>
        )}
      </main>
    </div>
  );
}
