import {useGemini} from "../context/GeminiContext";

export default function Gemini() {

    const {apiKey, setApiKey} = useGemini();

    return (
        <div >
            <img src="gemini.png" height={25} width={25} alt="" />
        </div>
    );
}