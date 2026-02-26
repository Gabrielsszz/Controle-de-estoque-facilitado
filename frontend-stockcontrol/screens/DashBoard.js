import React, { useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useContext } from 'react';
import { AuthContext } from '../auth/AuthContext';

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [qty, setQty] = useState('');
  const [buyPrice, setBuyPrice] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const navigation = useNavigation();
  // Formatação DD/MM/YYYY
  const formatDate = (text) => {
    let cleaned = text.replace(/\D/g, '');

    if (cleaned.length > 8) cleaned = cleaned.slice(0, 8);

    if (cleaned.length > 4) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(
        4
      )}`;
    }

    if (cleaned.length > 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    }

    return cleaned;
  };

  const getExpiryStatus = (expiryDate) => {
    const [day, month, year] = expiryDate.split('/');
    const expiry = new Date(year, month - 1, day);
    const today = new Date();

    const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'expired';
    if (diffDays <= 30) return 'danger';
    if (diffDays <= 60) return 'warning';
    return 'ok';
  };

  // 🔢 Resumo
  const summary = {
    expired: products.filter((p) => getExpiryStatus(p.expiry) === 'expired')
      .length,
    ok: products.filter((p) => getExpiryStatus(p.expiry) === 'ok').length,
    warning: products.filter((p) => getExpiryStatus(p.expiry) === 'warning')
      .length,
    danger: products.filter((p) => getExpiryStatus(p.expiry) === 'danger')
      .length,
  };

  // 💰 Valores
  const totalStockValue = products.reduce(
    (total, p) => total + p.buyPrice * p.qty,
    0
  );

  const totalRiskValue = products.reduce((total, p) => {
    const status = getExpiryStatus(p.expiry);
    if (status === 'warning' || status === 'danger') {
      return total + p.buyPrice * p.qty;
    }
    return total;
  }, 0);

  const handleSaveProduct = () => {
    if (!name || !expiry || !qty || !buyPrice || !sellPrice) {
      alert('Preencha todos os campos');
      return;
    }

    const newProduct = {
      id: Date.now(),
      name,
      expiry,
      qty: Number(qty),
      buyPrice: Number(buyPrice),
      sellPrice: Number(sellPrice),
    };

    setProducts((prev) => [...prev, newProduct]);

    setName('');
    setExpiry('');
    setQty('');
    setBuyPrice('');
    setSellPrice('');
    setModalVisible(false);
  };
const { signOut, user } = useContext(AuthContext);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: 'Dashboard',
      headerRight: () => (
        <TouchableOpacity onPress={signOut} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation,signOut]);
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Farmácia Ina</Text>

      {/* Cards financeiros */}
      <View style={styles.cardsRow}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Valor em Estoque</Text>
          <Text style={styles.cardValue}>R$ {totalStockValue.toFixed(2)}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Valor em Risco</Text>
          <Text style={[styles.cardValue, { color: '#E74C3C' }]}>
            R$ {totalRiskValue.toFixed(2)}
          </Text>
        </View>
      </View>

      {/* Painel de status */}
      <View style={styles.statusPanel}>
        <View style={[styles.statusCard, styles.ok]}>
          <Text style={styles.statusNumber}>{summary.ok}</Text>
          <Text style={styles.statusLabel}>Longe do vencimento</Text>
        </View>

        <View style={[styles.statusCard, styles.warning]}>
          <Text style={styles.statusNumber}>{summary.warning}</Text>
          <Text style={styles.statusLabel}>Em alerta</Text>
        </View>

        <View style={[styles.statusCard, styles.danger]}>
          <Text style={styles.statusNumber}>{summary.danger}</Text>
          <Text style={styles.statusLabel}>Críticos</Text>
        </View>
        <View style={[styles.statusCard, styles.expired]}>
          <Text style={styles.statusNumber}>{summary.expired}</Text>
          <Text style={styles.statusLabel}>Vencidos</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>+ Adicionar Produto</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('Stock', { products })}>
        <Text style={styles.addButtonText}>Ver Estoque</Text>
      </TouchableOpacity>
      <Text style={styles.sectionTitle}>Produtos cadastrados</Text>

      {products.length === 0 ? (
        <Text style={styles.emptyText}>Nenhum produto cadastrado</Text>
      ) : (
        products.map((product) => {
          const status = getExpiryStatus(product.expiry);

          return (
            <View
              key={product.id}
              style={[
                styles.productItem,
                status === 'ok' && styles.borderOk,
                status === 'warning' && styles.borderWarning,
                status === 'danger' && styles.borderDanger,
                status === 'expired' && styles.borderExpired,
              ]}>
              <View>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productInfo}>
                  Vence em: {product.expiry}
                </Text>
                <Text style={styles.productInfo}>
                  Compra: R$ {product.buyPrice.toFixed(2)} | Venda: R${' '}
                  {product.sellPrice.toFixed(2)}
                </Text>
              </View>
              <Text style={styles.productQty}>{product.qty} un</Text>
            </View>
          );
        })
      )}

      {/* Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Cadastrar Produto</Text>

            <TextInput
              placeholder="Nome do produto"
              style={styles.input}
              value={name}
              onChangeText={setName}
            />

            <TextInput
              placeholder="Data de vencimento (DD/MM/AAAA)"
              style={styles.input}
              keyboardType="numeric"
              value={expiry}
              onChangeText={(text) => setExpiry(formatDate(text))}
              maxLength={10}
            />

            <TextInput
              placeholder="Quantidade"
              style={styles.input}
              keyboardType="numeric"
              value={qty}
              onChangeText={setQty}
            />

            <TextInput
              placeholder="Valor de compra (R$)"
              style={styles.input}
              keyboardType="numeric"
              value={buyPrice}
              onChangeText={setBuyPrice}
            />

            <TextInput
              placeholder="Valor de revenda (R$)"
              style={styles.input}
              keyboardType="numeric"
              value={sellPrice}
              onChangeText={setSellPrice}
            />

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveProduct}>
              <Text style={styles.saveButtonText}>Salvar</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity> 
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
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

  cardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  card: {
    backgroundColor: '#FFF',
    width: '48%',
    padding: 16,
    borderRadius: 10,
    elevation: 2,
  },

  cardTitle: {
    fontSize: 14,
    color: '#555',
  },

  cardValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
    color: '#2ECC71',
  },

  statusPanel: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 16,
  },

  statusCard: {
    width: '48%',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },

  statusNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
  },

  statusLabel: {
    fontSize: 12,
    color: '#FFF',
    textAlign: 'center',
    marginTop: 4,
  },

  ok: { backgroundColor: '#2ECC71' },
  warning: { backgroundColor: '#F1C40F' },
  danger: { backgroundColor: '#E74C3C' },
  expired: { backgroundColor: '#7F8C8D' },

  addButton: {
    backgroundColor: '#2ECC71',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },

  addButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },

  sectionTitle: {
    marginTop: 24,
    marginBottom: 8,
    fontSize: 18,
    fontWeight: 'bold',
  },

  emptyText: {
    textAlign: 'center',
    color: '#777',
    marginTop: 10,
  },

  productItem: {
    backgroundColor: '#FFF',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderLeftWidth: 6,
  },

  borderOk: { borderLeftColor: '#2ECC71' },
  borderWarning: { borderLeftColor: '#F1C40F' },
  borderDanger: { borderLeftColor: '#E74C3C' },
  borderExpired: { borderLeftColor: '#7F8C8D' },

  productName: { fontWeight: 'bold' },
  productInfo: { color: '#777', fontSize: 12 },
  productQty: { fontWeight: 'bold' },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },

  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },

  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },

  saveButton: {
    backgroundColor: '#2ECC71',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },

  saveButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },

  cancelText: {
    color: '#E74C3C',
    textAlign: 'center',
    marginTop: 12,
  }, logoutButton: {
    marginRight: 16,
  },
  logoutText: {
    color: '#D32F2F',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
