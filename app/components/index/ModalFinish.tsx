import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ActivityIndicator,
  TextInput,
  Animated,
  Dimensions,
  Image,
} from "react-native";
import { Customer } from "@/interfaces/Customer";
import { Order } from "@/interfaces/Order";
import { createOrder } from "@/services/OrderService";
import { getCustomer } from "@/services/CustomerService";
import { colors } from "@/constants/colors";
import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";

const { height } = Dimensions.get("window");

interface ModalFinishProps {
  isVisible: boolean;
  onClose: () => void;
  onDelete: () => void;
  order: Order | null;
}

const ModalFinish: React.FC<ModalFinishProps> = ({
  isVisible,
  onClose,
  order,
  onDelete,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(isVisible);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(height))[0];
  const [showCustomerCard, setShowCustomerCard] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setModalVisible(true);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: height,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setModalVisible(false);
        setSelectedCustomer(null);
        setShowCustomerCard(false);
      });
    }
  }, [isVisible]);

  const handleSearchCustomer = async () => {
    if (!searchQuery.trim()) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Ingresa una cédula o correo para buscar.",
      });
      return;
    }

    setIsLoading(true);
    try {
      const customer = await getCustomer(searchQuery.trim());
      if (customer) {
        setSelectedCustomer(customer);
        setShowCustomerCard(true);
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "No se encontró un cliente con esa cédula o correo.",
        });
        setSelectedCustomer(null);
        setShowCustomerCard(false);
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Hubo un problema al buscar el cliente.",
      });
      setSelectedCustomer(null);
      setShowCustomerCard(false);
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
       onDelete();
      onClose();
    }
  };

  return (
    <Modal
      transparent={true}
      animationType="none"
      visible={modalVisible}
      onRequestClose={onClose}
    >
      <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
        <Animated.View
          style={[
            styles.modalContainer,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          <Text style={styles.modalTitle}>Buscar Cliente</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Ingresa cédula o correo..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={colors.gray}
            autoCapitalize="none"
            keyboardType="default"
          />
          <TouchableOpacity
            style={styles.searchButton}
            onPress={handleSearchCustomer}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={colors.white} />
            ) : (
              <View style={styles.searchButtonContent}>
                <Ionicons name="search" size={20} color={colors.white} />
                <Text style={styles.searchButtonText}>Buscar Cliente</Text>
              </View>
            )}
          </TouchableOpacity>

          {showCustomerCard && selectedCustomer && (
            <Animated.View style={[styles.customerCard, { opacity: fadeAnim }]}>
              <Image
                source={{ uri: "https://via.placeholder.com/100" }} // Usa una imagen real del cliente
                style={styles.customerImage}
              />
              <Text style={styles.customerName}>{selectedCustomer.name}</Text>
              <Text style={styles.customerEmail}>{selectedCustomer.email}</Text>
              <Text style={styles.customerCedula}>
                Cédula: {selectedCustomer.cedula}
              </Text>
            </Animated.View>
          )}

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
        </Animated.View>
      </Animated.View>
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.darkGray,
    marginBottom: 16,
    textAlign: "center",
  },
  searchInput: {
    height: 50,
    borderColor: colors.lightGray,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 16,
    color: colors.darkGray,
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 16,
  },
  searchButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  searchButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  customerCard: {
    backgroundColor: colors.lightWhite,
    borderRadius: 10,
    padding: 15,
    marginBottom: 16,
    alignItems: "center",
  },
  customerImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  customerName: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.darkGray,
    marginBottom: 8,
  },
  customerEmail: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: 4,
  },
  customerCedula: {
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
