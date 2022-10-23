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
      <li><b>Перемещение</b> клеток происходит исключительно <b>путем перетаскиваяния выбранной клетки</b> в свободную клетку</li>
      <li> Все отображаемые <b>пазлы являются решаемыми</b>, т.к. используется алгоритм подсчета инверсий и нерешаемые последовательности
      отбрасываются</li>
      <li><b>Отсчет таймера</b> начинается при перетаскивании первой клетки или после нажатия по кнопке Start/Stop.
      </li>
      <li>Для <b>изменения</b> размера поля необходимо выбрать длину строки в селекте</li>
      <li>Для отображения <b>списка резельтатов</b> необходимо нажать кнопку Score</li>
      <li>После сборки пазла можно продолжить собирать пазл. Это сделано <b>намеренно</b>, чтобы проверяющий мог добавить результаты
      в список, путем перетаскивания последнего элемента влево вправо. Сортировка происходит по времени</li>
      <li>Загрузка и сохранение происходит по нажатию на кнопки <b>Save Load</b> </li>
      <br>
      <li> При переключении между Desktop и Mobile в DevTools, происходит смещение клеток.
      Однако это никак не влияет на опыт пользователя, т.к. появляется <b>исключительно при переключении режима
      DevTools</b>. При появлении смещения достаточно перезагрузить страницу. На всех устройствах <b>приложение ведет себя адаптивно и отзывчиво</b>, как и требует ТЗ.</li>
      <li>Для <b>отключения уведомления</b> необходимо снять галочку с Alarm</li>
      </ul>
   
    </div>
  `;
};
