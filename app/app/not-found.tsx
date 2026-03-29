import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <p className="text-5xl font-bold text-[#1a3a5c] mb-4">404</p>
        <h1 className="text-xl font-semibold text-gray-800 mb-2">Page not found</h1>
        <p className="text-gray-400 text-sm mb-6">
          That review link may have expired or doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="text-[#1a3a5c] font-semibold text-sm hover:underline"
        >
          ← Back to home
        </Link>
      </div>
    </div>
  )
}
