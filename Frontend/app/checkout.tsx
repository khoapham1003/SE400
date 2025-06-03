import React from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  TouchableOpacity,
  Text,
  ScrollView,
  Image,
} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';

const paymentMethods = [
  {
    id: 'paypal',
    label: 'PayPal',
    img: 'https://assets.withfra.me/credit_cards/paypal.png',
  },
  {
    id: 'amex-89001',
    label: 'Amex ••••89001',
    img: 'https://assets.withfra.me/credit_cards/amex.png',
  },
  {
    id: 'visa-3021',
    label: 'Visa ••••3021',
    img: 'https://assets.withfra.me/credit_cards/visa.png',
  },
];

const cartProducts = [
  {
    id: '1',
    name: 'Product 1',
    price: 9.99,
    quantity: 1,
    image: 'https://via.placeholder.com/60',
  },
  {
    id: '2',
    name: 'Product 2',
    price: 10.00,
    quantity: 2,
    image: 'https://via.placeholder.com/60',
  },
];

const ProductList = ({ products }) => {
  return (
    <View style={{ backgroundColor: '#fff', marginBottom: 12, padding: 16, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#e7e7e7' }}>
      <Text style={{ fontSize: 19, fontWeight: '700', marginBottom: 12 }}>Products</Text>
      {products.map(({ id, name, price, quantity, image }) => (
        <View key={id} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
          <Image source={{ uri: image }} style={{ width: 60, height: 60, borderRadius: 8, marginRight: 12 }} />
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: '600' }}>{name}</Text>
            <Text style={{ fontSize: 14, color: '#777' }}>Qty: {quantity}</Text>
          </View>
          <Text style={{ fontSize: 16, fontWeight: '600' }}>${(price * quantity).toFixed(2)}</Text>
        </View>
      ))}
    </View>
  );
};

const Checkout = () => {
  const [form, setForm] = React.useState({
    paymentMethod: paymentMethods[0].id,
  });

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>


        <ScrollView
          contentContainerStyle={styles.content}
          style={{ backgroundColor: '#f7f7f7' }}>
          <ProductList products={cartProducts} />
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Summary</Text>


            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>

              <Text style={styles.summaryPrice}>$19.95</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery Fee</Text>

              <TouchableOpacity
                onPress={() => {
                  // handle onPress
                }}>
                <FeatherIcon
                  color="#454545"
                  name="help-circle"
                  size={17} />
              </TouchableOpacity>

              <Text style={styles.summaryPrice}>$3.95</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tip</Text>

              <TouchableOpacity
                onPress={() => {
                  // handle onPress
                }}>
                <FeatherIcon
                  color="#454545"
                  name="help-circle"
                  size={17} />
              </TouchableOpacity>

              <Text style={styles.summaryPrice}>$2.00</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Discount</Text>

              <TouchableOpacity
                onPress={() => {
                  // handle onPress
                }}>
                <FeatherIcon
                  color="#454545"
                  name="help-circle"
                  size={17} />
              </TouchableOpacity>

              <Text style={styles.summaryPrice}>$3.75</Text>
            </View>

            <View style={styles.summaryTotal}>
              <Text style={styles.summaryLabel}>Total</Text>

              <Text style={styles.summaryPriceOld}>$25.90</Text>

              <Text style={styles.summaryPricePrimary}>$22.15</Text>
            </View>

            <TouchableOpacity
              onPress={() => {
                // handle onPress
              }}
              style={styles.sectionButton}>
              <FeatherIcon color="#1A1A1A" name="plus" size={14} />

              <Text style={styles.sectionButtonText}>Add more items</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment methods</Text>

            <View style={styles.sectionBody}>
              {paymentMethods.map(({ id, label, img }, index, arr) => {
                const isFirst = index === 0;
                const isLast = index === arr.length - 1;
                const isActive = form.paymentMethod === id;

                return (
                  <View
                    key={index}
                    style={[
                      styles.radioWrapper,
                      isActive && styles.radioActive,
                      isFirst && styles.radioFirst,
                      isLast && styles.radioLast,
                    ]}>
                    <TouchableOpacity
                      onPress={() =>
                        setForm({ ...form, ['paymentMethod']: id })
                      }
                      style={styles.radio}>
                      <View
                        style={[
                          styles.radioInput,
                          isActive && styles.radioInputActive,
                        ]} />

                      <Image
                        alt=""
                        resizeMode="contain"
                        source={{ uri: img }}
                        style={styles.radioImg} />

                      <Text style={styles.radioLabel}>{label}</Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>

            <TouchableOpacity
              onPress={() => {
                // handle onPress
              }}
              style={styles.sectionButton}>
              <FeatherIcon color="#1A1A1A" name="plus" size={14} />

              <Text style={styles.sectionButtonText}>Add payment method</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>

      <View style={styles.overlay}>
        <TouchableOpacity
          onPress={() => {
            // handle onPress
          }}
          style={{ flex: 1, paddingHorizontal: 24 }}>
          <View style={styles.btn}>
            <Text style={styles.btnText}>Place Order</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: 16,
    paddingBottom: 80,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    paddingHorizontal: 16,
    paddingBottom: 48,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  /** Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderColor: '#efefef',
  },
  headerAction: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9999,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1d1d1d',
  },
  /** Section */
  section: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e7e7e7',
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#1d1d1d',
  },
  sectionAction: {
    alignSelf: 'center',
    backgroundColor: '#f7f7f7',
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9999,
  },
  sectionButton: {
    marginTop: 12,
    alignSelf: 'flex-end',
    backgroundColor: '#f7f7f7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9999,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  sectionButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
    marginLeft: 4,
  },
  sectionBody: {
    marginTop: 16,
  },
  summaryRow: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryLabel: {
    marginRight: 4,
    fontSize: 16,
    fontWeight: '500',
    color: '#454545',
  },
  summaryPrice: {
    marginLeft: 'auto',
    fontSize: 16,
    fontWeight: '500',
    color: '#454545',
  },
  summaryTotal: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderColor: '#E7E7E7',
    paddingTop: 8,
  },
  summaryPriceOld: {
    marginLeft: 'auto',
    fontSize: 15,
    fontWeight: '500',
    color: '#5D5D5D',
    textDecorationLine: 'line-through',
  },
  summaryPricePrimary: {
    marginLeft: 6,
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  /** Radio */
  radio: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  radioWrapper: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7e5',
    marginTop: -2,
  },
  radioActive: {
    backgroundColor: '#f1f4ff',
  },
  radioFirst: {
    marginTop: 0,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  radioLast: {
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  radioInput: {
    width: 16,
    height: 16,
    borderRadius: 9999,
    borderWidth: 2,
    borderColor: '#1d1d1d',
    marginRight: 12,
  },
  radioInputActive: {
    borderWidth: 5,
    borderColor: '#1d1d1d',
  },
  radioImg: {
    width: 40,
    height: 30,
    borderWidth: 1,
    borderColor: '#CBCBCB',
    borderRadius: 4,
    marginRight: 12,
  },
  radioLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1d1d1d',
  },
  /** Button */
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    backgroundColor: '#F82E08',
    borderColor: '#F82E08',
  },
  btnText: {
    fontSize: 16,
    lineHeight: 26,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 0.45,
  },
});
export default Checkout;