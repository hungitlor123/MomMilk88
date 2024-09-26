import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../service/store/store";
import { getAllProducts } from "../../service/features/productSlice";
import { Spinner } from "../Layout/Spinner";
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import { IProductCategory } from "../../models/Produdct";

interface ProductProps {
    text?: string | null;
    selectedCategory: string | null;
    visibleCount: number;
    loadMore: () => void;
    priceRange: number[]; // Add the priceRange prop
}

const Product: React.FC<ProductProps> = ({ text, selectedCategory, visibleCount, loadMore, priceRange }) => {
    const dispatch = useAppDispatch();
    const { products, loading } = useAppSelector((state) => state.products);

    useEffect(() => {
        dispatch(getAllProducts({ text, category: selectedCategory }));
    }, [dispatch, text, selectedCategory]);

    if (loading) return <Spinner />;
    if (!products || products.length === 0) return <p>No products available</p>;

    const formatCurrency = (price: number): string => {
        return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    };

    const renderStars = (rating: number) => {
        const fullStars = Math.floor(rating);
        const halfStars = rating % 1 !== 0;
        const emptyStars = 5 - fullStars - (halfStars ? 1 : 0);

        return (
            <>
                {Array(fullStars).fill(null).map((_, index) => <span key={`full-${index}`}><StarIcon /></span>)}
                {halfStars && <span key="half"><StarHalfIcon /></span>}
                {Array(emptyStars).fill(null).map((_, index) => <span key={`empty-${index}`}><StarBorderIcon /></span>)}
            </>
        );
    };

    const renderCategories = (productCategories: IProductCategory[]) => {
        return productCategories.map((categoryObj, index) => (
            <span key={index} className="mr-2 mb-2 px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-lg">
                {categoryObj.category.name}
            </span>
        ));
    };

    const filteredProducts = products
        ?.filter(product => product.price >= priceRange[0] && product.price <= priceRange[1])
        .filter(product =>
            selectedCategory
                ? product.productCategories.some(categoryObj => categoryObj.category.id === selectedCategory)
                : true
        );

    return (
        <>
            <div className="grid grid-cols-4 gap-4">
                {filteredProducts && filteredProducts.length > 0 && filteredProducts.slice(0, visibleCount).map((product, index) => (
                    product.status !== 'Inactive' && (
                        <div key={index} className="flex flex-col bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 h-[auto] w-[auto]">
                            <div className="flex items-center justify-center">
                                <img className="w-[200px] h-[180px] p-4"
                                    src={product?.thumbnailUrl ? product.thumbnailUrl.toString() : ""}
                                    alt={product?.name ? product.name.toString() : ""} />
                            </div>
                            <div className="flex flex-col justify-between p-5 flex-grow">
                                <div>
                                    <Link to={`/product/${product.id}`}>
                                        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{product.name}</h5>
                                    </Link>
                                    <div className="mb-2">
                                        {renderCategories(product.productCategories)}
                                    </div>
                                    <div className="flex flex-row justify-between">
                                        <p className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">{formatCurrency(product.price)}</p>
                                        <span className="title-font font-bold text-base text-gray-900">Sold: {product.sold} </span>
                                    </div>
                                    <div className="flex items-center gap-1 mb-2 text-yellow-500">
                                        {renderStars(product.rating || 0)}
                                    </div>
                                </div>
                                <Link to={`/product/${product.id}`} className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                    Read more
                                    <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    )
                ))}
            </div>
            {visibleCount < filteredProducts.length && (
                <div className="flex justify-center mt-4">
                    <button
                        onClick={loadMore}
                        className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
                    >
                        Load More
                    </button>
                </div>
            )}
        </>
    );
};

export default Product;
