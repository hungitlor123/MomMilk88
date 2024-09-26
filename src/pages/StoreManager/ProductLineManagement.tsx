import { FaDatabase } from "react-icons/fa"
import SidebarComponent from "../../components/Layout/Sidebar"
import ProductLineList from "../../components/StoreManager/ProductLineList"

const ProductLineManagement = () => {
    return (
        <div className="">
            <div className="grid grid-cols-1 md:grid-cols-12 md:p-0">
                <div className="md:col-span-2">
                    <SidebarComponent />
                </div>

                <div className="md:col-span-10 mt-5">
                    <div className="flex">
                        <FaDatabase className="text-3xl text-pink-300" />
                        <h3 className="text-3xl font-bold ml-6">Product Line Management</h3>
                    </div>
                    <ProductLineList />
                </div>
            </div>
        </div>)
}

export default ProductLineManagement