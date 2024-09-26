import { useState, useEffect } from 'react';

const carouselItems = [
    {
        image: 'https://intruongphat.vn/wp-content/uploads/2018/05/banner3-1.jpg',
    },
    {
        image: 'https://cdn.tgdd.vn//News/1440141//banner-sua-bot-giam-giacopy-845x264.jpg',
    },
    {
        image: 'https://i.pinimg.com/originals/14/73/91/147391b8e34164c719a216f71705d382.jpg',
    },
    {
        image: 'https://congnghieptieudung.vn/Content/images/tin%20t%E1%BB%A9c/Th%E1%BB%8B%20tr%C6%B0%E1%BB%9Dng/S%E1%BB%AFa%20b%E1%BB%99t%20NUCA%20%C4%91%E1%BB%93ng%20h%C3%A0nh%20c%C3%B9ng%20b%E1%BA%A1n%20ch%C4%83m%20s%C3%B3c%20gia%20%C4%91%C3%ACnh.png',
    },
];

const Carousel = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prevSlide) => (prevSlide + 1) % carouselItems.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div id="default-carousel" className="relative w-full" data-carousel="slide">
            <div className="relative mt-1 h-96 overflow-hidden rounded-lg md:h-96"> {/* Adjusted height */}
                {carouselItems.map((item, index) => (
                    <div
                        key={index}
                        className={`absolute w-full h-full top-0 left-0 transition-opacity duration-700 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'
                            }`}
                    >
                        <img
                            src={item.image}
                            alt={`Slide ${index + 1}`}
                            className="object-cover w-full h-full"
                        />
                    </div>
                ))}
            </div>

            {/* Slider indicators */}
            <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3 rtl:space-x-reverse">
                {carouselItems.map((_, index) => (
                    <button
                        key={index}
                        type="button"
                        className={`w-3 h-3 rounded-full ${index === currentSlide ? 'bg-white' : 'bg-gray-300'
                            }`}
                        aria-current={index === currentSlide}
                        aria-label={`Slide ${index + 1}`}
                        data-carousel-slide-to={index}
                        onClick={() => setCurrentSlide(index)}
                    ></button>
                ))}
            </div>

            {/* Slider controls */}
            <button
                type="button"
                className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
                data-carousel-prev
                onClick={() =>
                    setCurrentSlide((prevSlide) =>
                        prevSlide === 0 ? carouselItems.length - 1 : prevSlide - 1
                    )
                }
            >
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                    <svg
                        className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 6 10"
                    >
                        <path
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M5 1 1 5l4 4"
                        />
                    </svg>
                    <span className="sr-only">Previous</span>
                </span>
            </button>
            <button
                type="button"
                className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
                data-carousel-next
                onClick={() =>
                    setCurrentSlide((prevSlide) => (prevSlide + 1) % carouselItems.length)
                }
            >
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                    <svg
                        className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 6 10"
                    >
                        <path
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="m1 9 4-4-4-4"
                        />
                    </svg>
                    <span className="sr-only">Next</span>
                </span>
            </button>
        </div>
    );
};

export default Carousel;
