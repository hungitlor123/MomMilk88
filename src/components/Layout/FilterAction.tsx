import React, { useEffect, useState } from "react";
import instance from "../../service/api/customAxios";
import { ICategory } from "../../models/Category";

type FilterActionProps = {
    onFilterChange: (categoryId: string) => void;
};

const FilterAction: React.FC<FilterActionProps> = ({ onFilterChange }) => {
    const [categories, setCategories] = useState<ICategory[]>([]);

    const loadCategories = async () => {
        try {
            const response = await instance.post('/categories/filter', { name: '' });
            setCategories(response.data.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const categoryId = e.target.value;
        onFilterChange(categoryId);
    };

    return (
        <div className="mb-5">
            <div className="flex items-center space-x-4">
                <label htmlFor="categoryFilter" className="text-gray-700 font-semibold">
                    Filter by Category:
                </label>
                <select
                    id="categoryFilter"
                    className="border border-gray-300 rounded-md p-2 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    onChange={handleFilterChange}
                >
                    <option value="">Select Filter</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default FilterAction;
