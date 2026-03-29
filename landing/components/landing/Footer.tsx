export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Logo + copyright */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-sm" style={{ color: "#1a3a5c" }}>
            ReviewPilot
          </span>
          <span className="text-sm" aria-hidden="true">⭐</span>
          <span className="text-gray-400 text-sm">© 2024</span>
        </div>

        {/* Links */}
        <nav aria-label="Footer navigation">
          <ul className="flex items-center gap-6 list-none">
            <li>
              <a
                href="#"
                className="text-sm text-gray-400 hover:text-gray-600 transition-colors duration-150 font-medium"
              >
                Privacy Policy
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-sm text-gray-400 hover:text-gray-600 transition-colors duration-150 font-medium"
              >
                Terms of Service
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
