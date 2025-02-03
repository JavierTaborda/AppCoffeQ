
import { Payment } from '@/interfaces/Payment';
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import ModalGeneric from "../components/ModalGeneric";
import { colors } from '@/constants/colors';

const Payments = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");

  const handleConfirm = () => {
    alert(`Pago realizado: $${paymentAmount}`);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.buttonpay}
      >
        <Text>Abrir Modal de Pago</Text>
      </TouchableOpacity>

      <ModalGeneric
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={handleConfirm}
        title="Realizar Pago"
      >
        <TextInput
          style={styles.input}
          placeholder="Monto del Pago"
          value={paymentAmount}
          onChangeText={setPaymentAmount}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Referencia"
          value={paymentAmount}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Cliente"
          value={paymentAmount}
          keyboardType="numeric"
        />
      </ModalGeneric>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
    width: "100%",
  },
  buttonpay: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 10,
  },
});

export default Payments;