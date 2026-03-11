import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import GenreFilter from '@/components/GenreFilter';
import BookSection from '@/components/BookSection';
import Footer from '@/components/Footer';
import { mockBooks } from '@/data/books';

const Index = () => {
  const recommended = mockBooks.filter(b => b.isRecommended);
  const newBooks = mockBooks.filter(b => b.isNew);
  const popular = mockBooks.filter(b => b.isPopular);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <GenreFilter />
      <BookSection titleKey="sections.recommended" books={recommended} />
      <BookSection titleKey="sections.newBooks" books={newBooks} />
      <BookSection titleKey="sections.popular" books={popular} />
      <Footer />
    </div>
  );
};

export default Index;
