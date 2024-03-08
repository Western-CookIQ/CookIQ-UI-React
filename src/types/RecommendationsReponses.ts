export type ContentBasedRecommedationsResponse = {
  recommendations: number[];
};

export type CollaborativeBasedRecommedationsResponse = {
  recommendations: {
    index: number;
    score: number;
  }[];
};
