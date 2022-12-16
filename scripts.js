import RegisterWorker from './register.js';
const $log = document.querySelector('.log');
const $btn = document.getElementById('save');
let db;
const [date] = getDay().split(',');
const req = window.indexedDB.open('punch',1);
const $message = document.querySelector('.message');
const $close = document.querySelector('.close');

RegisterWorker();

const openAndCloseMessage = () =>{
    $message.classList.toggle('hidden');
}



$close.addEventListener('click',openAndCloseMessage);

req.addEventListener('success',(e)=>{
    db = e.target.result;
    getPunchCurrent(date);
})

req.addEventListener('upgradeneeded',(e)=>{
    db = e.target.result;
    const punch = db.createObjectStore('punch',{autoIncrement:true});
})

req.addEventListener('error',()=>{
    throw new Error('No se pudo abrir la base de datos escrito por el desarrollador');
})

function getDay(){
    const date = new Date();
    return date.toLocaleString();
}

const renderPunch = (punch)=>{
    const $li = document.createElement('LI');
    $li.classList.add('log__item')
    $li.textContent = punch;
    $log.insertAdjacentElement('beforeend',$li);
}


const saveDateAndCounter = (date) =>{
    localStorage.setItem('fecha',(date));
    localStorage.setItem('contador',1);
}

const isAnotherDay = () =>{
    return localStorage.getItem('fecha') !== date;
}

const isSameDay = () =>{
    const localDate = localStorage.getItem('fecha')
    let counter = localStorage.getItem('contador');
    if(localDate && localDate === date){
        if(parseInt(counter) === 2) return false;
        counter++;
        localStorage.setItem('contador',counter);
        return true;
    }
    saveDateAndCounter(date)
    return true;

}

const getPunchCurrent = (currentDay) =>{
    const transaction = db.transaction(['punch'],'readonly').objectStore('punch');
    const req = transaction.openCursor();
    req.addEventListener('success',(e)=>{
        const cursor = e.target.result;
        if(cursor){
            const [fecha] = cursor.value.split(',');
            if(fecha === currentDay){
                const punch = cursor.value;
               renderPunch(punch)
            }
            cursor.continue();
        }
    })
}


const savePunch = (punch) =>{
    console.log(db);
    const transaction = db.transaction('punch','readwrite').objectStore('punch');
    const req = transaction.add(punch)
    req.addEventListener('complete',()=>{
        console.log('Se agrego la hora correctamente');
    })
}


$btn.addEventListener('click',()=>{
    const punch = getDay();
   if(isSameDay()){
        savePunch(punch);
        renderPunch(punch);
   }else{
    openAndCloseMessage();
   }
   
})