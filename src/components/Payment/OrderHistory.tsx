import { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaStar, FaMoneyBillWave, FaCreditCard, FaClock, FaCheckCircle, FaTimesCircle, FaTruck, FaBoxOpen, FaSpinner } from 'react-icons/fa';
import Header from "../../components/Layout/Header";
import Footer from "../../components/Layout/Footer";
import instance from "../../service/api/customAxios";
import { Spinner } from "../Layout/Spinner";

interface Customer {
  id: string;
  username: string;
  name: string;
  phone: string | null;
  address: string | null;
  point: number;
  status: string;
  createAt: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  origin: string;
  thumbnailUrl: string;
  brand: string;
  price: number;
  inStock: number;
  sold: number;
  status: string;
}

interface OrderDetail {
  id: string;
  product: Product;
  quantity: number;
  price: number;
  hasFeedback: boolean;
}

interface Order {
  id: string;
  customer: Customer;
  amount: number;
  receiver: string;
  address: string;
  phone: string;
  paymentMethod: string;
  isPayment: boolean;
  status: string;
  createAt: string;
  discount: number;
  orderDetails: OrderDetail[];
  note: string | null;
}

const OrderHistory = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [displayedOrders, setDisplayedOrders] = useState<number>(5);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [feedback, setFeedback] = useState({ message: '', star: 0, orderDetailId: '', customerId: '' });
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const customerId = localStorage.getItem("customerId");
  const [isCancelModalOpen, setIsCancelModalOpen] = useState<boolean>(false);
  const [cancelNote, setCancelNote] = useState<string>("");
  const [orderToCancel, setOrderToCancel] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await instance.post('/orders/filter?pageSize=100', { customerId });
        console.log("API Response:", response.data.data);
        const sortedOrders = response.data.data.sort((a: Order, b: Order) => {
          return new Date(b.createAt).getTime() - new Date(a.createAt).getTime();
        });

        setOrders(sortedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }finally{
          setIsLoading(false);
      }
    };

    fetchOrders();
  }, [customerId]);

  const formatCurrency = (amount: number): string => {
    return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  };

  const cancelOrder = async () => {
    if (!orderToCancel) return;
  
    try {
      const response = await instance.put('/orders/cancel', {
        orderId: orderToCancel.id,
        note: cancelNote,
      });
  
      if (response.status === 200) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderToCancel.id ? { ...order, status: 'Cancelled' } : order
          )
        );
        setIsCancelModalOpen(false);
        setCancelNote("");
        toast.success("Order canceled successfully!");
      } else {
        console.error('Failed to cancel order');
        toast.error("Failed to cancel order. Please try again later.");
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.error("Failed to cancel order. Please try again later.");
    }
  };
  

  const handleSendFeedback = async () => {
    try {
      const response = await instance.post('/feedbacks/create', feedback);
      console.log("Feedback submitted successfully:", response.data);
      toast.success("Feedback submitted successfully!");
      closeFeedbackModal();
      return response.data;
    } catch (error: any) {
      console.error("Error submitting feedback:", error);
      toast.error(error.response.data);
    }
  };

  const openFeedbackModal = (product: Product, orderDetailId: string) => {
    setSelectedProduct(product);
    setFeedback({ message: '', star: 0, orderDetailId, customerId: customerId || '' });
    setIsFeedbackModalOpen(true);
  };

  const closeFeedbackModal = () => {
    setIsFeedbackModalOpen(false);
    setSelectedProduct(null);
  };

  const renderCancelButton = (order: Order) => {
    if (order.status == 'Pending') {
      return (
        <button
          onClick={() => openCancelModal(order)}
          className="text-white bg-red-600 border-0 py-2 px-4 focus:outline-none hover:bg-red-700 rounded-lg"
        >
          Cancel Order
        </button>
      );
    }else {
      return (
        <button
          className="text-gray-400 bg-gray-200 border-0 py-2 px-4 focus:outline-none rounded-lg cursor-not-allowed"
          disabled
        >
          Cancel Order
        </button>
      );
    }
  };
  


  const renderFeedbackButton = (order: Order, orderDetail: OrderDetail) => {
    if (order.status === 'Completed' && !orderDetail.hasFeedback) {
      return (
        <button
          onClick={() => openFeedbackModal(orderDetail.product, orderDetail.id)}
          className="text-white bg-green-600 border-0 py-2 px-4 mt-2 focus:outline-none hover:bg-green-700 rounded-lg"
        >
          Feedback
        </button>
      );
    } else {
      return (
        <button
          className="text-gray-400 bg-gray-200 border-0 py-2 px-4 mt-2 focus:outline-none rounded-lg cursor-not-allowed"
          disabled
        >
          Feedback
        </button>
      );
    }
  };
  

  const handleOrderDetail = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "text-yellow-500";
      case "Paid":
        return "text-purple-600";
      case "Canceled":
        return "text-red-600";
      case "Confirmed":
        return "text-blue-600";
      case "Delivering":
        return "text-yellow-600";
      case "Completed":
        return "text-green-600";
      default:
        return "text-pink-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pending":
        return <FaClock className="text-yellow-500" />;
      case "Paid":
        return <FaCreditCard className="text-purple-600" />;
      case "Canceled":
        return <FaTimesCircle className="text-red-600" />;
      case "Confirmed":
        return <FaCheckCircle className="text-blue-600" />;
      case "Delivering":
        return <FaTruck className="text-yellow-600" />;
      case "Completed":
        return <FaBoxOpen className="text-green-600" />;
      default:
        return <FaSpinner className="text-pink-500" />;
    }
  };

  const renderOrderDetails = (order: Order | null) => {
    if (!order) return null;
  
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
        <div className="bg-white p-8 rounded-lg shadow-lg w-1/2 overflow-auto max-h-screen">
          <h2 className="text-2xl font-bold mb-4">Order Details</h2>
          <p><strong>Receiver:</strong> {order.receiver}</p>
          <p><strong>Phone:</strong> {order.phone}</p>
          <p><strong>Address:</strong> {order.address}</p>
          {order.note && order.note.split('\n').map((note, index) => (
            <p key={index}><strong>Note {index + 1}:</strong> {note}</p>
          ))}
          <div className="flex items-center">
            <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
            <span className="ml-2">{getPaymentMethodIcon(order.paymentMethod)}</span>
          </div>
          <p><strong>Payment Status:</strong> {order.isPayment ? <span className="text-green-600">Paid</span> : <span className="text-red-600">Unpaid</span>}</p>
          <p className={`flex items-center ${getStatusColor(order.status)}`}>
            <span>{getStatusIcon(order.status)}</span>
            <span className="ml-2"><strong>Order Status:</strong> {order.status}</span>
          </p>
          <p><strong>Discount:</strong> {formatCurrency(order.discount)}</p>
          <p><strong>Date Created:</strong> {new Date(order.createAt).toLocaleString()}</p>
          <p><strong>Total Amount:</strong> {formatCurrency(order.amount)}</p>
          <h3 className="text-lg font-semibold mt-4">Products:</h3>
          <div className="grid grid-cols-2 gap-4">
            {order.orderDetails.map((detail) => (
              <div key={detail.id} className="col-span-1 border border-gray-300 p-4 rounded-lg">
                <p><strong>Product:</strong> {detail.product.name}</p>
                <p><strong>Quantity:</strong> {detail.quantity}</p>
                <p><strong>Price:</strong> {formatCurrency(detail.price)}</p>
              </div>
            ))}
          </div>
          <button
            onClick={closeModal}
            className="text-white bg-blue-600 border-0 py-2 px-4 focus:outline-none hover:bg-blue-700 rounded-lg mt-4"
          >
            Close
          </button>
        </div>
      </div>
    );
  };
  

  const renderFeedbackModal = () => {
    if (!selectedProduct) return null;

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
        <div className="bg-white p-8 rounded-lg shadow-lg w-1/2">
          <h2 className="text-2xl font-bold mb-4">Feedback for {selectedProduct.name}</h2>
          <div className="flex mb-4">
            {[...Array(5)].map((_, index) => (
              <FaStar
                key={index}
                size={30}
                className={index < feedback.star ? 'text-yellow-500' : 'text-gray-400'}
                onClick={() => setFeedback({ ...feedback, star: index + 1 })}
              />
            ))}
          </div>
          <textarea
            className="w-full p-2 border border-gray-300 rounded-lg"
            rows={4}
            value={feedback.message}
            onChange={(e) => setFeedback({ ...feedback, message: e.target.value })}
            placeholder="Write your feedback here..."
          ></textarea>
          <button
            onClick={handleSendFeedback}
            className="text-white bg-blue-600 border-0 py-2 px-4 mt-4 focus:outline-none hover:bg-blue-700 rounded-lg"
          >
            Submit Feedback
          </button>
          <button
            onClick={closeFeedbackModal}
            className="text-white bg-red-600 border-0 py-2 px-4 mt-4 focus:outline-none hover:bg-red-700 rounded-lg ml-2"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  };

  const getPaymentMethodIcon = (paymentMethod: string) => {
    switch (paymentMethod) {
      case 'Cash':
        return <FaMoneyBillWave className="text-green-600" />;
      case 'VNPay':
        return <FaCreditCard className="text-blue-600" />;
      default:
        return null;
    }
  };

  const loadMoreOrders = () => {
    setDisplayedOrders(prev => prev + 5);
  };
  const openCancelModal = (order: Order) => {
  setOrderToCancel(order);
  setIsCancelModalOpen(true);
};
const renderCancelModal = () => {
  if (!orderToCancel) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-1/2">
        <h2 className="text-2xl font-bold mb-4">Cancel Order</h2>
        <p>Are you sure you want to cancel the order for <strong>{orderToCancel.receiver}</strong>?</p>
        <textarea
          value={cancelNote}
          onChange={(e) => setCancelNote(e.target.value)}
          className="w-full p-2 mt-4 border border-gray-300 rounded-lg"
          placeholder="Reason for cancellation"
        />
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => setIsCancelModalOpen(false)}
            className="text-gray-700 bg-gray-200 border-0 py-2 px-4 rounded-lg mr-2 focus:outline-none"
          >
            Cancel
          </button>
          <button
            onClick={cancelOrder}
            className="text-white bg-red-600 border-0 py-2 px-4 rounded-lg focus:outline-none hover:bg-red-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

return (
  <>
      <Header />
      <div className="flex flex-col min-h-screen">
        <section className="text-gray-700 body-font overflow-hidden bg-white flex-grow">
          <div className="container px-5 py-24 mx-auto">
            <h1 className="text-3xl font-bold text-center mb-12">Order History</h1>
            <div className="lg:w-4/5 mx-auto">
              {isLoading ? (
                <div className="flex justify-center items-center">
                  <Spinner />
                </div>
              ) : !orders || orders.length === 0 ? (
                <p className="text-center w-full mt-8 text-lg font-semibold">No orders found.</p>
              ) : (
                orders.slice(0, displayedOrders).map((order) => (
                  <div key={order.id} className="lg:w-3/4 w-full mb-6 p-6 border border-gray-200 rounded-lg shadow-md mx-auto">
                    <div className="flex flex-col lg:flex-row justify-between items-start mb-4">
                      <div className="w-full lg:w-1/2 pr-0 lg:pr-4 mb-4 lg:mb-0">
                        <h3 className="text-lg font-medium text-gray-800 mb-4">Order Details:</h3>
                        {order.orderDetails.map((detail) => (
                          <div key={detail.id} className="mt-2">
                            <p className="text-gray-600"><span className="font-semibold">Product:</span> {detail.product.name}</p>
                            <p className="text-gray-600"><span className="font-semibold">Quantity:</span> {detail.quantity}</p>
                            <p className="text-gray-600"><span className="font-semibold">Price:</span> {formatCurrency(detail.price)}</p>
                            {renderFeedbackButton(order, detail)}
                          </div>
                        ))}
                      </div>
                      <div className="w-full lg:w-1/2 pl-0 lg:pl-4">
                        <div className="mb-2">
                          <h2 className="text-xl font-semibold text-gray-900 mb-1">{order.receiver}</h2>
                          <p className={`text-sm font-medium flex items-center ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            <span className="ml-2"><span className="font-semibold">Status:</span> {order.status}</span>
                          </p>
                          {order.note && order.note.split('\n').map((note, index) => (
                            <p key={index} className="text-gray-600 mt-2"><span className="font-semibold">Note {index + 1}:</span> {note}</p>
                          ))}
                        </div>
                        <div className="mt-4 text-center">
                          <p className="text-2xl font-semibold text-gray-800 flex items-center justify-center">
                            Payment Method: <span className="ml-2 text-3xl">{getPaymentMethodIcon(order.paymentMethod)}</span>
                          </p>
                        </div>
                        <div className="mt-4 text-center">
                          <p className="text-xl font-semibold text-gray-800">Order Total: {formatCurrency(order.amount)} </p>
                        </div>
                        <div className="mt-4">
                          {renderCancelButton(order)}
                          <button
                            onClick={() => handleOrderDetail(order)}
                            className="text-white bg-blue-600 border-0 py-2 px-4 ml-2 focus:outline-none hover:bg-blue-700 rounded-lg"
                          >
                            Order Detail
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
              {displayedOrders < orders.length && (
                <div className="text-center mt-8">
                  <button
                    onClick={loadMoreOrders}
                    className="text-white bg-blue-600 border-0 py-2 px-4 focus:outline-none hover:bg-blue-700 rounded-lg"
                  >
                    Load More
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
        <Footer />
      </div>
      <ToastContainer />
      {isModalOpen && renderOrderDetails(selectedOrder)}
      {isFeedbackModalOpen && renderFeedbackModal()}
      {isCancelModalOpen && renderCancelModal()}
    </>
);

  
}

export default OrderHistory;
