export function getBody() {
  return `
  <div class="modal"></div>
  <div class="savedModal">Game Saved</div>
  <div class="showRules"></div>
  <div class="controlBar">
    <button class="btn controlShuffle">Shuffle</button>
    
    <select class="controlSelect" name="frameSize">
      <option  value="3">3</option>
      <option selected value="4">4</option>
      <option value="5">5</option>
      <option value="6">6</option>
      <option value="7">7</option>
      <option value="8">8</option></select
    >
    
    <button class="btn controlSave">Save</button
    ><button class="btn controlLoad">Load</button
    ><button class="btn controlInfo">Score</button>
    <label class="easyLabel" for="easyCheck">Easy<input id="easyCheck" type="checkbox" /></label>
  </div>
  <audio id="myAudio">
    <source src="./swing-whoosh-110410.mp3" type="audio/ogg" />
  </audio>
  <div class="board">
  <label class="player" for="soundCheck">Sound<input id="soundCheck" type="checkbox" checked /></label>
  <label class="alarmLabel" for="alarmCheck">Alarm<input id="alarmCheck" type="checkbox" checked /></label>
  
  
    <div class="movesCount">Moves 0</div>
    <div class="timer">
      <span class="seconds">00:00</span>
      </div>
      <button class="btn controlReset">Start/Stop</button>
  </div>
  <div class="container"><div class="puzzle__list"></div></div>
  `;
}

export const createNotification = () => {
  return `
    <div class='popup'>
    <div class='closePopup'></div>
      <h3>Информация о приложении</h3>
    <ul class='rules'>      
      <li> Все отображаемые <b>пазлы являются решаемыми</b>, т.к. используется алгоритм подсчета инверсий и нерешаемые последовательности
      отбрасываются</li>
      <li><b>Перемещать клетки</b> можно как по клику так и перетаскивая из текущей в свободную.</li>
      <li><b>Отсчет таймера</b> начинается при перетаскивании первой клетки или после нажатия по кнопке Start/Stop.</li>
      <li>После решения пазла или перезагрузке, <b>автоматически генерируется новое поле</b>.</li>
      <li>Для <b>изменения</b> размера поля необходимо выбрать длину строки в селекте</li>
      <li>Для отображения <b>списка резельтатов</b> необходимо нажать кнопку Score</li>
      <li>Загрузка и сохранение происходит по нажатию на кнопки <b>Save Load</b> </li>
      <li>Предусмотрен <b>easy mode</b> , при включении которого пазл можно собрать за один клик, для включения нужно поставить галочку в <b>Easy</b></li>
      <br>
      <li> При переключении между Desktop и Mobile в DevTools, может происходить смещение клеток.
      Однако это никак не влияет на опыт пользователя, т.к. появляется <b>исключительно при переключении режима
      DevTools</b>. При появлении смещения достаточно перезагрузить страницу. На всех устройствах <b>приложение ведет себя адаптивно и отзывчиво</b>, как и требует ТЗ.</li>
      <li>Для <b>отключения уведомления</b> необходимо снять галочку с Alarm</li>
      </ul>
   
    </div>
  `;
};

export const createPuzzleItem = (className = '', order = 0) => {
  return `
    <div class='puzzle__item${className}' data-order=${order}>
    <p>${order + 1}</p>
    </div>
  `;
};

export const createPuzzleCell = (element = '', order = '') => {
  return `
    <div class='puzzle__cell data-order=${order}'>
    ${element}
    </div>
  `;
};

export const createPopup = (time, moves) => {
  return `
    <div class='popup'>
    <div class='closePopup'></div>
    <p>«Hooray! You solved the puzzle in <b>${time}</b> and <b>${moves}</b> moves!»</p>
   
    </div>
  `;
};

export const createLeaderBoard = (list) => {
  const result =
    list.length !== 0
      ? list.map((a, key) => {
          return `
      <div class='leaderItem'>
      <span>${key + 1}. ${a.time} moves - ${a.count}</span>      
      </div>
      `;
        })
      : ['Board is empty'];
  return `
    <div class='popup'>
     <div class='closePopup'></div>
    <h3>Leader board</h3>
    <ul class="scoreBoard">
      ${result.join('')}
    </ul>
      </div>
    `;
};

export const createPuzzleItemCell = (length = 16) => {
  return Array(length)
    .fill(0)
    .map((a, index) => {
      return createPuzzleCell('', index);
    });
};

export const createPuzzleItemList = (array) => {
  return array.map((a) => {
    return createPuzzleItem('', a);
  });
};
