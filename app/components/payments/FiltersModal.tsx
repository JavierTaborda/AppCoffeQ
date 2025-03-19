import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Customer } from "@/interfaces/Customer";
import ModalGeneric from "../ModalGeneric";

interface FiltersModalProps {
  isVisible: boolean;
  onClose: () => void;
  startDate: Date;
  endDate: Date;
  customers: Customer[];
  selectedCustomer: string;
  onStartDateChange: (date: Date) => void;
  onEndDateChange: (date: Date) => void;
  onCustomerChange: (customer: string) => void;
  onConfirm: () => void;
}

const FiltersModal: React.FC<FiltersModalProps> = ({
  isVisible,
  onClose,
  startDate,
  endDate,
  customers,
  selectedCustomer,
  onStartDateChange,
  onEndDateChange,
  onCustomerChange,
  onConfirm,
}) => {
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const handleStartDateChange = (event: any, date?: Date) => {
    setShowStartDatePicker(false);
    if (date) {
      onStartDateChange(date);
    }
  };

  const handleEndDateChange = (event: any, date?: Date) => {
    setShowEndDatePicker(false);
    if (date) {
      onEndDateChange(date);
    }
  };

  return (
    <ModalGeneric
      isVisible={isVisible}
      onClose={onClose}
      title="Filtrar Pagos"
      confirmText="Aplicar Filtros"
      cancelText="Cancelar"
      onConfirm={() => {
        onConfirm();
        onClose();
      }}
    >
      <View style={{ alignItems: "center" }}>
        <View style={styles.datePickerContainer}>
          <Text style={styles.dateButtonText}>Inicio:</Text>
          {Platform.OS === "web" ? (
            <input
              type="date"
              value={startDate.toISOString().split("T")[0]}
              onChange={(e) => onStartDateChange(new Date(e.target.value))}
              style={{ flex: 1, marginLeft: 10 }}
            />
          ) : (
            <TouchableOpacity onPress={() => setShowStartDatePicker(true)}>
              <View style={styles.datestyle}>
                <Ionicons name="calendar" size={20} color={colors.primary} />
                <Text style={styles.dateButtonText}>
                  {startDate.toLocaleDateString()}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>

        {showStartDatePicker && Platform.OS !== "web" && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={handleStartDateChange}
            
          />
        )}

        <View style={styles.datePickerContainer}>
          <Text style={styles.dateButtonText}>Fin:</Text>
          {Platform.OS === "web" ? (
            <input
              type="date"
              value={endDate.toISOString().split("T")[0]}
              onChange={(e) => onEndDateChange(new Date(e.target.value))}
              style={{ flex: 1, marginLeft: 10 }}
            />
          ) : (
            <TouchableOpacity onPress={() => setShowEndDatePicker(true)}>
              <View style={styles.datestyle}>
                <Ionicons name="calendar" size={20} color={colors.primary} />
                <Text style={styles.dateButtonText}>
                  {endDate.toLocaleDateString()}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>

        {showEndDatePicker && Platform.OS !== "web" && (
          <DateTimePicker
            value={endDate}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={handleEndDateChange}
          />
        )}
      </View>
      <View style={{ marginBottom: 20 }}>
        <Text style={styles.dateButtonText}>Cliente:</Text>
        <Picker
          selectedValue={selectedCustomer || ""}
          onValueChange={onCustomerChange}
          style={styles.customerPicker}
        >
          <Picker.Item label="Todos los clientes" value="Todos" />
          {customers.map((customer) => (
            <Picker.Item
              key={customer.idCustomer}
              label={customer.name}
              value={customer.cedula}
            />
          ))}
        </Picker>
      </View>
    </ModalGeneric>
  );
};

const styles = StyleSheet.create({
  datePickerContainer: {
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: colors.lightWhite,
    borderRadius: 10,
    marginBottom: 15,
    boxShadow: "2px 2px 5px rgba(0,0,0,0.2)",
    elevation: 2,
  },
  dateButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.darkGray,
    alignItems: "center",
    justifyContent: "space-between",
  },
  customerPicker: {
    alignContent: "center",
    height: 50,
    paddingTop: 5,
    backgroundColor: colors.lightWhite,
    borderRadius: 10,
    paddingHorizontal: 10,
    fontSize: 16,
    color: colors.darkGray,
    boxShadow: "2px 2px 5px rgba(0,0,0,0.7)",
    elevation: 2,
  },
  datestyle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
  },
});

export default FiltersModal;
