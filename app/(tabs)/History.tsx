import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,

} from "react-native";
import { Order } from "@/interfaces/Order";
import { OrderDetail } from "@/interfaces/OrderDetail";
import { getOrderRecord } from "@/services/OrderService";
import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/constants/colors";
import { useAuthStore } from "@/stores/authStore"; 
import { LinearGradient } from "expo-linear-gradient";

const History: React.FC = () => {
  const [orderCustomer, setOrderCustomer] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const { signOut, cedula, loading } = useAuthStore(); 

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const order = await getOrderRecord(cedula);
      setOrderCustomer(order);
    } catch (error) {
      console.error(error);
      setError("Error al cargar el pedido. Inténtalo de nuevo más tarde.");
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "No se pudo cargar el pedido.",
      });
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const renderOrderDetailItem = ({ item }: { item: OrderDetail }) => (
    <View style={styles.detailCard}>
      <View style={styles.detailContent}>
        <Text style={styles.detailTitle}>
          {item.productName || "Producto sin nombre"}
        </Text>
        <View style={styles.detailRow}>
          <Ionicons name="pricetag" size={16} color={colors.primary} />
          <Text style={styles.detailText}>${item.subtotal.toFixed(2)}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="cart" size={16} color={colors.primary} />
          <Text style={styles.detailText}>Cantidad: {item.quantity}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons
            name={item.isPaid ? "checkmark-circle" : "close-circle"}
            size={16}
            color={item.isPaid ? colors.primary : colors.danger}
          />
          <Text style={styles.detailText}>
            {item.isPaid ? "Pagado" : "Pendiente"}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderOrderItem = (order: Order) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>Pedido #{order.idOrder}</Text>
        <Text style={styles.orderDate}>{order.date}</Text>
      </View>
      <Text style={styles.customerName}>
        Cliente: {order.customerName || "No disponible"}
      </Text>
      <Text style={styles.orderTotal}>Total: ${order.total.toFixed(2)}</Text>

      <Text style={styles.detailsTitle}>Detalles del Pedido:</Text>
      {order.orderDetailsDTO && order.orderDetailsDTO.length > 0 ? (
        <FlatList
          data={order.orderDetailsDTO}
          renderItem={renderOrderDetailItem}
          keyExtractor={(item) => item.idOrderDetail.toString()}
          contentContainerStyle={styles.detailsList}
        />
      ) : (
        <Text style={styles.emptyText}>No hay detalles del pedido.</Text>
      )}
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={fetchOrders} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }
  if(loading){
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Todos tus consumos</Text>
      {orderCustomer && orderCustomer.idOrder ? (
        <FlatList
          data={[orderCustomer]}
          renderItem={({ item }) => renderOrderItem(item)}
          keyExtractor={(item) => item.idOrder.toString()}
          refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[colors.primary]}
          tintColor={colors.primary}
        />
          }
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No hay pedidos registrados.</Text>
        </View>
      )}
      <TouchableOpacity onPress={signOut}>
        <LinearGradient
          colors={[colors.danger, colors.dangerlight]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.cerrarSesion}
        >
          <View style={styles.infoContent}>
          <Ionicons name="log-out" size={24} color="#ffffff" />
          <Text style={styles.textoCerrarSesion}>Cerrar sesión</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.white,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.darkGray,
    marginBottom: 16,
  },
  orderCard: {
    backgroundColor: colors.lightWhite,
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
    elevation: 3,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  orderId: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.darkGray,
  },
  orderDate: {
    fontSize: 14,
    color: colors.gray,
  },
  customerName: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: 8,
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.primary,
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.darkGray,
    marginTop: 16,
    marginBottom: 8,
  },
  detailsList: {
    paddingBottom: 16,
  },
  detailCard: {
    flexDirection: "row",
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
    elevation: 3,
  },
  detailImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 12,
  },
  detailContent: {
    flex: 1,
    justifyContent: "center",
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.darkGray,
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  detailText: {
    fontSize: 14,
    color: colors.gray,
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: colors.danger,
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: colors.white,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: colors.gray,
  },
  cerrarSesion: {
    padding: 16,
    marginVertical: 10,
    marginHorizontal: 5,
    borderRadius: 15,
    alignItems: "center",
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
  
  },
  infoContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  textoCerrarSesion: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default History;
