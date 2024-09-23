// Helper function to add decimals
function addDecimals(num: number): string {
  return (Math.round(num * 100) / 100).toFixed(2);
}

// Define the type for an order item
interface OrderItem {
  price: number;
  qty: number;
}

// Function to calculate prices
export function calcPrices(orderItems: OrderItem[]): {
  itemsPrice: string;
  shippingPrice: string;
  taxPrice: string;
  totalPrice: string;
} {
  // Calculate the items price in whole number (pennies) to avoid issues with
  // floating point number calculations
  const itemsPrice = orderItems.reduce(
    (acc, item) => acc + (item.price * 100 * item.qty) / 100,
    0
  );

  // Calculate the shipping price
  const shippingPrice = itemsPrice > 100 ? 0 : 10;

  // Calculate the tax price
  const taxPrice = 0.15 * itemsPrice;

  // Calculate the total price
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  // return prices as strings fixed to 2 decimal places
  return {
    itemsPrice: addDecimals(itemsPrice),
    shippingPrice: addDecimals(shippingPrice),
    taxPrice: addDecimals(taxPrice),
    totalPrice: addDecimals(totalPrice),
  };
}
