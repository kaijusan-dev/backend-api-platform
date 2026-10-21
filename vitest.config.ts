import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {

    // Включаем полную изоляцию сред для каждого файла тестов
    isolate: true,

    // Отключаем параллельный запуск разных файлов тестов
    fileParallelism: false, 
    
    // Ограничиваем количество потоков до одного
    maxWorkers: 1,

    // Отключаем параллельный запуск тестов внутри самих файлов
    sequence: {
      concurrent: false,
    },
  },
});
