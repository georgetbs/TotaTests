import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { styled } from 'nativewind';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

export default function Index() {
  const { t } = useTranslation();
  const [isLanguageSelectorOpen, setIsLanguageSelectorOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkLanguage = async () => {
      const savedLanguage = await AsyncStorage.getItem('language');
      if (!savedLanguage) {
        setIsLanguageSelectorOpen(true);
      }
    };
    checkLanguage();
  }, []);

  return (
    <StyledView className="flex-1 bg-white">
      <Header />
      <StyledView className="flex-1 px-4 py-20 items-center">
        <StyledText className="text-3xl mb-8">{t('welcome')}</StyledText>
        <StyledView className="space-y-4">
          <StyledTouchableOpacity onPress={() => router.push('/TestScreen?mode=exam')} className="p-4 border-2 border-red-500">
            <StyledText className="text-xl text-center">{t('start_exam')}</StyledText>
          </StyledTouchableOpacity>
          <StyledTouchableOpacity onPress={() => router.push('/TestScreen?mode=study')} className="p-4 border-2 border-red-500">
            <StyledText className="text-xl text-center">{t('study_mode')}</StyledText>
          </StyledTouchableOpacity>
        </StyledView>
      </StyledView>
      <Footer />
    </StyledView>
  );
}
