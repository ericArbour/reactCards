import {Observable} from "rxjs";
import {Validator} from "shared/validation";
import {validateMessage} from "shared/validation/chat";
import {mapOp$} from "shared/observable";
import * as A from "../actions";

const defaultView = {
    messages: [
        {index: 1, name: "Person 1", message: "Hello"},
        {index: 2, name: "Person 2", message: "Wattup"},
        {index: 3, name: "Person 3", message: "Hey"},
        {index: 4, name: "Person 4", message: "Be humble"},
        {index: 5, name: "Person 5", message: "Yah yah"},
    ],

    games: [
        {title: "Game 1", id: 1, players: ["one", "two", "three"]},
        {title: "Game 2", id: 2, players: ["one", "two", "three"]},
        {title: "Game 3", id: 3, players: ["one", "two", "three"]},
        {title: "Game 4", id: 4, players: ["one", "two", "three"]}
    ]
};

export default class LobbyStore {
    constructor({dispatcher}, user) {
        this.view$ = Observable.of(defaultView);

        dispatcher.onRequest({
            [A.LOBBY_JOIN]: action => dispatcher.succeed(action),

            [A.LOBBY_SEND_MESSAGE]: action => {
                const validator = new Validator();
                if (!user.isLoggedIn)
                    validator.push("You must be logged in");

                validator.push(validateMessage(action.message));

                if (validator.didFail) {
                    dispatcher.fail(action, validator.message);
                    return;
                }

                // TODO: SEND TO SOCKET
            }
        });

        this.opSendMessage$ = mapOp$(
            dispatcher.on$(A.LOBBY_SEND_MESSAGE),
            user.details$.map(u => u.isLoggedIn));
    }
}