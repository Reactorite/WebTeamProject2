import './Modal.css';

// eslint-disable-next-line react/prop-types
export default function Modal({ isOpen, onClose, title, message }) {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className='overlay'>
        <div className="modal-content">
          <h2 className='modal-text'>{title}</h2>
          <p className='modal-text' id='modal-text-p'>{message}</p>
          <button className='modal-btn' onClick={onClose}><span className='text'>Close</span></button>
        </div>
      </div>
    </div>
  );
}