// components/Footer.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { styled } from 'nativewind';
import { Link } from 'expo-router';

const StyledView = styled(View);
const StyledText = styled(Text);

export default function Footer() {
  return (
    <StyledView className="absolute bottom-0 left-0 right-0 p-4 border-t-2  border-red-500 text-center">
      <StyledText className="text-center">&copy; 2024 <Link href="https://tota.ge"><StyledText className="text-green-500">TOTA.GE </StyledText></Link>Citizenship Test App</StyledText>
    </StyledView>
  );
}
