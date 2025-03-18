// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Platform,
// } from "react-native";
// import { Picker } from "@react-native-picker/picker";
// import { colors } from "@/constants/colors";
// import { Ionicons } from "@expo/vector-icons";
// import DateTimePicker from "@react-native-community/datetimepicker";
// import { Customer } from "@/interfaces/Customer";

// interface FiltersModalProps {
//   isVisible: boolean;
//   onClose: () => void;
//   startDate: Date;
//   endDate: Date;
//   customers: Customer[];
//   selectedCustomer: string | null;
//   onStartDateChange: (date: Date) => void;
//   onEndDateChange: (date: Date) => void;
//   onCustomerChange: (customer: string | null) => void;
// }

// const FiltersModal: React.FC<FiltersModalProps> = ({
//   isVisible,
//   onClose,
//   startDate,
//   endDate,
//   customers,
//   selectedCustomer,
//   onStartDateChange,
//   onEndDateChange,
//   onCustomerChange,
// }) => {
//   const [showStartDatePicker, setShowStartDatePicker] = useState(false);
//   const [showEndDatePicker, setShowEndDatePicker] = useState(false);

//   if (!isVisible) return null;

//   const handleStartDateChange = (event: any, date?: Date) => {
//     setShowStartDatePicker(false);
//     if (date) {
//       onStartDateChange(date);
//     }
//   };

//   const handleEndDateChange = (event: any, date?: Date) => {
//     setShowEndDatePicker(false);
//     if (date) {
//       onEndDateChange(date);
//     }
//   };

//   return (
//     <View style={styles.modalOverlay}>
//       <View style={styles.modalContent}>
//         <Text style={styles.modalTitle}>Filtrar Pagos</Text>

//         <TouchableOpacity
//           style={styles.datePickerContainer}
//           onPress={() => setShowStartDatePicker(true)}
//         >
//           <Ionicons name="calendar" size={20} color={colors.primary} />
//           <Text style={styles.dateButtonText}>
//             Inicio: {startDate.toLocaleDateString()}
//           </Text>
//         </TouchableOpacity>

//         {showStartDatePicker && (
//           <DateTimePicker
//             value={startDate}
//             mode="date"
//             display={Platform.OS === "ios" ? "spinner" : "default"}
//             onChange={handleStartDateChange}
//           />
//         )}

//         <TouchableOpacity
//           style={styles.datePickerContainer}
//           onPress={() => setShowEndDatePicker(true)}
//         >
//           <Ionicons name="calendar" size={20} color={colors.primary} />
//           <Text style={styles.dateButtonText}>
//             Fin: {endDate.toLocaleDateString()}
//           </Text>
//         </TouchableOpacity>

//         {showEndDatePicker && (
//           <DateTimePicker
//             value={endDate}
//             mode="date"
//             display={Platform.OS === "ios" ? "spinner" : "default"}
//             onChange={handleEndDateChange}
//           />
//         )}

//         <Picker
//           selectedValue={selectedCustomer}
//           onValueChange={onCustomerChange}
//           style={styles.customerPicker}
//         >
//           <Picker.Item label="Todos los clientes" value={null} />
//           {customers.map((customer) => (
//             <Picker.Item
//               key={customer.idCustomer}
//               label={customer.name}
//               value={customer.cedula}
//             />
//           ))}
//         </Picker>

//         <TouchableOpacity style={styles.closeButton} onPress={onClose}>
//           <Text style={styles.closeButtonText}>Cerrar</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   modalOverlay: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "rgba(0, 0, 0, 0.5)",
//   },
//   modalContent: {
//     width: "90%",
//     backgroundColor: colors.white,
//     borderRadius: 10,
//     padding: 20,
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: "bold",
//     marginBottom: 20,
//     textAlign: "center",
//   },
//   datePickerContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 10,
//   },
//   dateButton: {
//     padding: 10,
//     backgroundColor: colors.lightWhite,
//     borderRadius: 10,
//     marginLeft: 10,
//   },
//   dateButtonText: {
//     fontSize: 16,
//     color: colors.darkGray,
//   },
//   customerPicker: {
//     height: 50,
//     width: "100%",
//     backgroundColor: colors.lightWhite,
//     borderRadius: 10,
//     marginBottom: 20,
//   },
//   closeButton: {
//     backgroundColor: colors.primary,
//     padding: 10,
//     borderRadius: 10,
//     alignItems: "center",
//   },
//   closeButtonText: {
//     color: colors.white,
//     fontSize: 16,
//     fontWeight: "bold",
//   },
// });

// export default FiltersModal;
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
  customers,
  selectedCustomer,
  onStartDateChange,
  onEndDateChange,
  onCustomerChange,
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
        onClose();
      }}
    >
      
      <TouchableOpacity
        style={styles.datePickerContainer}
        onPress={() => setShowStartDatePicker(true)}
      >
        <Ionicons name="calendar" size={20} color={colors.primary} />
        <Text style={styles.dateButtonText}>
          Inicio: {startDate.toLocaleDateString()}
        </Text>
      </TouchableOpacity>

      {showStartDatePicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleStartDateChange}
        />
      )}

      <TouchableOpacity
        style={styles.datePickerContainer}
        onPress={() => setShowEndDatePicker(true)}
      >
        <Ionicons name="calendar" size={20} color={colors.primary} />
        <Text style={styles.dateButtonText}>
          Fin: {endDate.toLocaleDateString()}
        </Text>
      </TouchableOpacity>

      {showEndDatePicker && (
        <DateTimePicker
          value={endDate}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleEndDateChange}
        />
      )}

      <Picker
        selectedValue={selectedCustomer}
        onValueChange={onCustomerChange}
        style={styles.customerPicker}
      >
        <Picker.Item label="Todos los clientes" value={null} />
        {customers.map((customer) => (
          <Picker.Item
            key={customer.idCustomer}
            label={customer.name}
            value={customer.cedula}
          />
        ))}
      </Picker>
    </ModalGeneric>
  );
};

const styles = StyleSheet.create({
  datePickerContainer: {
    flexDirection: "row",
    alignItems: "center",
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
});

export default FiltersModal;
