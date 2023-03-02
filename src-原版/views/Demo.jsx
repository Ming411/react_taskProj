import React, {useState} from 'react';

export default function Demo() {
  const [iptvalue, setIptvalue] = useState('');
  return (
    <div>
      <input
        type='text'
        value={iptvalue}
        onChange={ev => {
          let target = ev.target;
          setIptvalue(target.value.trim());
        }}
      />
    </div>
  );
}
