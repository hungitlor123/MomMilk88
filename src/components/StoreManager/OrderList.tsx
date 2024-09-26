import React, { useEffect, useState } from "react";
import { Stack, MenuItem, Select, Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Grid, IconButton  } from "@mui/material";
import { Close } from "@mui/icons-material";
import CommonTable from "../Table/CommonTable";
import instance from "../../service/api/customAxios";
import { MRT_ColumnDef, MRT_Cell } from "material-react-table";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

interface Customer {
  id: string;
  username: string;
  name: string;
  phone: string;
  address: string;
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
  rating: number;
  productCategories: Array<{
    id: string;
    category: {
      id: string;
      name: string;
    };
  }>;
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
  note: string | null;
  orderDetails: OrderDetail[];
}

const OrderManagementPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelNote, setCancelNote] = useState("");
  const [orderToCancel, setOrderToCancel] = useState<Order | null>(null);
  const [isDeliveryNoteModalOpen, setIsDeliveryNoteModalOpen] = useState(false);
  const [deliveryNote, setDeliveryNote] = useState("");
  const [orderToDeliver, setOrderToDeliver] = useState<Order | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const loadOrders = async () => {
    try {
      const response = await instance.post("/orders/filter?pageSize=1000", {});
      const sortedOrders = response.data.data.sort((a: Order, b: Order) =>
        new Date(b.createAt).getTime() - new Date(a.createAt).getTime()
      );
      setOrders(sortedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders.");
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string, note?: string) => {
    try {
      let endpoint: string;
      let data = {};
      switch (newStatus) {
        case "Confirmed":
          endpoint = `/orders/confirm?orderId=${orderId}`;
          break;
        case "Delivering":
          endpoint = `/orders/delivery-note`;
          data = { orderId, note };
          break;
        case "Completed":
          endpoint = `/orders/complete?orderId=${orderId}`;
          break;
        case "Canceled":
          endpoint = `/orders/cancel`;
          data = { orderId, note };
          break;
        default:
          throw new Error("Unknown status");
      }

      const response = ["Delivering", "Canceled"].includes(newStatus)
        ? await instance.put(endpoint, data)
        : await instance.put(endpoint);

      console.log("Update response:", response);
      toast.success("Order status updated successfully.");
      loadOrders();
    } catch (error) {
      console.error(`Error updating order ${orderId} status:`, error);

      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data);
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to update order status.");
      }
    }
  };

  const handleStatusChange = (orderId: string, newStatus: string) => {
    if (newStatus === "Canceled") {
      const order = orders.find((order) => order.id === orderId) || null;
      setOrderToCancel(order);
      setIsCancelModalOpen(true);
    } else if (newStatus === "Delivering") {
      const order = orders.find((order) => order.id === orderId) || null;
      setOrderToDeliver(order);
      setIsDeliveryNoteModalOpen(true);
    } else {
      updateOrderStatus(orderId, newStatus);
    }
  };

  const handleRowDoubleClick = (row: Order) => {
    setSelectedOrder(row);
    setIsDetailModalOpen(true);
  };

  const cancelOrder = () => {
    if (orderToCancel) {
      updateOrderStatus(orderToCancel.id, "Canceled", cancelNote);
      setIsCancelModalOpen(false);
      setCancelNote("");
      setOrderToCancel(null);
    }
  };

  const deliverOrder = () => {
    if (orderToDeliver) {
      updateOrderStatus(orderToDeliver.id, "Delivering", deliveryNote);
      setIsDeliveryNoteModalOpen(false);
      setDeliveryNote("");
      setOrderToDeliver(null);
    }
  };

  const renderCancelModal = () => {
    if (!orderToCancel) return null;

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
        <div className="bg-white p-8 rounded-lg shadow-lg w-1/2">
          <Typography variant="h6" gutterBottom>
            Cancel Order
          </Typography>
          <Typography variant="body1" gutterBottom>
            Are you sure you want to cancel the order for <strong>{orderToCancel.receiver}</strong>?
          </Typography>
          <textarea
            value={cancelNote}
            onChange={(e) => setCancelNote(e.target.value)}
            className="w-full p-2 mt-4 border border-gray-300 rounded-lg"
            placeholder="Reason for cancellation"
          />
          <div className="mt-4 flex justify-end">
            <Button onClick={() => setIsCancelModalOpen(false)} color="primary" variant="contained">
              Cancel
            </Button>
            <Button onClick={cancelOrder} color="secondary" variant="contained" style={{ marginLeft: "8px" }}>
              Confirm
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderDeliveryNoteModal = () => {
    if (!orderToDeliver) return null;

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
        <div className="bg-white p-8 rounded-lg shadow-lg w-1/2">
          <Typography variant="h6" gutterBottom>
            Delivery Note
          </Typography>
          <Typography variant="body1" gutterBottom>
            Enter the delivery note for the order of <strong>{orderToDeliver.receiver}</strong>:
          </Typography>
          <textarea
            value={deliveryNote}
            onChange={(e) => setDeliveryNote(e.target.value)}
            className="w-full p-2 mt-4 border border-gray-300 rounded-lg"
            placeholder="Delivery note"
          />
          <div className="mt-4 flex justify-end">
            <Button onClick={() => setIsDeliveryNoteModalOpen(false)} color="primary" variant="contained">
              Cancel
            </Button>
            <Button onClick={deliverOrder} color="secondary" variant="contained" style={{ marginLeft: "8px" }}>
              Confirm
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderDetailModal = () => {
    if (!selectedOrder) return null;
  
    const formatCurrency = (value : number) => new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  
    return (
      <Dialog
        open={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ style: { borderRadius: 12, padding: 16, boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.1)' } }}
      >
        <DialogTitle sx={{ position: 'relative', paddingBottom: '16px' }}>
          <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
            Order Details
          </Typography>
          <IconButton
            aria-label="close"
            onClick={() => setIsDetailModalOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12} sx={{ backgroundColor: '#f9f9f9', padding: '8px 16px', borderRadius: '8px', marginBottom: '16px' }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#3f51b5' }}>Order Information</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1"><strong>Order ID:</strong> {selectedOrder.id}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1"><strong>Receiver:</strong> {selectedOrder.receiver}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1"><strong>Address:</strong> {selectedOrder.address}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1"><strong>Phone:</strong> {selectedOrder.phone}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1"><strong>Payment Method:</strong> {selectedOrder.paymentMethod}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1"><strong>Status:</strong> {selectedOrder.status}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1"><strong>Created At:</strong> {new Date(selectedOrder.createAt).toLocaleString()}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1"><strong>Amount:</strong> {formatCurrency(selectedOrder.amount)}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1"><strong>Discount:</strong> {formatCurrency(selectedOrder.discount)}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1"><strong>Note:</strong> {selectedOrder.note}</Typography>
            </Grid>
            <Grid item xs={12} sx={{ backgroundColor: '#f9f9f9', padding: '8px 16px', borderRadius: '8px', marginTop: '16px', marginBottom: '16px' }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#3f51b5' }}>Customer Details</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1"><strong>Name:</strong> {selectedOrder.customer.name}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1"><strong>Username:</strong> {selectedOrder.customer.username}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1"><strong>Phone:</strong> {selectedOrder.customer.phone}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1"><strong>Address:</strong> {selectedOrder.customer.address}</Typography>
            </Grid>
            <Grid item xs={12} sx={{ backgroundColor: '#f9f9f9', padding: '8px 16px', borderRadius: '8px', marginTop: '16px' }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#3f51b5' }}>Order Details</Typography>
            </Grid>
            {selectedOrder.orderDetails.map((detail) => (
              <React.Fragment key={detail.id}>
                <Grid item xs={12}>
                  <Typography variant="subtitle1"><strong>Product Name:</strong> {detail.product.name}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1"><strong>Quantity:</strong> {detail.quantity}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1"><strong>Price:</strong> {formatCurrency(detail.price)}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1"><strong>Total Price:</strong> {formatCurrency(detail.price * detail.quantity)}</Typography>
                </Grid>
              </React.Fragment>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDetailModalOpen(false)} color="primary" variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  
  

  useEffect(() => {
    loadOrders();
  }, []);

  const columns: MRT_ColumnDef<Order>[] = [
    {
      accessorKey: "id",
      header: "Order ID",
    },
    {
      accessorKey: "receiver",
      header: "Receiver",
    },
    {
      accessorKey: "address",
      header: "Address",
    },
    {
      accessorKey: "phone",
      header: "Phone",
    },
    {
      accessorKey: "paymentMethod",
      header: "Payment Method",
    },
    {
      accessorKey: "status",
      header: "Status",
      Cell: ({ cell, row }: { cell: MRT_Cell<Order>; row: { original: Order } }) => (
        <Select
          value={cell.getValue<string>()}
          onChange={(event) =>
            handleStatusChange(row.original.id, event.target.value as string)
          }
          disabled={cell.getValue<string>() === "Completed" || cell.getValue<string>() === "Canceled"}
          className="text-lg"
        >
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="Paid">Paid</MenuItem>
          <MenuItem value="Confirmed">Confirmed</MenuItem>
          <MenuItem value="Delivering">Delivering</MenuItem>
          <MenuItem value="Completed">Completed</MenuItem>
          <MenuItem value="Canceled">Canceled</MenuItem>
        </Select>
      ),
    },
    {
      accessorKey: "createAt",
      header: "Created At",
      Cell: ({ cell }: { cell: MRT_Cell<Order> }) =>
        new Date(cell.getValue<string>()).toLocaleString(),
    },
    {
      accessorKey: "note",
      header: "Note",
      Cell: ({ cell }: { cell: MRT_Cell<Order> }) => (
        <div className="whitespace-pre-wrap">{cell.getValue<string>()}</div>
      ),
    },
  ];

  return (
    <Stack sx={{ m: "2rem 0" }}>
      <CommonTable
        columns={columns}
        data={orders}
        note={true}
        onRowDoubleClick={(row) => handleRowDoubleClick(row)}
      />
      <ToastContainer />
      {isCancelModalOpen && renderCancelModal()}
      {isDeliveryNoteModalOpen && renderDeliveryNoteModal()}
      {isDetailModalOpen && renderDetailModal()}
    </Stack>
  );
};

export default OrderManagementPage;
