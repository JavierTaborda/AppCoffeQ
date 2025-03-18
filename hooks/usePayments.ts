import { useState, useEffect } from "react";
import { Payment } from "@/interfaces/Payment";
import { deletePayment, getPayments, updatePayment } from "@/services/PaymentService";
import { getCustomers } from "@/services/CustomerService";
import { useAuthStore } from "@/stores/authStore";
import { Customer } from "@/interfaces/Customer";
import Toast from "react-native-toast-message";

export const usePaymentFilters = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [selectedCustomer, setSelectedCustomer] = useState<string>("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const { role, loading, cedula } = useAuthStore();

  const loadPayments = async () => {
    if (loading) return;
    setIsLoading(true);
    try {
      const getpayments = await getPayments(
        startDate.toISOString(),
        endDate.toISOString(),
        role === "user" ? cedula : selectedCustomer || cedula
      );
      setPayments(getpayments);
      console.log("Payments", getpayments);
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

  const onRefresh = () => {
    setRefreshing(true);
    loadPayments();
  };

  const handleStartDateChange = (date: Date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date: Date) => {
    setEndDate(date);
  };

  const handleCustomerChange = (customer: string ) => {
    setSelectedCustomer(customer);
  };

  const ApprovePayment = async (payment:Payment, approve:boolean) => {

    try{
      payment.isApproved=approve;
      var result= await updatePayment(payment);
      if(result){
     Toast.show({
       type: "success",
       text1: "Éxito",
       text2: "Pago aprobado correctamente.",
     });
    }
    else{
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "No se pudo aprobar el pago.",
      });}
    } catch (error) {
      console.error(error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "No se pudo aprobar el pago.",
      });
    } finally {
      loadPayments();
    }

  }

  const DeletePayment = async (idPayment:number) => {
      try{
         var result= await deletePayment(idPayment);
         if(result){
        Toast.show({
          type: "success",
          text1: "Éxito",
          text2: "Pago eliminado correctamente.",
        });
      }
      else{
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "No se pudo eliminar el pago.",
        });}
      } catch (error) {
        console.error(error);
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "No se pudo eliminar el pago.",
        });
      } finally {
        
        loadPayments();
      }
     
    };

  useEffect(() => {
    if (!loading) {
      loadPayments();
      loadCustomers();
    }
  }, [loading]);

  useEffect(() => {
    if (!loading) {
      loadPayments();
    }
  }, []);

  return {
    payments,
    isLoading,
    refreshing,
    startDate,
    endDate,
    selectedCustomer,
    customers,
    loadPayments,
    onRefresh,
    handleStartDateChange,
    handleEndDateChange,
    handleCustomerChange,
    DeletePayment,
    ApprovePayment,
  };
};
