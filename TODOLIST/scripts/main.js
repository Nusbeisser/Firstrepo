// SPOLSZCZENIE WYŚWIETLANIA DATY                        ##############
const DayName = ["Niedziela","Poniedziałek","Wtorek","Środa","Czwartek","Piątek","Sobota"]
const MonthName = ["stycznia ","lutego ","marca ","kwietnia ","maja ","czerwca ","lipca ","sierpnia ","września ","października ","listopada ","grudnia "]

function getDateStr() {
    var Today = new Date()
    var WeekDay = Today.getDay()
    var Month = Today.getMonth()
    var Day = Today.getDate()
    var Year = Today.getFullYear()
    if(Year <= 99)
        Year += 1900
    return DayName[WeekDay] + "," + " " + Day + " " + MonthName[Month] + "" + Year
}
// SPOLSZCZENIE WYŚWIETLANIA DATY                        ##############


let draggableDivStatus = false;        // status okienka z dniem otwarte/zamknięte true/false
const date = new Date();

// przeładowanie od nowa eventlistenera przy zmianie miesiąca, dodanie na nowo do każdego dnia eventu na klik
function selectorReload(){
 for (let i = 0; i < daysSelector.length; i++) {
     daysSelector[i].addEventListener('click',() => {dayOpen(event.target.textContent);})
 }
}


let actualAllHolder;            //miejsce do przechowywania klucza do mapy z dniami
let generalMap = new Map ([]);  // mapa z dniami



// cała funkcja pisząca kalendarz
function renderCalendar() {

date.setDate(1);

const months = [
  "Styczeń","Luty","Marzec","Kwiecień","Maj","Czerwiec","Lipiec","Sierpień","Wrzesień","Październik","Listopad","Grudzień",]

const monthDays = document.querySelector('.days') //lista dni
const lastDay = new Date(date.getFullYear(),date.getMonth() + 1, 0).getDate(); //ostatni dzień miesiąca

const prevLastDay = new Date(date.getFullYear(),date.getMonth(), 0).getDate();
const firstDayIndex = date.getDay();

const lastDayIndex = new Date(date.getFullYear(),date.getMonth() + 1, 0).getDay();
const nextDays = 7 - lastDayIndex - 1;
const yearToDate = date.getYear()+1900;
document.querySelector(".date h1").innerHTML =  months[date.getMonth()] +" "+ yearToDate;
document.querySelector('.date p').innerHTML = getDateStr();



let days ="";
// wyświetlanie dni poprzedniego miecha
for (let x=firstDayIndex; x>1; x--) {
  days += `<div class="prev-date">${prevLastDay - x + 2}</div>`;
}
// wyświetlanie dni aktualnego miecha
for (let i = 1; i <= lastDay; i++) {
  if(i === new Date().getDate() && date.getMonth() === new Date().getMonth()) {
  days += `<div class="today days1">${i}</div>`;
}
  else {
  days += `<div class="days1">${i}</div>`;
}
  monthDays.innerHTML = days;
}
// wyświetlanie dni nastęnego miecha
for (let j = 1; j <= nextDays+1; j++) {
  days += `<div class="next-date">${j}</div>`
  monthDays.innerHTML = days;
}
daysSelector = document.querySelectorAll(".days1");
selectorReload();

}


// POPRZEDNI I NASTĘPNY MIESIĄC OBSŁUGA PRZYCISKÓW
document.querySelector(`.prev`).addEventListener('click',() => { date.setMonth(date.getMonth() -1 ); renderCalendar();});
document.querySelector(`.next`).addEventListener('click',() => { date.setMonth(date.getMonth() +1 ); renderCalendar();});

// wywołanie FUNKCJi PISZĄCEJ KALENDARZ
renderCalendar();

// dodawanie zadań enterem
document.querySelector('#activityInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      addActivity();
    }
});

// nasłuchiwanie na kliknięcie na zamknięcie okienka dnia
document.querySelector(`#draggableDivClose`).addEventListener('click',() => {dayClose();})

// nasłuchuiwanie na kliknięcie na obszar poza okienkiem dnia i zamknięcie
document.body.addEventListener('click', function(e) {
    if (!e.target.classList.contains('dayWindow') && !e.target.classList.contains('dayOn')) {
    clickClose()
    }
    return

});
// funkcja zamykająca okienko z dniem po kliknięciu gdziekolwiek poza okienkiem z dniem wywołana listenerem wyżej
function clickClose() {
  if (draggableDivStatus == true) {
    dayClose();
  }
}


function undefinedMap() {
  localStorage.generalMap = (JSON.stringify(Array.from(generalMap.entries())))
  dayOpen()
}


// pojawianie się okienka z dniem po kliknieciu na kalendarzu na danym dniu
function dayOpen(zawartoscdiva) {
  if (localStorage.generalMap == undefined) {undefinedMap()}


  generalMap =  new Map(JSON.parse(localStorage.generalMap));

  let newValue = zawartoscdiva;
  newValue = newValue * 1;
  const header = document.getElementById("dayDate");
  const Today = date
  let WeekDay = Today.getDay()
  const Month = Today.getMonth()
  const Day = Today.getDate()

  if (WeekDay+newValue-1 > 6 && WeekDay+newValue-1 <= 13) {
    WeekDay = WeekDay - 7
  }
  else if (WeekDay+newValue-1 > 13 && WeekDay+newValue-1 < 21) {
    WeekDay = WeekDay - 14
  }
  else if (WeekDay+newValue-1 >= 21 && WeekDay+newValue-1 <= 27) {
    WeekDay = WeekDay - 21
  }
  else if (WeekDay+newValue-1 > 27 && WeekDay+newValue-1 <= 33) {
    WeekDay = WeekDay - 28
  }
  else if (WeekDay+newValue-1 > 33 && WeekDay+newValue-1 < 40) {
    WeekDay = WeekDay - 35
  }

  let Year = Today.getFullYear()
  if(Year <= 99)
      Year += 1900
  const finallyDate =  DayName[WeekDay+newValue-1] + "," + " " + newValue + " " + MonthName[Month] + "" + Year
    header.innerHTML = finallyDate;

const yearHolder = date.getYear()+1900+"";
const monthHolder = Month+1+"";
const dayHolder = newValue+"";
const allHolder = yearHolder+monthHolder+dayHolder+"";

const activityList = document.querySelector('#draggableDivActivs');
// wczytywanie wartości z mapy jeśli istnieją pod danym kluczem, jeśli nie to tworzę tablicę o danym kluczu
if (generalMap.get(allHolder+"") == undefined) {
  console.log("Tworzę mapę o danym kluczu")
  let arrayHolder = window["array"+allHolder] = new Array();
  generalMap.set(allHolder,arrayHolder)

} else {
    if (generalMap.get(allHolder+"").length !== 0) {
  let myArray = generalMap.get(allHolder+"")
  let copyArray = [...myArray];
  copyArray.reverse();
  iterator = copyArray.length
  for (i=0; i<iterator; i++) {
  activityList.innerHTML += copyArray.pop()
}

}
  else {console.log("tablica pusta");}
}

  document.getElementById("draggableDiv").classList.add("dayWindow");
  document.getElementById("draggableDiv").classList.remove("dayWindowOff");
  setTimeout(function() {draggableDivStatus = true;}, 100);

actualAllHolder = allHolder;
activityReload()
}


// zamykanie okienka z dniem po kliknieciu na x
function dayClose() {
  document.getElementById("draggableDiv").classList.remove("dayWindow");
  document.getElementById("draggableDiv").classList.add("dayWindowOff");
  document.getElementById('activityInput').value = "";
  const activityList = document.querySelector('#draggableDivActivs');
  activityList.innerHTML="";
  draggableDivStatus = false;
}





// dodawanie zadań
function addActivity() {
  const activityValue = document.getElementById('activityInput');
  if (activityValue.value == "") {alert("Wpisz zadanie")}
  else {
  const activityList = document.querySelector('#draggableDivActivs');
  const activity = `<div class="dayOn oneValue">${activityValue.value}<div id="deleteActivity" class="dayOn"><i class="icon-trash dayOn"></i></div></div><div style="clear:both;"></div>`;
  const lista = generalMap.get(actualAllHolder)
  lista.push(activity);
  activityList.innerHTML += activity;
  activityReload()
  document.getElementById('activityInput').value = "";
  localStorage.generalMap = (JSON.stringify(Array.from(generalMap.entries())))
}
}
// przeładowanie listenera
function activityReload(){
 let activitySelector = document.querySelectorAll('#deleteActivity')
 for (let i = 0; i < activitySelector.length; i++) {
     activitySelector[i].addEventListener('click',() => {deleteActivity(event.target);})
 }
}

// usuwanie jednej aktywności
function deleteActivity(e) {
  let deletingDiv = e.parentNode.parentNode.outerHTML //wartośc która aktualnie usuwam
  console.log(deletingDiv)
  e.parentNode.parentNode.remove();
  let array = generalMap.get(actualAllHolder);
  let arrayv2 = [];
  let arrayv2length
  let deletedSign = false;
  do  {                 //
    let divFromArray = array.pop()
    const occur = divFromArray.indexOf(deletingDiv)
    console.log(occur)
    if (occur === 0) {
      deletedSign = true;
    }
    else {arrayv2.push(divFromArray);
    arrayv2length=arrayv2.length}
  }
  while (deletedSign == false)
  for (i=0; i<arrayv2length;i++){
  array.push(arrayv2.pop())
}
  localStorage.generalMap = (JSON.stringify(Array.from(generalMap.entries())))
}


// przesuwanie elementu draggableDiv
dragElement(document.getElementById("draggableDiv"));

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "Header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "Header").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}
