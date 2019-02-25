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
        let RowAdjustment = INNCount + 1;
        document.getElementById("button" + x).outerHTML = "";
        let NewData = document.createElement("input");
        NewData.type = "text";
        NewData.setAttribute("style", "grid-column: 1 / 1; grid-row: " + RowAdjustment + ";");
        NewData.setAttribute("onkeypress", "AddData(key)")
        document.getElementById("INNBox").appendChild(NewData);
      }
    }
    function AddData(key) {
      if (key == 13) {
        console.log("yes");
      }
    }