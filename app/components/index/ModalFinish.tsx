import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ActivityIndicator,
} from "react-native";
import { Customer } from "@/interfaces/Customer";
import { Order } from "@/interfaces/Order";
import { createOrder } from "@/services/OrderService";
import { getCustomers } from "@/services/CustomerService";
import { colors } from "@/constants/colors";
import Toast from "react-native-toast-message";

interface ModalFinishProps {
  isVisible: boolean;
  onClose: () => void;
  order: Order | null;
}

const ModalFinish: React.FC<ModalFinishProps> = ({
  isVisible,
  onClose,
  order,
}) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

 
  useEffect(() => {
    if (isVisible) {
      fetchCustomers();
    }
  }, [isVisible]);

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const customers = await getCustomers();
      setCustomers(customers);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "No se pudo cargar la lista de clientes.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmOrder = async () => {
    if (!selectedCustomer || !order) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Selecciona un cliente para continuar.",
      });
      return;
    }

    setIsLoading(true);
    try {
      
      const orderWithCustomer: Order = {
        ...order,
        idCustomer: selectedCustomer.idCustomer,
        customerName: selectedCustomer.name,
      };

   
      const createdOrder = await createOrder(orderWithCustomer);
      if (createdOrder.idOrder) {
      
      Toast.show({
        type: "success",
        text1: "Éxito",
        text2: "Pedido confirmado correctamente.",
      });
    }
      
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "No se pudo confirmar el pedido.",
      });
    } finally {
      setIsLoading(false);
      onClose(); 
    }
  };

  const renderCustomerItem = ({ item }: { item: Customer }) => (
    <TouchableOpacity
      style={[
        styles.customerItem,
        selectedCustomer?.idCustomer === item.idCustomer &&
          styles.selectedCustomerItem,
      ]}
      onPress={() => setSelectedCustomer(item)}
    >
      <Text style={styles.customerName}>{item.name}</Text>
      <Text style={styles.customerEmail}>{item.email}</Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Selecciona un cliente</Text>
          {isLoading ? (
            <ActivityIndicator size="large" color={colors.primary} />
          ) : (
            <>
              <FlatList
                data={customers}
                renderItem={renderCustomerItem}
                keyExtractor={(item) => item.idCustomer.toString()}
                contentContainerStyle={styles.customerList}
              />
              <View style={styles.actions}>
                <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                  <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.confirmButton}
                  onPress={handleConfirmOrder}
                  disabled={!selectedCustomer}
                >
                  <Text style={styles.buttonText}>Confirmar</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.darkGray,
    marginBottom: 16,
    textAlign: "center",
  },
  customerList: {
    flexGrow: 1,
  },
  customerItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  selectedCustomerItem: {
    backgroundColor: colors.lightWhite,
  },
  customerName: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.darkGray,
  },
  customerEmail: {
    fontSize: 14,
    color: colors.gray,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: colors.danger,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginRight: 8,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginLeft: 8,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ModalFinish;
