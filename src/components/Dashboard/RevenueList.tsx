import { MRT_ColumnDef } from "material-react-table";
import { useEffect, useState } from "react";
import { Typography, Stack, Divider, Box } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import CommonTable from "../Table/CommonTable";
import { IProduct } from "../../models/Produdct";
import instance from "../../service/api/customAxios";

interface StatisticOrder {
  revenue: number,
  discount: number,
  pendingValue: number,
  canceledValue: number,
  revenueFromCash: number,
  revenueFromVNPay: number,
  totalOrders: number,
  canceledOrders: number,
  completedOrders: number,
  ongoingOrders: number,
  pendingPaymentOrders: number,
  from: string,
  to: string
}

const addDotNumber = (money: number) => {
  if (money >= 1e9) return (money / 1e9).toFixed(1) + "B";
  if (money >= 1e6) return (money / 1e6).toFixed(1) + "M";
  if (money >= 1e3) return (money / 1e3).toFixed(1) + "K";
  return money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const columns: MRT_ColumnDef<IProduct>[] = [
  {
    accessorKey: "name",
    header: "Product name",
  },
  {
    accessorKey: "origin",
    header: "Origin",
  },
  {
    accessorKey: "brand",
    header: "Brand",
  },
  {
    accessorKey: "sold",
    header: "Sold",
  },
  {
    accessorKey: "revenue",
    header: "Revenue",
    Cell: ({ row }) => (
      <Typography sx={{ alignItems: 'center' }}>{row.original.revenue && addDotNumber(row.original.revenue)} đ</Typography>
    ),
  },
  {
    accessorKey: "rating",
    header: "Rating",
    Cell: ({ row }) => (
      <Typography sx={{ alignItems: 'center' }}>{row.original.rating && row.original.rating} / 5</Typography>
    ),
  },
];

const RevenueList = () => {
  const [revenue, setRevenue] = useState<IProduct[] | []>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [dashboardOrder, setDashboardOrder] = useState<StatisticOrder | null>(null);

  const load = async () => {
    await instance.post('/statistics/products', { params: { pageSize: 0, pageNumber: 1000 } }, {})
      .then(res => {
        setTotalRevenue(res.data.revenue);
        setRevenue(res.data.productRevenues);
      })
      .catch(err => console.log(err));
  }

  const load1 = async () => {
    await instance.post('/statistics/orders', { params: { from: "", to: "" } })
      .then((res: any) => {
        setDashboardOrder(res.data);
      })
      .catch(err => console.log(err));
  }

  useEffect(() => {
    load();
    load1();
  }, []);

  const orderData = [
    { name: 'Pending Payment Orders', value: dashboardOrder?.pendingPaymentOrders },
    { name: 'Ongoing Orders', value: dashboardOrder?.ongoingOrders },
    { name: 'Canceled Orders', value: dashboardOrder?.canceledOrders },
    { name: 'Completed Orders', value: dashboardOrder?.completedOrders },
    { name: 'Total Orders', value: dashboardOrder?.totalOrders },
  ];

  const revenueData = [
    { name: 'Revenue From Cash', value: dashboardOrder?.revenueFromCash },
    { name: 'Revenue From VNPay', value: dashboardOrder?.revenueFromVNPay },
  ];

  return (
    <Stack className="m-8">
      <Typography className="text-3xl font-bold mb-4 text-blue-600">Total Revenue: {addDotNumber(totalRevenue)} đ</Typography>
      <Divider className="my-4" />
      {revenue.length > 0 && <CommonTable note={false}
        columns={columns}
        data={revenue}
      />}
      <Typography className="text-3xl font-bold mt-8 mb-4 text-blue-600">Orders</Typography>
      <Box className="w-full h-96 mt-4">
        <ResponsiveContainer>
          <BarChart data={orderData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={addDotNumber} />
            <Tooltip formatter={addDotNumber} />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
      <Typography className="text-3xl font-bold mt-8 mb-4 text-blue-600">Revenue Breakdown</Typography>
      <Box className="w-full h-96 mt-4">
        <ResponsiveContainer>
          <BarChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={addDotNumber} />
            <Tooltip formatter={addDotNumber} />
            <Legend />
            <Bar dataKey="value" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Stack>
  );
};

export default RevenueList;
