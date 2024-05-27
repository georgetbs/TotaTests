import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledRadio = styled(TouchableOpacity);

interface QuestionProps {
  question: any;
  questionIndex: number;
  totalQuestions: number;
  selectedAnswer: string;
  onAnswer: (questionId: string, answer: string) => void;
  mode: 'exam' | 'study';
  showHints: boolean;
}

export default function Question({ question, questionIndex, totalQuestions, selectedAnswer, onAnswer, mode, showHints }: QuestionProps) {
  const { t } = useTranslation();

  return (
    <StyledView className='py-5'>
      <StyledText className="text-2xl mb-4">
        {t('question')} {questionIndex + 1}/{totalQuestions}
      </StyledText>
      <StyledText className="text-xl mb-4">{question.question}</StyledText>
      {question.options.map((option: string, index: number) => (
        <StyledRadio
          key={index}
          onPress={() => onAnswer(question.id, option)}
          className={`flex-row items-center p-2 border-2 mb-2 ${selectedAnswer === option ? 'border-blue-500' : 'border-gray-300'}`}
        >
          <StyledView className={`w-4 h-4  rounded-full  mr-2 ${selectedAnswer === option ? 'bg-blue-500' : 'border-2 border-gray-300'}`} />
          <StyledText className={`pr-4`} >{option}</StyledText>
        </StyledRadio>
      ))}
      {mode === 'study' && showHints && selectedAnswer && (
        <StyledText className={`mt-2 ${selectedAnswer === question.answer ? 'text-green-500' : 'text-red-500'}`}>
          {selectedAnswer === question.answer ? '✔️' : '❌'} {selectedAnswer === question.answer ? '' : question.answer}
        </StyledText>
      )}
    </StyledView>
  );
}
