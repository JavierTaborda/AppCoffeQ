
import { View, Text, StyleSheet } from 'react-native';

export default function ProductsScreen() {
    return (
        <View style={styles.container}>
            <Text>Productos</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});