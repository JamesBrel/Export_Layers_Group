//* ---------------------- Variables ----------------------
var outputFolder = null;
var nameGroupList = [];
var operatingSystem = File.fs;

//*--------- Dialog Box front end --------------
var dialogBox = new Window("dialog", "Export Groups", [100, 100, 437, 240]);
pnl_browse = dialogBox.add("panel", [10, 10, 327, 80], "Export Groups");
btn_select_folder = pnl_browse.add(
  "button",
  [10, 20, 190, 33],
  " Select Destination Folder ",
);

btn_export = pnl_browse.add("button", [245, 20, 110, 33], " Export ");

text_message = dialogBox.add(
  "statictext",
  [10, 10, 241, 220],
  "Select your destination folder....",
);

btn_finish = dialogBox.add("button", [260, 100, 110, 33], " Finish ");

//*--------- Dialog Box functionalities --------------

btn_select_folder.onClick = function () {
  outputFolder = Folder.selectDialog("Select destination folder");
  if (outputFolder !== null) {
    text_message.text = "Cool, Export them, it will take some minutes....";
  }
};

btn_export.onClick = function () {
  exportLayers();
};

btn_finish.onClick = function () {
  if (outputFolder !== null) {
    dialogBox.close();
    openFolder();
  } else {
    dialogBox.close();
  }
};

//*--------- Functions --------------

function exportLayers() {
  if (outputFolder !== null) {
    var groupsList = app.activeDocument.layerSets;
    resetLayers(groupsList);
    for (var groupIndex = 0; groupIndex < groupsList.length; groupIndex++) {
      groupsList[groupIndex].visible = true;
      var nameGroup = groupsList[groupIndex].name;
      nameGroupList.push(nameGroup);
      createFolder(outputFolder + "/" + nameGroup + "/");
    }
    for (var indexName in nameGroupList) {
      groupsList[indexName].visible = true;
      var layersList = groupsList[indexName].layers;
      for (var indexLayer = 0; indexLayer < layersList.length; indexLayer++) {
        if (layersList[indexLayer].visible == false) {
          layersList[indexLayer].visible = true;
          var layerName = layersList[indexLayer].name;
          switch (operatingSystem) {
            case "Windows":
              windows(layerName, indexName);
              break;
            case "Macintosh":
              macintosh(layerName, indexName);
              break;
            case "Unix":
              unix(layerName, indexName);
              break;
            default:
              break;
          }
          layersList[indexLayer].visible = false;
        }
      }
      groupsList[indexName].visible = false;
    }
    text_message.text = "The Export process is Done....";
  } else {
    text_message.text = "You must select the destination folder....";
  }
}

function windows(_layerName, _indexName) {
  if (hasWhiteSpace(_layerName)) {
    var file = new File(
      outputFolder +
        "/" +
        nameGroupList[_indexName] +
        "/" +
        "temp_name" +
        ".png",
    );
    SaveImage(file);
    file.rename(_layerName + "#100" + ".png"); //*--- mise du poids pour usage personnel pour nft mais à revenir plutard pour faire une modification intérressante ---*//
  } else {
    var file = new File(
      outputFolder +
        "/" +
        nameGroupList[_indexName] +
        "/" +
        _layerName +
        "#100" +
        ".png",
    );
    SaveImage(file);
  }
}

function macintosh(_layerName, _indexName) {
  if (filename.length > 27 && hasWhiteSpace(_layerName)) {
    var file = new File(
      outputFolder +
        "/" +
        nameGroupList[_indexName] +
        "/" +
        "temp_name" +
        ".png",
    );
    SaveImage(file);
    file.rename(_layerName + ".png");
  } else {
    var file = new File(
      outputFolder +
        "/" +
        nameGroupList[_indexName] +
        "/" +
        _layerName +
        ".png",
    );
    SaveImage(file);
  }
}

function unix(_layerName, _indexName) {
  /**
   ** Ici tu ajoute les lignes de code qui géront le
   ** cas du système Unix..
   */
}

function hasWhiteSpace(_nameLayer) {
  return /\s/g.test(_nameLayer);
}

function openFolder() {
  var folderCreated = new Folder(outputFolder);
  folderCreated.execute();
}

function SaveImage(_file) {
  var sfwOptions = new ExportOptionsSaveForWeb();
  sfwOptions.format = SaveDocumentType.PNG;
  sfwOptions.PNG8 = false;
  sfwOptions.includeProfile = false;
  sfwOptions.transparency = true;
  sfwOptions.interlaced = false;
  sfwOptions.quality = 100; //0-100
  activeDocument.exportDocument(_file, ExportType.SAVEFORWEB, sfwOptions);
}

function resetLayers(_groups) {
  for (var i = 0; i < _groups.length; i++) {
    _groups[i].visible = false;
    for (var j = 0; j < _groups[i].layers.length; j++) {
      _groups[i].layers[j].visible = false;
    }
  }
}

function createFolder(_path) {
  var createFolder = new Folder(_path);
  if (!createFolder.exists) createFolder.create();
}

//*--------- Dialog Box launcher --------------
dialogBox.center();
dialogBox.show();
