import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, TouchableOpacity, TextInput, SafeAreaView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { styled } from 'nativewind';
import Modal from '../components/Modal';
import Question from './Question';
import { Question as QuestionType } from './types';
import { useRouter, useLocalSearchParams } from 'expo-router';

// Directly import JSON files
import languageData from '../data/language.json';
import historyData from '../data/history.json';
import lawData from '../data/law.json';

const shuffleArray = (array: any[]) => array.sort(() => Math.random() - 0.5);

const StyledScrollView = styled(ScrollView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledCheckbox = styled(TouchableOpacity);
const StyledRadio = styled(TouchableOpacity);
const StyledTextInput = styled(TextInput);
const StyledSafeAreaView = styled(SafeAreaView);

export default function TestScreen({ onBack }: { onBack: () => void }) {
  const { t } = useTranslation();
  const { mode } = useLocalSearchParams<{ mode?: 'exam' | 'study' }>();
  const router = useRouter();

  if (!mode) {
    return (
      <StyledSafeAreaView className="flex-1 p-4 bg-white justify-center items-center">
        <StyledText className="text-3xl mb-8">{t('missing_mode')}</StyledText>
        <StyledTouchableOpacity onPress={onBack} className="p-2 border-2 border-red-500 mt-4">
          <StyledText>{t('home')}</StyledText>
        </StyledTouchableOpacity>
      </StyledSafeAreaView>
    );
  }

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: string }>({});
  const [showResults, setShowResults] = useState<boolean>(false);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [incorrectCount, setIncorrectCount] = useState<number>(0);
  const [pass, setPass] = useState<string | null>(null);
  const [timer, setTimer] = useState<number>(0);
  const [numQuestions, setNumQuestions] = useState<string>('200');
  const [questionSets, setQuestionSets] = useState<string[]>([]);
  const [useNumQuestions, setUseNumQuestions] = useState<boolean>(true);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [confirmMessage, setConfirmMessage] = useState<string>('');
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});
  const [showHints, setShowHints] = useState<boolean>(true);
  const [showCorrectAnswers, setShowCorrectAnswers] = useState<boolean>(false);
  const [showIncorrectAnswers, setShowIncorrectAnswers] = useState<boolean>(false);

  const categoryData: { [key: string]: QuestionType[] } = {
    language: languageData,
    history: historyData,
    law: lawData,
  };

  const handleStart = () => {
    if (selectedCategories.length === 0) {
      setConfirmMessage(t('please_select_category'));
      setConfirmAction(() => setIsConfirmModalOpen.bind(null, false));
      setIsConfirmModalOpen(true);
      return;
    }

    let allQuestions: QuestionType[] = [];
    selectedCategories.forEach((category) => {
      allQuestions = allQuestions.concat(categoryData[category] || []);
    });

    if (mode === 'study') {
      if (useNumQuestions) {
        const totalQuestions = parseInt(numQuestions, 10) || (selectedCategories.length * 200);
        allQuestions = shuffleArray(allQuestions).slice(0, totalQuestions);
      } else {
        let setsQuestions: QuestionType[] = [];
        if (questionSets.includes('first')) {
          setsQuestions = setsQuestions.concat(allQuestions.slice(0, 50));
        }
        if (questionSets.includes('second')) {
          setsQuestions = setsQuestions.concat(allQuestions.slice(50, 100));
        }
        if (questionSets.includes('third')) {
          setsQuestions = setsQuestions.concat(allQuestions.slice(100, 150));
        }
        if (questionSets.includes('fourth')) {
          setsQuestions = setsQuestions.concat(allQuestions.slice(150, 200));
        }
        allQuestions = setsQuestions;
      }
    }

    if (mode === 'exam') {
      setQuestions(shuffleArray(allQuestions).slice(0, 10));
      setTimer(20 * 60); // 20 minutes
    } else {
      setQuestions(allQuestions);
    }
  };

  useEffect(() => {
    if (mode === 'exam' && timer > 0) {
      const timerId = setInterval(() => setTimer(timer - 1), 1000);
      if (timer === 1) handleFinish();
      return () => clearInterval(timerId);
    }
  }, [timer, mode]);

  const handleAnswer = (questionId: string, answer: string) => {
    setSelectedAnswers({ ...selectedAnswers, [questionId]: answer });
  };

  const handleNext = () => {
    setCurrentQuestionIndex((prevIndex) => Math.min(prevIndex + 1, questions.length - 1));
  };

  const handlePrevious = () => {
    setCurrentQuestionIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const handleFinish = () => {
    if (Object.keys(selectedAnswers).length < questions.length) {
      setConfirmMessage(t('please_answer_all_questions'));
      setConfirmAction(() => setIsConfirmModalOpen.bind(null, false));
      setIsConfirmModalOpen(true);
      return;
    }

    setConfirmAction(() => confirmFinish);
    setConfirmMessage(t('confirm_action_submit'));
    setIsConfirmModalOpen(true);
  };

  const confirmFinish = () => {
    let correct = 0;
    let incorrect = 0;

    questions.forEach((question) => {
      if (selectedAnswers[question.id] === question.answer) {
        correct++;
      } else {
        incorrect++;
      }
    });

    setCorrectCount(correct);
    setIncorrectCount(incorrect);

    if (mode === 'exam') {
      const passPercentage = (correct / questions.length) * 100;
      if (passPercentage === 100) {
        setPass('excellent');
      } else if (passPercentage >= 70) {
        setPass('pass');
      } else {
        setPass('fail');
      }
    }

    setShowResults(true);
    setIsConfirmModalOpen(false);
  };

  const handleRestart = () => {
    setSelectedCategories([]);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowResults(false);
    setCorrectCount(0);
    setIncorrectCount(0);
    setPass(null);
    setTimer(0);
  };

  const handleHome = () => {
    if (questions.length > 0 && !showResults) {
      setConfirmMessage(t('confirm_navigation_home'));
      setConfirmAction(() => {
        setIsConfirmModalOpen(false);
        router.push('/');
      });
      setIsConfirmModalOpen(true);
    } else {
      router.push('/');
    }
  };

  const toggleHints = () => {
    setShowHints(!showHints);
  };

  const toggleShowCorrectAnswers = () => {
    setShowCorrectAnswers(!showCorrectAnswers);
  };

  const toggleShowIncorrectAnswers = () => {
    setShowIncorrectAnswers(!showIncorrectAnswers);
  };

  const handleCategoryChange = (category: string) => {
    if (mode === 'exam') {
      setSelectedCategories([category]);
    } else {
      setSelectedCategories((prev) => {
        const newCategories = prev.includes(category) ? prev.filter((cat) => cat !== category) : [...prev, category];
        if (newCategories.length > 1) {
          setUseNumQuestions(true);
        }
        setNumQuestions(String(newCategories.length * 200));
        return newCategories;
      });
    }
  };

  const handleQuestionSetChange = (set: string) => {
    setQuestionSets((prev) =>
      prev.includes(set) ? prev.filter((s) => s !== set) : [...prev, set]
    );
  };

  return (
    <StyledSafeAreaView className="flex-1 bg-white">
      <StyledScrollView contentContainerStyle={{ flexGrow: 1 }} className="p-4">
        {!questions.length ? (
          <StyledView>
            <StyledText className="text-3xl mb-8">{mode === 'exam' ? t('choose_a_category') : t('choose_categories')}</StyledText>
            <StyledView className="mb-4">
              {mode === 'exam' ? (
                <>
                  <StyledRadio onPress={() => handleCategoryChange('language')} className="flex-row items-center mb-2">
                    <StyledView className={`w-4 h-4 rounded-full mr-2 ${selectedCategories.includes('language') ? 'bg-blue-500' : 'border-2 border-gray-300'}`} />
                    <StyledText className="text-3xl">{t('language_test')}</StyledText>
                  </StyledRadio>
                  <StyledRadio onPress={() => handleCategoryChange('history')} className="flex-row items-center mb-2">
                    <StyledView className={`w-4 h-4 rounded-full mr-2 ${selectedCategories.includes('history') ? 'bg-blue-500' : 'border-2 border-gray-300'}`} />
                    <StyledText className="text-3xl">{t('history_test')}</StyledText>
                  </StyledRadio>
                  <StyledRadio onPress={() => handleCategoryChange('law')} className="flex-row items-center mb-2">
                    <StyledView className={`w-4 h-4 rounded-full mr-2 ${selectedCategories.includes('law') ? 'bg-blue-500' : 'border-2 border-gray-300'}`} />
                    <StyledText className="text-3xl">{t('law_test')}</StyledText>
                  </StyledRadio>
                </>
              ) : (
                <>
                  <StyledCheckbox onPress={() => handleCategoryChange('language')} className="flex-row items-center mb-2">
                    <StyledView className={`w-4 h-4 mr-2 ${selectedCategories.includes('language') ? 'bg-blue-500' : 'border-2 border-gray-300'}`} />
                    <StyledText className="text-3xl">{t('language_test')}</StyledText>
                  </StyledCheckbox>
                  <StyledCheckbox onPress={() => handleCategoryChange('history')} className="flex-row items-center mb-2">
                    <StyledView className={`w-4 h-4 mr-2 ${selectedCategories.includes('history') ? 'bg-blue-500' : 'border-2 border-gray-300'}`} />
                    <StyledText className="text-3xl">{t('history_test')}</StyledText>
                  </StyledCheckbox>
                  <StyledCheckbox onPress={() => handleCategoryChange('law')} className="flex-row items-center mb-2">
                    <StyledView className={`w-4 h-4 mr-2 ${selectedCategories.includes('law') ? 'bg-blue-500' : 'border-2 border-gray-300'}`} />
                    <StyledText className="text-3xl">{t('law_test')}</StyledText>
                  </StyledCheckbox>
                </>
              )}
            </StyledView>
            {mode === 'study' && (
              <StyledView className="mb-4">
                <StyledText className="text-3xl mb-4">{t('choose_mode')}</StyledText>
                <StyledView className="flex items-center mb-2">
                  <StyledRadio onPress={() => setUseNumQuestions(true)} className="flex-row items-center mb-2">
                    <StyledView className={`w-4 h-4 rounded-full mr-2 ${useNumQuestions ? 'bg-blue-500' : 'border-2 border-gray-300'}`} />
                    <StyledText>{t('select_number_of_questions')}</StyledText>
                  </StyledRadio>
                </StyledView>
                {useNumQuestions && (
                  <StyledView className="mb-4">
                    <StyledTextInput
                      value={numQuestions}
                      onChangeText={setNumQuestions}
                      keyboardType="numeric"
                      className="border-2 border-black p-2 mb-4"
                      placeholder={String(selectedCategories.length * 200)}
                    />
                  </StyledView>
                )}
                <StyledView className="flex items-center mb-2">
                  <StyledRadio onPress={() => setUseNumQuestions(false)} className="flex-row items-center mb-2" disabled={selectedCategories.length > 1}>
                    <StyledView className={`w-4 h-4 rounded-full mr-2 ${!useNumQuestions && selectedCategories.length <= 1 ? 'bg-blue-500' : 'border-2 border-gray-300'}`} />
                    <StyledText className={selectedCategories.length > 1 ? 'text-gray-400' : ''}>{t('select_question_set')}</StyledText>
                  </StyledRadio>
                </StyledView>
                {!useNumQuestions && selectedCategories.length <= 1 && (
                  <StyledView>
                    <StyledCheckbox onPress={() => handleQuestionSetChange('first')} className="flex-row items-center mb-2">
                      <StyledView className={`w-4 h-4 mr-2 ${questionSets.includes('first') ? 'bg-blue-500' : 'border-2 border-gray-300'}`} />
                      <StyledText>{t('first_50')}</StyledText>
                    </StyledCheckbox>
                    <StyledCheckbox onPress={() => handleQuestionSetChange('second')} className="flex-row items-center mb-2">
                      <StyledView className={`w-4 h-4 mr-2 ${questionSets.includes('second') ? 'bg-blue-500' : 'border-2 border-gray-300'}`} />
                      <StyledText>{t('second_50')}</StyledText>
                    </StyledCheckbox>
                    <StyledCheckbox onPress={() => handleQuestionSetChange('third')} className="flex-row items-center mb-2">
                      <StyledView className={`w-4 h-4 mr-2 ${questionSets.includes('third') ? 'bg-blue-500' : 'border-2 border-gray-300'}`} />
                      <StyledText>{t('third_50')}</StyledText>
                    </StyledCheckbox>
                    <StyledCheckbox onPress={() => handleQuestionSetChange('fourth')} className="flex-row items-center mb-2">
                      <StyledView className={`w-4 h-4 mr-2 ${questionSets.includes('fourth') ? 'bg-blue-500' : 'border-2 border-gray-300'}`} />
                      <StyledText>{t('fourth_50')}</StyledText>
                    </StyledCheckbox>
                  </StyledView>
                )}
              </StyledView>
            )}
            <StyledTouchableOpacity onPress={handleStart} className="p-2 border-2 border-red-500">
              <StyledText>{mode === 'exam' ? t('start_exam') : t('start_study')}</StyledText>
            </StyledTouchableOpacity>
          </StyledView>
        ) : showResults ? (
          <StyledView>
            <StyledView className="mb-4">
              <StyledText className="text-3xl">{t('results')}</StyledText>
              <StyledText>{t('correct_count')}: {correctCount}</StyledText>
              <StyledText>{t('incorrect_count')}: {incorrectCount}</StyledText>
              {mode === 'exam' && (
                <StyledText>{t('verdict')}: {pass === 'excellent' ? t('excellent') : pass === 'pass' ? t('pass') : t('fail')}</StyledText>
              )}
            </StyledView>
            <StyledScrollView className="mb-4">
              <StyledView className="flex flex-row flex-wrap">
                {questions.map((question, index) => (
                  <StyledView key={question.id} className="w-1/5 p-2">
                    <StyledText>{index + 1}</StyledText>
                    <StyledText>{selectedAnswers[question.id] === question.answer ? '✔️' : '❌'}</StyledText>
                  </StyledView>
                ))}
              </StyledView>
            </StyledScrollView>
            <StyledView className="mb-4">
              <StyledTouchableOpacity onPress={toggleShowCorrectAnswers} className="p-2 border-2 border-red-500 mb-2">
                <StyledText>{t('show_correct_answers')}</StyledText>
              </StyledTouchableOpacity>
              <StyledTouchableOpacity onPress={toggleShowIncorrectAnswers} className="p-2 border-2 border-red-500">
                <StyledText>{t('show_incorrect_answers')}</StyledText>
              </StyledTouchableOpacity>
            </StyledView>
            <StyledScrollView className="mb-4">
              {showCorrectAnswers && questions.filter((question) => selectedAnswers[question.id] === question.answer).map((question) => (
                <StyledView key={question.id} className="mb-4">
                  <StyledText>{question.question}</StyledText>
                  <StyledText>{t('your_answer')}: {selectedAnswers[question.id]}</StyledText>
                  <StyledText>{t('correct_answer')}: {question.answer}</StyledText>
                </StyledView>
              ))}
              {showIncorrectAnswers && questions.filter((question) => selectedAnswers[question.id] !== question.answer).map((question) => (
                <StyledView key={question.id} className="mb-4">
                  <StyledText>{question.question}</StyledText>
                  <StyledText>{t('your_answer')}: {selectedAnswers[question.id]}</StyledText>
                  <StyledText>{t('correct_answer')}: {question.answer}</StyledText>
                </StyledView>
              ))}
            </StyledScrollView>
          </StyledView>
        ) : (
          <>
            {mode === 'exam' && (
              <StyledView className="text-right mb-4">
                <StyledText>
                  {t('time_left')}: {Math.floor(timer / 60)}:{('0' + (timer % 60)).slice(-2)}
                </StyledText>
              </StyledView>
            )}
            {questions.length > 0 && (
              <Question
                question={questions[currentQuestionIndex]}
                questionIndex={currentQuestionIndex}
                totalQuestions={questions.length}
                selectedAnswer={selectedAnswers[questions[currentQuestionIndex]?.id]}
                onAnswer={handleAnswer}
                mode={mode}
                showHints={showHints}
              />
            )}
          </>
        )}
      </StyledScrollView>
      {!showResults && questions.length > 0 && (
        <StyledView className="p-4 border-t-2 border-gray-200 flex flex-row justify-between bg-white">
          <StyledTouchableOpacity onPress={handlePrevious} disabled={currentQuestionIndex === 0} className="p-2 border-2 border-red-500">
            <StyledText>{t('previous')}</StyledText>
          </StyledTouchableOpacity>
          {mode === 'study' && (
            <StyledTouchableOpacity onPress={toggleHints} className="p-2 border-2 border-red-500">
              <StyledText>{showHints ? t('hide_hints') : t('show_hints')}</StyledText>
            </StyledTouchableOpacity>
          )}
          {currentQuestionIndex < questions.length - 1 ? (
            <StyledTouchableOpacity onPress={handleNext} className="p-2 border-2 border-red-500">
              <StyledText>{t('next')}</StyledText>
            </StyledTouchableOpacity>
          ) : (
            <StyledTouchableOpacity onPress={handleFinish} className="p-2 border-2 border-red-500">
              <StyledText>{t('submit')}</StyledText>
            </StyledTouchableOpacity>
          )}
        </StyledView>
      )}
      {showResults && (
        <StyledView className="p-4 border-t-2 border-gray-200 flex flex-row justify-between bg-white">
          <StyledTouchableOpacity onPress={handleRestart} className="p-2 border-2 border-red-500">
            <StyledText>{t('restart')}</StyledText>
          </StyledTouchableOpacity>
          <StyledTouchableOpacity onPress={handleHome} className="p-2 border-2 border-red-500">
            <StyledText>{t('home')}</StyledText>
          </StyledTouchableOpacity>
        </StyledView>
      )}
      <Modal
        isOpen={isConfirmModalOpen}
        message={confirmMessage}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={confirmAction}
        confirmButtonText={confirmMessage === t('please_answer_all_questions') || confirmMessage === t('please_select_category') ? t('ok') : t('yes')}
        cancelButtonText={confirmMessage === t('please_answer_all_questions') || confirmMessage === t('please_select_category') ? '' : t('no')}
        singleButton={confirmMessage === t('please_answer_all_questions') || confirmMessage === t('please_select_category')}
      />
    </StyledSafeAreaView>
  );
}
