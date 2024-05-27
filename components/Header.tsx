import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { styled } from 'nativewind';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

export default function Header() {
  const { t, i18n } = useTranslation();
  const router = useRouter();

  const changeLanguage = async (lng: string) => {
    await i18n.changeLanguage(lng);
    await AsyncStorage.setItem('language', lng);
  };

  return (
    <StyledView className="p-5 bg-white border-b-2 border-red-500 justify-center items-center">
      <StyledView className="flex-row  space-x-4">
        <StyledTouchableOpacity onPress={() => changeLanguage('en')} className="flex items-center">
          <StyledText className="text-xl">🇬🇧 English</StyledText>
        </StyledTouchableOpacity>
        <StyledTouchableOpacity onPress={() => changeLanguage('ru')} className="flex items-center">
          <StyledText className="text-xl">🇷🇺 Русский</StyledText>
        </StyledTouchableOpacity>
        <StyledTouchableOpacity onPress={() => changeLanguage('ka')} className="flex items-center">
          <StyledText className="text-xl">🇬🇪 ქართული</StyledText>
        </StyledTouchableOpacity>
      </StyledView>
    </StyledView>
  );
}
