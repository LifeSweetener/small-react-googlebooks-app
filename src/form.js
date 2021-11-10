import React from 'react';
import ReactDOM from 'react-dom';
import {
  InputGroup,
  Input,
  InputGroupAddon,
  Button,
  FormGroup,
  Label,
  Spinner
} from 'reactstrap';

const ui_elements = () => {
	return (
		<div>
			<Input placeholder="Book Search" />
			<Button>Search</Button>
		</div>
	);
}

export default ui_elements;