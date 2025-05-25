const fs = require('fs');
const path = require('path');

// Функция для чтения JSON файлов
const readJsonFile = (filePath) => {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
};

// Путь к папке с файлами JSON
const localesDir = path.join(__dirname, 'locales');

// Пути к файлам JSON
const enPath = path.join(localesDir, 'en', 'common.json');
const ruPath = path.join(localesDir, 'ru', 'common.json');
const kaPath = path.join(localesDir, 'ka', 'common.json');

// Читаем данные из файлов
const enData = readJsonFile(enPath);
const ruData = readJsonFile(ruPath);
const kaData = readJsonFile(kaPath);

// Функция для проверки ключей
const checkKeys = (baseData, compareData, language) => {
  const baseKeys = Object.keys(baseData);
  const compareKeys = Object.keys(compareData);

  const missingKeys = baseKeys.filter(key => !compareKeys.includes(key));
  const extraKeys = compareKeys.filter(key => !baseKeys.includes(key));

  if (missingKeys.length === 0 && extraKeys.length === 0) {
    console.log(`Все ключи совпадают в файле ${language}`);
  } else {
    if (missingKeys.length > 0) {
      console.log(`Не хватает ключей в файле ${language}:`);
      console.log(missingKeys.join(', '));
    }
    if (extraKeys.length > 0) {
      console.log(`Лишние ключи в файле ${language}:`);
      console.log(extraKeys.join(', '));
    }
  }
};

// Проверяем ключи
console.log('Проверка ru.json:');
checkKeys(enData, ruData, 'ru');

console.log('\nПроверка ka.json:');
checkKeys(enData, kaData, 'ka');
