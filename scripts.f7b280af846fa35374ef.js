(()=>{"use strict";document.querySelector(".seconds"),document.querySelector(".minutes"),document.querySelector(".hours");class t{isDraggable=!1;puzzleRowLength=4;puzzleLength=16;movesCount=0;movesCountElement;grabAnimationClass=[["move-grab"],["move-transition"]];transitionListClass="move-list-item";elementInitialState={x:0,y:0};startPosition={x:0,y:0,offsetTop:0,initialId:0};dragElement=null;dragArea=null;dragDropZone=[];dragElementList=[];startCell={};Axis=!1;startParent;shiftMouseParent=0;cellFrame={};saveList=[];resetCount(t=0){this.movesCountElement(t),this.movesCount=t,console.log("CALL RESET",this.movesCount)}getDivideRest(t){switch((t+1)%this.puzzleRowLength){case 0:return[t-1];case 1:return[t+1];default:return[t-1,t+1]}}getAvailableCells(t){const e=[];return t+this.puzzleRowLength<=this.puzzleLength&&e.push(t+this.puzzleRowLength),t-this.puzzleRowLength>=0&&e.push(t-this.puzzleRowLength),e.push(...this.getDivideRest(t)),e}constructor(t,e,s){this.dragArea=t,this.dragDropZone=e,this.dragElementList=s}setTransitionClass(t,e){this.transitionListClass=t,this.grabAnimationClass=e}saveGameList(){const t=this.dragElementList.sort(((t,e)=>t.id-e.id));this.saveList=t}checkSequence(){const t=this.dragElementList.sort(((t,e)=>t.id-e.id));console.table(t),this.saveList=t,t.some(((t,e)=>t.id===this.dragDropZone[e]))}isSolved(){return this.dragElementList.filter((t=>t.id!==this.dragElementList.length-1&&t.parentId===t.id)).length===this.dragElementList.length-1}setInitInitialState(){this.elementInitialState={x:this.dragElement.offsetLeft,y:dragElement.offsetTop}}setStartPosition(t){const e=this.getDifference({x:t.clientX,y:t.clientY},this.dragArea);e.y+=this.dragElement.offsetTop-this.dragElement.style.top.replace("px",""),this.startPosition=this.getDifference(e,this.dragElement),this.startPosition.offsetTop=this.dragElement.offsetTop,this.Axis=this.getAxis(t,this.getDifference({x:t.clientX,y:t.clientY},this.dragArea)),this.startParent=this.findDragElement().parentId,this.setDraggableBorders(t),this.startCell=this.getDistanceRectCoord(this.getParentCell().item,this.dragElement),this.cellFrame=this.getAvailableCoord(this.getParentCell()),this.isDraggable=!0}getParentCell(t=this.startParent){return this.dragDropZone[t]}setElementPosition(t,{x:e,y:s}){t.style.left=e+"px",t.style.top=s+"px"}toggleElementClass(t,e=!1,[s,n]=this.grabAnimationClass){[s,n]=e?[n,s]:[s,n],t.classList.add(...s),t.classList.remove(...n)}getDifference(t,e){return{x:t.x-e.offsetLeft,y:t.y-e.offsetTop}}checkElementCrossing(t,e){const s=t.filter((({zone:t})=>this.checkIsCrossing(e,zone)));return 0!==s.length?s[0].id:null}checkIsCrossing(t,e){return t.top>e.top-t.height/2&&t.bottom-t.height/2<e.bottom&&t.left>e.left-t.width/2&&t.right-t.width/2<e.right}setSingleTransition(t,e=this.transitionListClass){t.item.classList.add(e),t.item.addEventListener("transitionend",(()=>{t.item.classList.remove(e)}))}checkIsContainsTransition(t,e=this.transitionListClass){return t.item.classList.contains(e)}findDragElement(t=null){return null!==t?this.dragElementList.find((e=>e.id===t)):this.dragElementList.find((t=>t.item===this.dragElement))}getDistanceRectCoord(...t){return{x:this.getDistanceRect(...t,"left"),y:this.getDistanceRect(...t)}}getDistanceRect(t,e,s="top"){return t.getBoundingClientRect()[s]-e.getBoundingClientRect()[s]+Number(e.style[s].replace("px",""))}setEmptyCell(){}getAxis(t){return{x:t.clientY>this.emptyCell.item.getBoundingClientRect().top&&t.clientY<this.emptyCell.item.getBoundingClientRect().bottom,y:t.clientX>this.emptyCell.item.getBoundingClientRect().left&&t.clientX<this.emptyCell.item.getBoundingClientRect().right}}getAvailableCoord(t){const e=t.item.getBoundingClientRect(),s=this.emptyCell.item.getBoundingClientRect();return{left:e.left<=s.left?e.left:s.left,right:e.right>=s.right?e.right:s.right,top:e.top<=s.top?e.top:s.top,bottom:e.bottom>=s.bottom?e.bottom:s.bottom}}checkAvailablePoints(t,e,s){return s?t.top>e.top&&t.bottom<e.bottom:t.left>e.left&&t.right<e.right}moveDragElement(t,e={}){const s=t?.touches?t?.touches[0]:t;if(this.isDraggable){const t=this.getDifference({x:s.clientX,y:s.clientY},this.dragArea),e=this.Axis.x?{x:t.x-this.startPosition.x,y:this.startCell.y}:this.Axis.y?{x:this.startCell.x,y:t.y-this.startPosition.y}:null,n={left:s.clientX-this.shiftMouseParent.left,right:s.clientX+this.shiftMouseParent.right,top:s.clientY-this.shiftMouseParent.top,bottom:s.clientY+this.shiftMouseParent.bottom};null!==e&&this.checkAvailablePoints(n,this.cellFrame,this.Axis.y)&&this.setElementPosition(this.dragElement,e)}}watchCrossingList(t){const e=this.findDragElement();this.moveDragElement(t);const s=this.dragDropZone.filter((({item:t})=>this.checkIsCrossing(this.dragElement.getBoundingClientRect(),t.getBoundingClientRect())&&this.dragElement!==t))[0];if(s&&this.isDraggable){if(null!==s.nestedId)return;const t=e.parentId;s.nestedId=e.id,e.parentId=s.id,this.getParentCell(t).nestedId=null}}setDefaultPosition(t=[]){const e=0!==t.length;this.dragElementList.forEach(((s,n)=>{const i=e?t[n]:n;this.setElementPosition(s.item,this.getDistanceRectCoord(this.getParentCell(i).item,s.item))}))}setResizePosition(){this.dragElementList.forEach(((t,e)=>{this.setElementPosition(t.item,this.getDistanceRectCoord(this.getParentCell(t.parentId).item,t.item))}))}setDraggableBorders(t){const e=this.getParentCell().item.getBoundingClientRect();console.log("AAAAAAAAAAAAAA",e),this.shiftMouseParent={left:t.clientX-e.left-10,right:e.right-t.clientX-10,bottom:e.bottom-t.clientY-10,top:t.clientY-e.top-10}}dropListener=t=>{t.preventDefault(),console.log("%c UP LISTENER","font-size:25px; color:red;"),this.isDraggable?this.dropDragElement():this.removeMouseUpListener()};removeMouseUpListener=()=>{this.dragElement.removeEventListener("mouseup",this.dropListener),this.dragElement.removeEventListener("mouseleave",this.dropListener),this.dragArea.removeEventListener("mousemove",this.moveHandler),this.dragArea.removeEventListener("touchmove",this.moveHandler),this.dragArea.removeEventListener("touchcancel",this.dropListener),this.dragArea.removeEventListener("touchend",this.dropListener)};moveHandler=t=>{console.log("%c MOVE LISTENER","font-size:25px; color:red;"),this.getAvailableCells(this.emptyCell.id).includes(this.startParent)?this.watchCrossingList(t):console.log("CANCEL-------------")};startDragElementList(t,e){this.dragElement=e,t.preventDefault();const s=t?.touches?t?.touches[0]:t;this.possibleMoves()?(this.setStartPosition(s),this.dragArea.addEventListener("touchmove",this.moveHandler),this.dragArea.addEventListener("mousemove",this.moveHandler),this.dragElement.addEventListener("mouseleave",this.dropListener,{once:!0}),this.dragElement.addEventListener("touchcancel",this.dropListener,{once:!0}),this.dragElement.addEventListener("touchend",this.dropListener,{once:!0}),this.dragElement.addEventListener("mouseup",this.dropListener,{once:!0})):console.log("NOT POSSIBEL")}callVictory;triggerMouseEvent(t,e){console.log("MOVING");let s=document.createEvent("MouseEvents");s.initEvent(e,!0,!0),t.dispatchEvent(s)}moveSolution(){this.isDraggable=!1;const{parentId:t,id:e,moveTo:s}=this.movesPathList.pop(),n=this.findDragElement(e),i=this.getParentCell(s).item;console.log(t,e,s),console.log(n,i);const o=this.getDistanceRectCoord(i,n.item);this.setElementPosition(n.item,o),this.setSingleTransition(n),this.emptyCell=this.dragDropZone[t],this.dragDropZone[t].nestedId=null,n.item.classList.add(this.transitionListClass),n.item.addEventListener("transitionend",(()=>{0!==this.movesPathList.length&&this.moveSolution(),n.item.classList.remove(this.transitionListClass)}))}movesPathList=[];addMovesPathList=({parentId:t,item:e,id:s})=>{this.movesPathList.push({parentId:t,id:s,moveTo:this.startParent})};getAvailableMoves=t=>{console.log("POSITION",t);const e=this.dragElementList.length,s=Math.sqrt(e),n=[s,-s];return(t+1)%this.row!=0&&n.push(1),t%this.row!=0&&n.push(-1),n.map((e=>(console.log(e+t),e+t))).filter((t=>t>=0&&t<e))};possibleMoves(){const t=this.findDragElement(),e=this.getAvailableMoves(this.emptyCell.id);return console.log("-------------",this.emptyCell.id),this.getParentCell(t.parentId).id,e.includes(t.parentId)}dropDragElement(){this.isDraggable=!1;const t=this.findDragElement(),e=this.getDistanceRectCoord(this.getParentCell(t.parentId).item,this.dragElement);this.setElementPosition(this.dragElement,e),this.setSingleTransition(this.findDragElement()),this.checkSequence(),t.parentId!==this.startParent?(console.log(t),this.emptyCell=this.getParentCell(),this.getParentCell().nestedId=null,this.movesCount++,this.movesCountElement(this.movesCount),this.callVictory(this.isSolved()),this.removeMouseUpListener(),console.log(`%c${this.isSolved()}`,"font-size:25px")):this.removeMouseUpListener()}}document.querySelector("body").innerHTML='\n  <div class="modal"></div>\n  <div class="savedModal">Game Saved</div>\n  <div class="controlBar">\n    <button class="btn controlShuffle">Shuffle</button>\n    \n    <select class="controlSelect" name="frameSize">\n      <option selected value="3">3</option>\n      <option value="4">4</option>\n      <option value="5">5</option>\n      <option value="6">6</option>\n      <option value="7">7</option>\n      <option value="8">8</option></select\n    ><label class="player" for="sound"\n      >Sound<input id="soundCheck" type="checkbox" checked /></label\n    ><button class="btn controlSave">Save</button\n    ><button class="btn controlLoad">Load</button\n    ><button class="btn controlInfo">Info</button>\n  </div>\n  <audio id="myAudio">\n    <source src="./swing-whoosh-110410.mp3" type="audio/ogg" />\n  </audio>\n  <div class="board">\n    <div class="movesCount">Moves 0</div>\n    <div class="timer">\n      <span class="seconds">00:00</span>\n      </div>\n      <button class="btn controlReset">Start/Stop</button>\n  </div>\n  <div class="container"><div class="puzzle__list"></div></div>\n  ';let e=document.querySelector(".seconds");function s(t){e.innerHTML=t}const n=new class{interval=null;constructor(t){this.total=0,this.interval=null,this.callback=t}getIntervalState(){return null!==this.interval}clearCount(){clearInterval(this.interval),this.interval=null,this.total=0;const t=this.getEndTime();this.callback(t)}newTimer=()=>{this.total=0,this.interval=setInterval(this.count.bind(this),1e3),this.count()};fireCount=()=>{this.count(),this.interval=setInterval(this.count.bind(this),1e3),console.log("START")};startCount=()=>{this.interval?(console.log("STOP"),this.stopCount()):this.fireCount()};stopCount(){0!==this.total&&this.total,clearInterval(this.interval),this.interval=null}getTimerValue(){return{minutes:this.show(parseInt(this.total/60)),seconds:this.show(this.total%60)}}count(){const t=this.getEndTime();this.callback(t),++this.total}getEndTime(){return`${this.show(parseInt(this.total/60))}:${this.show(this.total%60)} `}getTotal(){return this.total}setTotal(t){console.log("COUNT TIME ",t),this.total=t}show(t){const e=t+"";return e.length<2?"0"+e:e}}(s),i=(t="",e="")=>`\n    <div class='puzzle__cell data-order=${e}'>\n    ${t}\n    </div>\n  `,o=document.querySelector(".controlSelect"),l=document.querySelector(".controlShuffle"),r=document.querySelector(".controlReset"),a=document.querySelector(".controlSave"),c=document.querySelector(".controlLoad"),d=document.querySelector(".controlInfo"),h=document.querySelector(".movesCount"),g=document.querySelector("#soundCheck"),m=document.getElementById("myAudio"),u=document.querySelector(".modal"),p=document.querySelector(".puzzle__list"),v=document.querySelector(".savedModal");let L=null,f=null;m.playbackRate=1.4,a.addEventListener("click",(()=>{y("")})),c.addEventListener("click",(()=>{I("")}));let E=9;function C(t){let e=t.length;for(;--e>0;){let s=Math.floor(Math.random()*(e+1));[t[s],t[e]]=[t[e],t[s]]}return t}o.addEventListener("change",(t=>{E=t.target.value**2,D(),console.log(E)})),l.addEventListener("click",(t=>{console.log("SHUFFLE"),D(),n.clearCount()})),r.addEventListener("click",(t=>{console.log("RESET"),n.startCount()})),u.addEventListener("click",(()=>{u.classList.remove("activeModal"),M()})),d.addEventListener("click",(t=>{console.log("RUN SOLUTION"),T(!1)}));const S=t=>{let e=0,s=t.length-1;for(let n=0;n<=s;n++)for(let i=n+1;i<=s;i++)t[i]!=s&&t[n]!=s&&t[i]<t[n]&&e++;const n=Math.floor(t.indexOf(s)/Math.sqrt(E));return t.length%2!=0?e%2!=0:(e+n)%2==0},y=t=>{if(null!==L.saveList.length){const t=L.saveList.map((t=>t.parentId));console.log("EMPTY",L.emptyCell,L.movesCount),localStorage.setItem("itemList",JSON.stringify(t)),localStorage.setItem("timer",JSON.stringify(n.getTotal())),localStorage.setItem("moves",JSON.stringify(L.movesCount)),localStorage.setItem("row",JSON.stringify(Math.sqrt(E))),localStorage.setItem("emptyCell",JSON.stringify(L.emptyCell.id)),b()}};function b(t="Game Saved!"){v.innerHTML=t,v.classList.add("active"),v.addEventListener("transitionend",(()=>{v.classList.remove("active")}))}const I=()=>{const t=JSON.parse(localStorage.getItem("itemList"));if(!t)return void b("NO SAVED GAME");const e=JSON.parse(localStorage.getItem("emptyCell")),i=JSON.parse(localStorage.getItem("moves")),l=JSON.parse(localStorage.getItem("timer")),r=JSON.parse(localStorage.getItem("row"));o.value=r,E=r**2,p.classList.add("blinkList"),p.addEventListener("transitionend",(()=>{p.classList.remove("blinkList")})),n.setTotal(l),s(n.getEndTime()),n.stopCount(),console.log(e),D(t,e,i)};let A=0;const P=t=>{A=t,h.innerHTML=`Moves ${t}`},D=(e=[],s=null,o=null)=>{const l=0!==e.length?Array(E).fill(0).map(((t,e)=>e)):function(t){const e=Array(t).fill(0).map(((t,e)=>e));let s=[];for(;;)if(s=C(e),console.log("SOLVABLE WRONG",!S([0,8,1,2,3,4,5,7,6])),!S(s))return f=s,s}(E);console.table(l),p.setAttribute("style",((t=3)=>`grid-template-columns: repeat(${t}, 1fr);\n    grid-template-rows: repeat(${t}, 1fr);font-size:${90/t}px;`)(Math.sqrt(E)));const r=((t=16)=>Array(t).fill(0).map(((t,e)=>i("",e))))(E);var a;r[0]=i([...(a=l,a.map((t=>((t="",e=0)=>`\n    <div class='puzzle__item${t}' data-order=${e}>\n    <p>${e+1}</p>\n    </div>\n  `)("",t))))],0),p.innerHTML=[...r].toString().replaceAll(",","");const c=document.querySelectorAll(".puzzle__item"),d=document.querySelectorAll(".puzzle__cell"),h=t=>{const e=t.find((t=>t.id===E-1));return t.indexOf(e)};console.log("GAME SET");const u=[...c].map(((t,s)=>({item:t,parentId:0!==e.length?e[s]:s,id:Number(t.dataset.order)}))),v=[...d].map(((t,e)=>(u[e]&&u[e].id,{item:t,nestedId:u[e].id,id:e}))),y=0!==e.length?s:h(u);function b(t,e){var s;n.getIntervalState()||(n.fireCount(),console.log("FIIRED")),g.checked&&m.play(),L.startDragElementList(t,e),s=u,console.log(Array.isArray(s)),s.every((t=>(console.log("ON PLACE",t.id===t.parentId),t.id===E.length-1||t.id===t.parentId)))&&(L.resetCount(),T())}L=new t(p,[...v],u),L.movesCountElement=P,o?L.resetCount(o):L.resetCount(),v.at(y).nestedId=null,u[h(u)].item.classList.add("hide"),L.emptyCell=s?v.at(s):v.at(y),console.log("SET EMPTY",L.emptyCell),L.setDefaultPosition(e),L.puzzleRowLength=Math.sqrt(E),L.puzzleLength=E,L.callVictory=M,L.saveGameList(),c.forEach(((t,e)=>{t.addEventListener("mousedown",(e=>{b(e,t)})),t.addEventListener("touchstart",(e=>{b(e,t),console.log("TOUCH FIRED")}))})),window.addEventListener("resize",(function(t){p.clientWidth<1100?(L.setResizePosition(),console.log("LESS")):console.log("more")}))};function T(t=!1){var e;t?(n.stopCount(),u.classList.toggle("activeModal"),u.innerHTML=`\n    <div class='popup'>\n    <p>«Hooray! You solved the puzzle in <b>${n.getEndTime()}</b> and <b>${A}</b> moves!»</p>\n    <p>click anywhere to close</p>\n    </div>\n  `,(t=>{const e=JSON.parse(localStorage.getItem("board"));if(console.log(e),e){const s=[...e,t].sort(((t,e)=>t.total-e.total));console.log(s),localStorage.setItem("board",JSON.stringify(s.slice(0,10)))}else localStorage.setItem("board",JSON.stringify([t]))})({time:n.getEndTime(),count:A,total:n.getTotal()})):(u.classList.toggle("activeModal"),u.innerHTML=`\n    <div class='popup'>\n    <h3>Leader board</h3>\n    <ul class="scoreBoard">\n      ${(0!==(e=(()=>{const t=JSON.parse(localStorage.getItem("board")),e=t?t.sort(((t,e)=>t.total-e.total)):[];return 0!==e.length?e:[]})()).length?e.map(((t,e)=>`\n      <div class='leaderItem'>\n      <span>${e+1}. ${t.time} moves - ${t.count}</span>      \n      </div>\n      `)):["Board is empty"]).join("")}\n    </ul>\n      <p>click anywhere to close</p>\n      </div>\n    `)}function M(t){t&&T(!0)}D()})();
//# sourceMappingURL=scripts.f7b280af846fa35374ef.js.map