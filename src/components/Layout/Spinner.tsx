export const Spinner = () => {
    return (
        <div className="w-full flex justify-center items-center">
            <div className="relative w-24 h-24 m-auto">
                <span className="ball-1 absolute w-6 h-6 bg-pink-500 rounded-full animate-pulse"></span>
                <span className="ball-2 absolute w-6 h-6 bg-pink-500 rounded-full animate-pulse"></span>
                <span className="ball-3 absolute w-6 h-6 bg-pink-500 rounded-full animate-pulse"></span>
                <span className="ball-4 absolute w-6 h-6 bg-pink-500 rounded-full animate-pulse"></span>
                <span className="ball-5 absolute w-6 h-6 bg-pink-500 rounded-full animate-pulse"></span>
                <span className="ball-6 absolute w-6 h-6 bg-pink-500 rounded-full animate-pulse"></span>
                <span className="ball-7 absolute w-6 h-6 bg-pink-500 rounded-full animate-pulse"></span>
                <span className="ball-8 absolute w-6 h-6 bg-pink-500 rounded-full animate-pulse"></span>
            </div>
        </div>
    );
};
