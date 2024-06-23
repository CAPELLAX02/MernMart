import React, { useState } from 'react';

function PaymentForm() {
  const [paymentDetails, setPaymentDetails] = useState({
    // Kart bilgileri ve diğer ödeme detayları için state
  });

  const handleChange = (e) => {
    setPaymentDetails({ ...paymentDetails, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Backend'e ödeme detaylarını gönder
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Ödeme form alanları */}
      <button type='submit'>Öde</button>
    </form>
  );
}
