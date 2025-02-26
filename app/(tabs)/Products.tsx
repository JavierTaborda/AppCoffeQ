import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  TextInput,
  Image,
  Switch,
} from "react-native";
import { Product } from "@/interfaces/Product";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "@/services/ProductsService";
import ProductForm from "@/app/components/products/ProductForm";
import { colors } from "@/constants/colors";
import Toast from "react-native-toast-message";

export default function ProductsScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState<string>("");
  const [showInactive, setShowInactive] = useState<boolean>(false); // Estado para mostrar inactivos
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const products = await getProducts();
      setProducts(products);
      applyFilters(products, search, showInactive);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Atención",
        text2: "Ocurrio un error al obtener los productos.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = (
    products: Product[],
    searchText: string,
    showInactive: boolean
  ) => {
    let filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchText.toLowerCase())
    );

    if (showInactive) {
      filtered = filtered.filter((product) => !product.isActive);
    } else {
      filtered = filtered.filter((product) => product.isActive);
    }

    setFilteredProducts(filtered);
  };

  const handleSearch = (text: string) => {
    setSearch(text);
    applyFilters(products, text, showInactive);
  };

  const toggleShowInactive = () => {
    setShowInactive(!showInactive);
    applyFilters(products, search, !showInactive);
  };

  const handleAddProduct = async (product: Product) => {
    try {
      await addProduct(product);
      fetchProducts();
      setIsAdding(false);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Atención",
        text2: "Ocurrio un error al agregar el producto.",
      });
    }
  };

  const handleEditProduct = async (product: Product) => {
    try {
      await updateProduct(product);
      fetchProducts();
      setEditingProduct(null);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Atención",
        text2: "Ocurrio un error al editar el producto.",
      });
    }
  };

  const handleToggleActive = async (product: Product) => {
    try {
      const updatedProduct = { ...product, isActive: !product.isActive };
      await updateProduct(updatedProduct);
      fetchProducts();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Atención",
        text2: "Ocurrio un error al editar el producto.",
      });
    }
  };

  const handleDeleteProduct = async (id: number) => {
    try {
      await deleteProduct(id);
      fetchProducts();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Atención",
        text2: "Ocurrio un error al eliminar el producto.",
      });
    }
  };

  const renderProductItem = ({ item }: { item: Product }) => (
    <View style={styles.productItem}>
      {item.image && (
        <Image source={{ uri: item.image }} style={styles.productImage} />
      )}
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productDescription}>{item.description}</Text>
      <Text style={styles.productDescription}>Stock: {item.stock}</Text>
      <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
      <View style={styles.productActions}>
        <TouchableOpacity
          onPress={() => setEditingProduct(item)}
          style={styles.actionButton}
        >
          <Text style={styles.actionText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleToggleActive(item)}
          style={styles.actionButton}
        >
          <Text
            style={[
              styles.actionText,
              !item.isActive ? styles.activateText : styles.deleteText,
            ]}
          >
            {item.isActive ? "Desactivar" : "Activar"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {isAdding || editingProduct ? (
        <ProductForm
          product={editingProduct || undefined}
          onSubmit={editingProduct ? handleEditProduct : handleAddProduct}
          onCancel={() => {
            setIsAdding(false);
            setEditingProduct(null);
          }}
        />
      ) : (
        <>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar producto"
              value={search}
              onChangeText={handleSearch}
            />
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>Inactivos</Text>
              <Switch
                value={showInactive}
                onValueChange={toggleShowInactive}
                trackColor={{ false: "#ccc", true: colors.primary }}
                thumbColor={showInactive ? colors.primary : colors.inactive}
              />
            </View>
          </View>
          <FlatList
            data={filteredProducts}
            renderItem={renderProductItem}
            keyExtractor={(item) => item.idProduct.toString()}
            contentContainerStyle={styles.productList}
          />
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setIsAdding(true)}
          >
            <Text style={styles.addButtonText}>Agregar Producto</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.whiteBack,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    fontSize: 16,
    marginRight: 10,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  switchLabel: {
    marginRight: 8,
    color: colors.gray,
    fontSize: 14,
  },
  productList: {
    paddingBottom: 16,
  },
  productItem: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: "center",
  },
  productImage: {
    width: 150,
    height: 150,
    borderRadius: 8,
    marginBottom: 12,
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#272727",
  },
  productDescription: {
    fontSize: 14,
    color: colors.gray,
    marginTop: 4,
  },
  productPrice: {
    fontSize: 16,
    color: "#04b104",
    fontWeight: "bold",
    marginTop: 8,
  },
  productActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  actionText: {
    color: colors.secondary,
    fontSize: 16,
    fontWeight: "bold",
  },
  actionButton: {
    marginHorizontal: 30,
    paddingHorizontal: 10,
  },
  deleteText: {
    color: colors.danger,
  },
  activateText: {
    color: colors.primary,
  },
  addButton: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
