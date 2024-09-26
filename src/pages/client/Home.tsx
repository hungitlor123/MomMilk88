import React, { useState } from "react";
import Header from "../../components/Layout/Header";
import Footer from "../../components/Layout/Footer";
import Product from "../../components/Product/Product";
import Carousel from "../../components/Layout/Carousel";
import { SearchBar } from "../../components/Layout/Search";
import FilterAction from "../../components/Layout/FilterAction";
import { Box } from "@mui/material";
import SortPrice from "../../components/Layout/SortPrice";

const Home = () => {
    const [text, setText] = useState("");
    const [searchText, setSearchText] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [visibleCount, setVisibleCount] = useState(16);
    const [priceRange, setPriceRange] = useState<number[]>([100000, 1500000]); // Updated initial state

    const handleSearch = () => {
        setSearchText(text);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setText(e.target.value);
        setSearchText(e.target.value);
    };

    const handleFilterChange = (categoryId: string) => {
        setSelectedCategory(categoryId || null);
    };

    const handlePriceChange = (newRange: number[]) => {
        setPriceRange(newRange);
    };

    const loadMore = () => {
        setVisibleCount((prevCount) => prevCount + 16);
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <Header />
            <main className="flex-grow">
                <div className="container mx-auto px-4 py-8">
                    <Carousel />
                    <div className="my-6">
                        <SearchBar
                            text={text}
                            onChange={handleInputChange}
                            onSearch={handleSearch}
                        />
                    </div>
                    <Box display="flex" alignItems="center" marginBottom="1rem">
                        <FilterAction onFilterChange={handleFilterChange} />
                        <Box sx={{ width: '60%', marginLeft: '2rem' }}>
                            <SortPrice value={priceRange} onChange={handlePriceChange} />
                        </Box>
                    </Box>
                    <div className="my-6">
                        <Product
                            text={searchText === "" ? null : searchText}
                            selectedCategory={selectedCategory}
                            visibleCount={visibleCount}
                            loadMore={loadMore}
                            priceRange={priceRange} // Pass the price range as a prop
                        />
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Home;
