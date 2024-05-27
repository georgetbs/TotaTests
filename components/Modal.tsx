import React from 'react';
import { View, Text, TouchableOpacity, Modal as RNModal } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

interface ModalProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
  onConfirm: () => void;
  confirmButtonText?: string;
  cancelButtonText?: string;
  singleButton?: boolean;
}

export default function Modal({
  isOpen,
  message,
  onClose,
  onConfirm,
  confirmButtonText = 'OK',
  cancelButtonText = 'Cancel',
  singleButton = false
}: ModalProps) {
  return (
    <RNModal
      transparent={true}
      visible={isOpen}
      animationType="fade"
      onRequestClose={onClose}
    >
      <StyledView className="flex-1 justify-center items-center bg-gray-600 bg-opacity-50">
        <StyledView className="bg-white p-6 rounded-lg shadow-lg w-4/5 max-w-md">
          <StyledText className="text-lg mb-4">{message}</StyledText>
          <StyledView className="flex-row justify-between">
            {singleButton ? (
              <StyledTouchableOpacity onPress={onClose} className="p-2 bg-green-500 rounded-md flex-1">
                <StyledText className="text-white text-center">{confirmButtonText}</StyledText>
              </StyledTouchableOpacity>
            ) : (
              <>
                <StyledTouchableOpacity onPress={onClose} className="p-2 bg-red-500 rounded-md flex-1 mr-2">
                  <StyledText className="text-white text-center">{cancelButtonText}</StyledText>
                </StyledTouchableOpacity>
                <StyledTouchableOpacity onPress={onConfirm} className="p-2 bg-green-500 rounded-md flex-1">
                  <StyledText className="text-white text-center">{confirmButtonText}</StyledText>
                </StyledTouchableOpacity>
              </>
            )}
          </StyledView>
        </StyledView>
      </StyledView>
    </RNModal>
  );
}
