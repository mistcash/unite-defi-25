import Link from "next/link";

export default function Custom404() {
	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
			<div className="text-center text-white">
				<h1 className="text-6xl font-bold mb-4">404</h1>
				<p className="text-xl mb-8">Page Not Found</p>
				<Link
					href="/"
					className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
				>
					Go Home
				</Link>
			</div>
		</div>
	)
}
