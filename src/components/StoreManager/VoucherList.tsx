import { MRT_ColumnDef } from "material-react-table";
import { useEffect, useState } from "react";
import { Button, Stack } from "@mui/material";
import CommonTable from "../Table/CommonTable";
import { IProduct } from "../../models/Produdct";
import instance from "../../service/api/customAxios";
import PopupCreateVoucher from "../Popup/PopupCreateVoucher";
import PopupVoucherDetail from "../Popup/PopupVoucherDetail";

const columns: MRT_ColumnDef<IProduct>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "code",
        header: "Code",
    },
    {
        accessorKey: "from",
        header: "From",
    },
    {
        accessorKey: "to",
        header: "To",
    },
    {
        accessorKey: "minOrderValue",
        header: "Minimum Order Value",
    },
    {
        accessorKey: "value",
        header: "Value",
    },
    {
        accessorKey: "quantity",
        header: "Quantity",
    },
    {
        accessorKey: "status",
        header: "Status",
    },
];

const VoucherList = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [vouchers, setVouchers] = useState([]);
    const [voucher, setVoucher] = useState(null);
    const [onPopupVoucherDetail, setOnPopupVoucherDetail] = useState<boolean>(false);
    
    const loadVouchers = async() => {
        await instance.post('/vouchers/filter?pageSize=1000', {})
        // const response = await instance.post("/orders/filter?pageSize=1000", {});
        .then(res =>{setVouchers(res.data.data)}).catch(err=>console.log(err))

    }
    useEffect(() => {
        loadVouchers()
    }, []);

    const handlePopupOpen = () => {
        setIsPopupOpen(true);
    };
    const handlePopupClose = () => {
        setIsPopupOpen(false);
    };


    const handleShowProductDetail = (pro: any) => {
        setVoucher(pro);
        setOnPopupVoucherDetail(true);
    };
    
    return (
        <Stack sx={{ m: "2rem 0" }}>
            <CommonTable note={true}
                columns={columns}
                data={vouchers || []}
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
                        add new voucher
                    </Button>
                }
            />
            <PopupCreateVoucher
                isPopupCreateVoucherOpen={isPopupOpen}
                closePopupCreateVoucher={handlePopupClose}
                loadVouchers={loadVouchers}
            />
            {voucher && (
                <PopupVoucherDetail loadVouchers={loadVouchers}
                    voucher={voucher}
                    onPopupDetail={onPopupVoucherDetail}
                    closePopup={()=>setOnPopupVoucherDetail(false)}
                />
            )}
        </Stack>
    );
};

export default VoucherList;
