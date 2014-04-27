/*jshint browser:true */
/*global define, brackets */

/**
 * Brackets Boilerplate
 */
define(function (require, exports, module) {
  "use strict";
  var PreferencesManager  = brackets.getModule("preferences/PreferencesManager"),
      // CommandManager      = brackets.getModule("command/CommandManager"),
      // Menus               = brackets.getModule("command/Menus"),
      ProjectManager      = brackets.getModule("project/ProjectManager"),
      DropdownButton      = brackets.getModule("widgets/DropdownButton").DropdownButton,
      FileSystem          = brackets.getModule("filesystem/FileSystem"),

      prefs           = PreferencesManager.getExtensionPrefs("bodhiBit.bracketsBoilerplate"),
      boilerDropdown,
      boilerplateDir  = null;

  function init() {
    prefs.definePreference("boilerplateDir", "string");
    prefs.on("change", function(){
      if (boilerplateDir !== prefs.get("boilerplateDir")) {
        boilerplateDir = prefs.get("boilerplateDir");
        makeList();
      }
    });

    boilerDropdown = new DropdownButton("New...", ["Set boilerplate folder..."]);
    boilerDropdown.$button.appendTo("#project-files-header");
    $("#project-files-header").css("white-space", "normal");
    $(boilerDropdown).on("select", onSelect);
  }

  function makeList() {
    var list = [], dir, i, name;
    if (boilerplateDir) {
      // TODO actually make the list...
      dir = FileSystem.getDirectoryForPath(boilerplateDir);
      dir.getContents(function(err, entries){
        for(i=0;i<entries.length;i++) {
          name = entries[i].fullPath;
          name = name.substr(name.lastIndexOf("/", name.length-2)+1);
          list.push(name);
        }
        list.push("Set boilerplate folder...");
      });
    } else {
      list.push("Set boilerplate folder...");
    }
    boilerDropdown.items = list;
  }

  function onSelect(button, item, index) {
    if (item.substr(-3) === "...") {
      // Select source folder
      FileSystem.showOpenDialog(false, true, "Chose boilerplate folder", boilerplateDir, null, function(err, entries){
        if (entries.length > 0) {
          prefs.set("boilerplateDir", entries[0]);
          prefs.save();
        }
      });
    } else {
      // Copy boilerplate
    }
  }

  init();
});
