import React, { useEffect } from 'react';

interface Props {
  // Define orderId as a string prop
  orderId: string;
}

const OrderDetailPage: React.FC<Props> = ({ orderId }) => {
  // Example of using orderId in component logic
  useEffect(() => {
    // Fetch order details based on orderId
    console.log('Fetching order details for orderId:', orderId);
    // Add your logic here to fetch and display order details
  }, [orderId]); // Include orderId in dependency array if needed

  return (
    <div>
      <h1>Order Detail Page</h1>
      <p>Order ID: {orderId}</p>
      {/* Add more components and logic to display order details */}
    </div>
  );
};

export default OrderDetailPage;
