import React from "react";

export const SearchBar: React.FC<{ text: string, onChange: React.ChangeEventHandler<HTMLInputElement>, onSearch: () => void }> = ({ text, onChange, onSearch }) => {
    return (
        <div className="flex items-center gap-2 border-2 border-red-300 max-w-[700px] m-auto my-8 h-auto pl-3 rounded-sm">
            <div className="icon">
                <svg fill="#000000" width="30px" height="30px" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><title>search</title><path d="M416 448L319 351Q277 383 224 383 181 383 144 362 107 340 86 303 64 266 64 223 64 180 86 143 107 106 144 85 181 63 224 63 267 63 304 85 341 106 363 143 384 180 384 223 384 277 351 319L448 416 416 448ZM223 336Q270 336 303 303 335 270 335 224 335 177 303 145 270 112 223 112 177 112 144 145 111 177 111 224 111 270 144 303 177 336 223 336Z" /></svg>
            </div>

            <input
                className="h-full w-full flex-1 outline-none"
                type="text"
                placeholder="Enter name product..."
                value={text}
                onChange={onChange}
                onKeyUp={onSearch} // Thêm sự kiện này để tìm kiếm khi người dùng nhập chữ
            />
            <button
                className="bg-red-600 border-none font-semibold rounded-sm h-10 w-24 text-center cursor-pointer text-white ease-in duration-300 hover:tracking-[0.1rem]"
                onClick={onSearch}
            >
                Search
            </button>
        </div>
    );
};
