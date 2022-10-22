export function getBody() {
  return `
  <div class="modal"></div>
  <div class="savedModal">Game Saved</div>
  <div class="controlBar">
    <button class="btn controlShuffle">Shuffle</button>
    
    <select class="controlSelect" name="frameSize">
      <option selected value="3">3</option>
      <option value="4">4</option>
      <option value="5">5</option>
      <option value="6">6</option>
      <option value="7">7</option>
      <option value="8">8</option></select
    ><label class="player" for="sound"
      >Sound<input id="soundCheck" type="checkbox" checked /></label
    ><button class="btn controlSave">Save</button
    ><button class="btn controlLoad">Load</button
    ><button class="btn controlInfo">Info</button>
  </div>
  <audio id="myAudio">
    <source src="./swing-whoosh-110410.mp3" type="audio/ogg" />
  </audio>
  <div class="board">
    <div class="movesCount">Moves 0</div>
    <div class="timer">
      <span class="seconds">00:00</span>
      </div>
      <button class="btn controlReset">Start/Stop</button>
  </div>
  <div class="container"><div class="puzzle__list"></div></div>
  `;
}
