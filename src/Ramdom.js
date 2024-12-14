const fs = require('fs');    // モジュールの読み込み

const json = fs.readFileSync('src/oseibo.json',"UTF-8");
const data = JSON.parse(json)["list"];

// シャッフル関数（Fisher-Yatesアルゴリズム）
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  
  // 重複しないランダムな値を9個取り出す関数
  function getUniqueRandomValues(list, count) {
    if (count > list.length) {
      throw new Error("指定された数がリストのサイズを超えています。");
    }
  
    const shuffledList = shuffleArray([...list]); // リストをシャッフル（元のリストを変更しない）
    return shuffledList.slice(0, count); // 先頭から指定した数だけ取得
  }
  
  // 実行例
  try {
    const randomValues = getUniqueRandomValues(data, 2);
    console.log("ランダムに選ばれた値:", randomValues);
  } catch (error) {
    console.error(error.message);
  }
  