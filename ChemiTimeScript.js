var MainList = [[],[],[]];
var CurrentSection = 0;
var CurrentRow = 0;
var CurrentColumn = 0;
var Grids = ["INNBox", "DoseBox", "TimeBox"];
function Light(ButtonLocation, ButtonFontColor, ButtonBackgroundColor) {
    document.getElementById(ButtonLocation).style.color = ButtonFontColor;
    document.getElementById(ButtonLocation).style.backgroundColor = ButtonBackgroundColor;
}
function AddInputField(ButtonLocation) {
    CurrentSection = Math.floor(ButtonLocation / 10000);
    CurrentRow = Math.floor((ButtonLocation - CurrentSection * 10000) / 100);
    CurrentColumn = ButtonLocation - CurrentSection * 10000 - CurrentRow * 100;
    document.getElementById(ButtonLocation).outerHTML = "";
    NewField = document.createElement("input");
    NewField.type = "text";
    NewField.id = ButtonLocation;
    NewField.setAttribute("style", "grid-row: " + CurrentRow + "; grid-column: " + CurrentColumn + ";");
    NewField.setAttribute("onkeypress", "KeyPressed(event, " + ButtonLocation + ")");
    document.getElementById(Grids[CurrentSection - 1]).appendChild(NewField);
}
function KeyPressed(event, InputLocation) {
    y = event.which || event.keyCode;
    if (y == 13) {
        AddData(InputLocation);
    }
}
function AddData(InputLocation) {
    NewValue = document.getElementById(InputLocation).value;
    MainList[CurrentSection - 1].push([InputLocation, NewValue]);
    if (CurrentSection == 1) {
        document.getElementById(InputLocation).outerHTML = "";
        LocationCorrection();
        AddLine(1, CurrentRow, CurrentColumn, NewValue);
        CurrentRow = parseInt(CurrentRow) + 1;
        LocationCorrection();
        AddButton(1, CurrentRow, CurrentColumn);
    }
    if (CurrentSection == 3) {
        MainList[2].sort();
        document.getElementById("TimeBox").innerHTML = "";
        AddButton(3, "01", "01");
        CurrentColumn = 1;
        for (x = 0; x < MainList[2].length; x++) {
            CurrentColumn = parseInt(CurrentColumn) + 1;
            LocationCorrection();
            AddLine(3, CurrentRow, CurrentColumn, MainList[2][x][1]);
            CurrentColumn = parseInt(CurrentColumn) + 1;
            LocationCorrection();
            AddButton(3, CurrentRow, CurrentColumn);
        }
    }
}
function LocationCorrection() {
    if (parseInt(CurrentRow) < 10) {
        CurrentRow = "0" + parseInt(CurrentRow);
    }
    if (parseInt(CurrentColumn) < 10) {
        CurrentColumn = "0" + parseInt(CurrentColumn);
    }
}
function AddLine(Section, Row, Column, Value) {
    NewData = document.createElement("div");
    NewData.innerHTML = Value;
    LineLocation = Section.toString() + Row.toString() + Column.toString();
    NewData.id = LineLocation;
    NewData.setAttribute("style", "grid-row: " + Row + "; grid-column: " + Column + ";");
    document.getElementById(Grids[Section - 1]).appendChild(NewData);
}
function AddButton(Section, Row, Column) {
    NewButton = document.createElement("button");
    ButtonId = Section.toString() + Row.toString() + Column.toString();
    NewButton.id = ButtonId;
    NewButton.setAttribute("style", " grid-row: " + Row + "; grid-column: " + Column + ";");
    NewButton.setAttribute("onclick", "AddInputField(" + ButtonId + ")");
    NewButton.setAttribute("ontouchstart", "AddInputField(" + ButtonId + ")");
    NewButton.setAttribute("onmouseover", "Light(" + ButtonId + ", '#FFFFFF', '#0099FF')");
    NewButton.setAttribute("onmouseout", "Light(" + ButtonId + ", '#00000040', '#FFFFFF')");
    NewButton.innerHTML = "+";
    document.getElementById(Grids[Section - 1]).appendChild(NewButton);
}