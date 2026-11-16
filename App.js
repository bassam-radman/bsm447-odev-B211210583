
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from 'react-native';

export default function App() {
  const [elements, setElements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(
      'https://raw.githubusercontent.com/Bowserinator/Periodic-Table-JSON/master/PeriodicTableJSON.json'
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error('API hatası');
        }
        return response.json();
      })
      .then((data) => {
        const filtered = data.elements.filter(
          (element) =>
            element.period === 4 || element.period === 5
        );

        setElements(filtered);
      })
      .catch((error) => {
        console.log('Hata:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const renderElement = ({ item }) => {
    return (
      <View style={styles.elementCard}>
        <View style={styles.symbolBox}>
          <Text style={styles.symbol}>{item.symbol}</Text>
        </View>

        <View style={styles.elementInfo}>
          <Text style={styles.elementName}>{item.name}</Text>
          <Text style={styles.elementNumber}>
            Atom Numarası: {item.number}
          </Text>
          <Text style={styles.elementPeriod}>
            {item.period}. Periyot
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Periyodik Tablo</Text>

      <Text style={styles.subtitle}>
        4. ve 5. Periyot Elementleri
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="#173B65" />
      ) : (
        <>
          <Text style={styles.count}>
            Toplam {elements.length} element
          </Text>

          <FlatList
            data={elements}
            renderItem={renderElement}
            keyExtractor={(item) => item.number.toString()}
            contentContainerStyle={styles.list}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    paddingTop: 55,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#173B65',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginTop: 8,
  },
  count: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#173B65',
  },
  list: {
    paddingBottom: 25,
  },
  elementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 15,
    marginBottom: 10,
    borderRadius: 12,
    elevation: 2,
  },
  symbolBox: {
    width: 65,
    height: 65,
    backgroundColor: '#DCEAF8',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  symbol: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#173B65',
  },
  elementInfo: {
    flex: 1,
  },
  elementName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222222',
  },
  elementNumber: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  elementPeriod: {
    fontSize: 13,
    color: '#173B65',
    marginTop: 4,
  },
});
