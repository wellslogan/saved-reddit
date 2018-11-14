import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type InputProps = {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClear?: () => void;
} & React.InputHTMLAttributes<any>;

type InputComponent = React.StatelessComponent<InputProps>;

export const Input: InputComponent = (props: InputProps) => {
  const { value, onChange, onClear, ...restProps } = props;
  return (
    <div className="input-with-button">
      <button className="link-button" onClick={() => onClear()}>
        <FontAwesomeIcon icon="times" size="lg" />
      </button>
      <input
        className="filter-query"
        value={value}
        onChange={onChange}
        {...restProps}
      />
    </div>
  );
};