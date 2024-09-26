import { FaCartArrowDown } from 'react-icons/fa';
import { useAppDispatch, useAppSelector } from '../../service/store/store';
import { logoutUser } from '../../service/features/authSlice';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { removeCart } from '../../service/features/productSlice'; // Thêm import này

const Header = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { account } = useAppSelector((state) => state.auth);

    const handleLogout = (data: any | undefined) => {
        dispatch(logoutUser(data))
            .unwrap()
            .then(() => {
                // Xóa giỏ hàng trong Redux store
                dispatch(removeCart());
                // Xóa thông tin giỏ hàng trong localStorage
                // localStorage.removeItem("cart");
                // // Xóa thông tin người dùng trong localStorage (nếu có)
                // localStorage.removeItem("customerId");
                // Điều hướng về trang đăng nhập
                localStorage.clear();
                navigate('/login');
            });
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    return (
        <header>
            <nav className="bg-pink-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800">
                <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
                    <Link to={'/home'} className="flex items-center">
                        <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Mommilk</span>
                    </Link>

                    <div className="flex items-center lg:order-2">
                        {!account ? (
                            <a href="/login" className="border bg-pink-500 text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800 font-bold">Log in</a>
                        ) : (
                            <button
                                onClick={handleLogout}
                                className="border bg-pink-500 text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800 font-bold">Logout</button>
                        )}
                        {account && (
                            <div className="relative">
                                <button onClick={toggleDropdown} className="flex items-center focus:outline-none font-semibold transition-colors duration-300 hover:text-pink-500">
                                    <p className="font-bold">Hello, {account?.user?.name}</p> {/* Chữ đậm */}
                                    <svg className={`w-4 h-4 ml-2 transition-transform transform ${dropdownOpen ? 'rotate-180' : 'rotate-0'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </button>
                                {dropdownOpen && (
                                    <div className={`absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 transition duration-200 transform ${dropdownOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                                        <Link to={'/profile'} className="block px-4 py-2 text-gray-700 hover:bg-pink-100 rounded-t-md font-bold">My Profile</Link>
                                        <Link to={'/order-history'} className="block px-4 py-2 text-gray-700 hover:bg-pink-100 rounded-b-md font-bold">Order History</Link>
                                    </div>
                                )}
                            </div>
                        )}
                        <Link to='/view-cart' className="text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800">
                            <FaCartArrowDown className="w-6 h-6" />
                        </Link>
                    </div>
                    <div className="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1" id="mobile-menu-2">
                        <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
                            <li>
                                <Link to="/home" className="block py-2 pr-4 pl-3 text-gray-700 border-b-2 border-transparent transition duration-300 ease-in-out hover:border-pink-500 lg:hover:bg-transparent lg:border-0 lg:hover:text-pink-500 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700 font-bold">Home</Link>
                            </li>
                            <li>
                                <Link to="/product-page" className="block py-2 pr-4 pl-3 text-gray-700 border-b-2 border-transparent transition duration-300 ease-in-out hover:border-pink-500 lg:hover:bg-transparent lg:border-0 lg:hover:text-pink-500 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700 font-bold">Product</Link>
                            </li>
                            <li>
                                <Link to="/faq" className="block py-2 pr-4 pl-3 text-gray-700 border-b-2 border-transparent transition duration-300 ease-in-out hover:border-pink-500 lg:hover:bg-transparent lg:border-0 lg:hover:text-pink-500 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700 font-bold">FAQ</Link>
                            </li>
                            <li>
                                <Link to="/blog" className="block py-2 pr-4 pl-3 text-gray-700 border-b-2 border-transparent transition duration-300 ease-in-out hover:border-pink-500 lg:hover:bg-transparent lg:border-0 lg:hover:text-pink-500 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700 font-bold">Blogs</Link>
                            </li>
                            <li>
                                <Link to="/contact" className="block py-2 pr-4 pl-3 text-gray-700 border-b-2 border-transparent transition duration-300 ease-in-out hover:border-pink-500 lg:hover:bg-transparent lg:border-0 lg:hover:text-pink-500 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700 font-bold">Contact</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
}

export default Header;
