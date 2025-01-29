import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, TextInput, Button } from 'react-native';
import { getProducts } from '../../services/ProductsService';
import { colors } from '../../constants/colors';
import { BarCodeScanner } from 'expo-camera';
import { Picker } from '@react-native-picker/picker';

export default function ProductList() {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedClient, setSelectedClient] = useState('');
    const [scanned, setScanned] = useState(false);
    const [hasPermission, setHasPermission] = useState(null);

    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    useEffect(() => {
        const products = getProducts();
        setProducts(products);
        setFilteredProducts(products);
    }, []);

    const handleSearch = (text) => {
        const filtered = products.filter(product =>
            product.name.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredProducts(filtered);
        setSearch(text);
    };

    const handleBarCodeScanned = ({ type, data }) => {
        setScanned(true);
        const scannedProduct = products.find(product => product.id.toString() === data);
        if (scannedProduct) {
            setFilteredProducts([scannedProduct]);
        } else {
            alert('Producto no encontrado');
        }
    };

    const handleBuy = (product) => {
        alert(`Compraste: ${product.name}`);
    };

    const renderItem = ({ item }) => (
        <View style={styles.item}>
            <View style={styles.containerimg}>
                <Image source={{ uri: item.image }} style={styles.image} />
            </View>
            <View style={styles.containerinfo}>
                <View>
                    <Text style={styles.title} numberOfLines={1} ellipsizeMode='tail'>{item.name}</Text>
                    <Text style={styles.price}>${item.price.toFixed(2)}</Text>
                    <Text style={styles.description} numberOfLines={1} ellipsizeMode='tail'>{item.description}</Text>
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
    );

    return (
        <>
            {/* <View style={styles.containercliente}>
                <Text>Seleccionar Cliente</Text>
                <Picker
                    selectedValue={selectedClient}
                    style={styles.picker}
                    onValueChange={(itemValue) => setSelectedClient(itemValue)}
                >
                    <Picker.Item label="Cliente 1" value="cliente1" />
                    <Picker.Item label="Cliente 2" value="cliente2" />
                </Picker>
                <Button title="Escanear QR" onPress={() => setScanned(false)} />
                {hasPermission === false && <Text>No hay acceso a la cámara</Text>}
                {!scanned && (
                    <BarCodeScanner
                        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                        style={StyleSheet.absoluteFillObject}
                    />
                )}
            </View> */}
            <View style={styles.container}>
                <TextInput
                    style={styles.searchbar}
                    placeholder="Buscar Producto"
                    value={search}
                    onChangeText={handleSearch}
                />
                <FlatList
                    data={filteredProducts}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.listContent}
                />
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
        paddingHorizontal: 10,
        backgroundColor: colors.background,
    },
    containercliente: {
        padding: 10,
        backgroundColor: colors.white,
        borderRadius: 10,
        marginBottom: 10,
    },
    searchbar: {
        padding: 10,
        marginVertical: 10,
        borderColor: '#cccccc',
        borderWidth: 1,
        borderRadius: 5,
    },
    picker: {
        height: 50,
        width: '100%',
    },
    listContent: {
        paddingBottom: 20,
        paddingHorizontal: 5,
    },
    containerimg: {
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 10,
    },
    containerinfo: {
        flex: 1,
        justifyContent: 'space-between',
    },
    item: {
        backgroundColor: colors.white,
        padding: 15,
        marginVertical: 5,
        borderRadius: 10,
        flexDirection: 'row',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.textPrimary,
    },
    price: {
        fontSize: 16,
        color: '#04b104',
        fontWeight: 'bold',
        marginVertical: 5,
    },
    description: {
        fontSize: 14,
        color: colors.textSecondary,
        lineHeight: 20,
    },
    buy: {
        backgroundColor: colors.primary,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 10,
        alignItems: 'center',
        width: '100%',
    },
    buycolor: {
        color: colors.white,
        fontWeight: 'bold',
        fontSize: 16,
    },
});
