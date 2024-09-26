
const NotFound = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="text-center">
                <h1 className="text-5xl font-bold text-red-600">404</h1>
                <p className="text-2xl font-medium mt-4">Page Not Found</p>
                <p className="mt-2">The page you are looking for might have been removed or is temporarily unavailable.</p>
                <a href="/home" className="mt-6 inline-block bg-red-600 text-white py-2 px-4 rounded">
                    Go to Home
                </a>
            </div>
        </div>
    );
};

export default NotFound;
