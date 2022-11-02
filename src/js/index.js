import * as repo from './recipe-repository.js';

const ratioBean = document.getElementById('ratio-bean');
const ratioWater = document.getElementById('ratio-water');
const bean = document.getElementById('weight-bean');
const brand = document.getElementById('brand');

/**
 * お湯の総量
 * @param {number} ratioBean
 * @param {number} ratioWater
 * @param {number} bean
 * @returns {number}
 */
function calcTotalAmountOfWater(ratioBean, ratioWater, bean) {
  const totalAmount = (ratioWater * bean) / ratioBean;

  return Math.floor(totalAmount);
}

/**
 * 注ぐごとに必要なお湯の量
 * @param {number} ratio
 * @param {number} totalAmount
 * @returns {number}
 */
function calcWaterPerPour(ratio, totalAmount) {
  const amount = (ratio / 100) * totalAmount;

  return Math.floor(amount);
}

/**
 * お湯の総量と、注ぐごとに必要なお湯の量を object で返す
 * @param {number} ratioBean
 * @param {number} ratioWater
 * @param {number} bean
 * @returns {object}
 */
function recipe(ratioBean, ratioWater, bean) {
  const totalAmount = calcTotalAmountOfWater(ratioBean, ratioWater, bean);
  const first = calcWaterPerPour(20, totalAmount);
  const second = calcWaterPerPour(20, totalAmount);
  const third = totalAmount - (first + second);

  return {
    totalAmount,
    first,
    second,
    third,
  };
}

function createHtmlElement(html) {
  const template = document.createElement('template');
  template.innerHTML = html.trim();

  return template.content.firstElementChild;
}

function removeHtmlElement(querySelector) {
  const nodeList = document.querySelectorAll(querySelector);

  for (const node of nodeList) {
    node.remove();
  }
}

function displayResults() {
  const ratioBeanValue = parseInt(ratioBean.value);
  const ratioWaterValue = parseInt(ratioWater.value);
  const beanValue = parseInt(bean.value);

  const newRecipe = recipe(ratioBeanValue, ratioWaterValue, beanValue);
  const html = `
    <div id="result-content">
      <p>必要なお湯の量</p>
      <p class="total-water">${newRecipe.totalAmount}g</p>

      <table>
        <thead>
          <tr>
            <th>注ぐ回数</th>
            <th>はかりのディスプレイ</th>
            <th>注ぐお湯</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>${newRecipe.first}g</td>
            <td>${newRecipe.first}g</td>
          </tr>
          <tr>
            <td>2</td>
            <td>${newRecipe.first + newRecipe.second}g</td>
            <td>${newRecipe.second}g</td>
          </tr>
          <tr>
            <td>3</td>
            <td>${newRecipe.totalAmount}g</td>
            <td>${newRecipe.third}g</td>
          </tr>
        </tbody>
      </table>
    </div>
  `;

  removeHtmlElement('#result-content');

  document.querySelector('#result').appendChild(createHtmlElement(html));
}

function displaySavedRecipe() {
  removeHtmlElement('.recipe');

  const recipes = repo.getAll();

  for (const recipe of recipes) {
    const html = `
      <div class="recipe">
        <div class="item-brand"></div>
        <div class="item-1">コーヒー豆の割合 (g)</div>
        <div class="item-2"></div>
        <div class="item-3">お湯の割合 (g)</div>
        <div class="item-4"></div>
        <div class="item-5">用意したコーヒー豆の重さ (g)</div>
        <div class="item-6"></div>
        <div class="delete-button"><button data-id="${recipe.id}">削除</button></div>
      </div>
    `;

    const recipeDiv = createHtmlElement(html);
    const div = recipeDiv.querySelectorAll('.recipe > div');
    div[0].textContent = recipe.brand;
    div[2].textContent = recipe.ratioBean;
    div[4].textContent = recipe.ratioWater;
    div[6].textContent = recipe.bean;

    document.querySelector('#saved-recipe').appendChild(recipeDiv);
  }
}

// input の value を減らすボタンのイベント登録
const stepDownButtons = document.querySelectorAll('.step-down');
for (const button of stepDownButtons) {
  button.addEventListener('click', () => {
    button.nextElementSibling.stepDown();
    displayResults();
  });
}

// input の value を増やすボタンのイベント登録
const stepUpButtons = document.querySelectorAll('.step-up');
for (const button of stepUpButtons) {
  button.addEventListener('click', () => {
    button.previousElementSibling.stepUp();
    displayResults();
  });
}

// input の入力のイベント登録
const inputs = document.querySelectorAll('.input');
for (const input of inputs) {
  input.addEventListener('input', () => {
    displayResults();
  });
}

// 銘柄入力エリアにフォーカスした時
brand.addEventListener('focus', () => {
  saveButton.classList.remove('display-none');
});

// 保存して閉じるボタンを押した時
const saveButton = document.querySelector('.save-button');
saveButton.addEventListener('click', () => {
  saveButton.classList.add('display-none');
  const brandText = brand.textContent;
  const ratioBeanValue = parseInt(ratioBean.value);
  const ratioWaterValue = parseInt(ratioWater.value);
  const beanValue = parseInt(bean.value);
  repo.add(brandText, ratioBeanValue, ratioWaterValue, beanValue);
  brand.innerHTML = '';
  displaySavedRecipe();
});

const savedRecipe = document.querySelector('#saved-recipe');
savedRecipe.addEventListener('click', (e) => {
  const targetDeleteButton = e.target.matches('button');
  const targetRecipeElement = e.target.closest('.recipe');
  // 削除ボタンを押した時
  if (targetDeleteButton) {
    const doDelete = confirm('レシピを削除しますか？');
    if (doDelete) {
      const id = e.target.dataset.id;
      repo.del(id);
      displaySavedRecipe();
    }
  // 保存したレシピをクリックした時
  } else if (targetRecipeElement) {
    const recipeId = targetRecipeElement.querySelector('[data-id]').dataset.id;
    const recipe = repo.getOneRecipe(recipeId);
    ratioBean.value = recipe.ratioBean;
    ratioWater.value = recipe.ratioWater;
    bean.value = recipe.bean;
    displayResults()
  }
});

window.addEventListener('DOMContentLoaded', () => {
  displayResults();
  displaySavedRecipe();
});
