import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Modal,
  TouchableOpacity,
} from "react-native";
import { Order } from "@/interfaces/Order";
import { colors } from "@/constants/colors";
import Toast from "react-native-toast-message";

interface ModalProductProps {
  isVisible: boolean;
  onClose: () => void;
  onDelete: () => void;
  order: Order | null;
}

interface OrderDetails {
  productName: string;
  subtotal: number;
  quantity: number;
}

const ModalListProducts: React.FC<ModalProductProps> = ({
  isVisible,
  onClose,
  onDelete,
  order,
}) => {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleDelete = () => {
    setShowConfirmation(true);
  };

  const confirmDelete = () => {
    onDelete();
    setShowConfirmation(false);
    onClose();
    Toast.show({
      type: "success",
      text1: "Éxito",
      text2: "La orden ha sido eliminada correctamente.",
    });
  };

  const renderProductCard = ({ item }: { item: OrderDetails }) => (
    <View style={styles.productCard}>
      <Text style={styles.productName}>{item.productName}</Text>
      <Text style={styles.productPrice}>
        ${item.subtotal.toFixed(2)} x {item.quantity} = $
        {(item.subtotal * item.quantity).toFixed(2)}
      </Text>
    </View>
  );

  return (
    <>
      <Modal
        transparent={true}
        animationType="slide"
        visible={isVisible}
        onRequestClose={onClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Detalles de Compra</Text>
            <View style={styles.modalContent}>
              {order?.orderDetails.length ? (
                <>
                  <FlatList
                    data={order.orderDetails}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderProductCard}
                    contentContainerStyle={styles.productList}
                  />
                  <Text style={styles.productName}>
                    Total de orden: ${order.total}
                  </Text>
                </>
              ) : (
                <Text>No hay detalles de la orden disponibles.</Text>
              )}
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity onPress={onClose} style={styles.actionButton}>
                <Text style={styles.actionText}>Aceptar</Text>
              </TouchableOpacity>

              {order?.orderDetails.length ? (
                <TouchableOpacity
                  onPress={handleDelete}
                  style={styles.deleteButton}
                >
                  <Text style={styles.actionText}> Eliminar</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de Confirmación */}
      <Modal
        transparent={true}
        animationType="fade"
        visible={showConfirmation}
        onRequestClose={() => setShowConfirmation(false)}
      >
        <View style={[styles.modalOverlay, { zIndex: 9999 }]}>
          <View style={styles.confirmationModal}>
            <Text style={styles.confirmationText}>
              ¿Estás seguro de que deseas eliminar esta orden?
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

      <Toast />
    </>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    shadowColor: colors.darkGray,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.darkGray,
    marginBottom: 16,
  },
  modalContent: {
    flexGrow: 1,
    flexShrink: 1,
    marginBottom: 16,
  },
  productList: {
    flexGrow: 1,
    width: "100%",
  },
  productCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    marginBottom: 20,
    padding: 10,
    shadowColor: colors.darkGray,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  productName: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.darkGray,
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 16,
    color: colors.secondary,
    fontWeight: "500",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  actionButton: {
    flex: 1,
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: colors.danger,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  actionText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "500",
  },
  confirmationModal: {
    width: "80%",
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    shadowColor: colors.darkGray,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  confirmationText: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.darkGray,
    marginBottom: 20,
    textAlign: "center",
  },
  confirmationActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: colors.secondary,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
});

export default ModalListProducts;
