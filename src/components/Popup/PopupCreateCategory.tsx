import { XMarkIcon } from '@heroicons/react/16/solid';
import React, { useState } from 'react';
import instance from '../../service/api/customAxios';
import { toast } from 'react-toastify';

type PopupCreateCategoryProps = {
    isPopupOpen: boolean;
    closePopup: () => void;
    loadCategories: ()=>void
}


const PopupCreateCategory: React.FC<PopupCreateCategoryProps> = ({ isPopupOpen, closePopup,loadCategories }) => {
    const [form, setForm] = useState({name:''})
    const [checkName, setCheckName] = useState(false)
    const handleCreate = async() => {
        if(form.name.trim()==='') {
            setCheckName(true)
            return;
        }
        await instance.post(`/categories`,form).then(()=>{
            loadCategories()
            toast.success('Create successfully!')
            closePopup()
        })
        .catch(err => {
            console.log(err)
            toast.error('Create failed!')
        })
    }
    return (
        isPopupOpen && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
                <div className="relative p-6 bg-white border rounded-lg shadow-lg w-96">
                    <button
                        onClick={closePopup}
                        className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                    >
                        <XMarkIcon width={24} height={24} />
                    </button>
                    <div className="text-center">
                        <h2 className="text-xl font-bold mb-4">Create Category</h2>
                    </div>
                    <div>
                            <div className="mb-4">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name <span className="text-red-600 text-xl">*</span></label>
                                <input value={form.name} onChange={e => setForm({name: e.target.value})}
                                    type="text"
                                    id="name"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                                />
                                {checkName && <p className='text-red-500 text-xs mt-2'>This field is required!</p>}
                            </div>
                            <div className="flex justify-end">
                                <button onClick={handleCreate}
                                    className="bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600">
                                    Create
                                </button>
                            </div>
                    </div>
                </div>
            </div>
        )
    );
}

export default PopupCreateCategory;
