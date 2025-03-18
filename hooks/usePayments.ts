import { useState, useEffect } from "react";
import { Payment } from "@/interfaces/Payment";
import { getPayments } from "@/services/PaymentService";
import { getCustomers } from "@/services/CustomerService";
import { useAuthStore } from "@/stores/authStore";
import { Customer } from "@/interfaces/Customer";

export const usePaymentFilters = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isFiltersModalVisible, setFiltersModalVisible] = useState(false);
  const { role, loading, cedula } = useAuthStore();

  const loadPayments = async () => {
    if (loading) return; 
    setIsLoading(true);
    try {
      if (role === "user") {

        const getpayments = await getPayments(
          startDate.toISOString(),
          endDate.toISOString(),
          cedula
        );
        setPayments(getpayments);

        console.log("Payments", getpayments);
      } else {
        const getpayments = await getPayments(
          startDate.toISOString(),
          endDate.toISOString(),
          selectedCustomer || cedula
        );
        console.log("Payments", getpayments); 
        setPayments(getpayments); 
      }

    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const loadCustomers = async () => {
    if (loading) return; 
    try {
      const customers = await getCustomers();
      setCustomers(customers);
    } catch (error) {
      console.error(error);
    }
  };

 
  // Refresh the payment list
  const onRefresh = () => {
    setRefreshing(true);
    loadPayments();
  };

  // Change the start date
  const handleStartDateChange = (date: Date) => {
    setStartDate(date);
  
  };

  // Change the end date
  const handleEndDateChange = (date: Date) => {
    setEndDate(date);

  };

  // Change the selected customer
  const handleCustomerChange = (customer: string | null) => {
    setSelectedCustomer(customer);

  };

  // Show/hide the filters modal
  const toggleFiltersModal = () => {
    setFiltersModalVisible(!isFiltersModalVisible);
  };

  // Load payments and customers when the component mounts
  useEffect(() => {
    if (!loading) {
      loadPayments();
      loadCustomers();
    }
  }, [loading]);

  return {
    payments,
    isLoading,
    refreshing,
    startDate,
    endDate,
    selectedCustomer,
    customers,
    isFiltersModalVisible,
    loadPayments,
    onRefresh,
    handleStartDateChange,
    handleEndDateChange,
    handleCustomerChange,
    toggleFiltersModal,
  };
};
