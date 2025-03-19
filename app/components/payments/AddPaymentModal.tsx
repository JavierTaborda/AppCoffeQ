import React, { useState , useEffect} from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Switch,
} from "react-native";
import { Payment } from "@/interfaces/Payment";
import { Customer } from "@/interfaces/Customer";
import { getNumberOrder} from "@/services/OrderService"
import ModalGeneric from "../ModalGeneric";
import { colors } from "@/constants/colors";
import { useAuthStore } from "@/stores/authStore";
import { Picker } from "@react-native-picker/picker";


interface AddPaymentModalProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: (newPayment: Payment) => void;
  customers: Customer[];

}

const AddPaymentModal: React.FC<AddPaymentModalProps> = ({
  isVisible,
  onClose,
  onConfirm,
  customers,

  
}) => {
  const { role, loading, cedula } = useAuthStore();
  const [selectedCedula, setSelectedCedula] = useState<string>(cedula);
  
  const [newPayment, setNewPayment] = useState<Payment>({
    idPayment: 0,
    idOrder: 0,
    date: new Date().toISOString(),
    isApproved: false,
    ref: "",
    amount: 0,
    customerName: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateFields = () => {
    const newErrors: { [key: string]: string } = {};

    if (!newPayment.ref) newErrors.ref = "La referencia es requerida.";
    if (!newPayment.customerName)
      newErrors.customerName = "El cliente es requerido.";
    if (newPayment.amount <= 0 || isNaN(newPayment.amount)) {
      newErrors.amount = "El monto debe ser un número válido y mayor que 0.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddPayment = () => {
    if (!validateFields()) {
      Alert.alert("Error", "Por favor, corrige los errores en el formulario.");
      return;
    }

    onConfirm(newPayment);
    resetForm();
  };

  const resetForm = () => {
    setNewPayment({
      idPayment: 0,
      idOrder: 0,
      date: new Date().toISOString(),
      isApproved: false,
      ref: "",
      amount: 0,
      customerName: "",
    });
    setErrors({});
    onClose();
  };

  useEffect(() => {
    if (cedula) {
      getNumberOrder(cedula)
        .then((response) => {
          setNewPayment((prevPayment) => ({
            ...prevPayment,
            idOrder: parseInt(response) || 0,
          }));
        })
        .catch((error) => {
          console.error("Error fetching order number:", error);
        });
    }
  }, [cedula]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
    <ModalGeneric
      isVisible={isVisible}
      onClose={resetForm}
      title="Agregar Nuevo Pago"
        confirmText="Agregar"
        cancelText="Cancelar"
        onConfirm={handleAddPayment}
    >
      <ScrollView contentContainerStyle={styles.formContainer}>
     
        <Text style={styles.label}>Seleccionar Cliente</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={newPayment.customerName}
            onValueChange={(itemValue) =>
              setNewPayment({ ...newPayment, customerName: itemValue })
            }
            style={styles.picker}
          >
            <Picker.Item label="Seleccione un cliente" value="" />
            {customers.map((customer) => (
              <Picker.Item
            key={customer.cedula}
            label={customer.name}
            value={customer.name}
              />
            ))}
          </Picker>
        </View>
        {errors.customerName && (
          <Text style={styles.errorText}>{errors.customerName}</Text>
        )}

        <TextInput
          style={[styles.input, errors.ref && styles.errorInput]}
          placeholder="Referencia"
          value={newPayment.ref}
          onChangeText={(text) => setNewPayment({ ...newPayment, ref: text })}
          placeholderTextColor={colors.darkGray}
        />
        {errors.ref && <Text style={styles.errorText}>{errors.ref}</Text>}

        <TextInput
          style={[styles.input, errors.amount && styles.errorInput]}
          placeholder="Monto"
          keyboardType="numeric"
          value={newPayment.amount.toString()}
          onChangeText={(text) =>
            setNewPayment({ ...newPayment, amount: parseFloat(text) || 0 })
          }
          placeholderTextColor={colors.darkGray}
        />
        {errors.amount && <Text style={styles.errorText}>{errors.amount}</Text>}

        <TextInput
          style={styles.input}
          placeholder="Número de Orden (opcional)"
          keyboardType="numeric"
          value={newPayment.idOrder.toString()}
          onChangeText={(text) =>
            setNewPayment({ ...newPayment, idOrder: parseInt(text) || 0 })
          }
          placeholderTextColor={colors.darkGray}
        />

        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>¿Aprobado?</Text>
          <Switch
            value={newPayment.isApproved}
            onValueChange={(value) =>
              setNewPayment({ ...newPayment, isApproved: value })
            }
            trackColor={{
              false: colors.lightGray,
              true: colors.primary,
            }}
            thumbColor={newPayment.isApproved ? colors.white : colors.white}
          />
        </View>

   
      </ScrollView>
    </ModalGeneric>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    padding: 16,
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 8,
    fontSize: 16,
    color: "#333",
    backgroundColor: "#fff",
  },
  pickerContainer: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: "#fff",
  },
  picker: {
    height: 50,
    color: "#333",
  },
 
  errorInput: {
    borderColor: "#ff4444",
  },
  errorText: {
    color: "#ff4444",
    fontSize: 12,
    marginBottom: 8,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 12,
  },
  switchLabel: {
    fontSize: 16,
    color: colors.darkGray,
    marginRight: 8,
  },
  saveButton: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: colors.darkGray,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  dropdownItemText: {
    fontSize: 16,
    color: "#333",
  },
});

export default AddPaymentModal;
