import { FormEvent, useCallback, useEffect } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";

function App() {
	const socketUrl = `ws://localhost:${import.meta.env.WSS_PORT | 3000}`;

	const { sendMessage, readyState } = useWebSocket(socketUrl);

	const connectionStatus = {
		[ReadyState.CONNECTING]: "Connecting",
		[ReadyState.OPEN]: "Open",
		[ReadyState.CLOSING]: "Closing",
		[ReadyState.CLOSED]: "Closed",
		[ReadyState.UNINSTANTIATED]: "Uninstantiated",
	}[readyState];

	const handleSendMessage = (event: FormEvent) => {
		event.preventDefault();
		console.log("Sending message");
		sendMessage("Test");
	};

	return (
		<>
			<h1 className="text-3xl font-bold underline">"Crazy 8s"</h1>
			<p>Connection status: {connectionStatus}</p>

			<hr />

			<p>Send Message:</p>
			<form onSubmit={handleSendMessage}>
				<input type="text" name="messageText"></input>
				<button type="submit">Send</button>
			</form>
		</>
	);
}

export default App;
