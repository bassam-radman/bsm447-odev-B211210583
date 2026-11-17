
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

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

export default function SavedScreen({ navigation }) {
  const [savedElements, setSavedElements] = useState([]);
  const [loading, setLoading] = useState(true);

  // Ekran her açıldığında kayıtları oku
  useFocusEffect(
    useCallback(() => {
      let active = true;

      async function loadSavedElements() {
        try {
          setLoading(true);

          const data = await AsyncStorage.getItem(
            'savedElements'
          );

          const saved = data ? JSON.parse(data) : [];

          if (active) {
            setSavedElements(saved);
          }
        } catch (error) {
          console.log('Kayıt okuma hatası:', error);
        } finally {
          if (active) {
            setLoading(false);
          }
        }
      }

      loadSavedElements();

      return () => {
        active = false;
      };
    }, [])
  );

  // Kayıtlı element kartı
  
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
          {item.category}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Kaydedilen Elementler
      </Text>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#173B65"
        />
      ) : (
        <>
          <Text style={styles.count}>
            {savedElements.length} kayıtlı element
          </Text>

          <FlatList
            data={savedElements}
            renderItem={renderElement}
            keyExtractor={(item) =>
              item.number.toString()
            }
            contentContainerStyle={styles.list}
            ListEmptyComponent={
              <Text style={styles.emptyText}>
                Henüz kaydedilen element yok.
              </Text>
            }
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

categoryName: {
  fontSize: 13,
  color: '#777777',
  marginTop: 4,
  fontStyle: 'italic',
},

  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#173B65',
    textAlign: 'center',
    marginBottom: 20,
  },
  count: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#173B65',
    marginBottom: 15,
  },
  list: {
    paddingBottom: 25,
    flexGrow: 1,
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
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#888888',
  },
});
