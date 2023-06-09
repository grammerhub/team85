import { useEffect, useState, useRef, useContext } from "react";
import { Configuration, OpenAIApi } from "openai";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Dna } from "react-loader-spinner";
import axios from "axios";
import { ChatContext } from "../context/ChatContext";

const Chat = () => {
  const navigate = useNavigate();

  const {
    setSubject,
    classSubject,
    showChat,
    setShowChat,
    saveConvo,
    role,
    setRole,
  } = useContext(ChatContext);
  
  const { user } = useContext(AuthContext);

  const [age, setAge] = useState("");

  const [name, setName] = useState("");

  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(
          "http://127.0.0.1:5001/miami-hackathon-ai/us-central1/api/users/my-test-id"
        );
        console.log(res);
        setAge(res.data.age);
        setName(res.data.displayName);
        setRole(res.data.role);
        setDataLoaded(true); // Set dataLoaded to true after setting age and name
      } catch (e) {}
    })();
  }, []);

  // useEffect(() => {
  //   if (user?.role === "teacher") navigate("/teacher-dashboard");
  //   if (!user?.role) return navigate("/login");
  // }, [user]);

  useEffect(() => {
    if (dataLoaded) {
      const fetchFirst = async () => {
        try {
          const messages = [
            {
              role: "user",
              content: `Please greet me as if I am a student who just walked in to class, my name is ${name}.`,
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
    }
  }, [dataLoaded]);

  const handleLike = (elem) => {
    let question =
      conversation.indexOf(
        conversation.find((message) => message.content === elem)
      ) - 1;
    setLike({
      uid: "my-test-id",
      question: conversation[question].content,
      answer: elem,
      subject: holdSubject,
    });
  };

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

  const [rows, setRows] = useState(1);

  const containerRef = useRef(null);

  const setTutor = (subject) => {
    setHoldSubject(subject);
    if (subject === "math") {
      setSubject("do not give me the answer only explain to me the logic");
      setShowChat(true);
    } else if (subject === "history") {
      setSubject("");
      setShowChat(true);
    } else if (subject === "science") {
      setSubject("explain this to me in a way that uses real world examples");
      setShowChat(true);
    } else if (subject === "literature") {
      setSubject(
        "help me with writing and literature ideas only, do not write entire stories or poems for me"
      );
      setShowChat(true);
    }
  };

  const [like, setLike] = useState({});

  const [holdSubject, setHoldSubject] = useState("");

  useEffect(() => {
    (async () => {
      try {
        await axios.post(
          "http://127.0.0.1:5001/miami-hackathon-ai/us-central1/api/users/createQuestion",
          like
        );
      } catch (e) {
        // You may want to log the error or handle it differently
        console.error(e);
      }
    })();
  }, [like]);

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

    let subjectAdded = "";
    if (classSubject !== "history") {
      subjectAdded = userInput.concat(" ", classSubject);
    } else {
      subjectAdded = userInput;
    }

    if (age < 11) {
      subjectAdded = subjectAdded.concat(
        " ",
        "and answer my question at an elementary school level"
      );
    } else if (age > 11 && age < 14) {
      subjectAdded = subjectAdded.concat(
        " ",
        "and answer my question at a middle school level"
      );
    } else if (age > 14 || age === 14) {
      subjectAdded = subjectAdded.concat(
        " ",
        "and answer my question at a high school level"
      );
    }

    console.log(subjectAdded);

    const result = await getChatCompletion(
      conversation.concat([{ role: "user", content: subjectAdded }])
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
    console.log(saveConvo);
  };

  const rowFunc = (e) => {
    let hundred = e.length;
    console.log(hundred);

    if (hundred >= 500) {
      setRows(5);
    } else if (hundred >= 400) {
      setRows(4);
    } else if (hundred >= 300) {
      setRows(3);
    } else if (hundred >= 200) {
      setRows(2);
    } else {
      setRows(1);
    }
    console.log(rows);
  };

  const handleChange = (e) => {
    setUserInput(e);
    rowFunc(e);
  };

  return (
    <div className="GPT">
      {!classSubject && classSubject !== "" && (
        <>
          <h1 className="chatIntro">{`Hi ${name}, my name is Henry`}</h1>
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
        <div className="bigContainer">
          <div className="response">
            <img className="aiPic" src="./little-robot.png"></img>
            <h1>AI Tutor</h1>

            {isLoading ? (
              <div className="loader-container">
                <Dna className="dna" color="#00BFFF" height={100} width={100} />
              </div>
            ) : (
              conversation.slice(1).map((elem, index) => {
                return (
                  <div className="answer-container">
                    {elem.role !== "user" ? (
                      <img
                        onClick={() => handleLike(elem.content)}
                        src="./like.png"
                      ></img>
                    ) : (
                      <img></img>
                    )}
                    <p key={index}>
                      <strong>
                        {elem.role === "user" ? "You: " : "AI Tutor: "}
                      </strong>
                      {elem.content}
                    </p>
                  </div>
                );
              })
            )}
          </div>
          <div className="form" ref={containerRef}>
            <form className="submitForm" onSubmit={handleSubmit}>
              <textarea
                className="input"
                value={userInput}
                onChange={(e) => handleChange(e.target.value)}
                placeholder="How could I help you today?"
                rows={rows}
              />
              <button className="submit" type="submit">
                <img className="forward" src="./forward.png"></img>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
