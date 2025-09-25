import { registerRootComponent } from "expo";
import App from "./src/App";
import { MessagesProvider } from "./src/state/MessagesContext";

function Root() {
    return (
        <MessagesProvider>
            <App />
        </MessagesProvider>
    );
}

registerRootComponent(Root);
