

export default function Sobre() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold mb-4">Sobre este Projeto</h1>
        <p className="text-lg mb-4">
          Este site foi desenvolvido como um projeto de estudos para demonstrar o uso de tecnologias como Next.js, React, TypeScript, e Tailwind CSS, consumindo as APIs do The Movie Database (TMDb) e do OMDb.
        </p>
        <h2 className="text-2xl font-bold mt-8 mb-4">Aviso Legal</h2>
        <p className="text-lg">
          Este site é um projeto de estudos e não possui fins lucrativos. Todos os dados e imagens são fornecidos pelas APIs do The Movie Database (TMDb) e do OMDb.
        </p>
        <p className="text-lg mt-4">
          O desenvolvedor não se responsabiliza pelo uso indevido do conteúdo aqui apresentado.
        </p>
      </div>
    </div>
  );
}
