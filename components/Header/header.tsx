import Link from "next/link";

export default function Header() {
    return (
        <header className="w-full py-4 bg-black border-b border-zinc-800 flex items-center justify-between px-6">
            <h1 className="text-2xl font-bold text-white">Nova <span className="text-yellow-500">Flix</span></h1>
            <nav>
                <ul className="flex space-x-6">
                    <li>
                        <Link href="/" className="text-base text-zinc-300 hover:text-yellow-500 transition-colors">
                            Início
                        </Link>
                    </li>
                    <li>
                        <Link href="/series" className="text-base text-zinc-300 hover:text-yellow-500 transition-colors">
                            Séries
                        </Link>
                    </li>
                    <li>
                        <Link href="/sobre" className="text-base text-zinc-300 hover:text-yellow-500 transition-colors">
                            Sobre
                        </Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
}
