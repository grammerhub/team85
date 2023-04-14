import { useEffect, useState, useRef } from "react";
import { Configuration, OpenAIApi } from "openai";
import { Dna } from "react-loader-spinner";

const Chat = () => {
  
    const apiKey = process.env.REACT_APP_API_KEY;

    const configuration = new Configuration({
    apiKey: apiKey,
  });

  const openai = new OpenAIApi(configuration);

  async function getChatCompletion(messages) {
    try {
      const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a school tutor treat me as if i am student that needs help with an assignment or homework. ",
          },
          ...messages,
        ],
      });

      return {
        jsonBody: {
          completion: completion.data.choices[0].message,
        },
      };
    } catch (error) {
      console.error(error);
      return {
        jsonBody: { completion: "Error: Unable to fetch response from API." },
      };
    }
  }

  let [userInput, setUserInput] = useState("");

  const [conversation, setConversation] = useState([]);

  const [isLoading, setLoading] = useState(null);

  const containerRef = useRef(null);

  const [classSubject, setSubject] = useState(null);

  const [showChat, setShowChat] = useState(null);

  const setTutor = (subject) => {
    if (subject === "math") {
      setSubject("do not give me the answer only explain to me the logic");
      setShowChat(true);
    } else if (subject === "history") {
        setSubject("")
        setShowChat(true);
    } else if (subject ==="science") {
        setSubject("explain this to me in a way that uses real world examples")
        setShowChat(true);
    } else if (subject === "literature") {
        setSubject("help me with writing and literature ideas only, do not write entire stories or poems for me")
        setShowChat(true);
    }
    
  };

  const [age, setAge] = useState("");

  const [name, setName] = useState("Jimmy")

 

  useEffect(() => {
    const fetchFirst = async () => {
      try {
        const messages = [
          {
            role: "user",
            content:
              `Please greet me as if I am a student who just walked in to class, my name is ${name}.`
          },
        ];
        const result = await getChatCompletion(messages);
        console.log(result.jsonBody.completion.content);
        setConversation([
          { role: "user", content: messages[0].content },
          {
            role: "assistant",
            content: result.jsonBody.completion.content,
          },
        ]);
      } catch (error) {
        console.error("Error fetching first response:", error);
      }
    };

    fetchFirst();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  const scrollToBottom = () => {
    if (!isLoading) {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        left: 0,
        behavior: "smooth",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    if(classSubject !== "history"){
     userInput = userInput.concat(" ", classSubject);
     } else {
        userInput = userInput
     }
      

    // let finalSubmit = subjectAdded.concat(" ", age);
    // console.log(finalSubmit)
    console.log(userInput)

    const result = await getChatCompletion(
      conversation.concat([{ role: "user", content: userInput }])
    );
    setConversation((prevConversation) => [
      ...prevConversation,
      { role: "user", content: userInput },
      {
        role: "assistant",
        content: result.jsonBody.completion.content,
      },
    ]);
    setLoading(null);
    setUserInput("");
  };

  const handleChange = () => {
    setShowChat(null)
    setSubject(null)
  }

  return (
    <div className="GPT">
      {!classSubject && classSubject !== "" &&(
        <>
          <h1 className="chatIntro">{`Hi ${name}, my name is Alfred`}</h1>
          <h1 className="tutor">I'm your personal AI tutor</h1>
          <h3>What would you like help with today?</h3>
        </>
      )}
      {!showChat ? (
        <div>
          <div className="buttons">
            <div>
              <button onClick={() => setTutor("math")}>
                <img src="./calculating.png"></img>
              </button>
              <h3>Math</h3>
            </div>
            <div>
              <button onClick={() => setTutor("history")}>
                <img src="./parchment.png"></img>
              </button>
              <h3>History</h3>
            </div>
            <div>
              <button onClick={() => setTutor("science")}>
                <img src="./chemistry.png"></img>
              </button>
              <h3>Science</h3>
            </div>
            <div>
              <button onClick={() => setTutor("literature")}>
                <img src="./research.png"></img>
              </button>
              <h3>Literature</h3>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="response">
            <h1>AI Tutor</h1>
            {isLoading ? (
              <div className="loader-container">
                <Dna className="dna" color="#00BFFF" height={100} width={100} />
              </div>
            ) : (
              conversation.slice(1).map((elem, index) => {
                return (
                  <p key={index}>
                    <strong>
                      {elem.role === "user" ? "You: " : "AI Tutor: "}
                    </strong>
                    {elem.content}
                  </p>
                );
              })
            )}
          </div>
          <div className="form" ref={containerRef}>
            <form className="submitForm" onSubmit={handleSubmit}>
              <textarea
                className="input"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="How could I help you today?"
                rows={4}
              />
              <button className="submit" type="submit">
                Submit
              </button>
            </form>
            <button className="newSubject" onClick={() => handleChange()}>
              Select new subject
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;