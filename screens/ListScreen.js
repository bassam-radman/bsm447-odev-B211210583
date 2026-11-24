
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TextInput,
  TouchableOpacity,
} from 'react-native';

// Element kategorilerinin renkleri
const categoryColors = {
  'alkali metal': '#B45309',
  'alkaline earth metal': '#0E7490',
  'transition metal': '#6D28D9',
  'post-transition metal': '#0F766E',
  'metalloid': '#C2410C',
  'diatomic nonmetal': '#047857',
  'polyatomic nonmetal': '#1D4ED8',
  'noble gas': '#BE185D',
};

const categoryLabels = {
  'alkali metal': 'Alkali Metal',
  'alkaline earth metal': 'Toprak Alkali Metal',
  'transition metal': 'Geçiş Metali',
  'post-transition metal': 'Geçiş Sonrası Metal',
  'metalloid': 'Yarı Metal',
  'diatomic nonmetal': 'İki Atomlu Ametal',
  'polyatomic nonmetal': 'Çok Atomlu Ametal',
  'noble gas': 'Soygaz',
};

export default function ListScreen({ navigation }) {
  const [elements, setElements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

const [error, setError] = useState(false);
const [retryCount, setRetryCount] = useState(0);


  // API'den elementleri çekme
 
useEffect(() => {
  setLoading(true);
  setError(false);

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
        // Sadece 4. ve 5. periyot
        const filtered = data.elements.filter(
          (element) =>
            element.period === 4 || element.period === 5
        );

        setElements(filtered);
      })
      
.catch((error) => {
  console.log('Hata:', error);
  setError(true);
})

      .finally(() => {
        setLoading(false);
      });
 }, [retryCount]);
  // Element arama
  const filteredElements = elements.filter((element) => {
    const text = search.toLowerCase().trim();

    return (
      element.name.toLowerCase().includes(text) ||
      element.symbol.toLowerCase().includes(text) ||
      element.number.toString().includes(text)
    );
  });

  // Element kartlarını oluşturma
  const renderElement = ({ item }) => {
    const categoryColor =
      categoryColors[item.category] || '#334155';

    return (
      <TouchableOpacity
        style={styles.elementCard}
        onPress={() =>
          navigation.getParent()?.navigate('Detay', {
            element: item,
          })
        }
      >
        <View
          style={[
            styles.symbolBox,
            { backgroundColor: categoryColor },
          ]}
        >
          <Text style={styles.symbol}>
            {item.symbol}
          </Text>
        </View>

        <View style={styles.elementInfo}>
          <Text style={styles.elementName}>
            {item.name}
          </Text>

          <Text style={styles.elementNumber}>
            Atom Numarası: {item.number}
          </Text>

          <Text style={styles.elementPeriod}>
            {item.period}. Periyot
          </Text>

          
<Text style={styles.categoryName}>
  {categoryLabels[item.category] || item.category}
</Text>

        </View>
      </TouchableOpacity>
    );
  };

  // Ana ekran
  return (
    <View style={styles.container}>
     
<Text style={styles.title}>
  Element Atlası
</Text>


      <Text style={styles.subtitle}>
        4. ve 5. Periyot Elementleri
      </Text>

<View
  style={{
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginTop: 15,
  }}
>
  <Text
    style={{
      fontSize: 15,
      fontWeight: 'bold',
      color: '#173B65',
      marginBottom: 10,
    }}
  >
    Element Kategorileri
  </Text>

  <View
    style={{
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    }}
  >
    {Object.entries(categoryColors).map(([category, color]) => (
      <View
        key={category}
        style={{
          width: '49%',
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 9,
        }}
      >
        <View
          style={{
            width: 12,
            height: 12,
            borderRadius: 3,
            backgroundColor: color,
            marginRight: 7,
          }}
        />

        <Text
          style={{
            fontSize: 11,
            color: '#334155',
            flex: 1,
          }}
        >
          {categoryLabels[category]}
        </Text>
      </View>
    ))}
  </View>
</View>


      <TextInput
        style={styles.searchInput}
        placeholder="Element ara..."
        value={search}
        onChangeText={setSearch}
        autoCapitalize="none"
      />

      
{loading ? (
  <ActivityIndicator
    size="large"
    color="#173B65"
  />
) : error ? (
  <View style={{ alignItems: 'center', marginTop: 30 }}>
    <Text style={styles.emptyText}>
      İnternet bağlantısı kurulamadı.
    </Text>

    <TouchableOpacity
      style={{
        backgroundColor: '#173B65',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 10,
        marginTop: 18,
      }}
      onPress={() => setRetryCount((count) => count + 1)}
    >
      <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>
        Yeniden Dene
      </Text>
    </TouchableOpacity>
  </View>
) : (

        <>
          <Text style={styles.count}>
            {filteredElements.length} element bulundu
          </Text>

          <FlatList
            data={filteredElements}
            renderItem={renderElement}
            keyExtractor={(item) =>
              item.number.toString()
            }
            contentContainerStyle={styles.list}
            ListEmptyComponent={
              <Text style={styles.emptyText}>
                Sonuç bulunamadı.
              </Text>
            }
          />
        </>
      )}
    </View>
  );
}

// Tasarım
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

  searchInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D9E0',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    marginTop: 20,
  },

  count: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
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
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },

  symbol: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#FFFFFF',
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

  categoryName: {
    fontSize: 13,
    color: '#777777',
    marginTop: 4,
    fontStyle: 'italic',
  },

  emptyText: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 16,
    color: '#888888',
  },
});
