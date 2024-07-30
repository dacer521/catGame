const widgetContainer = document.getElementById("widget-container");
const meow = document.getElementById("meow");
meow.volume = 1.0; // Set volume to full
meow.muted = false; // Make sure it's not muted



function buy(store) {
    let bank = parseInt(score.innerHTML, 10);
    let cost = parseInt(store.getAttribute("cost"), 10);

    console.log(`Bank: ${bank}, Cost: ${cost}`); 

    if (bank < cost) return;

    let count = parseInt(store.getAttribute("count"), 10) + 1;
    store.setAttribute("count", count);
    store.children[0].children[1].innerHTML = count;

    let baseReap = parseInt(store.getAttribute("baseReap"), 10);
    let currentReap = parseInt(store.getAttribute("reap"), 10);
    
    let newReap = baseReap * parseInt(store.getAttribute("count"));
    
    store.setAttribute("reap", newReap);

    let widget = widgetContainer.querySelector(`[data-store-id="${store.getAttribute('name')}"]`);
    if (!widget) {
        widget = document.createElement("div");
        widget.classList.add("widget");
        widget.setAttribute("data-store-id", store.getAttribute("name"));
        fillWidget(store, widget);
        widgetContainer.appendChild(widget);

        widget.onclick = () => {
            harvest(widget);
        };

        // Trigger harvest immediately if widget is auto
        if (widget.getAttribute("auto") == 'true') {
            harvest(widget);
        }
    } else {
        widget.setAttribute("reap", newReap);
        widget.querySelector(".count").innerHTML = count;

        // Trigger harvest immediately if widget is auto and not already harvesting
        if (widget.getAttribute("auto") == 'true' && !widget.hasAttribute("harvesting")) {
            harvest(widget);
        }
    }

    let newCost = cost * 1.2;
    store.setAttribute("cost", newCost.toFixed(0));
    store.querySelector("p:nth-child(3)").innerHTML = `${newCost.toFixed(0)} meows`;

    changeScore(-cost);

    meow.play();
}


function harvest(widget) {
    if (widget.hasAttribute("harvesting")) return;
    widget.setAttribute("harvesting", "");

    if (widget.getAttribute("auto") != 'true') {
        changeScore(widget.getAttribute("reap"));
        showPoint(widget);
    }

    setTimeout(() => {
        widget.removeAttribute("harvesting");
        if (widget.getAttribute("auto") == 'true') {
            changeScore(widget.getAttribute("reap"));
            showPoint(widget);
            harvest(widget);
        }
    }, parseFloat(widget.getAttribute("cooldown")) * 1000);
}

function changeScore(amount) {
    score.innerHTML = parseInt(score.innerHTML) + parseInt(amount);

    let bank = parseInt(score.innerHTML);
    for (let store of stores) {
        let cost = parseInt(store.getAttribute("cost"));
        if (bank < cost) {
            store.setAttribute("broke", "");
        } else {
            store.removeAttribute("broke");
        }
    }
}

function showPoint(widget) {
    let number = document.createElement("span");
    number.className = "point";
    number.innerHTML = "+" + widget.getAttribute("reap");
    number.style.left = "50%";
    number.style.top = "50%";
    number.onanimationend = () => {
        widget.removeChild(number);
    }
    widget.appendChild(number);
}

const bgm = document.getElementById("bgm");
window.onload = function() {
    const startButton = document.createElement("button");
    startButton.innerHTML = "Background Music?";
    startButton.onclick = () => {
        bgm.play();
        startButton.style.display = 'none';
    }
    document.body.appendChild(startButton);
}
