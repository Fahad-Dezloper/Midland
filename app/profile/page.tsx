"use client"
import { useAuth } from 'contexts/AuthContext';
import { getCustomerOrders } from 'lib/shopify';
import { CustomerOrder } from 'lib/shopify/types';
import { AlertCircle, Calendar, CheckCircle, Clock, ExternalLink, Mail, Package, Phone, ShoppingBag, Truck, User, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const ProfilePage = () => {
  const { customer, isLoading } = useAuth();
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<CustomerOrder | null>(null);
  const [showTrackingModal, setShowTrackingModal] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!customer) return;
      
      try {
        const token = localStorage.getItem('customer_token');
        if (!token) return;

        const customerWithOrders = await getCustomerOrders(token, 20);
        if (customerWithOrders?.orders) {
          setOrders(customerWithOrders.orders.edges.map(edge => edge.node));
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error('Failed to load order history');
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchOrders();
  }, [customer]);

  const fetchTrackingDetails = async (order: CustomerOrder) => {
    setSelectedOrder(order);
    setShowTrackingModal(true);
  };

  console.log("orders here", orders);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (amount: string, currencyCode: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    }).format(parseFloat(amount));
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'fulfilled':
        return 'text-green-600 bg-green-50';
      case 'unfulfilled':
        return 'text-yellow-600 bg-yellow-50';
      case 'cancelled':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'fulfilled':
        return <CheckCircle className="w-4 h-4" />;
      case 'unfulfilled':
        return <Clock className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getFulfillmentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'text-green-600 bg-green-50';
      case 'in_transit':
        return 'text-blue-600 bg-blue-50';
      case 'out_for_delivery':
        return 'text-orange-600 bg-orange-50';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">Please log in to view your profile</h1>
          <p className="text-gray-600">You need to be logged in to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 font-primary">My Profile</h1>
          <p className="text-gray-600 mt-2">Manage your account and view your order history</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div className="ml-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {customer.firstName} {customer.lastName}
                  </h2>
                  <p className="text-gray-600">Customer since {formatDate(customer.createdAt)}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Email</p>
                    <p className="text-sm text-gray-600">{customer.email}</p>
                  </div>
                </div>

                {customer.phone && (
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Phone</p>
                      <p className="text-sm text-gray-600">{customer.phone}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Member Since</p>
                    <p className="text-sm text-gray-600">{formatDate(customer.createdAt)}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <ShoppingBag className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Total Orders</p>
                    <p className="text-sm text-gray-600">{orders.length}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">Marketing Emails</span>
                    <span className={`text-sm ${customer.acceptsMarketing ? 'text-green-600' : 'text-gray-400'}`}>
                      {customer.acceptsMarketing ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order History */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Order History</h3>
              </div>

              <div className="p-6">
                {ordersLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                    <p className="text-gray-600">Start shopping to see your order history here.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map((order) => (
                      <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="font-medium text-gray-900">Order #{order.orderNumber}</h4>
                            <p className="text-sm text-gray-600">{formatDate(order.processedAt)}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">
                              {formatPrice(order.totalPriceV2.amount, order.totalPriceV2.currencyCode)}
                            </p>
                            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.fulfillmentStatus)}`}>
                              {getStatusIcon(order.fulfillmentStatus)}
                              <span className="ml-1 capitalize">{order.fulfillmentStatus}</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          {order.lineItems.edges.map((item, index) => (
                            <div key={`${order.id}-${index}`} className="flex items-center space-x-4">
                              {item.node.variant.image && (
                                <img
                                  src={item.node.variant.image.url}
                                  alt={item.node.variant.image.altText || item.node.title}
                                  className="w-12 h-12 object-cover rounded-md"
                                />
                              )}
                              <div className="flex-1">
                                <p className="font-medium text-gray-900">{item.node.title}</p>
                                <p className="text-sm text-gray-600">
                                  Qty: {item.node.quantity} • {formatPrice(item.node.variant.price.amount, item.node.variant.price.currencyCode)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span>Payment: <span className="font-medium capitalize">{order.financialStatus}</span></span>
                          </div>
                          <button 
                            onClick={() => fetchTrackingDetails(order)}
                            className="text-primary hover:text-primary/80 text-sm font-medium"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tracking Details Modal */}
      {showTrackingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Order Details & Tracking
                </h2>
                <button
                  onClick={() => setShowTrackingModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              {selectedOrder && (
                <div className="mb-6">
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <h3 className="font-medium text-gray-900 mb-2">Order #{selectedOrder.orderNumber}</h3>
                    <p className="text-sm text-gray-600">Placed on {formatDate(selectedOrder.processedAt)}</p>
                    <p className="text-sm text-gray-600">Total: {formatPrice(selectedOrder.totalPriceV2.amount, selectedOrder.totalPriceV2.currencyCode)}</p>
                  </div>
                </div>
              )}

                              {selectedOrder?.trackingData ? (
                  <div className="space-y-6">
                    {selectedOrder.trackingData.fulfillments.length === 0 ? (
                      <div className="text-center py-8">
                        <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No tracking information available</h3>
                        <p className="text-gray-600">Tracking details will appear here once your order is shipped.</p>
                      </div>
                    ) : (
                      selectedOrder.trackingData.fulfillments.map((fulfillment: any) => (
                        <div key={fulfillment.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-medium text-gray-900">Fulfillment #{fulfillment.id.split('/').pop()}</h4>
                            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getFulfillmentStatusColor(fulfillment.status)}`}>
                              <Truck className="w-3 h-3 mr-1" />
                              <span className="capitalize">{fulfillment.displayStatus}</span>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="text-sm">
                              <p><span className="font-medium">Created:</span> {formatDateTime(fulfillment.createdAt)}</p>
                              {fulfillment.inTransitAt && (
                                <p><span className="font-medium">In Transit:</span> {formatDateTime(fulfillment.inTransitAt)}</p>
                              )}
                              {fulfillment.estimatedDeliveryAt && (
                                <p><span className="font-medium">Estimated Delivery:</span> {formatDateTime(fulfillment.estimatedDeliveryAt)}</p>
                              )}
                              {fulfillment.deliveredAt && (
                                <p><span className="font-medium">Delivered:</span> {formatDateTime(fulfillment.deliveredAt)}</p>
                              )}
                            </div>

                            {fulfillment.trackingInfo.length > 0 && (
                              <div className="border-t border-gray-200 pt-3">
                                <h5 className="font-medium text-gray-900 mb-2">Tracking Information</h5>
                                {fulfillment.trackingInfo.map((tracking: any, index: number) => (
                                  <div key={index} className="flex items-center justify-between bg-gray-50 rounded p-3">
                                    <div>
                                      <p className="font-medium text-sm">{tracking.company}</p>
                                      <p className="text-sm text-gray-600">Tracking #: {tracking.number}</p>
                                    </div>
                                    {tracking.url && (
                                      <a
                                        href={tracking.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary hover:text-primary/80 flex items-center text-sm"
                                      >
                                        Track Package
                                        <ExternalLink className="w-4 h-4 ml-1" />
                                      </a>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}

                            <div className="border-t border-gray-200 pt-3">
                              <h5 className="font-medium text-gray-900 mb-2">Items in this fulfillment</h5>
                              <div className="space-y-2">
                                {fulfillment.fulfillmentLineItems.edges.map((item: any) => (
                                  <div key={item.node.id} className="flex justify-between text-sm">
                                    <span>{item.node.lineItem.title}</span>
                                    <span className="text-gray-600">Qty: {item.node.quantity}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No tracking information available</h3>
                    <p className="text-gray-600">Tracking details will appear here once your order is shipped.</p>
                  </div>
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;