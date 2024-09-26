import { MRT_ColumnDef } from "material-react-table";
import { useEffect, useState } from "react";
import { Button, Stack,Autocomplete,TextField } from "@mui/material";
import CommonTable from "../Table/CommonTable";
import { IProduct } from "../../models/Produdct";
import instance from "../../service/api/customAxios";
import PopupCreateProductLine from "../Popup/PopupCreateProductLine";
import PopupProductLineDetail from "../Popup/PopupProductLineDetail";

const columns: MRT_ColumnDef<IProduct>[] = [
    {
        accessorKey: "id",
        header: "Product line ID",
    },
    {
        accessorKey: "quantity",
        header: "Quantity",
    },
    
    {
        accessorKey: "importDate",
        header: "Imported date",
    },
    {
        accessorKey: "expiredAt",
        header: "Expire at",
    },
];

const ProductLineList = () => {
    // const { products } = useAppSelector((state) => state.products);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [productLines, setProductLines] = useState([]);
    const [productLineData, setProductLineData] = useState(null);
    const [onPopupProductDetail, setOnPopupProductDetail] = useState<boolean>(false);
    const [products, setProducts] = useState([])
    const [selectProduct, setSelectProduct] = useState({label:'',value:''})
    
    const loadProducts = async() => {
        await instance.post('/products/filter?pageNumber=0&pageSize=1000',{})
        .then(res =>{
            const newList = res.data.data.map((item:any) => ({label: item.name, value: item.id}))
            setSelectProduct(newList[0])
            setProducts(newList)}).catch(err=>console.log(err))
    }
    const loadProductLines = async()=>{
        await instance.get(`/product-lines/${selectProduct.value}`,{params: {pageNumber:0, pageSize:1000}})
        .then(res =>{
            setProductLines(res.data.data)}).catch(err=>console.log(err))
    }
    useEffect(() => {
        loadProducts()
    }, []);
    useEffect(() => {
        selectProduct.value !== '' && loadProductLines()
    }, [selectProduct]);

    const handlePopupOpen = () => {
        setIsPopupOpen(true);
    };
    const handlePopupClose = () => {
        setIsPopupOpen(false);
    };


    const handleShowProductDetail = (pro: any) => {
        setProductLineData(pro);
        setOnPopupProductDetail(true);
    };
    
    return (
        <Stack sx={{ m: "2rem 0" }}>
            <Autocomplete disableClearable disablePortal className="ms-4 w-[23%]" size='small'
            options={products} value={selectProduct} onChange={(_,value)=>setSelectProduct(value)}
            renderInput={(params) => <TextField {...params} label="Product" />} />
            <CommonTable note={true}
                columns={columns}
                data={productLines || []}
                onRowDoubleClick={handleShowProductDetail}
                toolbarButtons={
                    <Button
                        variant="contained"
                        onClick={handlePopupOpen}
                        sx={{
                            color: "black",
                            backgroundColor: "pink",
                        }}
                    >
                        Add New Product Line
                    </Button>
                }
            />
            <PopupCreateProductLine
                isPopupCreateProductOpen={isPopupOpen}
                closePopupCreateProduct={handlePopupClose}
                loadProductLines={loadProductLines}
                productId={selectProduct.value}
            />
            {productLineData && (
                <PopupProductLineDetail loadProductLines={loadProductLines}
                    productLine={productLineData}
                    onPopupDetail={onPopupProductDetail}
                    setOnPopupDetail={setOnPopupProductDetail}
                />
            )}
        </Stack>
    );
};

export default ProductLineList;
