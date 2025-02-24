import React from "react";
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

interface ModalProductProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  order: Order | null;
}

interface ProductCardProps {
  productName: string;
  subtotal: number;
  quantity: number;
}

const ProductCard: React.FC<ProductCardProps> = ({
  productName,
  subtotal,
  quantity,
}) => (
  <View style={styles.productCard}>
    <Text style={styles.productName}>{productName}</Text>
    <Text style={styles.productPrice}>
      ${subtotal.toFixed(2)} x {quantity} = ${(subtotal * quantity).toFixed(2)}
    </Text>
  </View>
);

const ActionButton: React.FC<{ onPress: () => void; text: string }> = ({
  onPress,
  text,
}) => (
  <TouchableOpacity onPress={onPress} style={styles.actionButton}>
    <Text style={styles.actionText}>{text}</Text>
  </TouchableOpacity>
);

const ModalListProducts: React.FC<ModalProductProps> = ({
  isVisible,
  onClose,
  onConfirm,
  order,
}) => {
  return (
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
            {order ? (
              <FlatList
                data={order.orderDetails}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <ProductCard
                    productName={item.productName}
                    subtotal={item.subtotal}
                    quantity={item.quantity}
                  />
                )}
                contentContainerStyle={styles.productList}
              />
            ) : (
              <Text>No hay detalles de la orden disponibles.</Text>
            )}
          </View>
          <View style={styles.modalActions}>
            <ActionButton onPress={onClose} text="Cancelar" />
            <ActionButton onPress={onConfirm} text="Confirmar" />
          </View>
        </View>
      </View>
    </Modal>
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
  actionText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "500",
  },
});
export default ModalListProducts;
