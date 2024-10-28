// Define the Quote interface
interface Quote {
  id: string;
  text: string;
  author: string;
  category: string;
  likes: number;
  dislikes: number;
}

// Export only once
export type { Quote };
