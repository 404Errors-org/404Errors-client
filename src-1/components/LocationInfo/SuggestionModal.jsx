import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, CloseBtn, HeadWrapper, ModalTitle } from '../LocationModal/locationModal.styled';
import { sendSuggestion } from '../../services/suggestions';

const SuggestionModal = ({ isOpen, onClose, locationId, userToken }) => {
  const [suggestionText, setSuggestionText] = useState('');
  const [suggestionError, setSuggestionError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await sendSuggestion(locationId, suggestionText, userToken);
      setSuggestionError(null);
      setSuggestionText('');
      onClose();
      alert('Пропозицію відправлено!');
    } catch (err) {
      setSuggestionError('Не вдалося відправити пропозицію.');
    }
  };

  return (
    <Modal style={{ zIndex: 1000, maxHeight: 'calc(100vh - 120px)', overflowY: 'auto', position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '80%', maxWidth: '500px' }} isOpen={isOpen}>
      <HeadWrapper>
        <ModalTitle>Пропозиція щодо доступності</ModalTitle>
        <CloseBtn onClick={onClose} />
      </HeadWrapper>

      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Опишіть, що варто змінити..."
          value={suggestionText}
          onChange={(e) => setSuggestionText(e.target.value)}
          style={{ width: '100%', height: '100px', marginBottom: '10px' }}
          required
        />
        {suggestionError && <p style={{ color: 'red' }}>{suggestionError}</p>}
        <button
          type="submit"
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: suggestionText ? '#007bff' : '#7CCDCD',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 600,
            cursor: suggestionText ? 'pointer' : 'not-allowed',
            transition: 'background-color 0.3s ease, transform 0.2s ease',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          }}
          onMouseEnter={(e) => (e.target.style.transform = 'scale(1.05)')}
          onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
          disabled={!suggestionText}
        >
          Відправити
        </button>
      </form>
    </Modal>
  );
};

SuggestionModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  locationId: PropTypes.string.isRequired,
  userToken: PropTypes.string.isRequired,
};

export default SuggestionModal;