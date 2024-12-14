import { useState, useEffect } from 'react';
import './App.css';
import oseibo from './oseibo_list.json';

function App() {

  const [screen, setScreen] = useState('start') //start, game, result
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [currentItems, setCurrentItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [difference, setDifference] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({});

  useEffect(() => {
    if (round > 0 && round <= 5) {
      generateItems();
    }
  }, [round]);

  const generateItems = () => {
    const availableItems = oseibo["list"].filter(item => !selectedItems.includes(item.id));
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

    setModalContent({
      selectedItem: item,
      maxItem,
      difference: difference
    });
    setModalVisible(true);

    setTimeout(() => {
      setModalVisible(false);
      setSelectedItems(prev => [...prev, ...currentItems.map(i => i.id)]);

      if (round < 5) {
        setRound(round + 1);
      } else {
        setScreen('result');
      }
    },6000);
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
          <div className='score'>
            <h2>ラウンド {round} / 5</h2>
            <p>スコア : -{score}</p>
          </div>
          <div className='grid'>
            {currentItems.map(item => (
              <div
                key={item.id}
                className='item-box'
                onClick={() => handleSelect(item)}
              >
                <img src={"/images/" + item.id + ".png"} alt={item.name} />
                <div className='oseibo-name'>{item.name}</div>
              </div>
            ))}
          </div>

          {modalVisible && (
            <div className="modal">
              <p>一番高い商品: {modalContent.maxItem.name}</p>
              <img src={"/images/" + modalContent.maxItem.id + ".png"} alt={modalContent.maxItem.name} />
              <p>値段: ¥{modalContent.maxItem.price}</p>
              <p>差額: ¥{modalContent.difference}</p>
            </div>
          )}
        </div>
      )}

      {screen === 'result' && (
        <div className="result">
          <h1>ゲーム終了</h1>
          <p>お前は ¥-{score} 損したぜ</p>
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
