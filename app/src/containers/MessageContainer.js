import { useState } from 'react'

const MessageContainer = ({ account, messages, sendMessage }) => {
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await sendMessage(message);
      setMessage('');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="mt-20 mb-16 clearfix w-full">
        {messages.map(({ message, from }, index) => (
          <div key={index} className="clearfix">
            <div
              className={`bg-gray-300 w-3/4 mx-4 my-2 p-2 rounded-lg clearfix ${ from === account ? 'bg-green-300 float-right' : '' }`}
            >{message}</div>
          </div>
        ))}
      </div>
      
      <form className="flex justify-between bg-green-100" style={{ bottom: 0 }} onSubmit={handleSubmit}>
        <input
          type="text"
          value={message}
          onChange={handleChange}
          placeholder="Type a message..."
          className="flex-grow m-2 py-2 px-4 mr-1 rounded-full border border-gray-300 bg-gray-200 resize-none"
        />
        <button className="m-2" style={{ outline: 'none' }} type="submit">
          <svg
            className="svg-inline--fa text-green-400 fa-paper-plane fa-w-16 w-12 h-12 py-2 mr-2"
            aria-hidden="true"
            focusable="false"
            data-prefix="fas"
            data-icon="paper-plane"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <path
              fill="currentColor"
              d="M476 3.2L12.5 270.6c-18.1 10.4-15.8 35.6 2.2 43.2L121 358.4l287.3-253.2c5.5-4.9 13.3 2.6 8.6 8.3L176 407v80.5c0 23.6 28.5 32.9 42.5 15.8L282 426l124.6 52.2c14.2 6 30.4-2.9 33-18.2l72-432C515 7.8 493.3-6.8 476 3.2z"
            />
          </svg>
        </button>
      </form>
    </div>
  )
}

export default MessageContainer