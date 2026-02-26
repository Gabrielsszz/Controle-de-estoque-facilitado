import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
} from 'react-native';

export default function Stock({ route }) {
  const { products } = route.params;
  const [search, setSearch] = useState('');

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Estoque</Text>

      <TextInput
        placeholder="Buscar produto..."
        style={styles.searchInput}
        value={search}
        onChangeText={setSearch}
      />

      {filteredProducts.length === 0 ? (
        <Text style={styles.emptyText}>Nenhum produto encontrado</Text>
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.productItem}>
              <View>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productInfo}>
                  Vencimento: {item.expiry}
                </Text>
                <Text style={styles.productInfo}>
                  Quantidade: {item.qty} un
                </Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
    padding: 16,
  },

  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },

  searchInput: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#DDD',
  },

  emptyText: {
    textAlign: 'center',
    color: '#777',
    marginTop: 20,
  },

  productItem: {
    backgroundColor: '#FFF',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
  },

  productName: {
    fontWeight: 'bold',
    fontSize: 15,
  },

  productInfo: {
    fontSize: 12,
    color: '#777',
    marginTop: 2,
  },
});
