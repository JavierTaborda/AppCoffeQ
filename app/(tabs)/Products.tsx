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

export default function ProductsScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState<string>("");
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
      setFilteredProducts(products);
    } catch (error) {
      Alert.alert("Error", "Failed to load products. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (text: string) => {
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredProducts(filtered);
    setSearch(text);
  };

  const handleAddProduct = async (product: Product) => {
    try {
      await addProduct(product);
      fetchProducts();
      setIsAdding(false);
    } catch (error) {
      Alert.alert("Error", "Failed to add product. Please try again.");
    }
  };

  const handleEditProduct = async (product: Product) => {
    try {
      await updateProduct(product);
      fetchProducts();
      setEditingProduct(null);
    } catch (error) {
      Alert.alert("Error", "Failed to update product. Please try again.");
    }
  };

  const handleDeleteProduct = async (id: number) => {
    try {
      await deleteProduct(id);
      fetchProducts();
    } catch (error) {
      Alert.alert("Error", "Failed to delete product. Please try again.");
    }
  };

  const renderProductItem = ({ item }: { item: Product }) => (
    <View style={styles.productItem}>
      {item.image && (
        <Image source={{ uri: item.image }} style={styles.productImage} />
      )}
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productDescription}>{item.description}</Text>
      <Text style={styles.productDescription}>Stock:{item.stock}</Text>
      <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
      <View style={styles.productActions}>
        <TouchableOpacity onPress={() => setEditingProduct(item)}>
          <Text style={styles.actionText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeleteProduct(item.idProduct)}>
          <Text style={[styles.actionText, styles.deleteText]}>Desactivar</Text>
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
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar producto"
            value={search}
            onChangeText={handleSearch}
          />
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
  searchInput: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: "#fff",
    fontSize: 16,
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
  deleteText: {
    color: colors.danger,
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
