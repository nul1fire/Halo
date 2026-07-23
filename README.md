<div align="center">
  
# 🛸 Halo
  
**Dynamic Island для Windows**
  
[![Pre-Release](https://img.shields.io/badge/version-pre--release-orange.svg)]()
[![Platform](https://img.shields.io/badge/platform-windows-blue.svg)]()
[![License](https://img.shields.io/badge/license-MIT-green.svg)]()
  
</div>

> **⚠️ Внимание:** Это ранняя **Pre-Release** версия. Проект находится в активной разработке. Приложение временно ориентировано на русскоязычных пользователей (СНГ).

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

## 🛠 Технологии

- [Electron](https://www.electronjs.org/) — создание прозрачного overlay-окна.
- [Vite](https://vitejs.dev/) + [React](https://react.dev/) + TypeScript — быстрый рендеринг UI.
- [Tailwind CSS](https://tailwindcss.com/) — стилизация.
- [Framer Motion](https://www.framer.com/motion/) — плавные анимации (crossfade, layout animations).
- PowerShell (WinRT) — чтение системных медиа-данных без тяжелых C++ аддонов.

## ⚠️ Известные проблемы

- Нет иконки в системном трее (закрыть можно через меню настроек -> Выход).
- Прогресс-бар музыки может дергаться (зависит от плеера).
- Нет автозапуска с системой.

## 🚀 Запуск для разработчиков

```bash
# 1. Клонировать репозиторий
git clone https://github.com/nul1fire/Halo.git

# 2. Установить зависимости
npm install

# 3. Запустить в режиме разработки
npm run dev

# 4. Собрать .exe
npm run build
```

## 📝 План развития (Roadmap)

- Иконка в системном трее.
- Автозапуск с Windows.
- Горячие клавиши.
- Виджеты (погода, системные ресурсы).
- Стабилизация прогресс-бара.

## 📄 Лицензия

Проект распространяется под лицензии MIT.
