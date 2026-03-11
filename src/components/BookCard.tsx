import { Star } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Book } from '@/data/books';
import { Link } from 'react-router-dom';

interface BookCardProps {
  book: Book;
  index?: number;
}

const BookCard = ({ book, index = 0 }: BookCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link
        to={`/book/${book.id}`}
        className="group block hover-lift"
      >
        <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-3">
          <img
            src={book.cover}
            alt={book.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 text-primary fill-primary" />
              <span className="text-sm font-medium text-foreground">{book.rating}</span>
            </div>
          </div>
        </div>
        <h3 className="font-display font-semibold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-1">
          {book.title}
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">{book.author}</p>
      </Link>
    </motion.div>
  );
};

export default BookCard;
