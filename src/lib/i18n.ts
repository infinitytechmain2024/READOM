import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      nav: {
        home: 'Home',
        catalog: 'Catalog',
        categories: 'Categories',
        about: 'About',
        signIn: 'Sign In',
        signUp: 'Sign Up',
      },
      hero: {
        title: 'Discover Your Next',
        titleHighlight: 'Great Read',
        subtitle: 'Explore thousands of books, discover new authors, and immerse yourself in the world of literature',
        searchPlaceholder: 'Search books, authors, genres...',
        startReading: 'Start Reading',
        startWriting: 'Start Writing',
      },
      sections: {
        genres: 'Book Genres',
        recommended: 'Recommended for You',
        newBooks: 'New Arrivals',
        popular: 'Most Popular',
        viewAll: 'View All',
      },
      genres: {
        all: 'All',
        business: 'Business',
        psychology: 'Psychology',
        selfDev: 'Self-Development',
        fantasy: 'Fantasy',
        scifi: 'Science Fiction',
        philosophy: 'Philosophy',
        biography: 'Biography',
        thriller: 'Thriller',
      },
      book: {
        readNow: 'Read Now',
        addToFavorites: 'Add to Favorites',
        rating: 'Rating',
      },
      footer: {
        description: 'Your premium digital library for discovering, reading, and sharing books.',
        navigation: 'Navigation',
        support: 'Support',
        legal: 'Legal',
        helpCenter: 'Help Center',
        contact: 'Contact Us',
        faq: 'FAQ',
        privacy: 'Privacy Policy',
        terms: 'Terms of Service',
        rights: 'All rights reserved.',
      },
    },
  },
  ru: {
    translation: {
      nav: {
        home: 'Главная',
        catalog: 'Каталог',
        categories: 'Категории',
        about: 'О нас',
        signIn: 'Войти',
        signUp: 'Регистрация',
      },
      hero: {
        title: 'Откройте свою следующую',
        titleHighlight: 'великую книгу',
        subtitle: 'Исследуйте тысячи книг, открывайте новых авторов и погружайтесь в мир литературы',
        searchPlaceholder: 'Поиск книг, авторов, жанров...',
        startReading: 'Начать читать',
        startWriting: 'Начать писать',
      },
      sections: {
        genres: 'Жанры книг',
        recommended: 'Рекомендации для вас',
        newBooks: 'Новинки',
        popular: 'Самые популярные',
        viewAll: 'Смотреть все',
      },
      genres: {
        all: 'Все',
        business: 'Бизнес',
        psychology: 'Психология',
        selfDev: 'Саморазвитие',
        fantasy: 'Фэнтези',
        scifi: 'Научная фантастика',
        philosophy: 'Философия',
        biography: 'Биография',
        thriller: 'Триллер',
      },
      book: {
        readNow: 'Читать',
        addToFavorites: 'В избранное',
        rating: 'Рейтинг',
      },
      footer: {
        description: 'Ваша премиальная цифровая библиотека для открытия, чтения и обмена книгами.',
        navigation: 'Навигация',
        support: 'Поддержка',
        legal: 'Правовая информация',
        helpCenter: 'Центр помощи',
        contact: 'Связаться с нами',
        faq: 'Часто задаваемые вопросы',
        privacy: 'Политика конфиденциальности',
        terms: 'Условия использования',
        rights: 'Все права защищены.',
      },
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
