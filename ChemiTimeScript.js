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
        AddLine(1, (CurrentRow < 10 ? "0" + CurrentRow : CurrentRow), "01", NewValue);
        AddButton(1, (CurrentRow + 1 < 10 ? "0" + (CurrentRow + 1) : (CurrentRow + 1)), "01");
    }
    if (CurrentSection == 3) {
        MainList[2].sort();
        AddButton(3, "01", (CurrentColumn < 10 ? "0" + CurrentColumn : CurrentColumn));
        for (x = CurrentColumn + 1; x <= document.getElementById("TimeBox").childNodes.length; x++) {
            if (document.getElementById(3 + "01" + (x < 10 ? "0" + x : x)).localName == "div") {
                MainList[2][x / 2][0] = parseInt(3 + "01" + (x + 2 < 10 ? "0" + (x + 2) : x + 2));
            }
            if (document.getElementById(3 + "01" + (x < 10 ? "0" + x : x)).localName == "button") {
                document.getElementById(3 + "01" + (x < 10 ? "0" + x : x)).setAttribute("onclick", "AddInputField(" + 3 + "01" + (x + 2 < 10 ? "0" + (x + 2) : x + 2) + ")");
                document.getElementById(3 + "01" + (x < 10 ? "0" + x : x)).setAttribute("ontouchstart", "AddInputField(" + 3 + "01" + (x + 2 < 10 ? "0" + (x + 2) : x + 2) + ")");
                document.getElementById(3 + "01" + (x < 10 ? "0" + x : x)).setAttribute("onmouseover", "Light(" + 3 + "01" + (x + 2 < 10 ? "0" + (x + 2) : x + 2) + ", '#FFFFFF', '#0099FF')");
                document.getElementById(3 + "01" + (x < 10 ? "0" + x : x)).setAttribute("onmouseout", "Light(" + 3 + "01" + (x + 2 < 10 ? "0" + (x + 2) : x + 2) + ", '#00000040', '#FFFFFF')");
            }
            document.getElementById(3 + "01" + (x < 10 ? "0" + x : x)).style.gridColumn = x + 2;
            document.getElementById(3 + "01" + (x < 10 ? "0" + x : x)).id = 3 + "01" + (x + 2 < 10 ? "0" + (x + 2) : x + 2);
        }
        AddLine(3, "01", (CurrentColumn + 1 < 10 ? "0"  + (CurrentColumn + 1) : CurrentColumn + 1), NewValue);
        AddButton(3, "01", (CurrentColumn + 2 < 10 ? "0" + (CurrentColumn + 2) : CurrentColumn + 2));
    }
}
function AddLine(Section, Row, Column, Value) {
    NewLine = document.createElement("div");
    NewLine.id = Section.toString() + Row.toString() + Column.toString();
    NewLine.setAttribute("style", "grid-row: " + Row + "; grid-column: " + Column + ";");
    NewLine.innerHTML = Value;
    document.getElementById(Grids[Section - 1]).appendChild(NewLine);
}
function AddButton(Section, Row, Column) {
    NewButton = document.createElement("button");
    NewButton.id = Section.toString() + Row.toString() + Column.toString();
    NewButton.setAttribute("style", " grid-row: " + Row + "; grid-column: " + Column + ";");
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