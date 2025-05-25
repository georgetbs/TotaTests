const fs = require('fs');
const path = require('path');

// Путь к папке с файлами JSON
const dataDir = path.join(__dirname, 'data');

// Читаем все JSON файлы из папки data
const files = fs.readdirSync(dataDir).filter(file => file.endsWith('.json'));

let allData = [];

// Считываем данные из каждого JSON файла
files.forEach(file => {
  const filePath = path.join(dataDir, file);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  allData = allData.concat(data);
});

// Функция для проверки правильности ответов
const checkAnswers = (data) => {
  return data.map(item => {
    const isCorrect = item.options.includes(item.answer);
    return {
      id: item.id,
      question: item.question,
      answer: item.answer,
      isCorrect: isCorrect
    };
  });
};

// Проверяем ответы
const results = checkAnswers(allData);

// Функция для обработки результатов проверки
const processResults = (results) => {
  const incorrectResults = results.filter(item => !item.isCorrect);

  if (incorrectResults.length === 0) {
    console.log('Все совпадает');
  } else {
    console.log('Обнаружены несоответствия:');
    incorrectResults.forEach(item => {
      console.log(`ID: ${item.id}`);
      console.log(`Вопрос: ${item.question}`);
      console.log(`Ответ: ${item.answer}`);
      console.log('---');
    });
  }
};

// Путь для сохранения результатов
const resultsDir = path.join(__dirname, 'results');
if (!fs.existsSync(resultsDir)) {
  fs.mkdirSync(resultsDir);
}

// Сохраняем результаты в файл
const resultsPath = path.join(resultsDir, 'results.json');
fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2), 'utf8');

processResults(results);
