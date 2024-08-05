import { useState } from 'react';
import Cards from 'react-credit-cards-2';
import 'react-credit-cards-2/dist/es/styles-compiled.css';

const CreditCardForm = ({ onSubmit }) => {
  const [state, setState] = useState({
    number: '',
    name: '',
    expiry: '',
    cvc: '',
    focus: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Kart numarası formatlama
    let formattedValue = value;
    if (name === 'number') {
      formattedValue = value
        .replace(/\s?/g, '')
        .replace(/(\d{4})/g, '$1 ')
        .trim();
    }

    // Expiry date formatlama
    if (name === 'expiry') {
      formattedValue = value
        .replace(/^([1-9]\/|[2-9])$/g, '0$1/')
        .replace(/^(0[1-9]|1[0-2])$/g, '$1/')
        .replace(/^([0-1])([3-9])$/g, '0$1/$2')
        .replace(/^(0?[1-9]|1[0-2])([0-9]{1,4})$/g, '$1/$2')
        .replace(/^(0[1-9]|1[0-2])\/([0-9]{2}).*/g, '$1/$2');
    }

    setState((prev) => ({ ...prev, [name]: formattedValue }));
  };

  const handleInputFocus = (e) => {
    setState((prev) => ({ ...prev, focus: e.target.name }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(state);
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
              placeholder='XXXX XXXX XXXX XXXX'
              value={state.number}
              pattern='\d{4} \d{4} \d{4} \d{4}'
              maxLength={19}
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
              placeholder='KART SAHİBİ'
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
                placeholder='MM/YY'
                pattern='(0[1-9]|1[0-2])\/[0-9]{2}'
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
                maxLength={3}
              />
            </div>
          </div>
          <div className='d-grid'>
            <button type='submit' className='btn btn-primary'>
              Pay $59.99
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreditCardForm;
