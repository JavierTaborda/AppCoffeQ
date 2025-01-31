
import { View, Text, StyleSheet } from 'react-native';
import { Payment } from '@/interfaces/Payment';

export default function PaymentsScreen() {
    return (
        <View style={styles.container}>
            <Text>Pagos</Text>
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
