class Timer {
    constructor(root) {
        root.innerHTML = Timer.getHTML();
    
        this.el = {
            hours: root.querySelector(".hours"),
            minutes: root.querySelector(".minutes"),
            seconds: root.querySelector(".seconds"),
            control: root.querySelector(".pause-resume-button"),
            reset: root.querySelector(".reset-button")
        };

        this.interval = null;
        this.remainingSeconds = 0;

        this.el.control.addEventListener("click", () => {
            if (this.interval === null) {
                this.start();
            } else {
                this.stop();
            }
        });

        this.el.reset.addEventListener("click", () => {
            const inputMinutes = prompt("Enter number of minutes:");
      
            if (inputMinutes < 60) {
                this.stop();
                this.remainingSeconds = inputMinutes * 60;
                this.updateInterfaceTime();
            }
        });
    }

    updateInterfaceTime() {
        const minutes = Math.floor(this.remainingSeconds / 60);
        const seconds = this.remainingSeconds % 60;
    
        this.el.minutes.textContent = minutes.toString().padStart(2, "0");
        this.el.seconds.textContent = seconds.toString().padStart(2, "0");
    }

    updateInterfaceControls() {
        if (this.interval === null) {
            this.el.control.innerHTML = `<span class="material-symbols-rounded">play_arrow</span>`;
            this.el.control.classList.add("timer__btn--start");
            this.el.control.classList.remove("timer__btn--stop");
        } else {
            this.el.control.innerHTML = `<span class="material-symbols-rounded">pause</span>`;
            this.el.control.classList.add("timer__btn--stop");
            this.el.control.classList.remove("timer__btn--start");
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