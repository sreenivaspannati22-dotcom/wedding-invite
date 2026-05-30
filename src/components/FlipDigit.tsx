import React, { useState, useEffect } from 'react';

type FlipDigitProps = {
  value: string;
};

export default function FlipDigit({ value }: FlipDigitProps) {
  const [current, setCurrent] = useState(value);
  const [previous, setPrevious] = useState(value);

  useEffect(() => {
    if (value !== current) {
      setPrevious(current);
      setCurrent(value);
    }
  }, [value, current]);

  return (
    <div className="relative w-[1ch] h-[1.2em] flex items-center justify-center font-cormorant font-medium text-4xl md:text-6xl text-deep-brown" style={{ perspective: '400px' }}>
      {current !== previous ? (
        <>
          <span
            key={`${previous}-prev`}
            className="absolute inset-0 flex items-center justify-center text-center origin-center"
            style={{ animation: 'flip-out 500ms forwards' }}
          >
            {previous}
          </span>
          <span
            key={`${current}-curr`}
            className="absolute inset-0 flex items-center justify-center text-center origin-center"
            style={{ animation: 'flip-in 500ms forwards' }}
          >
            {current}
          </span>
        </>
      ) : (
        <span className="absolute inset-0 flex items-center justify-center text-center">
          {current}
        </span>
      )}
    </div>
  );
}
