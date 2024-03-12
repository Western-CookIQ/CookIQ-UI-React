export type ContentBasedRecommedationsResponse = {
  recommendations: number[];
};

export type CollaborativeBasedRecommedationsResponse = {
  recommendations: {
    id: number;
    score: number;
  }[];
};
