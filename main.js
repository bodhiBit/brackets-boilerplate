/**
 * Brackets Boilerplate
 */
define(function (require, exports, module) {
  "use strict";
  var CommandManager = brackets.getModule("command/CommandManager"),
      Menus          = brackets.getModule("command/Menus"),
      ProjectManager = brackets.getModule("project/ProjectManager");


  // Function to run when the menu item is clicked
  function doWhatsThis() {
    window.alert("you just clicked on " + ProjectManager.getSelectedItem().fullPath);
  }


  // First, register a command - a UI-less object associating an id to a handler
  var MY_COMMAND_ID = "bodhiBit.bracketsBoilerplate.whatsThis";   // package-style naming to avoid collisions
  CommandManager.register("What's this?", MY_COMMAND_ID, doWhatsThis);

  // Then create a menu item bound to the command
  // The label of the menu item is the name we gave the command (see above)
  var menu = Menus.getContextMenu(Menus.ContextMenuIds.PROJECT_MENU);
  menu.addMenuItem(MY_COMMAND_ID);

  // We could also add a key binding at the same time:
  //menu.addMenuItem(MY_COMMAND_ID, "Ctrl-Alt-H");
  // (Note: "Ctrl" is automatically mapped to "Cmd" on Mac)
});
