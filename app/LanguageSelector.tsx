import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';

export default function LanguageSelector() {
  const { t } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    i18n.services.languageDetector.cacheUserLanguage(lng);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => changeLanguage('en')} style={styles.button}>
        <Text style={styles.buttonText}>🇬🇧 English</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => changeLanguage('ru')} style={styles.button}>
        <Text style={styles.buttonText}>🇷🇺 Русский</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => changeLanguage('ka')} style={styles.button}>
        <Text style={styles.buttonText}>🇬🇪 ქართული</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    right: 0,
    marginTop: 20,
    marginRight: 20,
  },
  button: {
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 18,
  },
});
