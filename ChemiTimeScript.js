var INNCount = 0;
var TimeCount = 0;
var DoseCount = 0;
var ButtonCount = 3;
function Light(x,y,z) {
    document.getElementById("button" + x).style.color = y;
    document.getElementById("button" + x).style.backgroundColor = z;
}
function NewData(x) {
    if (x == 100) {
        INNCount += 1;
        document.getElementById("button" + x).outerHTML = "";
        let NewData = document.createElement("input");
        NewData.type = "text";
        NewData.id = "NewINN";
        NewData.setAttribute("style", "grid-column: 1 / 1; grid-row: " + INNCount + 1 + ";");
        NewData.setAttribute("onkeypress", "AddData(event)");
        document.getElementById("INNBox").appendChild(NewData);
    }
}
function AddData(event) {
    let x = event.which || event.keyCode;
    if (x == 13) {
        let NewINN = document.getElementById("NewINN").value;
        document.getElementById("NewINN").outerHTML = "";
        let NewLine = document.createElement("div");
        NewLine.innerHTML = NewINN;
        document.getElementById("INNBox").appendChild(NewLine);
        let NewButton = document.createElement("button");
        NewButton.setAttribute("style", "grid-column: 1 / 1; grid-row: " + INNCount + 1 + ";");
        NewButton.id = "button100";
        NewButton.className = "buttons";
        NewButton.setAttribute("onclick", "NewData(100)");
        NewButton.setAttribute("ontouchstart", "NewData(100)");
        NewButton.setAttribute("onmouseover", "Light(100,'#FFFFFF','#0099FF')");
        NewButton.setAttribute("onmouseout", "Light(100,'#00000020','#FFFFFF')");
        NewButton.innerHTML = "+";
        document.getElementById("INNBox").appendChild(NewButton);
    }
}