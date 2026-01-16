import React from "react";
import GlobalModal from "../GlobalModal";
import PermissionGuard from "../PermissionGuard";

const OrderDetailModal = ({ order, isOpen, onClose, onUpdateStatus }) => {
  if (!order) return null;

  return (
    <GlobalModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Order Details - ${order.orderNumber}`}
      className="w-full max-w-4xl"
    >
      <div className="space-y-6">
        {/* Order Information */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <h3 className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
              Order Information
            </h3>
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  Order Number:
                </span>{" "}
                <span className="text-gray-600 dark:text-gray-400">
                  {order.orderNumber}
                </span>
              </p>
              <p className="text-sm">
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  Status:
                </span>{" "}
                <span className="text-gray-600 dark:text-gray-400">
                  {order.status}
                </span>
              </p>
              <p className="text-sm">
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  Order Date:
                </span>{" "}
                <span className="text-gray-600 dark:text-gray-400">
                  {new Date(order.orderDate).toLocaleString()}
                </span>
              </p>
              {order.deliveryDate && (
                <p className="text-sm">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    Delivery Date:
                  </span>{" "}
                  <span className="text-gray-600 dark:text-gray-400">
                    {new Date(order.deliveryDate).toLocaleString()}
                  </span>
                </p>
              )}
              {order.courierName && (
                <p className="text-sm">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    Courier:
                  </span>{" "}
                  <span className="text-gray-600 dark:text-gray-400">
                    {order.courierName}
                  </span>
                </p>
              )}
              {order.courierTrackingNumber && (
                <p className="text-sm">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    Tracking Number:
                  </span>{" "}
                  <span className="text-gray-600 dark:text-gray-400">
                    {order.courierTrackingNumber}
                  </span>
                </p>
              )}
            </div>
          </div>

          <div>
            <h3 className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
              Payment Information
            </h3>
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  Payment Method:
                </span>{" "}
                <span className="text-gray-600 dark:text-gray-400">
                  {order.paymentMethod}
                </span>
              </p>
              <p className="text-sm">
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  Payment Status:
                </span>{" "}
                <span className="text-gray-600 dark:text-gray-400">
                  {order.paymentStatus}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Customer Information */}
        {order.user && (
          <div>
            <h3 className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
              Customer Information
            </h3>
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  Name:
                </span>{" "}
                <span className="text-gray-600 dark:text-gray-400">
                  {order.user.fullName}
                </span>
              </p>
              <p className="text-sm">
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  Email:
                </span>{" "}
                <span className="text-gray-600 dark:text-gray-400">
                  {order.user.email || "N/A"}
                </span>
              </p>
              <p className="text-sm">
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  Phone:
                </span>{" "}
                <span className="text-gray-600 dark:text-gray-400">
                  {order.user.phone}
                </span>
              </p>
            </div>
          </div>
        )}

        {/* Shipping Address */}
        {order.address && (
          <div>
            <h3 className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
              Shipping Address
            </h3>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p>{order.address.streetAddress}</p>
              <p>
                {order.address.city}, {order.address.state} {order.address.postalCode}
              </p>
              <p>{order.address.country}</p>
            </div>
          </div>
        )}

        {/* Order Items */}
        {order.items && order.items.length > 0 && (
          <div>
            <h3 className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
              Order Items
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-900/50">
                  <tr>
                    <th className="px-4 py-2 text-xs font-medium text-left text-gray-500 dark:text-gray-400">
                      Product
                    </th>
                    <th className="px-4 py-2 text-xs font-medium text-left text-gray-500 dark:text-gray-400">
                      SKU
                    </th>
                    <th className="px-4 py-2 text-xs font-medium text-left text-gray-500 dark:text-gray-400">
                      Quantity
                    </th>
                    <th className="px-4 py-2 text-xs font-medium text-left text-gray-500 dark:text-gray-400">
                      Price
                    </th>
                    <th className="px-4 py-2 text-xs font-medium text-left text-gray-500 dark:text-gray-400">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {order.items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 text-gray-900 dark:text-gray-100">
                        {item.name}
                      </td>
                      <td className="px-4 py-2 text-gray-600 dark:text-gray-400">
                        {item.sku}
                      </td>
                      <td className="px-4 py-2 text-gray-600 dark:text-gray-400">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-2 text-gray-600 dark:text-gray-400">
                        ৳{item.price?.toLocaleString() || "0"}
                      </td>
                      <td className="px-4 py-2 font-medium text-gray-900 dark:text-gray-100">
                        ৳{((item.price || 0) * (item.quantity || 0)).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Order Summary */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-end">
            <div className="space-y-2 w-full max-w-xs">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                <span className="text-gray-900 dark:text-gray-100">
                  ৳{order.subtotal?.toLocaleString() || "0"}
                </span>
              </div>
              {order.tax > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Tax:</span>
                  <span className="text-gray-900 dark:text-gray-100">
                    ৳{order.tax?.toLocaleString() || "0"}
                  </span>
                </div>
              )}
              {order.shippingCost > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Shipping:
                  </span>
                  <span className="text-gray-900 dark:text-gray-100">
                    ৳{order.shippingCost?.toLocaleString() || "0"}
                  </span>
                </div>
              )}
              {order.discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Discount:
                  </span>
                  <span className="text-gray-900 dark:text-gray-100">
                    -৳{order.discount?.toLocaleString() || "0"}
                  </span>
                </div>
              )}
              <div className="flex justify-between pt-2 text-base font-bold border-t border-gray-200 dark:border-gray-700">
                <span className="text-gray-900 dark:text-gray-100">Total:</span>
                <span className="text-gray-900 dark:text-gray-100">
                  ৳{order.total?.toLocaleString() || "0"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {order.deliveryNotes && (
          <div>
            <h3 className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
              Delivery Notes
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {order.deliveryNotes}
            </p>
          </div>
        )}

        <div className="flex gap-3 justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="text-gray-700 bg-gray-100 btn dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            Close
          </button>
          <PermissionGuard permission="orders.update_status">
            <button
              onClick={() => {
                if (onUpdateStatus) {
                  onUpdateStatus(order);
                }
              }}
              className="text-white bg-violet-500 btn hover:bg-violet-600"
            >
              Update Status
            </button>
          </PermissionGuard>
        </div>
      </div>
    </GlobalModal>
  );
};

export default OrderDetailModal;

