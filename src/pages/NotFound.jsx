import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] grid place-items-center px-4">
      <div className="text-center">
        <div className="text-7xl font-bold gradient-text">404</div>
        <h1 className="text-2xl font-bold text-slate-900 mt-4">Page not found</h1>
        <p className="text-slate-500 mt-2 max-w-md mx-auto">The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/" className="btn-primary mt-6 inline-flex text-sm">Go home</Link>
      </div>
    </div>
  );
}
