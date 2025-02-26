import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Switch,
  RefreshControl,
  Modal,
} from "react-native";
import ModalGeneric from "../components/ModalGeneric";
import { colors } from "@/constants/colors";
import { Payment } from "@/interfaces/Payment";
import {
  getPaymentOrder,
  getPayments,
  createPayment,
  updatePayment,
  deletePayment,
} from "@/services/PaymentService";
import { Ionicons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import Toast from "react-native-toast-message";

const Payments = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentRef, setPaymentRef] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [isApproved, setIsApproved] = useState(false);
  const [idOrder, setIdOrder] = useState("");
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [paymentToDelete, setPaymentToDelete] = useState<number | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    loadPayments();
  }, []);

  useEffect(() => {
    filterPayments();
  }, [searchQuery, payments]);

  const loadPayments = async () => {
    setIsLoading(true);
    try {
      const payments = await getPayments();
      setPayments(payments);
    } catch (error) {
      console.error(error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "No se pudieron cargar los pagos.",
      });
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const filterPayments = () => {
    const filtered = payments.filter((payment) =>
      payment.ref?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPayments(filtered);
  };

  const validateFields = () => {
    const newErrors: { [key: string]: string } = {};

    if (!paymentAmount) newErrors.paymentAmount = "El monto es requerido.";
    if (!paymentRef) newErrors.paymentRef = "La referencia es requerida.";
    if (!idOrder) newErrors.idOrder = "El número de orden es requerido.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirm = async () => {
    if (!validateFields()) return;

    setIsSaving(true);
    const newPayment: Payment = {
      idPayment: editingPayment
        ? editingPayment.idPayment
        : payments.length + 1,
      idOrder: parseInt(idOrder, 10), 
      date: new Date().toLocaleDateString(), 
      amount: parseFloat(paymentAmount), 
      ref: paymentRef,
      isApproved: isApproved,
      customerName: customerName,
    };

    try {
      if (editingPayment) {
        const updatedPayment = await updatePayment(newPayment);
        setPayments((prev) =>
          prev.map((p) =>
            p.idPayment === updatedPayment.idPayment ? updatedPayment : p
          )
        );
        Toast.show({
          type: "success",
          text1: "Éxito",
          text2: "Pago actualizado correctamente.",
        });
      } else {
        const createdPayment = await createPayment(newPayment);
        setPayments((prev) => [...prev, createdPayment]);
        Toast.show({
          type: "success",
          text1: "Éxito",
          text2: "Pago creado correctamente.",
        });
      }
      setModalVisible(false);
      setPaymentAmount("");
      setPaymentRef("");
      setCustomerName("");
      setIdOrder("");
      setIsApproved(false);
      setEditingPayment(null);
      setErrors({});
    } catch (error) {
      console.error(error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "No se pudo guardar el pago.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (payment: Payment) => {
    setEditingPayment(payment);
    setPaymentAmount(payment.amount.toString());
    setPaymentRef(payment.ref);
    setCustomerName(payment.customerName);
    setIdOrder(payment.idOrder.toString());
    setIsApproved(payment.isApproved);
    setModalVisible(true);
    setErrors({});
  };

  const handleDelete = (idPayment: number) => {
    setPaymentToDelete(idPayment);
    setShowConfirmation(true);
  };

  const confirmDelete = async () => {
    if (paymentToDelete === null) return;

    try {
      await deletePayment(paymentToDelete);
      setPayments((prev) =>
        prev.filter((p) => p.idPayment !== paymentToDelete)
      );
      Toast.show({
        type: "success",
        text1: "Éxito",
        text2: "Pago eliminado correctamente.",
      });
    } catch (error) {
      console.error(error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "No se pudo eliminar el pago.",
      });
    } finally {
      setShowConfirmation(false);
      setPaymentToDelete(null);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadPayments();
  };

  const renderPaymentItem = ({ item }: { item: Payment }) => (
    <Animatable.View
      animation="fadeInUp"
      duration={500}
      style={[
        styles.paymentItem,
        item.isApproved && {
          borderLeftWidth: 5,
          borderLeftColor: colors.primary,
        },
      ]}
    >
      {item.isApproved && (
        <Ionicons
          name="checkmark-circle"
          size={24}
          color={colors.primary}
          style={styles.approvedIcon}
        />
      )}
      <Text style={styles.paymentText}>Referencia: {item.ref}</Text>
      <Text style={styles.paymentText}>Monto: ${item.amount.toFixed(2)}</Text>
      <Text style={styles.paymentText}>Fecha: {item.date}</Text>
      <Text style={styles.paymentText}>Cliente: {item.customerName}</Text>
      <Text style={styles.paymentText}>Orden: {item.idOrder}</Text>
      <View style={styles.actions}>
        <TouchableOpacity
          onPress={() => handleEdit(item)}
          style={[styles.button, styles.editButton]}
        >
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDelete(item.idPayment)}
          style={[styles.button, styles.deleteButton]}
        >
          <Text style={styles.buttonText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </Animatable.View>
  );

  const isFormValid = Boolean(
    paymentAmount && paymentRef && customerName && idOrder
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar por referencia"
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholderTextColor={colors.lightWhite}
      />

      {isLoading ? (
        <View>
          {[...Array(5)].map((_, index) => (
            <View key={index} style={styles.skeletonItem}>
              <View style={styles.skeletonLine} />
              <View style={styles.skeletonLine} />
              <View style={styles.skeletonLine} />
            </View>
          ))}
        </View>
      ) : (
        <FlatList
          data={filteredPayments}
          renderItem={renderPaymentItem}
          keyExtractor={(item) => item.idPayment.toString()}
          contentContainerStyle={styles.paymentList}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No hay pagos registrados.</Text>
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
              progressBackgroundColor={colors.white}
            />
          }
        />
      )}

      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.fab}
      >
        <Ionicons name="add" size={30} color={colors.white} />
      </TouchableOpacity>

      <ModalGeneric
        isVisible={isModalVisible}
        onClose={() => {
          setModalVisible(false);
          setEditingPayment(null);
          setPaymentAmount("");
          setPaymentRef("");
          setCustomerName("");
          setIdOrder("");
          setIsApproved(false);
          setErrors({});
        }}
        onConfirm={handleConfirm}
        title={editingPayment ? "Editar Pago" : "Agregar Pago"}
      >
        {isSaving ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : (
          <>
            <TextInput
              style={styles.input}
              placeholder="Cliente"
              value={customerName}
              onChangeText={setCustomerName}
              placeholderTextColor={colors.darkGray}
            />
            {errors.customerName && (
              <Text style={styles.errorText}>{errors.customerName}</Text>
            )}
            <TextInput
              style={styles.input}
              placeholder="Número de Orden"
              value={idOrder}
              onChangeText={setIdOrder}
              keyboardType="numeric"
              placeholderTextColor={colors.darkGray}
            />
            {errors.idOrder && (
              <Text style={styles.errorText}>{errors.idOrder}</Text>
            )}

            <TextInput
              style={styles.input}
              placeholder="Monto del Pago"
              value={paymentAmount}
              onChangeText={setPaymentAmount}
              keyboardType="numeric"
              placeholderTextColor={colors.darkGray}
            />
            {errors.paymentAmount && (
              <Text style={styles.errorText}>{errors.paymentAmount}</Text>
            )}

            <TextInput
              style={styles.input}
              placeholder="Referencia"
              value={paymentRef}
              onChangeText={setPaymentRef}
              placeholderTextColor={colors.darkGray}
            />
            {errors.paymentRef && (
              <Text style={styles.errorText}>{errors.paymentRef}</Text>
            )}

            <TextInput
              style={styles.input}
              placeholder="Cliente"
              value={customerName}
              onChangeText={setCustomerName}
              placeholderTextColor={colors.darkGray}
            />
            {errors.customerName && (
              <Text style={styles.errorText}>{errors.customerName}</Text>
            )}

            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>¿Aprobado?</Text>
              <Switch
                value={isApproved}
                onValueChange={setIsApproved}
                trackColor={{ false: colors.lightGray, true: colors.primary }}
                thumbColor={isApproved ? colors.white : colors.white}
              />
            </View>
          </>
        )}
      </ModalGeneric>

      <Modal
        transparent={true}
        animationType="fade"
        visible={showConfirmation}
        onRequestClose={() => setShowConfirmation(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.confirmationModal}>
            <Text style={styles.confirmationText}>
              ¿Estás seguro de que deseas eliminar este pago?
            </Text>
            <View style={styles.confirmationActions}>
              <TouchableOpacity
                onPress={() => setShowConfirmation(false)}
                style={styles.cancelButton}
              >
                <Text style={styles.actionText}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={confirmDelete}
                style={styles.deleteButton}
              >
                <Text style={styles.actionText}>Sí</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.whiteBack,
  },
  searchInput: {
    height: 50,
    borderColor: colors.lightGray,
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 20,
    marginBottom: 20,
    fontSize: 16,
    color: colors.darkGray,
    backgroundColor: colors.lightWhite,
  },
  input: {
    height: 50,
    borderColor: colors.lightGray,
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 20,
    marginBottom: 20,
    fontSize: 16,
    color: colors.darkGray,
    backgroundColor: colors.lightWhite,
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: colors.primary,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.darkGray,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  paymentList: {
    flexGrow: 1,
  },
  paymentItem: {
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: colors.lightGray,
    shadowColor: colors.darkGray,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  paymentText: {
    fontSize: 16,
    color: colors.darkGray,
    marginBottom: 10,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "500",
  },
  emptyText: {
    textAlign: "center",
    color: colors.darkGray,
    marginTop: 20,
    fontSize: 16,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  switchLabel: {
    fontSize: 16,
    color: colors.darkGray,
  },
  approvedIcon: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  skeletonItem: {
    backgroundColor: colors.lightGray,
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
  },
  skeletonLine: {
    backgroundColor: colors.white,
    height: 10,
    borderRadius: 5,
    marginBottom: 10,
    width: "80%",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  confirmationModal: {
    width: "80%",
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  confirmationText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
    color: colors.darkGray,
  },
  confirmationActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  cancelButton: {
    backgroundColor: colors.secondary,
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
    alignItems: "center",
  },
  deleteButton: {
    backgroundColor: colors.danger,
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 10,
    alignItems: "center",
  },
  editButton: {
    backgroundColor: colors.secondary,
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 10,
    alignItems: "center",
  },
  actionText: {
    color: colors.white,
    fontWeight: "bold",
  },
  errorText: {
    color: colors.danger,
    fontSize: 14,
    marginBottom: 10,
  },
});

export default Payments;
