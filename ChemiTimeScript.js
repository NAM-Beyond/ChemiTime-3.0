var INNCount = 0;
var DoseCount = 0;
var TimeCount = 0;
var CurrentSection = 0;
var CurrentRow = 0;
var CurrentColumn = 0;
var Grids = ["", "INNBox", "DoseBox", "TimeBox"];
function Light(ButtonNumber, ButtonFontColor, ButtonBackgroundColor) {
    document.getElementById(ButtonNumber).style.color = ButtonFontColor;
    document.getElementById(ButtonNumber).style.backgroundColor = ButtonBackgroundColor;
}
function NewEntry(ButtonNumber) {
    CurrentSection = Math.floor(ButtonNumber / 10000);
    CurrentRow = Math.floor((ButtonNumber - CurrentSection * 10000) / 100);
    CurrentColumn = ButtonNumber - CurrentSection * 10000 - CurrentRow * 100;
    document.getElementById(ButtonNumber).outerHTML = "";
    let NewEntry = document.createElement("input");
    NewEntry.type = "text";
    NewEntry.id = "NewEntry";
    NewEntry.setAttribute("style", "grid-row: " + CurrentRow + "; grid-column: " + CurrentColumn + ";");
    NewEntry.setAttribute("onkeypress", "NewData(event)");
    document.getElementById(Grids[CurrentSection]).appendChild(NewEntry);
}
function NewData(event) {
    let y = event.which || event.keyCode;
    if (y == 13) {
        let NewData = document.getElementById("NewEntry").value;
        document.getElementById("NewEntry").outerHTML = "";
        let NewLine = document.createElement("div");
        NewLine.innerHTML = NewData;
        NewLine.style.height = 25 + "px";
        NewLine.style.lineHeight = 25 + "px";
        NewLine.style.marginTop = 5 + "px";
        NewLine.style.marginBottom = 5 + "px";
        document.getElementById(Grids[CurrentSection]).appendChild(NewLine);
        if (CurrentSection == 1) {
            CurrentRow += 1;
            if (CurrentRow < 10) {CurrentRow = "0" + CurrentRow;}
            CurrentColumn = "0" + CurrentColumn;
            ButtonNumber = CurrentSection.toString() + CurrentRow.toString() + CurrentColumn;
            NewButton(CurrentSection, CurrentColumn, CurrentRow, ButtonNumber);
            CurrentSection += 1; 
            ButtonNumber = CurrentSection + CurrentRow + CurrentColumn;
            NewButton(CurrentSection, CurrentColumn, CurrentRow, ButtonNumber);
        }
    }
}
function NewButton(Section, Column, Row, ButtonId) {
    let NewButton = document.createElement("button");
    NewButton.setAttribute("style", " grid-row: " + Row + "; grid-column: " + Column + ";");
    NewButton.id = ButtonId;
    NewButton.className = "Buttons";
    NewButton.setAttribute("onclick", "NewEntry(" + ButtonId + ")");
    NewButton.setAttribute("ontouchstart", "NewEntry(" + ButtonId + ")");
    NewButton.setAttribute("onmouseover", "Light(" + ButtonId + ", '#FFFFFF', '#0099FF')");
    NewButton.setAttribute("onmouseout", "Light(" + ButtonId + ", '#00000040', '#FFFFFF')");
    NewButton.innerHTML = "+";
    document.getElementById(Grids[Section]).appendChild(NewButton);
}