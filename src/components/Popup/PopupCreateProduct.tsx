import { useState, useEffect } from "react";
import { useAppDispatch } from "../../service/store/store";
import {  getAllProducts } from "../../service/features/productSlice";
import { XMarkIcon } from "@heroicons/react/16/solid";
import { Autocomplete,TextField,Stack } from "@mui/material";
import instance from "../../service/api/customAxios";
import { toast } from "react-toastify";

type ProductCreateState = {
    isPopupCreateProductOpen: boolean;
    closePopupCreateProduct: () => void;
};

const PopupCreateProduct: React.FC<ProductCreateState> = ({
    isPopupCreateProductOpen,
    closePopupCreateProduct
}) => {
    const dispatch = useAppDispatch();
    const [imageSend, setImageSend] = useState<File | null>(null);
    const [form, setForm]=useState({
        name:'',
        description:'',
        origin:'',
        thumbnail: null as string | null,
        brand:'Vinamilk',
        price: 1,
        quantity: 1,
        productCategories: [{ categoryId: ""}]
    })
    const [checkValid, setCheckValid]=useState({
        name: false,
        origin: false,
        thumbnail: false,description: false,
    })
    const validation = () =>{
        setCheckValid(prev => ({...prev, name: form.name.trim() === '',
            origin: form.origin.trim() === '',
            thumbnail: form.thumbnail === null,
            description: form.description.trim() === '',
        }))
        return form.name.trim() === '' || form.origin.trim() === '' || form.thumbnail === null ||form.description.trim() === ''
    }
    const handleCreateProduct = async() =>{
        if(validation()) return;
        const formData = new FormData()
        formData.append('name', form.name)
        formData.append('description', form.description)
        imageSend && formData.append('thumbnail', imageSend)
        formData.append('origin', form.origin)
        formData.append('madeIn',form.origin)
        formData.append('brand',form.brand)
        formData.append('price',form.price.toString())
        // formData.append('quantity', form.quantity.toString())
        // formData.append('productCategories', JSON.stringify(form.productCategories))
        formData.append('productCategories', JSON.stringify(form.productCategories.map(item => item.categoryId)))
        await instance.post(`/products`,formData).then(()=>{
            dispatch(getAllProducts({text:''})).then(()=>{
                setForm({
                    name:'',
                    description:'',
                    origin:'',
                    thumbnail: null,
                    brand:'Vinamilk',
                    price: 1,
                    quantity: 1,
                    productCategories: [{ categoryId: ""}]
                })
                toast.success('Create successfully!')
            })
            closePopupCreateProduct()
        }).catch(err => {
            console.log(err)
            toast.error('Create failed!')
        })
        
    }

    const [productCategories, setProductCategories] = useState([])
    const loadProductCategories = async() =>{
        await instance.post('/categories/filter', {})
        .then(res => {
            const list = res.data.data.map((item: {
                id: string,
                name: string
              }) => ({label: item.name, value: item.id}))
            setProductCategories(list)
            setForm(prev => ({...prev, productCategories: list[0]}))
        })
        .catch(err => console.log(err))
    }
    useEffect(()=>{loadProductCategories()},[])
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
                        <h2 className="text-xl font-bold mb-4">Create Product</h2>
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
                                <label htmlFor="origin" className="block text-sm font-medium text-gray-700">Origin <span className="text-red-600 text-xl">*</span></label>
                                <Autocomplete options={['Afghanistan','Albania','Algeria','Andorra','Angola','Antigua and Barbuda','Argentina','Armenia','Australia','Austria','Azerbaijan','Bahamas','Bahrain','Bangladesh','Barbados','Belarus','Belgium','Belize','Benin','Bhutan','Bolivia','Bosnia and Herzegovina','Botswana','Brazil','Brunei','Bulgaria','Burkina Faso','Burundi','Cabo Verde','Cambodia','Cameroon','Canada','Central African Republic','Chad','Chile','China','Colombia','Comoros','Congo (Congo-Brazzaville)','Costa Rica','Croatia','Cuba','Cyprus','Czechia (Czech Republic)','Democratic Republic of the Congo','Denmark','Djibouti','Dominica','Dominican Republic','Ecuador','Egypt','El Salvador','Equatorial Guinea','Eritrea','Estonia','Eswatini (fmr. "Swaziland")','Ethiopia','Fiji','Finland','France','Gabon','Gambia','Georgia','Germany','Ghana','Greece','Grenada','Guatemala','Guinea','Guinea-Bissau','Guyana','Haiti','Honduras','Hungary','Iceland','India','Indonesia','Iran','Iraq','Ireland','Israel','Italy','Jamaica','Japan','Jordan','Kazakhstan','Kenya','Kiribati','Kuwait','Kyrgyzstan','Laos','Latvia','Lebanon','Lesotho','Liberia','Libya','Liechtenstein','Lithuania','Luxembourg','Madagascar','Malawi','Malaysia','Maldives','Mali','Malta','Marshall Islands','Mauritania','Mauritius','Mexico','Micronesia','Moldova','Monaco','Mongolia','Montenegro','Morocco','Mozambique','Myanmar (formerly Burma)','Namibia','Nauru','Nepal','Netherlands','New Zealand','Nicaragua','Niger','Nigeria','North Korea','North Macedonia','Norway','Oman','Pakistan','Palau','Palestine State','Panama','Papua New Guinea','Paraguay','Peru','Philippines','Poland','Portugal','Qatar','Romania','Russia','Rwanda','Saint Kitts and Nevis','Saint Lucia','Saint Vincent and the Grenadines','Samoa','San Marino','Sao Tome and Principe','Saudi Arabia','Senegal','Serbia','Seychelles','Sierra Leone','Singapore','Slovakia','Slovenia','Solomon Islands','Somalia','South Africa','South Korea','South Sudan','Spain','Sri Lanka','Sudan','Suriname','Sweden','Switzerland','Syria','Taiwan','Tajikistan','Tanzania','Thailand','Timor-Leste','Togo','Tonga','Trinidad and Tobago','Tunisia','Turkey','Turkmenistan','Tuvalu','Uganda','Ukraine','United Arab Emirates','United Kingdom','United States of America','Uruguay','Uzbekistan','Vanuatu','Vatican City','Venezuela','Vietnam','Yemen','Zambia','Zimbabwe'
]} value={form.origin}
                                disablePortal disableClearable size='small'
                                onChange={(_, value) => setForm(prev => ({...prev, origin: value}))}
                                renderInput={(params) => <TextField {...params} />} />
                                {checkValid.origin && <p className='text-red-500 text-xs mt-2'>This field is required!</p>}
                                </div>
                            
                            <div className="mb-4">
                                <label htmlFor="brand" className="block text-sm font-medium text-gray-700">Product category</label>
                               {productCategories.length>0 && <Autocomplete multiple options={productCategories}
                                    size='small' filterSelectedOptions
                                    onChange={(_, value) => {
                                        const newList = value.map((item: {label: string, value: string}) => ({categoryId: item.value}))
                                        setForm(prev => ({...prev, productCategories: newList}))
                                    }}
                                    renderInput={(params) => ( <TextField {...params} placeholder="Select multiple categories" /> )} />}
                            </div>
                            <div className="mb-4">
                                <label htmlFor="brand" className="block text-sm font-medium text-gray-700">Brand</label>
                                <Autocomplete options={['Vinamilk', 'TH True Milk', 'Dielac', 'Dutch Lady', 'Meadow Fresh', 'Nutifood', 'Nestle', 'Dalat Milk', 'Morinaga', 'Anlene', 'Abbott', 'Friso', 'Aptamil', 'Glico', 'Wyeth', 'Hipp', 'Mead Johnson', 'Bellamy’s', 'Kendamil', 'Biomil', 'Namyang', 'Ovaltine', 'Vinasoy', 'Yakult', 'Coca-Cola', 'Enfa', 'Pediasure', 'Similac', 'S26', 'Grow Plus+', 'Ensure', 'Nutricare', 'XO', 'Horizon Organic', 'Fairlife', 'Silk', 'Alpro', 'Goodday', 'Anchor', 'Paul’s', 'Arla', 'Devondale', 'Parmalat', 'Borden', 'Dean Foods', 'Land O Lakes', 'TruMoo', 'Yili', 'Mengniu', 'Marigold','Other']} value={form.brand}
                                disablePortal disableClearable size='small'
                                onChange={(_, value) => setForm(prev => ({...prev, brand: value}))}
                                renderInput={(params) => <TextField {...params} />} />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description <span className="text-red-600 text-xl">*</span></label>
                                <input value={form.description} onChange={(e) => setForm(prev => ({...prev, description: e.target.value}))}
                                    type="text"
                                    name="description"
                                    id="description"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                                />
                                {checkValid.description && <p className='text-red-500 text-xs mt-2'>This field is required!</p>}
                            </div>
                            
                            <div className="mb-4">
                                <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
                                <input value={form.price} onChange={(e) => setForm(prev => ({...prev, price: parseInt(e.target.value)}))}
                                    type="number" min={1}
                                    id="price"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                                />
                            </div>
                            {/* <div className="mb-4">
                                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity</label>
                                <input value={form.quantity} onChange={(e) => setForm(prev => ({...prev, quantity: parseInt(e.target.value)}))}
                                    type="number" min={1}
                                    name="quantity"
                                    id="quantity"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                                />
                            </div> */}

                            <label className="block text-sm font-medium text-gray-700">Thumbnail <span className="text-red-600 text-xl">*</span></label>
                            {checkValid.thumbnail && <p className='text-red-500 text-xs mt-2'>Thumbnail is required!</p>}
                            {form.thumbnail === null || form.thumbnail === "" ? (
                                <img
                                    className="h-4/5 w-[40%]"
                                    src="https://cdn3.iconfinder.com/data/icons/online-states/150/Photos-512.png"
                                />
                                ) : (
                                <img
                                    alt="thumbnail-img"
                                    src={form.thumbnail}
                                    className="w-[50%] my-6"
                                />
                                )}
                            <Stack direction="row" spacing={2}>
                                <button className="bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600"
                                    onClick={() => {
                                        const fileInput = document.getElementById("fileInput");
                                        if (fileInput) {
                                        (fileInput as HTMLInputElement).click();
                                        }
                                    }}>Upload image</button>
                                <input id="fileInput" type="file" hidden={true} accept=".jpg, .jpeg, .png"
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        const files = e.target.files;
                                        if (files && files.length > 0) {
                                        const file = files[0];
                                        setForm(prev => ({
                                            ...prev,
                                            thumbnail: URL.createObjectURL(file)
                                        }));
                                        setImageSend(file);
                                        }
                                    }}
                                />
                                {form.thumbnail && (
                                    <button  onClick={() => {
                                        setForm(prev => ({ ...prev, thumbnail: null }));
                                        setImageSend(null);
                                    }}
                                    className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600">
                                    Clear image
                                </button>
                                )}
                            </Stack>
                            <div className="flex justify-end">
                                <button onClick={handleCreateProduct}
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

export default PopupCreateProduct;
