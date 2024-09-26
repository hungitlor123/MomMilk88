import { useState } from "react";
import { XMarkIcon } from "@heroicons/react/16/solid";
import instance from "../../service/api/customAxios";
import { toast } from "react-toastify";
type PopupCreateAccountProps = {
  isPopupCreateAccountOpen: boolean
  closePopupCreateAccount: () => void
  role: string
  loadAllUsers:()=>void
}

const PopupCreateAccount:React.FC<PopupCreateAccountProps> = ({
    isPopupCreateAccountOpen,
    closePopupCreateAccount, role, loadAllUsers
}) => {
    const [form, setForm]=useState({
      "username": "",
      "password": "",
      "name": ""
    })
    const [checkValid, setCheckValid]=useState({
      "username": false,
      "password": false,
      "name": false
    })
    const validation = () =>{
        setCheckValid(prev => ({...prev, name: form.name.trim() === '',
          username: form.username.trim() === '',
          password: form.password.trim() === '',
        }))
        return form.name.trim() === '' || form.username.trim() === '' || form.password.trim() === ''
    }
    const handleCreateAccount = async() =>{
        if(validation()) return;
        await instance.post(`/Accounts/${role}s`, form).then(async()=>{
            await loadAllUsers()
            setForm({
                "username": "",
                "password": "",
                "name": ""
            })
            toast.success('Create successfully!')
            closePopupCreateAccount()
        })
    }

    return (
      isPopupCreateAccountOpen && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
                <div className="relative p-6 bg-white border rounded-lg shadow-lg w-1/2">
                    <button
                        onClick={closePopupCreateAccount}
                        className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                    >
                        <XMarkIcon width={24} height={24} />
                    </button>
                    <div className="text-center">
                        <h2 className="text-xl font-bold mb-4">Create Account</h2>
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
                            <div className="mb-4">
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username <span className="text-red-600 text-xl">*</span></label>
                                <input
                                    value={form.username} onChange={(e) => setForm(prev => ({...prev, username: e.target.value}))}
                                    type="text"
                                    id="username"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                                />
                                {checkValid.username && <p className='text-red-500 text-xs mt-2'>This field is required!</p>}
                            </div>
                            <div className="mb-4">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password <span className="text-red-600 text-xl">*</span></label>
                                <input
                                    value={form.password} onChange={(e) => setForm(prev => ({...prev, password: e.target.value}))}
                                    type="text"
                                    id="password"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                                />
                                {checkValid.password && <p className='text-red-500 text-xs mt-2'>This field is required!</p>}
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

export default PopupCreateAccount;
