import url from "../config/api.setup";
import {
  ContentBasedRecommedationsResponse,
  CollaborativeBasedRecommedationsResponse,
  Chat,
} from "../types/RecommendationsReponses";
import { ApiResponse } from "../types/utils";
import protectedAxios from "../config/axois.setup";

// GET: recipe recommendations based on content based
export const getContentBasedRecommendations = async (
  id: number
): Promise<ApiResponse<ContentBasedRecommedationsResponse>> => {
  try {
    const res = await protectedAxios.get(
      `${url}/api/recommendations/content-based/${id}`
    );
    return { data: res.data };
  } catch (error: unknown) {
    return {
      error:
        error instanceof Error ? error.message : "Unable to register user.",
    };
  }
};

// GET: recipe recommendations based on collaborative based filter
export const getCollaborativeBasedRecommendations = async (
  id: number
): Promise<ApiResponse<CollaborativeBasedRecommedationsResponse>> => {
  try {
    const res = await protectedAxios.get(
      `${url}/api/recommendations/collaborative-based/${id}`
    );
    return { data: res.data };
  } catch (error: unknown) {
    return {
      error:
        error instanceof Error ? error.message : "Unable to register user.",
    };
  }
};

export const getChat = async (query: string): Promise<ApiResponse<Chat>> => {
  try {
    const res = await protectedAxios.get(
      `${url}/api/recommendations/llm?query=${encodeURIComponent(query)}`
    );
    return { data: res.data };
  } catch (error: unknown) {
    return {
      error:
        error instanceof Error ? error.message : "Unable to get chat response.",
    };
  }
};
