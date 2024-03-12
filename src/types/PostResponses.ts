export type Post = {
    id: number,
    user_id: string;
    upload_date_in_utc: string;
    recipe_id: number,
    rating: number,
    num_likes: number,
    isLiked: boolean,
  };