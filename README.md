<div align="center">
  
# 🛸 Halo
  
**Dynamic Island для Windows**
  
![Electron](https://img.shields.io/badge/Electron-191919?style=for-the-badge&logo=electron&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)
  
</div>

> **⚠️ Внимание:** Это ранняя **Pre-Release** версия. Проект находится в активной разработке и временно ориентирован на русскоязычных пользователей (СНГ).

Прозрачный, плавный и минималистичный Dynamic Island для рабочего стола Windows. Приложение работает поверх всех окон, перехватывает системные события и отображает их в виде красивой анимированной "пилюли" в стиле Apple.

## 📸 Скриншоты

<div align="center">
  <table>
    <tr>
      <td align="center"><b>🎵 Музыка</b></td>
      <td align="center"><b>⏱ Часы</b></td>
    </tr>
    <tr>
      <td><img src="screenshots/music.png" width="400"></td>
      <td><img src="screenshots/clock.png" width="400"></td>
    </tr>
    <tr>
      <td align="center"><b>📋 Буфер обмена</b></td>
      <td align="center"><b>⚙️ Настройки</b></td>
    </tr>
    <tr>
      <td><img src="screenshots/clipboard.png" width="400"></td>
      <td><img src="screenshots/settings.png" width="400"></td>
    </tr>
  </table>
</div>

## ✨ Возможности

- 🎵 **Перехват музыки:** Подхватывает треки из Spotify, Яндекс.Музыки, браузеров (Chrome/Edge) и других плееров, интегрированных с Windows SMTC.
- ⏱ **Часы:** Отображение локального времени и даты.
- 📋 **Буфер обмена:** Всплывающее уведомление при копировании текста (`Ctrl+C`).
- 🖱 **Перетаскивание:** Островок и меню настроек можно двигать мышкой в любое место экрана.
- 👻 **Click-Through:** Прозрачные зоны окна не блокируют рабочий стол — клики проходят насквозь.
- ⚙️ **Режимы отображения:** Цикл, только музыка, только часы или скрытый режим.

## ⚠️ Известные проблемы

- Нет иконки в системном трее (закрыть можно через меню настроек -> Выход).
- Прогресс-бар музыки может дергаться (зависит от плеера).
- Нет автозапуска с системой.

## 🚀 Запуск для разработчиков

```bash
# Клонировать репозиторий
git clone https://github.com/nul1fire/Halo.git

# Установить зависимости
npm install

# Запустить в режиме разработки
npm run dev

# Собрать .exe
npm run build
```

## 📄 Лицензия

Проект распространяется под лицензии MIT.
