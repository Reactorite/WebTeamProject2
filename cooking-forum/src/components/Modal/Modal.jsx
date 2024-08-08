import './Modal.css';

// eslint-disable-next-line react/prop-types
export default function Modal({ isOpen, onClose, title, message }) {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className='overlay'>
        <div className="modal-content">
          <h2>{title}</h2>
          <p>{message}</p>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}