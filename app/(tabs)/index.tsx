import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, TextInput, Button } from 'react-native';
import { getProducts } from '../../services/ProductsService';
import { colors } from '../../constants/colors';
import { Picker } from '@react-native-picker/picker';
import { Product } from '@/interfaces/Product';

export default function ProductList() {
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [search, setSearch] = useState<string>('');
    const [selectedClient, setSelectedClient] = useState<string>('');
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);

    useEffect(() => {
        async function fetchData() {
            const products = await getProducts();
            setProducts(products);
            setFilteredProducts(products);
        }
        fetchData();
    }, []);

    const handleSearch = (text: string) => {
        const filtered = products.filter(product =>
            product.name.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredProducts(filtered);
        setSearch(text);
    };

    const handleBuy = (product: Product) => {
        alert(`Compraste: ${product.name}`);
    };

    const renderItem = ({ item }: { item: Product }) => (
        <View style={styles.item}>
            <View style={styles.containerimg}>
                <Image source={{ uri: item.image }} style={styles.image} />
            </View>
            <View style={styles.containerinfo}>
                <View>
                    <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
                    <Text style={styles.price}>${item.price.toFixed(2)}</Text>
                    <Text style={styles.description} numberOfLines={1} ellipsizeMode="tail">{item.description}</Text>
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
        <View style={styles.container}>
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={selectedClient}
                    onValueChange={(itemValue) => setSelectedClient(itemValue)}
                    style={styles.picker}
                >
                    <Picker.Item label="Todos" value="" />
                    <Picker.Item label="Cliente 1" value="1" />
                    <Picker.Item label="Cliente 2" value="2" />
                    <Picker.Item label="Cliente 3" value="3" />
                </Picker>
            </View>
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
    pickerContainer: {
        padding: 15,
        marginVertical: 10,
        marginHorizontal: 5,
        height: 50,
        borderColor: '#cccccc',
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: colors.white,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        justifyContent: 'center',
    },
    picker: {
        height: '100%',
        color: colors.lightBlack,
    },
    searchbar: {
        padding: 15,
        marginVertical: 10,
        marginHorizontal: 5,
        height: 50,
        borderColor: '#cccccc',
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: colors.white,
        shadowColor: '#000',
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
        color: colors.lightBlack,
    },
    price: {
        fontSize: 16,
        color: '#04b104',
        fontWeight: 'bold',
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
