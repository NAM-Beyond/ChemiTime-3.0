var MainList = [[],[],[]];
var Grids = ["INNBox", "DoseBox", "TimeBox"];
window.onload = function RemoveFuckingUselessEmptyTextNodes() {
    for (x = 0; x < 3; x ++) {
        for (y = 0; y < document.getElementById(Grids[x]).childNodes.length; y++) {
            if (document.getElementById(Grids[x]).childNodes[y].nodeName == "#text") {
                document.getElementById(Grids[x]).removeChild(document.getElementById(Grids[x]).childNodes[y]);
            }
        }
    }
}
function Light(ButtonId, ButtonFontColor, ButtonBackgroundColor) {
    document.getElementById(ButtonId).style.color = ButtonFontColor;
    document.getElementById(ButtonId).style.backgroundColor = ButtonBackgroundColor;
}
function AddInputField(ButtonId) {
    CurrentSection = Math.floor(ButtonId / 10000);
    CurrentRow = parseInt(document.getElementById(ButtonId).style.gridRowStart);
    CurrentColumn = parseInt(document.getElementById(ButtonId).style.gridColumnStart);
    ColumnEnd = parseInt(document.getElementById(ButtonId).style.gridColumnEnd);
    ItemNumber = ButtonId - CurrentSection * 10000 - CurrentRow * 100;
    document.getElementById(ButtonId).outerHTML = "";
    NewField = document.createElement("input");
    NewField.type = "text";
    NewField.id = ButtonId;
    NewField.setAttribute("style", "grid-row: " + CurrentRow + "; grid-column: " + CurrentColumn + " / " + ColumnEnd + ";");
    NewField.setAttribute("onkeypress", "KeyPressed(event, " + ButtonId + ")");
    document.getElementById(Grids[CurrentSection - 1]).appendChild(NewField);
}
function KeyPressed(event, InputLocation) {
    y = event.which || event.keyCode;
    if (y == 13) {
        NewValue = document.getElementById(InputLocation).value;
        MainList[CurrentSection - 1].push([InputLocation, NewValue]);
        document.getElementById(InputLocation).outerHTML = "";
        AddData(NewValue, InputLocation);
    }
}
function AddData(Value, InputId) {
    if (CurrentSection == 1) {
        AddItem(1, CurrentRow, 1, 1, "div", Value, 1);
        AddItem(1, CurrentRow + 1, 1, 1, "button", "+", 1);
        if (MainList[2].length > 0) {
            AddItem(2, CurrentRow, 1, 3, "div", "&nbsp;", 1);
            AddItem(2, CurrentRow, (document.getElementById("TimeBox").childNodes.length + MainList[2].length - 1), (document.getElementById("TimeBox").childNodes.length + MainList[2].length + 1), "div", "&nbsp;", MainList[2].length + 1);
        }
        for (x = 0; x < MainList[2].length - 1; x++) {
            AddItem(2, CurrentRow, 3 * (x + 1), 3 * (x + 2), "button", "+", x + 2);
        }
    }
    if (CurrentSection == 3) {
        MainList[2].sort();
        AddItem(3, 1, CurrentColumn, CurrentColumn, "button", "+", ItemNumber);
        if (ItemNumber + 1 < document.getElementById("TimeBox").childNodes.length) {
            ColumnCorrection(3, 1, document.getElementById("TimeBox").childNodes.length, ItemNumber + 1, 2);
        }
        AddItem(3, 1, CurrentColumn + 1, CurrentColumn + 3, "div", Value, ItemNumber + 1);
        AddItem(3, 1, CurrentColumn + 3, CurrentColumn + 3, "button", "+", ItemNumber + 2);
        if (MainList[2].length > 1 && MainList[0].length > 0 && document.getElementById("DoseBox").childNodes.length > 0) {
            for (y = 1; y <= MainList[0].length; y++) {
                ColumnCorrection(2, y, document.querySelectorAll("[id^=\"2" + (y < 10 ? "0" + y : y) + "\"]").length, WhichChangeEnd(InputId, y), 1);
            }
        }
        if (MainList[0].length > 0 && MainList[2].length == 2) {
            for (x = 1; x <= MainList[0].length; x++) {
                AddItem(2, x, 1, 3, "div", "&nbsp;", 1);
                AddItem(2, x, 6, 8, "div", "&nbsp;", 3);
                AddItem(2, x, 3, 6, "button", "+", 2);
            }
        }
    }
    if (CurrentSection == 2) {
        AddItem(2, CurrentRow, CurrentColumn, CurrentColumn + 3, "div", Value, ItemNumber);
    }
}
function AddItem(Section, Row, DebutColumn, EndColumn, Type, Value, ItemNumber) {
    NewItem = document.createElement(Type);
    document.getElementById(Grids[Section - 1]).appendChild(NewItem);
    NewItem.id = Section + (Row < 10 ? "0" + Row : Row) + (ItemNumber < 10 ? "0" + ItemNumber : ItemNumber);
    if (Type == "div") {
        NewItem.outerHTML = "<div id=\"" + NewItem.id + "\" style=\"grid-row: " + Row + "; grid-column: " + DebutColumn + " / " + EndColumn + ";\">" + Value + "</div>";
    }
    else {
        NewItem.outerHTML = "<button id=\"" + NewItem.id + "\" style=\"grid-row: " + Row + "; grid-column: " + DebutColumn + " / " + EndColumn + ";\" onclick=\"AddInputField(" + NewItem.id + ")\" ontouchstart=\"AddInputField(" + NewItem.id + ")\" onmouseover=\"Light('" + NewItem.id + "', '#FFFFFF', '#0099FF')\" onmouseout=\"Light('" + NewItem.id + "', '#00000010', '#FFFFFF')\">" + Value + "</button>";
    }
}
function ColumnCorrection(Section, Row, ChangeStart, ChangeEnd, ElementShift) {
    if (Section == 2 && document.getElementById(Section + (Row < 10 ? "0" + Row : Row) + (ChangeEnd < 10 ? "0" + ChangeEnd : ChangeEnd)).localName == "div" && document.getElementById(Section + (Row < 10 ? "0" + Row : Row) + (ChangeEnd < 10 ? "0" + ChangeEnd : ChangeEnd)).innerHTML != "&nbsp;") {
        ElementShift = 0;
    }
    for (x = ChangeStart; x >= ChangeEnd; x--) {
        TempElement = document.getElementById(Section + (Row < 10 ? "0" + Row : Row) + (x < 10 ? "0" + x : x));
        if (Section == 2 && x == ChangeEnd && ChangeEnd != ChangeStart) {
            if (x == 1 || TempElement.localName == "button") {
                AddItem(2, Row, parseInt(TempElement.style.gridColumnEnd), parseInt(TempElement.style.gridColumnEnd) + 3, "button", "+", x + 1);
            }
            else if (TempElement.localName == "div" && TempElement.innerHTML != "&nbsp;") {
                TempElement.style.gridColumnEnd = parseInt(TempElement.style.gridColumnEnd) + 3;
            }
        }
        else {
            TempElement.style.gridColumnStart = parseInt(TempElement.style.gridColumnStart) + 3;
            TempElement.style.gridColumnEnd = parseInt(TempElement.style.gridColumnEnd) + 3;
            OldId = TempElement.id.toString();
            NewId = Section + (Row < 10 ? "0" + Row : Row) + (x + ElementShift < 10 ? "0" + (x + ElementShift) : x + ElementShift);
            TempElement.outerHTML = TempElement.outerHTML.replace(new RegExp(OldId, 'g'), NewId);
            if (x == ChangeEnd && TempElement.innerHTML == "&nbsp;") {
                AddItem(2, Row, parseInt(TempElement.style.gridColumnStart) - 3, parseInt(TempElement.style.gridColumnStart), "button", "+", x);
            }
            if (Section == 2 && TempElement.localName == "div" && TempElement.innerHTML != "&nbsp;") {
                /*MainList[1][x][0] = parseInt(NewId);*/
            }
            if (Section == 3 && TempElement.localName == "div") {
                /*MainList[2][x][0] = parseInt(NewId);*/
            }
        }
    }
}
function WhichChangeEnd(ButtonLocation, Row) {
    ButtonCompared = parseInt(document.getElementById(ButtonLocation).style.gridColumnStart);
    ListOfColumnStarts = [...document.querySelectorAll("[id^=\"2" + (Row < 10 ? "0" + Row : Row) + "\"]")].map(x => parseInt(x.style.gridColumnStart));
    ColumnStartOfChangEndIndex = ListOfColumnStarts.indexOf(Math.max(...ListOfColumnStarts.filter(x => ButtonCompared > x)));
    return parseInt([...document.querySelectorAll("[id^=\"2" + (Row < 10 ? "0" + Row : Row) + "\"]")][ColumnStartOfChangEndIndex].id) - 20000 - Row * 100;
}