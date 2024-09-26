import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../../service/store/store";
import { ICartItem } from "../../../models/CartItem";
import { decreaseQuantity, removeFromCart, increaseQuantity, updateQuantity } from "../../../service/features/productSlice";
import Header from "../../../components/Layout/Header";
import Footer from "../../../components/Layout/Footer";
import { useNavigate } from 'react-router-dom';
import instance from "../../../service/api/customAxios";
import { FaTrashAlt, FaMinus, FaPlus, FaMoneyBillWave, FaCreditCard } from "react-icons/fa";

interface IVoucher {
    id: string;
    code: string;
    name: string;
    thumbnailUrl: string;
    from: Date;
    to: Date;
    minOrderValue: number;
    value: number;
    quantity: number;
    createAt: Date;
    status: string;
}

const ViewCart = () => {
    const dispatch = useAppDispatch();
    const cartItems = useAppSelector((state) => state.products.cart);
    const products = useAppSelector((state) => state.products.products);
    const navigate = useNavigate();
    const storedReceiver = localStorage.getItem("USERNAME") || "";
    const storedAddress = localStorage.getItem("USERADDRESS");
    const storedPhone = localStorage.getItem("USERPHONE");
    const [receiver, setReceiver] = useState<string>(storedReceiver);
    const [address, setAddress] = useState<string>(storedAddress === "null" ? "" : storedAddress ?? "");
    const [phone, setPhone] = useState<string>(storedPhone === "null" ? "" : storedPhone ?? "");
    const [paymentMethod, setPaymentMethod] = useState("Cash");
    const [selectedVoucherId, setSelectedVoucherId] = useState("");
    const [discountValue, setDiscountValue] = useState(0);
    const [vouchers, setVouchers] = useState<IVoucher[]>([]);

    const calculateTotal = (cartItems: ICartItem[] | null): number => {
        if (!cartItems || cartItems.length === 0) {
            return 0;
        }
        return cartItems.reduce((total, item) => total + item.quantity * item.price, 0);
    };

    const formatCurrency = (amount: number): string => {
        return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    };

    
    const fetchVouchers = async () => {
        try {
            const response = await instance.get('/vouchers/get-valid');
            setVouchers(response.data);
        } catch (error) {
            console.error('Error fetching vouchers:', error);
        }
    };


    useEffect(() => {
        fetchVouchers();
    }, []);

    const handleDecreaseQuantity = (cartItem: ICartItem) => {
        if (cartItem.quantity > 1) {
            dispatch(decreaseQuantity(cartItem.id));
        }
    };

    const handleIncreaseQuantity = (cartItem: ICartItem) => {
        const product = products?.find((product) => product.id === cartItem.id);
        if (product) {
            if (cartItem.quantity < product.inStock) {
                dispatch(increaseQuantity(cartItem.id));
            } else {
                toast.error('Quantity exceeds available stock.');
                dispatch(updateQuantity({ id: cartItem.id, quantity: product.inStock }));
            }
        }
    };

    const handleQuantityChange = (cartItem: ICartItem, quantity: number) => {
        const product = products?.find((product) => product.id === cartItem.id);
        if (product) {
            if (quantity <= product.inStock) {
                if (quantity > 0) {
                    dispatch(updateQuantity({ id: cartItem.id, quantity }));
                }
            } else {
                toast.error('Quantity exceeds available stock.');
                dispatch(updateQuantity({ id: cartItem.id, quantity: product.inStock }));
            }
        }
    };

    const handleRemoveFromCart = (cartItem: ICartItem) => {
        dispatch(removeFromCart(cartItem.id));
        toast.error(`Removed ${cartItem.name} from cart.`);
    };

    const getVoucher = async (id: string) => {
        try {
            const response = await instance.get(`/vouchers/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching voucher:', error);
            toast.error('Failed to fetch voucher.');
            return null;
        }
    };

    const handleApplyVoucher = async () => {
        const voucher = await getVoucher(selectedVoucherId);
        const totalAmount = calculateTotal(cartItems);
        const today = new Date();
        if (voucher) {
            if (voucher.quantity === 0) {
                toast.error(`Voucher ${voucher.code} - ${voucher.name} is no longer available.`);
                return;
            }
            const fromDate = new Date(voucher.from);
            const toDate = new Date(voucher.to);
            if (today < fromDate || today > toDate) {
                 toast.error(`Voucher ${voucher.code} - ${voucher.name} is not valid today.`);
                return;
            }
            if (voucher.status === 'Active' && totalAmount >= voucher.minOrderValue) {
                setDiscountValue(voucher.value);
                toast.success(`Successfully applied voucher ${voucher.code} - ${voucher.name}!`);
            } else {
                toast.error(`Invalid voucher or order value does not meet the required minimum.`);
            }
        } else {
            toast.error(`Invalid or expired voucher.`);
        }
    };

    const handleCheckout = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // Check if any cart item's quantity exceeds the available stock
        let hasExceedingQuantity = false;
        const updatedCartItems = cartItems?.map(item => {
            const product = products?.find((product) => product.id === item.id);
            if (product && item.quantity > product.inStock) {
                toast.error(`Quantity of ${item.name} exceeds available stock. Adjusted to maximum available.`);
                hasExceedingQuantity = true;
                return { ...item, quantity: product.inStock };
            }
            return item;
        });

        if (hasExceedingQuantity) {
            // Update cart items in the store
            updatedCartItems?.forEach(item => {
                dispatch(updateQuantity({ id: item.id, quantity: item.quantity }));
            });
            return;
        }

        const totalAmount = calculateTotal(cartItems);
        const finalAmount = totalAmount - discountValue;

        const phoneRegex = /((09|03|07|08|05)+([0-9]{8})\b)/g;
        if (!phone?.match(phoneRegex)) {
            toast.error('Invalid phone number format.');
            return;
        }

        if (finalAmount <= 0) {
            toast.error('Total amount should be greater than zero.');
            return;
        }

        const orderPayload = {
            amount: finalAmount,
            discount: discountValue,
            receiver,
            address,
            phone,
            paymentMethod,
            orderVouchers: selectedVoucherId ? [{ voucherId: selectedVoucherId }] : [],
            orderDetails: cartItems ? cartItems.map(item => ({
                productId: item.id,
                quantity: item.quantity,
                price: item.price
            })) : []
        };

        try {
            const response = await instance.post('/orders', orderPayload);
            const orderId = response.data.id; // Assume the order ID is in the response data

            // Clear the cart items
            cartItems && cartItems.forEach(item => dispatch(removeFromCart(item.id)));

            if (paymentMethod === "Cash") {
                navigate('/thank-you');
            } else if (paymentMethod === "VNPay") {
                const paymentResponse = await instance.post('/payments/request', {
                    amount: finalAmount,
                    orderId: orderId
                });

                const paymentUrl = paymentResponse.data;
                if (paymentUrl) {
                    window.location.href = paymentUrl;
                } else {
                    toast.error('Failed to get payment URL.');
                    console.error('Payment URL is missing:', paymentResponse.data);
                }
            }
        } catch (error) {
            console.error('Error creating order:', error);
            toast.error('Failed to create order.');
        }
    };

    return (
        <>
            <Header />
            <section className="text-gray-700 body-font overflow-hidden bg-white min-h-screen">
                <div className="container px-5 py-24 mx-auto">
                    <div className="flex flex-wrap -m-4">
                        <div className="lg:w-2/3 w-full p-4">
                            <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
                            {cartItems && cartItems.length > 0 ? (
                                cartItems.map((item) => (
                                    <div key={item.id} className="w-full p-4">
                                        <div className="flex items-center justify-between shadow-lg rounded-lg">
                                            <img
                                                alt={item?.name ? item.name.toString() : ""}
                                                className="w-24 h-24 object-cover object-center rounded border border-gray-200"
                                                src={item?.thumbnailUrl ? item.thumbnailUrl.toString() : ""}
                                            />
                                            <div className="flex-grow flex flex-col px-4">
                                                <h2 className="text-gray-900 title-font text-lg font-medium">{item.name}</h2>
                                                <p className="text-gray-900 title-font font-semibold">{formatCurrency(item.price)}</p>
                                            </div>
                                            <div className="flex items-center justify-center gap-2 w-1/3">
                                                <button
                                                    onClick={() => handleDecreaseQuantity(item)}
                                                    className="text-white bg-red-600 border-0 py-2 px-5 focus:outline-none hover:bg-red-700 rounded-lg font-bold flex items-center justify-center"
                                                >
                                                    <FaMinus />
                                                </button>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={item.quantity}
                                                    onChange={(e) => handleQuantityChange(item, parseInt(e.target.value))}
                                                    className="w-16 h-8 text-center border border-gray-400 rounded"
                                                />
                                                <button
                                                    onClick={() => handleIncreaseQuantity(item)}
                                                    className="text-white bg-red-600 border-0 py-2 px-5 focus:outline-none hover:bg-red-700 rounded-lg flex items-center justify-center"
                                                >
                                                    <FaPlus />
                                                </button>
                                                <button
                                                    onClick={() => handleRemoveFromCart(item)}
                                                    className="text-white bg-red-600 border-0 py-2 px-3 focus:outline-none hover:bg-red-700 rounded-lg flex items-center justify-center"
                                                >
                                                    <FaTrashAlt />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center w-full mt-8 text-lg font-semibold">Your shopping cart is empty.</p>
                            )}
                        </div>
                        <div className="lg:w-1/3 w-full mt-12 lg:mt-0">
                            <div className="flex flex-col items-center justify-center">
                                <form className="mt-8 w-full" onSubmit={handleCheckout}>
                                    <h2 className="text-gray-900 text-lg font-medium mb-3">Shipping Information</h2>
                                    <div className="flex flex-col mb-4">
                                        <input
                                            type="text"
                                            placeholder="Receiver Name"
                                            value={receiver}
                                            onChange={(e) => setReceiver(e.target.value)}
                                            required
                                            className="border-2 border-gray-200 mb-2 py-2 px-4 w-full rounded-lg focus:outline-none"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Address"
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            required
                                            className="border-2 border-gray-200 mb-2 py-2 px-4 w-full rounded-lg focus:outline-none"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Phone"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            required
                                            className="border-2 border-gray-200 mb-2 py-2 px-4 w-full rounded-lg focus:outline-none"
                                        />
                                        <div className="flex items-center mb-2">
                                            <select
                                                id="vouchers"
                                                value={selectedVoucherId}
                                                onChange={(e) => setSelectedVoucherId(e.target.value)}
                                                className="border-2 border-gray-200 py-2 px-4 w-full rounded-lg focus:outline-none mr-2"
                                            >
                                                <option value="">Select a voucher</option>
                                                {vouchers.length > 0 && vouchers.map((item) => (
                                                    <option key={item.id} value={item.id}>{`${item.code} - ${item.name} - MinOrderPrice: ${formatCurrency(item.minOrderValue)}`}</option>
                                                ))}
                                            </select>
                                            <button
                                                type="button"
                                                onClick={handleApplyVoucher}
                                                className="text-white bg-blue-600 border-0 py-2 px-4 focus:outline-none hover:bg-blue-700 rounded-lg"
                                            >
                                                Apply
                                            </button>
                                        </div>
                                        <div className="flex items-center justify-center mb-4 space-x-8">
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    value="Cash"
                                                    checked={paymentMethod === "Cash"}
                                                    onChange={() => setPaymentMethod("Cash")}
                                                    className="mr-2"
                                                />
                                                <FaMoneyBillWave className="mr-2" /> COD
                                            </label>
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    value="VNPay"
                                                    checked={paymentMethod === "VNPay"}
                                                    onChange={() => setPaymentMethod("VNPay")}
                                                    className="mr-2"
                                                />
                                                <FaCreditCard className="mr-2" /> VNPay
                                            </label>
                                        </div>
                                    </div>
                                    <div className="border-t-2 pt-4">
                                        <p className="text-xl text-gray-900 mb-4 flex justify-between">
                                            <span>Total:</span> <span>{formatCurrency(calculateTotal(cartItems))}</span>
                                        </p>
                                        <p className="text-xl text-gray-900 mb-4 flex justify-between">
                                            <span>Discount:</span> <span className="text-red-500">{formatCurrency(discountValue)}</span>
                                        </p>
                                        <p className="text-xl text-gray-900 mb-4 flex justify-between">
                                            <span>Final Total:</span> <span>{formatCurrency(calculateTotal(cartItems) - discountValue)}</span>
                                        </p>
                                    </div>
                                    <button
                                        type="submit"
                                        className="text-white bg-red-600 border-0 py-2 px-8 mt-4 w-full focus:outline-none hover:bg-red-700 rounded-lg"
                                    >
                                        Checkout
                                    </button>
                                    <div className="mt-4 flex justify-center">
                                        <a
                                            href="/home"
                                            className="text-blue-600 hover:underline"
                                        >
                                            or Continue Shopping →
                                        </a>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
};

export default ViewCart;
