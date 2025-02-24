import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import ModalGeneric from "../ModalGeneric";
import { Product } from "@/interfaces/Product";
import { colors } from "@/constants/colors";
interface ModalProductProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: (quantity: number) => void; 
  selectedProduct: Product | null;
}

const ModalProduct: React.FC<ModalProductProps> = ({
  isVisible,
  onClose,
  onConfirm,
  selectedProduct,
}) => {
  const [quantity, setQuantity] = useState<number>(1);

  
  useEffect(() => {
    if (selectedProduct) {
      setQuantity(1);
    }
  }, [selectedProduct]);

  const incrementQuantity = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const decrementQuantity = () => {
    setQuantity((prevQuantity) => (prevQuantity > 1 ? prevQuantity - 1 : 1));
  };

  const handleConfirm = () => {
    onConfirm(quantity); 
    onClose(); 
  }

  return (
    <ModalGeneric
      isVisible={isVisible}
      onClose={onClose}
      onConfirm={handleConfirm}
      title={selectedProduct?.name || "Confirmar Compra"}
      confirmText="Confirmar"
      cancelText="Cancelar"
    >
      {selectedProduct && (
        <>
          <View style={{ alignItems: "center" }}>
            <Image
              source={{ uri: selectedProduct.image }}
              style={styles.modalImage}
            />
            <Text style={styles.modalPrice}>
              Precio: ${selectedProduct.price.toFixed(2)}
            </Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                onPress={decrementQuantity}
                style={styles.quantityButton}
              >
                <Text style={styles.quantityButtonText}>-</Text>
              </TouchableOpacity>
              <TextInput
                style={styles.quantityInput}
                placeholder="Cantidad"
                keyboardType="numeric"
                value={quantity.toString()}
                onChangeText={(text) => setQuantity(parseInt(text) || 0)}
              />
              <TouchableOpacity
                onPress={incrementQuantity}
                style={styles.quantityButton}
              >
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
    </ModalGeneric>
  );
};

const styles = StyleSheet.create({
  modalImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 20,
  },
  modalPrice: {
    fontSize: 16,
    color: colors.gray,
    marginBottom: 20,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  quantityButton: {
    backgroundColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  quantityButtonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  quantityInput: {
    height: 40,
    width: 60,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    textAlign: "center",
  },
});

export default ModalProduct;
