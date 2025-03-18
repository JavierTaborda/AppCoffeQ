import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/constants/colors";
import FiltersModal from "@/app/components/payments/FiltersModal";
import { usePaymentFilters } from "@/hooks/usePayments";
import { Payment } from "@/interfaces/Payment";
import ModalGeneric from "@/app/components/ModalGeneric";
import { useAuthStore } from "@/stores/authStore";
import Toast from "react-native-toast-message";

const Payments: React.FC = () => {
  const {
    payments,
    isLoading,
    refreshing,
    startDate,
    endDate,
    selectedCustomer,
    customers,
    onRefresh,
    handleStartDateChange,
    handleEndDateChange,
    handleCustomerChange,
    loadPayments,
    DeletePayment,
    ApprovePayment,
  } = usePaymentFilters();

  const [isFiltersModalVisible, setFiltersModalVisible] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const { role, loading } = useAuthStore();

  const toggleFiltersModal = () => {
    setFiltersModalVisible((prev) => !prev);
  };

  const handleApplyFilters = () => {
    loadPayments();
    toggleFiltersModal();
  };

  const handleApprovePayment = async (payment: Payment, action:boolean) => {
   ApprovePayment(payment, action);
  };

  const handleDeletePayment = async (payment: Payment) => {
   DeletePayment(payment.idPayment);
  };

  const renderPaymentItem = ({ item }: { item: Payment }) => (
    <View style={styles.paymentCard}>
      <View style={styles.paymentHeader}>
        <Text style={styles.paymentRef}>Referencia: {item.ref}</Text>
        <Text style={styles.paymentAmount}>${item.amount.toFixed(2)}</Text>
      </View>
      <Text style={styles.paymentDate}>Fecha: {item.date}</Text>
      <Text style={styles.paymentCustomer}>Cliente: {item.customerName}</Text>

      <View style={styles.approvalStatus}>
        {item.isApproved ? (
          <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
        ) : (
          <Ionicons name="close-circle" size={20} color={colors.danger} />
        )}
        <Text style={styles.approvalText}>
          {item.isApproved ? "Aprobado" : "Pendiente"}
        </Text>
      </View>

      {role === "admin" && (
        <View style={styles.paymentActions}>
          {item.isApproved ? (
            <TouchableOpacity
              style={[styles.actionButton, styles.desapproveButton]}
              onPress={() => handleApprovePayment(item,false)}
            >
              <Ionicons name="close" size={20} color={colors.white} />
              <Text style={styles.actionButtonText}>Desaprobar</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.actionButton, styles.approveButton]}
              onPress={() => handleApprovePayment(item, true)}
            >
              <Ionicons name="checkmark" size={20} color={colors.white} />
              <Text style={styles.actionButtonText}>Aprobar</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDeletePayment(item)}
          >
            <Ionicons name="trash" size={20} color={colors.white} />
            <Text style={styles.actionButtonText}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.filterButton}
        onPress={toggleFiltersModal}
      >
        <Ionicons name="filter" size={24} color={colors.primary} />
        <Text style={styles.filterButtonText}>Filtrar</Text>
      </TouchableOpacity>

      <FiltersModal
        isVisible={isFiltersModalVisible}
        onClose={toggleFiltersModal}
        startDate={startDate}
        endDate={endDate}
        customers={customers}
        selectedCustomer={selectedCustomer}
        onStartDateChange={handleStartDateChange}
        onEndDateChange={handleEndDateChange}
        onCustomerChange={handleCustomerChange}
        onConfirm={handleApplyFilters}
      />

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={payments}
          renderItem={renderPaymentItem}
          keyExtractor={(item) => item.idPayment.toString()}
          contentContainerStyle={styles.paymentList}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.whiteBack,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: colors.lightWhite,
    borderRadius: 10,
    marginBottom: 16,
  },
  filterButtonText: {
    marginLeft: 10,
    fontSize: 16,
    color: colors.darkGray,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  paymentList: {
    flexGrow: 1,
  },
  paymentCard: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  paymentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  paymentRef: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.darkGray,
  },
  paymentAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.primary,
  },
  paymentDate: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: 4,
  },
  paymentCustomer: {
    fontSize: 14,
    color: colors.gray,
  },
  approvalStatus: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  approvalText: {
    marginLeft: 4,
    fontSize: 14,
    color: colors.darkGray,
  },
  paymentActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 5,
    marginLeft: 8,
  },
  approveButton: {
    backgroundColor: colors.primary,
  },
  desapproveButton: {
    backgroundColor: colors.accent,
  },
  deleteButton: {
    backgroundColor: colors.danger,
  },
  actionButtonText: {
    marginLeft: 4,
    color: colors.white,
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default Payments;