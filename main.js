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

        this.interval = null;
        this.initialSeconds = 0;
        this.remainingSeconds = 0;

        this.el.control.addEventListener("click", () => {
            if (this.interval === null) {
                this.start();
            } else {
                this.stop();
            }
        });

        this.el.reset.addEventListener("click", () => {
            this.stop();
            this.remainingSeconds = this.initialSeconds;
            this.updateInterfaceTime();
        });

        this.el.display.addEventListener("click", () => {
            this.el.input.style.display = "block";
            this.el.input.focus();
        });

        this.el.input.addEventListener("input", () => {
            if (this.el.input.value[0] == "0") {
                this.el.input.value = this.el.input.value.slice(1,7)
            } else {
                this.el.input.value = this.el.input.value.slice(0,6)
            }
            var value = this.el.input.value.padStart(6,"0");
            this.el.input.value = value;
            this.el.seconds.textContent = value.slice(4,6);
            this.el.minutes.textContent = value.slice(2, 4);
            this.el.hours.textContent = value.slice(0,2);
            console.log(value)
        });

        this.el.input.addEventListener("change", () => {
            this.stop();
            var value = this.el.input.value
            this.remainingSeconds = Number(value.slice(0, 2) * 3600) + Number(value.slice(2, 4) * 60) + Number(value.slice(4,6));
            this.initialSeconds = this.remainingSeconds;
            console.log(this.remainingSeconds)
            this.updateInterfaceTime();
            this.el.input.value = ""
            this.el.input.style.display = "none";
        });
    }

    updateInterfaceTime() {
        const hours = Math.floor(this.remainingSeconds / 3600);
        const minutes = Math.floor((this.remainingSeconds - hours * 3600)/ 60);
        const seconds = this.remainingSeconds % 60;
    
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
        if (this.remainingSeconds === 0) return;
    
        this.interval = setInterval(() => {
            this.remainingSeconds--;
            this.updateInterfaceTime();
    
            if (this.remainingSeconds === 0) {
            this.stop();
            }
        }, 1000);
    
        this.updateInterfaceControls();
    }
    
    stop() {
        clearInterval(this.interval);
    
        this.interval = null;
    
        this.updateInterfaceControls();
    }

    static getHTML() {
        return `
        <input type="number" name="time-input" id="time-input" style="opacity: 0; position: absolute;" class="time-input">
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

new Timer(document.querySelector(".timer"));