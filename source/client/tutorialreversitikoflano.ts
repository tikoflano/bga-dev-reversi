/*
 *------
 * BGA framework: Gregory Isabelli & Emmanuel Colin & BoardGameArena
 * TutorialReversiTikoflano implementation : © Tiko Flano <tikoflano@gmail.com>
 *
 * This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
 * See http://en.boardgamearena.com/#!doc/Studio for more information.
 * -----
 */

/**
 * See {@link ../../node_modules/bga-ts-template/docs/typescript/index.md} for a LOT more information on this file.
 * The file include alternative ways to structure this file, how to break it up into multiple files, and more.
 */

// Defines the name of this module. Same as putting this code into a file at path: bgagame/tutorialreversitikoflano.ts
/// <amd-module name="bgagame/tutorialreversitikoflano"/>

import Gamegui = require("ebg/core/gamegui");
import "ebg/counter";

/** See {@link BGA.Gamegui} for more information. */
class TutorialReversiTikoflano extends Gamegui {
  // myGlobalValue: number = 0;
  // myGlobalArray: string[] = [];

  /** See {@link BGA.Gamegui} for more information. */
  constructor() {
    super();
    console.log("tutorialreversitikoflano constructor");
  }

  /** See {@link  BGA.Gamegui#setup} for more information. */
  override setup(gamedatas: BGA.Gamedatas): void {
    console.log("Starting game setup");

    dojo.place(`<div id="board"><div id="discs"></div></div>`, "game_play_area");

    const hor_scale = 64.8;
    const ver_scale = 64.4;
    for (let x = 1; x <= 8; x++) {
      for (let y = 1; y <= 8; y++) {
        const left = Math.round((x - 1) * hor_scale + 10);
        const top = Math.round((y - 1) * ver_scale + 7);
        dojo.place(
          `<div id="square_${x}_${y}" class="square" style="left: ${left}px; top: ${top}px;"></div>`,
          "board",
          "first",
        );
      }
    }

    // Add initial tokens
    for (var i in gamedatas["board"]) {
      var square = gamedatas["board"][i];

      if (square.player !== null) {
        this.addDiscOnBoard(square.x, square.y, square.player);
      }
    }

    // Hook up listeners
    dojo.query<HTMLElement>(".square").connect("click", this, "onPlayDisc");

    // Setup game notifications to handle (see "setupNotifications" method below)
    this.setupNotifications();

    console.log("Ending game setup");
  }

  ///////////////////////////////////////////////////
  //// Game & client states

  /** See {@link BGA.Gamegui#onEnteringState} for more information. */
  override onEnteringState(...[stateName, state]: BGA.GameStateTuple<["name", "state"]>): void {
    console.log("Entering state: " + stateName);

    switch (stateName) {
      case "playerTurn":
        this.updatePossibleMoves(state.args.possibleMoves, state.active_player);
        break;
    }
  }

  /** See {@link BGA.Gamegui#onLeavingState} for more information. */
  override onLeavingState(stateName: BGA.ActiveGameState["name"]): void {
    console.log("Leaving state: " + stateName);

    switch (stateName) {
      case "dummmy":
        // enable/disable any user interaction...
        break;
    }
  }

  /** See {@link BGA.Gamegui#onUpdateActionButtons} for more information. */
  override onUpdateActionButtons(...[stateName, args]: BGA.GameStateTuple<["name", "args"]>): void {
    console.log("onUpdateActionButtons: " + stateName, args);

    if (!this.isCurrentPlayerActive()) return;

    switch (stateName) {
      case "dummmy":
        // Add buttons to action bar...
        // this.addActionButton( 'button_id', _('Button label'), this.onButtonClicked );
        break;
    }
  }

  ///////////////////////////////////////////////////
  //// Utility methods

  addDiscOnBoard(x: number, y: number, player: BGA.ID) {
    const color = this.gamedatas?.players[player]?.color;
    const disc_id = `disc_${x}_${y}`;
    const square_id = `square_${x}_${y}`;

    dojo.place(`<div class="disc" data-color="${color}" id="${disc_id}"></div>`, "discs");
    this.placeOnObject(disc_id, `overall_player_board_${player}`);
    this.slideToObject(disc_id, square_id).play();
  }

  updatePossibleMoves(possibleMoves: boolean[][], active_player: BGA.ID) {
    // Remove current possible moves
    document.querySelectorAll(".possibleMove").forEach((div) => div.classList.remove("possibleMove"));

    // Display possible moves only to active player
    if (active_player != this.player_id) {
      return;
    }

    for (var x in possibleMoves) {
      for (var y in possibleMoves[x]) {
        // x,y is a possible move
        document.getElementById(`square_${x}_${y}`)?.classList.add("possibleMove");
      }
    }

    this.addTooltipToClass("possibleMove", "", _("Place a disc here"));
  }

  async animateTurnOverDisc(disc: { x: number; y: number }, targetColor: string) {
    const discDiv = $(`disc_${disc.x}_${disc.y}`);

    if (!discDiv) {
      throw new Error(`Disc element not found: ${disc}`);
    }

    // Make the disc blink 2 times
    dojo.fx
      .chain([
        dojo.fadeOut({ node: discDiv }),
        dojo.fadeIn({ node: discDiv }),
        dojo.fadeOut({
          node: discDiv,
          onEnd: () => (discDiv.dataset["color"] = targetColor),
        }),
        dojo.fadeIn({ node: discDiv }),
      ])
      .play(); // end of dojo.fx.chain
  }

  ///////////////////////////////////////////////////
  //// Player's action

  /*
		Here, you are defining methods to handle player's action (ex: results of mouse click on game objects).
		
		Most of the time, these methods:
		- check the action is possible at this game state.
		- make a call to the game server
	*/

  onPlayDisc(evt: Event) {
    evt.preventDefault();
    evt.stopPropagation();

    if (!(evt.currentTarget instanceof HTMLElement)) {
      throw new Error(
        "evt.currentTarget is null! Make sure that this function is being connected to a DOM HTMLElement.",
      );
    }

    var coords = evt.currentTarget.id.split("_");
    var x = coords[1];
    var y = coords[2];

    if (!document.getElementById(`square_${x}_${y}`)?.classList.contains("possibleMove")) {
      // This is not a possible move => the click does nothing
      return;
    }

    this.bgaPerformAction("actPlayDisc", { x, y });
  }

  ///////////////////////////////////////////////////
  //// Reaction to cometD notifications

  /** See {@link BGA.Gamegui#setupNotifications} for more information. */
  override setupNotifications = () => {
    console.log("notifications subscriptions setup");

    dojo.subscribe("playDisc", this, "notif_playDisc");
    this.notifqueue.setSynchronous("playDisc", 500);
    dojo.subscribe("turnOverDiscs", this, "notif_turnOverDiscs");
    this.notifqueue.setSynchronous("turnOverDiscs", 1000);
    dojo.subscribe("newScores", this, "notif_newScores");
    this.notifqueue.setSynchronous("newScores", 500);
  };

  async notif_playDisc(notif: BGA.Notif<"playDisc">) {
    dojo.query(".possibleMove").removeClass("possibleMove");
    this.addDiscOnBoard(notif.args.x, notif.args.y, notif.args.player_id);
  }

  async notif_turnOverDiscs(notif: BGA.Notif<"turnOverDiscs">) {
    console.log("NOTIFICATION turnOverDiscs", notif);
    // Get the color of the player who is returning the discs
    const targetColor = this.gamedatas!.players[notif.args.player_id!]!.color;

    // wait for the animations of all turned discs to be over before considering the notif done
    await Promise.all(
      notif.args.turnedOver.map((disc: { x: number; y: number }) => this.animateTurnOverDisc(disc, targetColor)),
    );
    console.log("NOTIFICATION turnOverDiscs DONE", notif);
  }

  async notif_newScores(notif: BGA.Notif<"newScores">) {
    for (var player_id in notif.args.scores) {
      var newScore = notif.args.scores[player_id];
      this.scoreCtrl[this.player_id!]!.toValue(newScore);
    }
  }
}

// The global 'bgagame.tutorialreversitikoflano' class is instantiated when the page is loaded and used as the Gamegui.
window.bgagame = { tutorialreversitikoflano: TutorialReversiTikoflano };
