// components/FiltersModal.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Picker } from "@react-native-picker/picker";
import { colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";

interface FiltersModalProps {
  isVisible: boolean;
  onClose: () => void;
  startDate: Date;
  endDate: Date;
  selectedCustomer: string | null;
  onStartDateChange: (date: Date) => void;
  onEndDateChange: (date: Date) => void;
  onCustomerChange: (customer: string | null) => void;
}

const FiltersModal: React.FC<FiltersModalProps> = ({
  isVisible,
  onClose,
  startDate,
  endDate,
  selectedCustomer,
  onStartDateChange,
  onEndDateChange,
  onCustomerChange,
}) => {
  const [isStartDatePickerVisible, setStartDatePickerVisibility] =
    React.useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisibility] =
    React.useState(false);

  if (!isVisible) return null;

  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Filtrar Pagos</Text>

        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setStartDatePickerVisibility(true)}
        >
          <Ionicons name="calendar" size={20} color={colors.primary} />
          <Text style={styles.dateButtonText}>
            Inicio: {startDate.toLocaleDateString()}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setEndDatePickerVisibility(true)}
        >
          <Ionicons name="calendar" size={20} color={colors.primary} />
          <Text style={styles.dateButtonText}>
            Fin: {endDate.toLocaleDateString()}
          </Text>
        </TouchableOpacity>

        <Picker
          selectedValue={selectedCustomer}
          onValueChange={onCustomerChange}
          style={styles.customerPicker}
        >
          <Picker.Item label="Todos los clientes" value={null} />
          <Picker.Item label="Cliente 1" value="Cliente 1" />
          <Picker.Item label="Cliente 2" value="Cliente 2" />
        </Picker>

        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Cerrar</Text>
        </TouchableOpacity>

        <DateTimePickerModal
          isVisible={isStartDatePickerVisible}
          mode="date"
          onConfirm={(date) => {
            onStartDateChange(date);
            setStartDatePickerVisibility(false);
          }}
          onCancel={() => setStartDatePickerVisibility(false)}
        />
        <DateTimePickerModal
          isVisible={isEndDatePickerVisible}
          mode="date"
          onConfirm={(date) => {
            onEndDateChange(date);
            setEndDatePickerVisibility(false);
          }}
          onCancel={() => setEndDatePickerVisibility(false)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: colors.lightWhite,
    borderRadius: 10,
    marginBottom: 10,
  },
  dateButtonText: {
    marginLeft: 10,
    fontSize: 16,
    color: colors.darkGray,
  },
  customerPicker: {
    height: 50,
    width: "100%",
    backgroundColor: colors.lightWhite,
    borderRadius: 10,
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  closeButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default FiltersModal;
