import httpService from "./httpService";

export async function getAllRecipes() {
  return await httpService.post("/recipes/getAllRecipes");
}

export function finishRecipes(Recipes) {
  return httpService.post("/recipes/finish-Recipes", Recipes);
}

export function getRecipes(id) {
  return httpService.post(`/recipes/Recipes/${id}`);
}

export function updateRecipes(Recipes) {
  return httpService.put(`/recipes/Recipes/${Recipes._id}`, Recipes);
}
export function updateFavoriteStatus(favorite, id) {
  return httpService.put(`/recipes/favorite/${id}`, { favorite });
}

export async function fetchToEditRecipes(Recipes) {
  return await httpService.patch(`/recipes/edit-Recipes/${Recipes._id}`, Recipes);
}

export async function fetchDeleteRecipes(id) {
  return await httpService.post(`/recipes/delete/${id}`);
}

const RecipesService = {
  getAllRecipes,
  finishRecipes,
  getRecipes,
  fetchDeleteRecipes,
  updateFavoriteStatus,
  updateRecipes,
};
export default RecipesService;
