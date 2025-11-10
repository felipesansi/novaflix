# NovaFlix

NovaFlix é uma aplicação web para explorar filmes e séries, utilizando as APIs do The Movie Database (TMDb) e OMDb. O projeto foi desenvolvido com Next.js, React, TypeScript e Tailwind CSS.

## Funcionalidades

- **Página Inicial:** Exibe listas de filmes e séries em alta, populares e mais bem avaliados.
- **Busca:** Permite pesquisar por filmes e séries.
- **Página de Detalhes:** Mostra informações detalhadas sobre um filme ou série, como sinopse, ano, duração, gênero e avaliação.
- **Player de Vídeo:** Abre um player de vídeo externo para assistir ao conteúdo.
- **Layout Responsivo:** A aplicação se adapta a diferentes tamanhos de tela.

## Tecnologias Utilizadas

- **Next.js:** Framework React para renderização do lado do servidor e geração de sites estáticos.
- **React:** Biblioteca para construção de interfaces de usuário.
- **TypeScript:** Superset do JavaScript que adiciona tipagem estática.
- **Tailwind CSS:** Framework CSS utilitário para estilização.
- **Axios:** Cliente HTTP para fazer requisições às APIs.
- **Swiper:** Biblioteca para criar carrosséis de imagens.

## APIs Utilizadas

- **The Movie Database (TMDb):** Fornece dados sobre filmes e séries, como títulos, sinopses, imagens e avaliações.
- **OMDb API:** Utilizada para obter informações adicionais sobre os títulos.

## Como Executar o Projeto

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/novaflix.git
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**
   Crie um arquivo `.env.local` na raiz do projeto e adicione as seguintes chaves de API:
   ```
   NEXT_PUBLIC_TMDB_API_KEY=sua-chave-da-api-do-tmdb
   NEXT_PUBLIC_OMDB_API_KEY=sua-chave-da-api-do-omdb
   ```

4. **Execute o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

5. **Abra o navegador:**
   Acesse `http://localhost:3000` para ver a aplicação.

## Estrutura do Projeto

```
.
├── components
│   └── Header
│       └── header.tsx
├── public
│   ├── ... (arquivos estáticos)
├── src
│   └── app
│       ├── favicon.ico
│       ├── globals.css
│       ├── layout.tsx
│       ├── page.tsx
│       ├── series
│       │   └── page.tsx
│       ├── sobre
│       │   └── page.tsx
│       └── watch
│           └── [id]
│               └── page.tsx
├── .gitignore
├── eslint.config.mjs
├── index.html
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── README.md
└── tsconfig.json
```

- **`src/app`**: Contém as páginas da aplicação, seguindo a nova estrutura de roteamento do Next.js.
  - **`page.tsx`**: Página inicial.
  - **`series/page.tsx`**: Página de séries.
  - **`sobre/page.tsx`**: Página "Sobre".
  - **`watch/[id]/page.tsx`**: Página de detalhes e player de vídeo.
- **`components`**: Contém os componentes React reutilizáveis.
- **`public`**: Contém os arquivos estáticos, como imagens e ícones.
- **`next.config.ts`**: Arquivo de configuração do Next.js.
- **`package.json`**: Lista as dependências e scripts do projeto.

## Aviso Legal

Este site é um projeto de estudos e não possui fins lucrativos. Todos os dados e imagens são fornecidos pelas APIs do The Movie Database (TMDb) e do OMDb. O desenvolvedor não se responsabiliza pelo uso indevido do conteúdo aqui apresentado.