import { useState } from "react";
import { XMarkIcon } from "@heroicons/react/16/solid";
import instance from "../../service/api/customAxios";
import { toast } from "react-toastify";
type PopupCreateVoucherProps = {
  isPopupCreateVoucherOpen: boolean
  closePopupCreateVoucher: () => void
  loadVouchers:()=>void
}

const PopupCreateVoucher:React.FC<PopupCreateVoucherProps> = ({
    isPopupCreateVoucherOpen,
    closePopupCreateVoucher, loadVouchers
}) => {
    const [form, setForm]=useState({
      "code": "",
      "name": "",
    //   "thumbnailUrl": "string",
      "from": "",
      "to": "",
      "minOrderValue": 1,
      "value": 1,
      "quantity": 1
    })
    const [checkValid, setCheckValid]=useState({
      "code": false,
      "from": false,
      "to": false,
      "name": false
    })
    const validation = () =>{
        setCheckValid(prev => ({...prev, name: form.name.trim() === '',
          code: form.code.trim() === '',
          from: form.from === '',
          to: form.to === '',
        }))
        return form.name.trim() === '' || form.code.trim() === '' || form.from === '' ||form.to === ''
    }
    const handleCreateAccount = async() =>{
        if(validation()) return;
        await instance.post(`/vouchers`, form).then(async()=>{
            await loadVouchers()
            setForm({
              "code": "",
              "name": "",
            //   "thumbnailUrl": "string",
              "from": "",
              "to": "",
              "minOrderValue": 1,
              "value": 1,
              "quantity": 1
            })
            toast.success('Create successfully!')
            closePopupCreateVoucher()
        })
    }
    const getMinToDate = () => {
        if(form.from === "") return;
        const date = new Date(form.from);
        date.setDate(date.getDate() + 1);
        return date.toISOString().split('T')[0];
      };
    return (
      isPopupCreateVoucherOpen && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
                <div className="relative p-6 bg-white border rounded-lg shadow-lg w-1/2">
                    <button
                        onClick={()=>{setForm({
                            "code": "",
                            "name": "",
                            // "thumbnailUrl": "string",
                            "from": "",
                            "to": "",
                            "minOrderValue": 1,
                            "value": 1,
                            "quantity": 1
                          }); closePopupCreateVoucher();}}
                        className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                    >
                        <XMarkIcon width={24} height={24} />
                    </button>
                    <div className="text-center">
                        <h2 className="text-xl font-bold mb-4">Create Voucher</h2>
                    </div>
                    <div className="overflow-y-scroll h-96 w-auto">
                            <div className="mb-4">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name <span className="text-red-600 text-xl">*</span></label>
                                <input
                                    value={form.name} onChange={(e) => setForm(prev => ({...prev, name: e.target.value}))}
                                    type="text"
                                    id="name"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                                />
                                {checkValid.name && <p className='text-red-500 text-xs mt-2'>This field is required!</p>}
                            </div>
                            <div className="mb-4">
                                <label htmlFor="code" className="block text-sm font-medium text-gray-700">Code <span className="text-red-600 text-xl">*</span></label>
                                <input
                                    value={form.code} onChange={(e) => setForm(prev => ({...prev, code: e.target.value}))}
                                    type="text"
                                    id="code"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                                />
                                {checkValid.code && <p className='text-red-500 text-xs mt-2'>This field is required!</p>}
                            </div>
                            <div className="mb-4">
                                <label htmlFor="from" className="block text-sm font-medium text-gray-700">From <span className="text-red-600 text-xl">*</span></label>
                                <input
                                    value={form.from} onChange={(e) => setForm(prev => ({...prev, from: e.target.value}))}
                                    type="date" min={new Date().toISOString().split('T')[0]}
                                    id="from"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                                />
                                {checkValid.from && <p className='text-red-500 text-xs mt-2'>This field is required!</p>}
                            </div>
                            <div className="mb-4">
                                <label htmlFor="to" className="block text-sm font-medium text-gray-700">To <span className="text-red-600 text-xl">*</span></label>
                                <input
                                    value={form.to} onChange={(e) => setForm(prev => ({...prev, to: e.target.value}))}
                                    type="date" min={getMinToDate()} disabled={form.from !== "" ? false :true}
                                    id="to"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                                />
                                {checkValid.to && <p className='text-red-500 text-xs mt-2'>This field is required!</p>}
                            </div>
                            <div className="mb-4">
                                <label htmlFor="minOrderValue" className="block text-sm font-medium text-gray-700">Minimum Order Value</label>
                                <input min={1}
                                    value={form.minOrderValue} onChange={(e) => setForm(prev => ({...prev, minOrderValue: parseInt(e.target.value)}))}
                                    type="number"
                                    id="minOrderValue"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="value" className="block text-sm font-medium text-gray-700">Value</label>
                                <input min={1}
                                    value={form.value} onChange={(e) => setForm(prev => ({...prev, value: parseInt(e.target.value)}))}
                                    type="number"
                                    id="value"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity</label>
                                <input min={1}
                                    value={form.quantity} onChange={(e) => setForm(prev => ({...prev, quantity: parseInt(e.target.value)}))}
                                    type="number"
                                    id="quantity"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                                />
                            </div>
                           
                            <div className="flex justify-end">
                                <button onClick={handleCreateAccount}
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

export default PopupCreateVoucher;
