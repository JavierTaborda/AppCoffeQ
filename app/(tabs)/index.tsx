import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faBagShopping,
  faDollarSign,
  faCaretRight,
} from "@fortawesome/free-solid-svg-icons";
import { getProducts } from "../../services/ProductsService";
import { colors } from "../../constants/colors";
import { Product } from "@/interfaces/Product";
import { Order } from "@/interfaces/Order";
import { OrderDetail } from "@/interfaces/OrderDetail";
import ModalProduct from "../components/index/ModalProduct";
import ModalListProducts from "../components/index/ModalListProducts";

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState<string>("");
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [isModalListVisible, setModalListVisible] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [order, setOrder] = useState<Order>({
    idOrder: 0,
    idCustomer: 0,
    date: new Date().toISOString(),
    total: 0,
    customerName: "",
    orderDetails: [],
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const products = await getProducts();
        setProducts(products);
        setFilteredProducts(products);
      } catch (error) {
        alert("Failed to load products. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleSearch = useCallback(
    (text: string) => {
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredProducts(filtered);
      setSearch(text);
    },
    [products]
  );

  const handleBuy = useCallback((product: Product) => {
    setSelectedProduct(product);
    setModalVisible(true);
  }, []);

const handleConfirmPurchase = useCallback(
  (quantity: number) => {
    if (selectedProduct) {
      // find product in order details
      const existingProductIndex = order.orderDetails.findIndex(
        (detail) => detail.idProduct === selectedProduct.idProduct
      );

      let updatedOrderDetails = [...order.orderDetails];
      let updatedTotal = order.total;

      if (existingProductIndex !== -1) {
        //update existing product
        const existingDetail = updatedOrderDetails[existingProductIndex];
        existingDetail.quantity += quantity;
        existingDetail.subtotal += selectedProduct.price * quantity;
        updatedTotal += selectedProduct.price * quantity;
      } else {
        
        const newOrderDetail: OrderDetail = {
          idOrderDetail: 0,
          idOrder: order.idOrder,
          idProduct: selectedProduct.idProduct,
          quantity: quantity,
          subtotal: selectedProduct.price * quantity,
          isPaid: false,
          productName: selectedProduct.name,
          date: new Date().toISOString(),
          datePaid: "",
        };
        updatedOrderDetails.push(newOrderDetail);
        updatedTotal += selectedProduct.price * quantity;
      }

      // Actualizar el estado de la orden
      setOrder({
        ...order,
        orderDetails: updatedOrderDetails,
        total: updatedTotal,
      });

      setModalVisible(false);
      alert(`Agregado: ${selectedProduct.name} x ${quantity}`);
    }
  },
  [selectedProduct, order]
);
  const renderItem = useCallback(
    ({ item }: { item: Product }) => (
      <View style={styles.item}>
        <View style={styles.containerimg}>
          <Image
            key={item.image}
            source={{ uri: item.image }}
            style={styles.image}
          />
        </View>
        <View style={styles.containerinfo}>
          <View>
            <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
              {item.name}
            </Text>
            <Text style={styles.price}>${item.price.toFixed(2)}</Text>
            <Text
              style={styles.description}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item.description}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.buy}
            onPress={() => handleBuy(item)}
            activeOpacity={0.7}
          >
            <Text style={styles.buycolor}>Comprar</Text>
          </TouchableOpacity>
        </View>
      </View>
    ),
    [handleBuy]
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setModalListVisible(true)}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={[colors.primary, colors.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.infoContainer}
        >
          <View style={styles.infoContent}>
            <View style={styles.infoSection}>
              <FontAwesomeIcon
                icon={faBagShopping}
                size={24}
                color={colors.white}
              />
              <Text style={styles.infoText}>{order.orderDetails.length}</Text>
              <Text style={styles.infoLabel}>Productos</Text>
            </View>
            <View style={styles.infoSection}>
              <FontAwesomeIcon
                icon={faDollarSign}
                size={24}
                color={colors.white}
              />
              <Text style={styles.infoText}>${order.total.toFixed(2)}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => alert("Compra generada")}
            activeOpacity={0.7}
          >
            <Text style={styles.createButtonText}>Crear</Text>
            <FontAwesomeIcon
              icon={faCaretRight}
              size={20}
              color={colors.white}
            />
          </TouchableOpacity>
        </LinearGradient>
      </TouchableOpacity>

      <TextInput
        style={styles.searchbar}
        placeholder="Buscar Producto"
        value={search}
        onChangeText={handleSearch}
      />

      <FlatList
        data={filteredProducts}
        renderItem={renderItem}
        keyExtractor={(item) => item.idProduct.toString()}
        contentContainerStyle={styles.listContent}
      />

      <ModalProduct
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={handleConfirmPurchase}
        selectedProduct={selectedProduct}
      />
      <ModalListProducts
        isVisible={isModalListVisible}
        onClose={() => setModalListVisible(false)}
        onConfirm={() => alert("Lista Verificada")}
        order={order}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 10,
    backgroundColor: colors.whiteBack,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  infoContainer: {
    padding: 16,
    marginVertical: 10,
    marginHorizontal: 5,
    borderRadius: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  infoContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  infoSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  infoText: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.white,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.white,
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.accent,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.white,
    marginRight: 8,
  },
  searchbar: {
    padding: 15,
    marginVertical: 10,
    marginHorizontal: 5,
    height: 50,
    borderColor: "#cccccc",
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: colors.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  listContent: {
    paddingBottom: 20,
    paddingHorizontal: 5,
  },
  containerimg: {
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    resizeMode: "cover",
  },
  containerinfo: {
    flex: 1,
    justifyContent: "space-between",
  },
  item: {
    backgroundColor: colors.white,
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.lightBlack,
  },
  price: {
    fontSize: 16,
    color: "#04b104",
    fontWeight: "bold",
    marginVertical: 5,
  },
  description: {
    fontSize: 14,
    color: colors.gray,
    lineHeight: 20,
  },
  buy: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
    width: "100%",
  },
  buycolor: {
    color: colors.white,
    fontWeight: "bold",
    fontSize: 16,
  },
});
