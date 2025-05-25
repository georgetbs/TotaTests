import { Stack } from "expo-router";
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <I18nextProvider i18n={i18n}>
        <Stack screenOptions={{ headerShown: false }} initialRouteName="index">
          <Stack.Screen name="index" />
          <Stack.Screen name="TestScreen" />
        </Stack>
      </I18nextProvider>
    </SafeAreaProvider>
  );
}
