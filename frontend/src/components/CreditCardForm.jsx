import { useState } from 'react';
import Cards from 'react-credit-cards-2';
import 'react-credit-cards-2/dist/es/styles-compiled.css';

const CreditCardForm = ({ processPayment }) => {
  const [state, setState] = useState({
    number: '',
    name: '',
    expiry: '',
    cvc: '',
    focus: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setState((prev) => ({ ...prev, [name]: value }));
  };

  const handleInputFocus = (e) => {
    setState((prev) => ({ ...prev, focus: e.target.name }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    processPayment(state);
  };

  return (
    <div>
      <Cards
        number={state.number}
        expiry={state.expiry}
        cvc={state.cvc}
        name={state.name}
        focused={state.focus}
      />
      <div className='mt-3'>
        <form onSubmit={handleSubmit}>
          <div className='mb-3'>
            <input
              type='text'
              name='number'
              className='form-control'
              placeholder='Card Number'
              value={state.number}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              required
            />
          </div>
          <div className='mb-3'>
            <input
              type='text'
              name='name'
              className='form-control'
              placeholder='Name'
              value={state.name}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              required
            />
          </div>
          <div className='row'>
            <div className='col-6 mb-3'>
              <input
                type='text'
                name='expiry'
                className='form-control'
                placeholder='Valid Thru (MM/YY)'
                pattern='\d\d/\d\d'
                value={state.expiry}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                required
              />
            </div>
            <div className='col-6 mb-3'>
              <input
                type='text'
                name='cvc'
                className='form-control'
                placeholder='CVC'
                pattern='\d{3,4}'
                value={state.cvc}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                required
              />
            </div>
          </div>
          <div className='d-grid'>
            <button type='submit' className='btn btn-primary text-white'>
              Confirm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreditCardForm;
