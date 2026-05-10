import { ReviewPage } from './components/ReviewPage';
import reviewData from './data/review_mock.json';
import type { Review } from './types/review';

const review = reviewData as Review;

export default function App() {
  return <ReviewPage review={review} />;
}
