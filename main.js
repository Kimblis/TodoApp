//Reikalingi kintamieji ir event listener'iai
const container = document.querySelector('.container');
var inputValue = document.querySelector('.input-task');
var inputDeadline = document.querySelector('.input-deadline');
const add = document.querySelector('.add');
add.addEventListener('click', addHandler);
const sortDeadline = document.getElementById('sort-deadline');
sortDeadline.addEventListener('click', sortByDeadline);
if(window.localStorage.getItem("todos") == undefined){
    var todos = [];
    window.localStorage.setItem("todos", JSON.stringify(todos));
}

var todosPrev = window.localStorage.getItem("todos");
var todos = JSON.parse(todosPrev);

class item{
	constructor(name,deadline){
		this.createItem(name,deadline);
	}
    createItem(name,deadline){
        var itemEntity = document.createElement('div');
        itemEntity.classList.add('item');

    	var inputTask = document.createElement('input');
    	inputTask.type = "text";
    	//inputTask.disabled = true;
    	inputTask.value = name;
        inputTask.classList.add('item_input');
        
        var inputDeadline = document.createElement('input');
    	inputDeadline.type ="text";
    	inputDeadline.disabled = true;
    	inputDeadline.value = deadline;
    	inputDeadline.classList.add('item_input');

    	var checkBox = document.createElement('button');
    	checkBox.classList.add('checkBox');
    	checkBox.innerHTML=('<i class="fas fa-check-square"></i>');
    	checkBox.addEventListener('click', () => this.checkBox(itemEntity, name,deadline));

    	var remove = document.createElement('button');
    	remove.classList.add('remove');
    	remove.innerHTML = "REMOVE";
    	remove.addEventListener('click', () => this.remove(itemEntity, name));

    	container.appendChild(itemEntity);

        itemEntity.appendChild(inputTask);
        itemEntity.appendChild(inputDeadline)
        itemEntity.appendChild(remove);
        itemEntity.appendChild(checkBox);

    }

    remove(itemEntity, name){
        var confirmDelete = confirm("Are you sure you want to delete?");
        if (confirmDelete) {
            itemEntity.parentNode.removeChild(itemEntity);
            let taskIndex = todos.indexOf(name);
            todos.splice(taskIndex, 1);
            window.localStorage.setItem("todos", JSON.stringify(todos));
        }
        else {
            return
        }
    }

    checkBox(itemEntity, name,deadline) {
        itemEntity.parentNode.removeChild(itemEntity);
        let taskIndex = todos.map(function(e) { return e.name; }).indexOf(name);
        todos.splice(taskIndex, 1);
        const completedTodo= {name: name, deadline: 'Done'}
        new item(completedTodo.name,completedTodo.deadline)
        todos.push(completedTodo)
        var completedElement = document.querySelector(".container").lastElementChild.getElementsByTagName('input')[0].classList.add("completed")
        window.localStorage.setItem("todos", JSON.stringify(todos));
    }
}


function addHandler(){
    const deadline = inputDeadline.value.replace('T',' ')
    const time = calcTime(deadline);
    const minutesDiff = time.minutes == 0 ? (60-time.nowMinutes) : 
        (time.minutes- time.nowMinutes < 0 ? (60+parseInt(time.minutes)-time.nowMinutes) : time.minutes-time.nowMinutes);
	if((inputValue.value != "") && (time.hoursDiff >= 0 && minutesDiff >=0)){
        let deadlineCalculated = calcDate(time);
        console.log(deadlineCalculated);
        new item(inputValue.value, deadlineCalculated);
        const newTodo= {name: inputValue.value, deadline: deadlineCalculated}
        console.log(newTodo);
        todos.push(newTodo);
        window.localStorage.setItem("todos", JSON.stringify(todos));
        inputValue.value = "";
        inputValue.focus();
    }
    else{
        alert("Please enter valid values")
    }
}

function calcTime(deadline) {
    const [timeDate, timeHours]= deadline.split(' ');
    const [year, month, day] = timeDate.split('-');
    const [hours, minutes] = timeHours.split(':');
    var [nowTimeDate, nowTimeHours] = new Date().toJSON().slice(0,16).replace('T',' ').split(' ');
    const [nowYear, nowMonth, nowDay] = nowTimeDate.split('-');
    const [nowHours,nowMinutes] = nowTimeHours.split(':');
    const hoursDiff = (year-nowYear)*365*24+(month-nowMonth)*30*24+(day-nowDay)*24+(minutes-nowMinutes <0 ? hours-nowHours-3 : hours-nowHours-2);
    const time = {hoursDiff: hoursDiff, minutes: minutes, nowMinutes: nowMinutes};
    return time
}

function calcDate(time){
    const diff = `${(time.hoursDiff > 24) ? (Math.round((time.hoursDiff/24)) + ' Days' + ' ' + time.hoursDiff%24 + ' Hours') : time.hoursDiff + ' Hours'}`;
    const fullDiff= `${diff}  ${time.minutes == 0 ? (60-time.nowMinutes) : 
        (time.minutes- time.nowMinutes < 0 ? (60+parseInt(time.minutes)-time.nowMinutes) : time.minutes-time.nowMinutes)} minutes`;
    return fullDiff
}

function sortByDeadline(){
    todos.map(todo => { 
        let editedTime = todo.deadline.replace('Days', '').replace('Hours', '').replace('minutes', '')
        let parts = editedTime.split(' ');
        let editedParts=[];
        parts.map(part=> {
            if (part!=""){
                editedParts.push(part)
            }})
        editedParts.map(part=> {
            if (part.length == 3){
                return
            }
        })
    })
}

function renderTasks() {
    for (var v = 0 ; v < todos.length ; v++){
    new item(todos[v].name, todos[v].deadline);
    }
}
