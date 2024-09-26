import { XMarkIcon } from '@heroicons/react/16/solid';
import { useEffect, useState } from 'react';
import { Stack } from '@mui/material';
import instance from '../../service/api/customAxios';
import { toast } from 'react-toastify';

type PopupCategoryDetailProps = {
    cate: {id?: string, name:string};
    onPopupDetail: boolean;
    setOnPopupDetail: React.Dispatch<React.SetStateAction<boolean>>;
    loadCategories: ()=>void;
}
const PopupCategoryDetail: React.FC<PopupCategoryDetailProps> = ({
    cate,
    onPopupDetail,
    loadCategories,
    setOnPopupDetail,
}) => {
    const [form, setForm] = useState(cate)
    const [checkName, setCheckName] = useState(false)
    const handleUpdate = async() => {
        if(form.name.trim()==='') {
            setCheckName(true);
            return;
        }
        await instance.put(`/categories/${cate.id}`,form).then(()=>{
            loadCategories()
            toast.success('Update successfully!')
            setOnPopupDetail(false)
        })
        .catch(err => {
            console.log(err)
            toast.error('Update failed!')
        })
    }

    useEffect(()=>{
        setForm(cate)
    },[cate])
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
                                        Category Detail
                                    </h3>
                                    <XMarkIcon
                                        width={16}
                                        height={16}
                                        className="h-6 w-6 ml-auto cursor-pointer"
                                        onClick={() => {setOnPopupDetail(false); setCheckName(false)}}
                                    />
                                    <hr className="mt-2 text-black-700" />
                                </div>
                                    <Stack direction='row' spacing={2} alignItems={'center'} className='w-[100%] py-14'>
                                        <span className="text-sm text-back-500 font-bold">
                                            Name 
                                        </span>
                                        <input value={form.name.trim()} onChange={e => setForm({name: e.target.value})} type="text" id="name"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"/>
                                    {checkName && <p className='text-red-500 text-xs mt-2'>This field is required!</p>}
                                    </Stack>
                                    <div className="flex justify-end">
                                <button onClick={handleUpdate}
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
    );
};

export default PopupCategoryDetail;
