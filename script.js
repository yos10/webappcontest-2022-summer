'use strict';

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

// イベント登録
const form = document.querySelector('#form');
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const ratioBean = parseInt(document.querySelector('#ratio-bean').value);
  const ratioWater = parseInt(document.querySelector('#ratio-water').value);
  const bean = parseInt(document.querySelector('#weight-bean').value);

  const newRecipe = recipe(ratioBean, ratioWater, bean);

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
});
