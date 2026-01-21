import { Link } from 'react-router-dom'
import { Home, ArrowLeft, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center pt-20 pb-12 px-4">
      <div className="text-center max-w-lg">
        {/* 404 Illustration */}
        <div className="relative mb-8">
          <div className="text-[150px] md:text-[200px] font-bold gradient-text opacity-20 leading-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full gradient-bg flex items-center justify-center animate-float">
              <Search size={48} className="text-white" />
            </div>
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mb-4">Page Not Found</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/" className="btn-primary px-6 py-3 gap-2">
            <Home size={18} />
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="btn-secondary px-6 py-3 gap-2"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground mb-4">
            Looking for something specific? Try these:
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/features" className="text-primary hover:underline">Features</Link>
            <span className="text-border">•</span>
            <Link to="/pricing" className="text-primary hover:underline">Pricing</Link>
            <span className="text-border">•</span>
            <Link to="/chat" className="text-primary hover:underline">Chat Demo</Link>
            <span className="text-border">•</span>
            <Link to="/auth" className="text-primary hover:underline">Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
