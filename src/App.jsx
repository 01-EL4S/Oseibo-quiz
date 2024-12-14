import { useState, useEffect } from 'react';

const generateRandomItems = () => {
  return Array.from({ length: 100 }, (_, index) => ({
    id: index + 1,
    name: `商品${index + 1}`,
    price: Math.floor(Math.random() * 5000) + 500, // Random price between 500 and 5500
    image: `https://via.placeholder.com/150?text=商品${index + 1}`
  }));
};

const testItems = generateRandomItems();

function App() {

  const [screen, setScreen] = useState('start') //start, game, result
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [currentItems, setCurrentItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [difference, setDifference] = useState(null);

  useEffect(() => {
    if (round > 0 && round <= 5) {
      generateItems();
    }
  }, [round]);

  const generateItems = () => {
    const availableItems = testItems.filter(item => !selectedItems.includes(item.id));
    const shuffled = [...availableItems].sort(() => Math.random() - 0.5);
    const itemsForRound = shuffled.slice(0, 9);
    setCurrentItems(itemsForRound);
  };

  const handleSelect = (item) => {
    const maxItem = currentItems.reduce((max, current) => current.price > max.price ? current : max, currentItems[0]);

    if (item.id === maxItem.id) {
      setDifference(0);
    } else {
      const diff = maxItem.price - item.price;
      setDifference(diff);
      setScore(prev => prev + diff);
    }

    setSelectedItems(prev => [...prev, ...currentItems.map(i => i.id)]);

    if (round < 5) {
      setRound(round + 1);
    } else {
      setScreen('result');
    }
  };

  return (
    <div className="App">

      {screen === 'start' && (
        <div className='start'>
          <h1>ケチケチ商品クイズ</h1>
          <button onClick={() => {
            setScore(0);
            setRound(1)
            setSelectedItems([]);
            setScreen('game');
          }}>スタート</button>
        </div>
      )}

      {screen === 'game' && (
        <div className='game'>
          <h2>ラウンド {round} / 5</h2>
          {difference !== null && (
            <p>差額: ¥{difference}</p>
          )}
          <div className='grid'>
            {currentItems.map(item => (
              <div
                key={item.id}
                className='item-box'
                onClick={() => handleSelect(item)}
              >
                <img src={item.image} alt={item.name} />
                <p>{item.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {screen === 'result' && (
        <div className="result">
          <h1>ゲーム終了</h1>
          <p>最終スコア: ¥{score}</p>
          <button onClick={() => {
            setScreen('start');
            setRound(0);
            setScore(0);
            setSelectedItems([]);
            setDifference(null);
          }}>戻る</button>
        </div>
      )}

    </div>
  );
}

export default App;
