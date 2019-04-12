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
function AddData(InputLocation) {
    NewValue = document.getElementById(InputLocation).value;
    MainList[CurrentSection - 1].push([InputLocation, NewValue]);
    document.getElementById(InputLocation).outerHTML = "";
    for (x = 0; x < document.getElementById(Grids[CurrentSection - 1]).childNodes.length; x++) {
        if (document.getElementById(Grids[CurrentSection - 1]).childNodes[x].nodeName == "#text") {
            document.getElementById(Grids[CurrentSection - 1]).removeChild(document.getElementById(Grids[CurrentSection - 1]).childNodes[x]);
        }
    }
    if (CurrentSection == 1) {
        AddLine(1, (CurrentRow < 10 ? "0" + CurrentRow : CurrentRow), "01", "01", NewValue);
        AddButton(1, (CurrentRow + 1 < 10 ? "0" + (CurrentRow + 1) : (CurrentRow + 1)), "01", "01");
        FirstEmptyField = document.createElement("div");
        FirstEmptyField.setAttribute("style", "grid-row: " + CurrentRow + "; grid-column: " + 1 + "/" + 4 + ";");
        FirstEmptyField.innerHTML = "&nbsp;";
        document.getElementById("DoseBox").appendChild(FirstEmptyField);
        SecondEmptyField = document.createElement("div");
        SecondEmptyField.setAttribute("style", "grid-row: " + CurrentRow + "; grid-column: " + (document.getElementById("TimeBox").childNodes.length * 2 - 2) + "/" + (document.getElementById("TimeBox").childNodes.length * 2 + 1) + ";");
        SecondEmptyField.innerHTML = "&nbsp;";
        document.getElementById("DoseBox").appendChild(SecondEmptyField);
    }
    if (CurrentSection == 3) {
        MainList[2].sort();
        AddButton(3, "01", (CurrentColumn < 10 ? "0" + CurrentColumn : CurrentColumn), (CurrentColumn < 10 ? "0" + CurrentColumn : CurrentColumn));
        GridCorrection(3, "01", CurrentColumn + 1);
        AddLine(3, "01", (CurrentColumn + 1 < 10 ? "0"  + (CurrentColumn + 1) : CurrentColumn + 1), (CurrentColumn + 1 < 10 ? "0"  + (CurrentColumn + 1) : CurrentColumn + 1), NewValue);
        AddButton(3, "01", (CurrentColumn + 2 < 10 ? "0" + (CurrentColumn + 2) : CurrentColumn + 2), CurrentColumn + 2 < 10 ? "0" + (CurrentColumn + 2) : CurrentColumn + 2);
    }
    if (CurrentSection == 2) {
        AddLine(2, (CurrentRow < 10 ? "0" + CurrentRow : CurrentRow), (CurrentColumn < 10 ? "0" + CurrentColumn : CurrentColumn), (CurrentColumn < 10 ? "0" + CurrentColumn : CurrentColumn), NewValue);
    }
}
function AddLine(Section, Row, DebutColumn, EndColumn, Value) {
    NewLine = document.createElement("div");
    NewLine.id = Section.toString() + Row.toString() + DebutColumn.toString();
    NewLine.setAttribute("style", "grid-row: " + Row + "; grid-column: " + DebutColumn + "/" + EndColumn + ";");
    NewLine.innerHTML = Value;
    document.getElementById(Grids[Section - 1]).appendChild(NewLine);
}
function AddButton(Section, Row, DebutColumn, EndColumn) {
    NewButton = document.createElement("button");
    NewButton.id = Section.toString() + Row.toString() + DebutColumn.toString();
    NewButton.setAttribute("style", "grid-row:" + Row + "; grid-column:" + DebutColumn + "/" + EndColumn + ";");
    NewButton.setAttribute("onclick", "AddInputField(" + NewButton.id + ")");
    NewButton.setAttribute("ontouchstart", "AddInputField(" + NewButton.id + ")");
    NewButton.setAttribute("onmouseover", "Light(" + NewButton.id + ", '#FFFFFF', '#0099FF')");
    NewButton.setAttribute("onmouseout", "Light(" + NewButton.id + ", '#00000040', '#FFFFFF')");
    NewButton.innerHTML = "+";
    document.getElementById(Grids[Section - 1]).appendChild(NewButton);
}
function KeyPressed(event, InputLocation) {
    y = event.which || event.keyCode;
    if (y == 13) {
        AddData(InputLocation);
    }
}
function GridCorrection(Section, Row, Column) {
    for (x = Column; x <= document.getElementById(Grids[Section - 1]).childNodes.length; x++) {
        if (document.getElementById(Section + Row + (x < 10 ? "0" + x : x)).localName == "div") {
            MainList[Section - 1][x / 2][0] = parseInt(Section + Row + (x + 2 < 10 ? "0" + (x + 2) : x + 2));
        }
        if (document.getElementById(Section + Row + (x < 10 ? "0" + x : x)).localName == "button") {
            document.getElementById(Section + Row + (x < 10 ? "0" + x : x)).setAttribute("onclick", "AddInputField(" + Section + Row + (x + 2 < 10 ? "0" + (x + 2) : x + 2) + ")");
            document.getElementById(Section + Row + (x < 10 ? "0" + x : x)).setAttribute("ontouchstart", "AddInputField(" + Section + Row + (x + 2 < 10 ? "0" + (x + 2) : x + 2) + ")");
            document.getElementById(Section + Row + (x < 10 ? "0" + x : x)).setAttribute("onmouseover", "Light(" + Section + Row + (x + 2 < 10 ? "0" + (x + 2) : x + 2) + ", '#FFFFFF', '#0099FF')");
            document.getElementById(Section + Row + (x < 10 ? "0" + x : x)).setAttribute("onmouseout", "Light(" + Section + Row + (x + 2 < 10 ? "0" + (x + 2) : x + 2) + ", '#00000040', '#FFFFFF')");
        }
        document.getElementById(Section + Row + (x < 10 ? "0" + x : x)).setAttribute("style", "grid-column:" + (x + 2) + "/" + (x + 2) + ";");
        document.getElementById(Section + Row + (x < 10 ? "0" + x : x)).id = Section + Row + (x + 2 < 10 ? "0" + (x + 2) : x + 2);
    }
}