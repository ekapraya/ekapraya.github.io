class Timer {
    constructor(root) {
        root.innerHTML = Timer.getHTML();
    
        this.el = {
            hours: root.querySelector(".hours"),
            minutes: root.querySelector(".minutes"),
            seconds: root.querySelector(".seconds"),
            control: root.querySelector(".pause-resume-button"),
            reset: root.querySelector(".reset-button"),
            display: root.querySelector(".time-display"),
            input: root.querySelector(".time-input")
        };
        this.ringtone = new Audio("./assets/alarm-clock.mp3")
        this.interval = null;
        this.initialSeconds = 0;
        this.w = undefined;

        this.el.control.addEventListener("click", () => {
            this.ringtone.pause()
            this.el.display.style.animationName = "none";

            if (this.interval === null) {
                this.start();
            } else {
                this.stop();
            }
        });

        this.el.reset.addEventListener("click", () => {
            this.ringtone.pause();
            this.el.display.style.animationName = "none";
            this.stop();
            remainingSeconds = this.initialSeconds;
            this.updateInterfaceTime();
        });

        this.el.display.addEventListener("click", () => {
            this.stop();
            if (this.el.display.style.animationName == "blinking"){
                this.ringtone.pause();
                this.el.display.style.animationName = "none";
                return;
            }
            console.log(this.el.input.style.display)
            if (this.el.input.style.display !== "none") {
                this.stop();
                this.el.control.style.display = "block";
                this.el.reset.style.display = "block";
                var value = this.el.input.value
                remainingSeconds = Number(value.slice(0, 2) * 3600) + Number(value.slice(2, 4) * 60) + Number(value.slice(4,6));
                this.initialSeconds = remainingSeconds;
                this.updateInterfaceTime();
                this.el.input.style.display = "none";
                console.log("print")
            }else{
                this.el.control.style.display = "none";
                this.el.reset.style.display = "none";
                this.el.input.style.display = "block";
                this.el.seconds.textContent = "00";
                this.el.minutes.textContent = "00";
                this.el.hours.textContent = "00";
                this.el.input.focus();
                this.el.input.value = ""
                console.log("lo")
            }
        });

        this.el.input.addEventListener("input", () => {
            if (this.el.input.value[0] == "0") {
                this.el.input.value = this.el.input.value.slice(1,7)
            } else {
                this.el.input.value = this.el.input.value.slice(0,6)
            }
            var value = this.el.input.value.padStart(6,"0");
            this.el.input.value = value;
            console.log(value)
            this.el.seconds.textContent = value.slice(4,6);
            this.el.minutes.textContent = value.slice(2, 4);
            this.el.hours.textContent = value.slice(0,2);
        });

        this.el.input.addEventListener("change", () => {
            this.stop();
            this.el.control.style.display = "block";
            this.el.reset.style.display = "block";
            var value = this.el.input.value
            console.log(value)
            remainingSeconds = Number(value.slice(0, 2) * 3600) + Number(value.slice(2, 4) * 60) + Number(value.slice(4,6));
            this.initialSeconds = remainingSeconds;
            this.updateInterfaceTime();
            this.el.input.style.display = "none";
        });

        this.el.input.addEventListener("blur", () => {
            this.stop();
            this.el.control.style.display = "block";
            this.el.reset.style.display = "block";
            var value = this.el.input.value
            remainingSeconds = Number(value.slice(0, 2) * 3600) + Number(value.slice(2, 4) * 60) + Number(value.slice(4,6));
            this.initialSeconds = remainingSeconds;
            this.updateInterfaceTime();
            this.el.input.style.display = "none";
        })
    }

    updateInterfaceTime() {
        const hours = Math.floor(remainingSeconds / 3600);
        const minutes = Math.floor((remainingSeconds - hours * 3600)/ 60);
        const seconds = remainingSeconds % 60;
    
        this.el.hours.textContent = hours.toString().padStart(2, "0");
        this.el.minutes.textContent = minutes.toString().padStart(2, "0");
        this.el.seconds.textContent = seconds.toString().padStart(2, "0");
    }

    updateInterfaceControls() {
        if (this.interval === null) {
            this.el.control.innerHTML = `<span class="material-symbols-rounded">play_arrow</span>`;
            this.el.control.classList.add("timer-start");
            this.el.control.classList.remove("timer-stop");
        } else {
            this.el.control.innerHTML = `<span class="material-symbols-rounded">pause</span>`;
            this.el.control.classList.add("timer-stop");
            this.el.control.classList.remove("timer-start");
        }
    }

    start() {
        if (remainingSeconds === 0) return;
        if (typeof(Worker) !== "undefined") {
            if (typeof(this.w) == "undefined") {
                this.w = new Worker("bg_timer.js");
            }
            this.w.onmessage = function(event) {
                console.log("kiw kiw")
                remainingSeconds--
            };
        } else {
            document.getElementById("result").innerHTML = "Sorry! No Web Worker support.";
        }
    
        this.interval = setInterval(() => {
            this.updateInterfaceTime();
    
            if (remainingSeconds === 0) {
                if (typeof(Storage) !== "undefined") {
                    var date_id = Number(currentYear + String(months[currentMonth][3] + currentDate))
                    if (localStorage.getItem("ld") - date_id < 0) {
                        localStorage.setItem("s", Number(localStorage.getItem("s")) + 1)
                    } else if (localStorage.getItem("ld") - date_id > 0){
                        localStorage.setItem("s", 0)
                    }
                    localStorage.setItem("ld", date_id)
                    
                    localStorage.setItem("ts", Number(localStorage.getItem("ts")) + Number(this.initialSeconds))
                }
                display_time_spent()
                this.ringtone.currentTime = 0;
                this.ringtone.play();
                this.ringtone.loop = true;
                this.el.display.style.animationName = "blinking";
                this.el.display.style.animationDuration = "1s";
                this.el.display.style.animationIterationCount = "infinite";
                this.stop();
            }
        }, 1000);
    
        this.updateInterfaceControls();
    }
    
    stop() {
        clearInterval(this.interval);

        if (typeof(this.w) != "undefined") { 
            this.w.terminate();
            this.w = undefined;
        }
        
        this.interval = null;
    
        this.updateInterfaceControls();
    }

    static getHTML() {
        return `
        <input type="number" name="time-input" id="time-input" style="opacity: 0; position: absolute; display: none" class="time-input">
		<button class="time-display">
			<span class="hours">00</span>
			<span>:</span>
			<span class="minutes">00</span>
			<span>:</span>
			<span class="seconds">00</span>
		</button>
		<button class="pause-resume-button"><span class="material-symbols-rounded">pause</span></button>
		<button class="reset-button"><span class="material-symbols-rounded">timer</span></button>`;
    
    }
}


function display_time_spent(){
    var time_spent_diplay = document.querySelector(".time-spent-display");
    var streak_dislay = document.querySelector(".streak-display")
    if (typeof(Storage) !== "undefined") {
        var time = localStorage.getItem("ts");
        var hours = Math.floor(time/3600);
        var minutes = Math.floor((time - hours*3600)/60);
        var seconds = time%60;
        time_spent_diplay.textContent = String(hours) + "h " + String(minutes) + "m " + String(seconds) + "s";
        streak_dislay.textContent = localStorage.getItem("s") + " day(s)";
    } else {
        time_spent_diplay.textContent = "no data";
    }

}

const months = [[31, 0, "January", 0], [28, 3, "February", 31], [31, 3, "March", 59], [30, 6, "April", 90], [31,1, "May", 120], [30, 4, "June", 151], [31, 6, "July", 181], [31, 2, "August", 212], [30, 5, "September", 243], [31, 0, "October", 273], [30,3, "November", 304], [31,5, "December", 334]]
const d = new Date();
const currentDay = d.getDay();
const currentDate = d.getDate()
const currentMonth = d.getMonth();
const currentYear = d.getFullYear();

var remainingSeconds = 0;
var displayed_month = currentMonth;

function calendar_update(m) {
    for (var i = 0; i<42; i++) {
        var day = document.querySelector(".m" + String(i+1))
        day.textContent = 0
        day.style.opacity = "0"
        day.style.cursor = "default"
    }
    document.querySelector(".month").textContent = months[m][2];
    var i = 1;
    while (i <= months[m][0]) {
        var day = document.querySelector(".m" + String(i + months[m][1]));
        var note_value = localStorage.getItem(String(i + months[m][3]) + currentYear)
        if (note_value === null || note_value === "") {
            day.textContent = i
        } else {
            day.textContent = "*" + i + "*"
        }
        
        day.style.opacity = "100"
        day.innerHTML += '' //remove all event listener
        day.addEventListener("click" , (e) => {
            show_note(Number(e.target.className.substring(1)) - months[m][1] + months[m][3])
        })
        day.style.cursor = "pointer"
        i++;
    }
}
function next_month() {
    displayed_month++;
    if (displayed_month>11){
        displayed_month=11;
        return;
    }
    calendar_update(displayed_month);
}
function prev_month() {
    displayed_month--;
    if (displayed_month<0){
        displayed_month=0;
        return;
    }
    calendar_update(displayed_month);
}

function show_tutorial() {
    document.querySelector(".tutorial-wrapper").style.display = "flex"
}

function close_tutorial() {
    document.querySelector(".tutorial-wrapper").style.display = "none"
}

function show_note(n) {
    var note_display_wrapper = document.querySelector(".note-display-wrapper");
    var note_display_text = document.querySelector(".note-display-text");
    note_display_wrapper.style.display = "flex";
    var note = localStorage.getItem(String(n)+String(currentYear));
    if (note === null || note === "") {
        note_display_text.style.color = "#c0c0c0"
        note_display_text.textContent = "nothing to see here";
    } else {
        note_display_text.style.color = "#000000"
        note_display_text.textContent = note;
    }
}

function close_note() {
    document.querySelector(".note-display-wrapper").style.display = "none"
}

function submit_note() {
    var input_el = document.querySelector(".note-input");
    localStorage.setItem(String(months[currentMonth][3] + currentDate) + currentYear, input_el.value);
    calendar_update(displayed_month)
}

if (localStorage.getItem("ld") === null) {
    console.log("null")
    localStorage.setItem("s", 0)
    localStorage.setItem("ts", 0)
}

show_tutorial()
calendar_update(displayed_month)
new Timer(document.querySelector(".timer"));
display_time_spent()