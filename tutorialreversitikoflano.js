var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define("bgagame/tutorialreversitikoflano", ["require", "exports", "ebg/core/gamegui", "ebg/counter"], function (require, exports, Gamegui) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TutorialReversiTikoflano = (function (_super) {
        __extends(TutorialReversiTikoflano, _super);
        function TutorialReversiTikoflano() {
            var _this = _super.call(this) || this;
            _this.setupNotifications = function () {
                console.log("notifications subscriptions setup");
                dojo.subscribe("playDisc", _this, "notif_playDisc");
                _this.notifqueue.setSynchronous("playDisc", 500);
                dojo.subscribe("turnOverDiscs", _this, "notif_turnOverDiscs");
                _this.notifqueue.setSynchronous("turnOverDiscs", 1000);
                dojo.subscribe("newScores", _this, "notif_newScores");
                _this.notifqueue.setSynchronous("newScores", 500);
            };
            console.log("tutorialreversitikoflano constructor");
            return _this;
        }
        TutorialReversiTikoflano.prototype.setup = function (gamedatas) {
            console.log("Starting game setup");
            dojo.place("<div id=\"board\"><div id=\"discs\"></div></div>", "game_play_area");
            var hor_scale = 64.8;
            var ver_scale = 64.4;
            for (var x = 1; x <= 8; x++) {
                for (var y = 1; y <= 8; y++) {
                    var left = Math.round((x - 1) * hor_scale + 10);
                    var top_1 = Math.round((y - 1) * ver_scale + 7);
                    dojo.place("<div id=\"square_".concat(x, "_").concat(y, "\" class=\"square\" style=\"left: ").concat(left, "px; top: ").concat(top_1, "px;\"></div>"), "board", "first");
                }
            }
            for (var i in gamedatas["board"]) {
                var square = gamedatas["board"][i];
                if (square.player !== null) {
                    this.addDiscOnBoard(square.x, square.y, square.player);
                }
            }
            dojo.query(".square").connect("click", this, "onPlayDisc");
            this.setupNotifications();
            console.log("Ending game setup");
        };
        TutorialReversiTikoflano.prototype.onEnteringState = function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var stateName = _a[0], state = _a[1];
            console.log("Entering state: " + stateName);
            switch (stateName) {
                case "playerTurn":
                    this.updatePossibleMoves(state.args.possibleMoves, state.active_player);
                    break;
            }
        };
        TutorialReversiTikoflano.prototype.onLeavingState = function (stateName) {
            console.log("Leaving state: " + stateName);
            switch (stateName) {
                case "dummmy":
                    break;
            }
        };
        TutorialReversiTikoflano.prototype.onUpdateActionButtons = function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var stateName = _a[0], args = _a[1];
            console.log("onUpdateActionButtons: " + stateName, args);
            if (!this.isCurrentPlayerActive())
                return;
            switch (stateName) {
                case "dummmy":
                    break;
            }
        };
        TutorialReversiTikoflano.prototype.addDiscOnBoard = function (x, y, player) {
            var _a, _b;
            var color = (_b = (_a = this.gamedatas) === null || _a === void 0 ? void 0 : _a.players[player]) === null || _b === void 0 ? void 0 : _b.color;
            var disc_id = "disc_".concat(x, "_").concat(y);
            var square_id = "square_".concat(x, "_").concat(y);
            dojo.place("<div class=\"disc\" data-color=\"".concat(color, "\" id=\"").concat(disc_id, "\"></div>"), "discs");
            this.placeOnObject(disc_id, "overall_player_board_".concat(player));
            this.slideToObject(disc_id, square_id).play();
        };
        TutorialReversiTikoflano.prototype.updatePossibleMoves = function (possibleMoves, active_player) {
            var _a;
            document.querySelectorAll(".possibleMove").forEach(function (div) { return div.classList.remove("possibleMove"); });
            if (active_player != this.player_id) {
                return;
            }
            for (var x in possibleMoves) {
                for (var y in possibleMoves[x]) {
                    (_a = document.getElementById("square_".concat(x, "_").concat(y))) === null || _a === void 0 ? void 0 : _a.classList.add("possibleMove");
                }
            }
            this.addTooltipToClass("possibleMove", "", _("Place a disc here"));
        };
        TutorialReversiTikoflano.prototype.animateTurnOverDisc = function (disc, targetColor) {
            return __awaiter(this, void 0, void 0, function () {
                var discDiv;
                return __generator(this, function (_a) {
                    discDiv = $("disc_".concat(disc.x, "_").concat(disc.y));
                    if (!discDiv) {
                        throw new Error("Disc element not found: ".concat(disc));
                    }
                    dojo.fx
                        .chain([
                        dojo.fadeOut({ node: discDiv }),
                        dojo.fadeIn({ node: discDiv }),
                        dojo.fadeOut({
                            node: discDiv,
                            onEnd: function () { return (discDiv.dataset["color"] = targetColor); },
                        }),
                        dojo.fadeIn({ node: discDiv }),
                    ])
                        .play();
                    return [2];
                });
            });
        };
        TutorialReversiTikoflano.prototype.onPlayDisc = function (evt) {
            var _a;
            evt.preventDefault();
            evt.stopPropagation();
            if (!(evt.currentTarget instanceof HTMLElement)) {
                throw new Error("evt.currentTarget is null! Make sure that this function is being connected to a DOM HTMLElement.");
            }
            var coords = evt.currentTarget.id.split("_");
            var x = coords[1];
            var y = coords[2];
            if (!((_a = document.getElementById("square_".concat(x, "_").concat(y))) === null || _a === void 0 ? void 0 : _a.classList.contains("possibleMove"))) {
                return;
            }
            this.bgaPerformAction("actPlayDisc", { x: x, y: y });
        };
        TutorialReversiTikoflano.prototype.notif_playDisc = function (notif) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    dojo.query(".possibleMove").removeClass("possibleMove");
                    this.addDiscOnBoard(notif.args.x, notif.args.y, notif.args.player_id);
                    return [2];
                });
            });
        };
        TutorialReversiTikoflano.prototype.notif_turnOverDiscs = function (notif) {
            return __awaiter(this, void 0, void 0, function () {
                var targetColor;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            console.log("NOTIFICATION turnOverDiscs", notif);
                            targetColor = this.gamedatas.players[notif.args.player_id].color;
                            return [4, Promise.all(notif.args.turnedOver.map(function (disc) { return _this.animateTurnOverDisc(disc, targetColor); }))];
                        case 1:
                            _a.sent();
                            console.log("NOTIFICATION turnOverDiscs DONE", notif);
                            return [2];
                    }
                });
            });
        };
        TutorialReversiTikoflano.prototype.notif_newScores = function (notif) {
            return __awaiter(this, void 0, void 0, function () {
                var player_id, newScore;
                return __generator(this, function (_a) {
                    for (player_id in notif.args.scores) {
                        newScore = notif.args.scores[player_id];
                        this.scoreCtrl[this.player_id].toValue(newScore);
                    }
                    return [2];
                });
            });
        };
        return TutorialReversiTikoflano;
    }(Gamegui));
    window.bgagame = { tutorialreversitikoflano: TutorialReversiTikoflano };
});
