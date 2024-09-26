import { XMarkIcon } from '@heroicons/react/16/solid';
import { useState } from 'react';
import instance from '../../service/api/customAxios';
import { toast } from 'react-toastify';

type PopupProductDetailProps = {
    productLine: {
      "id": string,
      "productId": string,
      "quantity": number | null,
      "importDate":string,
      "expiredAt": string,
    };
    onPopupDetail: boolean;
    setOnPopupDetail: React.Dispatch<React.SetStateAction<boolean>>;
    loadProductLines:()=>void
}

const PopupProductLineDetail: React.FC<PopupProductDetailProps> = ({
    productLine,
    onPopupDetail,
    setOnPopupDetail,loadProductLines
}) => {
  const [checkExpireDate, setCheckExpireDate] = useState(false)
  const formatDateString = (dateString: string) => {
    const [day, month, year] = dateString.split('/');
    return `${year}-${month}-${day}`;
};
  const formatMinDateString = (dateString: string) => {
    const [day, month, year] = dateString.split('/');
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    date.setDate(date.getDate() + 1);
    const newDay = String(date.getDate()).padStart(2, '0');
    const newMonth = String(date.getMonth() + 1).padStart(2, '0');
    const newYear = date.getFullYear();
    return `${newYear}-${newMonth}-${newDay}`;
};
  const [form, setForm] = useState({...productLine, expiredAt: formatDateString(productLine.expiredAt)});
  const validation = () => {
    form.expiredAt === '' ? setCheckExpireDate(true) : setCheckExpireDate(false)
    return form.expiredAt === ''
}
  const handleUpdate = async() =>{
    if(validation()) return;
    await instance.put(`/product-lines/update/${productLine.id}`,{
      "quantity": form.quantity,
      "expiredAt": form.expiredAt,
    }).then(()=>{
      loadProductLines()
      toast.success('Update successfully')
      setOnPopupDetail(false)
    }).catch(err => {
      console.log(err)
      toast.error('Update failed')
    })
  }
  console.log(form.expiredAt)
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
                                        Product Line Detail
                                    </h3>
                                    <XMarkIcon
                                        width={16}
                                        height={16}
                                        className="h-6 w-6 ml-auto cursor-pointer"
                                        onClick={() => setOnPopupDetail(false)}
                                    />
                                    <hr className="mt-2 text-black-700" />
                                </div>
                                <div className="overflow-y-scroll h-96 w-auto my-6">
                                <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Product line ID: {productLine.id}</label>
                                </div>
                                <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Imported at: {new Date(productLine.importDate).toLocaleDateString()}</label>
                                </div>
                                <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Expire at</label>
                                <input
                                    value={form.expiredAt} onChange={(e) => setForm(prev => ({...prev, expiredAt: e.target.value}))}
                                    type="date" min={formatMinDateString(form.importDate)}
                                    id="expiredAt"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                                />
                                {checkExpireDate && <p className='text-red-500 text-xs mt-2'>This field is required!</p>}
                            </div>
                            <div className="mb-4">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Quantity</label>
                                <input
                                    value={form.quantity ? form.quantity : 0} onChange={(e) => setForm(prev => ({...prev, quantity: parseInt(e.target.value)}))}
                                    type="number"
                                    id="name"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                                />
                            </div>
                            
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
        </div>
    );
};

export default PopupProductLineDetail;
