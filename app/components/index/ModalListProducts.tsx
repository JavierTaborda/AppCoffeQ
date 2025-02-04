import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import ModalGeneric from "../ModalGeneric";
import { Order } from "@/interfaces/Order";
import { colors } from "@/constants/colors";

interface ModalProductProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  order: Order | null;
}

const ModalListProducts: React.FC<ModalProductProps> = ({
  isVisible,
  onClose,
  onConfirm,
  order,
}) => {
  return (
    <ModalGeneric
      isVisible={isVisible}
      onClose={onClose}
      onConfirm={onConfirm}
      title={"Detalles de Compra"}
      confirmText="Confirmar"
      cancelText="Cancelar"
    >
      {order ? (
        <FlatList
          data={order.orderDetails}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.productCard}>
              <Text style={styles.productName}>{item.productName}</Text>
              <Text style={styles.productPrice}>
                ${item.subtotal.toFixed(2)} x {item.quantity} = $
                {(item.subtotal * item.quantity).toFixed(2)}
              </Text>
            </View>
          )}
          contentContainerStyle={styles.productList}
          showsVerticalScrollIndicator={true}
        />
      ) : (
        <Text>No hay detalles de la orden disponibles.</Text>
      )}
    </ModalGeneric>
  );
};

const styles = StyleSheet.create({
  productList: {
    flexGrow: 1,
    width: "100%",
    marginBottom: 20,
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
});

export default ModalListProducts;

// import React, { useRef, useEffect, useState } from "react";
// import {
//   Modal,
//   View,
//   Text,
//   TouchableOpacity,
//   ScrollView,
//   StyleSheet,
//   Animated,
//   PanResponder,
//   NativeSyntheticEvent,
//   NativeScrollEvent,
// } from "react-native";
// import { Order } from "@/interfaces/Order";
// import { colors } from "@/constants/colors";

// interface ModalListProductsProps {
//   isVisible: boolean;
//   onClose: () => void;
//   onConfirm: () => void;
//   order: Order | null;
// }

// const ModalListProducts: React.FC<ModalListProductsProps> = ({
//   isVisible,
//   onClose,
//   onConfirm,
//   order,
// }) => {
//   const panY = useRef(new Animated.Value(0)).current;
//   const overlayOpacity = useRef(new Animated.Value(0)).current;
//   const [isScrolling, setIsScrolling] = useState(false);
//   const [isAtTop, setIsAtTop] = useState(true);
//   const pressTimer = useRef<NodeJS.Timeout | null>(null); // Temporizador para el gesto largo

//   useEffect(() => {
//     if (isVisible) {
//       Animated.timing(overlayOpacity, {
//         toValue: 1,
//         duration: 300,
//         useNativeDriver: true,
//       }).start();
//     } else {
//       Animated.timing(overlayOpacity, {
//         toValue: 0,
//         duration: 300,
//         useNativeDriver: true,
//       }).start();
//       panY.setValue(0);
//     }
//   }, [isVisible]);

//   const panResponder = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => !isScrolling && isAtTop,
//       onMoveShouldSetPanResponder: () => !isScrolling && isAtTop,
//       onPanResponderMove: (_, gestureState) => {
//         if (gestureState.dy > 0) {
//           panY.setValue(gestureState.dy);
//         }
//       },
//       onPanResponderRelease: (_, gestureState) => {
//         if (gestureState.dy > 30 && gestureState.vy > 0.5) {
//           Animated.timing(panY, {
//             toValue: 500,
//             duration: 200,
//             useNativeDriver: true,
//           }).start(onClose);
//         } else {
//           Animated.timing(panY, {
//             toValue: 0,
//             duration: 200,
//             useNativeDriver: true,
//           }).start();
//         }
//       },
//     })
//   ).current;

//   const translateY = panY.interpolate({
//     inputRange: [-1, 0, 1],
//     outputRange: [0, 0, 1],
//   });

//   const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
//     const offsetY = event.nativeEvent.contentOffset.y;
//     setIsAtTop(offsetY <= 0);
//   };

//   return (
//     <Modal
//       animationType="fade"
//       transparent={true}
//       visible={isVisible}
//       onRequestClose={onClose}
//     >
//       <Animated.View
//         style={[
//           styles.modalOverlay,
//           {
//             opacity: overlayOpacity,
//           },
//         ]}
//       >
//         <Animated.View
//           style={[
//             styles.modalContent,
//             {
//               transform: [{ translateY }],
//             },
//           ]}
//         >
//           <View
//             style={styles.dragBarContainer}
//             {...panResponder.panHandlers}

//           >
//             <View style={styles.dragBar} />
//           </View>
//           <Text style={styles.modalTitle}>Tu Carrito de Compras</Text>

//           <ScrollView
//             contentContainerStyle={styles.productList}
//             scrollEnabled={true}
//             onScroll={handleScroll}
//             scrollEventThrottle={16}
//             onScrollBeginDrag={() => setIsScrolling(true)}
//             onScrollEndDrag={() => setIsScrolling(false)}
//           >
//             {order &&
//               order.orderDetails &&
//               order.orderDetails.map((detail, index) => (
//                 <View key={index} style={styles.productCard}>
//                   <View style={styles.productContent}>
//                     <Text style={styles.productName}>{detail.productName}</Text>
//                     <Text style={styles.productPrice}>
//                       ${detail.subtotal.toFixed(2)} x {detail.quantity} = $
//                       {detail.subtotal.toFixed(2)}
//                     </Text>
//                   </View>
//                 </View>
//               ))}
//           </ScrollView>

//           <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
//             <Text style={styles.confirmButtonText}>Confirmar Pedido</Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
//             <Text style={styles.cancelButtonText}>Seguir Comprando</Text>
//           </TouchableOpacity>
//         </Animated.View>
//       </Animated.View>
//     </Modal>
//   );
// };

// const styles = StyleSheet.create({
//   modalOverlay: {
//     flex: 1,
//     justifyContent: "flex-end",
//     alignItems: "center",
//     backgroundColor: "rgba(0, 0, 0, 0.5)",
//   },
//   modalContent: {
//     backgroundColor: colors.white,
//     padding: 20,
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     width: "100%",
//     maxHeight: "80%",
//     alignItems: "center",
//   },
//   dragBarContainer: {
//     width: "100%",
//     alignItems: "center",
//     marginBottom: 10,
//     paddingVertical: 10, // Aumentar el espacio alrededor de la barra
//   },
//   dragBar: {
//     width: 80, // Hacer la barra más ancha
//     height: 8, // Hacer la barra más gruesa
//     borderRadius: 4,
//     backgroundColor: "#ccc",
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: "bold",
//     marginBottom: 20,
//     textAlign: "center",
//   },
//   productList: {
//     flexGrow: 1,
//     width: "100%",
//   },
//   productCard: {
//     backgroundColor: colors.white,
//     borderRadius: 16,
//     marginBottom: 20,
//     padding: 10,
//     shadowColor: colors.darkGray,
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 5,
//   },
//   productContent: {
//     width: "100%",
//   },
//   productName: {
//     fontSize: 18,
//     fontWeight: "600",
//     color: colors.darkGray,
//     marginBottom: 8,
//   },
//   productPrice: {
//     fontSize: 16,
//     color: colors.secondary,
//     fontWeight: "500",
//   },
//   confirmButton: {
//     backgroundColor: colors.primary,
//     padding: 15,
//     borderRadius: 10,
//     alignItems: "center",
//     marginBottom: 10,
//     width: "100%",
//   },
//   confirmButtonText: {
//     color: "white",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   cancelButton: {
//     backgroundColor: "#ccc",
//     padding: 15,
//     borderRadius: 10,
//     alignItems: "center",
//     marginBottom: 10,
//     width: "100%",
//   },
//   cancelButtonText: {
//     color: "#333",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
// });

// export default ModalListProducts;
