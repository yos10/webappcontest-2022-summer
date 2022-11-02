const localstorageName = 'recipes';

function getAll() {
  return JSON.parse(localStorage.getItem(localstorageName) || '[]');
}

function setItem(recipes) {
  localStorage.setItem(localstorageName, JSON.stringify(recipes));
}

function add(brand, ratioBean, ratioWater, bean) {
  const recipes = getAll();
  const id = generateId();
  const recipe = {
    id: id,
    brand: brand,
    ratioBean: ratioBean,
    ratioWater: ratioWater,
    bean: bean
  }
  recipes.push(recipe);
  setItem(recipes);
}

function getOneRecipe(id) {
  return getAll().filter((recipe) => recipe.id === id)[0];
}

function del(id) {
  const filteredRecipes = getAll().filter((recipe) => recipe.id !== id);
  setItem(filteredRecipes);
}

function generateId() {
  return (
    new Date().getTime().toString(16) +
    Math.floor(1000 * Math.random()).toString(16)
  );
}

export { getAll, add, getOneRecipe, del };
