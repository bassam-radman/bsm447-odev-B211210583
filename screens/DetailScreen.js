

import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
  Alert,
} from 'react-native';

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

export default function DetailScreen({ route }) {
  const element = route?.params?.element;

const [isSaved, setIsSaved] = useState(false);

useEffect(() => {
  async function checkSaved() {
    if (!element) return;

    try {
      const data = await AsyncStorage.getItem('savedElements');
      const saved = data ? JSON.parse(data) : [];

      const exists = saved.some(
        (item) => item.number === element.number
      );

      setIsSaved(exists);
    } catch (error) {
      console.log('Kayıt okuma hatası:', error);
    }
  }

  checkSaved();
}, [element?.number]);


  if (!element) {
    return (
      <View style={styles.container}>
        <Text>Element bulunamadı.</Text>
      </View>
    );
  }

  const categoryColor =
    categoryColors[element.category] || '#334155';

  const atomicMass =
    element.atomic_mass != null
      ? (Math.round(element.atomic_mass * 100) / 100).toFixed(2)
      : 'Bilinmiyor';

const handleShare = async () => {
  try {
    const message =
      `${element.name} (${element.symbol})\n` +
      `Atom Numarası: ${element.number}\n` +
      `Atom Kütlesi: ${atomicMass} u\n\n` +
      `${(element.summary || 'Açıklama yok.').slice(0, 180)}`;

    await Share.share({
      message: message,
    });
  } catch (error) {
    Alert.alert('Hata', 'Paylaşım açılamadı.');
  }
};

const toggleSave = async () => {
  try {
    const data = await AsyncStorage.getItem('savedElements');
    const saved = data ? JSON.parse(data) : [];

    const exists = saved.some(
      (item) => item.number === element.number
    );

    let updated;

    if (exists) {
      updated = saved.filter(
        (item) => item.number !== element.number
      );
    } else {
      updated = [...saved, element];
    }

    await AsyncStorage.setItem(
      'savedElements',
      JSON.stringify(updated)
    );

    setIsSaved(!exists);

    Alert.alert(
      'Başarılı',
      exists
        ? 'Element kaydedilenlerden çıkarıldı.'
        : 'Element kaydedildi.'
    );
  } catch (error) {
    Alert.alert('Hata', 'Kayıt işlemi başarısız.');
  }
};

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <View style={styles.symbolBox}>
        <Text style={styles.symbol}>
          {element.symbol}
        </Text>
      </View>

      <Text style={styles.name}>
        {element.name}
      </Text>

      <Text style={styles.number}>
        Atom Numarası: {element.number}
      </Text>

      <View
        style={[
          styles.categoryBox,
          { backgroundColor: categoryColor },
        ]}
      >
        <Text style={styles.categoryText}>
          {element.category}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          Temel Bilgiler
        </Text>

        <Text style={styles.label}>Atom Kütlesi</Text>
        <Text style={styles.value}>{atomicMass} u</Text>

        <Text style={styles.label}>Periyot</Text>
        <Text style={styles.value}>{element.period}</Text>

        <Text style={styles.label}>Fiziksel Hali</Text>
        <Text style={styles.value}>
          {element.phase || 'Bilinmiyor'}
        </Text>

        <Text style={styles.label}>Elektron Dizilimi</Text>
        <Text style={styles.value}>
          {element.electron_configuration_semantic ||
            'Bilinmiyor'}
        </Text>

        
<Text style={styles.label}>Keşif Bilgisi</Text>
        <Text style={styles.value}>
          {element.discovered_by || 'Bilinmiyor'}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          Element Hakkinda
        </Text>

        <Text style={styles.description}>
          {element.summary || 'Aciklama bulunamadi.'}
        </Text>
      </View>

<TouchableOpacity
  style={[
    styles.saveButton,
    isSaved && styles.removeButton,
  ]}
  onPress={toggleSave}
>
  <Text style={styles.saveButtonText}>
    {isSaved ? 'Kaydedilenlerden Çıkar' : 'Kaydet'}
  </Text>
</TouchableOpacity>

<TouchableOpacity
  style={styles.shareButton}
  onPress={handleShare}
>
  <Text style={styles.shareButtonText}>
    Paylaş
  </Text>
</TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  content: {
    padding: 20,
    alignItems: 'center',
    paddingBottom: 40,
  },
  symbolBox: {
    width: 110,
    height: 110,
    backgroundColor: '#DCEAF8',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  symbol: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#173B65',
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#222222',
    marginTop: 15,
  },
  number: {
    fontSize: 16,
    color: '#666666',
    marginTop: 5,
  },
  categoryBox: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 15,
  },
  categoryText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    padding: 20,
    borderRadius: 15,
    marginTop: 20,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#173B65',
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#777777',
    marginTop: 12,
  },
  value: {
    fontSize: 17,
    fontWeight: '500',
    color: '#222222',
    marginTop: 4,
  },
  description: {
    fontSize: 15,
    color: '#444444',
    lineHeight: 24,
  },

shareButton: {
  backgroundColor: '#173B65',
  width: '100%',
  padding: 16,
  borderRadius: 12,
  alignItems: 'center',
  marginTop: 25,
},

shareButtonText: {
  color: '#FFFFFF',
  fontSize: 18,
  fontWeight: 'bold',
},

saveButton: {
  backgroundColor: '#16803C',
  width: '100%',
  padding: 16,
  borderRadius: 12,
  alignItems: 'center',
  marginTop: 25,
},

removeButton: {
  backgroundColor: '#C0392B',
},

saveButtonText: {
  color: '#FFFFFF',
  fontSize: 18,
  fontWeight: 'bold',
},


});
