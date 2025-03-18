
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/constants/colors";
import FiltersModal from "@/app/components/payments/FiltersModal";
import { usePaymentFilters } from "@/hooks/usePayments";
import { Payment } from "@/interfaces/Payment";

const Payments: React.FC = () => {
  const {
    payments,
    isLoading,
    refreshing,
    startDate,
    endDate,
    selectedCustomer,
    isFiltersModalVisible,
    customers,
    onRefresh,
    handleStartDateChange,
    handleEndDateChange,
    handleCustomerChange,
    toggleFiltersModal,
  } = usePaymentFilters();

  const renderPaymentItem = ({ item }: { item: Payment }) => (
    <View style={styles.paymentItem}>
      <Text style={styles.paymentText}>Referencia: {item.ref}</Text>
      <Text style={styles.paymentText}>Monto: ${item.amount.toFixed(2)}</Text>
      <Text style={styles.paymentText}>Fecha: {item.date}</Text>
      <Text style={styles.paymentText}>Cliente: {item.customerName}</Text>
    </View>
  );

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
  paymentItem: {
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  paymentText: {
    fontSize: 16,
    color: colors.darkGray,
    marginBottom: 8,
  },
});

export default Payments;
