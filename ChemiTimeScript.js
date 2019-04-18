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
    NewField.setAttribute("style", "grid-row: " + CurrentRow + "; grid-column: " + CurrentColumn + "/" + (CurrentSection == 2 ? CurrentColumn + 3 : CurrentColumn) + ";");
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
        AddLine(1, CurrentRow, 1, 1, NewValue);
        AddButton(1, CurrentRow + 1, 1, 1);
        AddLine(2, CurrentRow, 1, 3, "&nbsp;");
        AddLine(2, CurrentRow, (document.getElementById("TimeBox").childNodes.length + MainList[2].length - 1), (document.getElementById("TimeBox").childNodes.length + MainList[2].length + 1), "&nbsp;");
        for (x = 0; x < MainList[2].length - 1; x++) {
            AddButton(2, CurrentRow, 3 * (x + 1), 3 * (x + 2));
        }
    }
    if (CurrentSection == 3) {
        MainList[2].sort();
        AddButton(3, 1, CurrentColumn, CurrentColumn);
        GridCorrection(3, "01", CurrentColumn + 1);
        AddLine(3, 1, CurrentColumn + 1, CurrentColumn + 3, NewValue);
        AddButton(3, 1, CurrentColumn + 3, CurrentColumn + 3);
    }
    if (CurrentSection == 2) {
        AddLine(2, CurrentRow, CurrentColumn, CurrentColumn + 3, NewValue);
    }
}
function AddLine(Section, Row, DebutColumn, EndColumn, Value) {
    NewLine = document.createElement("div");
    NewLine.id = Section + (Row < 10 ? "0" + Row : Row) + (DebutColumn < 10 ? "0" + DebutColumn : DebutColumn);
    NewLine.setAttribute("style", "grid-row: " + Row + "; grid-column: " + DebutColumn + "/" + EndColumn + ";");
    NewLine.innerHTML = Value;
    document.getElementById(Grids[Section - 1]).appendChild(NewLine);
}
function AddButton(Section, Row, DebutColumn, EndColumn) {
    NewButton = document.createElement("button");
    NewButton.id = Section + (Row < 10 ? "0" + Row : Row) + (DebutColumn < 10 ? "0" + DebutColumn : DebutColumn);
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
    for (x = document.getElementById(Grids[Section - 1]).childNodes.length + MainList[Section - 1].length; x >= Column; x--) {
        if (document.getElementById(Section + Row + (x < 10 ? "0" + x : x)) == null) {
            continue;
        }
        else if (document.getElementById(Section + Row + (x < 10 ? "0" + x : x)).localName == "div" && document.getElementById(Section + Row + (x < 10 ? "0" + x : x)).innerHTML != "&nbsp;") {
            MainList[Section - 1][(x - 2) / 3][0] = parseInt(Section + Row + (x + 3 < 10 ? "0" + (x + 3) : x + 3));
            document.getElementById(Section + Row + (x < 10 ? "0" + x : x)).setAttribute("style", "grid-row:" + Row + "; grid-column:" + (x + 3) + "/" + (x + 5) + ";");
            document.getElementById(Section + Row + (x < 10 ? "0" + x : x)).id = Section + Row + (x + 3 < 10 ? "0" + (x + 3) : x + 3);
            continue;
        }
        else if (document.getElementById(Section + Row + (x < 10 ? "0" + x : x)).localName == "button") {
            document.getElementById(Section + Row + (x < 10 ? "0" + x : x)).setAttribute("onclick", "AddInputField(" + Section + Row + (x + 3 < 10 ? "0" + (x + 3) : x + 3) + ")");
            document.getElementById(Section + Row + (x < 10 ? "0" + x : x)).setAttribute("ontouchstart", "AddInputField(" + Section + Row + (x + 3 < 10 ? "0" + (x + 3) : x + 3) + ")");
            document.getElementById(Section + Row + (x < 10 ? "0" + x : x)).setAttribute("onmouseover", "Light(" + Section + Row + (x + 3 < 10 ? "0" + (x + 3) : x + 3) + ", '#FFFFFF', '#0099FF')");
            document.getElementById(Section + Row + (x < 10 ? "0" + x : x)).setAttribute("onmouseout", "Light(" + Section + Row + (x + 3 < 10 ? "0" + (x + 3) : x + 3) + ", '#00000040', '#FFFFFF')");
            document.getElementById(Section + Row + (x < 10 ? "0" + x : x)).setAttribute("style", "grid-row:" + Row + "; grid-column:" + (x + 3) + "/" + (x + 3) + ";");
            document.getElementById(Section + Row + (x < 10 ? "0" + x : x)).id = Section + Row + (x + 3 < 10 ? "0" + (x + 3) : x + 3);
        }
    }
}