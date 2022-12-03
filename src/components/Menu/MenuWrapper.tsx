import styled from 'styled-components';
import { Dialog } from '@mui/material';

const MenuWrapper = styled(Dialog)`
&&&{
	.MuiPaper-root{
		background: transparent;
	}
	.MuiDialog-paper{
		margin:0;
		overflow: hidden;
	}
	.MuiDialog-paperWidthSm{
		max-width: none;
	}
	.MuiPaper-rounded{
		border-radius:0;
	}
    &:focus{
    outline: none;
	}
	backdrop-filter: blur(20px);
}
`;

export default MenuWrapper;
