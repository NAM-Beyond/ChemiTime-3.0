var MainList = [[],[],[]];
var Grids = ["INNBox", "DoseBox", "TimeBox"];

/* No need to explain that one */
window.onload = function RemoveFuckingUselessEmptyTextNodes() {
    for (x = 0; x < 3; x ++) {
        for (y = 0; y < document.getElementById(Grids[x]).childNodes.length; y++) {
            if (document.getElementById(Grids[x]).childNodes[y].nodeName == "#text") {
                document.getElementById(Grids[x]).removeChild(document.getElementById(Grids[x]).childNodes[y]);
            }
        }
    }
}

/* Function to enlight the button your mouse is over */
function Light(ButtonId, ButtonFontColor, ButtonBackgroundColor) {
    document.getElementById(ButtonId).style.color = ButtonFontColor;
    document.getElementById(ButtonId).style.backgroundColor = ButtonBackgroundColor;
}

/* Function that creates the input field after a button is clicked before adding it to the timeline */
function AddInputField(ButtonId) {
    /* First we gather the coordinates of the button */
    CurrentSection = Math.floor(ButtonId / 10000);
    CurrentRow = parseInt(document.getElementById(ButtonId).style.gridRowStart);
    CurrentColumn = parseInt(document.getElementById(ButtonId).style.gridColumnStart);
    ColumnEnd = parseInt(document.getElementById(ButtonId).style.gridColumnEnd);
    ItemNumber = ButtonId - CurrentSection * 10000 - CurrentRow * 100;
    document.getElementById(ButtonId).outerHTML = "";
    /* Then we create the input field */
    NewField = document.createElement("input");
    NewField.type = "text";
    NewField.id = ButtonId;
    NewField.setAttribute("style", "grid-row: " + CurrentRow + "; grid-column: " + CurrentColumn + " / " + ColumnEnd + ";");
    NewField.setAttribute("onkeypress", "KeyPressed(event, " + ButtonId + ")");
    document.getElementById(Grids[CurrentSection - 1]).appendChild(NewField);
}

/* Function of the keyboard event listener, an input is add only if the user press enter */
function KeyPressed(event, InputLocation) {
    y = event.which || event.keyCode;
    if (y == 13) {
        NewValue = document.getElementById(InputLocation).value;
        MainList[CurrentSection - 1].push([InputLocation, NewValue]);
        document.getElementById(InputLocation).outerHTML = "";
        AddData(NewValue, InputLocation);
    }
}

/* Main function that manage the timeline when a new data is added */
function AddData(Value, InputId) {
    if (CurrentSection == 1) /* INN Section */ {
        /* We add the new INN, then we add a button to permit the add of a next INN later */
        AddItem(1, CurrentRow, 1, 1, "div", Value, 1);
        AddItem(1, CurrentRow + 1, 1, 1, "button", "+", 1);
        if (MainList[2].length > 0) {
            /* If there's at least one date, already add 2 blank div's at the beginning and ending of the DoseBox to make further dose fit between 2 dates */
            AddItem(2, CurrentRow, 1, 3, "div", "&nbsp;", 1);
            AddItem(2, CurrentRow, (document.getElementById("TimeBox").childNodes.length + MainList[2].length - 1), (document.getElementById("TimeBox").childNodes.length + MainList[2].length + 1), "div", "&nbsp;", MainList[2].length + 1);
        }
        for (x = 0; x < MainList[2].length - 1; x++) {
            /* For each row of the DoseBox, add several buttons that fit between 2 dates */
            AddItem(2, CurrentRow, 3 * (x + 1), 3 * (x + 2), "button", "+", x + 2);
        }
    }
    if (CurrentSection == 2) /* DoseBox */ {
        AddItem(2, CurrentRow, CurrentColumn, CurrentColumn + 3, "div", Value, ItemNumber);
    }
    if (CurrentSection == 3) /* Time Section */ {
        MainList[2].sort();
        AddItem(3, 1, CurrentColumn, CurrentColumn, "button", "+", ItemNumber);
        /* If adding a date between two other dates, shift all the element to the right before adding the new date */
        if (ItemNumber + 1 < document.getElementById("TimeBox").childNodes.length) {
            ColumnCorrection(3, 1, document.getElementById("TimeBox").childNodes.length, ItemNumber + 1, 2);
        }
        AddItem(3, 1, CurrentColumn + 1, CurrentColumn + 3, "div", Value, ItemNumber + 1);
        AddItem(3, 1, CurrentColumn + 3, CurrentColumn + 3, "button", "+", ItemNumber + 2);
        /* Adding a new date makes changes in the DoseBox display, in order to avoid removing and rebuilding ALL the DoseBox, shift only a part */
        if (MainList[2].length > 1 && MainList[0].length > 0 && document.getElementById("DoseBox").childNodes.length > 0) {
            for (y = 1; y <= MainList[0].length; y++) {
                /* A querySelector that count the number of elements in one row and a function that helps finding where to stop the shifting */
                ColumnCorrection(2, y, document.querySelectorAll("[id^=\"2" + (y < 10 ? "0" + y : y) + "\"]").length, WhichChangeEnd(InputId, y), 1);
            }
        }
        /* If the user added INNs before adding two dates, add the missing items in the DoseBox */
        if (MainList[0].length > 0 && MainList[2].length == 2) {
            for (x = 1; x <= MainList[0].length; x++) {
                AddItem(2, x, 1, 3, "div", "&nbsp;", 1);
                AddItem(2, x, 6, 8, "div", "&nbsp;", 3);
                AddItem(2, x, 3, 6, "button", "+", 2);
            }
        }
    }
}

/* Sub-function that manage adding a specific item in the timeline */
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

/* Sub-function that manages the shifting of the elements in the TimeBox and DosBox */
function ColumnCorrection(Section, Row, ChangeStart, ChangeEnd, ElementShift) {
    /* If the TimeBox button clicked overlaps with a dose in the DoseBox, dose size should be extended, no new element should be added in this row of the DoseBox and therefore no element number should be shifted */
    if (Section == 2 && document.getElementById(Section + (Row < 10 ? "0" + Row : Row) + (ChangeEnd < 10 ? "0" + ChangeEnd : ChangeEnd)).localName == "div" && document.getElementById(Section + (Row < 10 ? "0" + Row : Row) + (ChangeEnd < 10 ? "0" + ChangeEnd : ChangeEnd)).innerHTML != "&nbsp;") {
        ElementShift = 0;
    }
    /* Pure logic : we begin from the right to the left and shift every element needed */
    for (x = ChangeStart; x >= ChangeEnd; x--) {
        TempElement = document.getElementById(Section + (Row < 10 ? "0" + Row : Row) + (x < 10 ? "0" + x : x));
        /* If in DoseBox we're at the last item to shift in this row, then it must be overlaping the button clicked in the TimeBox and depending of the type of this last item, specific modifications should be applied */
        if (Section == 2 && x == ChangeEnd && ChangeEnd != ChangeStart) {
            /* If the element is a button or the blank div on the left, then it shouldn't be shifted and a button to its right should be added */
            if (x == 1 || TempElement.localName == "button") {
                AddItem(2, Row, parseInt(TempElement.style.gridColumnEnd), parseInt(TempElement.style.gridColumnEnd) + 3, "button", "+", x + 1);
            }
            /* If the element is a dose, it should not be shifted but extended to preserve the dates it is between */
            else if (TempElement.localName == "div" && TempElement.innerHTML != "&nbsp;") {
                TempElement.style.gridColumnEnd = parseInt(TempElement.style.gridColumnEnd) + 3;
            }
        }
        else {
            /* Shifting the element to the right */
            TempElement.style.gridColumnStart = parseInt(TempElement.style.gridColumnStart) + 3;
            TempElement.style.gridColumnEnd = parseInt(TempElement.style.gridColumnEnd) + 3;
            OldId = TempElement.id.toString();
            NewId = Section + (Row < 10 ? "0" + Row : Row) + (x + ElementShift < 10 ? "0" + (x + ElementShift) : x + ElementShift);
            /* Replace all the references to the id in the attributes and not only the id itself (i.e. in all the buttons) */
            TempElement.outerHTML = TempElement.outerHTML.replace(new RegExp(OldId, 'g'), NewId);
            if (x == ChangeEnd && TempElement.innerHTML == "&nbsp;") {
                /* If the only element to shift is the blank div on the right (meaning the user clicked on the far right button in the TimeBox), then it should be shifted and a button should be added to its left */
                AddItem(2, Row, parseInt(TempElement.style.gridColumnStart) - 3, parseInt(TempElement.style.gridColumnStart), "button", "+", x);
            }
            /* Modify the value in the MainList array, according to the new item number */
            if (TempElement.localName == "div" && TempElement.innerHTML != "&nbsp;") {
                MainList[Section - 1][MainList[Section - 1].map(function(TempList){return TempList[0]}).indexOf(OldId)][0] = NewId;
            }
        }
    }
}

/* Tricky sub-function that calculate the exact end of the shifting in the DoseBox to not go further, considering that some dose elements may overlap time elements so we can't use the number of time elements to define that end of shifting */
function WhichChangeEnd(ButtonLocation, Row) {
    ButtonCompared = parseInt(document.getElementById(ButtonLocation).style.gridColumnStart);
    ListOfColumnStarts = [...document.querySelectorAll("[id^=\"2" + (Row < 10 ? "0" + Row : Row) + "\"]")].map(x => parseInt(x.style.gridColumnStart));
    ColumnStartOfChangEndIndex = ListOfColumnStarts.indexOf(Math.max(...ListOfColumnStarts.filter(x => ButtonCompared > x)));
    return parseInt([...document.querySelectorAll("[id^=\"2" + (Row < 10 ? "0" + Row : Row) + "\"]")][ColumnStartOfChangEndIndex].id) - 20000 - Row * 100;
}