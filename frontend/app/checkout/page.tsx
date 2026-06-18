"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserContext";
import { useCart } from "@/app/context/CartContext";
import { addressService } from "@/app/services/address.service";
import { orderService } from "@/app/services/order.service";
import { Address } from "@/app/types/types";
import SectionHeading from "@/app/components/common/SectionHeading";
import { Loader2, MapPin, AlertCircle } from "lucide-react";

export default function CheckoutPage() {
  const { state: userState } = useUser();
  const { state: cartState, dispatch: cartDispatch } = useCart();
  const router = useRouter();

  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState("");

  // Addresses from backend
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressesLoading, setAddressesLoading] = useState(true);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);

  // Extra delivery info
  const [deliveryNotes, setDeliveryNotes] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  // Redirect guards
  useEffect(() => {
    if (isPlacingOrder) return;
    if (!userState.isLoggedIn) {
      router.push("/auth/login");
    } else if (cartState.items.length === 0) {
      router.push("/cart");
    }
  }, [userState.isLoggedIn, cartState.items.length, router, isPlacingOrder]);

  // Fetch addresses from backend
  useEffect(() => {
    if (!userState.isLoggedIn) return;
    const fetchAddresses = async () => {
      setAddressesLoading(true);
      try {
        const data = await addressService.getAddresses();
        const result = Array.isArray(data)
          ? data
          : Array.isArray(data?.addresses)
          ? data.addresses
          : Array.isArray(data?.data)
          ? data.data
          : [];
        setAddresses(result);
        // Auto-select default address or first one
        const defaultAddr = result.find((a: Address) => a.isDefault);
        if (defaultAddr) {
          setSelectedAddressId(defaultAddr.id);
        } else if (result.length > 0) {
          setSelectedAddressId(result[0].id);
        }
      } catch {
        console.error("Failed to load addresses");
      } finally {
        setAddressesLoading(false);
      }
    };
    fetchAddresses();
  }, [userState.isLoggedIn]);

  if (!userState.isLoggedIn || (!isPlacingOrder && cartState.items.length === 0)) {
    return null;
  }

  const shippingCost = cartState.totalPrice > 50 || cartState.totalPrice === 0 ? 0 : 9.99;
  const estimatedTax = cartState.totalPrice * 0.08;
  const orderTotal = cartState.totalPrice + shippingCost + estimatedTax;

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId);

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      setOrderError("Please select a delivery address.");
      return;
    }

    setIsPlacingOrder(true);
    setOrderError("");

    try {
      // Build shipping address string from the selected address
      const addressParts = [
        selectedAddress.addressLine1,
        selectedAddress.addressLine2,
        selectedAddress.landmark ? `Near ${selectedAddress.landmark}` : null,
        selectedAddress.city,
        selectedAddress.district,
        selectedAddress.state,
        selectedAddress.pincode,
        selectedAddress.country,
      ].filter(Boolean);
      const shippingAddressStr = addressParts.join(", ");

      const response = await orderService.createOrder({
        items: cartState.items.map((item) => ({
          product_id: item.productId,
          quantity: item.quantity,
          selectedColor: item.selectedColor,
          selectedStorage: item.selectedStorage,
        })),
        shipping_address: shippingAddressStr,
        customer_name: selectedAddress.fullName || userState.user?.name || "",
        customer_phone: phone || selectedAddress.mobile || "",
        customer_email: email || userState.user?.email || "",
        payment_method: "COD",
        delivery_notes: deliveryNotes || undefined,
        city: selectedAddress.city || "",
      });

      if (response.success) {
        // Clear frontend cart state
        cartDispatch({ type: "CLEAR" });
        // Navigate to success page with order number
        router.push(`/order-success?order=${encodeURIComponent(response.order.order_number)}`);
      } else {
        setOrderError(response.message || "Failed to place order. Please try again.");
        setIsPlacingOrder(false);
      }
    } catch (error: any) {
      const errMsg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
      setOrderError(errMsg);
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="bg-gray-50/50 min-h-screen py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading title="Checkout" subtitle="Complete your order" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
          <div className="lg:col-span-8 space-y-6">

            {/* Error Banner */}
            {orderError && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-bold text-red-800">Order Failed</p>
                  <p className="text-sm text-red-600 mt-0.5">{orderError}</p>
                </div>
              </div>
            )}

            {/* Address Section */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex justify-between items-center mb-4 border-b pb-2">
                <h3 className="text-lg font-bold text-gray-900">Shipping Address</h3>
                <button
                  onClick={() => router.push("/account")}
                  className="text-sm font-semibold text-orange-500 hover:text-orange-600"
                >
                  Manage Addresses
                </button>
              </div>

              {addressesLoading ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="h-6 w-6 text-orange-500 animate-spin" />
                </div>
              ) : addresses.length === 0 ? (
                <div className="text-center py-8">
                  <MapPin className="h-10 w-10 text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm font-medium">No saved addresses found.</p>
                  <button
                    onClick={() => router.push("/account")}
                    className="mt-3 text-sm font-bold text-orange-500 hover:text-orange-600 transition"
                  >
                    + Add your first address
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      onClick={() => setSelectedAddressId(addr.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition ${
                        selectedAddressId === addr.id
                          ? "border-orange-500 bg-orange-50"
                          : "border-gray-200 hover:border-orange-300"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          checked={selectedAddressId === addr.id}
                          readOnly
                          className="mt-1 text-orange-500 focus:ring-orange-500"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-gray-900">{addr.fullName}</p>
                            {addr.isDefault && (
                              <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-orange-100 text-orange-600 border border-orange-200 rounded-full">
                                Default
                              </span>
                            )}
                            <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-gray-100 text-gray-500 border border-gray-200 rounded-full capitalize">
                              {addr.label}
                            </span>
                          </div>
                          <p className="text-gray-500 text-sm mt-0.5">{addr.mobile}</p>
                          <p className="text-gray-600 text-sm mt-1">
                            {addr.addressLine1}
                            {addr.addressLine2 && `, ${addr.addressLine2}`}
                          </p>
                          <p className="text-gray-600 text-sm">
                            {addr.city}, {addr.state} — {addr.pincode}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Extra Info Section */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Contact & Notes</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-gray-500">Phone Number</label>
                  <input
                    type="tel"
                    placeholder={selectedAddress?.mobile || "Enter phone number"}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-1 block w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-gray-500">Email Address</label>
                  <input
                    type="email"
                    placeholder={userState.user?.email || "Enter email address"}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 block w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wide text-gray-500">Delivery Notes <span className="normal-case font-normal text-gray-400">(optional)</span></label>
                  <textarea
                    placeholder="Leave at the door, call before delivery, etc."
                    value={deliveryNotes}
                    onChange={(e) => setDeliveryNotes(e.target.value)}
                    rows={3}
                    className="mt-1 block w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Payment Section */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Payment Method</h3>
              <div className="flex items-center gap-3 p-4 border border-orange-500 bg-orange-50 rounded-xl">
                <input
                  type="radio"
                  id="cod"
                  name="payment"
                  checked
                  readOnly
                  className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300"
                />
                <label htmlFor="cod" className="font-semibold text-orange-900">
                  Cash on Delivery (COD)
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-2 ml-7">
                Pay with cash upon delivery. No upfront payment required.
              </p>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6 sticky top-24">
              <h3 className="text-base font-bold text-gray-900 border-b pb-4">
                Order Summary
              </h3>

              <div className="space-y-4 text-sm">
                {cartState.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-gray-600">
                    <span className="truncate pr-4">{item.quantity} x {item.title}</span>
                    <span className="font-semibold text-gray-900">QAR {(item.priceNumber * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-4 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">QAR {cartState.totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-semibold text-gray-900">{shippingCost === 0 ? "Free" : `QAR ${shippingCost.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Estimated Tax</span>
                  <span className="font-semibold text-gray-900">QAR {estimatedTax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-4 flex justify-between text-base font-bold text-gray-900">
                  <span>Total</span>
                  <span className="text-orange-500">QAR {orderTotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder || addresses.length === 0 || !selectedAddressId}
                className={`w-full flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold text-white transition-colors shadow-lg ${
                  isPlacingOrder || addresses.length === 0 || !selectedAddressId
                    ? "bg-gray-300 cursor-not-allowed shadow-none"
                    : "bg-orange-500 hover:bg-orange-600 shadow-orange-500/10 cursor-pointer"
                }`}
              >
                {isPlacingOrder && <Loader2 className="h-4 w-4 animate-spin" />}
                {isPlacingOrder ? "Placing Order..." : "Place Order"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
