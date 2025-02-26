import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Alert,
  ScrollView, 
} from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import { Product } from "@/interfaces/Product";
import { colors } from "@/constants/colors";
import Toast from "react-native-toast-message";

interface ProductFormProps {
  product?: Product;
  onSubmit: (product: Product) => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({
  product,
  onSubmit,
  onCancel,
}) => {
  const [name, setName] = useState(product?.name || "");
  const [description, setDescription] = useState(product?.description || "");
  const [price, setPrice] = useState(product?.price?.toString() || "");
  const [image, setImage] = useState(product?.image || "");
  const [stock, setStock] = useState(product?.stock?.toString() || "");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Se requiere permiso para acceder a la cámara y galería.');
        }
      }
    })();
  }, []);

  const handleImagePicker = async () => {
    setIsLoading(true);
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
    setIsLoading(false);
  };

  const handleTakePhoto = async () => {
    setIsLoading(true);
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
    setIsLoading(false);
  };

  const handleSubmit = () => {
    if (!name || !description || !price || !stock) {
      Toast.show({
           type: "error",
           text1: "Atención",
           text2: "La orden ha sido eliminada correctamente.",
         });
      return;
    }

    const newProduct: Product = {
      idProduct: product?.idProduct || 0,
      name,
      description,
      price: parseFloat(price),
      image,
      isActive: true,
      stock: parseInt(stock, 10),
    };
    onSubmit(newProduct);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.formContainer}>
        <Text style={styles.label}>Nombre</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Nombre del producto"
        />

        <Text style={styles.label}>Descripción</Text>
        <TextInput
          style={styles.input}
          value={description}
          onChangeText={setDescription}
          placeholder="Descripción del producto"
          multiline
        />

        <Text style={styles.label}>Precio $</Text>
        <TextInput
          style={styles.input}
          value={price}
          onChangeText={setPrice}
          placeholder="Precio del producto"
          keyboardType="numeric"
        />
        <Text style={styles.label}>Stock</Text>
        <TextInput
          style={styles.input}
          value={stock}
          onChangeText={setStock}
          placeholder="Stock del producto"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Imagen</Text>
        <View style={styles.imagePickerContainer}>
          <TouchableOpacity
            onPress={handleImagePicker}
            style={styles.imagePicker}
          >
            <MaterialIcons
              name="photo-library"
              size={24}
              color={colors.primary}
            />
            <Text style={styles.imagePickerText}>Seleccionar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleTakePhoto}
            style={styles.imagePicker}
          >
            <MaterialIcons name="camera-alt" size={24} color={colors.primary} />
            <Text style={styles.imagePickerText}>Tomar foto</Text>
          </TouchableOpacity>
        </View>
        {isLoading ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : image ? (
          <Image source={{ uri: image }} style={styles.imagePreview} />
        ) : null}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={onCancel}
            style={[styles.button, styles.cancelButton]}
          >
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSubmit}
            style={[styles.button, styles.submitButton]}
          >
            <Text style={styles.buttonText}>Guardar</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Toast />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1, 
    paddingVertical: 10, 
  },
  formContainer: {
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  imagePickerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  imagePicker: {
    flex: 1,
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.whiteBack,
    marginHorizontal: 5,
    flexDirection: "row",
  },
  imagePickerText: {
    marginLeft: 10,
    color: colors.darkGray,
    fontWeight: "600",
  },
  imagePreview: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#ccc",
  },
  submitButton: {
    backgroundColor: colors.primary,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ProductForm;