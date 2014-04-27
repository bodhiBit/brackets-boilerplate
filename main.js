/*jshint browser:true, jquery:true */
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

      prefs           = PreferencesManager.getExtensionPrefs("brackets-boilerplate"),
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
    var source, dest, q, name, suffix;

    // find and set destination folder
    if (ProjectManager.getSelectedItem()) {
      if (ProjectManager.getSelectedItem().isDirectory) {
        dest = ProjectManager.getSelectedItem().fullPath;
      } else {
        dest = ProjectManager.getSelectedItem().parentPath;
      }
    } else {
      dest = ProjectManager.getProjectRoot().fullPath;
    }
    if (item.substr(-3) === "...") {
      // Select source folder
      FileSystem.showOpenDialog(false, true, "Chose boilerplate folder", boilerplateDir, null, function(err, entries){
        if (entries.length > 0) {
          source = FileSystem.getDirectoryForPath(entries[0]);
          prefs.set("boilerplateDir", source.fullPath);
          prefs.save();
        }
      });
    } else if (item.substr(-1) === "/") {
      // Copy folder
      window.alert("don't know how to copy folders yet! :(");
    } else {
      // Copy file
      source  = FileSystem.getFileForPath(boilerplateDir + item);
      q = [
        function() {
          // Create new file in project tree and let user rename it
          ProjectManager.createNewItem(
            FileSystem.getDirectoryForPath(dest),
            "new_" + item,
            false,
            false
          ).done(q.shift());
        },
        function(entry) {
          // remember destination File
          dest = entry;
          // Extract the basename for destination
          name = dest.fullPath;
          name = name.substr(name.lastIndexOf("/", name.length-2)+1);
          if (name.indexOf(".") < 0 && item.indexOf(".") > -1) {
            // Make sure destination has the proper suffix
            suffix = item.substr(item.indexOf("."));
            dest.rename(dest.fullPath + suffix, q.shift());
          } else if (name.indexOf(".") > -1) {
            // Extract new suffix
            suffix  = name.substr(name.indexOf("."));
            name    = name.substr(0, name.indexOf("."));
            q.shift()();
          } else {
            // No suffix
            suffix = "";
            q.shift()();
          }
        },
        function() {
          // Give time for the editor to open the file
          setTimeout(q.shift(), 1000);
        },
        function () {
          // read boilerplate File
          source.read({}, q.shift());
        },
        function(err, data) {
          // substitute <<<NAME>>> with `name`
          while (data.indexOf("<<<NAME>>>") > -1) {
            data = data.replace("<<<NAME>>>", name);
          }
          // Write boilerplate to destination
          dest.write(data, {}, q.shift());
        },
        function (err, stat) {
          ProjectManager.refreshFileTree();
        }
      ];
      q.shift()();
    }
  }

  init();
});
