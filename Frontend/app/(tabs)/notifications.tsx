import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Modal,
  ScrollView,
} from "react-native";
import React, { useEffect, useState, useMemo } from "react";
import { Personal_IP } from "@/constants/ip";
import axios from "axios";
import { Stack } from "expo-router";
import { useHeaderHeight } from "@react-navigation/elements";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import AsyncStorage from '@react-native-async-storage/async-storage';

type AddressType = {
  line1: string;
  line2?: string;
  city: string;
  province: string;
  country: string;
  name: string;
  phone: string;
};

type OrderType = {
  id: number;
  address: AddressType;
  createAt: string;
  status: string;
  subTotal: number;
  totalDiscount: number;
  shippingFee: number;
  grandTotal: number;
};

type SortOption = 'newest' | 'oldest' | 'price-high' | 'price-low';
type FilterOption = 'all' | 'completed' | 'pending' | 'processing' | 'cancelled';

const OrderHistoryScreen = () => {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sort and Filter states
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [showSortModal, setShowSortModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);

  const headerHeight = useHeaderHeight();

  useEffect(() => {
    getOrderHistory();
  }, []);

  const getOrderHistory = async () => {
    try {
      setLoading(true);
      setError(null);

      const userIdString = await AsyncStorage.getItem("userId");
      const token = await AsyncStorage.getItem("access_token");

      if (!userIdString) {
        setError("User ID not found. Please login again.");
        return;
      }

      const userId = parseInt(userIdString, 10);
      const URL = `http://${Personal_IP.data}:3000/orders/order-history/${userId}`;

      const response = await axios.get(URL, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const orderData = response.data.data || response.data || [];
      setOrders(orderData);

    } catch (error) {
      console.error("Error fetching order history:", error);
      setError("Failed to load order history. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Filtered and sorted orders
  const filteredAndSortedOrders = useMemo(() => {
    let filtered = orders;

    // Apply filter
    if (filterBy !== 'all') {
      filtered = orders.filter(order =>
        order.status.toLowerCase() === filterBy.toLowerCase()
      );
    }

    // Apply sort
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createAt).getTime() - new Date(a.createAt).getTime();
        case 'oldest':
          return new Date(a.createAt).getTime() - new Date(b.createAt).getTime();
        case 'price-high':
          return b.grandTotal - a.grandTotal;
        case 'price-low':
          return a.grandTotal - b.grandTotal;
        default:
          return 0;
      }
    });

    return sorted;
  }, [orders, sortBy, filterBy]);

  const onRefresh = async () => {
    setRefreshing(true);
    await getOrderHistory();
    setRefreshing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'COMPLETED':
        return '#22c55e';
      case 'PENDING':
        return '#f59e0b';
      case 'PROCESSING':
        return '#3b82f6';
      case 'CANCELLED':
        return '#ef4444';
      default:
        return Colors.gray;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'COMPLETED':
        return 'checkmark-circle';
      case 'PENDING':
        return 'time';
      case 'PROCESSING':
        return 'refresh';
      case 'CANCELLED':
        return 'close-circle';
      default:
        return 'help-circle';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  const getSortLabel = (sort: SortOption) => {
    switch (sort) {
      case 'newest': return 'Newest First';
      case 'oldest': return 'Oldest First';
      case 'price-high': return 'Price: High to Low';
      case 'price-low': return 'Price: Low to High';
    }
  };

  const getFilterLabel = (filter: FilterOption) => {
    switch (filter) {
      case 'all': return 'All Orders';
      case 'completed': return 'Completed';
      case 'pending': return 'Pending';
      case 'processing': return 'Processing';
      case 'cancelled': return 'Cancelled';
    }
  };

  const getFilterCount = (filter: FilterOption) => {
    if (filter === 'all') return orders.length;
    return orders.filter(order =>
      order.status.toLowerCase() === filter.toLowerCase()
    ).length;
  };

  const renderSortModal = () => (
    <Modal
      visible={showSortModal}
      transparent
      animationType="fade"
      onRequestClose={() => setShowSortModal(false)}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        onPress={() => setShowSortModal(false)}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Sort Orders</Text>
            <TouchableOpacity onPress={() => setShowSortModal(false)}>
              <Ionicons name="close" size={24} color={Colors.gray} />
            </TouchableOpacity>
          </View>

          {(['newest', 'oldest', 'price-high', 'price-low'] as SortOption[]).map((option) => (
            <TouchableOpacity
              key={option}
              style={[styles.modalOption, sortBy === option && styles.selectedOption]}
              onPress={() => {
                setSortBy(option);
                setShowSortModal(false);
              }}
            >
              <Text style={[styles.optionText, sortBy === option && styles.selectedOptionText]}>
                {getSortLabel(option)}
              </Text>
              {sortBy === option && (
                <Ionicons name="checkmark" size={20} color={Colors.primary} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );

  const renderFilterModal = () => (
    <Modal
      visible={showFilterModal}
      transparent
      animationType="fade"
      onRequestClose={() => setShowFilterModal(false)}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        onPress={() => setShowFilterModal(false)}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filter Orders</Text>
            <TouchableOpacity onPress={() => setShowFilterModal(false)}>
              <Ionicons name="close" size={24} color={Colors.gray} />
            </TouchableOpacity>
          </View>

          {(['all', 'completed', 'pending', 'processing', 'cancelled'] as FilterOption[]).map((option) => (
            <TouchableOpacity
              key={option}
              style={[styles.modalOption, filterBy === option && styles.selectedOption]}
              onPress={() => {
                setFilterBy(option);
                setShowFilterModal(false);
              }}
            >
              <View style={styles.optionLeft}>
                <Text style={[styles.optionText, filterBy === option && styles.selectedOptionText]}>
                  {getFilterLabel(option)}
                </Text>
                <Text style={styles.optionCount}>({getFilterCount(option)})</Text>
              </View>
              {filterBy === option && (
                <Ionicons name="checkmark" size={20} color={Colors.primary} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );

  const renderControlsHeader = () => (
    <View style={styles.controlsContainer}>
      <View style={styles.resultsInfo}>
        <Text style={styles.resultsText}>
          {filteredAndSortedOrders.length} {filteredAndSortedOrders.length === 1 ? 'order' : 'orders'}
        </Text>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => setShowFilterModal(true)}
        >
          <Ionicons name="funnel-outline" size={18} color={Colors.primary} />
          <Text style={styles.controlButtonText}>Filter</Text>
          {filterBy !== 'all' && <View style={styles.activeIndicator} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => setShowSortModal(true)}
        >
          <Ionicons name="swap-vertical-outline" size={18} color={Colors.primary} />
          <Text style={styles.controlButtonText}>Sort</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderOrderItem = ({ item, index }: { item: OrderType; index: number }) => (
    <Animated.View
      style={styles.orderCard}
      entering={FadeInDown.delay(100 + index * 50).duration(400)}
    >
      <TouchableOpacity style={styles.orderHeader}>
        <View style={styles.orderHeaderLeft}>
          <Text style={styles.orderNumber}>Order #{item.id}</Text>
          <Text style={styles.orderDate}>{formatDate(item.createAt)}</Text>
        </View>
        <View style={[styles.statusContainer, { backgroundColor: getStatusColor(item.status) + '20' }]}>
          <Ionicons
            name={getStatusIcon(item.status)}
            size={16}
            color={getStatusColor(item.status)}
          />
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status}
          </Text>
        </View>
      </TouchableOpacity>

      <View style={styles.orderDetails}>
        <View style={styles.priceBreakdown}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Subtotal:</Text>
            <Text style={styles.priceValue}>{formatPrice(item.subTotal)}</Text>
          </View>

          {item.totalDiscount > 0 && (
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Discount:</Text>
              <Text style={[styles.priceValue, styles.discountText]}>-{formatPrice(item.totalDiscount)}</Text>
            </View>
          )}

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Shipping Fee:</Text>
            <Text style={styles.priceValue}>
              {item.shippingFee > 0 ? formatPrice(item.shippingFee) : 'Free'}
            </Text>
          </View>

          <View style={[styles.priceRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Grand Total:</Text>
            <Text style={styles.totalAmount}>{formatPrice(item.grandTotal)}</Text>
          </View>
        </View>

        <View style={styles.addressContainer}>
          <View style={styles.addressHeader}>
            <Ionicons name="location-outline" size={18} color={Colors.gray} />
            <Text style={styles.addressTitle}>Delivery Address</Text>
          </View>
          <View style={styles.addressDetails}>
            <Text style={styles.addressName}>{item.address.name}</Text>
            <Text style={styles.addressPhone}>{item.address.phone}</Text>
            <Text style={styles.addressText}>
              {item.address.line1}
              {item.address.line2 ? `, ${item.address.line2}` : ''}
            </Text>
            <Text style={styles.addressText}>
              {item.address.city}, {item.address.province}
            </Text>
            <Text style={styles.addressText}>{item.address.country}</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.viewDetailsButton}>
        <Text style={styles.viewDetailsText}>View Order Details</Text>
        <Ionicons name="chevron-forward" size={16} color={Colors.primary} />
      </TouchableOpacity>
    </Animated.View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons
        name={filterBy === 'all' ? "receipt-outline" : "search-outline"}
        size={80}
        color={Colors.lightGray}
      />
      <Text style={styles.emptyTitle}>
        {filterBy === 'all' ? 'No Orders Yet' : 'No Orders Found'}
      </Text>
      <Text style={styles.emptyMessage}>
        {filterBy === 'all'
          ? 'Your order history will appear here once you place your first order.'
          : `No ${filterBy} orders found. Try adjusting your filter.`
        }
      </Text>
      {filterBy === 'all' ? (
        <TouchableOpacity style={styles.shopButton} onPress={() => {/* Navigate to shop */}}>
          <Text style={styles.shopButtonText}>Start Shopping</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.shopButton} onPress={() => setFilterBy('all')}>
          <Text style={styles.shopButtonText}>Show All Orders</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderError = () => (
    <View style={styles.errorContainer}>
      <Ionicons name="alert-circle-outline" size={80} color={Colors.gray} />
      <Text style={styles.errorTitle}>Something went wrong</Text>
      <Text style={styles.errorMessage}>{error}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={getOrderHistory}>
        <Text style={styles.retryButtonText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTransparent: true,
          title: "Order History"
        }}
      />
      <View style={[styles.container, { marginTop: headerHeight }]}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Loading your orders...</Text>
          </View>
        ) : error ? (
          renderError()
        ) : (
          <>
            {orders.length > 0 && renderControlsHeader()}
            <FlatList
              data={filteredAndSortedOrders}
              renderItem={renderOrderItem}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={filteredAndSortedOrders.length === 0 ? styles.emptyList : styles.list}
              ListEmptyComponent={renderEmptyState}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={[Colors.primary]}
                />
              }
            />
          </>
        )}
      </View>

      {renderSortModal()}
      {renderFilterModal()}
    </>
  );
};

export default OrderHistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.gray,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  resultsInfo: {
    flex: 1,
  },
  resultsText: {
    fontSize: 14,
    color: Colors.gray,
    fontWeight: '500',
  },
  controls: {
    flexDirection: 'row',
    gap: 12,
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.primary,
    backgroundColor: 'white',
    position: 'relative',
  },
  controlButtonText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
    marginLeft: 4,
  },
  activeIndicator: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.black,
  },
  modalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  selectedOption: {
    backgroundColor: Colors.primary + '10',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionText: {
    fontSize: 16,
    color: Colors.black,
    fontWeight: '500',
  },
  selectedOptionText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  optionCount: {
    fontSize: 14,
    color: Colors.gray,
    marginLeft: 8,
  },
  list: {
    padding: 16,
  },
  emptyList: {
    flex: 1,
  },
  orderCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  orderHeaderLeft: {
    flex: 1,
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.black,
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 14,
    color: Colors.gray,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
    textTransform: 'capitalize',
  },
  orderDetails: {
    padding: 16,
  },
  priceBreakdown: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 14,
    color: Colors.gray,
  },
  priceValue: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.black,
  },
  discountText: {
    color: '#22c55e',
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  addressContainer: {
    marginTop: 4,
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  addressTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.black,
    marginLeft: 8,
  },
  addressDetails: {
    marginLeft: 26,
  },
  addressName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.black,
    marginBottom: 2,
  },
  addressPhone: {
    fontSize: 14,
    color: Colors.gray,
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    color: Colors.gray,
    lineHeight: 20,
  },
  viewDetailsButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  viewDetailsText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
    marginRight: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 16,
    color: Colors.gray,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  shopButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  shopButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.black,
    marginTop: 16,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 16,
    color: Colors.gray,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.black,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
  },
});