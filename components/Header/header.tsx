

import Link from "next/link";

export default function Header() {
    return (
        <header className="w-full py-4 border-b border-gray-200 flex items-center justify-between px-6">
            <h1 className="text-2xl font-bold">Nova <span className="text-yellow-600">Flix</span></h1>
            <nav>
                <ul className="flex space-x-4">
                    <li>
                        <Link href="/" className="text-3xl text-yellow-600 hover:text-gray-900">
                            início
                        </Link>
                    </li>
                    <li>
                        <Link href="/sobre" className="text-3xl text-yellow-600 hover:text-gray-900">
                            Sobre
                        </Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
}