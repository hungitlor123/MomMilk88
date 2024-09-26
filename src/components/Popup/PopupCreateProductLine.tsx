import { useState } from "react";
import { XMarkIcon } from "@heroicons/react/16/solid";
import instance from "../../service/api/customAxios";
import { toast } from "react-toastify";

type ProductCreateState = {
    isPopupCreateProductOpen: boolean;
    closePopupCreateProduct: () => void;
    loadProductLines: () => void;
    productId: string;
};

const PopupCreateProductLine: React.FC<ProductCreateState> = ({
    isPopupCreateProductOpen,
    closePopupCreateProduct,
    loadProductLines,productId
}) => {
    const [checkExpireDate, setCheckExpireDate] = useState(false)
    const [form, setForm]=useState({
      "quantity": 1,
      "importDate": new Date().toLocaleDateString(),
      "expiredAt": "",
    })
    const validation = () => {
        form.expiredAt === '' ? setCheckExpireDate(true) : setCheckExpireDate(false)
        return form.expiredAt === ''
    }
    const handleCreateProductLine = async() => {
      if(validation()) return;
        await instance.post(`/product-lines/create/${productId}`,{...form,expiredAt: new Date(form.expiredAt)})
      .then(() => {
        loadProductLines()
        setForm({
            "quantity": 1,
            "importDate": new Date().toLocaleDateString(),
            "expiredAt": "",
          })
        toast.success('Create successfully')
        closePopupCreateProduct()
      }).catch(err => {
        console.log(err)
        toast.error(err.response ? "Invalid date" : 'Create failed')
      })
    }
    const getTomorrowDate = () => {
        const date = new Date();
        date.setDate(date.getDate() + 1);
        return date.toISOString().split('T')[0];
      };
    return (
        isPopupCreateProductOpen && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
                <div className="relative p-6 bg-white border rounded-lg shadow-lg w-1/2">
                    <button
                        onClick={closePopupCreateProduct}
                        className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                    >
                        <XMarkIcon width={24} height={24} />
                    </button>
                    <div className="text-center">
                        <h2 className="text-xl font-bold mb-4">Create Product Line</h2>
                    </div>
                    <div className="overflow-y-scroll h-96 w-auto">
                            <div className="mb-4">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Quantity</label>
                                <input min={1}
                                    value={form.quantity} onChange={(e) => setForm(prev => ({...prev, quantity: e.target.value ? parseInt(e.target.value) : 1}))}
                                    type="number"
                                    id="name"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                                />
                            </div>
                            
                            <div className="mb-4">
                                <label htmlFor="expiredAt" className="block text-sm font-medium text-gray-700">Expire at <span className="text-red-600 text-xl">*</span></label>
                                <input
                                    value={form.expiredAt} onChange={(e) => setForm(prev => ({...prev, expiredAt: e.target.value}))}
                                    type="date" min={getTomorrowDate()}
                                    id="expiredAt"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                                />
                                {checkExpireDate && <p className='text-red-500 text-xs mt-2'>This field is required!</p>}

                            </div>
                            <div className="flex justify-end">
                                <button onClick={handleCreateProductLine}
                                    className="bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600">
                                    Create
                                </button>
                            </div>
                    </div>
                </div>
            </div>
        )
    );
};

export default PopupCreateProductLine;
