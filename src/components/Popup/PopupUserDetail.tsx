import { XMarkIcon } from "@heroicons/react/16/solid";
import { useEffect, useState } from "react";
import instance from "../../service/api/customAxios";
import { toast } from "react-toastify";

type PopupUserDetailProps = {
    user: {
        "id": string,
        "username": string,
        "name": string,
        "phone": string | null,
        "address": string | null,
        "point": number,
        "status": string,
        "createAt": string
    };
    onPopupDetail: boolean;
    closePopupDetail: ()=>void;
    loadAllUsers: ()=>void,
    role: string
}

const PopupUserDetail = ({
    user,
    onPopupDetail,
    closePopupDetail,
    loadAllUsers,role
}: PopupUserDetailProps) => {
    const [form, setForm] = useState(user)
    const [checkValid, setCheckValid]=useState({
        name: false,
    })
      const validation = () =>{
          setCheckValid(prev => ({...prev, name: form.name.trim() === '',
          }))
          return form.name.trim() === ''
      }
      const handleUpdateAccount = async() =>{
        if(validation()) return;
        role === 'Customer' ? await instance.put(`/Accounts/customers/update/${user.id}`, {
            "name": form.name,
            "phone": form.phone,
            "address": form.address
          }).then(()=>{
            loadAllUsers()
            toast.success('Update successfully')
            closePopupDetail()
        }).catch(err => {
            err.response ? toast.error(err.response.data) : toast.error('Update failed')
        }) : await instance.put(`/Accounts/staffs/update/${user.id}`, {name: form.name}).then(()=>{
            loadAllUsers()
            toast.success('Update successfully')
            closePopupDetail()
        }).catch(err => {
            err.response ? toast.error(err.response.data) : toast.error('Update failed')
        })
    }
    
    useEffect(()=>{setForm(user)},[user])
    return (
        <div
            className={`fixed z-10 inset-0 overflow-y-auto ${onPopupDetail ? '' : 'hidden'
                }`}
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
        >
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div
                    className="fixed inset-0 bg-gray-800 bg-opacity-90 transition-opacity"
                    aria-hidden="true"
                ></div>
                <span
                    className="hidden sm:inline-block sm:align-middle sm:h-screen"
                    aria-hidden="true"
                >
                    &#8203;
                </span>
                <div className="bg-white-700 inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full pb-2">
                                <div className="flex">
                                    <h3
                                        className="text-lg leading-6 w-full font-medium text-gray-900"
                                        id="modal-title"
                                    >
                                        Account Detail
                                    </h3>
                                    <XMarkIcon
                                        width={16}
                                        height={16}
                                        className="h-6 w-6 ml-auto cursor-pointer"
                                        onClick={closePopupDetail}
                                    />
                                    <hr className="mt-2 text-black-700" />
                                </div>
                                <div className="overflow-y-scroll h-96 w-auto">
                                    <div className="mb-4">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name <span className="text-red-600 text-xl">*</span></label>
                                <input
                                    value={form.name} onChange={(e) => setForm(prev => ({...prev, name: e.target.value}))}
                                    type="text"
                                    name="name"
                                    id="name"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                                />
                                {checkValid.name && <p className='text-red-500 text-xs mt-2'>This field is required!</p>}
                            </div>
                            {role === 'Customer' && <><div className="mb-4">
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                                <input
                                    value={form.phone ? form.phone : ""} onChange={(e) => setForm(prev => ({...prev, phone: e.target.value}))}
                                    type="text"
                                    id="phone"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                                <input
                                    value={form.address ? form.address : ""} onChange={(e) => setForm(prev => ({...prev, address: e.target.value}))}
                                    type="text"
                                    id="address"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                                />
                            </div></>}
                            <div className="mb-4">
                                <span className="block text-sm font-medium text-gray-700">
                                    Username: {form.username}
                                </span>
                            </div>
                            <div className="mb-4">
                                <span className="block text-sm font-medium text-gray-700">
                                    Status: {form.status}
                                </span>
                            </div>
                            <div className="flex justify-end">
                                <button onClick={handleUpdateAccount}
                                    className="bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600">
                                    Update
                                </button>
                            </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PopupUserDetail