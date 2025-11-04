

export default function Header() {
    return (
        <header className="w-full py-4 border-b border-gray-200 flex items-center justify-between px-6">
            <h1 className="text-2xl font-bold">Nova <span className="text-yellow-600">Flix</span></h1>
            <nav>
                <ul className="flex space-x-4">
                    <li>
                        <a href="/" className="text-gray-700 hover:text-gray-900">
                            início
                        </a>
                    </li>
                    <li>
                        <a href="/about" className="text-gray-700 hover:text-gray-900">
                            Sobre
                        </a>
                    </li>
                </ul>
            </nav>
        </header>
    );
}
''