import { Link, useLocation, useNavigate } from 'react-router-dom';
import menu from '../listMenu';
import { logoutUser } from '../../service/features/authSlice';
import { useAppDispatch, useAppSelector } from '../../service/store/store';
import { ArrowRightEndOnRectangleIcon } from '@heroicons/react/16/solid';

const SidebarComponent = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { account } = useAppSelector((state) => state.auth);
    const role = account?.user.role;

    const activeMenuItem = [...menu.storeManagementMenu, ...menu.isAdminMenu].find(item => item.url === location.pathname);

    const handleLogout = (data: any | undefined) => {
        dispatch(logoutUser(data))
            .unwrap()
            .then(() => {
                navigate('/login');
            });
    };

    return (
        <div className='flex'>
            <div className="w-56 bg-pink-200 fixed h-full">
                <div className='my-2 mb-4'>
                    <h1 className="text-2xl font-bold ml-4 text-pink-800">
                        {activeMenuItem ? activeMenuItem.title : 'Profile'}
                    </h1>
                </div>
                <hr />
                <ul className='mt-3 text-pink-800 font-bold'>
                    {role === 'Staff' && menu.storeManagementMenu.map((item, index) => (
                        <Link to={item.url} key={index} className=''>
                            <li className={`ml-4 mb-2 gap-6 rounded hover:shadow hover:bg-pink-300 py-2 cursor-pointer flex ${item.url === location.pathname ? 'text-pink-500' : ''}`}>
                                <span>{item.title}</span>
                            </li>
                        </Link>
                    ))}
                    {role === 'Admin' && menu.isAdminMenu.map((item, index) => (
                        <Link to={item.url} key={index} className=''>
                            <li className={`ml-4 mb-2 gap-6 rounded hover:shadow hover:bg-pink-300 py-2 cursor-pointer flex ${item.url === location.pathname ? 'text-pink-500' : ''}`}>
                                <span>{item.title}</span>
                            </li>
                        </Link>
                    ))}
                    <li>
                        <button
                            onClick={handleLogout}
                            className='ml-4 mb-2 gap-6 rounded hover:shadow hover:bg-pink-300 py-4 px-2 cursor-pointer flex items-center'
                        >
                            <ArrowRightEndOnRectangleIcon className='h-5 w-5 mr-2 text-pink-500' />
                            <span>Logout</span>
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default SidebarComponent;
