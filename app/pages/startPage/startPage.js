function openNewGame(){
    try {
        // Validate the target URL string
        const target = "../gamePage/gamePage.html";
        if (typeof target !== "string" || !target) {
            throw new Error("Invalid URL");
        }
        window.location.href = target;
    } catch (err) {
        console.error("Navigation failed:", err);
    }
}

function loadGameData () {
    // use info from saved data to populate game
    var input = document.createElement('input');
    input.type = 'file'

    input.onchange = e => { 
        var file = e.target.files[0]; 

        var reader = new FileReader();
        reader.readAsText(file,'UTF-8');

        reader.onload = readerEvent => {
            var content = readerEvent.target.result;

            var saveData = content;
            localStorage.setItem("saveData", saveData)
            openNewGame();
        }
    }

    input.click();

            
}