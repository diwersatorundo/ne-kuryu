<p align="center">
  <img src="assets/icon.png" width="120" alt="Nicotiny" />
</p>

<h1 align="center">Nicotiny</h1>

<p align="center">
  Минималистичный трекер отказа от курения: сфера дыма уменьшается с каждым днём без сигарет.
</p>

<p align="center">
  <img alt="Expo SDK" src="https://img.shields.io/badge/Expo-SDK%2058-000?logo=expo&logoColor=white" />
  <img alt="React Native" src="https://img.shields.io/badge/React%20Native-0.88-61DAFB?logo=react&logoColor=000" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white" />
  <img alt="License" src="https://img.shields.io/badge/license-MIT-9C6BFF" />
</p>

## О проекте

Nicotiny помогает отслеживать прогресс отказа от курения. В центре главного экрана — процедурная сфера дыма: в момент отказа она максимального размера и постепенно сжимается, показывая, сколько дней, часов и минут прошло без сигарет.

Приложение работает полностью локально. Профиль, настройки и прогресс хранятся на устройстве в `AsyncStorage` и никуда не отправляются.

## Возможности

- Крупный счётчик воздержания: дни, часы, минуты, секунды.
- Сфера дыма, которая уменьшается по экспоненте и реагирует на сброс даты.
- Статистика: сэкономленные деньги, невыкуренные сигареты, сэкономленное время.
- Расчёт по категориям и стоимости упаковки.
- Онбординг с выбором даты отказа, потребления и цен.
- Два режима отображения и поддержка reduced motion.
- Экран с объяснением всех формул и расчётов.
- Тёмная тема, полупрозрачные карточки, градиенты и мягкие свечения.

## Сфера воздержания

Параметры собраны в `src/constants/sphere.ts`:

```text
growth   = exp(-elapsedDays / 60)
diameter = minDiameter + (maxDiameter - minDiameter) * growth
```

- `maxDiameter = min(screenWidth * 0.88, 380)`
- `minDiameter = 88`
- Время берётся из существующей статистики (`useNow` + `calculateStats`), без отдельного таймера.
- Сфера отрисовывается слоями SVG-градиентов и мемоизируется; размер обновляется с часовой точностью.

## Режимы отображения

| Красивый | Производительный |
| --- | --- |
| Полные SVG-слои сферы и анимации | Упрощённая статичная сфера |
| Градиенты, блики, тени | Плотные поверхности без теней |
| Blur в таб-баре | Без blur и фоновых свечений |
| Фоновые цветовые свечения | Минимальная нагрузка на GPU |

Выбор сохраняется в `nekuryu.preferences.v1`. При включённом reduced motion анимации отключаются автоматически.

## Стек

- Expo SDK 58 / React Native 0.88 / React 19
- TypeScript
- `react-native-svg` — сфера и фоновые свечения
- `expo-blur` — стеклянный таб-бар
- `expo-linear-gradient` — градиентные поверхности
- `@react-native-async-storage/async-storage` — локальное хранение

## Запуск

```bash
npm install
npx expo start
```

Для запуска на Android:

```bash
npx expo run:android
```

## Сборка APK

```bash
npx expo prebuild --platform android --clean --no-install
cd android
./gradlew assembleRelease
```

Готовый файл: `android/app/build/outputs/apk/release/app-release.apk`.

## Скрипты

| Команда | Описание |
| --- | --- |
| `npm run lint` | ESLint через Expo |
| `npm run typecheck` | Проверка TypeScript |
| `npm run check:calculations` | Тесты расчётов и геометрии сферы |
| `npm run icons` | Генерация иконок и splash из кода |
| `npm run android` / `npm run ios` | Нативный запуск |

## Структура

```text
src/
  components/     UI-компоненты, сфера, стеклянные поверхности
  constants/      тема, параметры сферы, продукты
  context/        настройки отображения и reduced motion
  navigation/     таб-бар
  onboarding/     шаги первого запуска
  screens/        главный экран, настройки, объяснение расчётов
  storage/        локальное хранение профиля
  utils/          расчёты статистики и форматирование
scripts/
  check-calculations.ts
  generate-icons.mjs
```

## Релизы

Скачать APK: [последний релиз](https://github.com/diwersatorundo/ne-kuryu/releases/latest)

## Лицензия

[MIT](LICENSE)
